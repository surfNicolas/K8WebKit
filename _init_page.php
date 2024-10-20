<?php   //2023-08-10     2023 Copyright Klaus Eisert
session_start();
include "masterdata/_init.php";
include "masterdata/BasicFunctions.php";
//mylog(array("REQUEST_URI"=>$_SERVER['REQUEST_URI']),2);
//mylog(array("_init_page begin, backurl"=>getfromArray($_SESSION,'backurl')),2);
if($GLOBALS['domain_cookiemode']>0){
  $GLOBALS['domain_cookiemode']=getfromArray($_COOKIE,'cookiemode',$GLOBALS['domain_cookiemode']);
}
// ---------------------- pages -----------------------------
$temp=gsread_file('_home.json');
$GLOBALS['pages']['']=json_decode($temp,true);
$GLOBALS['pages']['register']=array("url"=>$GLOBALS['domain_hostpath'].$GLOBALS['domain_indexfile'].'?page=register',"datadefID"=>"k8loginregister","helpurl"=>"helpservice.php","login"=>false,"headtitle"=>"Register","headdescription"=>"please register here.","headimage"=>"img/welcome-500.jpg");
$GLOBALS['pages']['mydata']=array("url"=>$GLOBALS['domain_hostpath'].$GLOBALS['domain_indexfile'].'?page=mydata',"datadefID"=>"k8login","helpurl"=>"helpservice.php","login"=>true,"headtitle"=>"My data","headdescription"=>"please edit your data here.");
$GLOBALS['pages']['user_list']=array("url"=>$GLOBALS['domain_hostpath'].$GLOBALS['domain_indexfile'].'?page=user_list',"datadefID"=>"k8login","login"=>true);

$GLOBALS['pages']['legalnotice']=array("url"=>$GLOBALS['domain_indexfile'].'?page=legalnotice',"contentfile"=>"_legalnotice.php","headtitle"=>"Legal Notice","headdescription"=>"This is our Legal Notice");
$GLOBALS['pages']['privacypolicy']=array("url"=>$GLOBALS['domain_indexfile'].'?page=privacypolicy',"contentfile"=>"_privacypolicy.php","headtitle"=>"Privacy Policy","headdescription"=>"This is our privacy policy.");
$GLOBALS['pages']['termsofuse']=array("url"=>$GLOBALS['domain_indexfile'].'?page=termsofuse',"contentfile"=>"_termsofuse.php","headtitle"=>"Terms of use","headdescription"=>"This are our terms of use.");
// ÄNDERN!!!!!!!!!!!!!!
$GLOBALS['pages']['privacypolicy']=array("url"=>$GLOBALS['domain_hostpath'].$GLOBALS['domain_indexfile'].'?page=privacypolicy',"datadefID"=>"k8pages","displayvalue"=>"privacypolicy","pagetype"=>"detail","headtitle"=>"Privacy Policy","headdescription"=>"This is our privacy policy.");
$GLOBALS['pages']['termsofuse']=array("url"=>$GLOBALS['domain_hostpath'].$GLOBALS['domain_indexfile'].'?page=termsofuse',"datadefID"=>"k8pages","displayvalue"=>"termsofuse","pagetype"=>"detail","headtitle"=>"Terms of use","headdescription"=>"This are our terms of use.");

$GLOBALS['pages']['login']=array("url"=>$GLOBALS['domain_hostpath'].$GLOBALS['domain_indexfile'].'?page=login',"contentPHP"=>$GLOBALS['domain_projectpath'][0]."/loginlogout/_loginlogout_form.php","headtitle"=>"Login","headdescription"=>"Please, login in here to K8 Web Kit.","headimage"=>"img/key-500.jpg");
$GLOBALS['pages']['member']=array("url"=>$GLOBALS['domain_hostpath'].$GLOBALS['domain_indexfile'].'?page=member',"datadefID"=>"k8components","headtitle"=>"Member items","headdescription"=>"here are all member items listed","login"=>true,"foot"=>["<script src='kitsamples/k8components/k8components_member.js'></script>"]);
$GLOBALS['pages']['basic']=array("url"=>$GLOBALS['domain_hostpath'].$GLOBALS['domain_indexfile'].'?page=basic',"datadefID"=>"k8groups","login"=>true,"headtitle"=>"Basics","headdescription"=>"This are our basic groups");

