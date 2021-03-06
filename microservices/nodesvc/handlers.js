//@ts-check
"use strict"

const express = require("express");

module.exports = (mongosession) => {
    if (!mongosession) {
        throw new Error("provide Mongo Session");
    }

    let router = express.Router();
    router.get("/v1/channels", (req,res) => {
        //query mongo using mongoSession
        res.json([{name: "general"}]);
    });
    
    return router;
}