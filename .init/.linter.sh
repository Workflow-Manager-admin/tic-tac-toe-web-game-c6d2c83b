#!/bin/bash
cd /home/kavia/workspace/code-generation/tic-tac-toe-web-game-c6d2c83b/frontend_react
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

