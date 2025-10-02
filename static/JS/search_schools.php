<?php
// Abilita gli errori per debug (rimuovi in produzione)
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');

// Funzione per normalizzare le stringhe
function normalizeString($str) {
    if (!$str) return '';
    
    $str = mb_strtolower($str, 'UTF-8');
    $str = str_replace(
        ['à', 'á', 'ä', 'â', 'è', 'é', 'ë', 'ê', 'ì', 'í', 'ï', 'î', 'ò', 'ó', 'ö', 'ô', 'ù', 'ú', 'ü', 'û', 'ç', 'ñ'],
        ['a', 'a', 'a', 'a', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'c', 'n'],
        $str
    );
    $str = preg_replace('/\s+/', ' ', $str);
    return trim($str);
}

try {
    // Ottieni i parametri POST
    $regione = isset($_POST['regione']) ? $_POST['regione'] : '';
    $provincia = isset($_POST['provincia']) ? $_POST['provincia'] : '';
    $keywordsStr = isset($_POST['keywords']) ? $_POST['keywords'] : '';
    $keywords = array_map('trim', explode(',', $keywordsStr));

    // Percorsi possibili per il CSV
    $possiblePaths = [
        __DIR__ . '/data/scuole.csv',
        __DIR__ . '/../data/scuole.csv',
        __DIR__ . '/../../data/scuole.csv',
        'data/scuole.csv',
        '../data/scuole.csv'
    ];

    $csvFile = null;
    foreach ($possiblePaths as $path) {
        if (file_exists($path)) {
            $csvFile = $path;
            break;
        }
    }

    // Verifica che il file esista
    if (!$csvFile) {
        echo json_encode([
            'success' => false,
            'error' => 'File CSV non trovato',
            'tested_paths' => $possiblePaths,
            'schools' => []
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Leggi il file CSV con punto e virgola come separatore
    $handle = fopen($csvFile, 'r');

    if ($handle === false) {
        echo json_encode([
            'success' => false,
            'error' => 'Impossibile aprire il file CSV',
            'schools' => []
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Leggi l'intestazione - IMPORTANTE: usa ; come separatore
    $headers = fgetcsv($handle, 0, ';');
    
    if ($headers === false) {
        echo json_encode([
            'success' => false,
            'error' => 'Intestazione CSV non valida',
            'schools' => []
        ], JSON_UNESCAPED_UNICODE);
        fclose($handle);
        exit;
    }

    // Pulisci gli headers da eventuali spazi e BOM
    $headers = array_map(function($h) {
        return trim(str_replace("\xEF\xBB\xBF", '', $h));
    }, $headers);

    // Trova gli indici delle colonne basandoti sui nomi reali
    $regIdx = array_search('REGIONE', $headers);
    $provIdx = array_search('PROVINCIA', $headers);
    $denomIdx = array_search('DENOMINAZIONE ISTITUTO RIFERIMENTO', $headers);
    $indirIdx = array_search('INDIRIZZO SCUOLA', $headers);
    $tipoIdx = array_search('DESCRIZIONE TIPOLOGIA GRADO ISTRUZIONE SCUOLA', $headers);
    $emailIdx = array_search('INDIRIZZO EMAIL', $headers);
    $sitoIdx = false; // Non sembra esserci nel CSV

    // Leggi tutte le righe
    $allSchools = [];
    $lineCount = 0;
    
    while (($data = fgetcsv($handle, 0, ';')) !== false) {
        $lineCount++;
        
        if (count($data) < count($headers)) {
            continue;
        }
        
        $school = [
            'regione' => $regIdx !== false ? trim($data[$regIdx]) : '',
            'provincia' => $provIdx !== false ? trim($data[$provIdx]) : '',
            'denominazione' => $denomIdx !== false ? trim($data[$denomIdx]) : '',
            'indirizzo' => $indirIdx !== false ? trim($data[$indirIdx]) : '',
            'tipologia' => $tipoIdx !== false ? trim($data[$tipoIdx]) : '',
            'email' => $emailIdx !== false ? trim($data[$emailIdx]) : 'Non Disponibile',
            'sito' => 'Non Disponibile'
        ];
        
        // Aggiungi solo se ha almeno denominazione e regione
        if (!empty($school['denominazione']) && !empty($school['regione'])) {
            $allSchools[] = $school;
        }
    }

    fclose($handle);

    // Filtra le scuole
    $filteredSchools = [];

    foreach ($allSchools as $school) {
        // Filtra per regione
        $schoolRegione = normalizeString($school['regione']);
        $searchRegione = normalizeString($regione);
        
        if ($schoolRegione !== $searchRegione) {
            continue;
        }
        
        // Filtra per provincia (se specificata)
        if (!empty($provincia)) {
            $schoolProvincia = normalizeString($school['provincia']);
            $searchProvincia = normalizeString($provincia);
            
            // Confronto parziale per gestire variazioni (es. "Chieti" vs "CH")
            if (strpos($schoolProvincia, $searchProvincia) === false && 
                strpos($searchProvincia, $schoolProvincia) === false) {
                continue;
            }
        }
        
        // Filtra per tipologia (keywords)
        if (!empty($keywords[0])) {
            $matchFound = false;
            $schoolTipologia = normalizeString($school['tipologia']);
            
            foreach ($keywords as $keyword) {
                $normalizedKeyword = normalizeString($keyword);
                if (strpos($schoolTipologia, $normalizedKeyword) !== false) {
                    $matchFound = true;
                    break;
                }
            }
            
            if (!$matchFound) {
                continue;
            }
        }
        
        $filteredSchools[] = $school;
    }

    // Limita a 5 risultati
    $filteredSchools = array_slice($filteredSchools, 0, 5);

    // Restituisci i risultati
    echo json_encode([
        'success' => true,
        'count' => count($filteredSchools),
        'total_schools' => count($allSchools),
        'schools' => $filteredSchools,
        'debug' => [
            'regione' => $regione,
            'provincia' => $provincia,
            'keywords' => $keywords,
            'csv_path' => $csvFile,
            'headers_found' => $headers
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Errore PHP: ' . $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'schools' => []
    ], JSON_UNESCAPED_UNICODE);
}
?>