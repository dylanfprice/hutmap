include_recipe "apt"
include_recipe "vim"
include_recipe "passenger_apache2::mod_rails"
include_recipe "mysql::server"

## MySQL config ##

template "/etc/mysql/hutmap_grants.sql" do
  source "hutmap_grants.sql.erb"
  owner "root"
  group "root"
  mode "0600"
  action :create
end

execute "mysql install application privileges" do
  command "/usr/bin/mysql -u root "\
    "#{node['mysql']['server_root_password'].empty? ? '' : '-p'} "\
    "'#{node['mysql']['server_root_password']}' < /etc/mysql/hutmap_grants.sql"
  action :nothing
  subscribes :run, "template[/etc/mysql/hutmap_grants.sql]", :immediately
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

template "/etc/profile.d/hutmap.sh" do
  source "hutmap.sh.erb"
  mode "644"
  action :create_if_missing
end


## Install Python and modules ##

package "python2.6" do
  action :install
  notifies :reload, "service[apache2]", :delayed
end

package "python2.6-dev" do
  action :install
end

package "python-setuptools" do
  action :install
end

bash "install python modules" do
  code <<-EOH
  easy_install pip
  pip install distribute --upgrade
  pip install pip --upgrade
  pip install "http://pypi.python.org/packages/source/M/MySQL-python/MySQL-python-1.2.4b4.tar.gz#md5=0958cb9c23d5a656caac031c4886b1cf"
  pip install "django==1.2.7"
  pip install "mimeparse==0.1.3"
  pip install "python-dateutil==1.5"
  pip install "django-tastypie==0.9.11"
  EOH
end


## Install libraries required by geodjango ##

bash "install geos" do
  code <<-EOH
  cd /usr/src
  wget http://download.osgeo.org/geos/geos-3.2.2.tar.bz2
  tar -xjf geos-3.2.2.tar.bz2
  cd geos-3.2.2
  ./configure
  make
  make install
  EOH
  not_if { ::File.exists?("#{node[:usr_libs]}/libgeos_c.so") }
  notifies :run, "execute[ldconfig]", :delayed
end

bash "install proj" do
  code <<-EOH
  cd /usr/src
  wget http://download.osgeo.org/proj/proj-4.7.0.tar.gz
  wget http://download.osgeo.org/proj/proj-datumgrid-1.5.zip
  tar -xzf proj-4.7.0.tar.gz
  cd proj-4.7.0/nad
  unzip ../../proj-datumgrid-1.5.zip
  cd ..
  ./configure
  make
  make install
  EOH
  not_if { ::File.exists?("#{node[:usr_libs]}/libproj.so") }
  notifies :run, "execute[ldconfig]", :delayed
end

bash "install gdal" do
  code <<-EOH
  cd /usr/src
  wget http://download.osgeo.org/gdal/gdal-1.8.0.tar.gz
  tar -xzf gdal-1.8.0.tar.gz
  cd gdal-1.8.0
  ./configure
  make
  make install
  EOH
  not_if { ::File.exists?("#{node[:usr_libs]}/libgdal.so") }
  notifies :run, "execute[ldconfig]", :delayed
end

execute "ldconfig" do
  action :nothing
  notifies :restart, "service[apache2]", :delayed
end

