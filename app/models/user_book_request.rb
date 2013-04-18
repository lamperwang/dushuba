class UserBookRequest < ActiveRecord::Base
  attr_accessible :user_book_id, :request_by_id, :user_book, :request_user, :message, :request_by

  belongs_to :user_book, :include=>:book
  #has_one :book, :through=>:user_book
  
  belongs_to :request_user, :class_name=>"User", :foreign_key=>'request_by_id'
end
