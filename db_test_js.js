
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

    // ======= initialize variables ======= //
    ref = database.ref("TaskList");
    var task_left = [];
    var task_done = [];

    var push_task = function (task) {
        ref.push().set(task);
        console.log("new task inserted");
        console.log(task);
    }

    var update_task = function () {
        ref.once("value", function(snapshot) {
            snapshot.forEach(function(child) {
                var child_value = child.val();
                var key = child.key;
                var task = {"key":key, "payload":child_value}
                if (child_value.flag_done) {
                    task_done.push(task);
                }
                else {
                    task_left.push(task);
                }
            });
        });
    };

    var set_task_flag_done = function (key, value) {

    }

    update_task();

    // var t1 = {"title":"Task1", "content":"content1", "flag_done":false, "location":"신학관"}
    // var t2 = {"title":"Task2", "content":"content2", "flag_done":true, "location":"장영실"}

    // push_task(t1);
    // push_task(t2);
})


