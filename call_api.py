
import requests
'''
Client side demo to fetch data from a RESTful API.  Assumes Node.js file api is running (nodemon api.js <localhost|sunapee>) 
on the server side.
Author: Tim Pierson, Dartmouth CS61, Spring 2020
Requires installation of mysql connector: pip install mysql-connector-python
	also requires Requests: pip install requests
Based on: https://dev.mysql.com/doc/connector-python/en/connector-python-example-connecting.html

Usage: python call_api.py 
'''

def make_get_call(url,user):
	#make get call to url
	resp = requests.get(url, json=user)
	#expecting to get a status of 200 on success
	if resp.json()['status'] != 200:
		# This means something went wrong.
		print('get unsuccessful')
		print(resp.json())
		
		
	#print data returned
	else:
		print("get succeeded")
		for user in resp.json()['response']:
			print(user["HireDate"], user["Salary"], user["AdminPrivileges"], user["Username"], user["Password"])

def make_post_call(url,data):
	#make post call to url passing it data
	resp = requests.post(url, json=data)
	#expecting to get a status of 201 on success
	if resp.json()['status'] != 201:
		print('post unsuccessful')
		print(resp.json())
	else:
		print('post succeeded')
		print(resp.json())

def make_put_call(url,data):
	#make post call to url passing it data
	resp = requests.put(url, json=data)
	#expecting to get a status of 200 on success
	if resp.json()['status'] != 200:
		print("put unsuccessful")
		print(resp.json())
	else:	
		print('put succeeded')
		print(resp.json())

def make_delete_call(url, data):
	#make post call to url passing it data
	resp = requests.delete(url, json=data)
	#expecting to get a status of 200 on success
	if resp.json()['status'] != 200:
		print('delete unsuccessful')
		print(resp.json())
	else:	
		print('delete succeeded')
		print(resp.json())



if __name__ == '__main__':
	running = True
	while running:
		print("To get all inspectors type '1'")
		print("To get a specific inspector type '2'")
		print("To get rid of an inspector type '3'")
		print("To add a new inspector type '4'")
		print("To update an inspector type '5'")
		print("To stop the program from running type 'q'")
		
		command = input()
		if command == "q":
			print("quitting program")
			running = False
		if command == "1":
			print("what is your username?")
			username = input()
			print("what is your password?")
			password = input()
			print("Making a get (read) call to restaurants")
			credentials = {"user": username, "pwd": password}
			make_get_call('http://localhost:3000/api/healthinspectors/', credentials)
		if command == "2":
			print("what is your username?")
			username = input()
			print("what is your password?")
			password = input()
			print("Making a get (read) call to restaurants")
			credentials = {"user": username, "pwd": password}
			print("please tell us the user you would like to get")
			userid = input()
			print("\nMaking a get (read) call to a specific employee (username=" + userid + ")")
			make_get_call('http://localhost:3000/api/healthinspectors/' + userid, credentials)
		if command == "3":
			print("what is your username?")
			username = input()
			print("what is your password?")
			password = input()
			print("Making a get (read) call to restaurants")
			credentials = {"user": username, "pwd": password}
			print("please tell us the name of the user you would like to delete")
			userid = input()
			print("\nMaking a delete call to HealthInspectors")
			make_delete_call('http://localhost:3000/api/healthinspectors/' + userid, credentials)
		if command == "4":
			print("what is your username?")
			username = input()
			print("what is your password?")
			password = input()
			print("plase tell us your parameters in the following comma separated form")
			print("HireDate (in the form YYYY-MM-DD), Salary, AdminPrivileges (0 or 1), Username, Password")
			newuser = input()
			parameters = newuser.split(',')
			formatted = []
			for parameter in parameters:
				instance = parameter.replace(' ', '')
				formatted.append(instance)
				
			print("\nMaking a post (create) call")
			user_data = {"HireDate": "'" + formatted[0] + "'", "Salary": str(formatted[1]), "AdminPrivileges": str(formatted[2]),
	 		"Username": "'" + formatted[3] + "'", "Password": str(formatted[4]), "user": username, "pwd": password}
			make_post_call('http://localhost:3000/api/healthinspectors/',user_data)
			
		if command == '5':
			print("what is your username?")
			username = input()
			print("what is your password?")
			password = input()
			print("please tell us the user that you would like to update")
			tochange = input()
			print("now could you give us what you would like the entry to be changed to in the following form")
			print("HireDate (in the form YYYY-MM-DD), Salary, AdminPrivileges (0 or 1), Username, Password")
			changes = input()
			parameters = changes.split(',')
			formatted = []
			for parameter in parameters:
				instance = parameter.replace(' ', '')
				formatted.append(instance)

			print("\nMaking a put (update) call")
			user_data = {"HireDate": "'" + formatted[0] + "'", "Salary": str(formatted[1]), "AdminPrivileges": str(formatted[2]),
			"Username": "'" + formatted[3] + "'", "Password": str(formatted[4]), "user": username, "pwd": password }
			make_put_call('http://localhost:3000/api/healthinspectors/'+ tochange,user_data)



	
	'''
	#make a get call
	print("Making a get (read) call to restaurants")
	make_get_call('http://localhost:3000/api/healthinspectors/')

	print("\nMaking a get (read) call to a specific employee (username=User2)")
	make_get_call('http://localhost:3000/api/healthinspectors/User2')

	print("\nMaking a post (create) call")
	user_data = {"HireDate": "'2015-08-08'", "Salary": "2100000", "AdminPrivileges": "1",
	 "Username": "'delete'", "Password": "scripted" }
	make_post_call('http://localhost:3000/api/healthinspectors/',user_data)
	
	print("\nMaking a put (update) call")
	user_data = {"HireDate": "'2015-08-08'", "Salary": "2234000", "AdminPrivileges": "1",
	 "Username": "'newcatherine'", "Password": "scripted" }
	make_put_call('http://localhost:3000/api/healthinspectors/catherine',user_data)
	
	print("\nMaking a delete call to restaurants")
	make_delete_call('http://localhost:3000/api/healthinspectors/delete')
	'''



	