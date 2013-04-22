class HomeController < ApplicationController
  
  
  
  def index
    
    @books = Book.joins(:users).where(:id=>0..100000).order("created_at");
    
    render :layout => false
  end
  
  def login
    
    redirect_to '/users/sign_in'
    return
    
    render :layout => false
    
  end
  
  def signup
    redirect_to '/users/sign_up'
    return
    
    render :layout => false
    
  end
  
  def forgotpassword
    redirect_to '/users/password/new'
    return
    render :layout => false
    
  end
end
