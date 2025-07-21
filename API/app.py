""" Environment Variables """
import os

mongodb_user = os.getenv('mongodb_user')
mongodb_pass = os.getenv('mongodb_pass')
mongodb_uri = os.getenv('mongodb_uri')
mongodb_appname = os.getenv('mongodb_appname')
salt = os.getenv('salt')


""" MongoDB Setup """
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = f"mongodb+srv://{mongodb_user}:{mongodb_pass}@{mongodb_uri}/?retryWrites=true&w=majority&appName={mongodb_appname}"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


""" Flask """
from flask import Flask, jsonify, request
import exceptions as exc
import hashlib
import time
import datetime
import uuid

app = Flask(__name__)


""" Authentication Endpoints """

def generate_nonce():
    """Generate nonce."""
    nonce = uuid.uuid1()
    return nonce.hex

def check_bearer_valid(bearer_token : str, request_time : float, remote_addr : str):
    """
        Check if the provided email and bearer_token are valid

        parameters:
            bearer_token : str, the token that the user is trying to authenticate with
            request_time : float, the time that the request was sent
        
        return:
            True | False, True if the bearer token is valid, False if it is not valid
            
    """
    db = client.authentication

    document = db.bearer_tokens.find_one({
        "token": bearer_token,
        "expiry": { "$gt" : request_time },
        "active": True,
        "remote_addr": remote_addr
    })

    # Add time to the bearer token to keep it alive
    if document is not None:
        db.bearer_tokens.update_one({
            "_id": document["_id"]
        },{"$set":{
            "expiry": document["request_time"] + datetime.timedelta(minutes=10)
        }})

    return document is not None

@app.route("/auth/register", methods=["POST"])
def auth_register():
    """
        Register a new farmer account
    
        Endpoint: POST /auth/register

        Request Body:
        {
            "email": "farmer@example.com",
            "password": "securePassword123",
            "firstName": "John",
            "lastName": "Doe",
            "phoneNumber": "+1234567890"
        }

        Response (201 Created):
        {
            "success": true,
            "message": "Farmer registered successfully",
            "data": {
                "userId": "uuid-string",
                "email": "farmer@example.com",
                "firstName": "John",
                "lastName": "Doe",
                "token": "jwt-token-string"
            }
        }
    """

    try:
        request_time = datetime.datetime.now()

        # Try to get the request body and make sure it is valid
        data = request.form
        print(f"{request.remote_addr}: Request body received, {data}")

        for key in ["email","password","firstName","lastName","phoneNumber"]:
            if not key in list(data.keys()):
                raise exc.BadRequest(f"Missing parameter, {key}")
        
        # Connect to the database 
        db = client.authentication
        
        # Check if the user email is already registered
        existing_user = db.users.find_one({"email": data.get("email")})
        if existing_user is not None:
            print(f"    {request.remote_addr}: Email is already registered, {data.get("email")}")
            raise exc.BadRequest(f"Email is already registered, {data.get("email")}")
        
        # Salt and hash the password
        hashed_password = hashlib.sha256((data.get("password") + salt).encode()).hexdigest()

        # Attempt to create the user in the database
        user_id = db.users.insert_one({
            "email": data.get("email"),
            "firstName": data.get("firstName"),
            "lastName": data.get("lastName"),
            "phoneNumber": data.get("phoneNumber"),
            "createdAt": request_time,
            "modifiedAt": request_time
        }).inserted_id
        print(f"    {request.remote_addr}: user_id created, {user_id}")

        # Attempt to create the login credentials in the database
        db.credentials.insert_one({
            "user_id": user_id,
            "email": data.get("email"),
            "password": hashed_password
        })
        print(f"    {request.remote_addr}: credentials created, {user_id}")

        # Attempt to create an initial bearer token with a 10min expiry
        nonce = generate_nonce()
        created_timestamp = int(time.time())
        expiry_timestamp = int(time.time())+600
        db.bearer_tokens.insert_one({
            "user_id": user_id,
            "token": nonce,
            "expiry": expiry_timestamp,
            "active": True,
            "created": created_timestamp,
            "remote_addr": request.remote_addr
        })
        print(f"    {request.remote_addr}: bearer token created, {nonce}")

        return jsonify({
            "success": True,
            "message": "Farmer registered successfully",
            "data": {
                "userId": str(user_id),
                "email": data.get("email"),
                "firstName": data.get("firstName"),
                "lastName": data.get("lastName"),
                "token": nonce
            }
        }), 201
    except exc.BadRequest as e:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "400",
                    "message": "BAD_REQUEST",
                    "details": e.message
                }
            }
        ), 400
    except exc.Unauthorized as e:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "401",
                    "message": "UNAUTHORIZED",
                    "details": e.message
                }
            }
        ), 401
    except exc.Forbidden as e:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "403",
                    "message": "FORBIDDEN",
                    "details": e.message
                }
            }
        ), 403
    except Exception as e:
        print(e)
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "500",
                    "message": "INTERNAL_ERROR",
                    "details": "The server encountered an unexpected condition that prevented it from fulfilling the request."
                }
            }
        ), 500

