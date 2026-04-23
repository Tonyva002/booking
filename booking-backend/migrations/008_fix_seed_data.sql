-- FIX SEED DATA

-- CLIENTS
INSERT INTO clients (id, name, email)
VALUES
(1, 'Ana Solano', 'anasolano@hotmail.com'),
(2, 'Juan Lopez', 'juanlopez@hotmail.com'),
(3, 'Tony Vasquez', 'tonyvva@hotmail.com')
ON DUPLICATE KEY UPDATE
name = VALUES(name),
email = VALUES(email);

-- PROVIDERS
INSERT INTO providers (id, name, max_bookings_per_day)
VALUES
(1, 'Dra. Carmen Fernandez', 10),
(2, 'Dr. Edwardo Gonzales', 10)
ON DUPLICATE KEY UPDATE
name = VALUES(name),
max_bookings_per_day = VALUES(max_bookings_per_day);

-- WORKING DAYS
INSERT IGNORE INTO provider_working_days (provider_id, day_of_week)
VALUES
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),
(2,1),(2,2),(2,3),(2,4),(2,5),(2,6);