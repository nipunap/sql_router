import httplib2
import json

url = "http://localhost:3000"
username = "xyz"
password = "xyz"

def checkResponse(resp):
	if resp['status'] == '200':
		return True
	else:
		return False

headers = {'Content-Type': 'application/json'}
h = httplib2.Http()
token = None

#--------------- | Authentication | -------------------
user_data = {"username":username, "password":password}
body = json.dumps(user_data)
resp, content = h.request(url + "/api/auth", "POST", body=body, headers=headers)
if checkResponse(resp):
	response=json.loads(content)	
	token = response['token']
	print(json.dumps(response['status']))
else:
	print("Error orccured: " + str(resp))
	exit()

#--------------- | Query Execution | -------------------
sql_query = "select * from test"	
db_config = {
    "server" : "localhost",
    "user":"dev_user",
    "password":"gvt123",
    "port":"3306",
    "database":"test"	
}
user_data = {"token":token, "sqlquery":sql_query, "dbconfig":db_config}
body = json.dumps(user_data)
resp, content = h.request(url + "/api/sql/select", "POST", body=body, headers=headers)
if checkResponse(resp):	
	data=json.loads(content)
	print(json.dumps(data["json"]))
	print("Exection time: " + str(data["time"]) + "s")


#--------------- | Close session | -------------------
user_data = {"token":token}
body = json.dumps(user_data)
resp, content = h.request(url + "/api/close", "POST", body=body, headers=headers)
if checkResponse(resp):	
	print(content)



