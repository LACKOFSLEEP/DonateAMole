<?php include("inc/sessionStart.php");?>
<?php include("inc/sendemail.php");?>
<?php
/* FORGET PASSWORD
 * SEND　AN EMAIL TO THE USER
 * THERE WILL BE A LINK INSIDE AND USED TO START THE APP
 * INPUT: {email: email}
 * OUTPUT: {doesn't matter}
 */
$conn = mysqli_connect('localhost', 'webuser', 'l8rzwup9nqtX4jVB', 'test');
mysqli_set_charset($conn,"utf8");

$json = file_get_contents('php://input');
$obj = json_decode($json, true);

$email = $obj['email'];

//  query by email to retrieve salt and add it to the link
$checkemail = "SELECT * FROM User WHERE Email = '$email'";
$res = mysqli_query($conn, $checkemail);
$count = mysqli_num_rows($res);
if($count == 0){
	$data = ['email' => false];
	header('Content-type: application/json');
	echo json_encode( $data );
}else{
	$_SESSION['programName'] = "myEmail";     // Change our program name in a single location (used in display and email)
	$row = mysqli_fetch_array($res);
	$salt = $row['salt'];
	
// This will only be populated if we pressed the submit button on our form ealier
  $sendFlag = filter_input(INPUT_POST,'hiddenField',FILTER_SANITIZE_STRING);

// Write the email if we have been called from the form
    $from = "DM@mail.com";
	$to = $email;
    $subject = "DM: RESET PWD";
	$msg = "donateamole://forgetpassword/".$email."/".$salt;

    $ok = sendemail($from,$to,$subject,$msg);

// Check if mail was sent, display result later on form
    if (!$ok) {
		$data = ['email' => false, 'error' => 'fail to send email'];
		header('Content-type: application/json');
		echo json_encode( $data );
      
    } else {
		$data = ['email' => true, 'salt' => $salt];
		header('Content-type: application/json');
		echo json_encode( $data );
      
    }
	
}
$conn->close(); 
?>