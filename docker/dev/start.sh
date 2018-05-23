#!/bin/bash

PROJECT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

SESSION=$USER-entry-system

tmux -2 new-session -d -s $SESSION

tmux split-window -h

tmux select-pane -t 0
tmux send-keys "cd $PROJECT_PATH/server" C-m
tmux send-keys "yarn" C-m
tmux send-keys "yarn run watch" C-m

tmux select-pane -t 1
tmux send-keys "cd $PROJECT_PATH/client" C-m
tmux send-keys "yarn" C-m
tmux send-keys "yarn run watch" C-m

tmux -2 attach-session -t $SESSION
