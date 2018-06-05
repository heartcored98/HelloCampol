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

    // ======= Reset Button ======= //
    $('#reset').click(function () {
        ref.once("value", function (snapshot) {
            snapshot.forEach(function (child) {
                var key = child.key;
                ref.child(key).update({flag_done: 0});
                console.log('reset', key)
            });
        });
    })
    // ======= initialize variables ======= //
    ref = database.ref("TaskList");
    var task_left = [];
    var task_done = [];
    var task_trash = [];
    var marker_list = [];

    var count_danger = 0;
    var count_living = 0;
    var count_repair = 0;

    var deletecard;
    var deletingKey;
    var delete_index;
    $(".ui.active.centered.inline.text.loader").css("display", "none");


    // ======= Manipulate List Data ======= //
    var update_task = function () {
        document.getElementById('ulcontent').innerHTML = "";
        $(".ui.active.centered.inline.text.loader").css("display", "block");

        ref.once("value", function (snapshot) {
            if (snapshot.length == 0) {
                document.getElementById('ulcontent').innerHTML = '<div id="EmptySigner"><img class="logo" src="assets/miniLogo.svg"><p id="spacer">현재 해야될 일이 없군요!</p></div>';
            }
            snapshot.forEach(function (child) {
                var child_value = child.val();
                var key = child.key;
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
            console.log(count_danger, count_living, count_repair);
            redraw_task_left();
            redraw_marker_left();
            redraw_label_count();
        });
    };

    // ======= Card Drawing Part ======= //
    var redraw_task_left = function () {
        $(".ui.active.centered.inline.text.loader").css("display", "none");

        if (task_left.length == 0) {
            document.getElementById('ulcontent').innerHTML = '<div id="EmptySigner"><img class="logo" src="assets/miniLogo.svg"><p id="spacer">현재 해야될 일이 없군요!</p></div>';
        }
        else {
            var template_danger = $("#task-left-template-danger").html();
            var template_repair = $("#task-left-template-repair").html();
            var template_living = $("#task-left-template-living").html();

						for (var i = 0; i < task_left.length; i++) {
                // === Drawing Task Bar === //
                var data = task_left[i].payload;
                var category = data.category;
                data["keyvalue"] = task_left[i].key;
                if (category == '긴급') var taskbar = Mustache.render(template_danger, data);
                if (category == '수리') var taskbar = Mustache.render(template_repair, data);
                if (category == '생활') var taskbar = Mustache.render(template_living, data);
                $("ul").append(taskbar);
            }
        }
    };

    // ======= Marker Drawing Part ======= //
    var redraw_marker_left = function () {
        if (task_left.length > 0) {
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < marker_list.length; i++) {
                marker_list[i].setMap(null);
            }
            marker_list = [];

            for (var i = 0; i < task_left.length; i++) {
                var data = task_left[i].payload;

                // === Choosing IconColor === //
                var category = data.category;
								//console.log(category);
                if (category == '긴급') var iconColor = "assets/marker-pin-google-red.png";
                if (category == '수리') var iconColor = "assets/marker-pin-google-blue.png";
                if (category == '생활') var iconColor = "assets/marker-pin-google-yellow.png";
                //console.log(iconColor);

                // === Choosing Coordinate and make marker with given png === //
                var coordinate = data.coordinate;
                var marker_pos = {lat: coordinate[0], lng: coordinate[1]};
                var marker = new google.maps.Marker({
                    position: marker_pos,
                    map: map,
                    icon: iconColor,
                    title: data.title
                });

                // === Add Listener for opening/closing linking task bar === //
                marker.addListener('click', function () {
                    for (var i = 0; i < task_left.length; i++) {
                        if (marker_list[i].title === this.title) {
                            break;
                        }
                    }
                    var query_changing_card = "ul li:nth-child(" + String(i + 1) + ")";
                    var changing_card = $(query_changing_card);
                    update_card(changing_card);
                });
                marker_list.push(marker);
                bounds.extend(marker.position)
            }
            map.fitBounds(bounds);
            if (map.getZoom() > 16) map.setZoom(15);
        }
    };


    // ======= Label Counting Drawing Part ======= //
    var redraw_label_count = function () {
        count_repair = 0;
        count_living = 0;
        count_danger = 0;
        for (var i = 0; i < task_left.length; i++) {
            var category = task_left[i].payload.category;
            if (category == '긴급') {
                count_danger += 1;
            }
            else if (category == '생활') {
                count_living += 1;
            }
            else {
                count_repair += 1;
            }
        }
        console.log("count", count_living, count_danger, count_repair)
        if (count_danger == 0) {
            $("SeeDanger").addClass("disabled")
        }
        else {
            $("SeeDanger").removeClass("disabled")
        }
        if (count_living == 0) {
            $("SeeLiving").addClass("disabled")
        }
        else {
            $("SeeLiving").removeClass("disabled")
        }
        if (count_repair == 0) {
            $("SeeRepair").addClass("disabled")
        }
        else {
            $("SeeRepair").removeClass("disabled")
        }
        if (count_living + count_danger + count_living == 0) {
            $("SeeAll").addClass("disabled")
        }
        else {
            $("SeeAll").removeClass("disabled")
        }

        $("#label_danger").text(count_danger);
        $("#label_living").text(count_living);
        $("#label_repair").text(count_repair);
        $("#label_all").text(count_danger + count_living + count_repair);
    }

    // === Initialize Task List => Draw Task Card => Draw Marker Pin === //
    update_task();

    // === Open/Close Task Card automatically when called === //
    var update_card = function (changing_card) {
        var variable_content = changing_card.find("#variable_content");
        var expand_message = changing_card.find("#expand_message");
        var delete_index = changing_card.index();

        if (variable_content.css("display") === "none") {
            variable_content.slideDown();
            expand_message.html("숨기기" + "<i class='angle up icon'></i>")

            marker_list[delete_index].setAnimation(google.maps.Animation.BOUNCE);
        } else {
            variable_content.slideUp();
            expand_message.html("자세히보기" + "<i class='angle down icon'></i>");
            marker_list[delete_index].setAnimation(null);
        }
    };

    // === Show/Close All Task Card with Given Category === //
    var show_hide_category = function (category) {
        var temp_count = 0;
        for (var i = 0; i < task_left.length; i++) {
            var query_changing_card = "ul li:nth-child(" + String(i + 1) + ")";
            var changing_card = $(query_changing_card);
            temp_count += show_hide_card(changing_card, category);
        }
        if (task_left.length > 0 && temp_count == 0) {
            // Change the html content that certain category has no more tasks
        }
    };

    // === Show/Close Single Task Card automatically when called === //
    var show_hide_card = function (changing_card, category) {
        var delete_index = changing_card.index();
        var task_category = task_left[delete_index].payload.category;
        var variable_content = changing_card.find("#variable_content");
        var expand_message = changing_card.find("#expand_message");

        if (task_category == category || category == 'all') {
            changing_card.slideDown();
            marker_list[delete_index].setMap(map);
            return 1
        }
        else {
            changing_card.slideUp();
            marker_list[delete_index].setMap(null);
            variable_content.slideUp();
            expand_message.html("자세히보기" + "<i class='angle down icon'></i>");
            marker_list[delete_index].setAnimation(null);
            return 0
        }
    };

    var update_menu_bar = function (button_id, label_id) {
        document.getElementById("SeeAll").classList.remove("active");
        document.getElementById("SeeDanger").classList.remove("active");
        document.getElementById("SeeLiving").classList.remove("active");
        document.getElementById("SeeRepair").classList.remove("active");
        document.getElementById(button_id).classList.add("active");

        document.getElementById("label_all").classList.remove("green");
        document.getElementById("label_danger").classList.remove("red");
        document.getElementById("label_living").classList.remove("yellow");
        document.getElementById("label_repair").classList.remove("blue");
        if (label_id == 'label_all') {
            document.getElementById("label_all").classList.add("green");
        }
        else if (label_id == 'label_danger') {
            document.getElementById("label_danger").classList.add("red");
        }
        else if (label_id == 'label_living') {
            document.getElementById("label_living").classList.add("yellow");
        }
        else  {
            document.getElementById("label_repair").classList.add("blue");
        }

    }

    // === Listener Function for Clicking Finished Button === //
    $(document).on('click', "#finished", function () {
        deletecard = $(this).closest("li");
        deletingKey = deletecard.find("p").html();
        delete_index = deletecard.index();

        // === Update DB === //
        task_left.splice(delete_index, 1);
        marker_list[delete_index].setMap(null);
        marker_list.splice(delete_index, 1);
        ref.child(deletingKey).update({flag_done: 1});
        deletecard.slideUp(function () {
            deletecard.remove();
            redraw_label_count();
            if (task_left.length == 0) {
                document.getElementById('ulcontent').innerHTML = '<div id="EmptySigner"><img class="logo" src="assets/miniLogo.svg"><p id="spacer">현재 해야될 일이 없군요!</p></div>';
            }
        });
    });

    // === Listener Function for Clicking Reject Button === //
    $(document).on('click', "#trashed", function () {
        console.log(document.getElementById('RefuseInput').value);
        deletecard = $(this).closest("li");
        deletingKey = deletecard.find("p").html();
        delete_index = deletecard.index();
        document.getElementById('RefuseInput').value = '';
        $("#TempModal").fadeIn();
        $("#ModalBox").fadeIn();
    });

    // === Listener Function for Clicking Delete Request Button === //
    $(document).on('click', ".DeleteRequest", function () {
        console.log("DeleteRequest Sensed");
        // === Update DB === //
        task_left.splice(delete_index, 1);
        marker_list[delete_index].setMap(null);
        marker_list.splice(delete_index, 1);
        ref.child(deletingKey).update({flag_done: -1});
        deletecard.slideUp(function () {
            deletecard.remove();
            redraw_label_count();
            if (task_left.length == 0) {
                document.getElementById('ulcontent').innerHTML = '<div id="EmptySigner"><img class="logo" src="assets/miniLogo.svg"><p id="spacer">현재 해야될 일이 없군요!</p></div>';
            }
        });
        $("#TempModal").fadeOut();
        $("#ModalBox").fadeOut();
    });

    // === Listener Function for Clicking Cancel Delete Request Button === //
    $(document).on('click', ".CancelDelete", function () {
        console.log("CancelDelete Sensed");
        $("#TempModal").fadeOut();
        $("#ModalBox").fadeOut();
    });

    // === Listener Function for Clicking Opening/Closing Bar area === //
    $(document).on('click', "#lowerbar", function () {
        var changing_card = $(this).closest("li");
        update_card(changing_card);
    })

    // === Listener Function for Clicking See All Button === //
    $(document).on('click', "#SeeAll", function () {
        update_menu_bar("SeeAll", "label_all");
        show_hide_category("all", "SeeAll")
    })
    $(document).on('click', "#SeeDanger", function () {
        update_menu_bar("SeeDanger", "label_danger");
        show_hide_category("긴급")
    })
    $(document).on('click', "#SeeLiving", function () {
        update_menu_bar("SeeLiving", "label_living")
        show_hide_category("생활")
    })
    $(document).on('click', "#SeeRepair", function () {
        update_menu_bar("SeeRepair", "label_repair")
        show_hide_category("수리")
    })

})
;


