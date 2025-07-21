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