const http = require('http');
const settings = require('../settings.js');
var user = require('../controllers/users');
var auth = require('../controllers/auth');
var project = require('../controllers/project');
var images = require('../controllers/images');
const httpMsgs = require('./httpMsgs');





http.createServer(function (req, resp) {
    switch (req.method) {
        case "GET":
            if (req.url === "/") {
                httpMsgs.showHome(req, resp);
            }
            else {
                handleGets(req, resp, req.url);
            }
            break;
        case "POST":
            handlePosts(req, resp, req.url);
            break;
        case "PUT":
            handlePuts(req, resp, req.url);
            break;
        case "DELETE":
            handleDeletes(req, resp, req.url);
            break;
        default:
            httpMsgs.show405(req, resp);// method not supported
            break;

    }
}).listen(settings.webPort, function () {

    console.log('started listeneing at : port ' + settings.webPort);
});


function handleGets(req, resp, url) {
    if (url) {
        var databaseName = settings.mainDatabase;
        var pathValues = url.split('/');
        console.log(url);

        if (pathValues[2] == "projectImages"){
            images.loadImages(req,resp,pathValues[3]);
        }


        switch (pathValues.length) {
            case 3:
                 if (pathValues[2] == "projectNames") {
                    project.loadProjectNames(req, resp, databaseName);
                } 

                
                break;
            case 4:
            if (pathValues[2] == "users" && pathValues[3] == "all") {
                user.getList(req, resp, databaseName);
            } else if(pathValues[1] == "login")
                    {
                        auth.login(req,resp,databaseName,pathValues[2],pathValues[3]);
                    }
                   
            case 5:
                
            if (pathValues[2] == "users" && pathValues[3] == "id") {
                    user.getById(req, resp, databaseName ,parseInt(pathValues[4]));
                }
                else if (pathValues[2] == "project" && pathValues[4] == "fields") {
                   project.loadProjectFields(req, resp, pathValues[3]);
                }
                else if (pathValues[2] == "project" && pathValues[4] == "data") {
                    project.loadProjectData(req, resp, pathValues[3]);
                 }
                break;

            default:
                httpMsgs.show404(req, resp);
                break;

        }
    }
}


function handlePosts(req, resp, url) {
    if (url) {

        var databaseName = settings.mainDatabase;

        var pathValues = url.split('/');

        var reqBody = '';
        req.on("data", function (data) {
            reqBody += data;

            if (reqBody.length > 1e7)//10MB
            {
                httpMsgs.show413(req, resp);

            }
        });
        console.log(pathValues, reqBody);

        switch (pathValues.length) {
            case 3:
                if (pathValues[2] == "users") {
                    req.on("end", function () {
                        user.add(req, resp, databaseName, reqBody);

                    });
                }
                break;


            default:
                httpMsgs.show404(req, resp);
                break;


        }
    }

}



function handleDeletes(req, resp, url) {
    if (url) {
        var  databaseName = settings.mainDatabase;
        var pathValues = url.split('/');

        var reqBody = '';
        req.on("data", function (data) {
            reqBody += data;

            if (reqBody.length > 1e7)//10MB
            {
                httpMsgs.show413(req, resp);

            }
        });

        switch (pathValues.length) {
            case 4:
                if (pathValues[2] == "users") {
                    req.on("end", function () {
                        user.delete(req, resp, databaseName, pathValues[3]);

                    });
                }
                break;


            default:
                httpMsgs.show404(req, resp);
                break;


        }
    }

}




function handlePuts(req, resp, url) {
    if (url) {
        console.log(url);
        var pathValues = url.split('/');
        var  databaseName= settings.mainDatabase;
        var reqBody = '';
        req.on("data", function (data) {
            reqBody += data;

            if (reqBody.length > 1e7)//10MB
            {
                httpMsgs.show413(req, resp);

            }
            
        });

        switch (pathValues.length) {
            case 5:
                if (pathValues[3] == "user" && pathValues[4] == "single") {
                    req.on("end", function () {
                        user.update(req, resp,databaseName, reqBody);

                    });
                } else if (pathValues[3] == "project") {
                    req.on("end", function () {
                        project.update(req, resp,pathValues[4], reqBody);
                    });
                }
                break;


            default:
                httpMsgs.show404(req, resp);
                break;


        }
    }

}














/*
//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();

// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
var server = app.listen(settings.webPort, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });


//GET API
app.get("/employees/email/:email", async (req , res)=>{
    const {email} = req.params;
    try{
        emp.getById(req, res, email);

    }
catch(error){
    console.log('error');

}


});

//POST API
app.post("/api/user", function(req , res){
    var query = "INSERT INTO [user] (Name,Email,Password) VALUES (req.body.Name,req.body.Email,req.body.Password”);
    executeQuery (res, query);
});

//PUT API
app.put("/api/user/:id", function(req , res){
    var query = "UPDATE [user] SET Name= " + req.body.Name  +  " , Email=  " + req.body.Email + "  WHERE Id= " + req.params.id;
    executeQuery (res, query);
});

// DELETE API
app.delete("/api/user /:id", function(req , res){
    var query = "DELETE FROM [user] WHERE Id=" + req.params.id;
    executeQuery (res, query);
});

 */


/*   else if (req.url === "/employees") {
     emp.getList(req, resp);
 }
 else if (req.url === "/employees/email/:email")
 {
     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

     var patth = new RegExp("/employees/email/" + re);
     if (patth.test(req.url)) {
         console.log("passed test");
         patth = new RegExp(re);
         var empemail = patth.exec(req.url);
         emp.getByEmail(req, resp, empemail);

     }
     else {
         httpMsgs.show404(req, resp);
     }

 }
 else {
     var empnoPattern = "[0-9]+";
     var patth = new RegExp("/employees/" + empnoPattern);
     if (patth.test(req.url)) {
         patth = new RegExp(empnoPattern);
         var empno = patth.exec(req.url);
         emp.getById(req, resp, empno);

     }
     else {
         httpMsgs.show404(req, resp);
     }
 }
*/


/*  if (req.url === "/users") {
               var reqBody = '';
               req.on("data", function (data) {
                   reqBody += data;

                   if (reqBody.length > 1e7)//10MB
                   {
                       httpMsgs.show413(req, resp);

                   }
               });
               req.on("end", function () {
                   user.add(req, resp, reqBody);

               });
           }
           else {
               httpMsgs.show404(req, resp);
           } */