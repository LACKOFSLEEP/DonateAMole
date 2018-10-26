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
$name = $obj['name'];

$sql = "SELECT * FROM Donation WHERE UID = '$uid' AND D_Name = '$name'";
$url_res = mysqli_query($conn, $sql);

$value = [];
$urls = [];
$ids = [];

array_push($value, $name);

while($row = mysqli_fetch_array($url_res)){
	$url = $row['URL'];
	// Read image path, convert to base64 encoding
	$imageData = base64_encode(file_get_contents($url));
	// Format the image SRC:  data:{mime};base64,{data};
	$src = 'data: '.mime_content_type($url).';base64,'.$imageData;
	$DID = $row['DID'];
	array_push($urls, $src);
	array_push($ids, $DID);
}

array_push($value, $urls);
array_push($value, $ids);

header('Content-type: application/json');
echo json_encode( $value );
$conn->close(); 

?>