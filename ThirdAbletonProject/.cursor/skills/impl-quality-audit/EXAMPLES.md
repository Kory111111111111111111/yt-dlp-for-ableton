# Implementation Quality Audit — Examples

These examples show how to invoke the skill, what a reasonable audit scope looks like, and what the output structure should resemble.

---

## Example 1: Single Algorithm Audit

### Invocation
```
/impl-quality-audit  Audit our compressor gain computation in Source/DSP/Compressor.cpp
```

### Expected Investigation

1. Read `Compressor.cpp` and any headers it depends on.
2. Identify the gain computer: attack/release envelope, knee, ratio, makeup gain.
3. Search the web for: reference compressor implementations in C++, JUCE forum discussions on compressor plugin design, ADC talks on dynamics processing.
4. Compare our envelope follower time-constant formula against the standard `exp(-1 / (sampleRate * timeMs))` form.
5. Check whether the gain reduction is applied in linear or dB domain (common source of subtle error).
6. Check whether smoothing state is reset in `prepareToPlay`.

### Output Shape

```
## Scope
- Source/DSP/Compressor.cpp (~180 lines)
- Source/DSP/Compressor.h

## How it currently works
The gain computer reads peak-detected level from a first-order follower, applies
a soft-knee ratio curve in dB, and outputs gain reduction. Attack and release
are time constants recalculated once per block. Makeup gain is a fixed scalar.

## Research Findings
1. JUCE Forum – "Compressor design thread" (forum.juce.com/t/...)  
   Best practice: recalculate time constants in prepareToPlay only, cache as
   member. Our code recalculates inside processBlock per-sample — wasteful.

2. Zolzer "DAFX" §3.3 / reference C++ (github.com/...)  
   Standard attack formula: coeff = exp(-1.0 / (sampleRate * attackSec))
   Our code uses: coeff = 1.0 - (1.0 / (sampleRate * attackMs * 0.001))
   This is an approximation that diverges noticeably below 5ms attack times.

3. ADC 2019 "Dynamics Plugins Done Right" (youtube.com/...)  
   Makeup gain should be auto-computed from ratio/threshold when "auto" enabled.
   No auto-makeup in our implementation.

## Gap Analysis

[HIGH] Incorrect attack coefficient formula
  What we have: linear approximation
  What it should be: exp(-1 / (sampleRate * attackSec))
  Risk: Inaccurate attack times at short settings (< 5ms), musical transients pass through

[MEDIUM] Time constants recalculated inside processBlock
  What we have: computed per call
  What it should be: cached member, updated only in prepareToPlay or on parameter change
  Risk: Unnecessary FP math per sample — minor CPU cost, but a correctness smell

[LOW] No auto-makeup gain
  What we have: fixed scalar
  What it should be: optional computed makeup based on ratio and threshold
  Risk: None — just a missing convenience feature

## Action Items
1. Fix attack/release formula — 1 line change, high impact
2. Cache time constants as members, update in prepareToPlay — 10 line refactor
3. (Optional) Add auto-makeup gain computation
```

---

## Example 2: Module Audit (APVTS Parameter Binding)

### Invocation
```
/impl-quality-audit  How does our APVTS setup compare to what JUCE recommends?
```

### Expected Investigation

1. Find where `AudioProcessorValueTreeState` is constructed and where parameters are added.
2. Read every file that calls `getRawParameterValue` or creates `SliderAttachment`s.
3. Search official JUCE docs and forum for recommended APVTS patterns.
4. Check: are raw parameter pointers cached at construction, or re-fetched each block? Are attachments owned by the correct component? Are listener callbacks happening on the correct thread?

### Output Shape (abbreviated)

```
## Gap Analysis

[HIGH] getRawParameterValue called inside processBlock
  What we have: PluginProcessor.cpp:112 — params fetched by name each block
  What it should be: fetch pointer once in constructor, store as std::atomic<float>*
  Reference: JUCE docs — AudioProcessorValueTreeState "best practices" section
  Risk: String hash lookup per block — measurable CPU overhead; also unsafe if
        parameter layout changes

[MEDIUM] SliderAttachment created on stack in constructor, destroyed before Editor
  What we have: attachment is a local variable
  What it should be: owned by the Editor as a member (std::unique_ptr or direct member)
  Reference: JUCE Tutorial — "Adding sliders to a plugin" attachment ownership section
  Risk: Attachment destructor called at wrong time, slider no longer reflects state
```

---

## Example 3: Full Source Folder Audit

### Invocation
```
/impl-quality-audit  Full audit — here's Source/, tell me everything that's under-built
```

### Expected Investigation

1. List and group all files in `Source/`.
2. Identify domains: DSP processing, parameter management, UI components, preset I/O, plugin lifecycle.
3. For each domain, do a targeted Phase 2 (comprehension) and Phase 3 (research).
4. Surface the most impactful findings across all domains.
5. Produce a consolidated report — organized by domain, then by severity.

### Output Shape (abbreviated)

```
## Scope
Source/ — 14 files, ~2,400 lines
Groups: DSP (4 files), Parameters (2 files), UI (5 files), Preset I/O (2 files), Main (1 file)

## Domain: DSP
[HIGH] Reverb tail not reset in prepareToPlay — state bleeds across playback stops
[MEDIUM] Denormal protection not applied to feedback delay lines

## Domain: Parameters
[HIGH] getRawParameterValue called per sample in processBlock (3 occurrences)

## Domain: UI
[MEDIUM] paint() recalculates gradient each frame — should be cached in resized()
[LOW] Hard-coded pixel offsets in 3 components instead of proportional layout

## Domain: Preset I/O
[HIGH] setStateInformation does not validate XML before applying — crashes on corrupt preset
[MEDIUM] No version field — future parameter changes will silently break old presets

## Prioritized Action Items
1. Fix getRawParameterValue in processBlock — 3 locations, Critical CPU and safety fix
2. Validate XML in setStateInformation — 1 function, crash prevention
3. Add version tag to serialized state — 2 line add, future-proofs preset compat
4. Reset reverb state in prepareToPlay — 1 line
5. Cache gradient in resized() — UI quality, no functional impact
```

---

## Notes on Research Quality

The audit is only as good as the research. When searching the web:

- Prefer the **official JUCE forum** and **JUCE documentation** over random blog posts for API-specific questions.
- For DSP correctness, prefer **textbook citations** or **well-maintained open-source plugins** (JUCE examples, iPlug2, DISTRHO) over random Stack Overflow answers.
- When a forum post contradicts the official docs, flag both and note which is more recent.
- Always include a link or reference for each finding — audit reports without citations are just opinions.
