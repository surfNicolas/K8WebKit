<?php
// 2021-07-20 Copyright Klaus Eisert
//masterdata/ProcessData.php?datadefID=3&process_action=ReadFilter
// ATTENTION BUG getDatadefinition, return values: datadefID, error

$GLOBALS['echo']=0;
$GLOBALS['script_depth']=1;
session_start();

include "_init.php";
include("BasicFunctions.php");
//mylog($GLOBALS['domain_myprot'],2);
$GLOBALS['l']=new languagesupport(getfromarray($_SESSION,'domain_languageID',$GLOBALS['domain_languageID']),$GLOBALS['domain_langmodul']);

mylog('PROCESSDATA ,datadefID='.getfromarray($_REQUEST,'datadefID').' ,process_action='.getfromarray($_REQUEST,'process_action').'hostpath='.$GLOBALS['domain_hostpath'],$echo);
$input=json_decode(file_get_contents('php://input'),true);
if(is_array($input))$_REQUEST=array_merge($_REQUEST,$input);
//mylog(file_get_contents('php://input'),$echo);
//mylog($_GET,$echo);
//mylog($_POST,$echo);

foreach($_REQUEST as $k => $v){
  mylog(urldecode($k),2);
  if($k<>urldecode($k)){
    unset($_REQUEST[$k]);
    $_REQUEST[urldecode($k)]=$v;
  }
}

mylog($_REQUEST,$echo);

//mylog('generaldateformat='.$GLOBALS['generaldateformat'],$echo);
//mylog("generalformat=".$GLOBALS['generalformat'],$echo);

if(gbnull(getfromArray($_SESSION,'userID')) and isset($_COOKIE['login'])){
    $arr=explode('|',$_COOKIE['login']);
    //if(login($arr[1],$arr[2],$error)){
    if(login($arr[1],"",$error,false,$arr[2])){
        mylog("login successful",$echo);
    }else{
        mylog("login not successful",$echo);
    } 
}     
$GLOBALS['domain_languageID']=getfromarray($_SESSION,'domain_languageID',$GLOBALS['domain_languageID']);
$GLOBALS['domain_language']=getfromarray($_SESSION,'domain_language',$GLOBALS['domain_language']);

//include("class_data_sqlsrv.php");
include("_datadefinitions.php");

$error='';
$elementID=0;
/* if elementID
 * load datadefID
 * change sql, tabulator, ...
 */

$datadefID=getfromArray($_REQUEST,'datadefID',0);
if(is_numeric($datadefID) and $datadefID<0)$datadefID=0;
$table=getfromArray($_REQUEST,'table');
$dialog=getfromArray($_REQUEST,'dialog',0);

