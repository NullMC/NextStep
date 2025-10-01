<?php
$csvFile = 'data/scuole.csv'; // Modifica il percorso

if (!file_exists($csvFile)) {
    die("File non trovato: $csvFile");
}

$handle = fopen($csvFile, 'r');
$headers = fgetcsv($handle, 0, ',');

echo "Headers trovati:\n";
print_r($headers);

echo "\n\nPrime 3 righe:\n";
for ($i = 0; $i < 3; $i++) {
    $row = fgetcsv($handle, 0, ',');
    if ($row) {
        print_r($row);
    }
}

fclose($handle);