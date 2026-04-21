import "../utils/zxSetup.js";
import { confirm } from "@inquirer/prompts";
import { $, cd, within } from "zx";
import { hostProjectDir } from "../services/pathService.js";
import { consoleVersion } from "./version.js";
import { getIvMgrConfig } from "../services/configService.js";
import { getNameOfCurBranch } from "../utils/gitUtils.js";
const args = process.argv.slice(2);
const isDirectCall = !!process.argv.find((p) => p.includes("push.js"));
const isForce = args.includes('--force') || args.includes('-f');
const isVerbose = args.includes('--verbose') || args.includes('-v');
if (isDirectCall) {
    consoleVersion();
    if (isForce) {
        console.log('使用 Force push 模式: 这样会覆盖掉远程仓库的历史记录，请确保你知道自己在做什么！');
        const confirmed = await confirm({
            message: '你正在执行 force push，确认继续吗？',
            default: false,
        });
        if (!confirmed) {
            if (isVerbose)
                console.log('用户取消了 force push。');
            process.exit(0);
        }
        // 处理 force 逻辑
        await within(async () => {
            cd(hostProjectDir);
            const config = getIvMgrConfig();
            const { upstreamRepo, upstreamBranch, localBranch } = config;
            const curBranch = await getNameOfCurBranch();
            if (curBranch !== localBranch) {
                throw new Error(`当前分支是 ${curBranch}，但配置文件中 localBranch 是 ${localBranch}。请切换到正确的分支后再执行 push。`);
            }
            try {
                const forcePushCommand = `git push -u ${upstreamRepo} ${localBranch}:${upstreamBranch} --force`;
                await $ `git push -u ${upstreamRepo} ${localBranch}:${upstreamBranch} --force`;
                console.log(`🚚 执行命令: ${forcePushCommand}`);
                console.log('✅ 成功推送到远程仓库！');
            }
            catch (error) {
                console.log('⛔ 推送失败！');
                if (error instanceof Error) {
                    console.log(error.message);
                }
                else {
                    console.log(String(error));
                }
            }
        });
    }
    else {
        // 正常执行 push 逻辑
        await within(async () => {
            cd(hostProjectDir);
            const config = getIvMgrConfig();
            const { upstreamRepo, upstreamBranch, localBranch } = config;
            const curBranch = await getNameOfCurBranch();
            if (curBranch !== localBranch) {
                throw new Error(`当前分支是 ${curBranch}，但配置文件中 localBranch 是 ${localBranch}。请切换到正确的分支后再执行 push。`);
            }
            try {
                await $ `git push -u ${upstreamRepo} ${localBranch}:${upstreamBranch}`;
                console.log("🚚 执行 git push ...");
                console.log('✅ 成功推送到远程仓库！');
            }
            catch (error) {
                console.log('⛔ 推送失败！');
                if (error instanceof Error) {
                    console.log(error.message);
                }
                else {
                    console.log(String(error));
                }
            }
        });
    }
}
//# sourceMappingURL=push.js.map