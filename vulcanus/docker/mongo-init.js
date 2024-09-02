db = db.getSiblingDB("dev_mongo_database");

db.createCollection("user_entity");

db.user_entity.insertMany([
  {
    email: "admin@example.com",
    username: "admin",
    password: "password_encoded_string",
    role: "ADMIN",
    accountNonExpired: true,
    accountNonLocked: true,
    credentialsNonExpired: true,
    enabled: true,
  },
  {
    email: "user@example.com",
    username: "user",
    password: "password_encoded_string",
    role: "USER",
    accountNonExpired: true,
    accountNonLocked: true,
    credentialsNonExpired: true,
    enabled: true,
  },
]);
