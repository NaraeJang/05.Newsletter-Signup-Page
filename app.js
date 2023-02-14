const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const https = require("https");
const { json } = require("body-parser");


const app = express();

mailchimp.setConfig({
    apiKey: "-",
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
            const response = await mailchimp.lists.addListMember("-", {
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

