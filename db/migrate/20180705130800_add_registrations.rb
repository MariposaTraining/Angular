class AddRegistrations < ActiveRecord::Migration
  def change
    create_table :registrations do |t|
      t.string :first_name
      t.string :last_name
      t.string :email_address
      t.string :facility_soid
      t.string :facility
      t.string :associations, array: true
      t.string :roles, array: true
      t.string :user_id
    end
  end
end
