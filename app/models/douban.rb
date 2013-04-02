require 'httparty'

class Douban
  
  include HTTParty
  
  base_uri 'https://api.douban.com/v2/book/isbn'
  
  format :json
  
  def self.book(id)
    
    get "/"+id.to_s
  end
  
  
  def self.download_to_file(_url,save_path)  
      return unless _url  
      begin  
        open(_url) { |bin|  
          size=bin.size  
          return if @max_file_size&&size>@max_file_size||@min_file_size&&size<@min_file_size           
          
          File.open(save_path,'wb') { |f|  
            while buf = bin.read(1024)  
              f.write buf  
              STDOUT.flush  
            end  
          }
        }  
      rescue Exception=>e  
        puts e
        return  
      end  
      puts "File has save to #{save_path}!!"  
  end  

end
