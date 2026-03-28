CREATE TABLE
        IF NOT EXISTS provider_blocked_dates (
                id INT NOT NULL AUTO_INCREMENT,
                provider_id INT NOT NULL,
                blocked_date DATE NOT NULL,
                reason VARCHAR(255) DEFAULT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY uq_provider_blocked_date (provider_id, blocked_date),
                CONSTRAINT fk_blocked_provider FOREIGN KEY (provider_id) REFERENCES providers (id) ON DELETE CASCADE
        ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;