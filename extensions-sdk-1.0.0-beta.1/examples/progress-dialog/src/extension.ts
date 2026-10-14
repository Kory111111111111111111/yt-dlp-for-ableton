import { initialize, type ActivationContext } from "@ableton-extensions/sdk";

const delay = (timeout: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, timeout));

export function activate(activation: ActivationContext) {
  const context = initialize(activation, "1.0.0");

  context.commands.registerCommand("showProgressDialog", () => {
    void context.ui.withinProgressDialog(
      "Doing some long running task",
      {},
      async (update, signal) => {
        console.log(
          "Progress Dialog is now open. Let's start our long running task.",
        );
        await delay(2000);

        let i = 0;
        try {
          while (i < 100) {
            await delay(100);
            await update("If you want, you can click cancel.", i);
            ++i;
            signal.throwIfAborted();
          }
        } catch {
          console.warn(`Task was likely cancelled at ${i}%`);
          return;
        }

        await update("Cleaning up", undefined);
        await delay(2000);
      },
    );
  });

  context.ui.registerContextMenuAction(
    "AudioTrack",
    "Start long task",
    "showProgressDialog",
  );
}
