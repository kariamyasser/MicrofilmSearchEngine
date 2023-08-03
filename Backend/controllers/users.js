const db = require('../core/db');
const httpMsgs = require('../core/httpMsgs');
var util = require('util');

//get operations
exports.getList = function (req, resp, databaseName) {

    var query =  "USE "+databaseName+"\n SELECT * FROM Users Order By id";
    console.log(query);

    db.execSql_singlePool(query).then(function (success) {
        console.log(success);
        httpMsgs.sendJson(req, resp, success);

    }
    ).catch(function (err) {
        console.log(success);
        httpMsgs.show500(req, resp, err);

    }

    );


};




exports.getById = function (req, resp,databaseName, id) {
    var query =  "USE "+databaseName+"\n SELECT * FROM Users Where id=" + id;


    db.execSql_singlePool(query).then(function (success) {
        httpMsgs.sendJson(req, resp, success);
        console.log(success);
    }
    ).catch(function (err) {
        httpMsgs.show500(req, resp, err);

    });

};



//post operation
exports.add = function (req, resp,databaseName, reqBody) {
    try {

        if (!reqBody) { throw new Error('Input not valid '); }
        var data = JSON.parse(reqBody);

        if (data) {

            if ( !data.username || !data.usertype || !data.password || !data.projects) { throw new Error('Data not complete'); }
            var sql =  "USE "+databaseName+"\n Insert into users(username,usertype,password,projects) Values ";
            //   sql+="("+data.Name+","++")"; normal way

            sql += util.format("(N'%s'  , '%s' , '%s' , N'%s')", data.username, data.usertype, data.password, data.projects);
            console.log(sql);


            db.execSql_singlePool(sql).then(function (success) {
                httpMsgs.show200(req, resp, success);
                console.log(success);
            }
            ).catch(function (err) {
                httpMsgs.show500(req, resp, err);

            });
        }
        else {
            console.log("error");
            throw new Error('Input not valid');

        }
    }
    catch (ex) {
        console.log("error =" + ex);
        httpMsgs.show500(req, resp, ex);
    }

};

exports.update = function (req, resp, databaseName, reqBody) {


    try {

       
        var data = JSON.parse(reqBody);

        if (data) {
            if ( !data.username || !data.usertype || !data.password || !data.projects) { throw new Error('Data not complete'); }

            var sql =  "USE "+databaseName+"\n Update users Set ";
            sql += " username = N'"+ data.username + "',";
            sql += " usertype = '"+ data.usertype + "',";
            sql += " password = '"+ data.password + "',";
            sql += " projects = N'"+ data.projects + "'";
            sql += " Where Id = " + data.id;

            console.log(sql);
            db.execSql_singlePool(sql).then(function (success) {
                httpMsgs.show200(req, resp, success);
                console.log(success);
            }
            ).catch(function (err) {
                httpMsgs.show500(req, resp, err);

            });
        }
        else {
            console.log("error");
            throw new Error('Input not valid');

        }
    }
    catch (ex) {
        console.log("error =" + ex);
        httpMsgs.show500(req, resp, ex.Error);
    }

};

exports.delete = function (req, resp, databaseName,id) {



    try {



            var sql =  "USE "+databaseName+"\n Delete From users Where id = " + id;


            console.log(sql);
            db.execSql_singlePool(sql).then(function (success) {
                httpMsgs.show200(req, resp, success);
                console.log(success);
            }
            ).catch(function (err) {
                httpMsgs.show500(req, resp, err);

            });


       
    }
    catch (ex) {
        console.log("error =" + ex);
        httpMsgs.show500(req, resp, ex);
    }




};