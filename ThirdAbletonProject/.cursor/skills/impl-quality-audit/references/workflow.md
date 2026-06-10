# Implementation Quality Audit — Workflow Reference

This reference contains the full phase-by-phase procedure, research strategy, and domain-specific checks for a thorough implementation quality audit.

---

## Phase 1: Scope and Discovery

### 1.1 Determine Scope

Start by clarifying what is being audited:

| Scope type | What to do |
|-----------|-------------|
| Single function or algorithm | Read that function and any helpers it calls |
| Single file | Read the full file, note its dependencies and callers |
| Named module or feature | Find all files that make up the feature using search and directory traversal |
| Entire source folder | List the folder, group files by apparent responsibility, then audit each group |

When the user drops a folder or mentions "the whole plugin", group files into logical domains first — DSP, state/parameters, UI, I/O, utilities — then audit each domain separately so findings stay organized.

### 1.2 Build the Inventory

For each file or group, record:

- **Purpose**: what responsibility does this code own?
- **Interface**: what does it expose (methods, parameters, callbacks)?
- **Dependencies**: what does it call into, and what calls it?
- **Design choices**: notable patterns — inheritance, CRTP, value tree listeners, atomic state, timer callbacks, etc.

Do not skip files that look uninteresting. Bugs and antipatterns hide in utility code.

---

## Phase 2: Comprehension — How It Currently Works

Before researching anything, build a plain-language mental model of the current implementation:

1. Trace the data flow from input to output.
2. Identify all the threads that touch this code (audio thread, message thread, timer callbacks).
3. Note every external API used (JUCE classes, OS APIs, third-party libraries).
4. Mark anything that raised a question while reading — unclear naming, unexpected branching, missing comments, surprising casts.

Write a brief summary in plain language: *"This module does X by doing Y and Z. It is called from A and feeds into B."*

This summary becomes section 2 of the final report.

---

## Phase 3: Web Research

### 3.1 Research Strategy

For each distinct implementation area identified in Phase 2, use the web to find:

| Source type | What to look for |
|-------------|-----------------|
| Official JUCE documentation | Correct lifecycle, intended usage, thread rules for the API being used |
| JUCE forum (forum.juce.com) | Common pitfalls, corrections from Jules or JUCE team members, worked examples |
| Audio Developer Conference talks | Architecture and design patterns for production audio plugins |
| GitHub code search | Real-world plugin code that solves the same problem — compare approaches |
| CPP reference / ISO standard docs | C++ correctness, undefined behavior traps, standard idioms |
| Domain-specific resources | For DSP: literature citations, known algorithm reference implementations |

### 3.2 Research Targets by Domain

**DSP / Audio Processing**
- Is the algorithm correct? Compare against textbook or reference C++ implementations.
- Are filter coefficients calculated correctly?
- Are there known precision traps (float vs. double, denormals, Inf/NaN)?
- Does it handle edge cases like silence, extreme parameter values, zero-length buffers?
- Is DC blocking or pre-warping applied where required?

**JUCE Parameters and State (APVTS, ValueTree)**
- Is `AudioProcessorValueTreeState` being used per the recommended pattern?
- Are listeners attached and detached safely relative to object lifetime?
- Are `std::atomic<float>*` correctly retrieved once and cached, not queried on the audio thread each block?
- Is state serialized correctly with `getStateInformation` / `setStateInformation`?

**Audio Thread Safety**
- Is any heap allocation happening inside `processBlock`?
- Are locks (`std::mutex`, `CriticalSection`) ever acquired on the audio thread?
- Is UI state being read directly on the audio thread without atomics or a FIFO?
- Is `MessageManager::callAsync` or `AsyncUpdater` being used correctly to defer UI updates off the audio thread?

**UI Components (JUCE Component, LookAndFeel)**
- Is `paint()` doing work it could do once in `resized()`?
- Are `Component::repaint()` calls excessive or unguarded?
- Is `LookAndFeel` applied at the right level (component vs. global)?
- Are child components owned and added correctly, or leaking?
- Is `setBufferedToImage` used appropriately for complex static components?

**Preset / File I/O**
- Is `XmlElement` or `ValueTree` serialization idiomatic and versioned?
- Are file paths obtained via JUCE's `File` API (not raw OS APIs)?
- Are missing files and corrupt data handled gracefully?
- Are writes atomic (write to temp, rename into place)?

**Plugin Lifecycle and Host Integration**
- Is `prepareToPlay` correctly resetting state on sample rate or block size change?
- Is `releaseResources` freeing everything it should?
- Are `getTailLengthSeconds`, `acceptsMidi`, `producesMidi` accurate?

### 3.3 Recording Research

For each area researched, capture:

- **Source**: URL, documentation page, or forum thread
- **Key finding**: what does the reference say should be done?
- **Relevant excerpt**: a short quote or code snippet that directly illustrates best practice

These go into section 3 of the final report.

---

## Phase 4: Gap Analysis

Compare the comprehension from Phase 2 against the research from Phase 3. For each area, answer:

1. Does our implementation match the intended API usage?
2. Are there correctness issues the working code may be hiding (e.g., only fails at edge cases or high load)?
3. Are there robustness improvements the reference implementation includes that ours does not?
4. Does our approach introduce unnecessary complexity that exists in simpler form elsewhere?
5. Are there thread safety, lifecycle, or resource management problems?

### Severity Assignment

Assign severity per finding:

- **Critical**: wrong behavior, memory unsafety, data corruption, silent data loss
- **High**: breaks under edge cases, incorrect API lifecycle, thread safety violation that will eventually manifest
- **Medium**: antipattern with a clearly better standard alternative, missing realistic error handling
- **Low**: style deviation, missed convenience, minor redundancy

### Red Flags by Domain

| Domain | Watch for |
|--------|-----------|
| DSP | Float precision loss, denormal non-handling, DC offset, aliasing, sample-rate-dependent magic numbers |
| APVTS / Parameters | Calling `getRawParameterValue` inside `processBlock` per sample, listener not removed on destruction |
| Audio thread | `new`/`delete`, lock acquisition, `std::cout`, plugin-level ValueTree writes |
| UI | `paint()` rebuilding path geometry every frame, `repaint()` in a timer without dirty checking |
| Preset I/O | No version field in serialized XML, assuming `setStateInformation` always receives valid data |
| General C++ | Raw owning pointers, `reinterpret_cast` from untrusted data, manual `new` without RAII |

---

## Phase 5: Audit Report

Structure the final report as follows:

### 1. Scope and Inventory
- Files reviewed (linked)
- High-level purpose of each file or group
- Total lines of code and approximate complexity

### 2. How It Currently Works
- Plain-language walkthrough
- Data flow diagram or pseudocode if helpful
- Thread interaction summary

### 3. Research Findings
- For each area: source, what best practice says, relevant excerpt

### 4. Gap Analysis
Grouped by severity:

```
[CRITICAL] Finding title
  What we have: ...
  What it should be: ...
  Reference: <link>
  Risk: ...

[HIGH] Finding title
  ...
```

### 5. Prioritized Action Items
Ordered by impact:

1. Fix X — addresses Critical issue, 1 file change
2. Refactor Y — addresses 3 High issues, touches 2 files
3. ...

---

## Scope Calibration

| Scope size | Expected depth | Typical research areas |
|-----------|---------------|----------------------|
| Single function | Deep — exhaustive edge-case analysis | 1–2 focused areas |
| Single file | Thorough — all methods, all interdependencies | 2–4 areas |
| Module / feature | Broad — representative sampling, deep on risky parts | 3–6 areas |
| Full source folder | High level with deep dives on flagged areas | All domains relevant to the plugin |
