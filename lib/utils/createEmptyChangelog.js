import fs from "fs";
import { changelogPath } from "../services/pathService.js";
export const createEmptyChangelog = () => {
    const initialChangelog = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`;
    fs.writeFileSync(changelogPath, initialChangelog, "utf-8");
    console.log(`IvMgr: 已创建 CHANGELOG: ${changelogPath}`);
};
//# sourceMappingURL=createEmptyChangelog.js.map