<?php
/**
Heroku CLI: heroku run php init-db.php
 */

require_once 'src/api/config.php';

echo "🗄️  Inizializzazione Database NextStep\n";
echo "========================================\n\n";

try {
    $db = getDB();
    echo "✅ Connessione database OK\n\n";
    
    // Leggi file SQL
    $sqlFile = __DIR__ . '/src/api/db/database.sql';
    
    if (!file_exists($sqlFile)) {
        die("❌ File database.sql non trovato!\n");
    }
    
    $sql = file_get_contents($sqlFile);
    
    // Rimuovi USE database; (Heroku gestisce già il database)
    $sql = preg_replace('/USE\s+\w+;/i', '', $sql);
    
    // Separa le query
    $queries = array_filter(
        array_map('trim', explode(';', $sql)),
        function($query) {
            return !empty($query) && !preg_match('/^(--|#)/', $query);
        }
    );
    
    echo "📊 Esecuzione " . count($queries) . " query...\n\n";
    
    $db->beginTransaction();
    
    foreach ($queries as $i => $query) {
        if (empty(trim($query))) continue;
        
        try {
            $db->exec($query);
            
            // Estrai nome tabella per feedback
            if (preg_match('/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i', $query, $matches)) {
                echo "  ✓ Tabella creata: {$matches[1]}\n";
            }
        } catch (PDOException $e) {
            // Ignora errore "table already exists"
            if (strpos($e->getMessage(), 'already exists') === false) {
                throw $e;
            } else {
                if (preg_match('/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i', $query, $matches)) {
                    echo "  ⊙ Tabella già esistente: {$matches[1]}\n";
                }
            }
        }
    }
    
    $db->commit();
    
    echo "\n";
    echo "========================================\n";
    echo "✅ Database inizializzato con successo!\n";
    echo "========================================\n\n";
    
    // Verifica tabelle create
    echo "📋 Tabelle presenti:\n";
    $tables = $db->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $table) {
        echo "  • {$table}\n";
    }
    
    echo "\n🎉 Setup completato!\n";
    
} catch (PDOException $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    
    echo "\n";
    echo "========================================\n";
    echo "❌ ERRORE:\n";
    echo "========================================\n";
    echo $e->getMessage() . "\n\n";
    
    echo "Dettagli connessione:\n";
    echo "  Host: " . DB_HOST . "\n";
    echo "  Port: " . DB_PORT . "\n";
    echo "  Database: " . DB_NAME . "\n";
    echo "  User: " . DB_USER . "\n";
    
    exit(1);
} catch (Exception $e) {
    echo "\n❌ Errore generico: " . $e->getMessage() . "\n";
    exit(1);
}
?>