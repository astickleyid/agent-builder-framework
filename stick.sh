#!/bin/bash

# stick.ai CLI Helper Script
# Makes it easy to run stick commands from anywhere in the project

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CLI_PATH="$SCRIPT_DIR/packages/cli/dist/cli.js"

# Run the CLI with all arguments passed through
node "$CLI_PATH" "$@"
