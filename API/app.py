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

from flask_cors import CORS, cross_origin

cors = CORS(app) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'

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

            # TODO: actually verify the user token is still valid
            print(" Payload: ", claims_state)

            # Get the our id for this user
            db = client.authentication

            if claims_state.payload is None:
                raise exc.Unauthorized("Invalid authentication data was set to an authenticated endpoint.")
            
            g.clerk_id = claims_state.payload.get("sub")

            user = db.users.find_one({"clerkId": g.clerk_id})
            if user is None:
                raise exc.BadRequest(f"User not found, {g.clerk_id}")
            
            # Access the user ID via the .payload attribute.
            g.user_id = str(user["_id"])
            print(f"Authenticated {g.clerk_id} as {g.user_id}")
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
@cross_origin()
def auth_register():
    """
        Register a new farmer account
    
        Endpoint: POST /auth/register

        Response (201 Created)
    """
    try:
        db = client.authentication

        # Try to get the request body and make sure it is valid
        data = request.json.get("data")
        print(f"{request.remote_addr}: Request body received, {data}")
            
        phone_number = ""
        try:
            phone_number = data.get("phone_numbers")[0] if len(data.get("phone_numbers")) > 0 else ""
        except:
            pass

        email_address = ""
        for email in data.get("email_addresses"):
            if email["id"] == data.get("primary_email_address_id"):
                email_address = email["email_address"]
        
        # Check if the user email is already registered
        existing_user = db.users.find_one({"email": email_address})
        if existing_user is not None:
            print(f"    {request.remote_addr}: Email is already registered, {email_address}")
            raise exc.BadRequest(f"Email is already registered, {email_address}")
        
        birthday = None
        try:
            birthday = datetime.datetime.strptime(data.get("birthday"), "%d/%m/%Y").date() if data.get("birthday") != "" else ""
        except Exception as e:
            pass

        timestamp_milliseconds = data.get("updated_at")
        timestamp_seconds = timestamp_milliseconds / 1000

        dt_object = datetime.datetime.fromtimestamp(timestamp_seconds)

        # Attempt to create the user in the database
        user_id = db.users.insert_one({
            "firstName": data.get("first_name"),
            "lastName": data.get("last_name"),
            "birthday": birthday,
            "gender": data.get("gender"),
            "phoneNumber": phone_number,
            "email": email_address,
            "profileImage": data.get("profile_image_url"),
            "clerkId": data.get("id"),
            "createdAt": dt_object,
            "modifiedAt": dt_object
        }).inserted_id
        print(f"    {request.remote_addr}: user_id created, {user_id}")

        return jsonify({
            "success": True,
            "message": "Farmer registered successfully",
            "data": {
                "userId": str(user_id),
                "clerkId": data.get("id"),
                "email": email_address,
                "firstName": data.get("first_name"),
                "lastName": data.get("last_name")
            }
        }), 201
    except Exception as e:
        print(e)
        return exc.handle_error(e)

@app.route("/auth/update", methods=["POST"])
@cross_origin()
@clerk_auth_required
def auth_update():
    """
        Update details of a farmer account
    
        Endpoint: POST /auth/update

        Response (200 OK)
    """
    try:
        db = client.authentication
        
        # Get the user id from the authentication decorator
        user_id = g.user_id

        # Check if the user exists
        existing_user = db.users.find_one({"_id": ObjectId(user_id)})
        if existing_user is None:
            print(f"    {request.remote_addr}: User ID does not exist, {user_id}")
            raise exc.BadRequest(f"User ID does not exist, {user_id}")

        # Try to get the request body and make sure it is valid
        data = request.json.get("data")
        print(f"{request.remote_addr}: Request body received, {data}")
            
        phone_number = ""
        try:
            phone_number = data.get("phone_numbers")[0] if len(data.get("phone_numbers")) > 0 else ""
        except:
            pass

        email_address = ""

        for email in data.get("email_addresses"):
            if email["id"] == data.get("primary_email_address_id"):
                email_address = email["email_address"]
        
        # Check if the user email is already registered
        existing_user = db.users.find_one({"email": email_address})
        if existing_user is not None:
            print(f"    {request.remote_addr}: Email is already registered, {email_address}")
            raise exc.BadRequest(f"Email is already registered, {email_address}")
        
        birthday = None
        try:
            birthday = datetime.datetime.strptime(data.get("birthday"), "%d/%m/%Y").date() if data.get("birthday") != "" else ""
        except Exception as e:
            pass

        timestamp_milliseconds = data.get("updated_at")
        timestamp_seconds = timestamp_milliseconds / 1000

        dt_object = datetime.datetime.fromtimestamp(timestamp_seconds)

        # Attempt to create the user in the database
        user_id = db.users.update_one(
            {"_id": ObjectId(g.user_id)},
            {"$set":{
                "firstName": data.get("first_name"),
                "lastName": data.get("family_name"),
                "birthday": birthday,
                "gender": data.get("gender"),
                "phoneNumber": phone_number,
                "email": email_address,
                "profileImage": data.get("profile_image_url"),
                "modifiedAt": dt_object
            }}
        )
        print(f"    {request.remote_addr}: user_id created, {user_id}")

        return jsonify({
            "success": True,
            "message": "Farmer updated successfully",
            "data": {
                "userId": str(user_id),
                "email": email_address,
                "firstName": data.get("first_name"),
                "lastName": data.get("first_name")
            }
        }), 200
    except Exception as e:
        print(e)
        return exc.handle_error(e)

