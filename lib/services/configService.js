import { configFilePath } from "./pathService.js";
import fs from "fs";
import path from "path";
export function createInitConfigJson() {
    const initConfigJsonContent = `{
    // 远程仓库地址 eg: "origin"
    "upstreamRepo": "origin",
    // 远程分支名称 eg: "master" 或 "main"
    "upstreamBranch": "main",
    // 本地分支 主分支 eg: "master" 或 "main"
    // 这么做的原因是能够让用户在其他分支中开发功能
    // 我们拒绝用户在此 分支 之外的分支使用 IvMgr 的版本提交功能
    "localBranch": "main"
}`;
    console.log(`IvMgr: 已经创建 IvMgr配置文件: ${configFilePath}`);
    fs.mkdirSync(path.dirname(configFilePath), { recursive: true });
    fs.writeFileSync(configFilePath, initConfigJsonContent, "utf-8");
}
export function getIvMgrConfig() {
    if (!fs.existsSync(configFilePath)) {
        console.log(`IvMgr: 配置文件不存在，正在创建默认配置文件...`);
        createInitConfigJson();
    }
    const configContent = fs.readFileSync(configFilePath, "utf-8");
    // 去除 JSONC 中的注释（// 和 /* */）
    const jsonContent = configContent
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "");
    try {
        const config = JSON.parse(jsonContent);
        return config;
    }
    catch (error) {
        console.error(`IvMgr: 解析配置文件失败，请检查 ${configFilePath} 的内容是否正确的 JSON 格式。`);
        throw error;
    }
}
//# sourceMappingURL=configService.js.map