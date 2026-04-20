import pc from "picocolors";
export function logWarn(msg) {
    console.log(pc.yellow(msg));
}
export function logError(msg) {
    console.log(pc.red(msg));
}
export function logSuccess(msg) {
    console.log(pc.green(msg));
}
//# sourceMappingURL=logHelper.js.map