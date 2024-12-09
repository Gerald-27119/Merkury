import time
import json
from queue import Queue, Empty
from locust import HttpUser, task, between

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
        self.client.get("/account/logout")
        print(f"Successful logouts: {self.logouts}.")
        time.sleep(5)
        self.login()

    # @task(10)
    # def to_map(self):
    #     self.client.get("")


    def on_start(self):
        self.logins = 0
        self.logouts = 0
        try:
            self.user = user_queue.get_nowait()
            self.login()
        except Empty:
            print("Ran out of users in queue.")
            self.environment.runner.quit()


    def login(self):
        headers = {
            "Content-Type": "application/json"
        }
        payload = {
            "username": self.user["username"],
            "password": self.user["password"]
        }
        response = self.client.post("/account/login", json = payload, headers = headers)
        if response.status_code == 200:
            self.logins += 1
            print(f"Successful logins: {self.logins}.")
        else:
            print(f"Login failed with status code: {response.status_code}.")
            self.environment.runner.quit()
            return