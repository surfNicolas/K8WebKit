<?php // 2020-05-14
$error_pwd="";
if(getfromArray($_REQUEST,'submit')=="Login"){
    $username=getfromArray($_REQUEST,'username');
    $password=getfromArray($_REQUEST,'password');
    $rememberme=getfromArray($_REQUEST,'rememberme',0);
    if(login($username,$password,$error_pwd,$rememberme)){      
        mylog("logged in",2);
    }else{
        //$error_pwd="user or password not valid!";
        mylog("user or password not valid!",2);
    }
    if(getfromarray($_SESSION,'bnewlogin',0)){
        mylog("bnewlogin",2);
        $companyID=getFromArray($_SESSION,'companyID',0);
        //Cookie setzen
        //setcookie('login',$companyID.'|'.$_SESSION['username'].'|'.$_SESSION['password'],(time()+60*60*24*3000));
        setcookie('login',$companyID.'|'.$_SESSION['username'].'|'.$_SESSION['pwdencrypted'],(time()+60*60*24*3000),"/",$_SERVER['HTTP_HOST']);
        $_SESSION['bnewlogin']=0;
        header("refresh:0");
        exit;
    }
}elseif(getfromArray($_REQUEST,'submit')=="Logout"){
    if(logout()){
      //header("Refresh:0");
      if($GLOBALS['domain_urlmode']==1){
          header("Location: ".$GLOBALS['domain_indexfile']);      
      }else{
          header("Location: ".$GLOBALS['domain_hospath']);      
      }
      exit;
    }
}
//mylog(localeconv(),2);
//mylog($_SESSION,2);