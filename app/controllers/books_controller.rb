# encoding: utf-8

class BooksController < ApplicationController

  before_filter :authenticate_user!


  # GET /books
  # GET /books.json
  def index
    @books = Book.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @books }
    end
  end

  # GET /books/1
  # GET /books/1.json
  def show
    @book = Book.find(params[:id])
    @comments = @book.comments;
    @users = @book.users;

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @book }
    end
  end

  # GET /books/new
  # GET /books/new.json
  def new
    @book = Book.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @book }
    end
  end

  # GET /books/1/edit
  def edit
    @book = Book.find(params[:id])
  end

  # POST /books
  # POST /books.json
  def create
    
    isbn = params[:book][:isbn]
    
    @book = Book.find_by_isbn(isbn)
    
    
    if(!@book)
      
      
    
      data = Douban.book(isbn).parsed_response

      if(data['code']==6000)
        respond_to do |format|
          format.html { render action: "new", notice:'ISBN不存在' }
          format.json { render :json=>{:ret=>1, :html=>"ISBN不存在"} }
        end
        return
      end
    
      tmpPath = '/tmp/xxxxa'+rand(10000).to_s+'.jpg'
    
      Douban.download_to_file(data['images']['large'],tmpPath)
      
      tmpfile = File.open(tmpPath,'rb');
      
      @book = Book.new do  |b|
        b.isbn = isbn
        b.cover = tmpfile;
        b.name = data['title']
        b.publish_year = data['pubdate']
        b.package = data['binding']
        b.author = data['author']
        b.description = data['summary']
        b.publish_by = data['publisher']
        b.price = data['price']
        b.pages = data['pages']
      end
      
      data['tags'].each do |tag|
        
        @t = Tag.where(:name=>tag['name']).first
        if(!@t)
          @t = Tag.new(:name=>tag['name'])
          @t.save()
        end
        
        @bt = BookTagship.new(:tag=>@t, :book=>@book)
        @bt.save()
      end
   
    end
    
    
    


    respond_to do |format|
      if @book.save 
        
        @userbook = UserBook.find_by_user_and_book(current_user, @book)
        if(!@userbook)
          @userbook = UserBook.new(:user=>current_user, :book=>@book)
        
          @userbook.save 
          
        end
        
         
        format.html { redirect_to @book, notice: 'Book was successfully created.' }
        format.json { render :json=>{:ret=>0,:location=>url_for( @book)}, location: @book }
      else
        format.html { render action: "new" }
        format.json { render :json=>{:ret=>2, :error=>@book.error}, status: :unprocessable_entity }
      end
      
      if(tmpPath)
        File.unlink(tmpPath)
      end
    end
  end

  # PUT /books/1
  # PUT /books/1.json
  def update
    @book = Book.find(params[:id])

    respond_to do |format|
      if @book.update_attributes(params[:book])
        format.html { redirect_to @book, notice: 'Book was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @book.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /books/1
  # DELETE /books/1.json
  def destroy
    @book = Book.find(params[:id])
    @book.destroy

    respond_to do |format|
      format.html { redirect_to books_url }
      format.json { head :no_content }
    end
  end
  
  def tag
    
    @tag = Tag.where(:name=>params[:id]).first
    if(!@tag)
      respond_to do |format|
        format.html { redirect_to books_url, notice: params[:id] + ' not exists!'}
      end
    else
      @books = @tag.books
      
    end
    
  end
  
  def requestbook

    user_id = params[:user_id]
    book_id = params[:book_id]
    message = params[:message]

    @user_book = UserBook.where(:user_id=>user_id, :book_id=>book_id).first

    respond_to do |format|
      @user_book_request = UserBookRequest.new(:user_book=>@user_book,:user=>current_user, :message=>message, :request_by=>current_user.nickname)
      @user_book_request.save() 
      format.json {render :json=>{:ret=>0, :data=>'Request send successful!'} }
    end


  end


end
