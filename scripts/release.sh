#!/bin/bash

while [[ "$#" > 0 ]];
do
    case $1 in
    -r|--release) release="$2"; shift;;
    # -b|--branch) branch="$2"; shift;;
    -t|--tag-prefix) prefix="$2"; shift;;
    -p|--prerelease) prerelease="$2"; shift;;
    -n|--no-verify) no="true"; shift;;
    *) echo "❌❌❌ Unknown parameter passed: $1"; exit 1;;
    esac; shift;
done

# Default as minor, the argument major, minor or patch:
if [ -z "$release" ]; then
    release="patch";
fi

echo "👌🏻 Release as $release"

# Default release branch is master
# if [ -z "$branch" ] ; then
#     branch="";
# fi;

# if [ "$branch" ];
# then
#     echo "✔ Branch is $branch"
# else
#     echo "✔ Branch is current branch"
# fi;

# git pull origin $branch
# echo "✔ Current pull origin $branch."


# Generate version number and tag
if [ "$no" ]
then
    standard-version --no-erify --infile CHANGELOG.md
    echo "👌🏻 no-erify"
else
    standard-version -r $release --tag-prefix $prefix --prerelease $prerelease --infile CHANGELOG.md
fi;

git push --follow-tags
echo '✅ git push success'

npm publish

echo "🎉🎉🎉 Release finished."

