const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
var db = admin.database();
var ref = db.ref("data");
var usersRef = ref.child("users");


exports.createUserDB = functions.https.onRequest((req, res) => {
    var qusername = req.query.username;
    var qpassword = req.query.password;
    var qemail = req.query.email;

    usersRef.orderByKey().equalTo(qusername).once('value', (snapshot) => {
        if (snapshot.exists()) res.json({ result: false, ErrorMessage: "UserAlreadyExist!" });
        else {
            usersRef.child(qusername).set({
                password: qpassword,
                email: qemail
            });
            res.json({ result: true });
        }

    })
});

exports.loginDB = functions.https.onRequest((req, res) => {
    var qusername = req.query.username;
    var qpassword = req.query.password;

    usersRef.orderByKey().equalTo(qusername).once('value', (snapshot) => {
        if (!snapshot.exists()) res.json({ result: false, ErrorMessage: "UserNotRegistered!" });
        else {
            if (snapshot.child(qusername).val().password == qpassword) res.json({ result: true });
            else res.json({ result: false, ErrorMessage: "WrongPassword!" });
        }
    })
});
