class Tag < ActiveRecord::Base
  attr_accessible :name
  
  has_many :book_tagships
  has_many :books, :through=>:book_tagships
  
  
end
