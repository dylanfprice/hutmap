# About #
This is the code that powers [hutmap.com](http://www.hutmap.com).

# Setup #

I am assuming a working knowledge of Linux, Bash, Python, and Django. You may
not know Vagrant, so walk through the
[tutorial](http://vagrantup.com/v1/docs/getting-started/index.html) and all
will become clear.

You can try this on Mac or Windows but I've only ever used Linux so no guarantees.

## Setup Dev Environment ##
First, install [Vagrant](http://www.vagrantup.com). Vagrant requires both
[Ruby](http://www.ruby-lang.org) and [VirtualBox](https://www.virtualbox.org),
I'm not sure if the installer installs these for you or not.

Next, add the following to your ~/.bash\_profile to set the necessary
environment variables, or do the equivalent thing for your operating system.
You can change the values but defaults are provided for convenience. Warning:
Don't change the values after you call 'vagrant up' (see next step) or you will
have to rebuild the vm by running 'vagrant destroy', then 'vagrant up' again.

    :::bash
    export HUTMAP_DB_NAME='hutmap' 
    export HUTMAP_DB_USER='hutmap'
    export HUTMAP_DB_PASSWORD='hutmap'
    export HUTMAP_DB_HOST='' # Don't set this since we put Apache and MySQL on the same vm
    export HUTMAP_DB_PORT='' # Same goes for this
    export HUTMAP_SECRET_KEY='6b1c3b50-14b3-11e2-892e-0800200c9a66'
    export HUTMAP_DEBUG='true'
    export HUTMAP_TEMPLATE_DEBUG='true'

In the directory containing this README.md, perform the following:

    :::bash
    $ source ~/.bash_profile
    $ vagrant box add lucid32 http://files.vagrantup.com/lucid32.box
    $ vagrant up # This will take a while

Finally, go to <http://localhost:8080> in your browser and verify you see the homepage.

## Initialize the Database ##
Get the database up and running:

    :::bash
    $ vagrant ssh
    $ cd /vagrant/hutmap
    $ python manage.py validate
    $ python manage.py syncdb
    $ python manage.py loaddata test_data
