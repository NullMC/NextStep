<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    $db = getDB();
    
    // REGISTRAZIONE
    if ($method === 'POST' && $action === 'register') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $nome = trim($data['nome'] ?? '');
        $cognome = trim($data['cognome'] ?? '');
        $email = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';
        
        // Validazione
        if (empty($nome) || empty($cognome) || empty($email) || empty($password)) {
            http_response_code(400);
            die(json_encode(['error' => 'Tutti i campi sono obbligatori']));
        }
        
        if (!validateEmail($email)) {
            http_response_code(400);
            die(json_encode(['error' => 'Email non valida']));
        }
        
        if (strlen($password) < 8) {
            http_response_code(400);
            die(json_encode(['error' => 'Password troppo corta (minimo 8 caratteri)']));
        }
        
        // Verifica email esistente
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            http_response_code(409);
            die(json_encode(['error' => 'Email già registrata']));
        }
        
        // Crea utente
        $hashedPassword = hashPassword($password);
        $stmt = $db->prepare("INSERT INTO users (nome, cognome, email, password) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nome, $cognome, $email, $hashedPassword]);
        
        $userId = $db->lastInsertId();
        
        // Crea sessione
        $token = generateToken();
        $expiresAt = date('Y-m-d H:i:s', time() + SESSION_DURATION);
        
        $stmt = $db->prepare("INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$userId, $token, $expiresAt]);
        
        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $userId,
                'nome' => $nome,
                'cognome' => $cognome,
                'email' => $email
            ]
        ]);
    }
    
    // LOGIN
    elseif ($method === 'POST' && $action === 'login') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $email = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';
        
        if (empty($email) || empty($password)) {
            http_response_code(400);
            die(json_encode(['error' => 'Email e password obbligatorie']));
        }
        
        // Trova utente
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user || !verifyPassword($password, $user['password'])) {
            http_response_code(401);
            die(json_encode(['error' => 'Credenziali non valide']));
        }
        
        // Aggiorna ultimo login
        $stmt = $db->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
        $stmt->execute([$user['id']]);
        
        // Crea sessione
        $token = generateToken();
        $expiresAt = date('Y-m-d H:i:s', time() + SESSION_DURATION);
        
        $stmt = $db->prepare("INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$user['id'], $token, $expiresAt]);
        
        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'nome' => $user['nome'],
                'cognome' => $user['cognome'],
                'email' => $user['email']
            ]
        ]);
    }
    
    // LOGOUT
    elseif ($method === 'POST' && $action === 'logout') {
        $user = requireAuth();
        
        $headers = getallheaders();
        $token = str_replace('Bearer ', '', $headers['Authorization'] ?? '');
        
        $stmt = $db->prepare("DELETE FROM sessions WHERE session_token = ?");
        $stmt->execute([$token]);
        
        echo json_encode(['success' => true]);
    }
    
    // VERIFICA SESSIONE
    elseif ($method === 'GET' && $action === 'verify') {
        $user = requireAuth();
        
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'nome' => $user['nome'],
                'cognome' => $user['cognome'],
                'email' => $user['email']
            ]
        ]);
    }
    
    else {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint non trovato']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Errore server: ' . $e->getMessage()]);
}
?>