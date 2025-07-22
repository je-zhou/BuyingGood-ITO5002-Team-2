""" Environment Variables """

import os

mongodb_user = os.getenv('mongodb_user')
mongodb_pass = os.getenv('mongodb_pass')
mongodb_uri = os.getenv('mongodb_uri')
mongodb_appname = os.getenv('mongodb_appname')
salt = os.getenv('salt')


""" MongoDB Setup """

from pymongo.mongo_client import MongoClient
from bson import ObjectId
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


""" Flask Setup """

from flask import Flask, jsonify, request
import exceptions as exc
import hashlib
import datetime
import uuid
import numpy as np

app = Flask(__name__)


""" Helper Functions """

def generate_nonce():
    """Generate nonce."""
    nonce = uuid.uuid1()
    return nonce.hex

def check_bearer_valid(bearer_token : str, request_time, remote_addr : str):
    """
        Check if the provided email and bearer_token are valid

        parameters:
            bearer_token : str, the token that the user is trying to authenticate with
            request_time : datetime, the time that the request was sent
        
        return:
            True | False, True if the bearer token is valid, False if it is not valid
            
    """
    try:
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
                "expiry": request_time + datetime.timedelta(minutes=10)
            }})
        
        return document is not None
    except Exception as e:
        raise(e)

def check_authentication(headers, request_time, remote_addr : str):
    db = client.authentication

    # Extract the bearer token from the headers
    bearer = headers.get('Authorization')
    token = bearer.split()[1]

    # Check if the provided token is valid
    if not check_bearer_valid(token, request_time, remote_addr):
        print(f"    {remote_addr}: Bearer token not valid as of {str(request_time)}")
        raise exc.Unauthorized(f"Bearer token not valid as of {str(request_time)}")

    # Find the user associated with the bearer token
    token_entry = db.bearer_tokens.find_one({
        "token": token,
        "expiry": { "$gt" : request_time },
        "active": True,
        "remote_addr": remote_addr
    })

    return token_entry["user_id"]

def mongo_to_dict(obj, id_name="id", exclusion_list=[]):
    """
        Recursively traverses a dictionary or list, converting MongoDB BSON types
        to JSON-serializable Python types.

        - Renames '_id' to a specified name (default: 'id').
        - Converts any value that is an ObjectId to its string representation.
        - Converts any datetime object to a Unix timestamp (float).
        - Works on nested dictionaries and lists of dictionaries.
    """
    if isinstance(obj, list):
        # If the object is a list, recursively call this function for each item
        return [mongo_to_dict(item, id_name, exclusion_list) for item in obj]

    if not isinstance(obj, dict):
        # If it's not a list or a dict, return it as is
        return obj

    # Create a new dictionary to hold the results to avoid issues with changing
    # the dictionary while iterating over it.
    new_doc = {}
    for key, value in obj.items():
        if key == '_id':
            # Rename '_id' and convert its value
            new_doc[id_name] = str(value)
        elif isinstance(value, ObjectId):
            # Convert any other ObjectId value to a string
            new_doc[key] = str(value)
        elif isinstance(value, datetime.datetime):
            # Convert datetime to a timestamp
            new_doc[key] = value.timestamp()
        elif isinstance(value, (dict, list)):
            # If the value is a dict or list, recurse
            new_doc[key] = mongo_to_dict(value, id_name, exclusion_list)
        else:
            # Otherwise, just copy the value
            new_doc[key] = value
            
    return new_doc


""" Authentication Endpoints """

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

        Response (201 Created)
    """

    try:
        request_time = datetime.datetime.now()
        db = client.authentication

        # Try to get the request body and make sure it is valid
        data = request.form
        print(f"{request.remote_addr}: Request body received, {data}")

        for key in ["email","password","firstName","lastName","phoneNumber"]:
            if not key in list(data.keys()):
                raise exc.BadRequest(f"Missing parameter, {key}")
        
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
        created_timestamp = request_time
        expiry_timestamp = request_time + datetime.timedelta(minutes=10)
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

        Response (200 OK)
    """

    try:
        request_time = datetime.datetime.now()
        db = client.authentication
        
        # Try to get the request body and make sure it is valid
        data = request.form
        print(f"{request.remote_addr}: Request body received, {data}")

        for key in ["email","password"]:
            if not key in list(data.keys()):
                raise exc.BadRequest(f"Missing parameter, {key}")
        
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

