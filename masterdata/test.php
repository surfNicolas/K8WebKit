<?php
session_start();
//echo "display_errors=".ini_get("display_errors").'<br>';
//$_SESSION['userID']=1;
//$_SESSION['roleID']=3;

//unset($_SESSION['userID']);
//unset($_SESSION['username']);
//unset($_SESSION['roleID']);

//masterdata/ProcessData.php?datadefID=3&process_action=ReadFilter
$GLOBALS['script_depth']=1;
//$_REQUEST['table']='';
/*
$_REQUEST['process_action']='Save';
$temp=<<<EOD
{"table":"tpprojects","process_action":"Save","projectID":"14","projectname":"Terrace","areas":[{"areaID":"","areaname":"floor","surfaces":[{"surfaceID":"","surfacename":"basic","points":[{"pointID":"","at":"1","x":"1","y":"1"},{"pointID":"","at":"2","x":"2","y":"2"}]}]}]}
EOD;
$_POST=json_decode($temp,true);
*/

include("_init.php");
include("BasicFunctions.php");
include("_datadefinitions.php");
$datadefID=getfromarray($_REQUEST,'datadefID',"tpareas");
$keyvalue=getfromarray($_REQUEST,'keyvalue',42);
$error="";
$o=getDatadefinition($datadefID,$error,"",0,"",true);
$o->error='';
$echo=1;

mylog(array('o->error='=>$o->error),$echo);

$dat=array();
if(0){
  $dbclass=new dbclass();
  $data=$dbclass->getentries("SELECT * FROM k8languages");
  echo '$data='.'<br>';
  echo '<pre>';
  print_r($data);
  echo '</pre>';
}

if(0){
    echo '<pre>';
    print_r($_SESSION);
    echo '</pre>';
}   

if(0){
  echo '$_SESSION[userID]='.getfromarray($_SESSION,'userID').'<br>';
  echo '$_SESSION[username]='.getfromarray($_SESSION,'username').'<br>';
  //echo '$_SESSION[roleID]='.getfromarray($_SESSION,'roleID').'<br>';
  if(isset($_SESSION['roles'])){
    echo '$_SESSION[roles]='.'<br>';
    echo '<pre>';
    print_r($_SESSION['roles']);
    echo '</pre>';
  }
}

//if(!gbnull($error))echo '$error='.$error.'<br>';
//mylog('script_depth='.$GLOBALS['script_depth'],$echo);
//mylog('PHP_SELF='.$_SERVER['PHP_SELF'],$echo);

if(0){
  echo 'datadefinition.datadefID='.$datadefID.'<br>';
  echo "<pre>";
  print_r($datadefinitions[$datadefID]);
  //print_r($datadefinitions[$datadefID]['masterdata']);
  print_r($datadefinitions[$datadefID]);
  echo "</pre>";
}

/*
echo 'datadefinition.masterdata.rights'.'<br>';
echo "<pre>";
print_r($o->permit);
echo "</pre>";
*/

//echo maskformat('######',1).'<br>';
//echo maskformat('*****',1).'<br>';


