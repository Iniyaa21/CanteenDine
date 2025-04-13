from flask import Flask, request, jsonify
from flask_cors import CORS
from bson import ObjectId
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["canteen-dine"]

# Collections
dishes_col = db["dishes"]
users_col = db["users"]
orders_col = db["orders"]
transactions_col = db["transactions"]

# -------------------- DISHES ENDPOINTS --------------------

@app.route('/menu', methods=['GET'])
def get_menu():
    dishes = list(dishes_col.find({}, {'_id': 1, 'name': 1, 'price': 1}))
    print("Fetched dishes:", dishes)  # Add this line to see the dishes in the console
    for dish in dishes:
        dish['_id'] = str(dish['_id'])
    return jsonify(dishes)


# -------------------- ADMIN DISH MANAGEMENT --------------------

@app.route('/admin/dishes', methods=['POST'])
def add_dish():
    data = request.json
    name = data.get('name')
    price = data.get('price')

    if not name or not price:
        return jsonify({"error": "Dish name and price are required"}), 400

    dish = {
        "name": name,
        "price": price,
        "createdAt": datetime.now()
    }
    result = dishes_col.insert_one(dish)
    return jsonify({"message": "Dish added successfully!", "dishId": str(result.inserted_id)})

@app.route('/admin/dishes/<dish_id>', methods=['PUT'])
def edit_dish(dish_id):
    data = request.json
    update_data = {}

    if "name" in data:
        update_data["name"] = data["name"]
    if "price" in data:
        update_data["price"] = data["price"]

    if not update_data:
        return jsonify({"error": "No fields to update"}), 400

    result = dishes_col.update_one({"_id": ObjectId(dish_id)}, {"$set": update_data})

    if result.matched_count == 0:
        return jsonify({"error": "Dish not found"}), 404

    return jsonify({"message": "Dish updated successfully"})

@app.route('/admin/dishes/<dish_id>', methods=['DELETE'])
def delete_dish(dish_id):
    result = dishes_col.delete_one({"_id": ObjectId(dish_id)})

    if result.deleted_count == 0:
        return jsonify({"error": "Dish not found"}), 404

    return jsonify({"message": "Dish deleted successfully"})

# -------------------- ORDER FLOW --------------------

@app.route('/checkout', methods=['POST'])
def place_order():
    data = request.json
    user_id = data.get('user_id')
    dish_orders = data.get('dishes')

    if not dish_orders:
        return jsonify({"error": "No dishes provided"}), 400

    total_amount = 0
    order_dishes = []

    for item in dish_orders:
        dish = dishes_col.find_one({"_id": ObjectId(item["dish_id"])})
        if not dish:
            return jsonify({"error": f'Dish not found: {item["dish_id"]}'}), 404

        quantity = item["quantity"]
        amount = quantity * dish["price"]
        total_amount += amount

        order_dishes.append({
            "dishId": str(dish["_id"]),
            "name": dish["name"],
            "quantity": quantity,
            "priceAtOrder": dish["price"]
        })

    transaction = {
        "userId": user_id,
        "amount": total_amount,
        "paymentMethod": data.get("paymentMethod", "cash"),
        "status": "completed",
        "paymentDate": datetime.now(),
        "phone": data.get("phone")
    }
    transaction_id = transactions_col.insert_one(transaction).inserted_id

    order = {
        "transactionId": str(transaction_id),
        "userId": user_id,
        "dishes": order_dishes,
        "totalAmount": total_amount,
        "status": "pending",
        "createdAt": datetime.now()
    }
    orders_col.insert_one(order)

    return jsonify({
        "message": "Order placed successfully!",
        "transactionId": str(transaction_id),
        "totalAmount": total_amount
    })

# -------------------- USER REGISTRATION --------------------

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    existing_user = users_col.find_one({"email": data['email']})
    if existing_user:
        return jsonify({"error": "Email already exists"}), 400

    user = {
        "username": data["username"],
        "phone": data["phone"],
        "email": data["email"],
        "passwordHash": data["passwordHash"],  # Hashing can be added
        "createdAt": datetime.now()
    }
    users_col.insert_one(user)
    return jsonify({"message": "User registered successfully!"})

# -------------------- GET ORDERS FOR A USER --------------------

@app.route('/orders/<user_id>', methods=['GET'])
def get_orders(user_id):
    orders = list(orders_col.find({"userId": user_id}))
    for o in orders:
        o["_id"] = str(o["_id"])
        o["transactionId"] = str(o["transactionId"])
    return jsonify(orders)

# -------------------- ROOT ENDPOINT --------------------

@app.route('/')
def index():
    return jsonify({"message": "Canteen Dine backend is live!"})

# -------------------- RUN FLASK APP --------------------

if __name__ == '__main__':
    app.run(debug=True)