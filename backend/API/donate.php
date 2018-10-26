<?php
/* DONATE
 * INPUT: {entry: entry, uid: uid, location: location, size: size, description: description}
 * OUTPUT: {upload: true/false}
 */
$conn = mysqli_connect('localhost', 'webuser', 'l8rzwup9nqtX4jVB', 'test');
mysqli_set_charset($conn,"utf8");

$entry = $_POST['entry'];
$uid = $_POST['uid'];
$location = $_POST['location'];
$size = $_POST['size'];
$description = $_POST['description'];
$date = date("Y/m/d");

// get the file and alter the file name so there will be no duplicate file
$target_dir = "../../uploads/";
$temp = explode(".", $_FILES["img"]["name"]);
$newfilename = round(microtime(true)) . '.' . end($temp);
$target_file = $target_dir . $newfilename;

// upload file
if(move_uploaded_file($_FILES["img"]["tmp_name"], $target_file)) {
	
	$sql = "INSERT INTO Donation (UID, D_Name, URL, Donation_date, Location, Size, Description)
	VALUES ('$uid', '$entry','$target_file', '$date', '$location', '$size', '$description')";
	if ($conn->query($sql) === TRUE) {
		// upload successfully
		$data = ['upload' => true];
		header('Content-type: application/json');
		echo json_encode( $data );
	}else{
		// insert query went wrong
		$data = ['upload' => false, 'query' => false , 'uid' => $uid, 'entry' => $entry, 'url' => $target_file];
		header('Content-type: application/json');
		echo json_encode( $data );
	}
}else {
	// can't move file
	$data = ['upload' => false];
	header('Content-type: application/json');
	echo json_encode( $data );
}

$conn->close(); 

?>