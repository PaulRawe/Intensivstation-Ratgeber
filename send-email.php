<?php
// send-email.php - Kontaktformular Handler

// CORS Headers (wenn nötig)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Nur POST erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Nur POST erlaubt']);
    exit;
}

// Eingaben validieren und säubern
$name = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim(strip_tags($_POST['email'])) : '';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// Validierung
$errors = [];

if (empty($name)) {
    $errors[] = 'Name ist erforderlich';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Gültige E-Mail ist erforderlich';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Nachricht muss mindestens 10 Zeichen lang sein';
}

// Spam-Schutz: Honeypot-Feld (optional)
if (!empty($_POST['website'])) {
    // Honeypot wurde gefüllt = Bot
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Spam erkannt']);
    exit;
}

// Bei Fehlern
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// E-Mail zusammenstellen
$to = 'kontakt@intensivstation-ratgeber.de'; // DEINE E-MAIL HIER
$subject = 'Neue Kontaktanfrage von ' . $name;

$emailBody = "Neue Nachricht vom Intensivstation Ratgeber\n\n";
$emailBody .= "Name: $name\n";
$emailBody .= "E-Mail: $email\n\n";
$emailBody .= "Nachricht:\n$message\n\n";
$emailBody .= "---\n";
$emailBody .= "Gesendet am: " . date('d.m.Y H:i:s') . "\n";
$emailBody .= "IP-Adresse: " . $_SERVER['REMOTE_ADDR'] . "\n";

$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// E-Mail senden
if (mail($to, $subject, $emailBody, $headers)) {
    // Optional: Log in Datei
    $logEntry = date('Y-m-d H:i:s') . " - Nachricht von $email\n";
    file_put_contents('contact-log.txt', $logEntry, FILE_APPEND);
    
    echo json_encode(['success' => true, 'message' => 'Nachricht erfolgreich gesendet']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Fehler beim Senden der E-Mail']);
}
?>