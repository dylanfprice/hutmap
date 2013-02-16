{% comment %}

This is the template which generates README.md
Context:
{
}
{% endcomment %}
<!--
This file generated from the template at scripts/generate/templates/README.md
Please do not edit by hand.
-->

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
Python 2.6. Note that this Python installation is only used for running the
build script and the like, and not for running the code. Vagrant will provision
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

    :::bash
    export HUTMAP_DB_NAME='hutmap' 
    export HUTMAP_DB_USER='hutmap'
    export HUTMAP_DB_PASSWORD='hutmap'
    export HUTMAP_DB_HOST='' # Don't set this since we put Apache and MySQL on the same vm
    export HUTMAP_DB_PORT='' # Same goes for this
    export HUTMAP_SECRET_KEY='6b1c3b50-14b3-11e2-892e-0800200c9a66'
    export HUTMAP_DEBUG='true'
    export HUTMAP_TEMPLATE_DEBUG='true'

## Setup Dev Environment ##

This step will build and provision a development vm for running the hutmap
code. In the directory containing this README.md, perform the following:

    :::bash
    $ source ~/.profile
    $ cd scripts/
    $ vagrant box add lucid32 http://files.vagrantup.com/lucid32.box
    $ vagrant up # This will take a while

Go to <http://localhost:8080> in your browser and verify you see the homepage.

## Initialize the Database ##
Get the database up and running:

    :::bash
    $ vagrant ssh
    $ cd /vagrant/src/hutmap
    $ python manage.py validate
    $ python manage.py syncdb
    $ python manage.py loaddata test_data

# Project Layout #
TODO
