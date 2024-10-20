<?php // k8webkitb5 2023-09-16 Klaus Eisert Copyright
$GLOBALS['domain_myprot']=array();
$GLOBALS['domain_hostpath']=hostpath();
include "_version.php";
$GLOBALS['domain_homepage']="home";
$GLOBALS['domain_name']='K8&nbsp;Web&nbsp;Kit';
$GLOBALS['domain_description']='K8 Web Construction Kit helps you to create data elements and to place it on your website. Depending on a datadefinition you define forms, lists, catalogs and detail pages.';
$GLOBALS['domain_emailfrom']='myemail@mydomain.com';
$GLOBALS['domain_emailto']='myemail@mydomain.com';
$GLOBALS['domain_operator']='my name<br>my street<br>country code city<br>';
$GLOBALS['domain_image']='img/webkit.JPG';
$GLOBALS['domain_layout']=0;  //  0=full page size, 1=lg about 1320px
$GLOBALS['domain_classheader']='container';
$GLOBALS['domain_classmain']='container';
$GLOBALS['domain_urlmode']=0; // 0=normal 1=SEO friendly
$GLOBALS['domain_countsubs']=0;       // count of sub folders
$GLOBALS['domain_serviceworker']=0;   // 0=off 1=on

if($GLOBALS['domain_urlmode']==1){
  $GLOBALS['domain_indexfile']='index.php';
  $GLOBALS['domain_url_register']=$domain_hostpath.'p/register';
  $GLOBALS['domain_url_login']=$domain_hostpath."p/login";
  $GLOBALS['domain_url_afterlogin']=$domain_hostpath.'k8pages/membership';
  $GLOBALS['domain_url_logout']=$domain_hostpath.str_repeat('../',$GLOBALS['script_depth'])."masterdata/ProcessMethod.php?process_action=logout";
  $GLOBALS['domain_url_termsofuse']=$domain_hostpath."k8pages/termsofuse";
}else{
  $GLOBALS['domain_indexfile']='index.php';
  $GLOBALS['domain_url_register']=$domain_hostpath.$GLOBALS['domain_indexfile'].'?page=register';
  //$GLOBALS['domain_url_login']=$domain_hostpath.$GLOBALS['domain_indexfile']."?page=login";
  $GLOBALS['domain_url_login']=$GLOBALS['domain_indexfile']."?page=login";
  $GLOBALS['domain_url_afterlogin']=$domain_hostpath.$GLOBALS['domain_indexfile'].'?page=detail&datadefID=k8pages&marking=membership';
  $GLOBALS['domain_url_logout']=$domain_hostpath.str_repeat('../',$GLOBALS['script_depth'])."masterdata/ProcessMethod.php?process_action=logout";
  $GLOBALS['domain_url_termsofuse']=$domain_hostpath.$GLOBALS['domain_indexfile']."index.php?page=detail&datadefID=k8pages&displayvalue=termsofuse";
}

$GLOBALS['domain_basicgroups']=array(array("type"=>"page_group","title"=>"Page type"));
$GLOBALS['domain_languages']=array();
$GLOBALS['domain_languages']['en']=array('languageID'=>3,"flag"=>"<span class=\"flag-icon flag-icon-us\"></span>","label"=>"English","labelen"=>"English");
//$GLOBALS['domain_languages']['de']=array('languageID'=>2,"flag"=>"<span class=\"flag-icon flag-icon-de\"></span>","label"=>"Deutsch","labelen"=>"German","domain_description"=>'K8 Web Kit hilft Dir, Datenelemente zu erstellen und auf Deiner Website zu platzieren. Mittels Deiner Datendefinition definierst Du Formulare, Listen, Kataloge und Detailseiten.');
//$GLOBALS['domain_languages']['es']=array('languageID'=>8,"flag"=>"<span class=\"flag-icon flag-icon-es\"></span>","label"=>"Espagnol","labelen"=>"Spanish");
//$GLOBALS['domain_languages']['ru']=array('languageID'=>7,"flag"=>"<span class=\"flag-icon flag-icon-ru\"></span>","label"=>"русский","labelen"=>"Russian");
//$GLOBALS['domain_languages']['th']=array('languageID'=>6,"flag"=>"<span class=\"flag-icon flag-icon-th\"></span>","label"=>"ไทย","labelen"=>"Thai");
//$GLOBALS['domain_languages']['fr']=array('languageID'=>4,"flag"=>"<span class=\"flag-icon flag-icon-fr\"></span>","label"=>"Français","labelen"=>"French");
$GLOBALS['domain_langnative']='en';
$GLOBALS['domain_language']=$GLOBALS['domain_langnative'];
$GLOBALS['domain_languageID']=$GLOBALS['domain_languages'][$GLOBALS['domain_language']]['languageID'];
$GLOBALS['domain_langsupport']=true;                        // languagesupport
$GLOBALS['domain_langmodul']="system";

