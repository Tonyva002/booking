CREATE TABLE
        IF NOT EXISTS booking_audit_log (
                id INT NOT NULL AUTO_INCREMENT,
                booking_id INT NOT NULL,
                action ENUM ('Created', 'Confirmed', 'Canceled', 'Rescheduled') NOT NULL,
                old_value JSON DEFAULT NULL,
                new_value JSON DEFAULT NULL,
                actor VARCHAR(50) DEFAULT 'system',
                created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                KEY fk_audit_booking (booking_id),
                CONSTRAINT fk_audit_booking FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE
        ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;