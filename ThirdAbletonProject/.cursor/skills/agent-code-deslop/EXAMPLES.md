# AgentCodeDeslop Examples

This document showcases de-slopping patterns across multiple programming languages. Use these as reference for how the skill applies idiomatically to different codebases.

## Python Example

### Slop Python
```python
import os
import json
import logging
import time  # unused

logger = logging.getLogger(__name__)

class FileReader:
    def __init__(self):
        pass

    def read_file_contents(self, file_path: str) -> str:
        logger.info("Starting to read file")
        if os.path.exists(file_path) == True:
            try:
                f = open(file_path, "r")
                data = f.read()
                f.close()
                logger.info("Successfully read file")
                return data
            except Exception:
                logger.error("Error while reading file")
                return ""
        else:
            logger.info("File does not exist")
            return ""
```

### Clean Python
```python
import os
import logging

logger = logging.getLogger(__name__)


def read_file_contents(file_path: str) -> str:
    """Read and return the contents of `file_path`, or an empty string if it cannot be read."""
    if not os.path.exists(file_path):
        logger.info("File does not exist: %s", file_path)
        return ""

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = f.read()
    except OSError as exc:
        logger.error("Error reading file %s: %s", file_path, exc)
        return ""

    logger.info("Successfully read file: %s", file_path)
    return data
```

**Changes made:**
- Removed unused imports (`json`, `time`).
- Removed unnecessary class wrapper; converted to simple function.
- Replaced manual file handling with context manager (`with` statement).
- Removed redundant `== True` comparison.
- Changed bare `except Exception` to specific `OSError`.
- Added `encoding="utf-8"` for explicitness.
- Simplified conditionals with `not` operator.

---

## JavaScript/TypeScript Example

### Slop JavaScript
```javascript
import fs from "fs";
import path from "path";  // unused
import { promisify } from "util";  // unused
import logger from "./logger.js";

const readFileContentsAsync = async (filePath) => {
  logger.info("Starting to read file: " + filePath);
  
  if (fs.existsSync(filePath) === true) {
    try {
      const data = await new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
      logger.info("Successfully read file: " + filePath);
      return data;
    } catch (error) {
      logger.error("Error: " + error);
      return "";
    }
  } else {
    logger.info("File does not exist: " + filePath);
    return "";
  }
};

export default readFileContentsAsync;
```

### Clean JavaScript
```javascript
import fs from "fs/promises";
import logger from "./logger.js";

async function readFileContents(filePath) {
  if (!fs.existsSync(filePath)) {
    logger.info(`File does not exist: ${filePath}`);
    return "";
  }

  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    logger.error(`Error reading file ${filePath}: ${error.message}`);
    return "";
  }
}

export default readFileContents;
```

**Changes made:**
- Replaced callback-based `fs.readFile` with promise-based `fs.readFile` from `fs/promises`.
- Removed unnecessary imports (`path`, `promisify`).
- Removed redundant Promise wrapper; used native promise-based API.
- Simplified string concatenation to template literals.
- Removed unnecessary `=== true` comparison.
- Simplified conditionals and error handling.
- Removed excessive logging calls.

---

## Go Example

### Slop Go
```go
package fileutils

import (
	"fmt"
	"io/ioutil"  // deprecated
	"log"
	"os"
	"strings"  // unused
)

type FileReader struct{
}

func (fr *FileReader) ReadFileContents(filePath string) (string, error) {
	log.Printf("Starting to read file: %s", filePath)

	if _, err := os.Stat(filePath); err != nil {
		log.Printf("File does not exist: %s", filePath)
		return "", nil
	}

	data, err := ioutil.ReadFile(filePath)
	if err != nil {
		log.Printf("Error reading file: %s", err)
		return "", nil  // silently swallow all errors
	}

	log.Printf("Successfully read file: %s", filePath)
	return string(data), nil
}
```

### Clean Go
```go
package fileutils

import (
	"log"
	"os"
)

func ReadFileContents(filePath string) (string, error) {
	if _, err := os.Stat(filePath); err != nil {
		log.Printf("File does not exist: %s", filePath)
		return "", os.ErrNotExist
	}

	data, err := os.ReadFile(filePath)
	if err != nil {
		log.Printf("Error reading file %s: %v", filePath, err)
		return "", err
	}

	return string(data), nil
}
```

**Changes made:**
- Removed unused type wrapper; converted to simple function (more idiomatic Go).
- Replaced deprecated `ioutil.ReadFile` with `os.ReadFile`.
- Removed unused imports (`fmt`, `strings`).
- Changed error handling to propagate errors instead of silently returning empty string.
- Removed unnecessary log output on success (caller logs as needed).
- Simplified variable declarations.

---

## Key Patterns Across Examples

These examples demonstrate recurring de-slopping patterns:

1. **Remove unused imports** — Each example had imports that were imported but never used.
2. **Eliminate unnecessary wrappers** — Converting single-method classes/types to simple functions.
3. **Use language idioms** — context managers in Python, promise-based APIs in JS, error propagation in Go.
4. **Simplify error handling** — Specific exception types, proper error propagation rather than silent failures.
5. **Use built-in solutions** — Prefer language/stdlib capabilities over custom wrappers.
6. **Clean up comparisons** — Remove redundant `=== true` checks.
7. **Modernize deprecated APIs** — Replace `ioutil.ReadFile` with `os.ReadFile`, etc.
8. **Reduce excessive logging** — Keep only meaningful, actionable log messages.
