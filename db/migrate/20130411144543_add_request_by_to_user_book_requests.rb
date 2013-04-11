class AddRequestByToUserBookRequests < ActiveRecord::Migration
  def change
    add_column :user_book_requests, :request_by, :string
  end
end
