class AddTimestamps < ActiveRecord::Migration
  def change
    add_column :registrations, :created_at, :datetime
    add_column :registrations, :updated_at, :datetime
  end
end
