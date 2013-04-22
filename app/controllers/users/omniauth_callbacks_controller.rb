class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def github
    @user = User.find_for_github_oauth(request.env["omniauth.auth"], current_user)

    if @user.persisted?
      
      if @user.is_actived?
      
        sign_in @user
        redirect_to new_user_registration_url
      else
        session['user_id'] = @user.id
        redirect_to '/profile/confirm'
      end
      
      
      #sign_in_and_redirect @user, :event => :authentication #this will throw if @user is not activated
      set_flash_message(:notice, :success, :kind => "Github") if is_navigational_format?
    else
      session["devise.github_data"] = request.env["omniauth.auth"]
      redirect_to new_user_registration_url
    end
  end

  def tqq2
    @user = User.find_for_tqq_oauth(request.env["omniauth.auth"], current_user)


    if @user.persisted?
      if @user.is_actived?
      
        sign_in @user
        redirect_to new_user_registration_url
      else
        session['user_id'] = @user.id
        redirect_to '/profile/confirm'
      end
      
      #sign_in_and_redirect @user, :event => :authentication #this will throw if @user is not activated
      set_flash_message(:notice, :success, :kind => "腾讯微博") if is_navigational_format?
    else
      session["devise.tqq2_data"] = request.env["omniauth.auth"]
      redirect_to new_user_registration_url
    end 
  end

  def qq_connect
    @user = User.find_for_qq_oauth(request.env["omniauth.auth"], current_user)


    if @user.persisted?
      if @user.is_actived?
      
        sign_in @user
        redirect_to new_user_registration_url
      else
        session['user_id'] = @user.id
        redirect_to '/profile/confirm'
      end
      
      
      #sign_in_and_redirect @user, :event => :authentication #this will throw if @user is not activated
      set_flash_message(:notice, :success, :kind => "QQ") if is_navigational_format?
    else
      session["devise.qq_data"] = request.env["omniauth.auth"]
      redirect_to new_user_registration_url
    end
  end

  def weibo 
    @user = User.find_for_weibo_oauth(request.env["omniauth.auth"], current_user)


    if @user.persisted?
      
      if @user.is_actived?
      
        sign_in @user
        redirect_to new_user_registration_url
      else
        session['user_id'] = @user.id
        redirect_to '/profile/confirm'
      end
      
      #sign_in_and_redirect @user, :event => :authentication #this will throw if @user is not activated
      set_flash_message(:notice, :success, :kind => "微博") if is_navigational_format?
      
    
    else
      session["devise.weibo_data"] = request.env["omniauth.auth"]
      redirect_to new_user_registration_url
    end
  end
  
  
  
  
  

end
