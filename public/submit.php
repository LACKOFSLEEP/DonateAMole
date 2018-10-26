<?php
	$conn = mysqli_connect('localhost', 'webuser', 'l8rzwup9nqtX4jVB', 'test');
	mysqli_set_charset($conn,"utf8");
	
	$name = $_POST['name'];
	$address = $_POST['address'];
	$city = $_POST['city'];
	$state = $_POST['state'];
	$postcode = $_POST['postcode'];
	$country = $_POST['country'];
	$phone = $_POST['phone'];
	$email = $_POST['email'];
	$age = $_POST['age'];
	$newsletter = $_POST['checkout'];
	
	$counter = 0;
	foreach($newsletter as $selected) {
		$counter += (int)$selected;
	}
	if ($counter == 1){
		$newsletter = 'true';
	} else {
		$newsletter = 'false';
	}
	
	$comments = $_POST['comments'];

	
	$date = date("Y/m/d");
	
	$submit = "INSERT INTO comments (name, address, city, state, postcode, country, phone, email, age, newsletter, comments, commentDate) 
	VALUES ('$name', '$address','$city','$state','$postcode','$country','$phone','$email','$age','$newsletter','$comments', '$date')";
	mysqli_query($conn , $submit);
	
	
	
	echo '<script language="javascript">';
	echo 'alert("message successfully sent")';
	echo '</script>';
	echo '<meta http-equiv="refresh" content="0 ; url=./index.html">';

?>