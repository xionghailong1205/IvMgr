#!/usr/bin/env node

import { execFileSync } from "child_process";
import path from "path";
import columnify from "columnify";

const command = process.argv[2];
const libDir = path.resolve(import.meta.dirname, "..", "lib", "cli");

const commandMeta = {
  version: {
    help: "查看当前项目版本信息",
    entry: "version.js",
  },
  init: {
    help: "初始化 project (注入 scripts 并检测 devLog, 创建 CHANGELOG)",
    entry: "init.js",
  },
  check: {
    help: "检查项目 devLog/devLog.md 语法及进度",
    entry: "check.js",
  },
  commit: {
    help: "读取 devLog，更新 CHANGELOG 并使用指定版本号自动提交代码",
    usage: "commit",
    entry: "commit.js",
  },
  reset: {
    help: "读取 devLog，更新 CHANGELOG 并使用指定版本号自动提交代码",
    usage: "reset",
    entry: "reset.js",
  },
  push: {
    help: "读取 devLog，更新 CHANGELOG 并使用指定版本号自动提交代码",
    usage: "push",
    entry: "push.js",
  },
};

const helpData = Object.fromEntries(
  Object.entries(commandMeta).map(([name, config]) => [
    config.usage ?? name,
    config.help,
  ]),
);

const commands = Object.fromEntries(
  Object.entries(commandMeta).map(([name, config]) => [
    name,
    path.join(libDir, config.entry),
  ]),
);

if (!command || !commands[command]) {
  console.log("用法: IvMgr <command>\n");
  console.log("可用命令:");

  console.log(
    columnify(helpData, {
      showHeaders: false,
      columnSplitter: "   ",
      config: {
        key: { minWidth: 15 },
      },
    }),
  );
  process.exit(1);
}

const args = [
  "--experimental-vm-modules",
  commands[command],
  ...process.argv.slice(3),
];
try {
  execFileSync("node", args, { stdio: "inherit", cwd: process.cwd() });
} catch {
  process.exit(1);
}
