Rails.application.config.middleware.use OmniAuth::Builder do
  provider :tqq, '801337824', '4bfb06b87385d0dbf089e26213f4406b' 

  provider :google_oauth2, 'dushuba.baoguang.info', 'WS0f3r4UDlztmNjWtCalvZ8t',
	   {
	     :scope => "userinfo.email, userinfo.profile,plus.me",
	     :approval_prompt => "auto"
	   }

end
