<?php

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');
error_reporting(E_ALL);


set_error_handler(function($errno, $errstr, $errfile, $errline) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});


header('Content-Type: application/json; charset=utf-8');

try {
    // Parametri POST
    $regione   = isset($_POST['regione']) ? trim($_POST['regione']) : '';
    $provincia = isset($_POST['provincia']) ? trim($_POST['provincia']) : '';
    $keywords  = isset($_POST['keywords']) ? explode(',', $_POST['keywords']) : [];

    if ($regione === '' || $provincia === '' || empty($keywords)) {
        echo json_encode([
            'success' => false,
            'error'   => 'Parametri mancanti (regione, provincia o keywords)',
            'schools' => []
        ]);
        exit;
    }


    $file = __DIR__ . '/data/scuole.csv';
    if (!file_exists($file)) {
        echo json_encode([
            'success' => false,
            'error'   => "File CSV non trovato: $file",
            'schools' => []
        ]);
        exit;
    }

    $handle = fopen($file, 'r');
    if (!$handle) {
        echo json_encode([
            'success' => false,
            'error'   => "Impossibile aprire il file CSV",
            'schools' => []
        ]);
        exit;
    }

    $schools = [];
    $headers = fgetcsv($handle, 1000, ';');

    while (($row = fgetcsv($handle, 1000, ';')) !== false) {
        $school = array_combine($headers, $row);

        if (!$school) continue;

        $rowRegione   = strtolower($school['regione'] ?? '');
        $rowProvincia = strtolower($school['provincia'] ?? '');
        $rowTipo      = strtolower($school['tipologia'] ?? '');

        $matchRegione   = strpos($rowRegione, strtolower($regione)) !== false;
        $matchProvincia = strpos($rowProvincia, strtolower($provincia)) !== false;

        $matchKeyword = false;
        foreach ($keywords as $kw) {
            if (strpos($rowTipo, strtolower(trim($kw))) !== false) {
                $matchKeyword = true;
                break;
            }
        }

        if ($matchRegione && $matchProvincia && $matchKeyword) {
            $schools[] = [
                'denominazione' => $school['denominazione'] ?? 'Non disponibile',
                'indirizzo'     => $school['indirizzo'] ?? 'Non disponibile',
                'provincia'     => $school['provincia'] ?? 'N/D',
                'tipologia'     => $school['tipologia'] ?? 'Non specificata',
                'email'         => $school['email'] ?? 'Non disponibile',
                'sito'          => $school['sito'] ?? 'Non disponibile'
            ];
        }
    }

    fclose($handle);

    echo json_encode([
        'success' => true,
        'count'   => count($schools),
        'schools' => $schools
    ]);

} catch (Throwable $e) {
    
    echo json_encode([
        'success' => false,
        'error'   => "PHP Exception: " . $e->getMessage(),
        'schools' => []
    ]);
}
