# About #

# Setup #

1. Install [Vagrant](www.vagrantup.com) 
2. Add the following to your ~/.bash\_profile to set the following environment
   variables, or do the equivalent thing for your operating system. You are
   allowed to change the values but some defaults are provided here for
   convenience.

    export HUTMAP\_DB\_NAME='hutmap' 
    export HUTMAP\_DB\_USER='hutmap'
    export HUTMAP\_DB\_PASSWORD='hutmap'
    export HUTMAP\_DB\_HOST=''
    export HUTMAP\_DB\_PORT=''
    export HUTMAP\_SECRET\_KEY='6b1c3b50-14b3-11e2-892e-0800200c9a66'
    export HUTMAP\_DEVELOPMENT='true'
    export HUTMAP\_DEBUG='true'
    export HUTMAP\_TEMPLATE\_DEBUG='true'

3. In the directory containing this README.md, perform the following:

    $ vagrant box add lucid32 http://files.vagrantup.com/lucid32.box
    $ vagrant up

4. Go to <http://localhost:8080> in your browser and verify you see the homepage.