@app.route("/auth/login", methods=["POST"])
def auth_login():
    """
        Login a farmer account
    
        Endpoint: POST /auth/login

        Request Body:
        {
            "email": "farmer@example.com",
            "password": "securePassword123"
        }

        Response (200 OK):
        {
            "success": true,
            "message": "Farmer authenticated successfully",
            "data": {
                "userId": "uuid-string",
                "email": "farmer@example.com",
                "token": "jwt-token-string"
            }
        }
    """

    try:
        request_time = datetime.datetime.now()
        
        # Try to get the request body and make sure it is valid
        data = request.form
        print(f"{request.remote_addr}: Request body received, {data}")

        for key in ["email","password"]:
            if not key in list(data.keys()):
                raise exc.BadRequest(f"Missing parameter, {key}")
            
        # Connect to the database 
        db = client.authentication
        
        # Salt and hash the password
        hashed_password = hashlib.sha256((data.get("password") + salt).encode()).hexdigest()

        # Check if the email and password is correct
        existing_credentials = db.credentials.find_one({
            "email": data.get("email"), "password": hashed_password
        })

        if existing_credentials is None:
            print(f"    {request.remote_addr}: Incorrect email or password, {data.get("email")}")
            raise exc.BadRequest(f"Incorrect email or password")
        
        user_id = existing_credentials["user_id"]

        # Deactivate all of the existing tokens for this IP
        db.bearer_tokens.update_many({
            "user_id": user_id,
            "remote_addr": request.remote_addr,
            "active": True
        }, {
            "$set": {"active": False}
        })
        
        # Attempt to create a new bearer token with a 10 minute expiry
        nonce = generate_nonce()
        created_timestamp = request_time
        expiry_timestamp = request_time + datetime.timedelta(minutes=10)
        db.bearer_tokens.insert_one({
            "user_id": user_id,
            "remote_addr": request.remote_addr,
            "expiry": expiry_timestamp,
            "created": created_timestamp,
            "token": nonce,
            "active": True
        })
        print(f"    {request.remote_addr}: bearer token created, {nonce}")

        user = db.users.find_one({
            "email": data.get("email")
        })
        firstName = user["firstName"]
        lastName = user["lastName"]
        return jsonify({
            "success": True,
            "message": "Farmer authenticated successfully",
            "data": {
                "userId": str(user_id),
                "email": data.get("email"),
                "firstName": firstName,
                "lastName": lastName,
                "token": nonce
            }
        }), 200
    except exc.BadRequest as e:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "400",
                    "message": "BAD_REQUEST",
                    "details": e.message
                }
            }
        ), 400
    except exc.Unauthorized as e:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "401",
                    "message": "UNAUTHORIZED",
                    "details": e.message
                }
            }
        ), 401
    except exc.Forbidden as e:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "403",
                    "message": "FORBIDDEN",
                    "details": e.message
                }
            }
        ), 403
    except Exception as e:
        print(e)
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "500",
                    "message": "INTERNAL_ERROR",
                    "details": "The server encountered an unexpected condition that prevented it from fulfilling the request."
                }
            }
        ), 500

@app.route('/auth/check_token', methods=["GET"])
def auth_check_token():

    try:
        request_time = datetime.datetime.now()

        data = request.args
        print(f"{request.remote_addr}: Request body received, {data}")

        for key in ["token"]:
            if not key in list(data.keys()):
                raise exc.BadRequest(f"Missing parameter, {key}")
        
        if not check_bearer_valid(data["token"], request_time, request.remote_addr):
            print(f"    {request.remote_addr}: Bearer token not valid as of {str(request_time)}")
            raise exc.Unauthorized(f"Bearer token not valid as of {str(request_time)}")
            
        return jsonify({
            "success": True,
            "message": f"Token is valid as of {str(request_time)}"
        }), 200
    except exc.BadRequest as e:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "400",
                    "message": "BAD_REQUEST",
                    "details": e.message
                }
            }
        ), 400
    except exc.Unauthorized as e:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "401",
                    "message": "UNAUTHORIZED",
                    "details": e.message
                }
            }
        ), 401
    except exc.Forbidden as e:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "403",
                    "message": "FORBIDDEN",
                    "details": e.message
                }
            }
        ), 403
    except Exception as e:
        print(e)
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "500",
                    "message": "INTERNAL_ERROR",
                    "details": "The server encountered an unexpected condition that prevented it from fulfilling the request."
                }
            }
        ), 500


""" Run Flask App """

if __name__ == '__main__':
    app.run(debug=True)