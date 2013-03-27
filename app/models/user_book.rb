class UserBook < ActiveRecord::Base
  attr_accessible :book, :user

  belongs_to:user
  belongs_to:book

end
