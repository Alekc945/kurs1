<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "cfif31.ru";
$username = "ISPr24-36_StratulatA";    
$password = "ISPr24-36_StratulatA";        
$dbname = "`ISPr24-36_StratulatA_bazaKyrs`.`orders`";  

try {
    
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    
    $name = $_POST['name'];
    $email = $_POST['email'];

    if (empty($name) || empty($email)) {
        throw new Exception("All fields are required.");
    }

    
    $stmt = $conn->prepare("INSERT INTO orders (name, email) VALUES (:name, :email)");
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    echo "Order successfully submitted!";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}


$conn = null;
?>
