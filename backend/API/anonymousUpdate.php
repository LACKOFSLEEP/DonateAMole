<?php

/* SIGNUP
 * INPUT: {email: email, password: password}
 * OUPPUT: {signup: true/false}
 */
$conn = mysqli_connect('localhost', 'webuser', 'l8rzwup9nqtX4jVB', 'test');
mysqli_set_charset($conn,"utf8");

$json = file_get_contents('php://input');
$obj = json_decode($json, true);

$uid = $obj['uid'];
$dob = $obj['dob'];
$gender = $obj['gender'];
$race = $obj['race'];

// query by email
$check_unique = "SELECT * FROM User WHERE UID = '$uid'";
$res = mysqli_query($conn, $check_unique);
$count = mysqli_num_rows($res);

if($count == 1){
	
	$sql = "UPDATE User SET Date_of_birth = '$dob',Gender = '$gender', Race = '$race' WHERE UID = '$uid'";
	if ($conn->query($sql) === TRUE) {
			$data = ['update' => true];
			header('Content-type: application/json');
			echo json_encode( $data );
		} else {
			$data = ['update' => false,'error' => $pwd, 'dob' => $dob, 'g' => $gender, 'r' => $race];
			header('Content-type: application/json');
			echo json_encode( $data );
		}
}else{
	// something went worng, the IMEI is duplicated or no such IMEI
	$data = ['update' => false,'error' => 'no IMEI or duplicate', 'count' => $count];
	header('Content-type: application/json');
	echo json_encode( $data );
}
	
$conn->close(); 
?>