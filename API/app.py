""" Environment Variables """

import os

mongodb_user = os.getenv('mongodb_user')
mongodb_pass = os.getenv('mongodb_pass')
mongodb_uri = os.getenv('mongodb_uri')
mongodb_appname = os.getenv('mongodb_appname')
clerk_secret_key = os.getenv('clerk_secret_key')

if clerk_secret_key == "" or clerk_secret_key is None:
    # Retry the load of the env variables with the .env file
    from dotenv import load_dotenv
    load_dotenv()

    mongodb_user = os.getenv('mongodb_user')
    mongodb_pass = os.getenv('mongodb_pass')
    mongodb_uri = os.getenv('mongodb_uri')
    mongodb_appname = os.getenv('mongodb_appname')
    clerk_secret_key = os.getenv('clerk_secret_key')

""" MongoDB Setup """

from pymongo.mongo_client import MongoClient
from bson import ObjectId
from pymongo.server_api import ServerApi

uri = f"mongodb+srv://{mongodb_user}:{mongodb_pass}@{mongodb_uri}/?retryWrites=true&w=majority&appName={mongodb_appname}"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# only for MAC
import certifi
client = MongoClient(uri, server_api=ServerApi('1'), tlsCAFile=certifi.where())

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


""" Flask Setup """

from flask import Flask, jsonify, request, g
import exceptions as exc
import datetime
import numpy as np

app = Flask(__name__)


""" Clerk Authentication """

from clerk_backend_api import Clerk
from clerk_backend_api.security.types import AuthenticateRequestOptions
from functools import wraps

clerk = Clerk(bearer_auth=clerk_secret_key)

# This decorator protects routes by verifying the Clerk session token
def clerk_auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            claims_state = clerk.authenticate_request(
                request,
                AuthenticateRequestOptions()
            )

            print(" Headers: ", request.headers)

            # # The 'status' of a valid request is 'signed_in'.
            # if claims_state.status != "signed_in":
            #     raise exc.Unauthorized("Invalid authentication token.")
            
            # Access the user ID via the .payload attribute.
            g.user_id = claims_state.payload.get("sub")


            if g.user_id == "user_30K4lb7TiQ0dNkhl2FSUy0t6ftQ":
                g.user_id = '687f15cef56cd689e409219c';
        except exc.Unauthorized as e:
            print(f"Authentication error: {e.message}")
            return jsonify({
                "success": False, 
                "error": {
                    "code": "401", 
                    "message": "UNAUTHORIZED", 
                    "details": "Authentication token is missing or invalid."
                }
            }), 401
        return f(*args, **kwargs)
    return decorated_function


