/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */

var http = require('https');
var AlexaSkill = require('./AlexaSkill');

/*
 *
 * Particle is a child of AlexaSkill.
 *
 */
var Particle = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Particle.prototype = Object.create(AlexaSkill.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Particle onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
};

Particle.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Particle onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Particle Demo, You can  tell me to turn on Red or Green or Blue light.";

    response.ask(speechOutput);
};

Particle.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Particle onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
};

Particle.prototype.intentHandlers = {
    // register custom intent handlers
    ParticleIntent: function (intent, session, response) {

        var lightSlot = intent.slots.light;
        var light = lightSlot ? intent.slots.light.value : "";

        var speakText = "";

        console.log("Light = " + light);



        // Replace these with action device id and access token
        var deviceid = "my device id";
        var accessToken = "my access token";

        var sparkHst = "api.particle.io";

        console.log("Host = " + sparkHst);



        // User is asking for temperature/pressure
        if(light.length > 0){

            var sparkPath = "/v1/devices/" + deviceid + "/ctrlled";


            var args =   light;

            makeParticleRequest(sparkHst, sparkPath, args, accessToken, function(resp){
                var json = JSON.parse(resp);

                response.tellWithCard("OK, " + light + " light turned on ", "Particle", "Particle!");
                response.ask("Continue?");
            });
        }
        else{
            response.tell("Sorry, I could not understand what you said");
        }
    },
    HelpIntent: function (intent, session, response) {
        response.ask("You can  tell me to turn on Red or Green or Blue light!");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Particle skill.
    var particleSkill = new Particle();
    particleSkill.execute(event, context);
};

function makeParticleRequest(hname, urlPath, args, accessToken, callback){
    // Particle API parameters
    var options = {
        hostname: hname,
        port: 443,
        path: urlPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*.*'
        }
    }

    var postData = "access_token=" + accessToken + "&" + "args=" + args;

    console.log("Post Data: " + postData);

    // Call Particle API
    var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

        var body = "";

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);

            body += chunk;
        });

        res.on('end', function () {
            callback(body);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(postData);
    req.end();
}