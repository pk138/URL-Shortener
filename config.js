 const mysql=require('mysql')
const db = mysql.createConnection({
    host: "localhost",
    user: "new_user",
    password: "Pk@1pass",
    database: "urlshortner"
});

db.connect(err => {
    if(err) {
        console.log("Error");
        return;
    }
    console.log("Connceted.....");
});
module.exports=db;