""" Helper Functions """

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
        Register a new farmer email and return a user id
    
        Endpoint: POST /auth/register

        Request Body:
        {
            "email": "farmer@example.com",
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

        for key in ["email","firstName","lastName","phoneNumber"]:
            if not key in list(data.keys()):
                raise exc.BadRequest(f"Missing parameter, {key}")
        
        # Check if the user email is already registered
        existing_user = db.users.find_one({"email": data.get("email")})
        if existing_user is not None:
            print(f"    {request.remote_addr}: Email is already registered, {data.get("email")}")
            raise exc.BadRequest(f"Email is already registered, {data.get("email")}")

        # Attempt to create the user in the database
        user_id = db.users.insert_one({
            "email": data.get("email"),
            "firstName": data.get("firstName"),
            "lastName": data.get("lastName"),
            "phoneNumbers": [data.get("phoneNumber")],
            "createdAt": request_time,
            "modifiedAt": request_time
        }).inserted_id
        print(f"    {request.remote_addr}: user_id created, {user_id}")

        return jsonify({
            "success": True,
            "message": "Farmer registered successfully",
            "data": {
                "userId": str(user_id),
                "email": data.get("email"),
                "firstName": data.get("firstName"),
                "lastName": data.get("lastName")
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

@app.route("/auth/update", methods=["POST"])
@clerk_auth_required
def auth_update():
    """
        Update details of a farmer account
    
        Endpoint: POST /auth/update

        Request Body:
        {
            "birthday": "%d/%m/%Y",
            "first_name": "",
            "last_name": "",
            "gender": "",
            "phone_numbers": [],
            "email_addressses": [{"email_address":"","id":""}],
            "primary_email_address_id": "",
            "profile_image_url": "",
            "updated_at": 1654012824306,
            "image_url": ""
        }

        Response (201 Created)
    """
    try:
        db = client.authentication

        # Try to get the request body and make sure it is valid
        data = request.form
        print(f"{request.remote_addr}: Request body received, {data}")
        
        # Get the user id from the authentication decorator
        user_id = g.user_id

        # Check if the user exists
        existing_user = db.users.find_one({"_id": ObjectId(user_id)})
        if existing_user is None:
            print(f"    {request.remote_addr}: User ID does not exist, {user_id}")
            raise exc.BadRequest(f"User ID does not exist, {user_id}")

        phone_number = ""
        try:
            phone_number = data.get("phone_numbers")[0] if len(data.get("phone_numbers")) > 0 else ""
        except:
            pass

        email_address = ""
        for email in data.get("email_addressses"):
            if email["id"] == data.get("primary_email_address_id"):
                email_address = email["email_address"]

        # Attempt to update the users details in the database
        user_id = db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                '$set': {
                    "firstName": data.get("first_name"),
                    "lastName": data.get("last_name"),
                    "birthday": datetime.datetime.strptime(data.get("birthday"), "%d/%m/%Y").date() if data.get("birthday") != "" else "",
                    "gender": data.get("gender"),
                    "phoneNumber": phone_number,
                    "email": email_address,
                    "profileImage": data.get("profile_image_url"),
                    "updatedAt": datetime.datetime.fromtimestamp(data.get("updated_at"))
                }
            }
        )
        print(f"    {request.remote_addr}: user updated, {user_id}")

        return jsonify({
            "success": True,
            "message": "Farmer updated successfully"
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

@app.route("/auth/delete", methods=["POST"])
@clerk_auth_required
def auth_delete():
    """
        Delete a farmer account
    
        Endpoint: POST /auth/update

        Request Body:
        {
            "id": "user_29wBMCtzATuFJut8jO2VNTVekS4"
        }

        Response (201 Created)
    """
    try:
        db = client.authentication

        # Try to get the request body and make sure it is valid
        data = request.form
        print(f"{request.remote_addr}: Request body received, {data}")
        
        # Get the user id from the authentication decorator
        user_id = g.user_id

        # Check if the user exists
        existing_user = db.users.find_one({"_id": ObjectId(user_id)})
        if existing_user is None:
            print(f"    {request.remote_addr}: User ID does not exist, {user_id}")
            raise exc.BadRequest(f"User ID does not exist, {user_id}")

        # Deleted the user
        db.users.delete_one({"_id": ObjectId(user_id)})
        print(f"    {request.remote_addr}: user deleted, {user_id}")

        return jsonify({
            "success": True,
            "message": "Farmer deleted successfully"
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
@clerk_auth_required
def auth_profile():
    """
        Get user profile

        Endpoint: GET /auth/profile

        Response (200 OK)
    """
    try:
        db = client.authentication

        # Get the user id from the authentication decorator
        user_id = g.user_id
        
        # Get the the user if it exists
        existing_user = db.users.find_one({"_id": ObjectId(user_id)})
        if existing_user is None:
            print(f"    {request.remote_addr}: User ID does not exist, {user_id}")
            raise exc.BadRequest(f"User ID does not exist, {user_id}")

        # Return the user profile
        return jsonify({
            "success": True,
            "data": mongo_to_dict(existing_user, "userId")
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
            user_id = is_signed_in(headers, request.remote_addr)
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