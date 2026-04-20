import { $ } from "zx";

export const getNameOfCurBranch = async (): Promise<string> => {
    const { stdout } = await $`git branch --show-current`;
    return stdout.trim();
};