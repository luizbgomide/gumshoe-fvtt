import { assertGame } from "../functions";

export const registerDevModeDebugFlag = () => {
  Hooks.on("devModeReady", () => {
    assertGame(game);
    (game.modules.get("_dev-mode") as any)?.api.registerPackageDebugFlag(
      "investigator",
      "boolean",
      {
        default: false,
      },
    );
  });
};
