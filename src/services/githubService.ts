import path from "path";
import fs from "fs";
import { changelogPath } from "./pathService.js";

export function getRepositoryInfo(): { url: string; owner: string; repo: string } {
    const packageJsonPath = path.join(process.cwd(), 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
        throw new Error('当前项目的 package.json 文件缺失了,请检查运行环境.');
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const repository = packageJson.repository;

    if (!repository || !repository.url) {
        throw new Error('当前项目的 package.json 文件中缺少远程仓库 URL repository URL,请检查是否设置远程仓库.');
    }

    const url = repository.url.replace(/^git\+/, '').replace(/\.git$/, '');
    const match = url.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/);

    if (!match) {
        throw new Error('当前项目的 package.json 文件中的远程仓库 URL 无效,请检查是否设置正确的 GitHub 仓库 URL.');
    }

    return {
        url,
        owner: match[1],
        repo: match[2]
    };
}

/**
 * 从 CHANGELOG.md 中提取所有版本号，生成标准的版本比较链接，
 * 并写入 CHANGELOG.md 底部。
 *
 * 格式示例：
 * [0.1.1]: https://github.com/owner/repo/compare/0.1.0...0.1.1
 * [0.1.0]: https://github.com/owner/repo/releases/tag/0.1.0
 */
export function createCompareLinks(): string {
    const { url } = getRepositoryInfo();

    if (!fs.existsSync(changelogPath)) {
        throw new Error(`CHANGELOG.md 文件不存在: ${changelogPath}`);
    }

    const changelog = fs.readFileSync(changelogPath, "utf-8");
    const versionRegex = /^## \[(\d+\.\d+\.\d+(?:-[\w.]+)?)\]/gm;
    const versions: string[] = [];
    let match;

    while ((match = versionRegex.exec(changelog)) !== null) {
        versions.push(match[1]!);
    }

    if (versions.length === 0) {
        return "";
    }

    // versions 按出现顺序排列（新版本在前）
    const lines: string[] = [];

    for (let i = 0; i < versions.length - 1; i++) {
        const current = versions[i];
        const previous = versions[i + 1];
        lines.push(`[${current}]: ${url}/compare/${previous}...${current}`);
    }

    // 最早的版本使用 releases/tag 链接
    const oldest = versions[versions.length - 1];
    lines.push(`[${oldest}]: ${url}/releases/tag/${oldest}`);

    const linksBlock = lines.join("\n") + "\n";

    // 移除已有的链接定义块，然后追加新的
    const cleaned = changelog.replace(/(\n\[[\d.]+[^\]]*\]:.*)+\s*$/m, "");
    const updated = cleaned.trimEnd() + "\n\n" + linksBlock;

    fs.writeFileSync(changelogPath, updated, "utf-8");

    return linksBlock;
}
