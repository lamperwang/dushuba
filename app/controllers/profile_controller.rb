class ProfileController < ApplicationController
  before_filter :authenticate_user!, :only=>[:index,:show]
  
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
  
  def confirm
    
    
    
    if session['id'].nil?
    
      @user = User.find(session['user_id'])
      
      
      if params[:user]
        @user.email = params[:user][:email] 
        @user.nickname = params[:user][:nickname] 
        @user.identity = params[:user][:identity] 
        @user.real_name = params[:user][:real_name] 
        
        @ui = UserInvite.where(:invite_code=>@user.identity, :real_name=>@user.real_name).first
        
        if @ui.nil?
          flash[:error] = "读者编号和姓名不匹配，请输入正确的编号和姓名"
        else
          if @ui.status!=0
            flash[:error] = "读者编号已经被使用"
          else
            if @user.update_without_password(params[:user])
              
              @ui.status=1
              @ui.save
              sign_in @user
              flash[:notice] = "您的资料保存成功"
              redirect_to '/profile'
            else
              flash[:error] = @user.errors.full_messages
            end
          end
          
          
        end
        
     end   
        
      
    else
      redirect_to '/users/sign_in'
    end
    
    
    
  end

end