if($GLOBALS['domain_urlmode']==1){
  $GLOBALS['domain_pagelinks'][$GLOBALS['domain_langnative']]['home']=array('href'=>'','title'=>$GLOBALS['domain_name']);
  $GLOBALS['domain_pagelinks'][$GLOBALS['domain_langnative']]['membership']=array('href'=>$GLOBALS['domain_hostpath'].'k8pages/membership','title'=>'#ls#My membership#');
  $GLOBALS['domain_pagelinks'][$GLOBALS['domain_langnative']]['contact']=array('href'=>$GLOBALS['domain_hostpath'].'p/contact','title'=>'#ls#Contact#');
  $GLOBALS['domain_pagelinks'][$GLOBALS['domain_langnative']]['legalnotice']=array('href'=>$GLOBALS['domain_hostpath'].'k8pages/legalnotice','title'=>'#ls#Imprint#');
  $GLOBALS['domain_pagelinks'][$GLOBALS['domain_langnative']]['privacypolicy']=array('href'=>$GLOBALS['domain_hostpath'].'k8pages/privacypolicy','title'=>'#ls#Privacy policy#');
  $GLOBALS['domain_pagelinks'][$GLOBALS['domain_langnative']]['termsofuse']=array('href'=>$GLOBALS['domain_hostpath'].'k8pages/termsofuse','title'=>'#ls#Terms of use#');
  $GLOBALS['domain_pagelinks'][$GLOBALS['domain_langnative']]['service1']=array('href'=>$GLOBALS['domain_hostpath'].'k8pages/service1','title'=>'Service 1');
  $GLOBALS['domain_pagelinks'][$GLOBALS['domain_langnative']]['service2']=array('href'=>$GLOBALS['domain_hostpath'].'k8pages/service2','title'=>'Service 2');
}else{
  $GLOBALS['domain_pagelinks'][$GLOBALS['domain_langnative']]['home']=array('href'=>'','title'=>$GLOBALS['domain_name']);
  $GLOBALS['domain_pagelinks'][$GLOBALS['domain_langnative']]['membership']=array('href'=>$GLOBALS['domain_indexfile'].'?page=detail&datadefID=k8pages&marking=membership','title'=>'#ls#My membership#');
  $GLOBALS['domain_pagelinks'][$GLOBALS['domain_langnative']]['contact']=array('href'=>$GLOBALS['domain_indexfile'].'?page=contact','title'=>'#ls#Contact#');
  $GLOBALS['domain_pagelinks'][$GLOBALS['domain_langnative']]['legalnotice']=array('href'=>$GLOBALS['domain_indexfile'].'?page=detail&datadefID=k8pages&marking=legalnotice','title'=>'#ls#Imprint#');
  $GLOBALS['domain_pagelinks'][$GLOBALS['domain_langnative']]['privacypolicy']=array('href'=>$GLOBALS['domain_indexfile'].'?page=detail&datadefID=k8pages&marking=privacypolicy','title'=>'#ls#Privacy policy#');
  $GLOBALS['domain_pagelinks'][$GLOBALS['domain_langnative']]['termsofuse']=array('href'=>$GLOBALS['domain_indexfile'].'?page=detail&datadefID=k8pages&marking=termsofuse','title'=>'#ls#Terms of use#');
  $GLOBALS['domain_pagelinks'][$GLOBALS['domain_langnative']]['service1']=array('href'=>$GLOBALS['domain_indexfile'].'?page=detail&datadefID=k8pages&marking=service1','title'=>'Service 1');
  $GLOBALS['domain_pagelinks'][$GLOBALS['domain_langnative']]['service2']=array('href'=>$GLOBALS['domain_indexfile'].'?page=detail&datadefID=k8pages&marking=service2','title'=>'Service 2');
}
$GLOBALS['domain_cookiemode']=1;    // 0:no cookie, 1:ask for cookie, 2:cookie allowed, 3:cookie denied
$GLOBALS['domain_cookieconf']['en']=array(
    "title"=>"Use of Cookies",
    "text"=>"We use cookies to personalize content and ads, to provide social media features and to analyze access to our website. We also share information about your use of our website with our social media, advertising and analytics partners. Our partners may combine this information with other information that you have provided to them or that they have collected from your use of the Services.",
    "allow"=>"allow",
    "deny"=>"deny"
);
$GLOBALS['domain_cookieconf']['de']=array(
    "title"=>"Verwendung von Cookies",
    "text"=>"Wir verwenden Cookies, um Inhalte und Anzeigen zu personalisieren, Funktionen für soziale Medien anbieten zu können und die Zugriffe auf unsere Website zu analysieren. Außerdem geben wir Informationen zu Ihrer Verwendung unserer Website an unsere Partner für soziale Medien, Werbung und Analysen weiter. Unsere Partner führen diese Informationen möglicherweise mit weiteren Daten zusammen, die Sie ihnen bereitgestellt haben oder die sie im Rahmen Ihrer Nutzung der Dienste gesammelt haben.",
    "allow"=>"zulassen",
    "deny"=>"ablehnen"
);

