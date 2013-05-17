#!/bin/bash

cd ~/hutmap.com
perl -pi -e "s/HUTMAP_VERSION=.*/HUTMAP_VERSION=$1/" ~/.profile
git pull
pkill python

