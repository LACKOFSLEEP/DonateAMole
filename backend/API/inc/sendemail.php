<?php
function sendemail($from,$to,$subject,$msg) {
// This function will send an email message from the email account hardcoded in here

  $_SESSION['mailerror'] = '';      // Initialise possible error message

// Source: https://github.com/PHPMailer/PHPMailer
// Documentation: http://www.askapache.com/php/phpfreaks-eric-rosebrocks-phpmailer-tutorial.html
//                http://stackoverflow.com/questions/2386544/error-handling-with-phpmailer

  include_once('inc/mailcredentials.php');
  include_once('inc/class.phpmailer.php');

  $mail = new PHPMailer(true); //defaults to using php "mail()"; the true param means it will throw exceptions on errors, which we need to catch

  try {
    $mail->CharSet = 'UTF-8';                        // Otherwise French accent characters are not displayed properly etc.
    $mail->SMTPDebug = 0;                            // debugging: 1 = errors and messages, 2 = messages only, 0 = off
    $mail->IsSMTP();                                 // Set mailer to use SMTP

// You can test this at home from your Gmail account (port 587 tls) but from your zone you have to use 'mailhub.eait.uq.edu.au' 25 tls
    $mail->Host = 'mailhub.eait.uq.edu.au';          // Specify mail server
    $mail->Port = 25;                                // Server port: UQ: 25 tls, other: 587 tls (or 465 'ssl' may work for other servers)
    $mail->SMTPSecure = 'tls';                       // Secure transfer enabled, REQUIRED for GMail
    $mail->Username = 'toptechdb@gmail.com';                         // SMTP username
    $mail->Password = 'toptech9527';                          // SMTP password for your email account

//    $mail->SMTPAuth = true;                          // Enable SMTP authentication
    $mail->SMTPAuth = false;                          // Enable SMTP authentication
    $mail->SMTPAutoTLS = true;                       // Force tls?
    $mail->SetFrom($from,$_SESSION['programName']);  // Sender (displayed in email to your user)
    $mail->AddReplyTo($from,'Service');              // Set an alternative reply-to address
    $mail->Subject = $subject;                       // Set the subject line

// Some other commands you can use:
//    $mail->addCC("copy@uq.edu.au","Copy receiver");
//    $mail->addBCC("secret@gmail.com","Secret receiver");

// Set who the message is to be sent to
// If $to is an array, add each address to the TO field
    if (is_array($to)){
      for($i=0; $i < count($to); $i++) {
        $mail->AddAddress($to[$i]);
      }
    } else {
      $mail->AddAddress($to,'MyUser');
    }

// Prepares message for html (see doc for details http://phpmailer.worxware.com/?pg=tutorial)
    $mail->MsgHTML($msg);

// Keep the connection to the SMTP server alive until all emails are sent (important if you send bulk emails)
    $mail->SMTPKeepAlive = true;

// Send the message, check for errors (you could loop through many receivers here)
    $ok = $mail->Send();

// Close the connection to the SMTP server that was kept open above
    $mail->SmtpClose();

    return $ok;

  } catch (phpmailerException $e) {
//    $_SESSION['mailerror'] = $e->errorMessage();      // Pretty error messages from PHPMailer
    $_SESSION['mailerror'] = $e->getMessage();        // Error message from PHPMailer
  } catch (Exception $e) {
    $_SESSION['mailerror'] = $e->getMessage();        // Boring error messages from anything else!
  }
  return false;
}
?>