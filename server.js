var st = require('st');
var request = require("request");
var http = require('http');
var Router = require("routes-router");
var router = Router();
var body = '';
var body2 = '';
var userData = [];







//Call for inspection records around a certain LatLng
function apiBackbone(response, query) {

    var arrBackbone = [];

    //making API GET request
    http.get("http://api.civicapps.org/restaurant-inspections/near/" + query + "?distance=1&count=20000", function (res) {
        console.log("Got response: " + res.statusCode);
        res.on('data', function (chunk) {
            body += chunk;
            console.log("---------------Recieved a chunk of data from API--------------");
        });
        res.on('end', function () {
            
            var obj = JSON.parse(body);
            console.log(obj);
            console.log("---------------closing connection with server--------------");
            console.log(typeof obj);
            //console.log(obj[0].hasOwnProperty("message"));
            //need a try statement here
            if (!obj.hasOwnProperty("results")) {
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
            console.log("Array: " + JSON.stringify(arrBackbone));
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
    var responseCatch = []
    var completed_requests = 0;

    if (query.indexOf("_") >= 0) {
        queryArr = query.split('_');
    } else {
        queryArr.push(query);
    }
    
    body2 = '';

    //building and async call for all of the elements in the array...
    queryArr.forEach(function(query){
        var bodyTest = '';
        console.log("query :" + query);
        http.get("http://api.civicapps.org/restaurant-inspections/inspection/" + query, function (res) {
            
            console.log("Got response: " + res.statusCode);
            res.on('data', function (chunk) {
                console.log("completed requests: " + completed_requests);
                console.log("query :"+query);
                bodyTest += chunk;
                console.log("chunk :" + chunk);
                console.log("---------------Recieved a chunk of data from API--------------");
                console.log("body2 after chunk :" + bodyTest);
            });
            res.on('end', function () {
                console.log("body2 = " + bodyTest);
                console.log("---------------Parsing body--------------");
                //var obj = JSON.parse(body2);
                //console.log('obj = '+obj);
                if (completed_requests == (queryArr.length - 1)){
                    console.log("---------------Final push--------------");
                    var obj = JSON.parse(bodyTest);
                    console.log('obj = '+obj);
                    //console.log("obj.results = " + obj.results);
                    responseData.push(obj.results);
                    console.log("---------------Sending data to client--------------");
                    console.log(JSON.stringify(responseData));
                    response.end(JSON.stringify(responseData));
                    console.log("---------------closing connection with server--------------");
                } else {
                    console.log("---------------Completed one get--------------");
                    //console.log("obj = " + obj);
                    //console.log("obj.results = " + obj.results);
                    //console.log("---------------Pushing to array--------------");
                    var obj = JSON.parse(bodyTest);
                    responseData.push(obj.results);
                    completed_requests++;
                }
                console.log('--------------Clearing variables-----------');
                obj = '';
                //body2 = '';
            });
        })   
    })
    
    //Make API GET request for a specific inspection
    // for (var i = 0; i < 1; i++) {
    //     body2 = '';
    //     console.log("query number: " + queryArr[i]);
    //     http.get("http://api.civicapps.org/restaurant-inspections/inspection/" + queryArr[i], function (res) {
    //         console.log("Got response: " + res.statusCode);
    //         res.on('data', function (chunk) {
    //             body2 += chunk;
    //             console.log("---------------Recieved a chunk of data from API--------------" + i);
    //         });
    //         res.on('end', function () {
    //             //console.log(body2);
    //             console.log("---------------Parsing--------------");
    //             var obj = JSON.parse(body2);
    //             console.log("--------------- Data is Parsed--------------");
    //             //for (var j = 0; j < obj.results.length; j++) {
    //             //	console.log("---------------Pushing index " + j + "--------------");
    //             console.log("obj = " + obj);
    //             console.log("obj.results.name = " + obj.results.name);
    //             responseData.push(obj.results);
    //             //responseData.push(obj.results);
    //             //}
    //             console.log("obj = " + obj.results);
    //             console.log("responseData :" + responseData);
    //             console.log("responseData stringify :" + JSON.stringify(responseData));
    //             console.log("---------------closing connection with server--------------");
    //             response.end(JSON.stringify(responseData));
    //         });
    //         res.on('error', function (e) {
    //             console.log("Got error: " + e.message);
    //         });
    //     });
    // }
    console.log("---------------End of API function--------------");
    //console.log(body2);
    //return true;
};


router.addRoute("/userdb", {
    GET: function(req,res,opts) {
        console.log("---------------Calling Mongo function--------------");
        addUserPos(res, opts.parsedUrl.query);
        //res.end();
        console.log("---------------Passing data to client--------------");
        console.log("---------------Finished Sending data to the client--------------");
    }
});

/*
router.addRoute("/getUsers", {
    GET: function(req,res,opts) {
        console.log("---------------Calling Mongo Get all function--------------");
        getAllUsers(res);
        console.log("---------------Done with Mongo Get all function--------------");
        console.log(JSON.stringify(userData));
        //res.end(JSON.stringify(userData));
        console.log("---------------Passing data to client--------------");
        console.log("---------------Finished Sending data to the client--------------");
    }
});
*/

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
        console.log("---------------Calling GET for inspection report function--------------");
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
server.listen(process.env.PORT || 8080);
console.log('server listening on port # 8080');