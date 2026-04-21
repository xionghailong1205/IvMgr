import "../utils/zxSetup.js";
import fs from "fs";
import { devLogMdPath } from "../services/pathService.js";
import { typeMap } from "../type.js";
export default function check(isSilent = false) {
    const devLogPath = devLogMdPath;
    if (!fs.existsSync(devLogPath)) {
        console.error(`❌ 未找到开发日志文件: ${devLogPath}`);
        console.error(`尝试运行 "npx IvMgr create" 创建模板`);
        process.exit(1);
    }
    const content = fs.readFileSync(devLogPath, "utf-8");
    // 添加逻辑 忽略掉 注释行
    const filteredContent = content.replace(/<!--[\s\S]*?-->/g, "");
    const lines = filteredContent
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
    const completedItems = [];
    const inProgressItems = [];
    let hasSyntaxError = false;
    lines.forEach((line, i) => {
        const completedMatch = line.match(/^([ACDRFS]) \[x\]\s+(.*)$/i);
        const inProgressMatch = line.match(/^([ACDRFS]) \[\]\s+(.*)$/i);
        if (completedMatch && completedMatch[1] && completedMatch[2]) {
            completedItems.push({ type: completedMatch[1].toUpperCase(), text: completedMatch[2] });
        }
        else if (inProgressMatch && inProgressMatch[1] && inProgressMatch[2]) {
            inProgressItems.push({ type: inProgressMatch[1].toUpperCase(), text: inProgressMatch[2] });
        }
        else {
            console.error(`🚨 第 ${i + 1} 行存在语法错误: ${line}`);
            hasSyntaxError = true;
        }
    });
    if (hasSyntaxError) {
        console.error(`\n⚠️ 提示：devLog 的每一行必须以 "<类别> [x] " (代表完成) 或 "<类别> [] " (代表开发中) 开头。类别首字母支持：A(Added), C(Changed), D(Deprecated), R(Removed), F(Fixed), S(Security)。例如：A [x] 新增功能`);
        process.exit(1);
    }
    if (!isSilent) {
        // 没有语法错误时打印结果
        console.log(`✅ devLog 语法检查通过\n`);
        if (completedItems.length > 0) {
            console.log(`✅ 已完成的功能 (${completedItems.length}):`);
            completedItems.forEach((item, i) => console.log(`  🎉 ${i + 1}. [${typeMap[item.type]}] ${item.text}`));
            console.log();
        }
        else {
            console.log(`⛔ 未找到已完成的功能。\n`);
        }
        if (inProgressItems.length > 0) {
            console.log(`⏳ 开发中的功能 (${inProgressItems.length}):`);
            inProgressItems.forEach((item, i) => console.log(`  📝 ${i + 1}. [${typeMap[item.type]}] ${item.text}`));
            console.log();
        }
    }
    return { completedItems, inProgressItems, content };
}
const isDirectCall = !!process.argv.find((p) => p.includes("check.js"));
if (isDirectCall) {
    check();
}
//# sourceMappingURL=check.js.map