class ProfileController < ApplicationController
  before_filter :authenticate_user!
  
  def index
    
    if current_user
      redirect_to :action=>'show', :id=>@current_user.id
    end
  end

  def show
    
    @user = User.find(params[:id])

    @RequestMyBooks=UserBookRequest.joins(:user_book, ' and user_books.user_id='+@user.id.to_s).joins(:request_user)


    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @user}
    end

  end

end