@app.route("/auth/delete", methods=["POST"])
@cross_origin()
@clerk_auth_required
def auth_delete():
    """
        Delete a farmer account
    
        Endpoint: POST /auth/update

        Response (201 Created)
    """
    try:
        db = client.authentication
        
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
    except Exception as e:
        print(e)
        return exc.handle_error(e)

@app.route('/auth/profile', methods=["GET"])
@cross_origin()
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
    except Exception as e:
        print(e)
        return exc.handle_error(e)

""" Farm Endpoints """

@app.route('/my_farms', methods=["GET"])
@cross_origin()
@clerk_auth_required
def get_my_farms():
    try:
        """
            Get list of all of a users farms with optional filtering

            Endpoint: GET /my_farms

            Query Parameters:
                city (optional): Filter by city
                state (optional): Filter by state
                categories (optional): Filter by produce categories
                page (optional): Page number for pagination (default: 1)
                limit (optional): Items per page (default: 20)

            Response (200 OK)
        """
        db = client.farm_details

        data = request.args
        print(f"{request.remote_addr}: Request args received, {data}")

        filter = {"ownerId": ObjectId(g.user_id)}

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
    except Exception as e:
        print(e)
        return exc.handle_error(e)

@app.route('/farms', methods=["POST", "GET"])
@cross_origin()
def farms():
    try:
        if request.method == "POST":
            return create_farm()
        elif request.method == "GET":
            return get_farms()
    except Exception as e:
        print(e)
        return exc.handle_error(e)

@clerk_auth_required
def create_farm():
    # Get the farm_details database
    db = client.farm_details
    
    # Get the data from the request
    data = request.json

    # Check if the json data inludes a data key (the request was malformed)
    if "data" in data.keys():
        print("Request was malformed but we recovered")
        data = data.get("data")
    
    print(f"Request data, {data}")

    # Add the additional fields
    data["ownerId"] = ObjectId(g.user_id)
    data["createdAt"] = datetime.datetime.now()

    # Add the farm
    farmId = db.farms.insert_one(data).inserted_id

    # Replace the ownerId with the clerk ID for the frontend
    data["ownerId"] = g.clerk_id

    # Get the farm data from mongodb
    farm = db.farms.find_one({"_id":farmId})

    # Return the success message
    return jsonify({
        "success": True,
        "message": "Farm registered successfully",
        "data": mongo_to_dict(farm, "farmId")
    }), 201


def get_farms():
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
    db = client.farm_details

    data = request.args
    print(f"{request.remote_addr}: Request args received, {data}")

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

    # Get the produce for each farm and add it in
    for farm_id in range(len(farm_list)):
        produce_list = db.produce.find({"farmId":ObjectId(farm_list[farm_id]["farmId"])})
        produce_list = [mongo_to_dict(produce, "produceId") for produce in produce_list]
        farm_list[farm_id]["produce"] = produce_list

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

@app.route('/farms/<farmId>', methods=["PUT", "DELETE", "GET"])
@cross_origin()
def farm(farmId : str):
    try:
        if request.method == "PUT":
            return update_farm(farmId)
        elif request.method == "DELETE":
            return delete_farm(farmId)
        elif request.method == "GET":
            return get_farm(farmId)
    except Exception as e:
        print(e)
        return exc.handle_error(e)

