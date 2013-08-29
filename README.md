This is the code that powers [hutmap.com](http://www.hutmap.com).

- [Setup](#setup)
- [Develop](#develop)
- [Deploy](#deploy)

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
$ git clone git@github.com:dylanfprice/hutmap.git
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

If you encounter any errors, run
```bash
$ vagrant provision
```
and make sure it finishes without errors.

When you are done working, make sure you do a 
```bash
$ vagrant suspend
```
before turning off your machine.

## Initialize Database ##

You will probably want to sync the database and load in some data:
```bash
$ cd ops/
$ vagrant ssh
$ workon_hutmap
$ ./manage.py syncdb
$ ./manage.py loaddata init
$ scripts/update_huts_json.sh
```
Got to <localhost:8000/map> and verify you see some data.
You can now also log in to <localhost:8000/admin> with 'admin' for both username and password.

# Develop #

## Developing Python (Django) ##

The main django app is in `src/hutmap/huts/`. You can run manage.py commands by logging into the vm:
```bash
$ cd ops/
$ vagrant ssh
$ workon_hutmap
$ ./manage.py <command>
```

Django's devserver is wrapped in an upstart service, so it should restart
automatically if you crash it. But if you want to stop, start, or restart it
for any reason, then while logged in to the vm you can run; 
```bash
$ sudo stop django-devserver
$ sudo start django-devserver
$ sudo restart django-devserver
```

## Developing Javascript (AngularJS) ##

Edit the js files in `src/hutmap/static/hutmap/js/` and add tests in
`src/hutmap/static/hutmap/js-test/`. Changes will show up when you reload the
page. Note that Angular expressions are wrapped in [* *] instead of the default
{{ }}, so as not to conflict with Django.

Run the tests by logging into the vm and starting a karma server:
```bash
$ cd ops/
$ vagrant ssh
$ karma start /vagrant/src/hutmap/static/hutmap/js-test/hutmap/config/karma.conf.js
```

## Developing CSS ##

The css is located at `src/hutmap/static/hutmap/css/`. It is written in
[less](http://lesscss.org/). The less is automatically compiled to css using
[django_compressor](http://django-compressor.readthedocs.org/en/latest/) so you
just need to reload the page.


# Deploy #

## Deploy to Dreamhost ##
There are two types of deploys: partial and full. A partial deployment assumes
the server is already successfully serving hutmap and simply updates the code
and static files (css, js, images, etc.). A full deploy assumes nothing and
ensures all libraries and other 'one-time setup' items are taken care of.

### Partial Deploy ###

First step is to set up `ops/group_vars/dreamhost` with the following variables
set to the values you want (Ethan I can send you this file):

```yaml
---
user: 'me'
repo_dir: '/home/me/mysite.com'

hutmap:
  version: ''
  db_name: 'my_db_name' 
  db_user: 'my_db_user'
  db_password: 'my_db_password'
  db_host: 'my_db_host'
  db_port: 'my_db_port'
  secret_key: 'my_secret_key'
  debug: 'false'
  google_api_key: 'my_google_api_key'
  email_host_user: '' # Not implemented yet
  email_host_password: '' # Not implemented yet
```

Next you need to set up the dreamhost server to authorize the vagrant vm's public key:

```bash
$ cd ops/
$ vagrant ssh
$ ssh-copy-id user@host # where user@host corresponds to your dreamhost account
```

Then, while still logged into the vm:
```bash
$ workon_hutmap
$ scripts/deploy_dreamhost.sh
```

Re-run this script any time you need to deploy.

### Full Deploy ###
Follow the same steps as Partial Deploy above, but at the last step run the following instead:
```bash
$ scripts/deploy_dreamhost.sh full
```

