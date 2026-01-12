<?php
// send-email.php – Kontaktformular (Freenet direkt)

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($message) < 10) {
    header('Location: index.html#kontakt');
    exit;
}

// Honeypot (falls Feld existiert)
if (!empty($_POST['website'])) {
    exit;
}

// Zieladresse (deine Freenet-Mail)
$to = 'rawe.p@freenet.de';
$subject = 'Neue Kontaktanfrage – Intensivstation Ratgeber';

// Mailinhalt
$body  = "Neue Kontaktanfrage über die Website\n\n";
$body .= "Name: $name\n";
$body .= "E-Mail: $email\n\n";
$body .= "Nachricht:\n$message\n\n";
$body .= "Gesendet am: " . date('d.m.Y H:i:s') . "\n";
$body .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";

// Absender = DEINE Freenet-Adresse
$headers  = "From: Paul Rawe <rawe.p@freenet.de>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Senden
mail($to, $subject, $body, $headers);

// Erfolg
header('Location: index.html?kontakt=ok#kontakt');
exit;