$GLOBALS['pages']['translation']=array("url"=>$GLOBALS['domain_hostpath'].$GLOBALS['domain_indexfile'].'?page=translation',"datadefID"=>"","headtitle"=>"Translation","headdescription"=>"tranalate the wekit vocabulary by help of google into your desired language and create easily a translation file.","headimage"=>"img/translate-globe-1200.jpg");

$GLOBALS['pages']['item_list']=array("url"=>$GLOBALS['domain_hostpath'].$GLOBALS['domain_indexfile'].'?page=item_list',"datadefID"=>"k8components","login"=>true,"js_display"=>"masterdata1");

$GLOBALS['pages']['contact']=array("url"=>$domain_hostpath.$domain_indexfile.'?page=contact',
    "headtitle"=>"Contact",
    "headdescription"=>"please use our contact form to send us your request.",
    "headimage"=>"img/translate-globe-1200.jpg",
    "foot"=>["<script src=\"".$domain_hostpath.$domain_projectpath[0]."/_contact/_contact.js\"></script>"]
    );
$GLOBALS['pages']['activate']=array("url"=>$domain_hostpath.$domain_indexfile.'?page=activate',
    "headtitle"=>"Activate",
    "headdescription"=>"Please activate your account with the link, which we send you by email.",
    "contentPHP"=>$GLOBALS['domain_projectpath'][0]."/_activate.php"
);
if(true){
  $temp=gsread_file($GLOBALS['domain_projectpath'][0].'/membership/membership.json');
  $GLOBALS['pages']['membership']=json_decode($temp,true);
  $GLOBALS['pages']['membership']['url']=$GLOBALS['domain_hostpath'].$GLOBALS['domain_indexfile']."?page=membership";
}else{
  
}
$GLOBALS['pages']['test']=array("url"=>$domain_hostpath.$domain_indexfile.'?page=test',
    "headtitle"=>"Test",
    "headdescription"=>"This is only a test.",
    "contentPHP"=>$GLOBALS['domain_projectpath'][0]."/_test.php"
);
$temp=gsread_file('_hometest.json');
$GLOBALS['pages']['hometest']=json_decode($temp,true);
        
/* pages from kitsamples */
//$GLOBALS['pages']['basic']=array("url"=>$GLOBALS['domain_indexfile'].'?page=basic',"datadefID"=>"k8groups","login"=>true);
//$GLOBALS['pages']['invoice']=array("url"=>$GLOBALS['domain_indexfile'].'?page=invoice',"datadefID"=>"invoice","js_display"=>"masterdata1");

$site=array();
$error='';
$echo=0;
//$page='home';

// SEO friendly urls
$urlslashparts=array();
$GLOBALS['domain_id']='';
if($GLOBALS['domain_urlmode']===1){
  $urlslashparts=urlslashparts();
  $arr = explode('#', $_SERVER['REQUEST_URI']);
  if(count($arr)>1)$GLOBALS['domain_id']=$arr[1];
  // ? parameters
}
if(count($urlslashparts)>0){
  //mylog('slash execution',2);
  if(count($urlslashparts)==1){
    if(isset($pages[$urlslashparts[0]])){
      $_GET['page']=$urlslashparts[0];
      $page=$_GET['page'];
    }else{
      $_GET['page']="catalog";
      $page=$_GET['page'];
      $_GET['datadefID']=$urlslashparts[0];
    }
  }else if(count($urlslashparts)>=2){
    if($urlslashparts[0]=="p"){
      $_GET['page']=$urlslashparts[1];
      if(count($urlslashparts)>=3){
        $_GET['datadefID']=$urlslashparts[2];
        $datadefID=$_GET['datadefID'];
      }
    }else if($urlslashparts[0]=="e"){
      $_GET['page']=$urlslashparts[1];
      if(count($urlslashparts)>=3){
        $_GET['datadefID']=$urlslashparts[2];
        $datadefID=$_GET['datadefID'];
      }
      if(count($urlslashparts)>=4){
        $_GET['displayvalue']=$urlslashparts[3];
        $displayvalue=$_GET['displayvalue'];
      }
    }else if($urlslashparts[0]=="catalog"){
      $_GET['page']='catalog';
      $_GET['datadefID']=$urlslashparts[1];
    }else{
      $_GET['page']="detail";
      $_GET['datadefID']=$urlslashparts[0];
      $_GET['displayvalue']=$urlslashparts[1];
    }
    $page=$_GET['page'];
  }  
}else{
  //$page=strtolower(getFromArray($_GET,"page","home"));
  //if(!gbnull($GLOBALS['domain_homepage']) and $page=="home"){
  $page=strtolower(getFromArray($_GET,"page"));
  if(!gbnull($GLOBALS['domain_homepage']) and $page==""){
    $_GET['page']="detail";
    $page=$_GET['page'];
    $_GET['pagetype']="detailnoh";
    $_GET['datadefID']="k8pages";
    $_GET['displayvalue']=$GLOBALS['domain_homepage'];
  }
}
$login_message="";

