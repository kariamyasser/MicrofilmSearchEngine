// Requiring modules
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const db = require('../core/db');
const httpMsgs = require('../core/httpMsgs');
var util = require('util');


exports.loadProjectFields = function(req,resp,databaseName) {


    var query =  `USE `+databaseName+`\n SELECT * FROM Fields`;

    db.execSql_singlePool(query).then(function (success) {
        httpMsgs.sendJson(req, resp, success);
    }
    ).catch(function (err) {
        httpMsgs.show500(req, resp, err);
    }
    );


}


exports.loadProjectData = function(req,resp,databaseName) {


    var query =  `USE `+databaseName+`\n SELECT * FROM Data`;

    db.execSql_singlePool(query).then(function (success) {
        httpMsgs.sendJson(req, resp, success);
    }
    ).catch(function (err) {
        httpMsgs.show500(req, resp, err);
}

    );


}



exports.loadProjectNames = function(req,resp,databaseName) {


    var query =  `USE `+databaseName+`\n SELECT * FROM Projects`;

    db.execSql_singlePool(query).then(function (success) {
        httpMsgs.sendJson(req, resp, success);
    }
    ).catch(function (err) {
        httpMsgs.show500(req, resp, err);
}

    );


}


exports.update = function (req, resp, databaseName, reqBody) {


    try {

       
        var data = JSON.parse(reqBody);
        console.log(data,data['data']);
        if ( !data.id || !data.data || !data.fields) { throw new Error('Data not complete'); }

        if (data) {
            var sql =  "USE "+databaseName+"\n Update Data Set";
            data.fields.forEach((element,i) => {
                if(i < data.fields.length - 1){
                    sql += " "+element+" = N'"+ data['data'][element] + "',";
                } else {
                    sql += " "+element+" = N'"+ data['data'][element] + "'";
                }
            });
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
        httpMsgs.show500(req, resp, ex);
    }

};