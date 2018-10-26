<?php
/* RESET Password
 * INPUT: {email: email, salt: salt, password: password}
 * OUTPUT: {update: true/false}
 */
$conn = mysqli_connect('localhost', 'webuser', 'l8rzwup9nqtX4jVB', 'test');
mysqli_set_charset($conn,"utf8");

$json = file_get_contents('php://input');
$obj = json_decode($json, true);

// get the salt and email to query
$email = $obj['email'];
$salt = $obj['salt'];
$password = $obj['password'];
// new salt and new hashed pwd
$new_salt = base64_encode(openssl_random_pseudo_bytes(16));
$pwd = hashing($password, $new_salt);

// update the new salt and new pwd into db by the email and old salt
// so the link is disabled since the salt is no longer the same
$sql = "UPDATE User SET Password = '$pwd', salt = '$new_salt' WHERE Email = '$email' AND salt = '$salt'";
if ($conn->query($sql) === TRUE) {
	
	$data = ['update' => true];
	header('Content-type: application/json');
	echo json_encode( $data );
} else {
	$data = ['update' => false];
	header('Content-type: application/json');
	echo json_encode( $data );
}

// hash function
function hashing($pwd, $salt){
	$iterations = 1000;
	$hash = hash_pbkdf2("sha256", $pwd, $salt, $iterations, 20);
	return $hash;
}
	
$conn->close(); 
?>