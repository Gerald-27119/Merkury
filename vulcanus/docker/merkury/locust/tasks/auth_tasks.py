import logging

logger = logging.getLogger("locust")

def sign_out_test(user):
    if not hasattr(user.environment, 'logouts'):
        user.environment.logouts = 0
    response = user.client.get("/account/oauth2/logout")

    if response.status_code == 200:
        user.environment.logouts += 1
        logger.info(f"Successful logouts: {user.environment.logouts}.")
    else:
        logger.error(f"Logout failed with status code: {response.status_code}.")

    return

