module BooksHelper

 def join_tags(post)
    post.tags.collect { |t| link_to t.name, "/books/tag/"+t.name}.join(", ").html_safe
  end

end
