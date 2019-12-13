#!/bin/sh

if [ -z "${GITHUB_TOKEN}" ]; then
    echo "error: GITHUB_TOKEN not present"
    exit 1
fi

# Clone repo
remote_repo="https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
git config user.name "Paparazzi"
git config user.email "Paparazzi-action@users.noreply.github.com"
git clone "${remote_repo}" repo
cd repo
git show-ref # useful for debugging
git branch --verbose

pwd

cd /
ls -la

# Take some pictures
node capture.js

# Push the result