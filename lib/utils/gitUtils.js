import { $ } from "zx";
export const getNameOfCurBranch = async () => {
    const { stdout } = await $ `git branch --show-current`;
    return stdout.trim();
};
//# sourceMappingURL=gitUtils.js.map