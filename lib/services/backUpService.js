import fs from "fs";
import path from "path";
import { $, cd, within } from "zx";
import { hostProjectDir, changelogPath, devLogMdPath, versionJsonPath, backupDirPath } from "./pathService.js";
import { getIvMgrCommitMsgOfCurVersion } from "../services/commitService.js";
export function createBackup() {
    if (!fs.existsSync(backupDirPath)) {
        fs.mkdirSync(backupDirPath, { recursive: true });
    }
    if (fs.existsSync(changelogPath)) {
        fs.copyFileSync(changelogPath, path.join(backupDirPath, "CHANGELOG.md"));
    }
    if (fs.existsSync(devLogMdPath)) {
        fs.copyFileSync(devLogMdPath, path.join(backupDirPath, "devLog.md"));
    }
    if (fs.existsSync(versionJsonPath)) {
        fs.copyFileSync(versionJsonPath, path.join(backupDirPath, "Version.json"));
    }
}
export async function rollbackBackup(version) {
    try {
        if (fs.existsSync(path.join(backupDirPath, "CHANGELOG.md"))) {
            fs.copyFileSync(path.join(backupDirPath, "CHANGELOG.md"), changelogPath);
        }
        if (fs.existsSync(path.join(backupDirPath, "devLog.md"))) {
            fs.copyFileSync(path.join(backupDirPath, "devLog.md"), devLogMdPath);
        }
        if (fs.existsSync(path.join(backupDirPath, "Version.json"))) {
            fs.copyFileSync(path.join(backupDirPath, "Version.json"), versionJsonPath);
        }
        try {
            // 判断 git commit 是否已经执行
            // 使用 within 局部改变配置，不污染 Node CWD
            await within(async () => {
                cd(hostProjectDir);
                const { stdout } = await $ `git log -1 --pretty=%B`;
                const lastCommitMsg = stdout.trim();
                const commitMsgOfCurVersion = getIvMgrCommitMsgOfCurVersion(version);
                if (lastCommitMsg.includes(commitMsgOfCurVersion)) {
                    try {
                        await $ `git reset --soft HEAD~1`.quiet();
                    }
                    catch (resetErr) {
                        // zx 的异常对象中包含了 stderr 和 stdout
                        if (resetErr.stderr && resetErr.stderr.includes("ambiguous argument 'HEAD~1'")) {
                            console.log("⚠️ 检测到当前仓库只有一次提交，正在撤销初始提交...");
                        }
                        else if (resetErr.stderr) {
                            console.error(`⚠️ 执行 Git 回退时发生意外错误: ${resetErr.stderr.trim()}`);
                        }
                        // 如果因为是初始提交导致找不到 HEAD~1，则通过删除 HEAD 引用来撤销
                        await $ `git update-ref -d HEAD`.quiet();
                    }
                    try {
                        await $ `git tag -d ${version}`;
                    }
                    catch (tagErr) { }
                    console.log("✅ Git 已回退（保留工作区改动）");
                }
            });
        }
        catch (e) {
            // 可能还没有 commit 或者发生错误
            console.debug("回退失败!");
        }
        console.log("✅ 所有本地文件已还原。");
    }
    catch (error) {
        console.error("❌ 回退期间发生错误:", error.message);
    }
}
export function clearBackup() {
    if (fs.existsSync(backupDirPath)) {
        fs.rmSync(backupDirPath, { recursive: true, force: true });
    }
}
//# sourceMappingURL=backUpService.js.map