$GLOBALS['domain_development']=2;   //0=off, 1=on ATTENTION open data access, 2=depend on display_errors

$GLOBALS['domain_datadeffiles']=array("myproject/_datadefinition_myproject.php","kitsamples/_datadefinition_kit.php");
$GLOBALS['domain_selectfiles']=array(str_repeat('../',$GLOBALS['script_depth'])."kitsamples/_select_kit.php");
$GLOBALS['domain_includes']['login']=array(); //array(str_repeat('../',$GLOBALS['script_depth'])."service/_service_login.php");
$GLOBALS['domain_includes']['logout']=array(); //array(str_repeat('../',$GLOBALS['script_depth'])."service/_service_logout.php");
$GLOBALS['domain_includes']['RBAC_Read']=array(); // array("kitsamples/RBAC_Read.php");
$GLOBALS['domain_includes']['RBAC_RUD']=array();  // "kitsamples/RBAC_RUD.php"
$GLOBALS['domain_includes']['RBAC_CUD']=array();  // "kitsamples/RBAC_CUD.php"

$GLOBALS['domain_menumode']=4;      //0=php manuell _header.php, 1=menu.js, 2=user configuration, 3=menu.js+user configuration, 4=menu.js logged in user+user configuration
$GLOBALS['domain_projectpath']=array("myproject","kitsamples");

$GLOBALS['domain_datadefIDatt']=8;    //future "k8references";
$GLOBALS['domain_rightmode']=0;       //0=Standandard, 1=clientID, 2=rightgroupID
$GLOBALS['domain_roles']=array(
  "1"=>"admin for client",
  "2"=>"superuser",
  "3"=>"member",
  "5"=>"friends",
  "30"=>"rightgroups",
  "101"=>"developer",
  "102"=>"marketing"
);
$GLOBALS['domain_defaultrights']=array(
    "create"=>array("0"=>0,"1"=>1,"2"=>2,"3"=>2),
    "read"  =>array("0"=>2,"1"=>1,"2"=>2,"3"=>2),
    "update"=>array("0"=>0,"1"=>1,"2"=>2,"3"=>10),
    "delete"=>array("0"=>0,"1"=>1,"2"=>2,"3"=>10));
$GLOBALS['gdatareadlimit']=50;

$GLOBALS['domain_registermode']=0; //0=only username+email, 1=with address
$GLOBALS['domain_registerenabled']=1; //0=not allowed, 1=registration ok, 2=registration in menu but not yet available
$GLOBALS['domain_useractive']=0;      //0=direct login, 1=with activation mail
$GLOBALS['domain_activekey']=113;
$GLOBALS['domain_loginenabled']=1;  //0=not enabled, 1=enabled

