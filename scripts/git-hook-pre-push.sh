#!/bin/bash
## this file is here for version control
## must be simLinked .git/hooks/pre-push 
# like so: `ln scripts/git-hook-pre-push.sh .git/hooks/pre-push`
# set -e

node ./scripts/getData.js
#node ./scripts/cacheKeyPrices.js

# Check if files changed
files=(
    "gamelist.json"
    "priceData.json"
)
for file in "${files[@]}"; do
    file="public/$file"
    ! git diff --quiet "$file" \
        && git add "$file" \
            && changes=true
done

# Commit if any changes were made
if [ "$changes" = true ]; then
    git commit -m "Update data files with pre-push hook"
fi