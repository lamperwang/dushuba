class AddUserInfoToUser < ActiveRecord::Migration
  def change
    add_column :users, :real_name, :string
    add_column :users, :unit, :string
    add_column :users, :sex, :smallint
    add_column :users, :identity, :string
  end
end
