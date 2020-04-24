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
	let hash = global.connection.query('SELECT Password FROM nyc_inspections.HealthInspectors WHERE Username = ?', [req.params.user],function (error, results, fields) {
		if (error) throw error;
		console.log("password retrieved");
	});
	if(bcrypt.compareSync(pass, hash)) {
		return true;
	   } else {
		return false;
	   };
};

// GET - read data from database, return status code 200 if successful
router.get("/api/healthinspectors",function(user,pass,req,res){
	if (checkCredentials(user, pass)) {
		// get all instructors (limited to first 10 here), return status code 200
		global.connection.query('SELECT * FROM nyc_inspections.HealthInspectors LIMIT 10', function (error, results, fields) {
			if (error) throw error;
			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
		});
	} else {
		res.send("Yo!  This my API.  Get your password right, or don't call it at all!");
	}
	
});

router.get("/api/healthinspectors/:user",function(user,pass,req,res){
	//funciton to check username and password
	//read a single inspector with username = req.params.user (the :user in the url above), return status code 200 if successful, 404 if not
	global.connection.query('SELECT * FROM nyc_inspections.HealthInspectors WHERE Username = ?', [req.params.user],function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	});
});

// PUT - UPDATE data in database, make sure to get the user of the row to update from URL route, return status code 200 if successful
router.put("/api/healthinspectors/:user",function(user,pass,req,res){
	console.log(req.body);
	global.connection.query("UPDATE nyc_inspections.HealthInspectors SET HireDate = "+req.body.HireDate+", Salary = "+req.body.Salary+", AdminPrivileges = "+req.body.AdminPrivileges+" WHERE Username = ?", [req.params.user],function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": "here on a put -- update inspector with Username=" + req.params.user}));
	});
});

// POST -- create new inspector, return status code 200 if successful
router.post("/api/healthinspectors", function(user,pass,req,res){
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
router.delete("/api/healthinspectors/:user",function(user,pass,req,res){
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