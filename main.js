$( document ).ready(function() {

	/* Code of Granim.js
    var granimInstance = new Granim({
        element: '#logo-canvas',
        direction: 'left-right',
        opacity: [1, 1],
        states : {
            "default-state": {
                gradients: [
                    ['#6f97ff', '#56ccff'],
                    ['#0a4692', '#03125c'],
                    ['#497ed0', '#497ed0'],
					['#00033b', '#130950']
                ],
                transitionSpeed: 7000
            }
        }
    });
    granimInstance;
    */

	$('#todo').click(function() {
		window.location.href='request.html';
	})

	$('#compl').click(function() {
		window.location.href='completed.html';
	})
	
	$('#notice').click(function() {
		window.location.href='cardnews.html';
	})
	
})