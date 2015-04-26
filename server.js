var st = require('st');
var request = require("request");
var http = require('http');
var Router = require("routes-router");
var router = Router();

var body = '';
var body2 = '';

//Call for inspection records around a certain LatLng...
function api(response, query) {

    //split query into lat long
    var slicedQuery = query.split('=');
    var lat = slicedQuery[1].substring(0, slicedQuery[1].length - 4);
    var lng = slicedQuery[2];
    var lngLat = lng + "," + lat;

    console.log("lng: " + lng);
    console.log("lat: " + lat);
    console.log("lngLat: " + lngLat);

    var tempArr = [];

    //making API GET request
    http.get("http://api.civicapps.org/restaurant-inspections/near/" + lngLat + "?distance=2&count=20000", function (res) {
        console.log("Got response: " + res.statusCode);
        res.on('data', function (chunk) {
            body += chunk;
            console.log("---------------Recieved a chunk of data from API--------------");
        });
        res.on('end', function () {
            console.log(body);
            var obj = JSON.parse(body);
            console.log("---------------closing connection with server--------------");
            //removing inspections with the score of 0 and combining inspection ids in to an array for multipule inspection on the same restaurant
            for (var i = (obj.results.length - 1); i > -1; i--) {
                //Changing inspection_number to an array
                obj.results[i].inspection_number = [obj.results[i].inspection_number];

                if (obj.results[i].score != 0) {
                    //This record has a score over 0
                    var index = -1;
                    for(var j = 0; j < tempArr.length; j++) {
                        //searching tempArr for a record with the same id
                        if (tempArr[j].id === obj.results[i].id) {
                            //found it, pass along the index of the record
                            index = j;
                            break;
                        }
                    };
                    if (index >= 0){
                        tempArr[index].inspection_number.push(obj.results[i].inspection_number)
                    } else {
                        //This restaurant is not in tempArr yet
                        tempArr.push(obj.results[i])
                    };
                };
            }
            tempArr.sort(function(a,b) {return parseFloat(a.distance - b.distance)});
            obj.results = tempArr;
            response.end(JSON.stringify(obj));
        });
        res.on('error', function (e) {
            console.log("Got error: " + e.message);
        });
    });
    console.log("---------------End of API function--------------");
    console.log(body);
    return true;
};

//Call for inspection records around a certain LatLng
function apiBackbone(response, query) {



    var arrBackbone = [];

    //making API GET request
    http.get("http://api.civicapps.org/restaurant-inspections/near/" + query + "?distance=.5&count=20000", function (res) {
        console.log("Got response: " + res.statusCode);
        res.on('data', function (chunk) {
            body += chunk;
            console.log("---------------Recieved a chunk of data from API--------------");
        });
        res.on('end', function () {
            
            var obj = JSON.parse(body);
            console.log(obj);
            console.log("---------------closing connection with server--------------");
            console.log(obj[0].hasOwnProperty("message"));
            //need a try statement here
            if (obj[0].hasOwnProperty("message")) {
                console.log("<<<<<<<<<< no results >>>>>>>>>>>");
                arrBackbone.push(obj[0]);
            } else {
                //removing inspections with the score of 0
                for (var i = (obj.results.length - 1); i > -1; i--) {
                    //Changing inspection_number to an array
                    obj.results[i].inspection_number = [obj.results[i].inspection_number];

                    if (obj.results[i].score != 0) {
                        //This record has a score over 0
                        var index = -1;
                        for(var j = 0; j < arrBackbone.length; j++) {
                            //searching arrBackbone for a record with the same id
                            if (arrBackbone[j].id === obj.results[i].id) {
                                //found it, pass along the index of the record
                                index = j;
                                break;
                            }
                        };
                        if (index >= 0){
                            arrBackbone[index].inspection_number.push(obj.results[i].inspection_number)
                        } else {
                            //This restaurant is not in arrBackbone yet
                            arrBackbone.push(obj.results[i])
                        };
                    };
                }
                arrBackbone.sort(function(a,b) {return parseFloat(a.distance - b.distance)});
            }
            console.log("Array: " + arrBackbone);
            response.end(JSON.stringify(arrBackbone));
        });
        res.on('error', function (e) {
            console.log("Got error: " + e.message);
        });
    });
    console.log("---------------End of API function--------------");
    console.log(body);
    return true;
};

function getReport(response, query) {
    var queryArr = [];
    var responseData = [];
    queryArr = query.split('_');


    //Make API GET request for a specific inspection
    for (var i = 0; i < 1; i++) {
        body2 = '';
        console.log("query number: " + queryArr[i]);
        http.get("http://api.civicapps.org/restaurant-inspections/inspection/" + queryArr[i], function (res) {
            console.log("Got response: " + res.statusCode);
            res.on('data', function (chunk) {
                body2 += chunk;
                console.log("---------------Recieved a chunk of data from API--------------" + i);
            });
            res.on('end', function () {
                //console.log(body2);
                console.log("---------------Parsing--------------");
                var obj = JSON.parse(body2);
                console.log("--------------- Data is Parsed--------------");
                //for (var j = 0; j < obj.results.length; j++) {
                //	console.log("---------------Pushing index " + j + "--------------");
                responseData.push(obj.results[0]);
                //}
                console.log(obj);
                console.log("responseData :" + responseData[0]);
                console.log("---------------closing connection with server--------------");
            });
            res.on('error', function (e) {
                console.log("Got error: " + e.message);
            });
        });
        response.end(JSON.stringify(responseData));
    }
    console.log("---------------End of API function--------------");
    console.log(body2);
    return true;
};

//Get inpection records
router.addRoute("/go", {
    GET: function(req,res,opts) {
        body = '';
        console.log("---------------Calling GET function--------------");
        console.log(opts.parsedUrl.query);
        api(res,opts.parsedUrl.query);
        console.log("---------------Passing data to client--------------");
        console.log("---------------Finished Sending data to the client--------------");
    }
});

//Getting inspections for backbone
router.addRoute("/restaurants", {
    GET: function(req,res,opts) {
        body = '';
        console.log("---------------Calling GET function--------------");
        console.log(opts.parsedUrl.query);
        apiBackbone(res,opts.parsedUrl.query);
        console.log("---------------Passing data to client--------------");
        console.log("---------------Finished Sending data to the client--------------");
    }
});

//Get inspection report
router.addRoute("/report", {
    GET: function(req,res,opts) {
        body2 = '';
        console.log("---------------Calling POST for inspection report function--------------");
        console.log(opts.parsedUrl.query);
        getReport(res,opts.parsedUrl.query);
        console.log("---------------Passing data to client--------------");
        console.log("---------------Finished Sending data to the client--------------");
    }
});

//Getting index.html if one isn't specified
var indexFile = process.argv[2] || 'index';

router.addRoute("/*", st({
    path: __dirname,
    index:'/'+indexFile+'.html' //allows alternative files
}));

//Creating server and start listening on port 8080
var server = http.createServer(router);
console.log('server listening on port # 8080');
server.listen(8080);