@clerk_auth_required
def update_farm(farmId : str):
    # Get the farm_details database
    db = client.farm_details

    # Find the farm
    farm = db.farms.find_one({"_id": ObjectId(farmId)})

    # If no farm was found return an error
    if farm is None:
        raise exc.BadRequest(f"Farm not found, {farmId}")

    # Check that the authenticated user owns the farm
    if g.user_id != str(farm["ownerId"]):
        raise exc.Unauthorized(f"User does not own farm, {g.user_id}")
    
    # Get the data from the request
    data = request.json

    # Check if the json data inludes a data key (the request was malformed)
    if "data" in data.keys():
        print("Request was malformed but we recovered")
        data = data.get("data")
    
    print(f"Request data, {data}")
    
    # Create the set data dictionary
    set_data = {}

    modified_keys = data.keys()
    for modified_key in modified_keys:
        set_data[modified_key] = data.get(modified_key)

    set_data["modifiedAt"] = datetime.datetime.now()

    # Update the farm item
    db.farms.update_one(
        {"_id": ObjectId(farmId)},
        {'$set': set_data}
    )

    # Get the farm data from mongodb
    farm = db.farms.find_one({"_id": ObjectId(farmId)})

    # Return the success message
    return jsonify({
        "success": True,
        "message": "Produce updated successfully",
        "data": mongo_to_dict(farm, "farmId")
    }), 201

@clerk_auth_required
def delete_farm(farmId : str):
    """
        Delete a specified farm

        Endpoint: DELETE /farms/:farmId

        Response (200 OK)
    """
    # Get the farm_details database
    db = client.farm_details

    # Find the farm
    farm = db.farms.find_one({"_id": ObjectId(farmId)})

    # If no farm was found return an error
    if farm is None:
        raise exc.BadRequest(f"Farm not found, {farmId}")

    # Check that the authenticated user owns the farm
    if g.user_id != str(farm["ownerId"]):
        raise exc.Unauthorized(f"User does not own farm, {g.user_id}")
    
    # Delete the farm
    db.farms.delete_one({"_id": ObjectId(farmId)})

    # Return the success message
    return jsonify({
        "success": True,
        "message": "Farm deleted successfully"
    }), 200


def get_farm(farmId : str):
    """
        Get detailed information about a specific farm

        Endpoint: GET /farms/:farmId

        Response (200 OK)
    """
    # Get the farm_details database
    db = client.farm_details

    # Find the farm
    farm = db.farms.find_one({"_id": ObjectId(farmId)})

    # If no farm was found return an error
    if farm is None:
        raise exc.BadRequest(f"Farm not found, {farmId}")
    
    farm = mongo_to_dict(farm, "farmId") 

    # Get the produce for the farm and add it in
    produce_list = db.produce.find({"farmId":ObjectId(farm["farmId"])})
    produce_list = [mongo_to_dict(produce, "produceId") for produce in produce_list]
    farm["produce"] = produce_list

    return jsonify({
        "success": True,
        "data": farm # TODO: add exclusion list
    }), 200

@app.route('/farms/<farmId>/produce', methods=["POST", "GET"])
@cross_origin()
def farm_produce(farmId : str):
    try:
        if request.method == "POST":
            return add_farm_produce(farmId)
        elif request.method == "GET":
            return get_farm_produce(farmId)
    except Exception as e:
        print(e)
        return exc.handle_error(e)


def get_farm_produce(farmId : str):
    """
        Get all produce items for a specific farm

        Endpoint: GET /farms/:farmId/produce

        Response (200 OK)
    """
    db = client.farm_details
    
    data = request.args
    print(f"{request.remote_addr}: Request args received, {data}")

    # Create the farm filter
    filter = {"farmId":ObjectId(farmId)}

    # Get the farm details
    farm = db.farms.find_one({"_id":ObjectId(farmId)})
    if farm is None:
        print(f"    {request.remote_addr}: Farm does not exist, {farmId}")
        raise exc.BadRequest(f"Farm does not exist, {farmId}")

    # Set the default page and limit
    page = 1
    limit = 20

    # Create the filter, and fill the page and limit if they have been provided
    for key in list(data.keys()):
        print(key)
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
            "farmName": farm["name"],
            "produce": produce_list,
            "pagination": {
                "currentPage": page,
                "totalPages": page_count,
                "totalItems": produce_count,
                "itemsPerPage": limit
            }
        }
    }), 200

""" Produce Endpoints """

@clerk_auth_required
def add_farm_produce(farmId : str):
    # Get the farm_details database
    db = client.farm_details

    # Find the farm
    farm = db.farms.find_one({"_id": ObjectId(farmId)})

    # If no farm was found return an error
    if farm is None:
        raise exc.BadRequest(f"Farm not found, {farmId}")

    # Check that the authenticated user owns the farm
    if g.user_id != str(farm["ownerId"]):
        raise exc.Unauthorized(f"User does not own farm, {g.user_id}")
    
    # Get the data from the request
    data = request.json

    # Check if the json data inludes a data key (the request was malformed)
    if "data" in data.keys():
        print("Request was malformed but we recovered")
        data = data.get("data")

    # Add the farm id and created timestamp
    data["farmId"] = ObjectId(farmId)
    data["createdAt"] = datetime.datetime.now()
    data["modifiedAt"] = datetime.datetime.now()

    # Add the produce item
    produceId = db.produce.insert_one(data).inserted_id

    # Get the produce document
    produce = db.produce.find_one({"_id":produceId})

    # Return the success message
    return jsonify({
        "success": True,
        "message": "Produce added successfully",
        "data": mongo_to_dict(produce,"produceId")
    }), 201

