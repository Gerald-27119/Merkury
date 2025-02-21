FROM locustio/locust

RUN pip3 install psycopg2-binary

WORKDIR /mnt/locust

COPY user_traffic.py .

COPY tasks/public_tasks.py ./tasks/

COPY tasks/private_tasks.py ./tasks/

COPY tasks/auth_tasks.py ./tasks/
