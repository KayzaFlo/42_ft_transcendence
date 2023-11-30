from utils.functions import add_double_jwt, decrypt_user_id
from django.http import HttpRequest, HttpResponse

EXPIRED: int = -1


def check_cookie(request):
    refresh_jwt_cookie = request.COOKIES.get("refresh_jwt")
    if refresh_jwt_cookie is None:
        return HttpResponse("Couldn't locate cookie jwt", status=401)
    decrypt_cookie_id: int = decrypt_user_id(refresh_jwt_cookie)
    if decrypt_cookie_id > 0:
        response: HttpResponse = HttpResponse("Access Token Refresh", status=200)
        return add_double_jwt(response, decrypt_cookie_id)
    else:
        return HttpResponse("Cookie Expired jwt", status=401)

def token_validation(func):
    '''Decorator for jwt token verification, will execute the function if the
        tokens are valid. Will send a 401 status if both tokens are expired,
        not present or tempered with'''
    def wrapper(self, request: HttpRequest):
        jwt_access_token = request.headers.get("jwt-access")
        if jwt_access_token is None:
            # return HttpResponse("No access token", status=401)
            return check_cookie(request)

        decrypt_result = decrypt_user_id(jwt_access_token)
        if decrypt_result > 0:
            print("VALID TOKEN")
            return func(self, request)
        elif decrypt_result == EXPIRED:
            print("EXPIRED TOKEN")
            return check_cookie(request)
        return HttpResponse(
            "https://i.ytimg.com/vi/KEkrWRHCDQU/maxresdefault.jpg", status=401)
    return wrapper