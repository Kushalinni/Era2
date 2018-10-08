<?php
$name = $_POST["name"];
$email = $_POST["email"];
$phone = $_POST["phone"];
 
$EmailTo = "moradxd@gmail.com";
$Subject = "Flare - Lead Gen Message";
 
// prepare email body text
$Body = "Name: ";
$Body .= $name;
$Body .= "\n";
 
$Body .= "Email: ";
$Body .= $email;
$Body .= "\n";
 
$Body .= "Phone: ";
$Body .= $phone;
$Body .= "\n";
 
// send email
$success = mail($EmailTo, $Subject, $Body, "From:".$email);
 
// redirect to success page
if ($success){
   echo "success";
}else{
    echo "invalid";
}
 
?>