$languageID_old=getfromarray($_SESSION,'domain_languageID',$GLOBALS['domain_languageID']);
//mylog(array("_init_page backurl"=>getfromArray($_SESSION,'backurl')),2);

// ---------------------- check dataaccess -----------------------------
$dbclass=new dbclass();
if(!isset($GLOBALS['k8db'])){
    $page='systemmessage';
    $GLOBALS['domain_systemmessage']='no access to database';
    $GLOBALS['domain_langsupport']=false;
    $GLOBALS['l']=new languagesupport($languageID_old,$GLOBALS['domain_langmodul']);
}else{
    //mylog("_init_page",2);
    $GLOBALS['l']=new languagesupport($languageID_old,$GLOBALS['domain_langmodul']);
    include("_loginlogout_execute.php");

    // ---------------------- auto login -----------------------------
    if(gbnull(getFromArray($_SESSION,'userID')) and isset($_COOKIE['login'])){
        $bok=false;
        $arr=explode('|',$_COOKIE['login']);
        //if(login($arr[1],$arr[2],$error)){
        if(login($arr[1],"",$error,0,0,$arr[2],1)){
            $bok=true;
        }else{
            //echo 'klappt nicht:'.$error.' <br>';
        } 
    }
    
    // ---------------------- check page login  -----------------------------
    if(isset($GLOBALS['pages'][$page])){
        //mylog(array("login"=>getFromArray($GLOBALS['pages'][$page],'login',0),"userID"=>getfromArray($_SESSION,'userID')),2);
        if(getFromArray($GLOBALS['pages'][$page],'login',0) and gbnull(getfromArray($_SESSION,'userID'))){
            $_SESSION['backurl']=$_SERVER['REQUEST_URI'];
            //mylog(array('backurl'=>$_SESSION['backurl']),2);
            header("Location:".$GLOBALS['domain_url_login']);
            exit;
        }
    }
    
    // ---------------------- login with backurl  -----------------------------
    if($GLOBALS['domain_urlmode']==1){
      $url=$_SERVER['PHP_SELF'].''.$_SERVER['QUERY_STRING'];
      if($url==$GLOBALS['domain_url_login']){
        if(gbnull(getFromArray($_SESSION,'backurl'))){
        }else{
          $login_message="please login first";
        }
      }
    }else{
      $url=$_SERVER['PHP_SELF'].'?'.$_SERVER['QUERY_STRING'];
      $pos=strripos($url, '/');
      if($pos) {
        $url=substr($url,$pos+1);
      }
      $pdomain_url_login=getfromArray($GLOBALS,'domain_url_login');
      $pos=strripos($pdomain_url_login, '/');
      if($pos) {
        $pdomain_url_login=substr($pdomain_url_login,$pos+1);
      }
      if($url==$pdomain_url_login){
        if(gbnull(getFromArray($_SESSION,'backurl'))){
        }else{
          $login_message="please login first";
        }
      }else{
        //mylog(array('event'=>'unset(backurl)','url'=>$url,'domain_url_login'=>$GLOBALS['domain_url_login']),2);
        unset($_SESSION['backurl']);
      }
    }
}

// ---------------------- check language change  -----------------------------
//if(isset($_GET["domain_language"]) and instr('de,en',$_GET["domain_language"])>-1){

$languagefixed="";
if(isset($pages[$page]['langchoice'])){
  if(!$pages[$page]['langchoice'])$languagefixed=$GLOBALS['domain_langnative'];
}
if(!gbnull($languagefixed)){
  $GLOBALS['domain_language']=$languagefixed;
  $_SESSION['language']=$GLOBALS['domain_language'];
}else if(isset($_GET["domain_language"]) and isset($GLOBALS['domain_languages'][$_GET["domain_language"]])){
  $_SESSION['language']=$_GET["domain_language"];
  $GLOBALS['domain_language']=$_GET["domain_language"];
}elseif(isset($_SESSION['language'])){    
  //echo '$_SESSION[language]='.$_SESSION['language'].'<br>';
  if(!isset($GLOBALS['domain_languages'][$_SESSION['language']]))$_SESSION['language']=$GLOBALS['domain_langnative'];
}else{
  $browser_language = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
  //echo '$browser_language='.$browser_language.'<br>';
  if(isset($GLOBALS['domain_languages'][$browser_language])){
      $_SESSION['language']=$browser_language;
  }else{
      $_SESSION['language']=$GLOBALS['domain_language'];
  }
}

