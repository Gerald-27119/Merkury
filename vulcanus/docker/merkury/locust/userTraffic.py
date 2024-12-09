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

# Główna klasa którą locust generuje tyle razy ile mu sie wskaże
class MercuryUser(HttpUser):

    wait_time = between(3,9)

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

    # @task(10)
    # def to_map(self):
    #     self.client.get("")


    def on_start(self):
        try:
            self.user = user_queue.get_nowait()
            self.login()
        except Empty:
            logger.info("Ran out of users in queue.")
            self.environment.runner.greenlet.kill()
            self.stop()


    def login(self):
        # inicjalizuje jak nie istnieje
        if not hasattr(self.environment, 'logins'):
            self.environment.logins = 0
        headers = {
            "Content-Type": "application/json"
        }
        payload = {
            "username": self.user["username"],
            "password": self.user["password"]
        }
        response = self.client.post("/account/login", json = payload, headers = headers)
        if response.status_code == 200:
            self.environment.logins += 1
            logger.info(f"Successful logins: {self.environment.logins}.")
        else:
            logger.error(f"Login failed with status code: {response.status_code}.")
            self.environment.runner.quit()
            return