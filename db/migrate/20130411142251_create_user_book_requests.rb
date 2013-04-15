class CreateUserBookRequests < ActiveRecord::Migration
  def change
    create_table :user_book_requests do |t|
      t.integer :user_book_id
      t.integer :user_id

      t.timestamps
    end
  end
end
