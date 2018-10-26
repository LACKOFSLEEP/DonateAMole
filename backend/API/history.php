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
$uid = $obj['uid'];

// get the distinct name
$sql = "SELECT DISTINCT D_Name FROM Donation WHERE UID = $uid";
$res = mysqli_query($conn, $sql);

$data = [];

// for each distinct name
while($row = mysqli_fetch_array($res)){
	$names = [];
	$urls = [];
	$ids = [];
	$D_Name = $row['D_Name'];
	array_push($names, $D_Name);
	
	$get_url = "SELECT * FROM Donation WHERE UID = '$uid' AND D_Name = '$D_Name'";
	$url_res = mysqli_query($conn, $get_url);
	
	// for each row in the specific email and image name
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
	array_push($names, $urls);
	array_push($names, $ids);
	array_push($data, $names);
}


//$data = ['names' => $names, 'uid' => $uid];
header('Content-type: application/json');
echo json_encode( $data );
$conn->close(); 

?>