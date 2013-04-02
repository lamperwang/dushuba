class UserBook < ActiveRecord::Base
  attr_accessible :book, :user

  belongs_to:user
  belongs_to:book
  
  def self.find_by_user_and_book(user, book)
    self.where(:user_id=>user.id, :book_id=>book.id).first
  end

end
