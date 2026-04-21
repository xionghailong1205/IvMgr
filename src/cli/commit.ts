import "../utils/zxSetup.js";
import fs from "fs";
import readline from "readline";
import check from "./check.js";
import { hostProjectDir, devLogMdPath, changelogPath, devLogDir, versionJsonPath } from "../services/pathService.js";
import { updatePackageJSON, updateVersionJSON } from "../services/versionService.js";
import { typeMap, type changeEntry, type changeTypes } from "../type.js";
import { consoleVersion } from "./version.js";
import { createBackup, rollbackBackup, clearBackup } from "../services/backUpService.js";
import { $, cd, within } from "zx";
import { getIvMgrCommitMsgOfCurVersion } from "../services/commitService.js";
import { createInitDevLog } from "../services/devLogService.js";

/**
 * 更新 CHANGELOG.md 并归档当前的 devLog.md
 * @param version 版本号
 * @param completedItems 已完成的项目
 * @param content devLog.md 的原始内容
 */
function archiveDevLog(version: string, completedItems: changeEntry[], content: string) {
  // 1. 生成并增加开源标准 Changelog 文件内容
  if (!fs.existsSync(changelogPath)) {
    console.error(`❌ 未找到 CHANGELOG.md 文件: ${changelogPath}`);
  }

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(now.getDate()).padStart(2, "0")}`;

  let newEntry = `## [${version}] - ${dateStr}\n\n`;
  const groupedItems = completedItems.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type]!.push(item.text);
    return acc;
  }, {} as Record<changeTypes, string[]>);

  for (const typeKey of Object.keys(typeMap) as changeTypes[]) {
    if (groupedItems[typeKey] && groupedItems[typeKey].length > 0) {
      newEntry += `### ${typeMap[typeKey]}\n\n`;
      groupedItems[typeKey].forEach((text) => {
        newEntry += `- ${text}\n`;
      });
      newEntry += `\n`;
    }
  }

  let currentChangelog = fs.readFileSync(changelogPath, "utf-8");

  // 按照 Keep a Changelog 规范，新版本应放在前面。我们寻找第一个二级标题 (## ) 并在其前面插入
  // 如果没有二级标题，则直接附加在原有内容的后面
  const firstH2Index = currentChangelog.indexOf("## ");
  if (firstH2Index !== -1) {
    currentChangelog =
      currentChangelog.slice(0, firstH2Index) +
      newEntry +
      currentChangelog.slice(firstH2Index);
  } else {
    // 如果文件中还没有其他版本记录，则追加在末尾
    if (currentChangelog.includes("# Changelog")) {
      currentChangelog = currentChangelog.trim() + `\n\n${newEntry}`;
    } else {
      currentChangelog = `# Changelog\n\n${newEntry}${currentChangelog}`;
    }
  }
  fs.writeFileSync(changelogPath, currentChangelog, "utf-8");
  console.log(`✅ 已更新 CHANGELOG.md 文件记录`);

  // 清空当前的 devLog.md 文件，方便下一个版本重头写起
  fs.writeFileSync(devLogMdPath, "", "utf-8");
  console.log(
    `✅ 已将 devLog 转换为备份文件: ${version}.md，并清空了 devLog.md`,
  );
}

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
export default async function commit() {
  consoleVersion();

  if (!fs.existsSync(versionJsonPath)) {
    console.error(`❌ 未找到 Version.json 文件: ${versionJsonPath}`);
    process.exit(1);
  }

  const versionData = JSON.parse(fs.readFileSync(versionJsonPath, "utf-8"));
  const version = versionData.nextVersion;

  if (!version) {
    console.error("❌ Version.json 中缺少 nextVersion。");
    process.exit(1);
  }

  const { completedItems, inProgressItems, content } = check(true);

  // 打印任务情况
  if (inProgressItems.length > 0) {
    console.log(`\x1b[32m✅ 当前已被标记完成功能:\x1b[0m`);
    completedItems.forEach((item) => console.log(`  🎉. [${typeMap[item.type]}] ${item.text}`));
    console.error(
      `\x1b[31m⛔ 未完成开发任务:\x1b[0m`,
    );
    inProgressItems.forEach((item) => console.error(`  📝. [${typeMap[item.type]}] ${item.text}`));
    console.error(
      `请确认是否所有任务都完成再 commit，或从 devLog 中剔除未完成任务。`,
    );
    process.exit(1);
  }

  if (completedItems.length === 0) {
    console.error(`⛔ devLog 文件中未找到任何已完成的项目。`);
    process.exit(1);
  }

  // 用户确认
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise<string>((resolve) => {
    rl.question(
      `🚀 即将转换成 ${version} 并执行 git 操作，是否确认发布该版本？(y/n): `,
      resolve,
    );
  });
  rl.close();

  if (answer.toLowerCase() !== "y") {
    console.log("⛔ 已取消发布");
    process.exit(0);
  }

  // --- 事务机制：开始备份 ---
  createBackup();

  try {
    // 1. 更新 CHANGELOG.md 并归档当前的 devLog.md
    archiveDevLog(version, completedItems, content);

    // 4. 更新 Version.json 为新版本
    updateVersionJSON();

    // 5. 更新 host 项目的 package.json 版本号
    updatePackageJSON();

    // 2. 执行 Git 操作
    console.log("🔄 正在执行 Git 操作...");

    await within(async () => {
      // $.verbose = false; // 关闭 zx 的命令回显
      cd(hostProjectDir);

      // 在 zx 中如果不加 .pipe(process.stdout)，有时会自动打印，
      // 但对于需要原生终端颜色、交互或明确 stdio: 'inherit' 的场景，可以直接配置挂载：
      const commitMsgOfCurVersion = getIvMgrCommitMsgOfCurVersion(version);

      await $`git add .`.quiet();
      await $`git commit -m ${commitMsgOfCurVersion}`.quiet();

      // 这里添加一个 添加标签的逻辑
      await $`git tag ${version}`.quiet();
    });

    console.log(`🎉 成功提交版本 ${version}`);

    // 3. 重置 devLog.md (新周期的开始)
    createInitDevLog();

    // 清理备份
    // clearBackup(); // 如果你需要的话，可以在这里加回来
  } catch (error: any) {
    console.error(
      "⛔ 发布过程中发生错误:",
      error.message,
    );
    // 触发回退
    await rollbackBackup(version);
    process.exit(1);
  }
}

const isDirectCall = !!process.argv.find((p) => p.includes("commit.js"));
if (isDirectCall) {
  commit();
}
