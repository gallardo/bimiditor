#!/bin/bash
start=$(date +%s)
echo -e "Current repo: $TRAVIS_REPO_SLUG\n"
echo -e "Pull request: $TRAVIS_PULL_REQUEST\n"

function error_exit
{
	echo -e "\e[01;31m$1\e[00m" 1>&2
	exit 1
}

if [ "$TRAVIS_PULL_REQUEST" == "false" ] &&  [ "$TRAVIS_REPO_SLUG" == "gallardo/obimp" ]; then

	#Set git user
	git config --global user.email "ag-travis-ci@gmail.com"
	git config --global user.name "Travis"

	#Set remotes
	git remote add upstream https://${GH_TOKEN}@github.com/gallardo/obimp.git 2> /dev/null > /dev/null

	#Update working example
	if [ "$TRAVIS_BRANCH" == "master" ]; then
		echo -e "Updating public_html...\n"

		git checkout -B gh-pages
		git add -f public_html/.
		git commit -q -m "Travis build $TRAVIS_BUILD_NUMBER pushed to gh-pages"
		git push -fq upstream gh-pages 2> /dev/null || error_exit "Error updating working examples"

		echo -e "Finished updating public_html\n"
	fi
fi

end=$(date +%s)
elapsed=$(( $end - $start ))
minutes=$(( $elapsed / 60 ))
seconds=$(( $elapsed % 60 ))
echo "Post-Build process finished in $minutes minute(s) and $seconds seconds"
