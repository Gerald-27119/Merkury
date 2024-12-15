FROM locustio/locust
#RUN pip3 install randomuser
COPY user_traffic.py /mnt/locust/user_traffic.py
COPY tasks/public_tasks.py /mnt/locust/tasks/public_tasks.py
COPY tasks/private_tasks.py /mnt/locust/tasks/private_tasks.py
COPY tasks/auth_tasks.py /mnt/locust/tasks/auth_tasks.py
COPY users.json /mnt/locust/users.json
WORKDIR /mnt/locust