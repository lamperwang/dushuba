class AddStatusToUserBookRequest < ActiveRecord::Migration
  def change
    add_column :user_book_requests, :status, :smallint,:default=>0
  end
end
