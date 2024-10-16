#!/bin/bash
while true; do
    echo -n "Enter commit message (or press Enter for auto-commit): "
    read commit_message

    # Remove leading and trailing whitespace
    commit_message_trimmed="$(echo -e "${commit_message}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"

    if [ -z "$commit_message_trimmed" ]; then
        commit_message="Auto commit"
        break
    else
        commit_message="$commit_message_trimmed"
        break
    fi
done

git add .
git commit -m "$commit_message"
git push

echo "Git commit and push complete!"
