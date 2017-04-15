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


# Start type hinting
def rooms_identical(room1, room2):
    """
    takes 2 rooms
    checks if they are the same and returns bool
    """
    return (
        room1["roomid"] == room2["roomid"] and
        room1["siteid"] == room2["siteid"]
    )


def get_all_rooms():
    url = "https://uclapi.com/roombookings/rooms"
    params = {
        "token": os.environ["UCLAPI_TOKEN"]
    }
    r = requests.get(url, params=params)
    all_rooms = r.json()["rooms"]

    return all_rooms


def get_bookings_by_date(date):
    url = "https://uclapi.com/roombookings/bookings"

    params = {
        "token": os.environ["UCLAPI_TOKEN"],
        "date": date
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

    return bookings


def get_room_by_ids(rooms, siteid, roomid):
    for room in rooms:
        if (
            room["roomid"] == roomid and
            room["siteid"] == siteid
        ):
            return room


def get_bookings_for_room(bookings, siteid, roomid):
    # use map here instead
    bookings_for_room = []
    for booking in bookings:
        if (
            booking["roomid"] == roomid and
            booking["siteid"] == siteid
        ):
            bookings_for_room.append(booking)
    return bookings_for_room


def filter_for_free_rooms(all_rooms, bookings, f_start, f_end):
    rooms_with_bookings = list(all_rooms)
    for idx, room in enumerate(all_rooms):
        bookings_for_room = get_bookings_for_room(
            bookings,
            room["siteid"],
            room["roomid"]
        )
        rooms_with_bookings[idx]["bookings"] = bookings_for_room

    free_rooms = []
    for room in rooms_with_bookings:
        for booking in room["bookings"]:

            start = ciso8601.parse_datetime(booking["start_time"])
            end = ciso8601.parse_datetime(booking["end_time"])

            if overlaps(
                start1=start,
                end1=end,
                start2=f_start,
                end2=f_end
            ):
                break
        else:
            free_rooms.append(room)

    return free_rooms


def fetch_free_rooms(minutes=0):
    now = datetime.datetime.now(pytz.timezone("Europe/London"))

    all_rooms = get_all_rooms()

    future_minutes = datetime.timedelta(
        minutes=minutes
    )
    time_period_end = now + future_minutes

    today = "{year}{month}{day}".format(
        year=now.year,
        month=str(now.month).zfill(2),
        day=str(now.day).zfill(2)
    )

    bookings = get_bookings_by_date(today)

    free_rooms = filter_for_free_rooms(
        all_rooms,
        bookings,
        now,
        time_period_end
    )

    return free_rooms
