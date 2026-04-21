import "../utils/zxSetup.js";
import fs from "fs";
import path from "path";
import { select } from "@inquirer/prompts";
import pc from "picocolors";
import { devLogDir, changelogPath, hostProjectDir, versionJsonPath, devLogMdPath, tplDevLogMdPath, configFilePath } from "../services/pathService.js";
import { createEmptyChangelog } from "../utils/createEmptyChangelog.js";
import { createEmptyVersionJSON } from "../utils/crateVersionJSON.js";
import { createInitConfigJson } from "../services/configService.js";
import { createNpmScripts, scriptsToAdd } from "../utils/npmScript.js";
import { createInitDevLog, tplDevLogContent } from "../services/devLogService.js";


const createTplDevLog = () => {
  console.log(`IvMgr: 已经创建 模版 devLog 文件: ${tplDevLogMdPath}`);
  fs.writeFileSync(tplDevLogMdPath, tplDevLogContent, "utf-8");
}

export const initDevLogDir = () => {
  fs.mkdirSync(devLogDir, { recursive: true });
  console.log(`IvMgr: 已创建 devLog 文件夹: ${devLogDir}`);
  createEmptyChangelog();
  createEmptyVersionJSON();
  createInitDevLog();
  createTplDevLog();
  createInitConfigJson();
}

export default async function init() {
  // 因为是通过 CLI 执行，进程当前工作目录即为宿主项目根目录
  const hostPkgPath = path.join(hostProjectDir, "package.json");

  if (!fs.existsSync(hostPkgPath)) {
    console.error(
      "未找到 package.json，请在项目根目录（运行环境中）执行此初始化命令。",
    );
    process.exit(1);
  }

  if (fs.existsSync(devLogDir) && fs.statSync(devLogDir).isDirectory()) {
    const choice = await select({
      message: `\n⚠️ 检测到宿主系统中已经存在 changeLog 文件夹: ${devLogDir}\n请选择应对策略：`,
      choices: [
        { name: pc.red("覆盖 (Overwrite) - 会删除原有文件并重建"), value: "1" },
        { name: pc.yellow("无视内部文件 (Ignore) - 保留原文件不做处理"), value: "3" },
        { name: pc.gray("停止安装 (Stop) - 中断后续操作"), value: "2" },
      ],
    });

    if (choice === "1") {
      console.log("用户选择: 覆盖文件夹");
      fs.rmSync(devLogDir, { recursive: true, force: true });
      initDevLogDir();
    } else if (choice === "2") {
      console.log("用户选择: 停止安装");
      process.exit(1);
    } else if (choice === "3") {
      console.log("用户选择: 无视内部文件");

      // 检查并创建 CHANGELOG.md (开源规范)
      if (!fs.existsSync(changelogPath)) {
        createEmptyChangelog();
      }
      if (!fs.existsSync(versionJsonPath)) {
        createEmptyVersionJSON();
      }
      // 如果 devLog.md 文件不存在 则创建
      if (!fs.existsSync(devLogMdPath)) {
        createInitDevLog();
      }
      // 如果 tplDevLog.md 文件不存在 则创建
      if (!fs.existsSync(tplDevLogMdPath)) {
        createTplDevLog();
      }
      // 如果 IvMgrConfig.jsonc 文件不存在 则创建
      if (!fs.existsSync(configFilePath)) {
        createInitConfigJson();
      }
    }

  } else {
    // 如果不存在 changeLog 文件夹，则创建它
    initDevLogDir();
  }

  // 创建 NPM 脚本
  createNpmScripts();

  process.exit(0);
}

init();
