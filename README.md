# About #
This is the code that powers [hutmap.com](http://www.hutmap.com).

# Setup #

This section describes how to set up and run hutmap as a developer.

I am assuming a working knowledge of Linux, Bash, Python, and Django. You may
not know Vagrant, so walk through the
[tutorial](http://docs.vagrantup.com/v2/getting-started/) before setting
everything up.

It should work on Mac or Windows but I've only ever used Linux so no guarantees.

## Clone the Repo ##

Get the code, and repos the project depends on:

```bash
$ git clone https://github.com/dylanfprice/hutmap.git
$ git submodule init
$ git submodule update
```

## Install Dependencies ##

Install:
- [Python](http://www.python.org) 2.x
- [Vagrant](http://docs.vagrantup.com/v2/installation/)
- [Ansible](http://www.ansibleworks.com/docs/gettingstarted.html)

If you run a Debian based Linux distro like me this should work:
```bash
$ sudo apt-get install vagrant
$ sudo easy_install pip
$ sudo pip install ansible
```

## Configure ##

Create the file `ops/provisioning/group_vars/vagrant` with the following in it:
```yaml
---
user: 'vagrant'
mysql_root_password: 'vagrant'

hutmap:
  version: 'dev'
  db_name: 'hutmap' 
  db_user: 'hutmap'
  db_password: 'hutmap'
  db_host: ''
  db_port: ''
  secret_key: '516713f0-518b-11e2-bcfd-0800200c9a66'
  debug: 'true'
  google_api_key: 'YOUR_GOOGLE_API_KEY'
  email_host_user: ''
  email_host_password: ''
```
  
## Setup Dev Environment ##

```bash
$ cd ops/
$ vagrant up # this will take a while
```
On my machine with an ~ 30MBps connection this took around 30 minutes.

Go to <http://localhost:8000> in your browser and verify you see the homepage.

## Development and Testing ##

You will probably want to sync the database and load in some data:
```bash
$ cd ops/
$ vagrant ssh
$ workon_hutmap
$ ./manage.py syncdb
$ ./manage.py loaddata huts/fixtures/test_data.json #TODO: fix test_data fixture
```

### Developing Python (Django) ###

The main django app is in `src/hutmap/huts/`. You can run manage.py commands by logging into the vm:
```bash
$ cd ops/
$ vagrant ssh
$ workon_hutmap
$ ./manage.py <command>
```

### Developing Javascript (AngularJS) ###

Edit the js files in `src/hutmap/static/hutmap/js/` and add tests in
`src/hutmap/static/hutmap/js-test/`. Changes will show up when you reload the
page. 

Run the tests by logging into the vm and starting a karma server:
```bash
$ cd ops/
$ vagrant ssh
$ karma start /vagrant/src/hutmap/static/hutmap/js-test/hutmap/config/karma.conf.js
```

### Developing CSS ###

The css is located at `src/hutmap/static/hutmap/css/`. It is written in
[less](http://lesscss.org/). The less is automatically compiled to css using
[django_compressor](http://django-compressor.readthedocs.org/en/latest/) so you
just need to reload the page.

