var express = require('express');
var cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

var bodyParser = require('body-parser');

const CLIENT_ID = "Ov23liZSByIxKbpL87D6";

const CLIENT_SECRET = "f2b29aa3eb8d943d9ed2b19dbca6dc38a96c8a46";

var app = express();
app.use(cors());

app.use(bodyParser.json());


// code being passed from the frontend

app.get('/getAccessToke', async (req, res) => {

    console.log(req.query.code);
    const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code;
    await fetch("https://github.com/login/oauth/access_token" + params, {
        method: "POST", headers: {
            "Accept": "application/json",
        }
    }).then((response) => {
        return response.json()
    }).then((data) => {
        console.log(data);
        res.json(data);
    })
})

// getUserData
// access token is going to be passed in as an Authorization header

app.get('/getUserData', async function (req, res) {
    req.get("Authorization"); // Bearer ACCESSTOKEN
    await fetch("https://api.github.com/user", {
        method: "GET",
        header: {
            "Authorization": req.get("Authorization")
        }
    }).then(response => {
        return response.json();
    }).then((data) => {
        console.log(data);
        res.json(data);
    })
})


app.listen(4000, function () {
    console.log("Server is running on port 4000.");
})