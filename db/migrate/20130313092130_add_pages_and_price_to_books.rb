class AddPagesAndPriceToBooks < ActiveRecord::Migration
  def change

    add_column:books, :pages, :integer
    add_column:books, :price, :float


  end
end
