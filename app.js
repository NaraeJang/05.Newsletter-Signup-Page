const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const https = require("https");
const { json } = require("body-parser");


const app = express();

mailchimp.setConfig({
    apiKey: "0b9b46d4b5c7445cede47d86848aadfb-us18",
    server: "us18",
});

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});


async function run() {
    const response = await mailchimp.ping.get();
    console.log(response);
}

run();




app.post("/", function (req, res) {

    //To Add Member in the List
    const subscribingUser = {
        firstName: req.body.fName,
        lastName: req.body.lName,
        email: req.body.email

    }


    const run = async () => {
        try {
            const response = await mailchimp.lists.addListMember("b0cc6ae9b9", {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });
            console.log(response);
            res.sendFile(__dirname + "/success.html");
        } catch (err) {
            console.log("====== ERROR ======");
            console.log(JSON.parse(err.response.error.text).detail);
        }
    };

    run();

});


app.post("/failure", function (req, res) {
    res.redirect("/");
});



app.listen(3000, function () {
    console.log("The server is running on port 3000.");
});

//API Key
// 22945d633db56fe7a6d1afca31c764fe-us18

//LIST Id
// b0cc6ae9b9
