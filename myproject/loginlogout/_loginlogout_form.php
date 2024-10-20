<?php
  $h="h2";
  if(isset($h_default)){
    $h=$h_default;
  }else if($page=='login'){
    $h="h1";
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
  var login_message='<?php echo($login_message);?>';
  var visituserloginpage=(page!=='login');
  var login_withpagelayout=(page!=='login');
  var htag='<?php echo $h;?>';
</script>
<?php if($h=="h1"):?>
  <div class="container mycontainerbg py-2">
    <div class="row">
      <div class="col-md-6">
<?php endif?>
        <!-- **************** login ******************* -->
        <div id="form_login">
          <div class="masterdata">
            <div id="form_login" class="headline">
              <div>
                <?php if($h<>"h0")echo "<".$h.' class="js_title">'."Login / Logout"."</".$h.">";?>
              </div>
            </div>
            <div class="maindata">
              <div class="k8-padding-6" id="login_message"></div>
              <form id="form1" method="POST" class="k8-loginform p-2"></form>
            </div>
          </div>
        </div>

        <!-- **************** send password ******************* -->
        <div id="form_send_password" style="display: none;">
          <div class="masterdata">
            <div class="headline">
              <div>
                <?php echo "<".$h.' class="js_title">'."Send Password"."</".$h.">";?>
              </div>
            </div>
            <div class="maindata">
              <form id="form2" method="POST" class="k8-loginform p-2"></form>
            </div>
          </div>
        </div>
<?php if($h=="h1"):?>
      </div>
      
      <div class="col-md-6 my-4 d-none d-md-block">
        <img class="img-fluid mx-0 d-block" src="<?php echo $GLOBALS['domain_hostpath'];?>img/key-500.jpg"><!--key-500-->
      </div>
    </div>
  </div>
<?php endif?>
<script src="<?php echo $GLOBALS['domain_hostpath'].$GLOBALS['domain_projectpath'][0];?>/loginlogout/loginlogoutb5.js"></script>