import logging

logger = logging.getLogger("locust")

def private_endpoint_test(user):
    response = user.client.get("/private/test")
    if response.status_code == 200:
        logger.info(user.user['username'] + ": Private Endpoint Test")
    else:
        logger.error(user.user['username'] + ": Private Endpoint Test Failed: {response.status_code}")