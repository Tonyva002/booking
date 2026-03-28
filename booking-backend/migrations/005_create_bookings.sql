CREATE TABLE
        IF NOT EXISTS bookings (
                id INT NOT NULL AUTO_INCREMENT,
                client_id INT NOT NULL,
                provider_id INT NOT NULL,
                booking_date DATE NOT NULL,
                status ENUM ('Pending', 'Confirmed', 'Canceled') DEFAULT 'Pending',
                version INT DEFAULT 1,
                created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY uq_client_booking_day (client_id, provider_id, booking_date),
                KEY idx_provider_date (provider_id, booking_date),
                CONSTRAINT fk_booking_client FOREIGN KEY (client_id) REFERENCES clients (id),
                CONSTRAINT fk_booking_provider FOREIGN KEY (provider_id) REFERENCES providers (id)
        ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;