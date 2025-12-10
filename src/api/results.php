<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    $db = getDB();
    
    // SALVA RISULTATO
    if ($method === 'POST' && $action === 'save') {
        $user = requireAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $db->prepare("
            INSERT INTO quiz_results 
            (user_id, indirizzo_codice, indirizzo_desc, percorso, settore, regione, provincia, comune, risposte, punteggi)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $user['id'],
            $data['indirizzoCodice'],
            $data['indirizzoDesc'],
            $data['percorso'],
            $data['settore'],
            $data['regione'],
            $data['provincia'],
            $data['comune'],
            json_encode($data['risposte']),
            json_encode($data['punteggi'])
        ]);
        
        echo json_encode([
            'success' => true,
            'result_id' => $db->lastInsertId()
        ]);
    }
    
    // OTTIENI TUTTI I RISULTATI UTENTE
    elseif ($method === 'GET' && $action === 'list') {
        $user = requireAuth();
        
        $stmt = $db->prepare("
            SELECT id, indirizzo_codice, indirizzo_desc, percorso, settore, 
                   regione, provincia, comune, created_at
            FROM quiz_results
            WHERE user_id = ?
            ORDER BY created_at DESC
        ");
        $stmt->execute([$user['id']]);
        
        echo json_encode([
            'success' => true,
            'results' => $stmt->fetchAll()
        ]);
    }
    
    // OTTIENI SINGOLO RISULTATO
    elseif ($method === 'GET' && $action === 'get') {
        $user = requireAuth();
        $id = $_GET['id'] ?? 0;
        
        $stmt = $db->prepare("
            SELECT * FROM quiz_results
            WHERE id = ? AND user_id = ?
        ");
        $stmt->execute([$id, $user['id']]);
        $result = $stmt->fetch();
        
        if (!$result) {
            http_response_code(404);
            die(json_encode(['error' => 'Risultato non trovato']));
        }
        
        $result['risposte'] = json_decode($result['risposte'], true);
        $result['punteggi'] = json_decode($result['punteggi'], true);
        
        echo json_encode([
            'success' => true,
            'result' => $result
        ]);
    }
    
    // STATISTICHE UTENTE
    elseif ($method === 'GET' && $action === 'stats') {
        $user = requireAuth();
        
        $stmt = $db->prepare("
            SELECT indirizzo_desc, percorso, COUNT(*) as count
            FROM quiz_results
            WHERE user_id = ?
            GROUP BY indirizzo_desc, percorso
            ORDER BY count DESC
        ");
        $stmt->execute([$user['id']]);
        
        $results = $stmt->fetchAll();
        $total = array_sum(array_column($results, 'count'));
        
        $stats = array_map(function($r) use ($total) {
            return [
                'indirizzo' => $r['indirizzo_desc'],
                'percorso' => $r['percorso'],
                'count' => $r['count'],
                'percentage' => round(($r['count'] / $total) * 100, 1)
            ];
        }, $results);
        
        echo json_encode([
            'success' => true,
            'total' => $total,
            'stats' => $stats
        ]);
    }
    
    // CONDIVIDI RISULTATO
    elseif ($method === 'POST' && $action === 'share') {
        $user = requireAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        $resultId = $data['result_id'] ?? 0;
        
        // Verifica proprietà
        $stmt = $db->prepare("SELECT id FROM quiz_results WHERE id = ? AND user_id = ?");
        $stmt->execute([$resultId, $user['id']]);
        if (!$stmt->fetch()) {
            http_response_code(403);
            die(json_encode(['error' => 'Non autorizzato']));
        }
        
        // Crea o recupera token condivisione
        $stmt = $db->prepare("SELECT share_token FROM shared_results WHERE result_id = ?");
        $stmt->execute([$resultId]);
        $existing = $stmt->fetch();
        
        if ($existing) {
            $token = $existing['share_token'];
        } else {
            $token = generateToken(16);
            $stmt = $db->prepare("INSERT INTO shared_results (result_id, share_token) VALUES (?, ?)");
            $stmt->execute([$resultId, $token]);
        }
        
        echo json_encode([
            'success' => true,
            'share_url' => BASE_URL . '/condividi.html?token=' . $token
        ]);
    }
    
    // VISUALIZZA RISULTATO CONDIVISO
    elseif ($method === 'GET' && $action === 'shared') {
        $token = $_GET['token'] ?? '';
        
        $stmt = $db->prepare("
            SELECT qr.*, u.nome, u.cognome
            FROM quiz_results qr
            JOIN shared_results sr ON qr.id = sr.result_id
            JOIN users u ON qr.user_id = u.id
            WHERE sr.share_token = ?
        ");
        $stmt->execute([$token]);
        $result = $stmt->fetch();
        
        if (!$result) {
            http_response_code(404);
            die(json_encode(['error' => 'Risultato non trovato']));
        }
        
        // Incrementa visualizzazioni
        $stmt = $db->prepare("UPDATE shared_results SET views = views + 1 WHERE share_token = ?");
        $stmt->execute([$token]);
        
        $result['risposte'] = json_decode($result['risposte'], true);
        $result['punteggi'] = json_decode($result['punteggi'], true);
        
        echo json_encode([
            'success' => true,
            'result' => $result
        ]);
    }
    
    // ELIMINA RISULTATO
    elseif ($method === 'DELETE' && $action === 'delete') {
        $user = requireAuth();
        $id = $_GET['id'] ?? 0;
        
        $stmt = $db->prepare("DELETE FROM quiz_results WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $user['id']]);
        
        echo json_encode(['success' => true]);
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