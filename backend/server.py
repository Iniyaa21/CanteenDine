from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")  
db = client["canteen_db"]
dishes_col = db["dishes"]
cart_col = db["cart"]

# Fetch Menu Items
@app.route('/menu', methods=['GET'])
def get_menu():
    dishes = list(dishes_col.find({}, {'_id': 0}))  # Exclude MongoDB's default _id
    return jsonify(dishes)

# Add Item to Cart (or Increase Quantity if Exists)
@app.route('/cart', methods=['POST'])
def add_to_cart():
    data = request.json  # Expecting: {"dish_id": 1, "quantity": 2}
    
    existing_item = cart_col.find_one({"dish_id": data["dish_id"]})
    
    if existing_item:
        new_quantity = existing_item["quantity"] + data["quantity"]
        cart_col.update_one(
            {"_id": existing_item["_id"]},
            {"$set": {"quantity": new_quantity}}
        )
    else:
        cart_col.insert_one({
            "dish_id": data["dish_id"],
            "quantity": data["quantity"]
        })

    return jsonify({"message": "Item added to cart!"})

# Fetch Cart Items
@app.route('/cart', methods=['GET'])
def get_cart():
    pipeline = [
        {
            "$lookup": {
                "from": "dishes",
                "localField": "dish_id",
                "foreignField": "id",
                "as": "dish_info"
            }
        },
        {"$unwind": "$dish_info"},
        {
            "$project": {
                "cart_item_id": {"$toString": "$_id"},
                "name": "$dish_info.name",
                "price": "$dish_info.price",
                "image_url": "$dish_info.image_url",
                "quantity": 1,
                "_id": 0
            }
        }
    ]
    cart_items = list(cart_col.aggregate(pipeline))
    return jsonify(cart_items)

# Remove Item from Cart
@app.route('/cart/<string:cart_item_id>', methods=['DELETE'])
def remove_from_cart(cart_item_id):
    cart_col.delete_one({"_id": ObjectId(cart_item_id)})
    return jsonify({"message": "Item removed from cart!"})

# Update Item Quantity
@app.route('/cart/<string:cart_item_id>', methods=['PUT'])
def update_cart_item(cart_item_id):
    data = request.json  # Expecting: {"quantity": new_quantity}
    cart_col.update_one(
        {"_id": ObjectId(cart_item_id)},
        {"$set": {"quantity": data["quantity"]}}
    )
    return jsonify({"message": "Cart item updated!"})

# Checkout Order (User Enters Phone Number)
@app.route('/checkout', methods=['POST'])
def checkout():
    data = request.json  # Expecting: {"phone_number": "1234567890"}
    phone_number = data['phone_number']

    # (Optional) Store order info here before clearing cart
    cart_col.delete_many({})

    return jsonify({"message": "Order placed! You will receive an SMS confirmation.", "phone_number": phone_number})

if __name__ == '__main__':
    app.run(debug=True)
