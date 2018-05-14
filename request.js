// ============== Configuration for DB ========== //
var config = {
    apiKey: "AIzaSyDtevJ9Ote_Blm4vxbTNjB4h9PIpZdXIs4",
    authDomain: "hellocampol-24cae.firebaseapp.com",
    databaseURL: "https://hellocampol-24cae.firebaseio.com",
    projectId: "hellocampol-24cae",
    storageBucket: "",
    messagingSenderId: "439081917926"
};
firebase.initializeApp(config);
var database = firebase.database();
// ============================================== //


$(document).ready(function () {

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

    // ======= initialize variables ======= //
    ref = database.ref("TaskList");
    var task_left = [];
    var task_done = [];
    var task_trash = [];
    var marker_list = [];
    $(".ui.active.centered.inline.text.loader").css("display", "none");


    // ======= Manipulate List Data ======= //
    var update_task = function () {
        document.getElementById('ulcontent').innerHTML = "";
        $(".ui.active.centered.inline.text.loader").css("display", "block");

        ref.once("value", function (snapshot) {
            snapshot.forEach(function (child) {
                var child_value = child.val();
                var key = child.key;
                var coordinate = child_value.coordinate;
                var task = {"key": key, "payload": child_value}
                if (child_value.flag_done == 1) {
                    task_done.push(task);
                }
                else if (child_value.flag_done == 0) {
                    task_left.push(task);
                }
                else {
                    task_trash.push(task);
                }
            });
            redraw_task_left();
            redraw_marker_left();
        });
    };

    // ======= Card Drawing Part ======= //
    var redraw_task_left = function () {
        $(".ui.active.centered.inline.text.loader").css("display", "none");

        if (task_left.length == 0) {
            document.getElementById('ulcontent').innerHTML = "더 이상 할일이 없어요! \n No more Work!";
        }
        else {
            var template = $("#task-left-template").html();

            for (var i = 0; i < task_left.length; i++) {
                // === Drawing Task Bar === //
                var data = task_left[i].payload;
                data["keyvalue"] = task_left[i].key;
                var taskbar = Mustache.render(template, data);
                $("ul").append(taskbar);
            }
        }
        // var key = document.getElementById('cardnews').getAttribute('value');
        // console.log('get key', key);
    }

    var redraw_marker_left = function () {
        if (task_left.length > 0) {
            console.log("clearing marker")
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < marker_list.length; i++) {
                marker_list[i].setMap(null);
            }
            marker_list = [];
            console.log("clear markerlist", marker_list);

            for (var i = 0; i < task_left.length; i++) {
                var data = task_left[i].payload;
                var coordinate = data.coordinate;
                var marker_pos = {lat: coordinate[0], lng: coordinate[1]};
                var marker = new google.maps.Marker({
                    position: marker_pos,
                    map: map
                });
                marker_list.push(marker);
                bounds.extend(marker.position)
            }
            map.fitBounds(bounds);
            if (map.getZoom() > 16) map.setZoom(15);
        }
    }


    var address = "36°22\'23.N 127°21\'E, 37-7 Geumgu-ri, Eoeun-dong, Daejeon";
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (status != google.maps.GeocoderStatus.ZERO_RESULT) {
                map.setCenter()
            }
        }
    })


    update_task();


    $(document).on('click', "#finished", function () {
        var deletecard = $(this).closest("li");
        var deletingKey = deletecard.find("p").html();
        var delete_index = deletecard.index();

        // === Update DB === //
        task_left.splice(delete_index, 1);
        marker_list[delete_index].setMap(null);
        marker_list.splice(delete_index, 1);
        ref.child(deletingKey).update({flag_done: 1});
        deletecard.remove();

        // redraw_marker_left()
    });

    $(document).on('click', "#trashed", function () {
        var deletecard = $(this).closest("li");
        var deletingKey = deletecard.find("p").html();
        var delete_index = deletecard.index();

        // === Update DB === //
        task_left.splice(delete_index, 1);
        marker_list[delete_index].setMap(null);
        marker_list.splice(delete_index, 1);
        ref.child(deletingKey).update({flag_done: -1});
        deletecard.remove();

        // redraw_marker_left()
    });

    $(document).on('click', "#lowerbar", function () {
        var changing_card = $(this).closest("li");
        var variable_content = changing_card.find("#variable_content");
        var expand_message = changing_card.find("#expand_message");

        if (variable_content.css("display") === "none") {
            variable_content.show();
            expand_message.html("Hide" + "<i class='angle up icon'></i>")
        } else {
            variable_content.hide();
            expand_message.html("Show more" + "<i class='angle down icon'></i>")
        }
    })

    /*
        var data = {
            label: '"ui red horizontal label"',
            category: "Repair",
            title: "There is a cat on the tree! It needs help!",
            content: "Something is here",
            location: "N13-1 shinhakguan",
            request_date: "2018-03-25"
        };
        */
});


