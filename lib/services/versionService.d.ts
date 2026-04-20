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
export declare function updateVersionJSON(): string | null;
/**
 * 同步 `package.json` 的 `version` 字段。
 * ⚠️ 该函数必须在 `updateVersionJSON` 执行后调用。
 *
 * @returns 更新后的 `version` 字符串，或失败时返回 `null`
 */
export declare function updatePackageJSON(): string | null;
//# sourceMappingURL=versionService.d.ts.map