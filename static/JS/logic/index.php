<?php


error_reporting(E_ALL);
ini_set('display_errors', 0);
ob_start();

header('Content-Type: application/json; charset=utf-8');



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

    $regione = isset($_POST['regione']) ? $_POST['regione'] : '';
    $provincia = isset($_POST['provincia']) ? $_POST['provincia'] : '';
    $keywordsStr = isset($_POST['keywords']) ? $_POST['keywords'] : '';
    $keywords = array_map('trim', explode(',', $keywordsStr));

    
    $path = __DIR__ . '\\data\\scuole.csv';

    $csvFile = file_exists($path) ? $path : null;

    if (!$csvFile) {
        echo json_encode([
            'success' => false,
            'error' => 'File CSV non trovato',
            'tested_paths' => [$path],
            'schools' => []
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }


    $handle = fopen($csvFile, 'r');

    if ($handle === false) {
        echo json_encode([
            'success' => false,
            'error' => 'Impossibile aprire il file CSV',
            'schools' => []
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }


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


    $headers = array_map(function($h) {
        return trim(str_replace("\xEF\xBB\xBF", '', $h));
    }, $headers);


    function findHeaderIndex($headers, $needle) {
        foreach ($headers as $i => $h) {
            if (mb_strtolower(trim($h), 'UTF-8') === mb_strtolower(trim($needle), 'UTF-8')) {
                return $i;
            }
        }
        return false;
    }
    $regIdx = findHeaderIndex($headers, 'REGIONE');
    $provIdx = findHeaderIndex($headers, 'PROVINCIA');
    $denomIdx = findHeaderIndex($headers, 'DENOMINAZIONE ISTITUTO RIFERIMENTO');
    $indirIdx = findHeaderIndex($headers, 'INDIRIZZO SCUOLA');
    $tipoIdx = findHeaderIndex($headers, 'DESCRIZIONE TIPOLOGIA GRADO ISTRUZIONE SCUOLA');
    $emailIdx = findHeaderIndex($headers, 'INDIRIZZO EMAIL');

    //legge tutte le righe
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
        // Filtra per regione SOLO se specificata
        $schoolRegione = normalizeString($school['regione']);
        $searchRegione = normalizeString($regione);
        if (!empty($searchRegione) && $schoolRegione !== $searchRegione) {
            continue;
        }
        // Filtra per provincia (se specificata)
        if (!empty($provincia)) {
            $schoolProvincia = normalizeString($school['provincia']);
            $searchProvincia = normalizeString($provincia);
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
    if (count($filteredSchools) === 0) {
        echo json_encode([
            'success' => true,
            'count' => 0,
            'total_schools' => count($allSchools),
            'schools' => [],
            'debug' => [
                'regione' => $regione,
                'provincia' => $provincia,
                'keywords' => $keywords,
                'csv_path' => $csvFile,
                'headers_found' => $headers,
                'header_indices' => [
                    'regione' => $regIdx,
                    'provincia' => $provIdx,
                    'denominazione' => $denomIdx,
                    'indirizzo' => $indirIdx,
                    'tipologia' => $tipoIdx,
                    'email' => $emailIdx
                ]
            ],
            'message' => 'Nessuna scuola trovata. Controlla i parametri di ricerca e la struttura del CSV.'
        ], JSON_UNESCAPED_UNICODE);
    } else {
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
                'headers_found' => $headers,
                'header_indices' => [
                    'regione' => $regIdx,
                    'provincia' => $provIdx,
                    'denominazione' => $denomIdx,
                    'indirizzo' => $indirIdx,
                    'tipologia' => $tipoIdx,
                    'email' => $emailIdx
                ]
            ]
        ], JSON_UNESCAPED_UNICODE);
    }

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