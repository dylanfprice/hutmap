#!/bin/sh -e
# Updates huts.json with the latest data from the database

DATA=/vagrant/public/static/hutmap/data
mkdir -p $DATA

. /home/vagrant/.bash_profile
workon_hutmap
./manage.py dumphutsjson > $DATA/huts.new.json
mv $DATA/huts.new.json $DATA/huts.json
