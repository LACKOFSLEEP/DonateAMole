<?php
/* Anonymous login
 * INPUT: {email: IMEI, password: a fixed string}
 * OUTPUT: {login: ture/false, uid: uid}
 */

$conn = mysqli_connect('localhost', 'webuser', 'l8rzwup9nqtX4jVB', 'test');
mysqli_set_charset($conn,"utf8");

$json = file_get_contents('php://input');
$obj = json_decode($json, true);

$email = $obj['email']; // this is IMEI of the device
$password = $obj['password']; // fixed stirng but encode anyways

// query see if there is this IMEI
$sql = "SELECT * FROM User WHERE Email = '$email'";
$res = mysqli_query($conn, $sql);
$count = mysqli_num_rows($res);

if($count == 1){
	// exist anonymous user
	$row = mysqli_fetch_array($res);
	$salt = $row['salt'];
	$pwd = hashing($password, $salt);
	if($row['Password'] == $pwd){
		
		// get uid 
		$sql = "SELECT * FROM User WHERE Email = '$email'";
		$res = mysqli_query($conn, $sql);
		$row = mysqli_fetch_array($res);
		$uid = $row['UID'];
		
		// return login = true and the uid of the IMEI
		$data = ['login' => true, 'email' => $email, 'uid' => $uid, 'exist' => true];
		header('Content-type: application/json');
		echo json_encode( $data );
	}else{
		$data = ['login' => false,'error' => 'wrong password'];
		header('Content-type: application/json');
		echo json_encode( $data );
	}
}else{
	// no user so create one, it's equal to sign up but no need for further info
	$date = date("Y/m/d");
	$salt = base64_encode(openssl_random_pseudo_bytes(16));
	$pwd = hashing($password, $salt);
	
	// insertion for new user, anonymous user 
	$sql = "INSERT INTO User (Email, Password, Register_date, salt, Date_of_birth, Gender, Race) 
		VALUES ('$email', '$pwd', '$date', '$salt', null, null, null)";
	if ($conn->query($sql) === TRUE) {
		$sql = "SELECT * FROM User WHERE Email = '$email'";
		$res = mysqli_query($conn, $sql);
		$row = mysqli_fetch_array($res);
		$uid = $row['UID'];
		
		$data = ['signup' => true, 'email' => $email, 'uid' => $uid, 'exist' => false];
		header('Content-type: application/json');
		echo json_encode( $data );
	} else {
		$data = ['signup' => false,'error' => $pwd];
		header('Content-type: application/json');
		echo json_encode( $data );
	}
}

// hash function
function hashing($pwd, $salt){
	$iterations = 1000;
	$hash = hash_pbkdf2("sha256", $pwd, $salt, $iterations, 20);
	return $hash;
}

$conn->close(); 
?>