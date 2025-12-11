<?php
// Configurazione per Heroku con Stackhero MySQL

// Parse DATABASE_URL o STACKHERO_MYSQL_URL
$dbUrl = getenv('STACKHERO_MYSQL_URL') ?: getenv('DATABASE_URL');

if ($dbUrl) {
    // Parse URL: mysql://user:pass@host:port/dbname
    $parsedUrl = parse_url($dbUrl);
    
    define('DB_HOST', $parsedUrl['host'] ?? 'localhost');
    define('DB_PORT', $parsedUrl['port'] ?? 3306);
    define('DB_NAME', ltrim($parsedUrl['path'] ?? '', '/'));
    define('DB_USER', $parsedUrl['user'] ?? 'root');
    define('DB_PASS', $parsedUrl['pass'] ?? '');
} else {
    // Fallback per sviluppo locale
    define('DB_HOST', getenv('DB_HOST') ?: 'db');
    define('DB_PORT', 3306);
    define('DB_NAME', getenv('DB_NAME') ?: 'nextstep');
    define('DB_USER', getenv('DB_USER') ?: 'root');
    define('DB_PASS', getenv('DB_PASS') ?: 'NextStep2024');
}

// Configurazione applicazione
define('SESSION_DURATION', 30 * 24 * 60 * 60);

// Base URL dinamico per Heroku
$appName = getenv('HEROKU_APP_NAME');
if ($appName) {
    define('BASE_URL', "https://{$appName}.herokuapp.com");
} else {
    define('BASE_URL', getenv('BASE_URL') ?: 'http://localhost:8080');
}

// Connessione database con SSL per Stackhero
function getDB() {
    try {
        $dsn = sprintf(
            "mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4",
            DB_HOST,
            DB_PORT,
            DB_NAME
        );
        
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ];
        
        // SSL per Stackhero MySQL (richiesto in produzione)
        if (getenv('STACKHERO_MYSQL_URL')) {
            $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = false;
            // Stackhero gestisce SSL automaticamente
        }
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        
        return $pdo;
    } catch(PDOException $e) {
        error_log("DB Connection Error: " . $e->getMessage());
        http_response_code(500);
        die(json_encode([
            'error' => 'Database connection failed',
            'details' => getenv('APP_DEBUG') ? $e->getMessage() : 'Contact administrator'
        ]));
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