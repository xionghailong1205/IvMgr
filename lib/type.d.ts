export declare const typeMap: {
    readonly A: "Added";
    readonly C: "Changed";
    readonly D: "Deprecated";
    readonly R: "Removed";
    readonly F: "Fixed";
    readonly S: "Security";
};
export type changeTypes = keyof typeof typeMap;
export interface changeEntry {
    type: changeTypes;
    text: string;
}
export interface versionInfo {
    "prvVersion": string;
    "version": string;
    "nextVersion": string;
}
export interface IvMgrConfig {
    upstreamRepo: string;
    upstreamBranch: string;
    localBranch: string;
}
//# sourceMappingURL=type.d.ts.map