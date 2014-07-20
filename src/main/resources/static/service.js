express = require('express');
app = express();

console.log("Booting up Caddie\n");

//require('./security');

//app.all('*', function(req, res, next){
//    res.header("Access-Control-Allow-Origin", "*");
//    next();
//});

//******* Configure environment ********//
console.log('Setting up environment...');

var fs = require('fs');

var environment = 'default.json';

process.argv.forEach(function (val, index, array) {
    if(index == 2) {
        console.log('Environment: ' + val);

        if(val) {
            environment = val + '.json';
        }
    }
});

//Setup global configuration
caddieconf = require('./environments/' + environment);

console.log("Environment " + environment + " configured!\n");

//******* Define modules here ********//

console.log("Setting up modules...");

console.log("Setting up angular app at /");

app.use('/', express.static(__dirname + '/app'));

console.log("Setting up api at /api");
require('./api');


app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, 'Something broke!');
});

app.listen(8888);
console.log('\nCaddie started. Listening on port 8888.');