<?php
$file = 'data/scuole.csv';
$handle = fopen($file, 'r');
$headers = fgetcsv($handle, 0, ';');
echo "<pre>";
print_r($headers);
echo "\n\nPrime 3 scuole:\n";
for ($i = 0; $i < 3; $i++) {
    $row = fgetcsv($handle, 0, ';');
    print_r($row);
}
fclose($handle);
?>