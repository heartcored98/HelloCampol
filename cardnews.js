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


    // ====== Page Redirection Setting =======//
    $('#redir_request').click(function () {
        window.location.href = 'request.html';
    });

    $('#redir_notice').click(function () {
        window.location.href = 'cardnews.html';
    });

    $('#gohome').click(function () {
        window.location.href = 'index.html';
    })

		// ====== Facebook Upload Setting ====== //
	  window.fbAsyncInit = function() {
			FB.init({
				appId      : '192630588032448',
				xfbml      : true,
				version    : 'v3.0'
			});
			FB.AppEvents.logPageView();
  	};

		(function(d, s, id){
			 var js, fjs = d.getElementsByTagName(s)[0];
			 if (d.getElementById(id)) {return;}
			 js = d.createElement(s); js.id = id;
			 js.src = "https://connect.facebook.net/en_US/sdk.js";
			 fjs.parentNode.insertBefore(js, fjs);
		 }(document, 'script', 'facebook-jssdk'));
	
});