export declare function getRepositoryInfo(): {
    url: string;
    owner: string;
    repo: string;
};
/**
 * 从 CHANGELOG.md 中提取所有版本号，生成标准的版本比较链接，
 * 并写入 CHANGELOG.md 底部。
 *
 * 格式示例：
 * [0.1.1]: https://github.com/owner/repo/compare/0.1.0...0.1.1
 * [0.1.0]: https://github.com/owner/repo/releases/tag/0.1.0
 */
export declare function createCompareLinks(): string;
//# sourceMappingURL=githubService.d.ts.map