import {
  AudioClip,
  Clip,
  WarpMode,
  initialize,
  type ActivationContext,
  type Handle,
} from "@ableton-extensions/sdk";

export function activate(activation: ActivationContext) {
  const api = initialize(activation, "1.0.0");

  api.commands.registerCommand("myCommand", (arg: unknown) => {
    const clip = api.getObjectFromHandle(arg as Handle, Clip);
    if (!(clip instanceof AudioClip)) {
      console.error("The selected clip is not an AudioClip.");
      return;
    }

    clip.warpMode = ((clip.warpMode + 1) % 3) as WarpMode;
  });

  api.ui.registerContextMenuAction(
    "AudioClip",
    "Increment Warp Mode",
    "myCommand",
  );
}
