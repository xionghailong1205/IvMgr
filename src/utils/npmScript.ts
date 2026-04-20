import { hostPkgPath } from "../services/pathService.js";
import fs from "fs";

// 需要注册的 NPM 脚本列表
export const scriptsToAdd = {
    "commit": "node node_modules/ivmgr/lib/cli/commit.js",
    "push": "node node_modules/ivmgr/lib/cli/push.js",
    "reset": "node node_modules/ivmgr/lib/cli/reset.js",
};

export const createNpmScripts = () => {
    console.log("IvMgr: 正在检查并添加 NPM 脚本...");

    let abnormalEntry = [];

    const pkg = JSON.parse(fs.readFileSync(hostPkgPath, "utf-8"));

    for (const [key, value] of Object.entries(scriptsToAdd)) {
        if (!pkg.scripts[key]) {
            pkg.scripts[key] = value;
        } else {
            abnormalEntry.push(key);
        }
    }

    if (abnormalEntry.length > 0) {
        console.warn(`IvMgr: 警告！以下 NPM 脚本已存在，跳过添加：${abnormalEntry.join(", ")}`);
        console.log("建议你手动处理冲突情况,这是我们提供的所有脚本: \n", JSON.stringify(scriptsToAdd, null, 2));
    } else {
        console.log("IvMgr: NPM 脚本已成功添加到 package.json！");
    }
}