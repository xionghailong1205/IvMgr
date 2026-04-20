import { versionJsonPath } from "../services/pathService.js";
import fs from "fs";
function getCurVersionFromVersionJSON() {
    const versionInfo = JSON.parse(fs.readFileSync(versionJsonPath, "utf-8"));
    return versionInfo.version;
}
export function consoleVersion() {
    console.log(`IvMgr-version: ${getCurVersionFromVersionJSON()}`);
}
const isDirectCall = !!process.argv.find((p) => p.includes("version.mjs"));
if (isDirectCall) {
    consoleVersion();
}
//# sourceMappingURL=version.js.map