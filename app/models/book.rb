class Book < ActiveRecord::Base
  attr_accessible :cover, :publish_by, :publish_year, :package, :pages, :price, :author, :description, :isbn, :name, :tags_attributes

  #include Paperclip::Glue

  has_attached_file :cover, 
    :default_style => :thumb,
    :url => "/uploadfiles/:class/:attachment/:id/:basename/:style.:extension",
    :path => ":rails_root/public/uploadfiles/:class/:attachment/:id/:basename/:style.:extension",
    :styles => { :medium => "300x441>", :thumb => "100x147>" }, :default_url => "/images/:style/missing.png"

  validates_attachment_content_type :cover, :content_type => 'image/jpeg'

  validates :name,  :presence => true
  validates :isbn,  :presence => true,
                    :length => { :minimum => 5 }










  has_many :user_books, :dependent => :destroy
  has_many :user, :through=>:user_books

  has_many :comments, :dependent => :destroy
  has_many :tags, :dependent => :destroy
 
  accepts_nested_attributes_for :tags, :allow_destroy => :true,
    :reject_if => proc { |attrs| attrs.all? { |k, v| v.blank? } }

end
