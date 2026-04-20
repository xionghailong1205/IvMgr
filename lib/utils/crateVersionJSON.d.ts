interface VersionInfo {
    prvVersion: string;
    version: string;
    nextVersion: string;
}
/**
 * 在 devLog 目录下创建 Version.json 文件
 * @param versionInfo 版本信息
 */
export declare function createVersionJSON(versionInfo: VersionInfo): void;
export declare function createEmptyVersionJSON(): void;
export {};
//# sourceMappingURL=crateVersionJSON.d.ts.map