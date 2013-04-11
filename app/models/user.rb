class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable, :omniauth_providers => [:qq_connect, :weibo, :tqq2, :github ]

  # Setup accessible (or protected) attributes for your model
  attr_accessible :nickname, :email, :password, :password_confirmation, :remember_me
  attr_accessible :provider, :uid, :head

  has_many :user_books, :dependent => :destroy 
  has_many :books, :through=>:user_books
  has_many :user_book_requests

  def self.find_for_github_oauth(auth, signed_in_resource=nil)

    user = User.where(:provider => auth.provider, :uid => auth.uid).first
    unless user
      user = User.create(
			 nickname:auth.extra.raw_info.login,
                         provider:auth.provider,
                         uid:auth.uid,
                         email:auth.info.email,
                         password:Devise.friendly_token[0,20]
                         )
    end
    user
  end

  def self.find_for_tqq_oauth(auth, signed_in_resource=nil)
    
    #puts auth.extra

    user = User.where(:provider => auth.provider, :uid => auth.uid).first
    unless user
      email = auth.uid+"@t.qq.com"
      head = auth.info.image+'/100' if auth.info.image
      user = User.create(
                         nickname:auth.info.nickname,
                         provider:auth.provider,
                         uid:auth.uid,
                         email:email,
                         password:Devise.friendly_token[0,20],
                         head:head
                         )
                         
                         
    end
    user
  end

  def self.find_for_qq_oauth(auth, signed_in_resource=nil)
  
    user = User.where(:provider => auth.provider, :uid => auth.uid).first
    unless user
      email = auth.uid+"@qq.com"
      head = auth.extra.raw_info.figureurl_2 
      user = User.create(
                         nickname:auth.info.nickname,
                         provider:auth.provider,
                         uid:auth.uid,
                         email:email,
                         password:Devise.friendly_token[0,20],
                         head:head
                         )
    end
    user
  end

  def self.find_for_weibo_oauth(auth, signed_in_resource=nil)

    #puts auth

    user = User.where(:provider => auth.provider, :uid => auth.uid).first
    unless user
      uid = auth.uid
      email = auth.extra.raw_info.name+"@weibo.com"
      head = auth.extra.raw_info.avatar_large if auth.extra.raw_info.avatar_large
      user = User.create(
                         nickname:auth.extra.raw_info.nickname,
                         provider:auth.provider,
                         uid:uid,
                         email:email,
                         password:Devise.friendly_token[0,20],
                         head:head
                         )

      puts user
    end
    user
  end
  def self.new_with_session(params, session)
    super.tap do |user|
      if data = session["devise.github_data"] && session["devise.github_data"]["extra"]["raw_info"]
        user.email = data["email"] if user.email.blank?
      end
    end
  end

end
