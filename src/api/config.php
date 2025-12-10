<?php
// Configurazione database
define('DB_HOST', 'localhost');
define('DB_NAME', 'nextstep');
define('DB_USER', 'root'); // Cambia in produzione
define('DB_PASS', 'NextStep2024'); // Cambia in produzione

// Configurazione applicazione
define('SESSION_DURATION', 30 * 24 * 60 * 60); // 30 giorni in secondi
define('BASE_URL', 'http://localhost/nextstep'); // Cambia in produzione

// Connessione database
function getDB() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        return $pdo;
    } catch(PDOException $e) {
        http_response_code(500);
        die(json_encode(['error' => 'Database connection failed']));
    }
}

// Headers CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Funzioni utility
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function generateToken($length = 32) {
    return bin2hex(random_bytes($length));
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

function getUserFromToken($token) {
    $db = getDB();
    $stmt = $db->prepare("
        SELECT u.* FROM users u
        JOIN sessions s ON u.id = s.user_id
        WHERE s.session_token = ? AND s.expires_at > NOW()
    ");
    $stmt->execute([$token]);
    return $stmt->fetch();
}

function requireAuth() {
    $headers = getallheaders();
    $token = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;
    
    if ($token) {
        $token = str_replace('Bearer ', '', $token);
        $user = getUserFromToken($token);
        if ($user) {
            return $user;
        }
    }
    
    http_response_code(401);
    die(json_encode(['error' => 'Non autenticato']));
}
?>