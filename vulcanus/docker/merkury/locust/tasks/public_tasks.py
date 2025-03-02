import logging

logger = logging.getLogger("locust")

def public_endpoint_test(user):
    response = user.client.get("/public/test")
    if response.status_code == 200:
        logger.info(user.user['username'] + ": Public Endpoint Test")
    else:
        logger.error(user.user['username'] + ": Public Endpoint Test Failed: {response.status_code}")

def sign_in_test(user):
    if not hasattr(user.environment, 'logins'):
        user.environment.logins = 0
    headers = {
        "Content-Type": "application/json"
    }
    login_payload = {
        "username": user.user["username"],
        "password": user.user["password"]
    }
    response = user.client.post("/account/login", json = login_payload, headers = headers)
    if response.status_code == 200:
        user.environment.logins += 1
        logger.info(f"Successful logins: {user.environment.logins}.")
    else:
        logger.error(f"Login failed with status code: {response.status_code}.")
        user.stop()
    return

def register_test(user):
    headers = {
        "Content-Type": "application/json"
    }
    register_payload = {
        "email": user.user["email"],
        "username": user.user["username"],
        "password": user.user["password"]
    }
    response = user.client.post("/account/register", json = register_payload, headers = headers)
    if response.status_code == 201:
        user.environment.registrations += 1
        logger.info(f"Registered user: {user.environment.registrations}.")
    elif response.status_code == 409:
        logger.info(f"User 'registeruser{user.environment.registrations}' already exists! Skipping registration...")
        user.environment.registrations += 1
    else:
        logger.error(f"Registration failed with status code: {response.status_code}.")
    return