# About #

# Setup #

First, install [Vagrant](http://www.vagrantup.com) 

Next, add the following to your ~/.bash\_profile to set the necessary
environment variables, or do the equivalent thing for your operating system.
You are allowed to change the values but defaults are provided for convenience.

    :::bash
    export HUTMAP_DB_NAME='hutmap' 
    export HUTMAP_DB_USER='hutmap'
    export HUTMAP_DB_PASSWORD='hutmap'
    export HUTMAP_DB_HOST=''
    export HUTMAP_DB_PORT=''
    export HUTMAP_SECRET_KEY='6b1c3b50-14b3-11e2-892e-0800200c9a66'
    export HUTMAP_DEVELOPMENT='true'
    export HUTMAP_DEBUG='true'
    export HUTMAP_TEMPLATE_DEBUG='true'

In the directory containing this README.md, perform the following:

    :::bash
    $ vagrant box add lucid32 http://files.vagrantup.com/lucid32.box
    $ vagrant up

Finally, go to <http://localhost:8080> in your browser and verify you see the homepage.
