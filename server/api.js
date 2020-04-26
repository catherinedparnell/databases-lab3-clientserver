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

// GET - read data from database, return status code 200 if successful
router.get("/api/healthinspectors",function(req,res){
	global.connection.query("SELECT Password FROM nyc_inspections.HealthInspectors WHERE Username ='" + req.body.user + "'",function (error, hash, fields) {
		if (error) throw error;
		if (typeof hash[0] !== 'undefined'){
			hash=hash[0].Password;
			let theresponse = bcrypt.compareSync(req.body.pwd, hash);
	
			if (theresponse === true) {
				global.connection.query("SELECT AdminPrivileges FROM nyc_inspections.HealthInspectors WHERE Username ='" + req.body.user + "'",function (error, privileges, fields) {
					console.log(privileges[0].AdminPrivileges[0]);
					if(privileges[0].AdminPrivileges[0] === 1){

						global.connection.query('SELECT * FROM nyc_inspections.HealthInspectors LIMIT 10', function (error, results, fields) {
							if (error) throw error;
							res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
						});
					}
					else {
						global.connection.query("SELECT * FROM nyc_inspections.HealthInspectors WHERE Username ='" + req.body.user + "'", function (error, results, fields) {
							if (error) throw error;
							res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
						});
					}
			});
			} else {
				res.send(JSON.stringify({"status": 201, "error" : "you used the wrong credentials", "response" : "try logging in again"}));
	}
}
});
	
});

router.get("/api/healthinspectors/:user",function(req,res){
	//funciton to check username and password
	console.log(req.params.user)
	global.connection.query("SELECT Password FROM nyc_inspections.HealthInspectors WHERE Username ='" + req.body.user + "'",function (error, hash, fields) {
		if (error) throw error;
		if (typeof hash[0] !== 'undefined'){
			hash=hash[0].Password;
			let theresponse = bcrypt.compareSync(req.body.pwd, hash);
	
			if (theresponse === true) {
				global.connection.query("SELECT AdminPrivileges FROM nyc_inspections.HealthInspectors WHERE Username ='" + req.body.user + "'",function (error, privileges, fields) {
					console.log(privileges[0].AdminPrivileges[0]);
					if(privileges[0].AdminPrivileges[0] === 1){

						global.connection.query('SELECT * FROM nyc_inspections.HealthInspectors WHERE Username= ?', [req.params.user],function (error, results, fields) {
							if (error) throw error;
							res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
						});
					}
					else {
						if (req.body.user !== req.params.user){
							res.send(JSON.stringify({"status": 201, "error": "invalid credentials", "response": "you don't have the privileges to access"}));
						}
						else {
						global.connection.query("SELECT * FROM nyc_inspections.HealthInspectors WHERE Username ='" + req.body.user + "'", function (error, results, fields) {
							if (error) throw error;
							res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
						});
					}
					}
			});
			} else {
				res.send(JSON.stringify({"status": 201, "error" : "you used the wrong credentials", "response" : "try logging in again"}));
	}
}
});

});

// PUT - UPDATE data in database, make sure to get the user of the row to update from URL route, return status code 200 if successful
router.put("/api/healthinspectors/:user",function(req,res){
	console.log(req.body);
	
	global.connection.query("SELECT Password FROM nyc_inspections.HealthInspectors WHERE Username ='" + req.body.user + "'",function (error, hash, fields) {
		if (error) throw error;
		if (typeof hash[0] !== 'undefined'){
			hash=hash[0].Password;
			let theresponse = bcrypt.compareSync(req.body.pwd, hash);
	
			if (theresponse === true) {
				global.connection.query("SELECT AdminPrivileges FROM nyc_inspections.HealthInspectors WHERE Username ='" + req.body.user + "'",function (error, privileges, fields) {
					console.log(privileges[0].AdminPrivileges[0]);
					if(privileges[0].AdminPrivileges[0] === 1){
						global.connection.query("UPDATE nyc_inspections.HealthInspectors SET HireDate = "+req.body.HireDate+", Salary = "+req.body.Salary+", AdminPrivileges = "+req.body.AdminPrivileges+" WHERE Username = ?", [req.params.user],function (error, results, fields) {
							if (error) throw error;
							res.send(JSON.stringify({"status": 200, "error": null, "response": "here on a put -- update inspector with Username=" + req.params.user}));
						});
					}
					else {
						res.send(JSON.stringify({"status": 203, "error": null, "response": "you don't have the necessary credentials to add a new user"}));
					}
			});
			} else {
				res.send(JSON.stringify({"status": 201, "error" : "you used the wrong credentials", "response" : "try logging in again"}));
	}
}
});

});

