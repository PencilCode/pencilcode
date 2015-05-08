#!/bin/sh

GIT="/usr/bin/git"
GRUNT="/usr/local/bin/grunt"
DIR="$( cd "$( dirname "$0" )/.." && pwd )"
cd $DIR
$GIT stash
$GIT checkout experiment
$GIT pull
$GRUNT

