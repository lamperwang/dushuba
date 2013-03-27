class CommentsController < ApplicationController

  def create
    @book = Book.find(params[:book_id])

     
    @comment = @book.comments.new(params[:comment])
     @comment.commenter = current_user.nickname

     respond_to do |format|

	if @comment.save

           format.html {redirect_to book_path(@book)}
	    format.json {render:json=>{:ret=>0, :data=>@comment, :html=>"<div>save ok</div>"}}
	end

     end
  end
 
  def destroy
    @book = Book.find(params[:book_id])
    @comment = @book.comments.find(params[:id])
    @comment.destroy
    #redirect_to book_path(@book)

    respond_to do |format|
	format.html {redirect_to book_path(@book)}
        format.json {render:json=>{:ret=>0, :data=>'destroy ok'}}
    end

  end

end
