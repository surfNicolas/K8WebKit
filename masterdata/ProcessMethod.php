<?php // 2021-06-19 Copyright Klaus Eisert
$echo=0;
$GLOBALS['script_depth']=1;
GLOBAL $datadefinitions;
session_start();
include "_init.php";
include("BasicFunctions.php");
$input=json_decode(file_get_contents('php://input'),true);
if(is_array($input))$_REQUEST=array_merge($_REQUEST,$input);
mylog(array("PHP_SELF"=>$_SERVER['PHP_SELF'],'$_REQUEST'=>$_REQUEST),$echo);

$dbclass=new dbclass();
if(!isset($GLOBALS['k8db'])){
  mylog("no database connection",$echo);
  exit();
}
$GLOBALS['l']=new languagesupport(getfromarray($_SESSION,'domain_languageID',$GLOBALS['domain_languageID']),$GLOBALS['domain_langmodul']);

//mylog('PROCESSDATA ,datadefID='.getfromarray($_REQUEST,'datadefID').' ,process_action='.getfromarray($_REQUEST,'process_action'),$echo);

$result['bok']=false;
switch(strtoupper(getfromarray($_REQUEST,"process_action"))){
    case strtoupper('cookierequest'):
      setcookie("cookiemode",getfromarray($_REQUEST,"cookiemode",3),time()+(3600*24*365),"/");
      echo json_encode(array("bok"=>true),JSON_NUMERIC_CHECK);
      break;
    case strtoupper('setdatestring'):
        $_SESSION['tabulatordateformat']=$_REQUEST['tabulatordateformat'];
        $_SESSION['tabulatortimeformat']=$_REQUEST['tabulatortimeformat'];
        $_SESSION['tabulatordatetimeformat']=$_REQUEST['tabulatordatetimeformat'];
        $_SESSION['thousands_sep']=$_REQUEST['thousands_sep'];
        $_SESSION['decimal_point']=$_REQUEST['decimal_point'];
        $GLOBALS['tabulatordateformat']=$_SESSION['tabulatordateformat'];
        $GLOBALS['tabulatortimeformat']=$_SESSION['tabulatortimeformat'];
        $GLOBALS['tabulatordatetimeformat']=$_SESSION['tabulatordatetimeformat'];
        $GLOBALS['thousands_sep']=$_SESSION['thousands_sep'];
        $GLOBALS['decimal_point']=$_SESSION['decimal_point'];
        echo json_encode(array("bok"=>true),JSON_NUMERIC_CHECK);
        break;
    case strtoupper('logout'):
        logout();
        echo json_encode(array("bok"=>true),JSON_NUMERIC_CHECK);
        break;
    case strtoupper('sendActivation'):
        $formmode=0;
        $result['bok']=gbSendActivation($_REQUEST,$result['error'],$result['message']);
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('sendEmail'):
        // to
        // cc
        // bcc
        // subject
        // message
        // attachments
        $error="";
        $result['bok']=gbsendEmail($REQUEST,$error);
        if(!$result['bok'])$result['error']=$error;
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('sendPwd'):
        $formmode=0;
        $result['bok']=gbSendPwd($_REQUEST,$result['error'],$result['message'],$formmode);
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('setdeleted'):
        // only for current user
        $userID=getFromArray($_SESSION,"userID");
        if(!gbnull($userID)){
          $dbclass=new dbclass();
          $dbclass->db->query("UPDATE k8login SET active=3 WHERE userID=".$userID);
          $result['bok']=true;
        }
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('sendContact'):
        $formmode=0;
        $result['bok']=gbSendContact($_REQUEST,$result['error'],$result['message']);
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('checkusername'):
        $dbclass=new dbclass();
        $username=getFromArray($_REQUEST,'username');
        if(!gbnull($username)){
          $result['bok']=!$dbclass->bexist("k8login","username=".gsstr2sql($username));
        }
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('checkuniqueemail'):
        $email=getFromArray($_REQUEST,'email');
        if(gbnull($email) or $email==$GLOBALS["domain_testemail"]){
          $result['bok']=true;
        }else{
          $dbclass=new dbclass();
          $userID=getFromArray($_REQUEST,'userID',getFromArray($_SESSION,"userID",0));
          $result['bok']=!$dbclass->bexist("k8login","userID<>$userID and email=".gsstr2sql($email));
        }
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('changePassword'):
        //$dbclass=new dbclass();
        $oldpassword=getFromArray($_REQUEST,"oldpassword");
        $newpassword=getFromArray($_REQUEST,"newpassword");
        $confirmedpassword=getFromArray($_REQUEST,"confirmedpassword");
        $error="";
        if(changePassword($oldpassword,$newpassword,$confirmedpassword,$error)){
          $result['bok']=true;
        }else{
          $result['error']=$error;
        }
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('changeIdentity'):
        //$dbclass=new dbclass();
        $name=getFromArray($_REQUEST,"username");
        $error="";
        $roles=getfromarray($_SESSION,'roles',array());
        $bok=true;
        if(gbnull($name)){
            $result['error']='no username';
            $bok=false;
        }
        if(in_array(2,$roles) and $bok){
            $_SESSION['username_origin']=$_SESSION['username'];
            $result['bok']=login($name,"",$error,0,1);
            if(!$result['bok']){
                $result['error']=$error;
            }else{
                if(getFromArray($_REQUEST,"identityadmin")){
                    $_SESSION['roles'][]=2;
                }
            }
        }else{
            $result['error']='no rights';
        }
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('getSelect'):
        $dbclass=new dbclass();
        $type=getFromArray($_REQUEST,'type','getSelectJson');
        $search=getFromArray($_REQUEST,'search');
        $result=$dbclass->GetFormMultiFrom($type,$search,$_REQUEST);
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('sortPages'):
        // load datadefinition
        include("../masterdata/_datadefinitions.php");
        $datadefID=12;
        $res=0;
        $error="";
        //getDatadefinition(&$datadefID,&$error,$masterkeyvalue="",$rightuser_create_master=0,$table='',$ret=0,$placeholders=true,$objectives=1)
        $datadefinítion=getDatadefinition($datadefID,$error,'',0,'',0,true,-1);
        //Global $datadefinitions;
        unset($datadefinitions[$datadefID]['treearrayname']);
        $o=new $datadefinitions[$datadefID]['objectclass']($datadefinitions[$datadefID]);
        $data=$o->getEntries('k8pages.parentID=0');
        
        if($data){
            $dat_prev=0;
            foreach($data as $dat){
                //echo $dat['pageID'].'/'.$dat['marking']."<br>";
                if($dat_prev){
                   // dat_prev->pageIDnex
                   $sql="update k8pages set pageIDnext=".$dat['pageID']." WHERE pageID=".$dat_prev['pageID'];
                   $res=$o->db->query($sql);
                   // actual record
                   $sql="update k8pages set pageIDprevious=".$dat_prev['pageID']." WHERE pageID=".$dat['pageID'];
                   $res=$o->db->query($sql);
                }else{
                    // im aktuellen record pageIDprev=0
                   $sql="update k8pages set pageIDprevious=0 WHERE pageID=".$dat['pageID'];
                   $res=$o->db->query($sql);
                }
                $dat_prev=$dat;
            }
            // im letzen record pageIDnext=0
            $sql="update k8pages set pageIDnext=0 WHERE pageID=".$dat['pageID'];
            $res=$o->db->query($sql);
        }
        $result['bok']=$res;
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('tinymce_images'):
        $arr=array();
        include("../masterdata/_datadefinitions.php");
        $datadefID=8;
        $error="";
        $datadefinítion=getDatadefinition($datadefID,$error);
        $ref=new $datadefinitions[$datadefID]['objectclass']($datadefinitions[$datadefID]);
        
        $clause="type='image'";
        $clause=gsclauseand($clause,'basetype='.gsstr2sql(getfromarray($_GET,'basetype','')),!gbnull(getfromarray($_GET,'basetype','')));
        $clause=gsclauseand($clause,'baseID='.gsstr2sql(getfromarray($_GET,'baseID',0)),!gbnull(getfromarray($_GET,'baseID','')));
        $clause=gsclauseand($clause,'width>height');
        //echo 'clause: '.$clause.'<br>';
        //$ref->orderby='filename';
        $struc=$ref->getentries($clause);
        if($struc){
            foreach($struc as $dat){
                $arr[]=array('title'=>$dat['filename'],'value'=>$dat['image_file']);
            }
        }
        echo json_encode($arr);
        break;
        
    case strtoupper('createPDF'):
        $result=array("bok"=>false,"error"=>"");
        require_once str_repeat('../',$GLOBALS['script_depth'])."masterdata/jsonpdf.php";
        
        $data=getFromArray($_REQUEST,"data",array());
        $data_sel=getFromArray($_REQUEST,"data_sel",array());
        
        $data_str=getFromArray($_REQUEST,"data_str");
        $data_sel_str=getFromArray($_REQUEST,"data_sel_str");
        
        $dest=getFromArray($_REQUEST,"destination","F");
        //$filename=str_repeat('../',$GLOBALS['script_depth']).getFromArray($_REQUEST,"filename","uploads/PDFtest.pdf");
        $filename=$_SERVER['DOCUMENT_ROOT']."webkit/uploads/PDFtest.pdf";
        //$filename="uploads/PDFtest.pdf";
        //$filename="PDFtest.pdf";

        if(!gbnull($data_str)){
          try{
            $data=json_decode($data_str,JSON_OBJECT_AS_ARRAY);
          }
          catch(Throwable $t) {
            $result['error']="data is not valid";
          }
        }
        if(!gbnull($data_sel_str)){
          try{
            $data_sel=json_decode($data_sel_str,JSON_OBJECT_AS_ARRAY);
          }
          catch(Throwable $t) {
            $result['error']="pdf definition is not valid";
          }
        }
        $data_sel=data_sel_extendstructure($data_sel);
        
        if(gbnull($result['error'])){
          $orientation = getFromArray($data_sel['page'],'orientation','P');
          $unit = getFromArray($data_sel['page'],'unit','mm');
          $format = getFromArray($data_sel['page'],'format','A4');
          $pdf = new jsonPDF($orientation, $unit, $format, true, 'UTF-8', false);
          //echo '$filename='.$filename.'<br>';
          if($pdf->_PrintOut($data_sel,$data,$dest,$filename)){
            $result['bok']=true;
          }else{
            $result['error']=$pdf->error;
          }
        }
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
        
    case strtoupper('LocalsToSession'):
        $_SESSION['locals']=array(
            'tabulatordatetimeformat'=>getfromArray($_REQUEST,'tabulatordatetimeformat',$GLOBALS['tabulatordatetimeformat']),
            'tabulatordateformat'=>getfromArray($_REQUEST,'tabulatordateformat',$GLOBALS['tabulatordateformat']),
            'tabulatortimeformat'=>getfromArray($_REQUEST,'tabulatortimeformat',$GLOBALS['tabulatortimeformat']),
            'decimal_point'=>getfromArray($_REQUEST,'tabulatordatetimeformat',$GLOBALS['tabulatordatetimeformat']),
            'thousands_sep'=>getfromArray($_REQUEST,'thousands_sep',$GLOBALS['thousands_sep'])                    
        );
        $result['bok']=true;
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('executeSQL'):
        $result=array("bok"=>false,"error"=>"");
        $sql=getfromArray($_REQUEST,'sql');
        if(gbnull($sql)){
          $result['error']="sql not set";
        }else{
          $result['bok']=$dbclass->db->query($sql);
          if(!$result['bok']){
            $result['error']="(" .$dbclass->db->errno.") ".$dbclass->db->error;
          }
        }
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('readtable'):
        $result=array("bok"=>true,"error"=>"");
        $table=getfromArray($_REQUEST,'table');
        if(gbnull($table)){
          $result['error']="table not set";
        }else{
          $key="";
          $data=$dbclass->ShowTable($table,$key);
          if($data){
            $result['data']=$data;
          }else{
            $result['error']="$table not exists";
            $result['bok']=false;
          }
        }
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
        
    case strtoupper('savetable'):
        $echo=0;
        $result=array("bok"=>true,"error"=>"");
        $sql="";
        $table=getfromArray($_REQUEST,'table');
        $columns=getfromArray($_REQUEST,'columns',array());
        mylog($columns,$echo);
        if(gbnull($table)){
          $result['bok']=false;
          $result['error']='no table';
        }
        if(count($columns)==0){
          $result['bok']=false;
          $result['error']='no columns';
        }
        if($result['bok']){
          $bexist=false;
          $key="";
          $data=$dbclass->ShowTable($table,$key);
          if($data){
            $result['data']=$data;
            $bexist=true;
          //}else{
          //  $result['error']="$table not exists";
          }

          $sql='';
          $key='';
          if($bexist){
            // alter statements
            mylog("$table exists",$echo);
            $lastcolumn='';
            $position='';
            foreach($columns as $column){
              $extra=getfromArray($column,'Extra');
              $extra=gbnull($extra)?'':' '.$extra;
              $size=getfromArray($column,'size');
              $datatype=getcolumntype($column['mytype'],$size);
              //mylog(Array("table"=>$table,"datatype"=>$datatype,"column"=>$column['Field']),2);
              $index=getArrayIndexfromValue($data,'Field',$column['Field']);
              if(gbnull($lastcolumn)){
                $position=' FIRST';
              }else{
                $position=" AFTER `$lastcolumn`";
              }
              $sql='';
              if($index>-1){
                // alter
                $sql.="ALTER TABLE $table MODIFY COLUMN `".$column['Field']."` $datatype NOT NULL$extra$position;".PHP_EOL;
              }else{
                // add
                $sql.="ALTER TABLE $table ADD COLUMN `".$column['Field']."` $datatype NOT NULL$extra$position;".PHP_EOL;
              }
              mylog($sql,2);
              if(gbnull($sql)){
                $result['error']="sql not set";
              }else{
                $bok=$dbclass->db->query($sql);
                if(!$bok){
                  $result['bok']=false;
                  $result['error'].="(" .$dbclass->db->errno.") ".$dbclass->db->error;
                }
              }
              $lastcolumn=$column['Field'];
            }

            // check to delete elements
            foreach($data as $column){
              $index=getArrayIndexfromValue($columns,'Field',$column['Field']);
              if($index==-1){
                $sql="ALTER TABLE $table DROP COLUMN `".$column['Field']."`".PHP_EOL;
                $bok=$dbclass->db->query($sql);
              }
            }
            // primary key

          }else{
            // create sql statement
            mylog("$table does not exist",$echo);
            $sql="CREATE TABLE $table(";
            foreach($columns as $column){
              if(strtoupper($column['Extra'])=='AUTO_INCREMENT')$key=$column['Field'];
              $datatype=getcolumntype($column['mytype'],$column['size']);
              $extra=gbnull($column['Extra'])?'':' '.$column['Extra'];
              $sql.='`'.$column['Field'].'`'." $datatype NOT NULL$extra,";
            }
            $sql.="PRIMARY KEY ($key)";
            $sql.=')';
            if(gbnull($key)){
              $result['error']='no Primary Key';
              $sql="";
            }
            //mylog($sql,2);
            if(gbnull($sql)){
              $result['error']="sql not set";
            }else{
              $result['bok']=$dbclass->db->query($sql);
              if(!$result['bok']){
                $result['bok']=false;
                $result['error'].="(" .$dbclass->db->errno.") ".$dbclass->db->error;
              }
            }
          }
        }
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('createdatadefID'):
        include("_datadefinitions.php");
        $result=array("bok"=>false,"error"=>"");
        $datadefID=getfromArray($_REQUEST,'datadefID');
        $table=getfromArray($_REQUEST,'table');
        $connector=getfromArray($_REQUEST,'connector');
        $options=array();
        $error="";
        // headtitlecolumn, headtitledescriptioncolumn
        // check values
        mylog(array('process_action'=>'createdatadefID','$_REQUEST'=>$_REQUEST),$echo);
        if(gbnull($datadefID) or gbnull($table)){
          $result['error']='datadefID and table have to be set';
        }else{
          // check rights
          $datadefIDdef="k8datadefinitions";
          $o=getDatadefinition($datadefIDdef,$result["error"],"",0,"",1,false,-1);
          if($o->getEntries('mydatadefID='.gsstr2sql($datadefID))){
            if(!$o->dat['rightuser_update']){
              $result["error"]="no rights";
            }else{
              $result['bok']=true;
              $options=$o->dat;
            }
          }else{
            $result["error"]="datadefID $datadefID doesn't exist";
          }
        }
        if($result['bok']){
          $path=str_repeat('../',$GLOBALS['script_depth']).$GLOBALS['domain_projectpath'][0];
          $file=$path.'/'.$datadefID.'/'.$datadefID.'.json';
          $bfile_exists=file_exists($file);
          //mylog(array('file'=>$file),2);
          if($bfile_exists){
            // read old
            getDatadefinition($datadefID,$result["error"],"",0,"",0,true,0);
            
            // copy old file
            $datadefIDold=$datadefID.'old';
            $mycurrentfile='../'.$GLOBALS['domain_projectpath'][0].'/'.$datadefID.'/'.$datadefID.'.json';
            $myoldfile='../'.$GLOBALS['domain_projectpath'][0].'/'.$datadefID.'/'.$datadefIDold.'.json';
            copy($mycurrentfile,$myoldfile);
            
            // build new folder
            $datadefIDnew=$datadefID.'new';
            $foldernew='../'.$GLOBALS['domain_projectpath'][0].'/'.$datadefIDnew;
            // exist folder?
            if(is_dir($foldernew)) {
              //mylog(array(),2);
            }else{
              if(!mkdir($foldernew, 0777, true)) {
                $result['error']="folder not created";
                $result['bok']=false;
              }
            }
            
            // build new datadefID
            if(gbnull($connector)){
              getDatadefinition($datadefIDnew,$result["error"],"",0,$table,0,true,3,$options);
            }else{
              if(createDatadefinition(array("table"=>$table,"datadefID"=>$datadefIDnew,"connector"=>$connector),$result["error"])){
              }
            }
            if(gbnull($result["error"]) and isset($datadefinitions[$datadefIDnew])){
              // loop new columns and build new: $columntable_arr
              $columntable_arr=array();
              foreach($datadefinitions[$datadefIDnew]['columns'] as $column_new){
                $bchangedfields=false;
                $index=getArrayIndexfromValue($datadefinitions[$datadefID]['columns'],'fieldname',$column_new['fieldname']);
                if($index==-1){ //new column
                  $columntable_arr[]=$column_new;
                }else{
                  $column_old=$datadefinitions[$datadefID]['columns'][$index];
                  if(bchangedfield($column_new,$column_old)){
                    // merge column
                    $columntable_arr[]=array_merge($column_old,$column_new);
                  }else{
                    //old column
                    $columntable_arr[]=$column_old;
                  }
                }
              }

              // tabulator columns
              $columntabulator_arr=array();
              foreach($datadefinitions[$datadefIDnew]['tabulator']['columns'] as $column_new){
                $index=getArrayIndexfromValue($datadefinitions[$datadefID]['tabulator']['columns'],'field',$column_new['field']);
                if($index==-1){ // new column
                  $columntabulator_arr[]=$column_new;
                }else{
                  $column_old=$datadefinitions[$datadefID]['tabulator']['columns'][$index];

                  if(bchangedfieldTabulator($datadefinitions[$datadefIDnew],$datadefinitions[$datadefID],$column_new['field'])){
                    $columntabulator_arr[]=$column_new;
                    //$columntabulator_arr[]=array_merge_recursive($column_old,$column_new);
                  }else{
                    $columntabulator_arr[]=$column_old;
                  }
                }
              }

              // k8form fields
              if(isset($datadefinitions[$datadefIDnew]['k8form']['fields'])){
                $columnk8form_arr=array();
                foreach($datadefinitions[$datadefIDnew]['k8form']['fields'] as $column_new){
                  $index=getArrayIndexfromValue($datadefinitions[$datadefID]['k8form']['fields'],'name',$column_new['name']);
                  if($index==-1){
                    $columnk8form_arr[]=$column_new;
                  }else{
                    $column_old=$datadefinitions[$datadefID]['k8form']['fields'][$index];
                    $value=$column_new['name'];

                    if(bchangedfieldk8form($datadefinitions[$datadefIDnew],$datadefinitions[$datadefID],$value)){
                      //mylog(array("column new changed"=>$column_new),2);
                      //does not work $columnk8form_arr[]=array_merge_recursive($column_old,$column_new);
                      $columnk8form_arr[]=$column_new;
                    }else{
                      $columnk8form_arr[]=$column_old;
                    }
                  }
                }
                $datadefinitions[$datadefID]['k8form']['fields']=$columnk8form_arr;
              }
              $datadefinitions[$datadefID]['columns']=$columntable_arr;
              $datadefinitions[$datadefID]['tabulator']['columns']=$columntabulator_arr;

              // rename and copy html files
              $path=str_repeat('../',$GLOBALS['script_depth']).$GLOBALS['domain_projectpath'][0];
              //mylog(array('file'=>$path.'/'.$foldernew),2);
              if(file_exists($path.'/'.$foldernew)){
                if ($handle = opendir($path.'/'.$foldernew)) {
                  /* This is the correct way to loop over the directory. */
                  while (false !== ($entry = readdir($handle))) {
                    if(substr($entry,0,1)!=='.'){
                      if (str_endsWith($entry,'.html')) {
                        //mylog(array("createdadefID, file"=>$path.'/'.$datadefID.'/'.$entry),2);
                        $entryorg= str_replace('new_', '_', $entry);
                        if(!file_exists($path.'/'.$datadefID.'/'.$entryorg)){
                          $from=$path.'/'.$foldernew.'/'.$entry;
                          $to=$path.'/'.$datadefID.'/'.$entryorg;
                          copy($from,$to);

                        }
                      }
                    }
                  }
                  closedir($handle);
                }else{
                  $result["bok"]=false;
                  $result["error"]='error by reading folder';
                }
              }else{
                $result["error"]='error by reading folder';
                $result["bok"]=false;
              }

              rrmdir($foldernew);
            }else{
              mylog($error,2);
            }
            
          }else{
            //mylog(array('file is new'=>true),2);
            // folder first for the html files
            $myfile='../'.$GLOBALS['domain_projectpath'][0].'/'.$datadefID;
            // exist folder?
            if(is_dir($myfile)) {
              //mylog(array(),2);
            }else{
              if(!mkdir($myfile, 0777, true)) {
                $result['error']="folder not created";
                $result['bok']=false;
              }
            }
            
            // build datendefinition
            if(gbnull($connector)){
              getDatadefinition($datadefID,$error,"",0,$table,0,true,3,$options);
            }else{
              if(createDatadefinition(array("table"=>$table,"datadefID"=>$datadefID,"connector"=>$connector), $error)){
              }
            }
          }

          if($result['bok']){
            // save datadefinition
            $myfile='../'.$GLOBALS['domain_projectpath'][0].'/'.$datadefID.'/'.$datadefID.'.json';
            $content=json_encode($datadefinitions[$datadefID], JSON_PRETTY_PRINT);
            if(true){
              $content=str_replace('    ','  ',json_encode($datadefinitions[$datadefID], JSON_PRETTY_PRINT));
            }
            $result['bok']=gbwrite_file($content, $myfile,"w");
          }
        }
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('checkDefinition'):
        $result=array("bok"=>false,"error"=>"Error not specified");

        $datadefID=getfromArray($_REQUEST,'datadefID');
        $element=getfromArray($_REQUEST,'element');
        // check
        if(gbnull($datadefID) or gbnull($element)){
          $result['error']='please add chartjs';
        }else{
          include("../masterdata/_datadefinitions.php");
          getDatadefinition($datadefID,$error,'',0, '',0,true,0);

          // check datadefID, name, table,...
          
          switch($element){
            case 'catalog':
              // check html
              $result['bok']=(isset($datadefinitions[$datadefID]['html']['catalog']['container']) and isset($datadefinitions[$datadefID]['html']['catalog']['record']) );
              if(!$result['bok']){
                $result['error']='no necessary HTML files in this definition';
              }
              break;
            case 'lineedit':
              // check html
              $result['bok']=(isset($datadefinitions[$datadefID]['html'][$element]['container']) and isset($datadefinitions[$datadefID]['html'][$element]['record']) );
              if(!$result['bok']){
                $result['error']='no necessary HTML files in this definition';
              }
              break;
            case 'treeview':
              // check table !
              
              $parentcolumn=getFromArray($datadefinitions[$datadefID],'parentcolumn');
              $treearrayname=getFromArray($datadefinitions[$datadefID],'treearrayname');
              if(gbnull($parentcolumn) or gbnull($treearrayname)){
                if(gbnull($parentcolumn)){
                  $result['error']='please add parentcolumn in datadefintion';
                }
                if(gbnull($treearrayname)){
                  $result['error']=gsclauseand($result['error'],'please add treearrayname in datadefintion',true,'<br>');
                }
              }else{
                $result['bok']=true;
              }
              break;
            case 'simpledata':
              $headtitlecolumn=getFromArray($datadefinitions[$datadefID],'headtitlecolumn');
              $result['bok']=!gbnull($headtitlecolumn);
              if(!$result['bok']){
                $result['error']='please define the head title column';
              }
              break;
              
            case 'chartjs':
              // check chartjs
              if(isset($datadefinitions[$datadefID]['head'])){
                foreach($datadefinitions[$datadefID]['head'] as $v){
                  if(instr($v,'chart.js')>=0){
                    $result['bok']=true;
                    break;
                  }
                }
              }
              if($result['bok']==false){
                $result['error']='please add chartjs';
              }
              break;
            default:
              $result['bok']=true;
              break;
          }
        }
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
        
    case strtoupper('readFolder'):
        $result=array("bok"=>true,"data"=>array());
        $folder=getfromArray($_REQUEST,'folder');
        if(gbnull($folder)){
          $result=array("bok"=>false,"error"=>"folder not set");
        }else{
          $path=str_repeat('../',$GLOBALS['script_depth']).$GLOBALS['domain_projectpath'][0];
          //mylog(array('file'=>$path.'/'.$folder),2);
          if(file_exists($path.'/'.$folder)){
            if ($handle = opendir($path.'/'.$folder)) {
              /* This is the correct way to loop over the directory. */
              while (false !== ($entry = readdir($handle))) {
                if(substr($entry,0,1)!=='.')$result['data'][]=array('folder'=>$folder,'filename'=>$entry);
              }
              closedir($handle);
            }else{
              $result["bok"]=false;
              $result["error"]='error by reading folder';
            }
          }else{
            $result["bok"]=false;
          }
        }
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('readFile'):
        $result=array("bok"=>false,"error"=>"");
        $file=getfromArray($_REQUEST,'file');
        $myfile='../'.$GLOBALS['domain_projectpath'][0].'/'.$file;
        $result['bok']=true;
        $result['file']=gsread_file($myfile);
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('saveFile'):
        $result=array("bok"=>false,"error"=>"");
        $file=getfromArray($_REQUEST,'file');
        if(instr(strtoupper($file),'.PHP')>=0){
          $result["error"]="PHP is not allowed";
        }else{
          $content=getfromArray($_REQUEST,'content');
          $myfile='../'.$GLOBALS['domain_projectpath'][0].'/'.$file;
          $result['bok']=gbwrite_file($content,$myfile,"w");
        }
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    case strtoupper('deleteFile'):
        $result=array("bok"=>false,"error"=>"");
        $file=getfromArray($_REQUEST,'file');
        $myfile='../'.$GLOBALS['domain_projectpath'][0].'/'.$file;
        $result['bok']=unlink($myfile);
        echo json_encode($result,JSON_NUMERIC_CHECK);
        break;
    default:
        $result['error']='process_action "'.getfromarray($_REQUEST,"process_action").'" not valid!';
        echo json_encode($result,JSON_NUMERIC_CHECK);
}

