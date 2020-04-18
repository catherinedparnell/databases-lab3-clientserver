
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

def make_get_call(url):
	#make get call to url
	resp = requests.get(url)
	#expecting to get a status of 200 on success
	if resp.json()['status'] != 200:
		# This means something went wrong.
		print 'Something went wrong {}'.format(resp.status_code)
		exit()

	#print data returned
	print "get succeeded"
	for restaurant in resp.json()['response']:
		print restaurant["RestaurantID"],restaurant["RestaurantName"],restaurant["Boro"]


def make_post_call(url, data):
	#make post call to url passing it data
	resp = requests.post(url, json=data)
	#expecting to get a status of 201 on success
	if resp.json()['status'] != 201:
		print 'Something went wrong {}'.format(resp.status_code)
		exit()
	print 'post succeeded'
	print resp.json()

def make_put_call(url,data):
	#make post call to url passing it data
	resp = requests.put(url, json=data)
	#expecting to get a status of 200 on success
	if resp.json()['status'] != 200:
		print 'Something went wrong {}'.format(resp.status_code)
		exit()
	print 'put succeeded'
	print resp.json()

def make_delete_call(url):
	#make post call to url passing it data
	resp = requests.delete(url)
	#expecting to get a status of 200 on success
	if resp.json()['status'] != 200:
		print 'Something went wrong {}'.format(resp.status_code)
		exit()
	print 'delete succeeded'
	print resp.json()



if __name__ == '__main__':

	#make a get call
	print "Making a get (read) call to restaurants"
	make_get_call('http://localhost:3000/api/restaurants/')

	print "\nMaking a get (read) call to a specific restaurant (id=30075445)"
	make_get_call('http://localhost:3000/api/restaurants/30075445')

	print "\nMaking a post (create) call"
	restaurant_data = {"RestaurantName": "Your New Retaurant", "Boro": "Manhattan" }
	make_post_call('http://localhost:3000/api/restaurants/',restaurant_data)

	print "\nMaking a put (update) call"
	restaurant_data = {"RestaurantName": "This is a new name", "Boro": "Queens" }
	make_put_call('http://localhost:3000/api/restaurants/30075445',restaurant_data)

	print "\nMaking a delete call to restaurants"
	make_delete_call('http://localhost:3000/api/restaurants/30075445')





	