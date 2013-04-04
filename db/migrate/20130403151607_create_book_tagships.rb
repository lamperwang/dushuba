class CreateBookTagships < ActiveRecord::Migration
  def change
    create_table :book_tagships do |t|
      t.integer :book_id
      t.integer :tag_id

      t.timestamps
    end
  end
end
