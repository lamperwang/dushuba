class UserBookRequest < ActiveRecord::Base
  attr_accessible :user_book_id, :user_id, :user_book, :user, :message, :request_by

  belongs_to :user_book
  belongs_to :user
end