// POST -- create new inspector, return status code 200 if successful
router.post("/api/healthinspectors", function(req,res){
	console.log(req.body);
	global.connection.query("SELECT Password FROM nyc_inspections.HealthInspectors WHERE Username ='" + req.body.user + "'",function (error, hash, fields) {
		if (error) throw error;
		if (typeof hash[0] !== 'undefined'){
			hash=hash[0].Password;
			let theresponse = bcrypt.compareSync(req.body.pwd, hash);
	
			if (theresponse === true) {
				global.connection.query("SELECT AdminPrivileges FROM nyc_inspections.HealthInspectors WHERE Username ='" + req.body.user + "'",function (error, privileges, fields) {
					console.log(privileges[0].AdminPrivileges[0]);
					if(privileges[0].AdminPrivileges[0] === 1){
						let hash = bcrypt.hashSync(req.body.Password, 10);
						console.log(hash);
						global.connection.query("INSERT INTO HealthInspectors (HireDate, Salary, AdminPrivileges, Username, Password) VALUES ("+req.body.HireDate+","+req.body.Salary+","+req.body.AdminPrivileges+","+req.body.Username+", '"+hash+"' )", [req.params.id],function (error, results, fields) {
							if (error) throw error;
							res.send(JSON.stringify({"status": 201, "error": null, "response": "here on a post -- added inspector with Username=" + req.body.Username}));
						});
					}
					else {
						res.send(JSON.stringify({"status": 203, "error": null, "response": "you don't have the necessary credentials to add a new user"}));
					}
			});
			} else {
				res.send(JSON.stringify({"status": 201, "error" : "you used the wrong credentials", "response" : "try logging in again"}));
	}
}
});
	
});

// DELETE -- delete inspector with inspectorID of :user, return status code 200 if successful
router.delete("/api/healthinspectors/:user",function(req,res){
	global.connection.query("SELECT Password FROM nyc_inspections.HealthInspectors WHERE Username ='" + req.body.user + "'",function (error, hash, fields) {
		if (error) throw error;
		if (typeof hash[0] !== 'undefined'){
			hash=hash[0].Password;
			let theresponse = bcrypt.compareSync(req.body.pwd, hash);
	
			if (theresponse === true) {
				global.connection.query("SELECT AdminPrivileges FROM nyc_inspections.HealthInspectors WHERE Username ='" + req.body.user + "'",function (error, privileges, fields) {
					console.log(privileges[0].AdminPrivileges[0]);
					if(privileges[0].AdminPrivileges[0] === 1){
						global.connection.query("DELETE FROM nyc_inspections.HealthInspectors WHERE Username= ?", [req.params.user],function (error, results, fields) {
							if (error) throw error;
							res.send(JSON.stringify({"status": 200, "error": null, "response": "here on a delete -- remove restaurant with Username=" + req.params.user}));
						});
					}
					else {
						if (req.body.user !== req.params.user){
							res.send(JSON.stringify({"status": 201, "error": "invalid credentials", "response": "you don't have the privileges to access"}));
						}
						else {
							global.connection.query("DELETE FROM nyc_inspections.HealthInspectors WHERE Username= ?", [req.params.user],function (error, results, fields) {
								if (error) throw error;
								res.send(JSON.stringify({"status": 200, "error": null, "response": "here on a delete -- remove restaurant with Username=" + req.params.user}));
							
						});
					}
					}
			});
			} else {
				res.send(JSON.stringify({"status": 201, "error" : "you used the wrong credentials", "response" : "try logging in again"}));
	}
}
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