if($o){
    /* --------- lesen */
    //$clause="accountID=1";
    //$clause="docID=280";

    if(0){
      $clause="";
      if($o->bload($keyvalue)){
        $dat=$o->data[0];
        echo json_encode($dat);
      }elseif(!gbnull($o->GetError())){
        echo $o->GetError().'<br>';
      }
    }

    if(1){
      $clause="";
      if(!gbnull($keyvalue))$clause=$datadefinitions[$datadefID]['key']."=".gsstr2sql($keyvalue);
      echo '$clause='.$clause.'<br>';
      $tabledata=$o->getentries($clause);
      if($tabledata){
        $dat=$tabledata[0];
        echo '<pre>';
        print_r($tabledata);
        echo '</pre>';
      }elseif(!gbnull($o->GetError())){
        echo $o->GetError().'<br>';
      }  
    }

    if(0){
        unset($dat['areas'][0]['surfaces'][0]);
    }
    
    if(0){
        echo '<pre>';
        print_r($dat);
        echo '</pre>';
    }
    if(0){
        $error="";
        $datadefID=30;
        $datadefinitions[$datadefID]=getDatadefinition($datadefID,$error);
        $datadefID=129;
        $datadefinitions[$datadefID]=getDatadefinition($datadefID,$error);
        echo '<pre>';
        var_dump($o->bsetitem(1,78));
        echo '</pre>';
    }
    
    if(0){
      $clause="";
      if($o->bPreparePDF('masterdata/pdf_invoice.json','docID=3','I')){
        //?
      }elseif(!gbnull($o->GetError())){
        echo $o->GetError().'<br>';
      }  
    }

    if(0){
        $temp='11';
        $number='';
        $dat_company=getFromArray($_SESSION,'dat_company',array());
        $format=$dat_company['itemnoformat'];
        $clause="companyID=".$_SESSION['companyID'];
        $clause=gsclauseand($clause,'componentnumber like '.gsstr2sql($temp.'%'));
        
        //$colnumber,$clause,$default,$format="####",$increment=1
        
        $default=$o->nextNumber('componentnumber',$clause,1,$format,1);
        echo '$default='.$default.'<br>';
        if(!gbnull($format) and !gbnull($default)){
            $number=maskformat($format,$default);
        }
        
        echo '$number='.$number.'<br>';
    }
    
    if(0){
      $keyvalue=3;
      if($o->delete($keyvalue)){
        echo $keyvalue.' deleted!<br>';
      }else{
        echo $o->GetError();
      }
   }
/*    
$temp=<<<EOD
{"itemID":"","position":"","componentID":"","componentnumber":"","text1":"","quantity":"","salesunit":"","pricesingle":"","pricetotal":""}
EOD;
$structure=json_decode($temp,true);
//$dat['items'][]=$structure;
$dat['ARRAY_NAME'][]=$structure;
*/
 
    /*
    echo "$dat:<br>"
    echo "<pre>";
    print_r($dat);
    echo "</pre>";
    //$dat['items'][0]['text1']="Test Gupta";
    //unset($dat['items'][1]);
    */

    /*
    echo "<pre>";
    print_r($o->colobject);
    echo "</pre>";
    */

if(0){
$temp=<<<EOD
{"userID":1,"friendID":4}
EOD;
$dat=json_decode($temp,true);
}
if(0){
$temp=<<<EOD
{"userID":0,"username":"Nicolas","password":"Nicolas"}
EOD;
$dat=json_decode($temp,true);
}
if(0){
$temp=<<<EOD
{"basetype":"k8references","baseID":1,"type":"image"}
EOD;
$dat=json_decode($temp,true);
}
    if(0){
    $dat=json_decode('{"projectname":"BBBBB"}',true);
    }

    if(0){
        echo "dat:<br>";
        echo "<pre>";
        print_r($dat);
        echo "</pre>";
    }
    if(0){
      if($o->bload($keyvalue)){
        $dat=$o->data[0];
      }elseif(!gbnull($o->GetError())){
        echo $o->GetError().'<br>';
      }  
    }
    if(0){
        echo "dat:<br>";
        echo "<pre>";
        print_r($dat);
        echo "</pre>";
    }
    if(0){
        $dat['items'][0]['servicetimes'][0]=array();
    }    
    if(0){
        //$dat['items'][0]['servicetimes'][0]=array("timefrom"=>"10:00","description"=>"test","duration"=>60);
        $_REQUEST['bshosql']=1;
        //$dat=array('componentnumber'=>"1234aa","text1"=>"test","salesunit"=>1,"vatclass"=>1);
        $dat=array('username'=>"1234aa","email"=>"eisert.klaus@gmail.com","password"=>"");
        if($o->bvalidate($dat)){
            if(1){
                echo 'bvalidate ok '.'<br>';
                echo "<pre>";
                print_r($o->postfields);
                echo "</pre>";
            }
            $result['bok']=$o->save();
            if(!$result['bok']){
                $result['error']=$o->GetError();
            }
            if($echo)echo 'save='.$result['bok'].'<br>';
        }else{
            //if($echo)echo 'bvalidate failed! '.'<br>';
            //$result['bok']=0;
            $result['error']=$o->GetError();
        }
        echo json_encode($result);
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <div id="test"></div>
<script>  
  if(0){
    var o=<?php echo json_encode($datadefinitions[$datadefID]);?>;
    console.log(o.js_rec_container.main);
    document.getElementById('test').innerHTML=o.js_rec_container.main;
  }
</script>  
</body>
</html>