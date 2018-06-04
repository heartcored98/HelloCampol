$(document).ready(function () {
    var swiper = new Swiper('.swiper-container', {

        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 3,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    //====== Card News Loading Functions ======//
    $("#trafficimg").click(function () {
        window.location.href='cardnews_1.html';
    });

    $("#dormitoryimg").click(function () {
        window.location.href='cardnews_2.html';
    });

    $("#laboratoryimg").click(function () {
        window.location.href='cardnews_3.html';
    });

    $("#drinkingimg").click(function () {
        window.location.href='cardnews_4.html';
    });

    $("#trafficimgf").click(function () {
        console.log("1")
        window.location.href='cardnews_1.html';
    });

    $("#dormitoryimgf").click(function () {
        window.location.href='cardnews_2.html';
    });

    $("#laboratoryimgf").click(function () {
        window.location.href='cardnews_3.html';
    });

    $("#drinkingimgf").click(function () {
        window.location.href='cardnews_4.html';
    });

    // ========== upload setting ========= //

    $("#snsupload").click(function(){
        var text = $("#inputbox").val();
        $("#viewcont").text(text);

        deletecard = $(this).closest("li");
        deletingKey = deletecard.find("p").html();
        delete_index = deletecard.index();
        $("#TempModal").fadeIn();
        $("#ModalBox").fadeIn();
    })

    $(document).on('click', ".DeleteRequest", function () {
        for (var i=0; i<2; i++){
            if (i==0){
                $("#ModalBox").fadeOut();
                $("#completeBox").fadeIn();

            }
            if (i==1){
                setTimeout(function() {
                    $("#TempModal").fadeOut();
                    $("#completeBox").fadeOut();
                }, 2000);
            }
        }


    });

    $(document).on('click', ".CancelDelete", function () {
        $("#TempModal").fadeOut();
        $("#ModalBox").fadeOut();
    });

 // img expanding
    var $button = $(".swiper-slide")
        $target = $('#lightbox-overlay'),
		$targetImg = $target.find('img');
    $button.click(function(){
		var newImg = $(this).find('img').attr('src');
		$target.addClass('visible');
		$targetImg.attr('src', newImg);
	});
	$target.click(function(){
		$target.removeClass('visible');
	});


    // ====== Page Redirection Setting =======//
    $('#redir_request').click(function () {
        window.location.href = 'request.html';
    });

    $('#redir_compl').click(function () {
        window.location.href = 'completed.html';
    });	
	
    $('#redir_notice').click(function () {
        window.location.href = 'cardnews.html';
    });

    $('#gohome').click(function () {
        window.location.href = 'index.html';
    })

});