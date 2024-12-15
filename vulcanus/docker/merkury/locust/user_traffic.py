import time
import logging
import json
from queue import Queue, Empty
from locust import HttpUser, task, between
from tasks.public_tasks import public_endpoint_test, sign_in_test, register_test
from tasks.private_tasks import private_endpoint_test
from tasks.auth_tasks import sign_out_test

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

# locust generates as many users as needed
class MercuryUser(HttpUser):

    wait_time = between(2,10)

    # users do tasks
    @task
    def sign_out(self):
        sign_out_test(self)
        time.sleep(5)
        sign_in_test(self)


    @task(5)
    def public_test(self):
        public_endpoint_test(self)

    @task(5)
    def private_test(self):
        private_endpoint_test(self)

    def on_start(self):
        try:
            self.user = user_queue.get_nowait()
            sign_in_test(self)
        except Empty:
            logger.info("Ran out of users in queue. Registering new users.")
            # initialises if variable does not exist
            try:
                if not hasattr(self.environment, 'registrations'):
                    self.environment.registrations = 0
                self.user = {
                    "email": f"registeruser{self.environment.registrations}@example.com",
                    "username": f"registeruser{self.environment.registrations}",
                    "password": f"P@55wordd"
                }
                register_test(self)
            except Empty:
                logger.info("Stopping user generation....")
                self.environment.runner.greenlet.kill()
                self.stop()