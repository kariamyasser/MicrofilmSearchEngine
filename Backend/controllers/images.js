// Requiring modules
const fs = require("fs");
const path = require("path");
const url = require("url");
const httpMsgs = require('../core/httpMsgs');
const  imageServer  = require("../core/imageServer");



// Creating server to accept request
exports.loadImages = function (req, res, url) {

    /*
    var request = url.parse(req.url, true);
    */
    var pathValues = url.toString().split('/');
    pathValues.shift();
    pathValues.shift();
    pathValues.shift();
    var _path = "/../Public/";
    pathValues.forEach(element => {
        _path += element + '/';
    });
    var filePath = path.join(__dirname,
        _path).split("%20").join(" ");




    // Checking if the path exists
    fs.exists(filePath, function (exists) {

        if (exists) {
            fs.readdir(filePath, (error, files) => {

                var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
                files = files.sort(collator.compare);
                files.forEach((element, i) => {
                    if(!element.toString().includes('.jpg')){
                        files.splice(i,1);
                    } else {
                        files[i] = element.toString().replace('.jpg','')
                    }
                });

                imageServer.sendREPLY(res,files);
            });
        } else {
            imageServer.sendREPLY(res,[]);
        }
           

    });
};