$GLOBALS['REQUEST']=$_REQUEST;
if(strtoupper(getfromarray($_REQUEST,"process_action",''))==strtoupper('GetObject')){
    if(gbnull($elementID)){
        $result['data']=getDatadefinition($datadefID,$error,"",0,$table,0,false,0);
    }else{
        $datadefID=124;
        $result['data']=getDatadefinition($datadefID,$error,"",0,$table,0,false,0);
    }
    if(gbnull($error)){
        $result['bok']=true;
    }else{
        $result['error']=$error;
    }
    echo json_encode($result,JSON_NUMERIC_CHECK);
}else{
    $o=0;
    if(gbnull($elementID)){
        //getDatadefinition(&$datadefID,$error,$masterkeyvalue="",$rightuser_create_master=0,$table='',$ret=0,$dialog=false,$objectives=0)
        $o=getDatadefinition($datadefID,$error,"",0,$table,1,false,-1);
    }else{
        $datadefID=124;
        $o=getDatadefinition($datadefID,$error,"",0,$table,1,false,-1);
    }

    //mylog('script_depth='.$GLOBALS['script_depth'],$echo);
    //mylog('PHP_SELF='.$_SERVER['PHP_SELF'],$echo);
    //mylog($o->colobject,$echo);
  
    if($o){
      //mylog($o,$echo);
      $result['bok']=false;
      switch(strtoupper(getfromarray($_REQUEST,"process_action",''))){
          /*case strtoupper('GetObject'):
              if(gbnull($error)){
                  $result['bok']=true;
                  $result['data']=$datadefinitions[$datadefID];
              }else{
                  $result['error']=$error;
              }
              echo json_encode($result,JSON_NUMERIC_CHECK);
              break;
           */
          case strtoupper('ReadFilter'):
              mylog("ReadFilter",$echo);
              //filters[0][field]=name&filters[0][type]=like&filters[0][value]=Bo
              /*$tabledata=array();
              if(isset($_REQUEST['filters'])){
                  $tabledata = json_decode('[{"id":1, "name":"Billy Bob", "age":"12", "gender":"male", "col":"red", "dob":""},{"id":2, "name":"Mary May", "age":"1", "gender":"female", "col":"blue", "dob":"14/05/1982"}]');
              }else{
                  $tabledata = json_decode('[{"id":3, "name":"Jups Joob", "age":"12", "gender":"male", "col":"red", "dob":""},{"id":2, "name":"Jups Boob", "age":"1", "gender":"female", "col":"blue", "dob":"14/05/1982"}]');
              }
              */
              //$tabledata = json_decode('{"id":1}');
              //$tabledata = json_decode('[{"id":1, "name":"Billy Bob", "age":"12", "gender":"male", "col":"red", "dob":""},{"id":2, "name":"Mary May", "age":"1", "gender":"female", "col":"blue", "dob":"14/05/1982"}]');
              //$tabledata = json_decode( '{"a":1,"b":2,"c":3,"d":4,"e":5}');
              //echo "hier<br>";
              $_REQUEST['filters']=getfromArray($_REQUEST,'filter',getfromArray($_REQUEST,'filters',array()));
              if(getfromarray($datadefinitions[$datadefID],'objectclass')==='data_session'){
                  //echo "data_session<br>";
                  $filters=[];
                  if(isset($_REQUEST['filters'])){
                      $filters=$_REQUEST['filters'];
                  }
                  $tabledata=$o->getentries($filters);
              }else{
                  mylog(getfromarray($_REQUEST,"clause","no clause"),$echo);
                  mylog(getfromarray($_REQUEST,"filters","no filters"),$echo);
                  mylog(array("columns"=>$o->colobject),$echo);
                  
                  $clause=getFromArray($_REQUEST,'clause');
                  if(!gbnull($clause))$clause="(".$clause.')';
                  if(isset($_REQUEST['filters'])){
                      //echo "<pre>";print_r($_REQUEST['filters']);echo "</pre>";
                      $filters=$_REQUEST['filters'];
                      if(isset($filters[0])){
                        foreach($filters as $filter){
                            // filter[value] hier schneiden und Schleife drum
                            //$filtertype
                            //$filtervalue
                            //$value
                            //$operator
                            mylog(array("filter"=>$filter),$echo);
                            $clause_or="";
                            $filtervalue=$filter['value'];
                            if(is_array($filter['value'])){
                              $filtervalue=$filter['value'][count($filter['value'])-1];
                            }
                            $value_or_arr=explode('||',$filter['value']);
                            if(count($value_or_arr)<=1)$value_or_arr=explode('|',$filtervalue);
                            foreach($value_or_arr as $value_or){
                              $clause_and="";
                              $value_and_arr=explode('&&',$value_or);
                              foreach($value_and_arr as $value_and){
                                $clause_snip=CreateClause($o->colobject,$filter['field'],$filter['type'],$value_and);
                                $clause_and=gsclauseand($clause_and,$clause_snip,!gbnull($clause_snip)," and ");
                              }
                              $clause_or=gsclauseand($clause_or,$clause_and,!gbnull($clause_and)," or ");
                            }
                            $clause=gsclauseand($clause,$clause_or,!gbnull($clause_or)," and ");
                        }
                      }else{
                        mylog("filters not valid",$echo);
                      }
                  }
                  
                  //echo '$clause='.$clause.'<br>';
                  $tabledata=$o->getentries($clause);
                  //echo 'tabledata:'.'<br>';
                  //print_r($tabledata);
                  if(!gbnull($o->GetError())){
                      mylog($o->GetError(),$echo);
                  }
              }

              mylog($tabledata,$echo);
              echo json_encode($tabledata);
              break;
          case strtoupper('Load'):
              $key=getfromarray($_REQUEST,'keyvalue',getfromarray($_REQUEST,'key',getfromarray($_REQUEST,$o->key,0),0),0);
              if($o->bload($key)){
                $result['bok']=true;
                $result['dat']=$o->dat;
              }else{
                $result['bok']=false;
                $result['error']=$o->GetError();
              }
              //echo json_encode($result,JSON_NUMERIC_CHECK);
              echo json_encode($result);
              break;
              
          case strtoupper('Save'):
              mylog("Save",$echo);
              if(0){echo '<pre>';print_r($_REQUEST);echo '</pre>';}
              if($o->bvalidate($_REQUEST)){
                if(0){echo '<pre>';print_r($o->postfields);echo '</pre>';}
                $result['bok']=$o->save();
                if(!$result['bok']){
                    $result['error']=$o->GetError();
                }else{
                  // read $result['dat']
                  $roles=getfromarray($_SESSION,'roles',array()); 
                  if($o->table=='k8login' and !in_array(2,$roles)){
                      //normal user for k8login
                      $result['dat']=$o->postfields;
                  }else{
                      mylog(array('result.bok'=>$result['bok']),$echo);
                      //if($o->bload($result['bok'])){
                      //if($o->bloadrec($o->postfields)){
                      if($o->bloadrec()){
                        $result['dat']=$o->dat;
                      }else{
                        $result['bok']=false;
                        $result['error']=$o->GetError();
                      }
                  }
                  if($o->table=='k8login'){
                    $userIDtemp=getfromArray($result['dat'],'userID',0);
                    if(getfromArray($_SESSION,'userID',0)==$userIDtemp){
                      updateSession();
                    }
                  }
                }
                echo json_encode($result);
              }else{
                if($o->table=="k8references" and !empty($_FILES)){
                  header("HTTP/1.0 400 Bad Request");
                  echo $o->GetError();
                }else{ 
                  $result['error']=$o->GetError();
                  echo json_encode($result);
                }
              }
              break;
          case strtoupper('SavePreview'):
              // only for k8pages
              $_REQUEST['pageID']=-$_SESSION['dat_user']['userID'];
              $echo=2;
              mylog("SavePreview",$echo);
              mylog(array('$_REQUEST'=>$_REQUEST),$echo);
              $keyvalue=$_REQUEST['pageID'];
              if(gbnull($keyvalue) or gbEmptyStructure($_REQUEST)){
                $result['error']="values are not valid!";
              }else{
                if($o->bvalidate($_REQUEST)){
                  $sql="DELETE FROM k8pages WHERE marking=".gsstr2sql($o->dbclass->db->real_escape_string($o->postfields['marking']));
                  $o->dbclass->db->query($sql);
                  $sql="DELETE FROM k8pages WHERE pageID=".gsstr2sql($o->dbclass->db->real_escape_string($o->postfields['pageID']));
                  $o->dbclass->db->query($sql);
                  
                  $result['bok']=$o->add(1);
                }
                if(!$result['bok']){
                    $result['error']=$o->GetError();
                }else{
                  if($o->bload($result['bok'])){
                    $result['dat']=$o->dat;
                  }else{
                    $result['bok']=false;
                    $result['error']=$o->GetError();
                  }
                }
              }
              echo json_encode($result);
              break;
          case strtoupper('Delete'):
          case strtoupper('Del'):
              $key=getfromarray($_REQUEST,'keyvalue',getfromarray($_REQUEST,'key',getfromarray($_REQUEST,$o->key,0),0),0);
              $o->postfields=getfromarray($_REQUEST,'dat');
              mylog(array("postfields"=>$o->postfields),2);
              $result['bok']=$o->delete($key);
              if(!$result['bok']){
                  //if($echo)echo 'Error: '.$o->GetError().'<br>';
                  $result['error']=$o->GetError();
              }
              echo json_encode($result,JSON_NUMERIC_CHECK);
              break;
          case strtoupper('getNextSort'):
              $clause=getfromarray($_REQUEST,'clause');
              $inc=getfromarray($_REQUEST,'inc',10);
              $sortcolumn=getfromarray($_REQUEST,'sortcolumn',"sort");
              $result['bok']=$o->getNextSort($clause,$inc=10,$sortcolumn="sort");
              echo json_encode($result,JSON_NUMERIC_CHECK);
              break;
          case strtoupper('sort'):
              $result['bok']=$o->sort(getFromArray($_REQUEST,'arr'),getfromarray($_REQUEST,'prefix'));
              if(!$result['bok']){
                  $result['error']=$o->GetError();
              }else{
                //$o->getEntries()
              }
              echo json_encode($result,JSON_NUMERIC_CHECK);
              break;
          case strtoupper('pdf'):
              mylog("case pdf",$echo);
              $logincheck=true;
              //if(true){
              if($logincheck and gbnull(getfromarray($_SESSION,'userID'))){
                    $_SESSION['backurl']="http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
                    header("Location:".str_repeat('../',$GLOBALS['script_depth']).$GLOBALS['domain_url_login']);
                    exit;
              }
              $myclause='';
              if(isset($_REQUEST['keyvalue'])){
                  if(isset($datadefinitions[$datadefID]['masterdata']['sql_derived'])){
                      $myclause=$o->key.'='."'".$o->db->real_escape_string($_REQUEST['keyvalue'])."'";
                  }else{
                      $myclause=$o->table.'.'.$o->key.'='."'".$o->db->real_escape_string($_REQUEST['keyvalue'])."'";
                  }
              }else{
                  $myclause=getFromArray($_REQUEST,'clause'); // !!!!
              }
              
              $jsonfile=getFromArray($_REQUEST,'jsonfile');
              $dest=getFromArray($_REQUEST,'dest','I');
              $filename=getFromArray($_REQUEST,'filename');
              $result['bok']=$o->bPreparePDF($jsonfile,$myclause,$dest,$filename);
              if(!$result['bok']){
                  $result['error']=$o->GetError();
                  echo $o->GetError().'<br>';
              }
              //echo json_encode($result,JSON_NUMERIC_CHECK);
              break;
          case strtoupper('email'):
              $result['bok']=false;
              $result['error']='';
              $logincheck=true;
              //if(true){
              if($logincheck and gbnull(getfromarray($_SESSION,'userID'))){
                    $_SESSION['backurl']="http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
                    header("Location:".str_repeat('../',$GLOBALS['script_depth']).$GLOBALS['domain_url_login']);
                    exit;
              }
              
              $myclause='';
              if(isset($_REQUEST['keyvalue'])){
                  if(isset($datadefinitions[$datadefID]['masterdata']['sql_derived'])){
                      $myclause=$o->key.'='."'".$o->db->real_escape_string($_REQUEST['keyvalue'])."'";
                  }else{
                      $myclause=$o->table.'.'.$o->key.'='."'".$o->db->real_escape_string($_REQUEST['keyvalue'])."'";
                  }
              }else{
                  //$myclause=getFromArray($_REQUEST,'clause'); // !!!!
              }
              $options['clause']=$myclause;
              $options['jsonfile']=getFromArray($_REQUEST,'jsonfile');
              $options['from']=getFromArray($_REQUEST,'from');
              $options['to']=getFromArray($_REQUEST,'to');
              $options['cc']=getFromArray($_REQUEST,'cc');
              $options['bcc']=getFromArray($_REQUEST,'bcc');
              $options['subject']=getFromArray($_REQUEST,'subject');
              $options['message']=getFromArray($_REQUEST,'message');
              
              if(gbnull($to) or gbnull($jsonfile) or gbnull($myclause)){
                  $result['error']='parameter not valid!';
              }else{
                //$dest=getFromArray($_REQUEST,'dest','I');
                //$filename=getFromArray($_REQUEST,'filename');
                //$result['bok']=$o->bPreparePDF($jsonfile,$myclause,$dest,$filename);
                
                $result['bok']=$o->bSendEmail($options);
                if(!$result['bok']){
                    $result['error']=$o->GetError();
                }
              }
              echo json_encode($result,JSON_NUMERIC_CHECK);
              break;
          case strtoupper('importfields'):
              $importcolumarr=[];
              foreach($o->colobject as $k=>$v){
                if(isset($o->datadefinition->importfields_substract)){
                }
                $importcolumarr[]=$k;
              }
              echo implode(";",$importcolumarr);
              break;
          case strtoupper('import'):
              if(isset($_REQUEST['data'])){
                $bok=true;
                $error="";
                $prot=array();
                
                $decimalseparator=getFromArray($_REQUEST,'decimalseparator','.');
                $delimiter=getFromArray($_REQUEST,'delimiter',';');
                $default=getFromArray($_REQUEST,'default',';');
                $data=parse_csv($_REQUEST['data'],$delimiter);
                //$csv='"componentnumber";"text1";"price"'.chr(0x0D).'"4711";"Hundehalsband";57,40';
                //$data=parse_csv($csv,";");
                $arrconst=[];
                if(!gbnull($default)){
                    if($o->bload($default)){
                        $arrconst=$o->dat;
                        $arrconst[$o->key]=0;
                    }else{
                        $bok=false;
                        $result['error']="default not loaded!";
                    }
                }
                if($bok){
                    mylog($data,2); //$echo

                    $count=glimportCSVdata($o,$data,$arrconst,$decimalseparator,$error,$prot);
                    $result['error']=$error;
                    $result['protocol']=$prot;
                    $result['bok']=gbnull($error);
                    //$result['protocol'][0]=array("key"=>"4711","status"=>'ok',"message"=>"imported");
                }else{
                     //$result['error']='no data!';
                }
              }
              echo json_encode($result,JSON_NUMERIC_CHECK);
              break;
          case strtoupper('ping'):
              echo json_encode(array("bok"=>true),JSON_NUMERIC_CHECK);
              break;
            
          // deprecated functions
          case strtoupper('getR'); 
          case strtoupper('getRecords'); 
          case strtoupper('List'); 
              $clause=getFromArray($_REQUEST,'clause');
              if(!gbnull($clause))$clause="(".$clause.')';
              $tabledata=$o->getentries($clause);
              //echo json_encode($tabledata,JSON_NUMERIC_CHECK);
              echo json_encode($tabledata);
              
              break;
          case strtoupper('Init'):
              $tabledata=$o->init();
              //echo json_encode($tabledata,JSON_NUMERIC_CHECK);
              echo json_encode($tabledata);
              break;
              
          default:
              $result['bok']=0;
              $result['error']='process_action '.getfromarray($_REQUEST,"process_action").' not valid!';
              mylog($result['error'],$echo);
              //var_dump($_REQUEST);
              echo json_encode($result,JSON_NUMERIC_CHECK);
      }
  }else{
      $result['bok']=false;
      $result['error']="datadefinition ".$datadefID." not succesful!";    
      echo json_encode($result,JSON_NUMERIC_CHECK);
  }
}

