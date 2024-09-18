db = db.getSiblingDB("dev_mongo_db");

db.createUser({
  user: "user",
  pwd: "password",
  roles: [{ role: "dbOwner", db: "dev_mongo_db" }],
});
// MongoDB requires explicit user and role setup for access control. By default, if access control is enabled, you must create users and assign appropriate
// roles that determine what actions those users can perform. Roles in MongoDB are fine-grained, meaning you must specify exactly what each user can do,
// such as readWrite, dbAdmin, or dbOwner. Without the correct roles, operations like dropping a database will not be permitted.
// In PostgreSQL, when you start a new instance, a superuser (often called postgres) is created automatically if access control is enabled.
// This user has full administrative privileges, similar to the dbOwner or dbAdmin role in MongoDB.
