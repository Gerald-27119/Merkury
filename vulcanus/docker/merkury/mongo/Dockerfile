FROM mongo:7

## Set environment variables for MongoDB
#ENV MONGO_INITDB_ROOT_USERNAME=user \
#    MONGO_INITDB_ROOT_PASSWORD=password \
#    MONGO_INITDB_DATABASE=dev_mongo_db

# Copy initialization script
COPY mongo-init.js /docker-entrypoint-initdb.d/mongo-init.js
