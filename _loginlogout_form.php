<?php
$h="h2";
if(isset($h_default)){
  $h=$h_default;
}
?>
<script>
var GLOBALS_loginenabled=<?php echo $GLOBALS['domain_loginenabled'];?>;
GLOBALS_email.sendPwd={};
GLOBALS_email.sendPwd={
    "subject":getl('<?php echo $GLOBALS['domain_email']['sendPwd']['subject'];?>'),
    "content":getl('<?php echo $GLOBALS['domain_email']['sendPwd']['content'];?>')
};
var userIDlogin=<?php echo getFromArray($_SESSION,'userID',0);?>;
var usernamelogin='<?php echo(getfromArray($_SESSION,'username'));?>';
var username='<?php echo(getfromArray($_REQUEST,'username'));?>';
var domain_url_register="<?php echo $domain_url_register;?>";
var error_pwd='<?php if(isset($error_pwd))echo($error_pwd);?>';
var visituserloginpage=(page!=='login');
</script>

<!-- **************** login ******************* -->
<div id="form_login">
    <?php 
    if($h<>"h0"){
      echo "<".$h.">"."Login / Logout"."</".$h.">";
    }
    ?>
    <?php 
      if(!gbnull($login_message)){
        echo '<p id="login_message">'.$login_message."</p>";
      }
    ?>
    <form id="form1" method="POST" class="k8-loginform border rounded p-2"></form>
</div>

<!-- **************** send password ******************* -->
<div id="form_send_password" style="display: none;">
  <?php echo "<".$h.">"."Send Password"."</".$h.">";?>
  <form id="form2" method="POST" class="k8-loginform border rounded p-2"></form>
</div>
<script src="js/loginlogoutb5.js"></script>
