// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require twitter/bootstrap
//= require_tree .

$(function(){
  /* Your javascripts goes here... */




	$('.requestbook').on('click',function(){
		
		$('#requestbookModal').modal({center:true,show:true});
		$('.modalTitle').html("向"+ $(this).attr('nickname')+"借《"+$('#bookName').html()+"》，说点啥：");
		return false;
		
		
	});

    $("#comments a").on('click',  function(event) {
        event.preventDefault(); // prevent the click from linking anywhere

		$('#delCommentModal').modal({center:true,show:true});
		$('#btnDelComment').attr('url', $(this).attr('href'));
		$('#btnDelComment').attr('cid', $(this).attr('cid'));
		return false;
    });


    $('#btnDelComment').on('click',function(){

		var id = $(this).attr('cid');
		var url = $(this).attr('url');
	

		$.ajax({
            url:url,
            dataType:'json',
            data: {'id':id}, // send whatever here...
            type: 'DELETE',
            success:function(data){
                if(data.ret==0){
					$('#delCommentModal').modal('hide');
					$('#comment_'+id).fadeOut(2000);
				} 
				else alert(data.data);
            },
			error:function(data){
				alert(data.data);
			}
        });

		return false;
    });  


	

});

$(function(){
	$("input[type=file]").change(function(){$(this).parents(".uploader").find(".filename").val($(this).val());});
	$("input[type=file]").each(function(){
	if($(this).val()==""){$(this).parents(".uploader").find(".filename").val("No file selected...");}
	});
});
