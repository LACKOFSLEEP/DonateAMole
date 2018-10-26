<?php
/* HISTORY 
 * SENDING ALL THE IMAGES UPLOADED BY THE USER
 * INPUT: {uid: uid}
 * OUTPUT: [[[NAME1][URL1,URL2,...]],[[NAME2][URL1,URL2,...]],...]
 */
$conn = mysqli_connect('localhost', 'webuser', 'l8rzwup9nqtX4jVB', 'test');
mysqli_set_charset($conn,"utf8");

$json = file_get_contents('php://input');
$obj = json_decode($json, true);
$DID = $obj['id'];

// delete by id
$sql = "DELETE FROM Donation WHERE DID = '$DID'";

if ($conn->query($sql) === TRUE) {
	$data = ['delete' => true];
	header('Content-type: application/json');
	echo json_encode($data);
} else {
	$data = ['delete' => false];
	header('Content-type: application/json');
	echo json_encode($data);
}

?>