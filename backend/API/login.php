<?php
/* LOGIN
 * INPUT: {email: email, password: password}
 * OUTPUT: {login: ture/false, uid: uid}
 */

$conn = mysqli_connect('localhost', 'webuser', 'l8rzwup9nqtX4jVB', 'test');
mysqli_set_charset($conn,"utf8");

$json = file_get_contents('php://input');
$obj = json_decode($json, true);


$email = $obj['email'];
$password = $obj['password'];

// query by email
$sql = "SELECT * FROM User WHERE Email = '$email'";
$res = mysqli_query($conn, $sql);
$count = mysqli_num_rows($res);

if($count == 1){
	// only one email in the table => now check password
	$row = mysqli_fetch_array($res);
	$salt = $row['salt'];
	$pwd = hashing($password, $salt);
	if($row['Password'] == $pwd){
		// get id and return it as auth
		$sql = "SELECT * FROM User WHERE Email = '$email'";
		$res = mysqli_query($conn, $sql);
		$row = mysqli_fetch_array($res);
		$uid = $row['UID'];
		
		$data = ['login' => true, 'email' => $email, 'uid' => $uid];
		header('Content-type: application/json');
		echo json_encode( $data );
	}else{
		$data = ['login' => false,'error' => 'wrong password'];
		header('Content-type: application/json');
		echo json_encode( $data );
	}
}else{
	// query found non => no such user
	$data = ['login' => false,'error' => 'no such user'];
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