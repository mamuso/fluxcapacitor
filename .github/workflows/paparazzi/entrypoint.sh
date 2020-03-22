#!/bin/sh

if [ -z "${GITHUB_TOKEN}" ]; then
    echo "error: GITHUB_TOKEN not present"
    exit 1
fi

echo "lalalalala"

# # Clone repo
# remote_repo="https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
# git config --global user.name "Paparazzi"
# git config --global user.email "paparazzi-action@users.noreply.github.com"
# git clone "${remote_repo}" /github/workspace/repo
# cd repo
# git show-ref # useful for debugging
# git branch --verbose

# # Take some pictures
# cd /
# GITHUB_ACTIONS=true node dist/paparazzi.js

# Push files to the repo
# cd /github/workspace/repo
# git add -A
# timestamp=$(date -u)
# git commit -m "Publishing report ${timestamp} - ${GITHUB_SHA}" || exit 0
# git pull 
# git push