import path from "path";
import fs from "fs";
import { findUpSync } from "find-up";
import { fileURLToPath } from "url";
/**
 * 查找宿主项目的根目录（包含 package.json 的目录）
 * 从当前工作目录往上查找
 */
function findProjectRoot() {
    const gitDir = findUpSync(".git", {
        type: "directory",
    });
    const packageJsonPath = findUpSync("package.json", {
        type: "file",
    });
    if (gitDir && packageJsonPath) {
        const gitRoot = fs.realpathSync(path.dirname(gitDir));
        const packageRoot = fs.realpathSync(path.dirname(packageJsonPath));
        if (gitRoot === packageRoot) {
            return gitRoot;
        }
        throw new Error(`检测到 .git 与 package.json 不在同一目录：
    .git => ${gitRoot}
    package.json => ${packageRoot}`);
    }
    if (gitDir) {
        return path.dirname(gitDir);
    }
    // 如果找不到，降级回 process.cwd()
    // 我觉得这种情况 
    throw new Error("为找到宿主项目中的 .git 目录，请确保在正确的项目目录中执行 IvMgr。");
}
/**
 * 宿主项目根目录
 * 避免用户在子目录中执行 CLI 导致路径错误
 */
export const hostProjectDir = findProjectRoot();
/**
 * devLog 目录路径
 */
export const devLogDir = path.join(hostProjectDir, "devLog");
/**
 * CHANGELOG.md 文件路径
 */
export const changelogPath = path.join(devLogDir, "CHANGELOG.md");
/**
 * 宿主项目的 Version.json 文件路径
 */
export const versionJsonPath = path.resolve(hostProjectDir, "devLog", "Version.json");
/**
 * devLog.md 文件路径 (草稿文件)
 */
export const devLogMdPath = path.join(devLogDir, "devLog.md");
/**
 * devLog.tempalte.md 文件路径 (草稿文件)
 */
export const tplDevLogMdPath = path.join(devLogDir, "devLog.tpl.md");
/**
 * 备份目录路径
 */
export const backupDirPath = path.join(hostProjectDir, ".IvMgr", "backups");
/**
 * 配置文件路径
 */
export const configFilePath = path.join(hostProjectDir, ".IvMgr", "IvMgrConfig.json");
/**
 * package.json 文件路径
 */
export const hostPkgPath = path.join(hostProjectDir, "package.json");
//# sourceMappingURL=pathService.js.map