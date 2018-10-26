<?php
/* DELETE
 * DELETE AN ALBUM
 * INPUT: {name: name}
 * OUTPUT: [delete true or false]
 */
$conn = mysqli_connect('localhost', 'webuser', 'l8rzwup9nqtX4jVB', 'test');
mysqli_set_charset($conn,"utf8");

$json = file_get_contents('php://input');
$obj = json_decode($json, true);
$uid = $obj['uid'];
$name = $obj['name'];

// delete by name
$sql = "DELETE FROM Donation WHERE D_Name = '$name' AND UID = '$uid'";

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