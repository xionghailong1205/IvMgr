import pc from "picocolors";

export function logWarn(msg: string) {
  console.log(pc.yellow(msg));
}

export function logError(msg: string) {
  console.log(pc.red(msg));
}

export function logSuccess(msg: string) {
  console.log(pc.green(msg));
}
