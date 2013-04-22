class UserInvite < ActiveRecord::Base
  attr_accessible :invite_code, :real_name, :sex, :unit, :status
end
