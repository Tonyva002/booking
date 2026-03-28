CREATE TABLE
        IF NOT EXISTS provider_working_days (
                id INT NOT NULL AUTO_INCREMENT,
                provider_id INT NOT NULL,
                day_of_week INT NOT NULL, -- 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
                PRIMARY KEY (id),
                UNIQUE KEY uq_provider_day (provider_id, day_of_week),
                CONSTRAINT fk_working_provider FOREIGN KEY (provider_id) REFERENCES providers (id) ON DELETE CASCADE
        ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;