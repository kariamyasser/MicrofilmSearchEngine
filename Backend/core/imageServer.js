const settings = require("../settings");
var path = require('path');
const images = require("../controllers/images");
var express = require("express"),
    app = express(),
    imageDir = __dirname + "/../Public/",
    imageSuffix = ".jpg",
    fs = require("fs");


app.get("/images/:projectName/Scan_Tree/:filmType/:portfolio/Film/:filmNo/:id", function (request, response) {
    var _path = imageDir + request.params.projectName + "/Scan_Tree/"+ request.params.filmType +"/"+ request.params.portfolio +"/Film/" + request.params.filmNo + "/" + request.params.id + imageSuffix;
    response.sendFile(path.resolve(_path));
});

app.get("/images/projectImages/:projectName/Scan_Tree/:filmType/:portfolio/Film/:filmNo", function (request, response) {
    var _path = "/images/projectImages/"+ request.params.projectName + "/Scan_Tree/"+ request.params.filmType +"/"+ request.params.portfolio +"/Film/" + request.params.filmNo;
    var files = images.loadImages(request,response,_path);

});
exports.sendREPLY = function(response,files) { 
    response.send(files) ;
}

app.listen(settings.imagesServerPort);
