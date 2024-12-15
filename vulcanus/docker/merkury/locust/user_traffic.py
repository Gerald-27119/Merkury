import time
import logging
import psycopg2
#import json
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



user_queue = Queue()

DB_CONFIG = {
    "host": "postgres-db",
    "database": "dev_postgres_db",
    "user": "user",
    "password": "password",
}
def fetch_users():
    connection = None
    cursor = None
    logger.info("Fetching users.")
    try:
        connection = psycopg2.connect(**DB_CONFIG)
        cursor = connection.cursor()
        cursor.execute("SELECT username, email, 'password' AS password FROM users")
        users = cursor.fetchall()
        for user in users:
            logger.info({"username": user[0], "email": user[1], "password": user[2]})
            user_queue.put({"username": user[0], "email": user[1], "password": user[2]})
        logger.info("Fetched users.")
    except Exception as e:
        logger.error(f"Error fetching users: {e}")
    finally:
        if connection:
            cursor.close()
            connection.close()

fetch_users()

logger.info(user_queue.qsize())

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