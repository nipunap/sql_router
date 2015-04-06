import httplib2
import json

def checkResponse(resp):
	if resp['status'] == '200':
		return True
	else:
		return False

headers = {'Content-Type': 'application/json'}
h = httplib2.Http()
token = None

#--------------- | Authentication | -------------------
user_data = {"username":"xyz", "password":"xyz"}
body = json.dumps(user_data)
resp, content = h.request("http://localhost:3000/api/auth", "POST", body=body, headers=headers)
if checkResponse(resp):
	response=json.loads(content)	
	token = response['token']
	print(json.dumps(response['status']))
else:
	print("Error orccured: " + str(resp))
	exit()

#--------------- | Query Execution | -------------------
sql_query = "show tables"	
db_config = {
    "server" : "127.0.0.1",
    "user":"dev_user",
    "password":"gvt123",
    "port":"3306",
    "database":"test"	
}
user_data = {"token":token, "sqlquery":sql_query, "dbconfig":db_config}
body = json.dumps(user_data)
resp, content = h.request("http://localhost:3000/api/sql/select", "POST", body=body, headers=headers)
if checkResponse(resp):	
	data=json.loads(content)
	print(json.dumps(data["json"]))
	print("Exection time: " + str(data["time"]) + "s")


#--------------- | Close session | -------------------
user_data = {"token":token}
body = json.dumps(user_data)
resp, content = h.request("http://localhost:3000/api/close", "POST", body=body, headers=headers)
if checkResponse(resp):	
	print(content)



