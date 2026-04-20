/**
 * 执行一次受保护的版本发布提交流程。
 *
 * 该函数会按顺序完成以下工作：
 * 1. 校验 `Version.json` 是否存在且包含 `nextVersion`；
 * 2. 检查开发任务状态，仅允许在全部任务完成且存在已完成项时继续；
 * 3. 通过命令行交互确认是否发布目标版本；
 * 4. 在执行前备份 `CHANGELOG.md`、`devLog.md` 与 `Version.json` 内容；
 * 5. 归档 `devLog` 到 `CHANGELOG`、更新版本文件与宿主项目 `package.json`；
 * 6. 执行 Git 操作（`git add`、`git commit`、`git tag`）；
 * 7. 发布成功后重置 `devLog.md` 进入下一开发周期。
 *
 * 若任一步骤失败，将触发回滚以恢复备份文件，并以非零退出码结束进程。
 * 若用户取消确认，则直接退出且不执行发布。
 *
 * @async
 * @function commit
 * @returns {Promise<void>} 无返回值；流程通过日志与进程退出码反馈结果。
 */
export default function commit(): Promise<void>;
//# sourceMappingURL=commit.d.ts.map