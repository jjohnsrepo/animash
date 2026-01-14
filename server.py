from flask import Flask, render_template, send_file, jsonify, request
import os, random
import json


app = Flask(__name__)

print(os.getcwd())

with open("scores_database.json") as f:
    database = json.load(f)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/random-animal", methods=["POST"])
def random_face():
    data = request.get_json()   
    relative_path = data.get("path")  # get the path from JSON
    if not relative_path:
        return "No path provided", 400
    base_dir = "photos"
    path = os.path.join(base_dir, relative_path)

    if not os.path.exists(path):
        return "File not found", 400

    print("Received path:", path)  # for debugging
    return send_file(path)



@app.route("/get-database")
def data():
    return jsonify(database)

@app.route("/update-database", methods=["POST"])
def update_database():
    global database

    data = request.get_json()

    # Save to file
    with open("scores_database.json", "w") as f:
        json.dump(data, f, indent=4)

    # Update in-memory database
    database = data

    return "OK", 200



@app.route("/cutest")
def cutest():
    with open("scores_database.json") as f:

        database = json.load(f)

    if not database:  
        return jsonify({"Highest": None})

    highest_entry = max(database, key=lambda x: x["score"])
    print("hihgest entry is",highest_entry)
    
    return jsonify({
    "Path": highest_entry["local_path"],
    "Score": highest_entry["score"]
    })




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
