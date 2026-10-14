import type { Handle } from "@ableton-extensions/sdk";
import {
  initialize,
  Clip,
  type ActivationContext,
  AudioClip,
  MidiClip,
} from "@ableton-extensions/sdk";

// Import the HTML interface for the modal dialog. esbuild will inline this.
import modalInterface from "./interface.html";

export function activate(activation: ActivationContext) {
  const context = initialize(activation, "1.0.0");

  context.commands.registerCommand("example.rename", (args: unknown) =>
    (async (handle: Handle) => {
      const clip = context.getObjectFromHandle(handle, Clip); // use Clip because we support both AudioClip and MidiClip

      // pass HTML content as a data URL to avoid needing to host it somewhere
      // the resolved value is the string passed to `postMessage` in the dialog. We expect it to be a JSON string with a "name" property.
      const result = await context.ui.showModalDialog(`data:text/html,${encodeURIComponent(modalInterface)}`, 360, 240);
      const append = clip instanceof AudioClip ? " (Audio)" : clip instanceof MidiClip ? " (MIDI)" : "";
      clip.name = JSON.parse(result).name + append;
    })(args as Handle),
  );

  (["MidiClip", "AudioClip"] as const).forEach((location) => {
    context.ui.registerContextMenuAction(
      location,
      "Rename this clip",
      "example.rename",
    );
  });
}
