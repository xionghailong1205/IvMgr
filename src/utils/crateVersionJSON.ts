import fs from "fs";
import { versionJsonPath } from "../services/pathService.js";

interface VersionInfo {
    prvVersion: string;
    version: string;
    nextVersion: string;
}

/**
 * 在 devLog 目录下创建 Version.json 文件
 * @param versionInfo 版本信息
 */
export function createVersionJSON(versionInfo: VersionInfo) {
    try {
        fs.writeFileSync(
            versionJsonPath,
            JSON.stringify(versionInfo, null, 2) + "\n",
            "utf-8"
        );
        console.log(`IvMgr: 已创建 Version.json: ${versionJsonPath}`);
    } catch (error) {
        console.error("IvMgr: 创建 Version.json 失败", error);
        throw error;
    }
}

export function createEmptyVersionJSON() {
    const emptyVersionInfo: VersionInfo = {
        prvVersion: "",
        version: "",
        nextVersion: "0.1.0",
    };

    createVersionJSON(emptyVersionInfo);
}