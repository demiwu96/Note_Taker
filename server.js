const fs = require("fs");
const express = require('express');
const path = require("path");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

let savedNotes = [];

fs.readFile("./db/db.json", 'utf-8', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        savedNotes = JSON.parse(data);
    };
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
    // return res.json(savedNotes);
});

app.get("/api/notes_:id", function (req, res) {
    var chosen = req.params.id; //string

    for (var i = 0; i < savedNotes.length; i++) {
        if (parseInt(chosen) == savedNotes[i].id) {
            return res.json(savedNotes[i]);
        }
    }
    return res.json("No notes was found");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});