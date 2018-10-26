<?php
/* 
 * UPDATE AN ALBUM
 * INPUT: {name: name}
 * OUTPUT: [update true or false]
 */
$conn = mysqli_connect('localhost', 'webuser', 'l8rzwup9nqtX4jVB', 'test');
mysqli_set_charset($conn,"utf8");

$json = file_get_contents('php://input');
$obj = json_decode($json, true);

$uid = $obj['uid'];
$newName = $obj['newName'];
$oldName = $obj['oldName'];

// delete by id
$sql = "UPDATE Donation SET D_name = '$newName' WHERE D_name = '$oldName' AND UID = '$uid'";

$checkName = "SELECT DISTINCT D_name FROM Donation WHERE UID = '$uid'";
$res = mysqli_query($conn, $checkName);

$counter = 0;

while($row = mysqli_fetch_array($res)){
	if ($row['D_name'] == $newName){
		$counter++;
	}
}

if ($counter > 0) {
	$data = ['update' => false];
	header('Content-type: application/json');
	echo json_encode($data);
} else {
	if ($conn->query($sql) === TRUE) {
	$data = ['update' => true];
	header('Content-type: application/json');
	echo json_encode($data);
	} else {
		$data = ['update' => false];
		header('Content-type: application/json');
		echo json_encode($data);
	}
}



?>