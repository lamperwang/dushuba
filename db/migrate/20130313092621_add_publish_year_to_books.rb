class AddPublishYearToBooks < ActiveRecord::Migration
  def change

    add_column:books, :publish_year, :string
    add_column:books, :package, :string

  end
end
