class CreateTags < ActiveRecord::Migration
  def change
    create_table :tags do |t|
      t.string :name
      t.references :book

      t.timestamps
    end
    add_index :tags, :book_id
  end
end
