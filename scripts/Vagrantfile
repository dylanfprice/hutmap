Vagrant::Config.run do |config|
  config.vm.box = 'lucid32'
  config.vm.forward_port 80, 8080

  # Enable and configure the chef solo provisioner
  config.vm.provision :chef_solo do |chef|
    chef.add_recipe('hutmap_main')
    chef.json = {
      :mysql => {
        :server_debian_password => 'debian',
        :server_root_password   => 'vagrant',
        :server_repl_password   => 'repl',
      },
      :usr_libs => '/usr/local/lib',
      :hutmap => {
        :db => {
          :name     => ENV['HUTMAP_DB_NAME'],
          :user     => ENV['HUTMAP_DB_USER'],
          :password => ENV['HUTMAP_DB_PASSWORD'],
          :host     => ENV['HUTMAP_DB_HOST'],
          :port     => ENV['HUTMAP_DB_PORT'],
        },
        :secret_key     => ENV['HUTMAP_SECRET_KEY'],
        :debug          => ENV['HUTMAP_DEBUG'],
        :template_debug => ENV['HUTMAP_TEMPLATE_DEBUG'],
      },
    }
  end
end
