import { initialize, type ActivationContext } from "@ableton-extensions/sdk";

export function activate(context: ActivationContext) {
  const api = initialize(context, "1.0.0");

  api.commands.registerCommand("myClipSlotAction", () => {
    console.log("You right-clicked on a ClipSlot!");
  });

  api.ui.registerContextMenuAction(
    "ClipSlot",
    "Process this ClipSlot",
    "myClipSlotAction",
  );
}
