import { rollbackBackup } from "../services/backUpService.js";
import type { versionInfo } from "../type.js";
import { versionJsonPath } from "../services/pathService.js";
import { consoleVersion } from "./version.js";
import fs from "fs";

const isDirectCall = !!process.argv.find((p) => p.includes('reset'));

if (isDirectCall) {
    consoleVersion();
    const versionInfo: versionInfo = JSON.parse(fs.readFileSync(versionJsonPath, "utf-8"));
    rollbackBackup(versionInfo.version);
}