/* 	Node API for Health Inspectors
	Authors: Catherine Parnell and Satch Baker, Dartmouth CS61, Spring 2020
	Adapted from: Tim Pierson, Dartmouth CS61, Spring 2020
*/

var express=require('express');
let mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser'); //allows us to get passed in api calls easily
const saltRounds = 10;
var app=express();

// get config
var env = process.argv[2] || 'local'; //use localhost if enviroment not specified
var config = require('./config')[env]; //read credentials from config.js


//Database connection
app.use(function(req, res, next){
	global.connection = mysql.createConnection({
		host     : config.database.host, 
		user     : config.database.user, 
		password : config.database.password, 
		database : config.database.schema 
	});
	connection.connect();
	next();
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// set up router
var router = express.Router();

// log request types to server console
router.use(function (req,res,next) {
	console.log("/" + req.method);
	next();
});

// set up routing
router.get("/",function(req,res){
	res.send("Yo!  This my API.  Call it right, or don't call it at all!");
});
function checkCredentials(user, pass) {
	//something = "'" + user + "'"
	global.connection.query("SELECT Password FROM nyc_inspections.HealthInspectors WHERE Username ='" + user + "'",function (error, hash, fields) {
		if (error) throw error;
		console.log(hash)
		console.log(JSON.stringify(hash[0].Password));
		var hashed = JSON.stringify(hash[0].Password);
		//const newhash = JSON.parse(hashed)
		var other = "$2b$10$gP2bqHiI3Fyy9YZyOJ/3G.aVF5RfWFkddcJ0Jm5.0BonkccdpjvAa";
		if(bcrypt.compareSync(pass, other)) {
			console.log("password matches");
			return true;
		} 
		else {
			console.log("password does not match");
			return false;
		};
	});
};

// GET - read data from database, return status code 200 if successful
router.get("/api/healthinspectors",function(req,res){
	
	if (checkCredentials(req.body.user, req.body.pwd)) {
		// get all instructors (limited to first 10 here), return status code 200
		global.connection.query('SELECT * FROM nyc_inspections.HealthInspectors LIMIT 10', function (error, results, fields) {
			if (error) throw error;
			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
		});
	} else {
		//console.log("what's going on with this")
		res.send(JSON.stringify({"status": 201, "error" : "you used the wrong credentials", "response" : "try logging in again"}));
	}
	
});

router.get("/api/healthinspectors/:user",function(req,res){
	//funciton to check username and password
	console.log(req.params.user)
	//read a single inspector with username = req.params.user (the :user in the url above), return status code 200 if successful, 404 if not
	global.connection.query('SELECT * FROM nyc_inspections.HealthInspectors WHERE Username = ?', [req.params.user],function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	});
});

// PUT - UPDATE data in database, make sure to get the user of the row to update from URL route, return status code 200 if successful
router.put("/api/healthinspectors/:user",function(req,res){
	console.log(req.body);
	global.connection.query("UPDATE nyc_inspections.HealthInspectors SET HireDate = "+req.body.HireDate+", Salary = "+req.body.Salary+", AdminPrivileges = "+req.body.AdminPrivileges+" WHERE Username = ?", [req.params.user],function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": "here on a put -- update inspector with Username=" + req.params.user}));
	});
});

// POST -- create new inspector, return status code 200 if successful
router.post("/api/healthinspectors", function(req,res){
	console.log(req.body);

	// synchronous
	let hash = bcrypt.hashSync(req.body.Password, 10);
	console.log(hash);
	global.connection.query("INSERT INTO HealthInspectors (HireDate, Salary, AdminPrivileges, Username, Password) VALUES ("+req.body.HireDate+","+req.body.Salary+","+req.body.AdminPrivileges+","+req.body.Username+", '"+hash+"' )", [req.params.id],function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 201, "error": null, "response": "here on a post -- added inspector with Username=" + req.body.Username}));
	});
	

	
});

// DELETE -- delete inspector with inspectorID of :user, return status code 200 if successful
router.delete("/api/healthinspectors/:user",function(req,res){
	global.connection.query("DELETE FROM nyc_inspections.HealthInspectors WHERE Username= ?", [req.params.user],function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": "here on a delete -- remove restaurant with Username=" + req.params.user}));
	});
});


// start server running on port 3000 (or whatever is set in env)
app.use(express.static(__dirname + '/'));
app.use("/",router);
app.set( 'port', ( process.env.PORT || config.port || 3000 ));

app.listen(app.get( 'port' ), function() {
	console.log( 'Node server is running on port ' + app.get( 'port' ));
	console.log( 'Environment is ' + env);
});