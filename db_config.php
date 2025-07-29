<?php
$host = "localhost";
$user = "root";         // default XAMPP user
$password = "";         // default XAMPP password
$dbname = "compiler_db";

// Create connection
$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
