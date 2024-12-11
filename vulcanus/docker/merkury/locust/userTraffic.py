import time
import logging
import json
from queue import Queue, Empty
from locust import HttpUser, task, between

logger = logging.getLogger("locust")
logger.setLevel(logging.INFO)
console_handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(message)s')
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

with open("users.json", "r") as file:
    users = json.load(file)

user_queue = Queue()

for user in users:
    user_queue.put(user)

# locust generuje tyle userów ile sie mu da
class MercuryUser(HttpUser):

    wait_time = between(2,10)

    # Userzy wykonują taski
    @task
    def logout(self):
        if not hasattr(self.environment, 'logouts'):
            self.environment.logouts = 0
        self.client.get("/account/logout")
        self.environment.logouts += 1
        logger.info(f"Successful logouts: {self.environment.logouts}.")
        time.sleep(5)
        self.login()

    @task(5)
    def public_endpoint_test(self):
        response = self.client.get("/public/test")
        logger.info(self.user["username"] + ": Public Endpoint Test")
    @task(5)
    def private_endpoint_test(self):
        response = self.client.get("/private/test")
        logger.info(self.user["username"] + ": Private Endpoint Test")

    def on_start(self):
        try:
            self.user = user_queue.get_nowait()
            self.login()
        except Empty:
            logger.info("Ran out of users in queue. Registering new users.")
            # inicjalizuje jak nie istnieje
            try:
                if not hasattr(self.environment, 'registrations'):
                    self.environment.registrations = 0
                self.user = {
                    "email": f"registeruser{self.environment.registrations}@example.com",
                    "username": f"registeruser{self.environment.registrations}",
                    "password": f"P@55wordd"
                }
                logger.info(self.user)
                self.register()
            except Empty:
                logger.info("Stopping user generation....")
                self.environment.runner.greenlet.kill()
                self.stop()

    def login(self):
        if not hasattr(self.environment, 'logins'):
            self.environment.logins = 0
        headers = {
            "Content-Type": "application/json"
        }
        login_payload = {
            "username": self.user["username"],
            "password": self.user["password"]
        }
        response = self.client.post("/account/login", json = login_payload, headers = headers)
        if response.status_code == 200:
            self.environment.logins += 1
            logger.info(f"Successful logins: {self.environment.logins}.")
        else:
            logger.error(f"Login failed with status code: {response.status_code}.")
            self.environment.runner.quit()
            return

    def register(self):
        headers = {
            "Content-Type": "application/json"
        }
        register_payload = {
            "email": self.user["email"],
            "username": self.user["username"],
            "password": self.user["password"]
        }
        logger.info(register_payload)
        response = self.client.post("/account/register", json = register_payload, headers = headers)
        logger.info(response)
        if response.status_code == 201:
            self.environment.registrations += 1
            logger.info(f"Successful registrations: {self.environment.registrations}.")
        else:
            logger.error(f"Registration failed with status code: {response.status_code}.")
        return
