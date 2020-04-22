/* 	Node API demo
	Author: Tim Pierson, Dartmouth CS61, Spring 2020

	Add config.js file to root directory
	To run: nodemon api.js <local|sunapee>
	App will use the database credentials and port stored in config.js for local or sunapee server
	Recommend Postman app for testing verbs other than GET, find Postman at https://www.postman.com/
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
// calls should be made to /api/restaurants with GET/PUT/POST/DELETE verbs
// you can test GETs with a browser using URL http://localhost:3000/api/restaurants or http://localhost:3000/api/restaurants/30075445
// recommend Postman app for testing other verbs, find it at https://www.postman.com/
router.get("/",function(req,res){
	res.send("Yo!  This my API.  Call it right, or don't call it at all!");
});

// GET - read data from database, return status code 200 if successful
router.get("/api/healthinspectors",function(req,res){
	// get all restaurants (limited to first 10 here), return status code 200
	global.connection.query('SELECT * FROM nyc_inspections.HealthInspectors LIMIT 10', function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	});
});

router.get("/api/healthinspectors/:user",function(req,res){
	console.log(req.params.id);
	//read a single restaurant with RestauantID = req.params.id (the :id in the url above), return status code 200 if successful, 404 if not
	global.connection.query('SELECT * FROM nyc_inspections.HealthInspectors WHERE Username = ?', [req.params.user],function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	});
});

// PUT - UPDATE data in database, make sure to get the ID of the row to update from URL route, return status code 200 if successful
router.put("/api/healthinspectors/:user",function(req,res){
	console.log(req.body);
	global.connection.query("UPDATE nyc_inspections.HealthInspectors SET HireDate = "+req.body.HireDate+", Salary = "+req.body.Salary+", AdminPrivileges = "+req.body.AdminPrivileges+" WHERE Username = ?", [req.params.user],function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": "here on a put -- update inspector with Username=" + req.params.user}));
	});
});

async function passHash(pass) {

	const hashedPassword = await new Promise((resolve, reject) => {
		bcrypt.hash(pass, saltRounds, function(err, hash) {
		  if (err) reject(err)
		  resolve(hash)
		});
	  })

	return hashedPassword;
  }

// POST -- create new restaurant, return location of new restaurant in location header, return status code 200 if successful
router.post("/api/healthinspectors", function(req,res){
	console.log(req.body);
	
	const pwd = passHash(req.body.password)

	console.log(hash);
	global.connection.query("INSERT INTO HealthInspectors (HireDate, Salary, AdminPrivileges, Username, Password) VALUES ("+req.body.HireDate+","+req.body.Salary+","+req.body.AdminPrivileges+","+req.body.Username+","+pwd+")", [req.params.id],function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"yay": "success!"}));
	});
});

// DELETE -- delete restaurant with RestaurantID of :id, return status code 200 if successful
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