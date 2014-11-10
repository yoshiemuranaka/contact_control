require 'active_record'

ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'] || 'postgres://localhost/contact_list')

# ActiveRecord::Base.establish_connection({
#   :adapter => "postgresql",
#   :host => "localhost",
#   :username => "yoshiemuranaka",
#   :database => "contact_list"
# })

ActiveRecord::Base.logger = Logger.new(STDOUT)
