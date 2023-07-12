const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  // res.sendFile("signup.html", { root: __dirname });
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.nameFirst;
  const lastName = req.body.nameLast;
  const userEmail = req.body.email;

  const data = {
    members: [
      {
        email_address: userEmail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/3a5c35bb0b";

  const options = {
    method: "POST",
    auth: "akash1:4cce08b57e8513e7d00643d3481a9572-us17",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

//mailchip api key
//4cce08b57e8513e7d00643d3481a9572-us17

//audience id
//3a5c35bb0b

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 4000, function () {
  console.log("Server is running on port 4000");
});