function getcolumntype($mytype,$size){
  // no Binary, SPATIAL, OTHERS
  $type="";
  switch($mytype){
    case 'FLOAT':
    case 'DOUBLE':
    case 'DATE':
    case 'TIME':
    case 'DATETIME':
    case 'YEAR':
    case 'TIMSTAMP':
    case 'TINYTEXT':
    case 'MEDIUMTEXT':
    case 'LONGTEXT':
    case 'TEXT':
      $type=$mytype;
      break;
    case 'DECIMAL':
    case 'CHAR':
    case 'VARCHAR':
      $type=$mytype."($size)";
      break;
    case 'BIT':
      $type=$mytype."(1)";
      break;
    case 'TINYINT':
      $type=$mytype."(4)";
      break;
    case 'SMALLINT':
      $type=$mytype."(6)";
      break;
    case 'MEDIUMINT':
      $type=$mytype."(9)";
      break;
    case 'INT':
      $type=$mytype."(11)";
      break;
    case 'BIGINT':
      $type=$mytype."(20)";
      break;
  }
  return $type;
}

function bchangedfield($column_new,$column_old){
  return $column_new['Type']!==$column_old['Type'];
}
function bchangedfieldTabulator($datadefinition_new,$datadefinition_old,$value){
  $return=false;
  $index_new=getArrayIndexfromValue($datadefinition_new['columns'],'Field',$value);
  $index_old=getArrayIndexfromValue($datadefinition_old['columns'],'Field',$value);
  if($index_new>-1 and $index_old>-1){
    $column_new=$datadefinition_new['columns'][$index_new];
    $column_old=$datadefinition_old['columns'][$index_old];
    $return=($column_new['Type']!==$column_old['Type'] or $column_new['size']!==$column_old['size']);
  }else{
    mylog(array("problem bchangedfieldTabulator.value"=>$value),2);
  }
  return $return;

}
function bchangedfieldk8form($datadefinition_new,$datadefinition_old,$value){
  $return=false;
  $index_new=getArrayIndexfromValue($datadefinition_new['columns'],'Field',$value);
  $index_old=getArrayIndexfromValue($datadefinition_old['columns'],'Field',$value);
  if($index_new>-1 and $index_old>-1){
    $column_new=$datadefinition_new['columns'][$index_new];
    $column_old=$datadefinition_old['columns'][$index_old];
    if($value=='mynumber'){
      mylog(array('column_old'=>$column_old),2);
      mylog(array('column_new'=>$column_new),2);
    }
    $return=($column_new['Type']!==$column_old['Type'] or $column_new['size']!==$column_old['size']);
  }else{
    mylog(array("problem bchangedfieldk8form.value"=>$value),2);
  }
  return $return;
}