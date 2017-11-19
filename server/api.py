from os.path import join, dirname
from dotenv import load_dotenv
from flask import Flask, request, jsonify
import graphene
from flask_graphql import GraphQLView
from verutographql.schema import Query
import json

from helpers import fetch_free_rooms

app = Flask(__name__)

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)


@app.route("/api/rooms.free", methods=['GET'])
def free_rooms():
    # based on minutes in the future for now
    # but start and end time coming soon

    if request.args.get("minutes"):
        free_rooms = fetch_free_rooms(minutes=int(request.args.get("minutes")))
    else:
        free_rooms = fetch_free_rooms()

    return jsonify({
        "ok": True,
        "rooms": free_rooms
    })


schema = graphene.Schema(query=Query)
# app.add_url_rule(
#     '/api/graphql',
#     view_func=GraphQLView.as_view('graphql', schema=schema)
# )


@app.route("/api/graphql/", methods=['POST'])
def graphql():
    # import pdb; pdb.set_trace()
    result = schema.execute(
        json.loads(request.get_data().decode('utf-8'))["query"]
    )
    print("data: ", result.data)
    print("errors: ", result.errors)
    print("invalid: ", result.invalid)
    if result.invalid:
        return jsonify({
            "errors": [error.message for error in result.errors]
        })
    else:
        return jsonify({
            "data": result.data
        })


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
