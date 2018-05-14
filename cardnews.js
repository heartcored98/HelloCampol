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

});