CREATE TABLE IF NOT EXISTS user_entity
(
    id                      SERIAL PRIMARY KEY,
    email                   VARCHAR(255) UNIQUE NOT NULL,
    username                VARCHAR(255) UNIQUE NOT NULL,
    password                VARCHAR(255)        NOT NULL,
    role                    VARCHAR(50)         NOT NULL,
    account_non_expired     BOOLEAN DEFAULT TRUE,
    account_non_locked      BOOLEAN DEFAULT TRUE,
    credentials_non_expired BOOLEAN DEFAULT TRUE,
    enabled                 BOOLEAN DEFAULT TRUE
);

-- Insert initial data
INSERT INTO user_entity (email, username, password, role, account_non_expired, account_non_locked,
                         credentials_non_expired, enabled)
VALUES ('admin@example.com', 'admin', 'password_encoded_string', 'ADMIN', TRUE, TRUE, TRUE, TRUE),
       ('user@example.com', 'user', 'password_encoded_string', 'USER', TRUE, TRUE, TRUE, TRUE);
