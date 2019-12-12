#!/bin/sh

# check values
if [ -z "${GITHUB_TOKEN}" ]; then
    echo "error: GITHUB_TOKEN not present"
    exit 1
fi

# install lfs hooks
git lfs install