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
    var task_done = [];
    var task_trash = [];
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
        });
    };

    // ======= Card Drawing Part ======= //
    var redraw_task_done = function () {
        $(".ui.active.centered.inline.text.loader").css("display", "none");

        if (task_done.length == 0) {
            document.getElementById('ulcontent').innerHTML = "당장은 할일을 해야겠네요!\n You should have to work now!";
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
                if (category == '위험') var taskbar = Mustache.render(template_danger, data);
                if (category == '수리') var taskbar = Mustache.render(template_repair, data);
                if (category == '생활') var taskbar = Mustache.render(template_living, data);                $("ul").append(taskbar);
            }
        }
        // var key = document.getElementById('cardnews').getAttribute('value');
        // console.log('get key', key);
    }


    update_task();


    $(document).on('click', "#undo_finished", function () {
        var deletecard = $(this).closest("li");
        var deletingKey = deletecard.find("p").html();
        ref.child(deletingKey).update({flag_done: 0});
        deletecard.remove();

        // TODO : Delete corresponding task left thing on local list.
    });

    $(document).on('click', "#trashed", function () {
        var deletecard = $(this).closest("li");
        var deletingKey = deletecard.find("p").html();
        var delete_index = deletecard.index();
        console.log(delete_index);


        // === Update DB === //
        task_done.splice(delete_index, 1);
        ref.child(deletingKey).update({flag_done: -1});
        deletecard.remove();


        // TODO : Delete corresponding task left thing on local list.
    });

    $(document).on('click', "#expand_message", function () {
        var changing_card = $(this).closest("li");
        var variable_content = changing_card.find("#variable_content");
        var expand_message = changing_card.find("#expand_message");

        if (variable_content.css("display") === "none") {
            variable_content.show();
            expand_message.html("숨기기" + "<i class='angle up icon'></i>")
        } else {
            variable_content.hide();
            expand_message.html("자세히보기" + "<i class='angle down icon'></i>")
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


