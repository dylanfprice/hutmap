#!/bin/bash -e
# Performs a full or partial deploy to dreamhost

. /home/vagrant/.bash_profile
workon_hutmap
cd /vagrant/ops/provisioning

if [[ "$1" == "full" ]]
then
  ansible-playbook -i inventory dreamhost.yml 
else
  ansible-playbook -i inventory dreamhost.yml --tags partial
fi

