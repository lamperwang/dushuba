class Book < ActiveRecord::Base
  attr_accessible :cover, :publish_by, :publish_year, :package, :pages, :price, :author, :description, :isbn, :name, :tags_attributes

  #include Paperclip::Glue

  has_attached_file :cover,
    :default_style => :thumb,
    :url => "/uploadfiles/:class/:attachment/:id/:basename/:style.:extension",
    :path => ":rails_root/public/uploadfiles/:class/:attachment/:id/:basename/:style.:extension",
    :styles => { :medium => "103x143>", :thumb => "68x95>", :large=>"309x429" }, :default_url => "/images/:style/missing.png"

  validates_attachment_content_type :cover, :content_type => 'image/jpeg'

  validates :name,  :presence => true
  validates :isbn,  :presence => true,
                    :length => { :minimum => 5 }



  has_many :user_books, :dependent => :destroy
  has_many :users, :through=>:user_books

  has_many :comments, :dependent => :destroy
  has_many :book_tagships, :dependent => :destroy
  has_many :tags, :through=> :book_tagships
  
 
  accepts_nested_attributes_for :tags, :allow_destroy => :true,
    :reject_if => proc { |attrs| attrs.all? { |k, v| v.blank? } }
    
  def self.find_by_isbn(isbn)
    where("isbn=?", isbn).first
  
  end

end
