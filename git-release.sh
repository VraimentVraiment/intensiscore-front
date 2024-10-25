#!/bin/bash

# Function to increment version
increment_version() {
    local version=$1
    local part=$2
    IFS='.' read -r major minor patch <<< "$version"

    case $part in
        major)
            ((major++))
            minor=0
            patch=0
            ;;
        minor)
            ((minor++))
            patch=0
            ;;
        patch)
            ((patch++))
            ;;
        *)
            echo "Invalid part specified. Use 'major', 'minor', or 'patch'."
            exit 1
            ;;
    esac

    echo "$major.$minor.$patch"
}

# Check for dry-run option
DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
    shift  # Remove the dry-run argument
fi

# Ensure you are on the develop branch
git checkout develop

# Get the latest tag
latest_tag=$(git describe --tags --abbrev=0)
echo "Latest tag: $latest_tag"

# Increment the version based on the argument
if [ $# -ne 1 ]; then
    echo "Usage: $0 [--dry-run] <part_to_increment>"
    echo "Example: $0 minor"
    exit 1
fi

new_tag=$(increment_version "$latest_tag" "$1")
echo "New tag: $new_tag"

# Merge develop into main with a predefined commit message
if [ "$DRY_RUN" = true ]; then
    echo "Dry run: git checkout main"
    echo "Dry run: git merge develop --no-ff -m 'Merge branch 'develop' into main'"
    echo "Dry run: git push --force"
else
    git checkout main
    git merge develop --no-ff -m "Merge branch 'develop' into main"
    git push --force
fi

# Add the new tag for the release
if [ "$DRY_RUN" = true ]; then
    echo "Dry run: git tag $new_tag"
    echo "Dry run: git push --force origin $new_tag"
else
    git tag $new_tag
    git push --force origin $new_tag
fi

# Rebase develop and qualif onto main
for branch in develop qualif; do
    if [ "$DRY_RUN" = true ]; then
        echo "Dry run: git checkout $branch"
        echo "Dry run: git rebase main"
        echo "Dry run: git push --force"
    else
        git checkout $branch
        git rebase main
        git push --force
    fi
done

# Return to main branch
if [ "$DRY_RUN" = true ]; then
    echo "Dry run: git checkout main"
else
    git checkout main
fi
