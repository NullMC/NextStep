-- Database NextStep
CREATE DATABASE IF NOT EXISTS nextstep CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nextstep;

-- Tabella utenti
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabella risultati quiz
CREATE TABLE quiz_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    indirizzo_codice VARCHAR(10) NOT NULL,
    indirizzo_desc VARCHAR(255) NOT NULL,
    percorso VARCHAR(50) NOT NULL,
    settore VARCHAR(100) NOT NULL,
    regione VARCHAR(50) NOT NULL,
    provincia VARCHAR(5) NOT NULL,
    comune VARCHAR(100) NOT NULL,
    risposte JSON NOT NULL,
    punteggi JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_created (user_id, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabella sessioni
CREATE TABLE sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (session_token),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabella link condivisione
CREATE TABLE shared_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    result_id INT NOT NULL,
    share_token VARCHAR(32) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    views INT DEFAULT 0,
    FOREIGN KEY (result_id) REFERENCES quiz_results(id) ON DELETE CASCADE,
    INDEX idx_token (share_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;