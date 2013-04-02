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
    
    @book = Book.find_by_isbn(params[:book][:isbn])
    
    
    if(!@book)
      
      @book = Book.new(params[:book])
    
      data = Douban.book(params[:book][:isbn]).parsed_response

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
    
      @book.cover = tmpfile;
    
      @book.name = data['title']
      @book.publish_year = data['pubdate']
      @book.package = data['binding']
      @book.author = data['author']
      @book.description = data['summary']
      @book.publish_by = data['publisher']
      @book.price = data['price']
      @book.pages = data['pages']
      
      
    else
      
      
      
      
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
end
