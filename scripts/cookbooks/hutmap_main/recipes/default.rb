include_recipe "apt"
include_recipe "vim"
include_recipe "passenger_apache2::mod_rails"
include_recipe "apache2::mod_expires"
include_recipe "mysql::server"

## Variables ##
hutmap_grants = "/etc/mysql/hutmap_grants.sql"
hutmap_fns = "/etc/mysql/hutmap_fns.sql"
hutmap_drop = "/etc/mysql/hutmap_drop.sql"
profile = "/etc/profile.d/hutmap.sh"
user = "vagrant"

## MySQL config ##

template "#{hutmap_grants}" do
  source "hutmap_grants.sql.erb"
  owner "root"
  group "root"
  mode "0600"
  action :create
end

execute "mysql install application privileges" do
  command "/usr/bin/mysql -u root "\
    "#{node['mysql']['server_root_password'].empty? ? '' : '-p'}"\
    "'#{node['mysql']['server_root_password']}' < #{hutmap_grants}"
  action :nothing
  subscribes :run, "template[#{hutmap_grants}]", :immediately
end

template "#{hutmap_fns}" do
  source "hutmap_fns.sql.erb"
  owner "root"
  group "root"
  mode "0666"
  action :create
end

execute "mysql install fns" do
  command "/usr/bin/mysql -u root "\
    "#{node['mysql']['server_root_password'].empty? ? '' : '-p'}"\
    "'#{node['mysql']['server_root_password']}' < #{hutmap_fns}"
  action :nothing
  subscribes :run, "template[#{hutmap_fns}]", :immediately
end

template "#{hutmap_drop}" do
  source "hutmap_drop.sql.erb"
  owner "root"
  group "root"
  mode "0666"
  action :create
end


## Apache and hutmap config ##

execute "disable default site" do
  command "sudo a2dissite default"
  notifies :reload, "service[apache2]", :delayed
end

web_app "hutmap" do
  docroot "/vagrant/public"
  server_name "hutmap.#{node[:domain]}"
  server_aliases [ "hutmap", node[:hostname] ]
  notifies :reload, "service[apache2]", :delayed
end

template "#{profile}" do
  source "hutmap.sh.erb"
  mode "644"
  action :create
end


## Install Python and modules ##

package "python" do
  action :install
end

package "curl" do
  action :install
end

bash "install pythonbrew" do
  user "#{user}"
  environment ({"HOME" => "/home/#{user}"})
  code <<-EOH
  curl -kL http://xrl.us/pythonbrewinstall | bash && \
  echo '[[ -s $HOME/.pythonbrew/etc/bashrc ]] && source $HOME/.pythonbrew/etc/bashrc' >> $HOME/.bashrc
  EOH
  not_if { File.exists?("/home/#{user}/.pythonbrew") }
end

bash "setup pythonbrew" do
  user "#{user}"
  environment ({"HOME" => "/home/#{user}"})
  pythonbrew = "/home/#{user}/.pythonbrew/bin/pythonbrew"
  code <<-EOH
  #{pythonbrew} install 2.7.3 && \
  #{pythonbrew} switch 2.7.3 && \
  #{pythonbrew} venv init
  EOH
  not_if { File.exists?("/home/#{user}/.pythonbrew/pythons/Python-2.7.3") }
  #action :nothing
  #subscribes :run, "bash[install pythonbrew]", :immediately
end

bash "set up hutmap virtualenv" do
  user "#{user}"
  environment ({"HOME" => "/home/#{user}"})
  pythonbrew = "/home/#{user}/.pythonbrew/bin/pythonbrew"
  pip = "/home/#{user}/.pythonbrew/venvs/Python-2.7.3/hutmap/bin/pip"
  code <<-EOH
  #{pythonbrew} venv create hutmap -p 2.7.3 && \
  #{pip} install "http://pypi.python.org/packages/source/M/MySQL-python/MySQL-python-1.2.4b4.tar.gz#md5=0958cb9c23d5a656caac031c4886b1cf" && \
  #{pip} install django==1.5 && \
  #{pip} install django-tastypie==0.9.14
  EOH
  not_if { File.exists?("/home/#{user}/.pythonbrew/venvs/Python-2.7.3/hutmap") }
  #action :nothing
  #subscribes :run, "bash[setup pythonbrew]", :immediately
end

directory "/var/tmp/hutmap-django-cache" do
  owner "#{user}"
  mode 00600
  action :create
end


## Install dev dependencies ##

