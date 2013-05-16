#!/bin/bash

BASE_DIR=`dirname $0`

echo "BASE_DIR = $BASE_DIR"
echo ""
echo "Starting Karma Server (http://karma-runner.github.io)"
echo "-------------------------------------------------------------------"

karma start $BASE_DIR/../config/karma-e2e.conf.js $*
