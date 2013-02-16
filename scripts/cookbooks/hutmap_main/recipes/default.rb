include_recipe "apt"
include_recipe "vim"
include_recipe "passenger_apache2::mod_rails"
include_recipe "mysql::server"

## Variables ##
hutmap_grants = "/etc/mysql/hutmap_grants.sql"
profile = "/etc/profile.d/hutmap.sh"
install_dir = "/usr/src"

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


## Install dev dependencies ##

package "subversion" do
  action :install
end

package "unzip" do
  action :install
end

package "openjdk-6-jre" do
  action :install
end

bash "download closure-library" do
  code <<-EOH
  cd #{install_dir}
  svn checkout http://closure-library.googlecode.com/svn/trunk/ closure-library && \
  chmod -R 755 closure-library/ && \
  echo 'export HUTMAP_CLOSURE_LIBRARY="#{install_dir}/closure-library"' >> #{profile}
  EOH
  not_if { File.exists?("#{install_dir}/closure-library/closure/bin/build/closurebuilder.py") }
end

bash "download closure-compiler" do
  code <<-EOH
  cd #{install_dir}
  wget https://closure-compiler.googlecode.com/files/compiler-latest.zip && \
  mkdir -p closure-compiler && \
  unzip -d closure-compiler compiler-latest.zip && \
  rm compiler-latest.zip && \
  chmod -R 755 closure-compiler/ && \
  echo 'export HUTMAP_CLOSURE_COMPILER="#{install_dir}/closure-compiler/compiler.jar"' >> #{profile}
  EOH
  not_if { File.exists?("#{install_dir}/closure-compiler/compiler.jar") }
end

bash "download closure-templates" do
  code <<-EOH
  cd #{install_dir}
  wget https://closure-templates.googlecode.com/files/closure-templates-for-javascript-latest.zip && \
  mkdir -p closure-templates && \
  unzip -d closure-templates/ closure-templates-for-javascript-latest.zip && \
  rm closure-templates-for-javascript-latest.zip && \
  chmod -R 755 closure-templates/ && \
  echo 'export HUTMAP_CLOSURE_TEMPLATES="#{install_dir}/closure-templates/SoyToJsSrcCompiler.jar"' >> #{profile}
  EOH
  not_if { File.exists?("#{install_dir}/closure-templates/SoyToJsSrcCompiler.jar") }
end


## Install libraries required by geodjango ##

bash "install geos" do
  code <<-EOH
  cd #{install_dir}
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
  cd #{install_dir}
  wget http://download.osgeo.org/proj/proj-4.7.0.tar.gz && \
  wget http://download.osgeo.org/proj/proj-datumgrid-1.5.zip && \
  tar -xzf proj-4.7.0.tar.gz && \
  cd proj-4.7.0/nad && \
  unzip ../../proj-datumgrid-1.5.zip && \
  rm #{install_dir}/proj-4.7.0.tar.gz && \
  rm #{install_dir}/proj-datumgrid-1.5.zip && \
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
  cd #{install_dir}
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

