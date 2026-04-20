import { devLogMdPath } from "./pathService.js";
import fs from "fs";
export const tplDevLogContent = `A [x] Added 新添加的功能 已完成。
A [] Added 新添加的功能 进行中。
C [] Changed 对现有功能的变更。
D [] Deprecated 已经不建议使用，即将移除的功能。
R [] Removed 已经移除的功能。
F [] Fixed 对 bug 的修复。
S [] Security 对安全性的改进。`;
export const createInitDevLog = () => {
    console.log(`IvMgr: 已创建新初始化 devLog.md: ${devLogMdPath}`);
    fs.writeFileSync(devLogMdPath, tplDevLogContent, "utf-8");
};
//# sourceMappingURL=devLogService.js.map