bash "install shovel" do
  user "#{user}"
  environment ({"HOME" => "/home/#{user}"})
  pythonbrew = "/home/#{user}/.pythonbrew/bin/pythonbrew"
  pip = "/home/#{user}/.pythonbrew/venvs/Python-2.7.3/hutmap/bin/pip"
  code <<-EOH
  #{pip} install shovel && \
  #{pip} install argparse && \
  #{pip} install bottle && \
  # Temporary fix since shovel package is broken
  cd /home/#{user}/.pythonbrew/venvs/Python-2.7.3/hutmap/lib/python2.7/site-packages/shovel/ && \
  mkdir templates && \
  cd templates && \
  wget https://raw.github.com/seomoz/shovel/master/shovel/templates/help.tpl && \
  wget https://raw.github.com/seomoz/shovel/master/shovel/templates/results.tpl && \
  cd ../ && \
  mkdir -p static/css/ && \
  cd static/css && \
  wget https://raw.github.com/seomoz/shovel/master/shovel/static/css/style.css
  EOH
  not_if { File.exists?("/home/#{user}/.pythonbrew/venvs/Python-2.7.3/hutmap/lib/python2.7/site-packages/shovel/templates/help.tpl") }
end

package "openjdk-6-jre" do
  action :install
end

package "libfontconfig1" do
  action :install
end

bash "install node" do
  nodejs = "node-v0.10.0-linux-x86"
  code <<-EOH
  cd #{node[:install_dir]}
  wget http://nodejs.org/dist/v0.10.0/#{nodejs}.tar.gz && \
  tar -xzf #{nodejs}.tar.gz && \
  rm #{nodejs}.tar.gz && \
  ln -s #{nodejs} node && \
  chmod -R 755 node
  EOH
  not_if { File.exists?("#{node[:install_dir]}/#{nodejs}/bin/node") }
end

execute "install less" do
  command "#{node[:install_dir]}/node/bin/npm install -g less"
  not_if { File.exists?("#{node[:install_dir]}/node/bin/lessc") }
end

execute "install testacular" do
  command "#{node[:install_dir]}/node/bin/npm install -g testacular"
  not_if { File.exists?("#{node[:install_dir]}/node/bin/testacular") }
end

bash "install phantomjs" do
  phantomjs = "phantomjs-1.8.2-linux-i686" 
  code <<-EOH
  cd #{node[:install_dir]}
  wget http://phantomjs.googlecode.com/files/#{phantomjs}.tar.bz2 && \
  tar -xjf #{phantomjs}.tar.bz2 && \
  rm #{phantomjs}.tar.bz2 && \
  ln -s #{phantomjs} phantomjs && \
  chmod -R 755 phantomjs
  EOH
  not_if { File.exists?("#{node[:install_dir]}/#{phantomjs}/bin/phantomjs") }
end


## Install libraries required by geodjango ##

package "unzip" do
  action :install
end

bash "install geos" do
  code <<-EOH
  cd #{node[:install_dir]}
  wget http://download.osgeo.org/geos/geos-3.2.2.tar.bz2 && \
  tar -xjf geos-3.2.2.tar.bz2 && \
  rm geos-3.2.2.tar.bz2 && \
  cd geos-3.2.2 && \
  ./configure && \
  make && \
  make install
  EOH
  not_if { ::File.exists?("#{node[:usr_libs]}/libgeos_c.so") }
  notifies :run, "execute[ldconfig]", :delayed
end

bash "install proj" do
  code <<-EOH
  cd #{node[:install_dir]}
  wget http://download.osgeo.org/proj/proj-4.7.0.tar.gz && \
  wget http://download.osgeo.org/proj/proj-datumgrid-1.5.zip && \
  tar -xzf proj-4.7.0.tar.gz && \
  cd proj-4.7.0/nad && \
  unzip ../../proj-datumgrid-1.5.zip && \
  rm #{node[:install_dir]}/proj-4.7.0.tar.gz && \
  rm #{node[:install_dir]}/proj-datumgrid-1.5.zip && \
  cd .. && \
  ./configure && \
  make && \
  make install
  EOH
  not_if { ::File.exists?("#{node[:usr_libs]}/libproj.so") }
  notifies :run, "execute[ldconfig]", :delayed
end

bash "install gdal" do
  code <<-EOH
  cd #{node[:install_dir]}
  wget http://download.osgeo.org/gdal/gdal-1.8.0.tar.gz && \
  tar -xzf gdal-1.8.0.tar.gz && \
  rm gdal-1.8.0.tar.gz && \
  cd gdal-1.8.0 && \
  ./configure && \
  make && \
  make install
  EOH
  not_if { ::File.exists?("#{node[:usr_libs]}/libgdal.so") }
  notifies :run, "execute[ldconfig]", :delayed
end

execute "ldconfig" do
  action :nothing
  notifies :restart, "service[apache2]", :delayed
end

