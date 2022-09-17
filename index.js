const express = require("express");
const shortid = require("shortid");
const db = require("./config");
const app = express();
app.set("view engine", "ejs");
app.use(express.static('public'));
 app.use("/css", express.static(__dirname + 'public/css'))
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
    res.render("home.ejs");
});
app.post("/shorturl" , (req, res) => {
    const fullurl = req.body.fullurl;
    if (!fullurl) {
        return res.sendStatus(404);
    }
    db.query('SELECT * FROM `url` WHERE `fullurl` = ?', [fullurl], (error, results) => {
        if (error) {
            console.log("we got error");
            return;
        }

        if (results.length === 0) {
            const short = shortid.generate();
            const url = { fullurl: req.body.fullurl, shorturl: short, counts: 1 };
            db.query('INSERT INTO `url` SET ?', url, (err, res) => {
                if (err) {
                    console.log("Error creating table");
                    return;
                }
            });
            res.render("result.ejs", { shorturl: short, times: 1 });
        } else {
            const _short = results[0].shorturl;
            const _counts = results[0].counts;
            db.query('UPDATE `url` SET `counts` = ? WHERE `shorturl` = ?', [_counts + 1, _short], (err, res) => {
                if (err) {
                    console.log("Error updating table");
                    return;
                }
            });
            res.render("result.ejs", { shorturl: _short, times: _counts + 1 });
        }
    });
});


app.get("/:shorturl", (req, res) => {
    db.query('SELECT * FROM `url` WHERE `shorturl` = ?', [req.params.shorturl], (error, results) => {
        if (error) {
            return res.sendStatus(404);
        }

        if (results.length === 0) {
            res.render("error.ejs");
        } else {
            res.redirect(results[0].fullurl);
        }
    });
});

app.listen(4000);