@app.route('/auth/profile', methods=["GET"])
def auth_profile():
    """
        Get user profile

        Endpoint: GET /auth/profile

        Response (200 OK)
    """
    try:
        request_time = datetime.datetime.now()
        db = client.authentication

        # Make sure the user is authenticated and get the user_id from the entry
        headers = request.headers
        user_id = check_authentication(headers, request_time, request.remote_addr)

        # Get the user profile
        user = db.users.find_one({
            "_id": user_id
        })

        # Return the user profile
        return jsonify({
            "success": True,
            "data": mongo_to_dict(user, "userId")
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


""" Farm Endpoints """

@app.route('/farms', methods=["POST", "GET"])
def farms():
    try:
        db = client.farm_details
        if request.method == "POST":
            # TODO: Authenticated
            request_time = datetime.datetime.now()

            # Make sure the user is authenticated and get the user_id from the entry
            headers = request.headers
            user_id = check_authentication(headers, request_time, request.remote_addr)
        elif request.method == "GET":
            """
                Get list of all registered farms with optional filtering

                Endpoint: GET /farms

                Query Parameters:
                    city (optional): Filter by city
                    state (optional): Filter by state
                    categories (optional): Filter by produce categories
                    page (optional): Page number for pagination (default: 1)
                    limit (optional): Items per page (default: 20)

                Response (200 OK)
            """
            data = request.args
            print(f"{request.remote_addr}: Request body received, {data}")

            filter = {}

            # Set the default page and limit
            page = 1
            limit = 20

            # Create the filter, and fill the page and limit if they have been provided
            for key in list(data.keys()):
                if key in ["city","state","categories"]:
                    filter[key] = data.get(key)
                elif key == "page":
                    page = int(data.get(key))
                elif key == "limit":
                    limit = np.clip(int(data.get(key)),1,100)
                else:
                    print(f"    {request.remote_addr}: {key} ignored")
            
            # Create the pagination information
            farm_count = int(db.farms.count_documents(filter))
            page_count = int(np.ceil(limit/farm_count) if farm_count > 0 else 0)
            page = int(np.clip(page,1,page_count if page_count > 0 else 1))
            first_item = int((page-1)*limit+1)

            # TODO: order by distance to current position
            cursor = db.farms.find(filter,skip=first_item-1,limit=limit)
            farm_list = [mongo_to_dict(farm, "farmId") for farm in cursor]

            return jsonify({
                "success": True,
                "data": {
                    "farms": farm_list,
                    "pagination": {
                        "currentPage": page,
                        "totalPages": page_count,
                        "totalItems": farm_count,
                        "itemsPerPage": limit
                    }
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

@app.route('/farms/<farmId>', methods=["PUT", "DELETE", "GET"])
def farm(farmId : str):
    try:
        db = client.farm_details
        if request.method == "PUT":
            # TODO: Authenticated
            pass
        elif request.method == "DELETE":
            # TODO: Authenticated
            pass
        elif request.method == "GET":
            """
                Get detailed information about a specific farm

                Endpoint: GET /farms/:farmId

                Response (200 OK)
            """
            farm = db.farms.find_one({
                "_id": farmId
            })

            if farm is None:
                raise exc.BadRequest(f"No farm with ID {farmId} found!")

            return jsonify({
                "success": True,
                "data": mongo_to_dict(farm, "farmId") # TODO: add exclusion list
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

@app.route('/farms/<farmId>/produce', methods=["POST", "GET"])
def farm_produce(farmId : str):
    try:
        db = client.farm_details
        if request.method == "POST":
            # TODO: Authenticated
            pass
        elif request.method == "GET":
            """
                Get all produce items for a specific farm

                Endpoint: GET /farms/:farmId/produce

                Response (200 OK)
            """
            data = request.args
            print(f"{request.remote_addr}: Request body received, {data}")

            filter = {"farmId":farmId}

            # Get the farm details
            farm = db.farms.find_one({"_id":farmId})

            if farm is None:
                print(f"    {request.remote_addr}: Farm does not exist, {farmId}")
                raise exc.BadRequest(f"Farm does not exist, {farmId}")

            # Set the default page and limit
            page = 1
            limit = 20

            # Create the filter, and fill the page and limit if they have been provided
            for key in list(data.keys()):
                if key == "page":
                    page = int(data.get(key))
                elif key == "limit":
                    limit = np.clip(int(data.get(key)),1,100)
                else:
                    print(f"    {request.remote_addr}: {key} ignored")
            
            # Create the pagination information
            produce_count = int(db.produce.count_documents(filter))
            page_count = int(np.ceil(limit/produce_count) if produce_count > 0 else 0)
            page = int(np.clip(page,1,page_count if page_count > 0 else 1))
            first_item = int((page-1)*limit+1)

            # TODO: order by distance to current position
            cursor = db.produce.find(filter,skip=first_item-1,limit=limit)
            produce_list = [mongo_to_dict(produce, "produceId") for produce in cursor]

            return jsonify({
                "success": True,
                "data": {
                    "farmId": farmId,
                    "farmName": farm["farmName"],
                    "produce": produce_list,
                    "pagination": {
                        "currentPage": page,
                        "totalPages": page_count,
                        "totalItems": produce_count,
                        "itemsPerPage": limit
                    }
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

@app.route("/produce/<produceId>", methods=["PUT", "DELETE", "GET"])
def id_produce(produceId : str):
    try:
        db = client.farm_details
        if request.method == "PUT":
            # TODO: Authenticated
            pass
        elif request.method == "DELETE":
            # TODO: Authenticated
            pass
        elif request.method == "GET":
            """ 
                Get detailed information about specific produce 

                Endpoint: GET /produce/:produceId

                Response (200 OK)
            """
            
            data = request.args
            print(f"{request.remote_addr}: Request body received, {data}")

            # Get the produce document associated with this id
            produce = db.produce.find_one({"_id": produceId})
            # If no produce document was found return an error
            if produce is None:
                print(f"    {request.remote_addr}: Produce with this id does not exist, {produceId}")
                raise exc.BadRequest(f"Produce with this id does not exist, {produceId}")
            
            # Get the farm document associated with this produce
            farm = db.farms.find_one({"_id": produce["farmId"]})
            # If no farm was found with the produce document's farm id return an error
            if farm is None:
                print(f"    {request.remote_addr}: Farm with this id does not exist, {produce["farmId"]}")
                raise exc.BadRequest(f"Produce with this id does not exist, {produce["farmId"]}")
            
            # Convert the produce document to a json compatible dict
            produce_dict = mongo_to_dict(produce, "produceId")

            # Convert the farm document to a json compatible dict
            farm_dict = mongo_to_dict(farm, "farmId")
            
            # Add the farm dict to the produce dict
            produce_dict["farm"] = farm_dict

            # Return the details requested
            return jsonify({
                "success": True,
                "data": produce_dict
            })
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

@app.route('/produce', methods=["GET"])
def produce():
    try:
        # TODO: Not Authenticated
        pass
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

@app.route('/categories', methods=["GET"])
def categories():
    try:
        # TODO: Not Authenticated
        pass
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