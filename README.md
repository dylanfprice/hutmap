# About #
This is the code that powers [hutmap.com](http://www.hutmap.com).

# Setup #

This section describes how to set up and run hutmap as a developer.

I am assuming a working knowledge of Linux, Bash, Python, and Django. You may
not know Vagrant, so walk through the
[tutorial](http://vagrantup.com/v1/docs/getting-started/index.html) before
setting everything up.

You can try this on Mac or Windows but I've only ever used Linux so no guarantees.

## Install Dependencies ##

First, make sure you have [Python](http://www.python.org) installed. I'm using
Python 2.6. Note that this Python installation is *only* used for running
scripts in scripts/utils, and not for running the code. Vagrant will provision
a separate Python install for the development vm that runs the code.

Next install [Vagrant](http://www.vagrantup.com). Vagrant requires both
[Ruby](http://www.ruby-lang.org) and [VirtualBox](https://www.virtualbox.org),
I'm not sure if the installer installs these for you or not so you may need to
install those first.

## Configure ##

After you've installed the dependencies, add the following to your ~/.profile
to set the necessary environment variables, or do the equivalent thing for your
operating system.  Where appropriate, defaults are provided for convenience,
however you may change these if you wish and it won't break anything (e.g. you
can change the name of the database and vagrant will propagate it correctly to
the vm when it builds it). Warning: Don't change the values after you call
'vagrant up' (see next step) or you will have to rebuild the vm by running
'vagrant destroy', then 'vagrant up' again.

    ```bash
    export HUTMAP_VERSION='0.1'
    export HUTMAP_DB_NAME='hutmap' 
    export HUTMAP_DB_USER='hutmap'
    export HUTMAP_DB_PASSWORD='hutmap'
    export HUTMAP_DB_HOST='' # Don't set this since we put Apache and MySQL on the same vm
    export HUTMAP_DB_PORT='' # Same goes for this
    export HUTMAP_SECRET_KEY='6b1c3b50-14b3-11e2-892e-0800200c9a66'
    export HUTMAP_DEBUG='true'
    export HUTMAP_GOOGLE_API_KEY='your_google_maps_api_key_here'
    export HUTMAP_EMAIL_HOST_USER=''     # These two are not relevant for development,
    export HUTMAP_EMAIL_HOST_PASSWORD='' # see django docs for usage
    ```

## Setup Dev Environment ##

This step will build and provision a development vm for running the hutmap
code. In the directory containing this README.md, perform the following:

    ```bash
    $ source ~/.profile
    $ cd scripts/
    $ vagrant box add lucid32 http://files.vagrantup.com/lucid32.box
    $ vagrant up # This will take a while
    ```

Go to <http://localhost:8080> in your browser and verify you see the homepage.

## Initialize the Database ##
Get the database up and running:

    ```bash
    $ cd scripts/
    $ vagrant ssh
    $ cd /vagrant/src/hutmap
    $ pythonbrew venv use hutmap
    $ ./manage.py validate
    $ ./manage.py syncdb
    $ ./manage.py loaddata test_data
    ```

## Development and Testing ##

Hutmap uses [shovel](https://github.com/seomoz/shovel) for utility scripts,
testing, building, deploying, etc. By running a shovel server on the
development vm, there is no need for you to install or set up anything. Simply
run:

    ```bash
    $ scripts/utils/shovel-server.py start
    ```

Then go to <http://localhost:3000/help> in your browser to see a list of all
available commands.

You may want to initialize the database and load in some test data:
<http://localhost:3000/django.manage?validate>
<http://localhost:3000/django.manage?syncdb&--noinput>
<http://localhost:3000/django.manage?loaddata&test_data>

### Developing Python (Django) ###

The django project is found in src/hutmap/ and the templates are in
src/templates/. Be careful editing the templates as both Django and AngularJS
use the same {{ variable }} syntax so there are a lot of {% verbatim %} blocks.
Edit the files as usual. Run tests at <http://localhost:3000/test.hutmappy>. To
see your changes show up at <http://localhost:8080>, you may need to reload the
server <http://localhost:3000/server.reload>.

You can run any non-interactive manage.py commands through the endpoint
<http://localhost:3000/django.manage>, e.g.
<http://localhost:3000/django.manage?syncdb>.

If you need to run other manage.py commands, or just want 'normal' access to
the django project, use the following:

    ```bash
    $ cd scripts/
    $ vagrant ssh
    $ cd /vagrant/src/hutmap
    $ pythonbrew venv use hutmap
    $ # now do what you want
    ```

### Developing Javascript (AngularJS) ###

Edit the js files in src/js/ and add tests in src/js-test/. Changes will show
up when you reload the page. 

Run the tests at <http://localhost:3000/test.hutmapjs>, but this may get
tedious, so you can start a karma server to watch the files for changes and
automatically re-run tests:

    ```bash
    $ cd scripts/
    $ vagrant ssh
    $ karma start /vagrant/src/js-test/hutmap/config/karma.conf.js
    ```

### Developing CSS ###

The css is located at src/css/. It is written in [less](http://lesscss.org/).
This means you need to compile it at <http://localhost:3000/build.css> for any
changes to show up.

# Project Layout #
TODO
