FROM locustio/locust

RUN pip3 install psycopg2-binary

WORKDIR /mnt/locust

COPY user_traffic.py ./

WORKDIR /mnt/locust/tasks

COPY tasks/public_tasks.py ./

COPY tasks/private_tasks.py ./

COPY tasks/auth_tasks.py ./
