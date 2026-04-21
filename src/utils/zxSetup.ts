import { $, quote } from "zx";

// Windows 下当 zx 检测到 PowerShell/cmd 作为 shell 时，不会自动设置 quote 函数，
// 任何 `$\`...\`` 调用都会抛出 "No quote function is defined"。
// 这里在程序入口统一兜底：优先使用 bash（Git for Windows 自带），否则退回 zx 的 POSIX quote。
if (process.platform === "win32") {
    try {
        $.shell = "bash";
        $.prefix = "set -euo pipefail;";
    } catch {
        // ignore
    }
    if (typeof $.quote !== "function") {
        $.quote = quote;
    }
}

export { };