@app.route("/produce/<produceId>", methods=["PUT", "DELETE", "GET"])
@cross_origin()
def id_produce(produceId : str):
    try:
        if request.method == "PUT":
            return update_produce_id(produceId)
        elif request.method == "DELETE":
            return delete_produce_id(produceId)
        elif request.method == "GET":
            return get_produce_id(produceId)
    except Exception as e:
        print(e)
        return exc.handle_error(e)


def get_produce_id(produceId: str):
    """ 
        Get detailed information about specific produce 

        Endpoint: GET /produce/:produceId

        Response (200 OK)
    """
    db = client.farm_details
    
    data = request.args
    print(f"{request.remote_addr}: Request args received, {data}")

    # Get the produce document associated with this id
    produce = db.produce.find_one({"_id": ObjectId(produceId)})
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
    }), 200

@clerk_auth_required
def update_produce_id(produceId: str):
    """ 
        Update a produce item

        Endpoint: PUT /produce/:produceId

        Response (200 OK)
    """
    # Get the farm_details database
    db = client.farm_details

    # Find the produce document
    produce = db.produce.find_one({"_id": ObjectId(produceId)})

    # If no produce document was found return an error
    if produce is None:
        raise exc.BadRequest(f"Produce not found, {produceId}")

    # Get the associated farm id
    farmId = str(produce["farmId"])

    # Find the associated farm
    farm = db.farms.find_one({"_id": ObjectId(farmId)})

    # If no farm was found return an error
    if farm is None:
        raise exc.BadRequest(f"Associated farm not found, {farmId}")

    # Check that the authenticated user owns the farm
    if g.user_id != str(farm["ownerId"]):
        raise exc.Unauthorized(f"User does not own associated farm, {g.user_id}")
    
    # Get the data from the request
    data = request.json

    # Check if the json data inludes a data key (the request was malformed)
    if "data" in data.keys():
        print("Request was malformed but we recovered")
        data = data.get("data")
    
    # Create the set data dictionary
    set_data = {}

    modified_keys = data.keys()
    for modified_key in modified_keys:
        set_data[modified_key] = data.get(modified_key)

    set_data["modifiedAt"] = datetime.datetime.now()

    # Update the produce item
    db.produce.update_one(
        {"_id": ObjectId(produceId)},
        {'$set': set_data}
    )

    produce = db.produce.find_one({"_id": ObjectId(produceId)})

    # Return the success message
    return jsonify({
        "success": True,
        "message": "Produce updated successfully",
        "data": mongo_to_dict(produce, "produceId")
    }), 201

@clerk_auth_required
def delete_produce_id(produceId: str):
    """ 
        Delete a produce item

        Endpoint: DELETE /produce/:produceId

        Response (200 OK)
    """
    # Get the farm_details database
    db = client.farm_details

    # Find the produce document
    produce = db.produce.find_one({"_id": ObjectId(produceId)})

    # If no produce document was found return an error
    if produce is None:
        raise exc.BadRequest(f"Produce not found, {produceId}")

    # Get the associated farm id
    farmId = str(produce["farmId"])

    # Find the associated farm
    farm = db.farms.find_one({"_id": ObjectId(farmId)})

    # If no farm was found return an error
    if farm is None:
        raise exc.BadRequest(f"Associated farm not found, {farmId}")

    # Check that the authenticated user owns the farm
    if g.user_id != str(farm["ownerId"]):
        raise exc.Unauthorized(f"User does not own associated farm, {g.user_id}")

    # Delete the produce document
    db.produce.delete_one({"_id": ObjectId(produceId)})
    
    return jsonify({
        "success": True,
        "message": "Produce deleted successfully"
    }), 201

@app.route('/categories', methods=["GET"])
@cross_origin()
def categories():
    try:
        """
            Get list of available produce categories

            Endpoint: GET /categories

            Response (200 OK)
        """
        print(f"{request.remote_addr}: Request received")

        db = client.farm_details

        categories = db.produce_categories.find()

        return jsonify({
            "success": True,
            "data": {
                "categories": [category["value"] for category in categories]
            }
        }), 200
    except Exception as e:
        print(e)
        return exc.handle_error(e)

""" Run Flask App """

if __name__ == '__main__':
    app.run(debug=True)