from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

import os

mongodb_user = os.getenv('mongodb_user')
mongodb_pass = os.getenv('mongodb_pass')
mongodb_uri = os.getenv('mongodb_uri')
mongodb_appname = os.getenv('mongodb_appname')

uri = f"mongodb+srv://{mongodb_user}:{mongodb_pass}@{mongodb_uri}/?retryWrites=true&w=majority&appName={mongodb_appname}"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


from flask import Flask, jsonify, request

app = Flask(__name__)

# Sample data
items = [
    {"id": 1, "name": "Item 1"},
    {"id": 2, "name": "Item 2"}
]

@app.route('/items', methods=['GET'])
def get_items():
    return jsonify(items), 200

@app.route('/items', methods=['POST'])
def add_item():
    new_item = request.get_json()
    new_item["id"] = len(items) + 1  # Assign an ID
    items.append(new_item)
    return jsonify(new_item), 201

@app.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    item = next((item for item in items if item["id"] == item_id), None)
    if item:
        return jsonify(item), 200
    return jsonify({"error": "Item not found"}), 404

@app.route('/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    updated_data = request.get_json()
    for item in items:
        if item["id"] == item_id:
            item.update(updated_data)
            return jsonify(item), 200
    return jsonify({"error": "Item not found"}), 404

@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    global items
    item = next((item for item in items if item["id"] == item_id), None)
    if item:
        items = [item for item in items if item["id"] != item_id]
        return jsonify({"message": "Item deleted"}), 200
    else:
        return jsonify({"error": "Item not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)