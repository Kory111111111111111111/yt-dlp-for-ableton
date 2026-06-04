import {
  initialize,
  Track,
  MidiTrack,
  DataModelObject,
  TakeLane,
  type ActivationContext,
  type ArrangementSelection,
} from "@ableton-extensions/sdk";

export function activate(activation: ActivationContext) {
  const api = initialize(activation, "1.0.0");

  api.ui.registerContextMenuAction(
    "MidiTrack.ArrangementSelection",
    "Process selection",
    "myExtension.processSelection",
  );

  api.commands.registerCommand(
    "myExtension.processSelection",
    async (arg: unknown) => {
      const selection = arg as ArrangementSelection;

      const selectedObjects = selection.selected_lanes.map((handle) =>
        api.getObjectFromHandle(handle, DataModelObject),
      );
      const selectedTrackOrLanes = selectedObjects.filter(
        (obj): obj is Track<"1.0.0"> | TakeLane<"1.0.0"> =>
          obj instanceof Track || obj instanceof TakeLane,
      );

      console.log(
        `You right-clicked in Arrangement View with a selection from beat ${selection.time_selection_start} to beat ${selection.time_selection_end}.`,
      );

      const selectedNames = selectedTrackOrLanes.map((obj) => obj.name);
      console.log(
        `The names of the selected tracks / take lanes are: ${selectedNames.join(", ")}`,
      );

      const midiLanes = selectedTrackOrLanes.filter(
        (obj): obj is MidiTrack<"1.0.0"> | TakeLane<"1.0.0"> =>
          obj instanceof MidiTrack ||
          (obj instanceof TakeLane && obj.parent instanceof MidiTrack),
      );

      if (midiLanes.length > 0) {
        console.log("I'll add a MIDI clip to each MIDI track/lane that's selected.");
        const newClips = await Promise.all(
          midiLanes.map((lane) =>
            lane.createMidiClip(
              selection.time_selection_start,
              selection.time_selection_end - selection.time_selection_start,
            ),
          ),
        );
        newClips.forEach((clip, i) => {
          clip.name = `New Clip ${i + 1}`;
        });
      }
    },
  );
}
