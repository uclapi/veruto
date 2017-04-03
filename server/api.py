from os.path import join, dirname
from dotenv import load_dotenv
from helpers import fetch_free_rooms

from flask import Flask, request, jsonify

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


if __name__ == "__main__":
    app.run()
