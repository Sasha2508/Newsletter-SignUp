//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
  //console.log(firstName, lastName, email);

  const url = "https://us1.api.mailchimp.com/3.0/lists/df9adafa8d";
  const options = {
    method: "POST",
    auth: "maksim2:663f991abd8b03f900f810dd86d4dd6-us1"
  }

  const request = https.request(url, options, function(response){

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
        res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});



app.post("/failure", function(req, res){
  res.redirect("/");
})





app.listen(process.env.PORT || 3000, function(){
  console.log("Server is working on port 3000");
})

//df9adafa8d
//2663f991abd8b03f900f810dd86d4dd6-us1
