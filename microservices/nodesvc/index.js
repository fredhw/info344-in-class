// @ts-check
"use strict";

//load the express and morgan modules
const express = require("express");
const morgan = require("morgan");

const addr = process.env.ADDR || ":80";
const [host, port] = addr.split(":");
const portNum = parseInt(port);

const app = express(); //public function app
app.use(morgan(process.env.LOG_FORMATE || "dev")); //use adds handler funcs that execs on every request

app.get("/",(req,res) => { //shorthand syntax for func(){}
    res.set("Content-Type", "text/plain");
    res.send("Hello, Node.js!");
});

app.get("/v1/users/me/hello",(req,res) => {
    let userJSON = req.get("X-User");
    if (!userJSON) {
        throw new Error("No X-User header provided")
    }
    let user = JSON.parse(userJSON);
    res.json({
        message: `Hello, ${user.firstName} ${user.lastName}`
    })

    //res.set("Content-Type", "application/json");
});

const handlers = require("./handlers.js");
app.use(handlers({}));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.set("Content-Type", "text/plain");
    res.send(err.message);
});

app.listen(portNum, host, () => {
    console.log(`server is listening at http://${addr}...`);
});