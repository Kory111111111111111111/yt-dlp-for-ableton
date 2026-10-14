import * as ableton from "@ableton-extensions/sdk";

// Change this path to an audio file path!
const filePath = "/your/path";

export function activate(activation: ableton.ActivationContext) {
    const context = ableton.initialize(activation, "1.0.0");

    context.ui.registerContextMenuAction("ClipSlot", "Create unwarped clip", "clipslot.Unwarped");
    context.ui.registerContextMenuAction("ClipSlot", "Create warped clip", "clipslot.Warped");

    context.ui.registerContextMenuAction("AudioTrack.ArrangementSelection", "Create unwarped clip", "ArrangementSelection.Unwarped");
    context.ui.registerContextMenuAction("AudioTrack.ArrangementSelection", "Create warped clip", "ArrangementSelection.Warped");

    context.commands.registerCommand("clipslot.Unwarped", async (arg: unknown) => {
        try {
            const clipSlot = context.getObjectFromHandle(arg as ableton.Handle, ableton.ClipSlot);
            const imported = await context.resources.importIntoProject(filePath);
            await clipSlot.createAudioClip({ filePath: imported, isWarped: false, loopSettings: { looping: false, startMarker: 1, endMarker: 5, loopStart: 1, loopEnd: 5 } });
        } catch (e) {
            console.error(e);
        }
    });

    context.commands.registerCommand("clipslot.Warped", async (arg: unknown) => {
        try {
            const clipSlot = context.getObjectFromHandle(arg as ableton.Handle, ableton.ClipSlot);
            const imported = await context.resources.importIntoProject(filePath);
            await clipSlot.createAudioClip({ filePath: imported, isWarped: true, loopSettings: { looping: true, startMarker: 1, endMarker: 5, loopStart: 1, loopEnd: 5 } });
        } catch (e) {
            console.error(e);
        }
    });

    context.commands.registerCommand("ArrangementSelection.Unwarped", async (arg: unknown) => {
        try {
            const selection = arg as ableton.ArrangementSelection;
            const track = context.getObjectFromHandle(selection.selected_lanes[0]!, ableton.AudioTrack);
            const imported = await context.resources.importIntoProject(filePath);
            await track.createAudioClip({ filePath: imported, startTime: selection.time_selection_start, duration: selection.time_selection_end - selection.time_selection_start, isWarped: false });
        } catch (e) {
            console.error(e);
        }
    });

    context.commands.registerCommand("ArrangementSelection.Warped", async (arg: unknown) => {
        try {
            const selection = arg as ableton.ArrangementSelection;
            const track = context.getObjectFromHandle(selection.selected_lanes[0]!, ableton.AudioTrack);
            const imported = await context.resources.importIntoProject(filePath);
            await track.createAudioClip({ filePath: imported, startTime: selection.time_selection_start, duration: selection.time_selection_end - selection.time_selection_start, isWarped: true });
        } catch (e) {
            console.error(e);
        }
    });
}
