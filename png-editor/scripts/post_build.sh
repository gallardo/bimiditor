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
		#Copy public_html in a temporary location
		echo -e "Copying png-editor/public_html into $HOME/tmp_dist/"
		cp -R png-editor/public_html $HOME/tmp_dist/

		echo -e "Updating GitHub's pages (dist)...\n"

        git fetch upstream
		git checkout gh-pages

		# Replace the dist folder
		rm -rf dist/
		cp -Rf $HOME/tmp_dist/ dist/
		git add -f dist/
		git commit -q -m "Travis build $TRAVIS_BUILD_NUMBER pushed to gh-pages"
		git push -fq upstream gh-pages 2> /dev/null || error_exit "Error updating working examples"

		echo -e "Finished GitHub's pages (dist)\n"
	fi
fi

end=$(date +%s)
elapsed=$(( $end - $start ))
minutes=$(( $elapsed / 60 ))
seconds=$(( $elapsed % 60 ))
echo "Post-Build process finished in $minutes minute(s) and $seconds seconds"
