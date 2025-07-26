from flask import jsonify

class BadRequest(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__()

class Unauthorized(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__()

class Forbidden(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__()

def handle_error(e):
    if isinstance(e, BadRequest):
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "400",
                    "message": "BAD_REQUEST",
                    "details": e.message
                }
            }
        ), 400
    elif isinstance(e, Unauthorized):
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "401",
                    "message": "UNAUTHORIZED",
                    "details": e.message
                }
            }
        ), 401
    elif isinstance(e, Forbidden):
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "403",
                    "message": "FORBIDDEN",
                    "details": e.message
                }
            }
        ), 403
    else:
        return jsonify(
            {
                "success": False,
                "error": {
                    "code": "500",
                    "message": "INTERNAL_ERROR",
                    "details": "The server encountered an unexpected condition that prevented it from fulfilling the request."
                }
            }
        ), 500