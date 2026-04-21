import { $, quote, quotePowerShell } from "zx";
import { execSync } from "child_process";
if (process.platform === "win32") {
    // 1. 真实探测环境中是否存在 bash
    let hasBash = false;
    try {
        // Windows 下使用 where 命令探测，stdio: "ignore" 避免输出脏乱终端
        execSync("where bash", { stdio: "ignore" });
        hasBash = true;
    }
    catch {
        hasBash = false;
    }
    if (hasBash) {
        // 策略 A：成功找到 bash，完美模拟 Linux 环境
        $.shell = "bash";
        $.prefix = "set -euo pipefail;";
        // bash 完美兼容 POSIX quote
        if (typeof $.quote !== "function") {
            $.quote = quote;
        }
    }
    else {
        // 策略 B：没有 bash，优雅降级到 PowerShell
        $.shell = "powershell.exe";
        $.quote = quotePowerShell;
    }
}
export {};
//# sourceMappingURL=zxSetup.js.map