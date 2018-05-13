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


    // ======= Manipulate List Data ======= //
    var update_task = function () {

        ref.once("value", function (snapshot) {
            snapshot.forEach(function (child) {
                var child_value = child.val();
                var key = child.key;
                var task = {"key": key, "payload": child_value}
                if (child_value.flag_done) {
                    task_done.push(task);
                }
                else {
                    task_left.push(task);
                }
            });
            redraw_task_left();
        });
    };

    // ======= Card Drawing Part ======= //
    var redraw_task_left = function () {
        var template = $("#task-left-template").html();

        for (var i = 0; i < task_left.length; i++) {
            console.log("carding", i)
            var taskbar = Mustache.render(template, task_left[i].payload);
            $("body").append(taskbar)
        }
    }

    var clear_task_list = function () {

    }

    console.log("test")

    update_task();
    console.log(task_left);


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
})