$GLOBALS['domain_emailmode']=1;     //0=mail by server, 1=PHPMailer
$GLOBALS['domain_testemail']="xx@xx.com";
$GLOBALS['domain_email']=array(
  "activate"=>array(
      "subject"=>"activate your account",
      "content"=>"Dear member,<br>please activate your account: <a href=\"{{activation_link}}\">activation link</a><br>Greetings<br>{{domain_name}}"
  ),
  "sendPwd"=>array(
      "subject"=>"new password",
      "content"=>"Dear member,<br>your new password: {{password}}<br>Greetings<br>{{domain_name}}"
  ),
  "template"=>array(
      "subject"=>"template",
      "content"=>"Dear member,<br>{{content}}<br>Greetings<br>{{domain_name}}"
  )
);
$GLOBALS['domain_PHPMailer']=array(
    "from"=>"",       // sender email address
    "fromname"=>"",             // sender name
    "host"=>"",               // Outgoing mail server (SMTP)
    "SMTPAuth"=>true,                       // SMTP Authentication activated
    "username"=>"",   // SMTP username
    "password"=>"",         // SMTP password
    "port"=>465                             // Port of Outgoing mail server (SMTP)
);

$GLOBALS['domain_connectors']=array(
    "sovendus-db"=>array(
      "name"=>"your db name",
      "type"=>"sqlsrv",
      "parameter"=>array(
        "server"=>"POWER\\SQLEXPRESS2017",
        "database"=>"db-name",
        "username"=>"sa",
        "password"=>"password"
      )
    )
);

$GLOBALS['domain_readpassword']=0;  //0=off, 1=user and admin, 2=only user, 3=only admin

$GLOBALS['generalformat']=0;  // 0:with decimal point, 1:with decimal komma
$_SESSION['generalformat']=$GLOBALS['generalformat'];
$GLOBALS['thousands_sep']=',';
$GLOBALS['decimal_point']='.';
$GLOBALS['generaldateformat']='m/d/Y';
$GLOBALS['sqldateformat']='%m/%d/%Y';
$GLOBALS['tabulatordateformat']='MM/dd/yyyy';
$GLOBALS['tabulatortimeformat']='h:mm a';
$GLOBALS['tabulatordatetimeformat']='MM/dd/yyyy h:mm a';
$GLOBALS['tabulator_datetime_fp']=json_encode(array('inputFormat'=>'yyyy-MM-dd','outputFormat'=>$GLOBALS['tabulatordateformat']));
$GLOBALS['domain_systemmessage']='';
$GLOBALS['datadefinitions']=array();
$GLOBALS['clientID']=0;

$GLOBALS['numericTypesAll'] = array("TINYINT","SMALLINT","MEDIUMINT","BIGINT","INT","FLOAT","DOUBLE","DECIMAL");
$GLOBALS['numericTypesDecimal'] = array("FLOAT","DOUBLE","DECIMAL");
$GLOBALS['stringTypes']=array("VARCHAR","CHAR","TINYTEXT","MEDIUMTEXT","LONGTEXT","TEXT");
$GLOBALS['domain_resources_linked']=array();
$GLOBALS['domain_datadefIDs_declared']=array();

function hostpath(){
  $path="";
  $pos=strripos($_SERVER['PHP_SELF'], '/');
  if ($pos <> false) {
    $path=substr($_SERVER['PHP_SELF'],0,$pos+1);
    if($GLOBALS['script_depth']>0 and strlen($path)>0){
      //$GLOBALS['domain_myprot'][]=array('1 path'=>$path);
      if(substr($path,strlen($path)-1,1)=='/'){
        $path=substr($path,0,strlen($path)-1);
        //$GLOBALS['domain_myprot'][]=array('2 path'=>$path);
        // script_depth = 1
        $pos=strripos($path, '/');
        if ($pos === false){
          $path='';
        }else{
          $path=substr($path,0,$pos+1);
        }
        //$GLOBALS['domain_myprot'][]=array('3 path'=>$path);
      }
    }
    if(substr($path,0,1)==='/'){
      $path=substr($path,1);
    }
    //echo $path.'<br>';
  }
  return $_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'].'/'.$path;
}