const db = require('../core/db');
const httpMsgs = require('../core/httpMsgs');
var util = require('util');

//get operations
exports.login = function (req, resp,databaseName,username,password) {
    var query =  "USE "+databaseName+"\n SELECT * FROM Users Where username = "+"'"+username+"'";


    db.execSql_singlePool(query).then(function (success) {
     
        resp.writeHead(200, { "Content-Type": "application/json" });
        if (success) {
           var data = success["success"]["recordset"];
           var pass = data[0].password;
           if(pass===password){

            var projects = data[0].projects.split(',');
            var result = JSON.stringify({ 'status':"success",'data': 
            [
                {
                    'id':data[0].id,
                    'username':data[0].username,
                    'usertype':data[0].usertype,
                    'projects':projects
                 }
            ] });
            resp.write(result);

           }
           else{
            var result = JSON.stringify({ 'status':"Wrong password" });
            resp.write(result);
            console.log("wrong password");
           }

    }
    resp.end();
    }

    ).catch(function (err) {
        console.log("wrong username");
        var result = JSON.stringify({ 'status':"Username not found" });
        resp.write(result);
        resp.end();
    }
    );


};



