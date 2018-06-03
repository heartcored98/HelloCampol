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

    // ========== upload setting ========= //

    $("#snsupload").click(function(){
        clickfunction = function (callback){
            $("#hide").toggleClass("none");
            $("#uploadalarm").toggleClass("none");
            $("#yes").toggleClass("none");
            $("#cancel").toggleClass("none");
            callback();
        }

        clickfunction(function(){
            $("#hide").animate({
                opacity: '1'
            }, 500)
            $("#uploadalarm").animate({
                opacity: '1'
            }, 500)
            $("#yes").animate({
                opacity: '1'
            }, 500)
            $("#cancel").animate({
                opacity: '1'
            }, 500)
        })
    })

    $("#yes").click(function(){
        $("#uploadalarm").animate({
            opacity: '0'
        }, 500, function(){
            $("#uploadalarm").toggleClass("none")
        });
        $("#yes").animate({
            opacity: '0'
        }, 500, function(){
            $("#yes").toggleClass("none")
        });
        $("#cancel").animate({
            opacity: '0'
        }, 500, function(){
            $("#cancel").toggleClass("none")
        });
        $("#complete").toggleClass("none");
        $("#complete").animate({
            opacity: '1'
        }, 500, function(){
                setTimeout(function(){
                    $("#hide").animate({
                        opacity: '0'
                    }, 500, function(){
                        $("#hide").toggleClass("none")
                    });
                    $("#complete").animate({
                        opacity: '0'
                    }, 500, function(){
                        $("#complete").toggleClass("none")
                    });
                }, 1000);
        });
    });


    $("#cancel").on('click', function(){

        $("#hide").animate({
            opacity: '0'
        }, 500, function(){
            $("#hide").toggleClass("none")
        });
        $("#uploadalarm").animate({
            opacity: '0'
        }, 500, function(){
            $("#uploadalarm").toggleClass("none")
        });
        $("#yes").animate({
            opacity: '0'
        }, 500, function(){
            $("#yes").toggleClass("none")
        });
        $("#cancel").animate({
            opacity: '0'
        }, 500, function(){
            $("#cancel").toggleClass("none")
        });

    });
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