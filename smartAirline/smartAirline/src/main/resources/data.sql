--- 1. Insert Roles (Corrected table name to 'roles') ---
INSERT INTO roles (id, role)
VALUES (1, 'ADMIN'), (2, 'PILOT'), (3, 'CUSTOMER')
ON CONFLICT (id) DO NOTHING;

--- 2. Insert Admin User (No changes needed here) ---
INSERT INTO users (
    id, name, email, password, active, email_verified, auth_method, phone_number, created_at, updated_at
)
VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-0123456789ab',
    'System Admin',
    'admin@smartairline.com',
    '$2a$10$cb95M8xAp2zg9kJz9xV0keDA8QKLSWSZ2O7iBFwzOtP3WrWsVatZq',
    true,
    true,
    'LOCAL',
    '0000000000',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

--- 3. Link Admin to the Role ---
INSERT INTO users_roles (user_id, role_id)
VALUES ('a1b2c3d4-e5f6-4a5b-8c9d-0123456789ab', 1)
ON CONFLICT DO NOTHING;