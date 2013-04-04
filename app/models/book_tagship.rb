class BookTagship < ActiveRecord::Base
  attr_accessible :book_id, :tag_id, :book, :tag
  
  belongs_to :book
  belongs_to :tag
end