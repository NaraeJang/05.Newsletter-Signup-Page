const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const https = require("https");
// const request = require("request");

const app = express();

mailchimp.setConfig({
    apiKey: "22945d633db56fe7a6d1afca31c764fe-us18",
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

    const subscribingUser = {
        firstName: req.body.fName,
        lastName: req.body.lName,
        email: req.body.email
    
    }


    const run = async () => {
        const response = await mailchimp.lists.addListMember("b0cc6ae9b9", {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });
        console.log(response);
    };

    run();

});




app.listen(3000, function () {
    console.log("The server is running on port 3000.");
});

//API Key
// 22945d633db56fe7a6d1afca31c764fe-us18

//LIST Id
// b0cc6ae9b9
