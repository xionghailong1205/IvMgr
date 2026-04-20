import fs from "fs";
import { versionJsonPath } from "./pathService.js";
import semver from "semver";
/**
 * 更新 `Version.json` 中的版本字段：
 * - `prvVersion` 设置为旧的 `version`
 * - `version` 设置为旧的 `nextVersion`
 * - `nextVersion` 在 `x.y.z` 格式下自动将最后一位递增
 *
 * 若文件不存在则返回 `null`；否则返回更新后的当前版本号（即旧的 `nextVersion`）。
 *
 * @returns 更新后的 `version` 字符串，或文件不存在时返回 `null`
 */
export function updateVersionJSON() {
    if (!fs.existsSync(versionJsonPath)) {
        console.error(`❌ 未找到 Version.json 文件: ${versionJsonPath}`);
        return null;
    }
    const versionData = JSON.parse(fs.readFileSync(versionJsonPath, "utf-8"));
    const newVersion = versionData.nextVersion;
    const newNextVersion = semver.inc(newVersion, "patch");
    if (newNextVersion) {
        versionData.prvVersion = versionData.version;
        versionData.version = newVersion;
        versionData.nextVersion = newNextVersion;
        fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2), "utf-8");
    }
    else {
        console.error(`❌ 版本号格式不合法: ${newVersion}`);
        return null;
    }
    return newVersion;
}
/**
 * 同步 `package.json` 的 `version` 字段。
 * ⚠️ 该函数必须在 `updateVersionJSON` 执行后调用。
 *
 * @returns 更新后的 `version` 字符串，或失败时返回 `null`
 */
export function updatePackageJSON() {
    const packageJsonPath = `${process.cwd()}/package.json`;
    if (!fs.existsSync(packageJsonPath)) {
        console.error(`❌ 未找到 package.json 文件: ${packageJsonPath}`);
        return null;
    }
    if (!fs.existsSync(versionJsonPath)) {
        console.error(`❌ 未找到 Version.json 文件: ${versionJsonPath}`);
        return null;
    }
    const versionData = JSON.parse(fs.readFileSync(versionJsonPath, "utf-8"));
    const packageData = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    if (!semver.valid(versionData.version)) {
        console.error(`❌ Version.json 中 version 不合法: ${versionData.version}`);
        return null;
    }
    packageData.version = versionData.version;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageData, null, 2), "utf-8");
    return packageData.version;
}
//# sourceMappingURL=versionService.js.map