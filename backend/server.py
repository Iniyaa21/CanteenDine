from flask import Flask, request, jsonify
from flask_cors import CORS
from bson import ObjectId
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["canteen_dine"]

# Collections
dishes_col = db["dishes"]
users_col = db["users"]
orders_col = db["orders"]
transactions_col = db["transactions"]

# -------------------- GET MENU --------------------
@app.route('/menu', methods=['GET'])
def get_menu():
    dishes = list(dishes_col.find({}, {'_id': 0}))  # exclude MongoDB _id, show all other fields
    return jsonify(dishes) 

# -------------------- PLACE ORDER --------------------
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
        dish = dishes_col.find_one({"id": item["dish_id"]})  # using custom dish id

        if not dish:
            return jsonify({"error": f'Dish not found: {item["dish_id"]}'}), 404

        quantity = item["quantity"]
        amount = quantity * dish["price"]
        total_amount += amount

        # Track what's being ordered
        order_dishes.append({
            "dishId": dish["id"],
            "name": dish["name"],
            "quantity": quantity,
            "priceAtOrder": dish["price"]
        })

        # Increment the 'orders' count for this dish
        dishes_col.update_one({"id": item["dish_id"]}, {"$inc": {"orders": quantity}})

    # Record transaction
    transaction = {
        "userId": user_id,
        "amount": total_amount,
        "paymentMethod": data.get("paymentMethod", "cash"),
        "status": "completed",
        "paymentDate": datetime.now(),
        "phone": data.get("phone")
    }
    transaction_id = transactions_col.insert_one(transaction).inserted_id

    # Record order
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

# -------------------- REGISTER USER --------------------
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get("username")
    phone = data.get("phone")

    if not username or not phone:
        return jsonify({"error": "Username and phone are required"}), 400

    existing_user = users_col.find_one({"phone": phone})
    if existing_user:
        return jsonify({"error": "Phone number already registered"}), 400

    user = {
        "username": username,
        "phone": phone
    }
    users_col.insert_one(user)
    return jsonify({"message": "User registered successfully!"})

# -------------------- GET USER ORDERS --------------------
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

# -------------------- RUN APP --------------------
if __name__ == '__main__':
    app.run(debug=True)