$GLOBALS['domain_language']=$_SESSION['language'];
$GLOBALS['domain_languageID']=$GLOBALS['domain_languages'][$GLOBALS['domain_language']]['languageID'];
$_SESSION['domain_languageID']=$GLOBALS['domain_languages'][$GLOBALS['domain_language']]['languageID'];
if($languageID_old<>$GLOBALS['domain_languageID']){
    $GLOBALS['l']=new languagesupport($GLOBALS['domain_languageID'],$GLOBALS['domain_langmodul']);
}

// ---------------------- Init Variables -----------------------------
$page_mode=getFromArray($_GET,"page_mode",0); //page_mode: 1=only content
$headtitle=$GLOBALS['domain_name'];
$headdescription=$GLOBALS['domain_description'];
$headimage=$GLOBALS['domain_image'];
$datadefID=getFromArray($_GET,"datadefID",0);
$layout=getFromArray($_GET,"layout",0);
$table=getFromArray($_REQUEST,"table");
$keyvalue=getFromArray($_GET,"keyvalue",0);
$pagetype=getFromArray($_GET,"pagetype");
$displayvalue=urldecode(getFromArray($_GET,"displayvalue"));
//mylog(array('init_page.$displayvalue'=>$displayvalue),2);
//mylog(array('status'=>'after urlslashparts','page'=>$page,'datadefID'=>$datadefID),2);

if($_SESSION['language']<>$GLOBALS['domain_langnative']){
  $headdescription=getFromArray($GLOBALS['domain_languages'][$GLOBALS['domain_language']],'domain_description',$headdescription);
}

//mylog(array("domain_language"=>$GLOBALS['domain_language']),2);
//mylog(array("REQUEST"=>$_REQUEST),$echo);
if($GLOBALS['domain_language']=='de'){
  $GLOBALS['pages']['doc_legalrequirements']['headtitle']="Rechtliche Anforderungen";
  $GLOBALS['pages']['doc_legalrequirements']['headdescription']="Bitte berücksichtige Deine Pflichten als Webseitenbetreiber.";
  $GLOBALS['pages']['doc_legalrequirements']["contentPHP"]="zpages/legalrequirements/legalrequirementsde.php";
}
if(isset($GLOBALS['pages'][$page])){
  $datadefID=getfromArray($GLOBALS['pages'][$page],'datadefID',$datadefID);
  $layout=getfromArray($GLOBALS['pages'][$page],'layout',$layout);
  $headtitle=getfromArray($GLOBALS['pages'][$page],'headtitle',$headtitle);
  $headdescription=getfromArray($GLOBALS['pages'][$page],'headdescription',$headdescription);
  $headimage=getfromArray($GLOBALS['pages'][$page],'headimage',$headimage);
  $pagetype=getfromArray($GLOBALS['pages'][$page],'pagetype');
  $displayvalue=getfromArray($GLOBALS['pages'][$page],'displayvalue');
}
//mylog(array('$datadefID'=>$datadefID,'$page'=>$page,'$displayvalue'=>$displayvalue),$echo);

function urlslashparts(){
  $path = ltrim($_SERVER['REQUEST_URI'], '/');    // Trim leading slash(es)
  $arr = explode('#', $path);                     // Split id
  $arr = explode('?', $arr[0]);                   // Split ?
  $path=$arr[0];
  $elements = explode('/', $path);                // Split path on slashes
  $count=count($elements);
  if($count>0){
    if(gbnull($elements[$count-1]))array_pop($elements);
    //$domain_main=getfromArray($GLOBALS,'domain_main');
    $domain_countsubs=getfromArray($GLOBALS,'domain_countsubs',0);
    if($domain_countsubs>0){
      //mylog(array('$elements before delete'=>$elements),2);
      for ($i = 0; $i <$domain_countsubs; $i++) {
        array_shift($elements);
      }
    }else if($_SERVER['SERVER_NAME']=='localhost'){
      array_shift($elements);
    }
    if(count($elements)>0){
      if(instr($elements[0],'.php')>=0 or instr($elements[0],'.html')>=0){
        array_shift($elements);
      }
    }
  }
  //mylog(array('$elements'=>$elements),2);
  return $elements;
}
?>