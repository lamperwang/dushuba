class AddRequestByIdToUserBookRequest < ActiveRecord::Migration
  def change
    add_column :user_book_requests, :request_by_id, :integer
    remove_column :user_book_requests, :user_id
  end
end