function CreateClause($columns,$field,$filtertype,$filtervalue){
  GLOBAL $echo;
  $clause="";
  if(is_string($filtervalue)){
    $bfilter_in_value=false;
    if(substr($filtervalue,0,2)==='>='){
        $filtertype='>=';
        //$filtervalue=substr($filtervalue,-strlen($filtervalue)+2);
        $bfilter_in_value=true;
    }elseif(substr($filtervalue,0,2)==='<='){
        $filtertype='<=';
        //$filtervalue=substr($filtervalue,-strlen($filtervalue)+2);
        $bfilter_in_value=true;
    }elseif(substr($filtervalue,0,2)==='!=' or substr($filtervalue,0,2)==='<>'){
        $filtertype='!=';
        //$filtervalue=substr($filtervalue,-strlen($filtervalue)+2);
        $bfilter_in_value=true;
    }elseif(substr($filtervalue,0,1)==='>'){
        $filtertype='>';
        //$filtervalue=substr($filtervalue,-strlen($filtervalue)+1);
        $bfilter_in_value=true;
    }elseif(substr($filtervalue,0,1)==='<'){
        $filtertype='<';
        //$filtervalue=substr($filtervalue,-strlen($filtervalue)+1);
        $bfilter_in_value=true;
    }elseif(substr($filtervalue,0,1)==='='){
        $filtertype='=';
        //$filtervalue=substr($filtervalue,-strlen($filtervalue)+1);
        $bfilter_in_value=true;
    }elseif(substr($filtervalue,0,1)==='&'){
        $filtertype='&';
        //$filtervalue=substr($filtervalue,-strlen($filtervalue)+1);
        $bfilter_in_value=true;
    }
    //if(!gbnull($filtertype) and $filtertype<>'like'){
    if($bfilter_in_value){
      mylog("filtervalue=".$filtervalue,$echo);
      if(strlen($filtervalue)>strlen($filtertype)){
          $filtervalue=substr($filtervalue,-strlen($filtervalue)+strlen($filtertype));
      }else{
          $filtervalue="";
      }
    }
  }else{
      //echo "nostring<br>";
  }
  $searchtype='VARCHAR';
  if(isset($columns[$field])){
    $searchtype=searchtype($columns[$field]['mytype']);
  }else{
    mylog($field." not in columns!",$echo);
  }
  mylog('$searchtype='.$searchtype,$echo);
  mylog('$filtertype='.$filtertype,$echo);
  mylog('$filtervalue='.$filtervalue,$echo);
  if($searchtype=='NUMBER'){
    if($GLOBALS['generalformat']==1){
      $filtervalue=str_replace($GLOBALS['decimal_point'],'.',$filtervalue);
    }
  }
  mylog(array("value"=>$filtervalue),$echo);
  if($searchtype=='DATE' or $searchtype=='DATETIME'){
      if($filtertype=='like')$filtertype='=';
      $value=$filtervalue;
      //echo '$value='.$value.'<br>';
      $_SESSION['frontend_date']=true;
      if(isset($_SESSION['tabulatordatetimeformat'])){
        mylog(array("datetime value"=>$value),$echo);
        $mydate=new luxondatetime($searchtype,$GLOBALS['tabulatordatetimeformat'],$value);
        if($searchtype=='DATETIME' and $mydate->isDateTime()){
          $temp=$field.$filtertype."STR_TO_DATE('".$mydate->isodatetime()."','%Y-%m-%d %H:%i:%s')";
        }elseif($mydate->isDate()){
          $temp="DATE(".$field.')'.$filtertype."STR_TO_DATE('".$mydate->isodate()."','%Y-%m-%d')";
        }else{
          mylog(array("error"=>$mydate->getError()),$echo);
          $temp=$field.$filtertype."'".$filtervalue."'";
        }
      }else if(isdate($value)){
        mylog("2",$echo);
        if(substr($value,4,1)=='-'){
            $format="%Y-%m-%d";
        }elseif(getfromarray($_SESSION,"generalformat",0)==0){
            $format="%m/%d/%Y";
        }else{
            $format="%d.%m.%Y";
        }
        $temp="DATE(".$field.')'.$filtertype."STR_TO_DATE('$value','$format')";
      }else{
        mylog("3",$echo);
        $temp=$field.$filtertype."'".$filtervalue."'";
      }
      $clause=gsclauseand($clause,'('.$temp.')');
  }elseif($searchtype=='TIME'){
      if($filtertype=='like')$filtertype='=';
      $value=$filtervalue;
      //echo '$value='.$value.'<br>';
      $mydate=new luxondatetime($searchtype,$GLOBALS['tabulatordatetimeformat'],$value);
      if($mydate->isTime()){
        $temp="TIME(".$field.')'.$filtertype."STR_TO_DATE('".$mydate->isotime()."','%H:%i:%s')";
      }else{
        mylog(array("error"=>$mydate->getError()),$echo);
        $temp=$field.$filtertype."'".$filtervalue."'";
      }
      $clause=gsclauseand($clause,'('.$temp.')');
  }elseif($searchtype=='EXPRESSION'){
      $clause=gsclauseand($clause,'('.$filtervalue.')');
  }else if($filtertype==='like'){
      $value="'%".$filtervalue."%'";
      $clause=gsclauseand($clause,'('.$field.' like '.$value.')');
  }elseif(instr(',>=,<=,>,<,=,!=,<>,&,',','.$filtertype.',')>-1){
      //echo "filter['type']=".$filtertype.'<br>';
      $temp='';
      /*
      if($searchtype=='BOOLEAN'){
          $temp=$field."=".$filtervalue;
      }else if($searchtype=='NUMBER' and is_numeric($filtervalue)){
          $temp=$field.$filtertype.$filtervalue;
       */
      if(($searchtype=='NUMBER' or $searchtype=='BOOLEAN')){
          if(is_bool($filtervalue)){
            $value=(int)$filtervalue;
            $temp=$field.$filtertype.$value;
          }else if($filtervalue=="true"){
            $temp=$field.$filtertype.'1';
          }else if($filtervalue=="false"){
            $temp=$field.$filtertype.'0';
          }else if(is_numeric($filtervalue)){
            $temp=$field.$filtertype.$filtervalue;
          }else{
            $temp=$field.$filtertype."'".$filtervalue."'";
          }
      }else{
          $value=$filtervalue;
          $value="'".$filtervalue."'";
          $temp=$field.$filtertype.$value;
      }
      $clause=gsclauseand($clause,'('.$temp.')');
  }
  return $clause;  
}