<?php
include 'db_config.php';

$code = $_POST['code'] ?? '';

if (!empty($code)) {
    $stmt = $conn->prepare("INSERT INTO code_snippets (code) VALUES (?)");
    $stmt->bind_param("s", $code);
    $stmt->execute();
    echo "Code saved successfully.";
} else {
    echo "No code received.";
}
?>
