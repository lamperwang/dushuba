class AddPublishByToBooks < ActiveRecord::Migration
  def change

    add_column:books, :publish_by, :string

  end
end
