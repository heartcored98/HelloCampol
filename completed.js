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
    });

    // ======= initialize variables ======= //
    ref = database.ref("TaskList");
    var task_done = [];

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
            snapshot.forEach(function (child) {
                var child_value = child.val();
                var key = child.key;
                var coordinate = child_value.coordinate;
                var task = {"key": key, "payload": child_value}
                if (child_value.flag_done == 1) {
                    task_done.push(task);
                }
            });
            redraw_task_done();
            redraw_label_count();
        });
    };

    // ======= Card Drawing Part ======= //
    var redraw_task_done = function () {
        $(".ui.active.centered.inline.text.loader").css("display", "none");

        if (task_done.length == 0) {
            document.getElementById('ulcontent').innerHTML = '<div id="EmptySigner2"><img class="logo" src="assets/miniLogo.svg"><p id="spacer">완료된 일이 아직 없군요!</p></div>';
        }
        else {
            var template_danger = $("#task-done-template-danger").html();
            var template_repair = $("#task-done-template-repair").html();
            var template_living = $("#task-done-template-living").html();

            for (var i = 0; i < task_done.length; i++) {
                // === Drawing Task Bar === //
                var data = task_done[i].payload;
                var category = data.category;
                data["keyvalue"] = task_done[i].key;
                if (category == '긴급') var taskbar = Mustache.render(template_danger, data);
                if (category == '수리') var taskbar = Mustache.render(template_repair, data);
                if (category == '생활') var taskbar = Mustache.render(template_living, data);
                $("ul").append(taskbar);
            }
        }
        // var key = document.getElementById('cardnews').getAttribute('value');
        // console.log('get key', key);
    };


    // ======= Label Counting Drawing Part ======= //
    var redraw_label_count = function () {
        count_repair = 0;
        count_living = 0;
        count_danger = 0;
        for (var i = 0; i < task_done.length; i++) {
            var category = task_done[i].payload.category;
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
    };

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
        } else {
            variable_content.slideUp();
            expand_message.html("자세히보기" + "<i class='angle down icon'></i>");
        }
    };

    // === Show/Close All Task Card with Given Category === //
    var show_hide_category = function (category) {
        var temp_count = 0;
        for (var i = 0; i < task_done.length; i++) {
            var query_changing_card = "ul li:nth-child(" + String(i + 1) + ")";
            var changing_card = $(query_changing_card);
            temp_count += show_hide_card(changing_card, category);
        }
        if (task_done.length > 0 && temp_count == 0) {
            // Change the html content that certain category has no more tasks
        }
    };

    // === Show/Close Single Task Card automatically when called === //
    var show_hide_card = function (changing_card, category) {
        var delete_index = changing_card.index();
        var task_category = task_done[delete_index].payload.category;
        var variable_content = changing_card.find("#variable_content");
        var expand_message = changing_card.find("#expand_message");

        if (task_category == category || category == 'all') {
            changing_card.slideDown();
            return 1
        }
        else {
            changing_card.slideUp();
            variable_content.slideUp();
            expand_message.html("자세히보기" + "<i class='angle down icon'></i>");
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
        else {
            document.getElementById("label_repair").classList.add("blue");
        }
    }


    $(document).on('click', "#undo_finished", function () {
        deletecard = $(this).closest("li");
        deletingKey = deletecard.find("p").html();
        delete_index = deletecard.index();
        task_done.splice(delete_index, 1);
        ref.child(deletingKey).update({flag_done: 0});
        deletecard.slideUp(function () {
            deletecard.remove();
            redraw_label_count();
            if (task_done.length == 0) {
                document.getElementById('ulcontent').innerHTML = '<div id="EmptySigner2"><img class="logo" src="assets/miniLogo.svg"><p id="spacer">완료된 일이 아직 없군요!</p></div>';
            }
        });
    });


    $(document).on('click', "#trashed", function () {
        deletecard = $(this).closest("li");
        deletingKey = deletecard.find("p").html();
        delete_index = deletecard.index();
        $("#TempModal").fadeIn();
        $("#ModalBox").fadeIn();
    });

    $(document).on('click', ".DeleteRequest", function () {
        task_done.splice(delete_index, 1);
        ref.child(deletingKey).update({flag_done: -1});
        $("#TempModal").fadeOut();
        $("#ModalBox").fadeOut();
        deletecard.slideUp(function () {
            deletecard.remove();
            redraw_label_count();
            if (task_done.length == 0) {
                document.getElementById('ulcontent').innerHTML = '<div id="EmptySigner2"><img class="logo" src="assets/miniLogo.svg"><p id="spacer">완료된 일이 아직 없군요!</p></div>';
            }
        });

    });

    $(document).on('click', ".CancelDelete", function () {
        $("#TempModal").fadeOut();
        $("#ModalBox").fadeOut();
    });

    $(document).on('click', "#upperbar, #expand_message", function () {
        var changing_card = $(this).closest("li");
        var variable_content = changing_card.find("#variable_content");
        var expand_message = changing_card.find("#expand_message");

        if (variable_content.css("display") === "none") {
            variable_content.slideDown();
            expand_message.html("숨기기" + "<i class='angle up icon'></i>")
        } else {
            variable_content.slideUp();
            expand_message.html("자세히보기" + "<i class='angle down icon'></i>")
        }
    });

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


