db = db.getSiblingDB("dev_mongo_db");

// Create application-specific user with readWrite permissions
db.createUser({
  user: "user",
  pwd: "password",
  roles: [{ role: "readWrite", db: "dev_mongo_db" }],
});
