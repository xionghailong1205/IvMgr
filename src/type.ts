export const typeMap = {
    A: "Added",
    C: "Changed",
    D: "Deprecated",
    R: "Removed",
    F: "Fixed",
    S: "Security"
} as const;

export type changeTypes = keyof typeof typeMap;

export interface changeEntry {
    type: changeTypes;
    text: string;
}

export interface versionInfo {
    "prvVersion": string,
    "version": string,
    "nextVersion": string
}

// 配置文件的接口
export interface IvMgrConfig {
    // 远程仓库地址 eg: "origin" 
    upstreamRepo: string;
    // 远程分支名称 eg: "master" 或 "main"
    upstreamBranch: string;
    // 本地分支 主分支 eg: "master" 或 "main" 
    // 这么做的原因是能够让用户在其他分支中开发功能
    // 我们拒绝用户在此 分支 之外的分支使用 IvMgr 的版本提交功能
    localBranch: string;
}