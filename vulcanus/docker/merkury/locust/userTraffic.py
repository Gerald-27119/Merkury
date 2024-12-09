import time
from locust import HttpUser, task, between

class MercuryUser(HttpUser):
    username = "user"
    password = "password"
    wait_time = between(5,6)

    @task
    def logout(self):
        self.client.get("/account/logout")
        time.sleep

    # @task(10)
    # def to_map(self):
    #     self.client.get("")

    def on_start(self):
        self.login()

    def login(self):
        headers = {
            "Content-Type": "application/json"
        }
        payload = {
            "username": "user",
            "password": "password"
        }
        response = self.client.post("/account/login", json = payload, headers = headers)
        if response.status_code == 200:
            print("Login successful!")
        else:
            print(f"Login failed with status code: {response.status_code}")
            self.environment.runner.quit()
            return