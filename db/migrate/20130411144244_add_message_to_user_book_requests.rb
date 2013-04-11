class AddMessageToUserBookRequests < ActiveRecord::Migration
  def change
    add_column :user_book_requests, :message, :text
  end
end
