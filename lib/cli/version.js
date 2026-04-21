import "../utils/zxSetup.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// 读取 IvMgr 自身的 Version.json（位于包根目录下的 devLog/）
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ivMgrVersionJsonPath = path.resolve(__dirname, "../../devLog/Version.json");
function getCurVersionOfIvMgr() {
    const versionInfo = JSON.parse(fs.readFileSync(ivMgrVersionJsonPath, "utf-8"));
    return versionInfo.version;
}
export function consoleVersion() {
    console.log(`IvMgr-version: ${getCurVersionOfIvMgr()}`);
}
const isDirectCall = !!process.argv.find((p) => p.includes("version.js"));
if (isDirectCall) {
    consoleVersion();
}
//# sourceMappingURL=version.js.map