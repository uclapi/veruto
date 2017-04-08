import datetime
import pytz
import ciso8601
import os
import requests


def overlaps(start1, end1, start2, end2):
    """
    takes 4 datetimes
    checks if they overlap
    """
    return max(start1, start2) < min(end1, end2)


def rooms_identical(room1, room2):
    """
    takes 2
    checks if they are the same
    """
    return (
        room1["roomid"] == room2["roomid"] and
        room1["siteid"] == room2["siteid"]
    )


def fetch_free_rooms(minutes=0):
    now = datetime.datetime.now(pytz.timezone("Europe/London"))

    future_minutes = datetime.timedelta(
        minutes=minutes
    )
    time_period_end = now + future_minutes

    today = "{year}{month}{day}".format(
        year=now.year,
        month=str(now.month).zfill(2),
        day=str(now.day).zfill(2)
    )

    url = "https://uclapi.com/roombookings/rooms"
    params = {
        "token": os.environ["UCLAPI_TOKEN"]
    }
    r = requests.get(url, params=params)
    all_rooms = r.json()["rooms"]

    url = "https://uclapi.com/roombookings/bookings"

    params = {
        "token": os.environ["UCLAPI_TOKEN"],
        "date": today
    }
    req = requests.get(url, params=params)

    resp = req.json()

    bookings = resp["bookings"]

    next_page = resp["next_page_exists"]
    while next_page:
        page_token = resp["page_token"]
        params = {
            "token": os.environ["UCLAPI_TOKEN"],
            "page_token": page_token
        }
        pagination_req = requests.get(
            "https://uclapi.com/roombookings/bookings",
            params=params
        )
        pagination_resp = pagination_req.json()
        bookings += pagination_resp["bookings"]
        if pagination_resp["next_page_exists"]:
            next_page = True
        else:
            next_page = False

    occupied_rooms = []
    for booking in bookings:

        start = ciso8601.parse_datetime(booking["start_time"])
        end = ciso8601.parse_datetime(booking["end_time"])

        siteid = booking["siteid"]
        roomid = booking["roomid"]

        if overlaps(
            start1=start,
            end1=end,
            start2=now,
            end2=time_period_end
        ):
            for room in all_rooms:
                if (
                    room["roomid"] == roomid and
                    room["siteid"] == siteid
                ):
                    occupied_rooms.append(room)

    free_rooms = []
    for room in all_rooms:
        for occupied_room in occupied_rooms:
            if rooms_identical(room, occupied_room):
                break
        else:
            free_rooms.append(room)

    return free_rooms
