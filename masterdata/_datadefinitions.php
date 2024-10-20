<?php //2021-08-25 Copyright Klaus Eisert

function createDatadefinition($options,&$error){
  Global $datadefinitions;
  $echo=0;  // 1:echo, 2:Log.txt
  $result=0;
  $error="";
          
  $datadefID=getfromArray($options,'datadefID');
  $table=getfromArray($options,'table');
  $connector=getfromArray($options,'connector');
  
  $connectortype="";
  if(gbnull($datadefID) or gbnull($table) or gbnull($connector)){
    $error="check options";
    goto createDatadefinition_ende;
  }
  if(isset($GLOBALS['domain_connectors'][$connector])){
    // check type
    $connectortype=getfromArray($GLOBALS['domain_connectors'][$connector],'type');
    if($connectortype<>"sqlsrv"){
      $error="connector.type=$connectortype is not valid";
      goto createDatadefinition_ende;
    }
  }else{
    $error="check options";
    goto createDatadefinition_ende;
  }
  
  // connector
  $parameter= getFromArray($GLOBALS['domain_connectors'][$connector],'parameter');
  $connectionInfo = array( "Database"=>$parameter['database'], "UID"=>$parameter['username'], "PWD"=>$parameter['password']);
  $conn = sqlsrv_connect( $parameter['server'], $connectionInfo);
  if( $conn ) {
    //echo "Conexión establecida.<br />";
  }else{
    $error=sqlsrv_errors();
    goto createDatadefinition_ende;
  }
  
  // main
  $datadefinitions[$datadefID]=array();
  $datadefinitions[$datadefID]['datadefID']=$datadefID;
  $datadefinitions[$datadefID]['table']=$table;
  $datadefinitions[$datadefID]['name']=$table;
  $datadefinitions[$datadefID]['revision']=2;
  $datadefinitions[$datadefID]['objectclass']="sqlsrv_accessclass";
  $datadefinitions[$datadefID]['requiredfile']="masterdata/class_data_sqlsrv.php";
  $datadefinitions[$datadefID]['connector']=array(
      "name"=>$connector,
      "type"=>$GLOBALS['domain_connectors'][$connector]['type']
  );
  $datadefinitions[$datadefID]['key']="";
  $datadefinitions[$datadefID]['keys']=array();

  // keys
  $keys=sqlsrvGetKeys($conn,$table,$error);
  if(count($keys)==0){
    goto createDatadefinition_ende;
  }else{
    $datadefinitions[$datadefID]['keys']=$keys;
    $datadefinitions[$datadefID]['key']=$keys[0];
  }
  
  // columns
  $datadefinitions[$datadefID]['columns']=array();
  $columns=getTableColumns($conn,$table,$keys);
  if($columns){
    $datadefinitions[$datadefID]['columns']=$columns;

    // masterdata
    $file='masterdata/ProcessData.php';
    $datadefinitions[$datadefID]['masterdata']=array();
    $datadefinitions[$datadefID]['masterdata']['url_new']=$GLOBALS['domain_indexfile']."?page=form&datadefID=$datadefID&process_action=New&page_mode=2";
    $datadefinitions[$datadefID]['masterdata']['url_edit']=$GLOBALS['domain_indexfile']."?page=form&datadefID=$datadefID&process_action=Edit&page_mode=2";
    $datadefinitions[$datadefID]['masterdata']['url_detail']=$GLOBALS['domain_indexfile']."?page=detail&datadefID=$datadefID";
    $datadefinitions[$datadefID]['masterdata']['url_load']=$file."?datadefID=$datadefID&process_action=Load";
    $datadefinitions[$datadefID]['masterdata']['url_save']=$file."?datadefID=$datadefID&process_action=Save";
    $datadefinitions[$datadefID]['masterdata']['url_del'] =$file."?datadefID=$datadefID&process_action=Del";
    $datadefinitions[$datadefID]['masterdata']['url_readfilter']=$file;
    $datadefinitions[$datadefID]['masterdata']['data_readfilter']=array('datadefID'=>$datadefID,'process_action'=>"ReadFilter");

    
    // tabulator
    $datadefinitions[$datadefID]['tabulator']=array();
    //$datadefinitions[$datadefID]['tabulator']['selectable']=true;
    $datadefinitions[$datadefID]['tabulator']['columns']=table2tabulator($datadefinitions[$datadefID]['columns'],true);

    // k8form
    $datadefinitions[$datadefID]['k8form']=array();
    $datadefinitions[$datadefID]['k8form']['selector']=".js_dataform";
    $datadefinitions[$datadefID]['k8form']['templatetype']="masterform";
    $datadefinitions[$datadefID]['k8form']['fields']=table2k8form($datadefinitions[$datadefID]['columns']);
    
    $result=1;
  }
  sqlsrv_close($conn);
 
createDatadefinition_ende:  
  return $result;
}

function sqlsrvGetKeys($conn,$table,&$error){
  $keys=array();
  $sql="SELECT ColumnName = col.name ".
    "FROM sys.indexes ind INNER JOIN sys.index_columns ic ON  ind.object_id = ic.object_id and ind.index_id = ic.index_id INNER JOIN sys.columns col ON ic.object_id = col.object_id and ic.column_id = col.column_id INNER JOIN sys.tables t ON ind.object_id = t.object_id ".
    "WHERE is_primary_key=1 and t.name='$table' ".
    "ORDER BY t.name, ind.name, ic.key_ordinal";
  $stmt = sqlsrv_query( $conn, $sql);
  if($stmt===false){
     $error=sqlsrv_errors();
  }
  while( $row = sqlsrv_fetch_array($stmt,SQLSRV_FETCH_ASSOC)) {
    $keys[]=$row['ColumnName'];
  }
  return $keys;
}

function getTableColumns($conn,$table,$keys){
    $columns=array();
    $key=getfromArray($keys,0);
    $sql = "SELECT * FROM $table WHERE 1=2";
    $stmt = sqlsrv_prepare( $conn, $sql );
    if($stmt){
      foreach( sqlsrv_field_metadata( $stmt ) as $fieldMetadata ) {
        $column=array();
        $column['Field']=$fieldMetadata['Name'];
        $column['Type']=$fieldMetadata['Type'];
        $column['Null']=iif($fieldMetadata['Nullable']==1,"YES","NO");
        $column['Key']="";
        $column['size']=0;
        if($column['Field']==$key)$column['Key']="PRI";
        $fieldMetadata['Default']="";
        $column['mytype']="VARCHAR";
        if($column['Type']==3){
          $column['mytype']="DECIMAL";
        }else if($column['Type']==4){
          $column['mytype']="INT";
        }else if($column['Type']==5){
          $column['mytype']="INT";
        }else if($column['Type']==12){
          if($fieldMetadata['Size']==0){
            $column['mytype']="TEXT";
          }else{
            $column['size']=$fieldMetadata['Size'];
          }
        }else if($column['Type']==93){
            $column['mytype']="DATE";
        }
        $column['fieldname']=$fieldMetadata['Name'];
        $columns[]=$column;
      }
    }
    return $columns;
}

function getDatadefinition(&$datadefID,&$error,$masterkeyvalue="",$rightuser_create_master=0,$table='',$ret=0,$placeholders=true,$objectives=1,$options=array()){
  // &$datadefID
  // $masterkeyvalue=""
  // $rightuser_create_master=0
  // $table=''
  // $ret=0
  // $placeholders (with placeholder)
  // $objectives: -1=backend, 0=all, 1=frontend(default), 2=all,no html, 3=generate HTML
  // return
  //   0: error occured
  //   $ret=0: datadefinition
  //       =1: data_access_class
  // 
  // if you add a table, the definitions is always generated new by the table
  $nogenerate=gbnull($table); // only generate, if table declared
  //if(!$nogenerate)
  
  Global $datadefinitions;
  $echo=0;  // 1:echo, 2:Log.txt
  //$nogenerate=false;
  //$error='';
  $bloadhtml=1; // load htmlfiles (k8form, catalog, detail, masterdata and adds it in the datadefinition
  $o=0;
  $datadefID_default=$datadefID;
    
  mylog(array('function'=>'getDatadefinition','datadefID'=>$datadefID,'table'=>$table,'ret'=>$ret,'placeholders'=>$placeholders,'objectives'=>$objectives),$echo);
  mylog($_REQUEST,$echo);
    
  $dbclass=new dbclass();
  if(!gbnull($dbclass->error)){
      $error=$dbclass->error;
      if($datadefID<>1){
          goto end;
      }
  }
  if($objectives==-1 or $objectives==2 or $objectives==3)$bloadhtml=0;
  if($objectives==3){
    $bloadhtml=0;
  }
  //mylog(array('function'=>'getDatadefinition','datadefID'=>$datadefID,'table'=>$table,'ret'=>$ret,'bloadhtml'=>$bloadhtml,'placeholders'=>$placeholders,'objectives'=>$objectives),2);
  
  // $datadefID
  // $datadefmode

  // ----------------------------- datadefinitions  --------------------------------------
  // placeholder in datadefinition
  // GLOBALS_decimal_point
  // GLOBALS_thousands_sep
  // GLOBALS_tabulatordateformat 
  // GLOBALS_tabulator_datetime_fp
  $ph_datadef["GLOBALS_decimal_point"]=$GLOBALS['decimal_point'];
  $ph_datadef["GLOBALS_thousands_sep"]=$GLOBALS['thousands_sep'];
  $ph_datadef["GLOBALS_tabulatordateformat"]=$GLOBALS['tabulatordateformat'];
  $ph_datadef["GLOBALS_tabulatortimeformat"]=$GLOBALS['tabulatortimeformat'];
  $ph_datadef["GLOBALS_tabulatordatetimeformat"]=$GLOBALS['tabulatordatetimeformat'];

  if(gbnull($table)){
    if(isset($datadefID) and !is_numeric($datadefID)){
      if(false){
      //if(substring($datadefID,0,1)=='_'){
        //$dbclass->getentries($sql)
        //$datadefinitions[$datadefID]
      }else{

        $path_array=array();
        if(is_array($GLOBALS['domain_projectpath'])){
          $path_array=$GLOBALS['domain_projectpath'];
        }else{
          $path_array[]=$GLOBALS['domain_projectpath'];
        }
        $path_array[]="masterdata";

        foreach ($path_array as $projectpath) {
          $path=$projectpath.'/';
          $filename=str_repeat('../',$GLOBALS['script_depth']).$path.$datadefID.'/'.$datadefID.".json";
          mylog(array('path'=>$path,'$filename'=>$filename),$echo);
          if(file_exists($filename)){
            mylog('exists!',$echo);
            $temp=gsread_file($filename);
            $temp=gsReplaceFromArray($ph_datadef, $temp);
            $datadefinitions[$datadefID]=json_decode($temp,true);
            //if(isset($datadefinitions[$datadefID]))mylog(array('datadefID set='=>$datadefID),2);
            if(isset($datadefinitions[$datadefID]['html'])){
              mylog(array('datadefinition after read='=>$datadefinitions[$datadefID]['html']),$echo);
            }
            
            if(isset($datadefinitions[$datadefID]['masterdata']['generate']))$nogenerate=!$datadefinitions[$datadefID]['masterdata']['generate'];

            // html einlesen
            $datadefmode=1;
            if($datadefmode==1){  //frontend
              //$files=glob('../kitsamples/documents/*.html');
              $files=glob(str_repeat('../',$GLOBALS['script_depth']).$path.$datadefID.'/*.html');
              //echo "vor ".str_repeat('../',$GLOBALS['script_depth']).$path.$datadefID.'/*.html'."<br>";
              if(0){echo "<pre>";print_r($files);echo "</pre>";}
              if($bloadhtml){
                foreach($files as $file){
                  //echo basename($file) . " (size: " . filesize($file) . " bytes)" . "<br>";
                  $filename=explode('.',basename($file));
                  mylog(array('$filename'=>$filename[0]),$echo);
                  $arr=explode('_',$filename[0]);
                  if(count($arr)>2){
                    if($arr[1]=="masterobject"){
                      if(count($arr)>3){
                        if($arr[3]=="record"){
                          $datadefinitions[$datadefID]['js_rec_record'][$arr[2]]=gsReplaceFromArray("",gsread_file($file));
                        }else{
                          $datadefinitions[$datadefID]['k8form']['html'][$arr[2].'_'.$arr[3]]=gsReplaceFromArray("",gsread_file($file));
                        }
                      }else{
                        // deprecated
                        $datadefinitions[$datadefID]['k8form']['html'][$arr[2]]=gsReplaceFromArray("",gsread_file($file));
                      }                  
                    }else if($arr[1]=="k8form"){
                      if(count($arr)>3){
                        $datadefinitions[$datadefID]['k8form']['html'][$arr[2].'_'.$arr[3]]=gsReplaceFromArray("",gsread_file($file));
                      }else{
                        $datadefinitions[$datadefID]['k8form']['html'][$arr[2]]=gsReplaceFromArray("",gsread_file($file));
                      }
                    }else{
                      //mylog(array('$filename'=>$filename[0],"datadefID"=>$datadefID),$echo);
                      $datadefinitions[$datadefID]['html'][$arr[1]][$arr[2]]=gsReplaceFromArray("",gsread_file($file));
                    }
                  }else{
                    // error by filename
                  }
                }
              }
              // k8form in frontend

            }
            break;
          }else{
            mylog('doesnot exist!',$echo);
          }
        }
      }
      if(isset($datadefinitions[$datadefID]['html'])){
        //mylog(array('datadefinition after file='=>$datadefinitions[$datadefID]['html']),$echo);
      }
    }else{
      //mylog(array('datadefID still numeric'=>$datadefID),2);
      switch($datadefID){
      case 0:  
        // ----------------------------- datadefID=0  --------------------------------------
        /*
        $datadefinitions[0]=array(
            "name"=>"Master Data",
            "table"=>"",
            "key"=>"ID",
            "objectclass"=>"data_session",
            "requiredfile"=>"masterdata/class_data_session.php");
        break;
         */
      case 1:  
        // ----------------------------- datadefID=1  --------------------------------------
  $temp=<<<EOD
  {
    "name":"Persons List",
    "table":"",
    "key":"ID",
    "objectclass":"data_session",
    "requiredfile":"masterdata/class_data_session.php",
    "rightcheck":false,
    "headtitle":"Persons",
    "headdescription":"The master data form is created with tabulator and K8 Form. It allows the to filter the records and supports the CRUD functionality.",
    "masterdata":{      
      "edittype":8,
      "formmode":3,
      "menuleft_options":true,
      "url_del":"masterdata/ProcessData.php?process_action=Delete&datadefID=1",
      "url_save":"masterdata/ProcessData.php?process_action=Save&datadefID=1",
      "url_readfilter":"masterdata/ProcessData.php",
      "data_readfilter":{"datadefID":1,"process_action":"ReadFilter"}
    },
    "tabulator":{
    }
  }
  EOD;
        /*
    "tabulator":{
      "selectable":true
    }
         */
        
  $datadefinitions[1]=json_decode($temp,true);

        // -------------- columns
        $datadefinitions[1]['columns'][]=array('fieldname'=>'ID','mytype'=>'int(10)','fieldtype'=>1,'myextra'=>'auto_increment');
        $datadefinitions[1]['columns'][]=array('label'=>'Name','fieldname'=>'name','mytype'=>'varchar(60)','required'=>true);
        $datadefinitions[1]['columns'][]=array('label'=>'Age','fieldname'=>'age','mytype'=>'int(10)','headerFilterLiveFilter'=>false);
        $datadefinitions[1]['columns'][]=array('label'=>'Favorite color','fieldname'=>'col','mytype'=>'varchar(20)');
        $datadefinitions[1]['columns'][]=array('label'=>'Date of birth','fieldname'=>'dob','mytype'=>'DATE');
        $datadefinitions[1]['columns'][]=array('label'=>'Size','fieldname'=>'size','mytype'=>'float()','decimals'=>2);

        // -------------- data
  $temp=<<<EOD
  [
      {"ID":1, "name":"Oli Bob", "age":12, "col":"red", "dob":"","size":1.8},
      {"ID":2, "name":"Mary May", "age":14, "col":"blue", "dob":"1982-05-14","size":1.65},
      {"ID":3, "name":"Christine Lobowski", "age":42, "col":"green", "dob":"1982-05-22","size":1.72},
      {"ID":4, "name":"Brendon Philips", "age":25, "col":"orange", "dob":"1980-08-01","size":0},
      {"ID":5, "name":"Margret Marmajuke", "age":16, "col":"yellow", "dob":"1999-01-31","size":0}
  ]
  EOD;
  $datadefinitions[1]['data']=json_decode($temp,true);

        $nogenerate=false;
        $placeholders=false;
        break;

      case 4:  
      // -------------------------------- datadefID=4 playground ------------------------------------------
      $temp=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/object_invoice_3.json');
      $datadefinitions[4]=json_decode($temp,true);
      $datadefinitions[4]['childs'][0]['fieldname']="ARRAY_NAME";
      $datadefinitions[4]['jsonform']['form'][1]['value']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/object_example_container.html');
      $datadefinitions[4]['js_rec_record']['ARRAY_NAME']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/object_example_record.html');


        break;
      case 5:  
      // -------------------------------- datadefID=5 ------------------------------------------
      $temp=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8login.json');
      /*
      $temp=str_replace("GLOBALS_decimal_point",$GLOBALS['decimal_point'],$temp);
      $temp=str_replace("GLOBALS_thousands_sep",$GLOBALS['thousands_sep'],$temp);
      $temp=str_replace("GLOBALS_tabulatordateformat",$GLOBALS['tabulatordateformat'],$temp);
      $temp=str_replace("GLOBALS_tabulatordatetimeformat",$GLOBALS['tabulatordatetimeformat'],$temp);
      $temp=str_replace("GLOBALS_tabulatortimeformat",$GLOBALS['tabulatortimeformat'],$temp);
      $datadefinitions[5]=json_decode($temp,true);
      */
      $temp=gsReplaceFromArray($ph_datadef, $temp);
      $datadefinitions[$datadefID]=json_decode($temp,true);

      //$datadefinitions[5]['jsonform']['form'][1]['value']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/object_complaint_container.html');
      //$datadefinitions[5]['js_rec_record']['points']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/object_complaint_record.html');
      $datadefinitions[5]['masterdata']['formwrapper']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8login_formwrapper.html');
      $roles=getfromarray($_SESSION,'roles',array());
      if(in_array(2,$roles) or in_array(1,$roles)){
          //echo "not in";
      }else{
          $count=count($datadefinitions[5]['jsonform']['form']);
          //echo "count=".$count;
          unset($datadefinitions[5]['jsonform']['form'][$count-1]);
          unset($datadefinitions[5]['jsonform']['form'][$count-2]);
          //var_dump($datadefinitions[5]['jsonform']['form']);
      }
      break;

      case 6:  
      // -------------------------------- datadefID=6 k8loginfriends ------------------------------------------
      $temp=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8loginfriends.json');
      $temp=str_replace("GLOBALS_decimal_point",$GLOBALS['decimal_point'],$temp);
      $temp=str_replace("GLOBALS_thousands_sep",$GLOBALS['thousands_sep'],$temp);
      $temp=str_replace("GLOBALS_tabulatordateformat",$GLOBALS['tabulatordateformat'],$temp);
      $temp=str_replace("GLOBALS_tabulator_datetime_fp",$GLOBALS['tabulator_datetime_fp'],$temp);
      $datadefinitions[6]=json_decode($temp,true);

      //$datadefinitions[6]['js_rec_container']['lineedit']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8loginfriends_lineedit_container.html');
      //$datadefinitions[6]['js_rec_record']['lineedit']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8loginfriends_lineedit_record.html');

      $datadefinitions[6]['html']['lineedit']['container']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8loginfriends_lineedit_container.html');
      $datadefinitions[6]['html']['lineedit']['record']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8loginfriends_lineedit_record.html');

        break;
      case 7:  
      // -------------------------------- datadefID=7 username search ------------------------------------------
      $temp=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8login_searchuser.json');
      $temp=str_replace("GLOBALS_decimal_point",$GLOBALS['decimal_point'],$temp);
      $temp=str_replace("GLOBALS_thousands_sep",$GLOBALS['thousands_sep'],$temp);
      $temp=str_replace("GLOBALS_tabulatordateformat",$GLOBALS['tabulatordateformat'],$temp);
      $temp=str_replace("GLOBALS_tabulator_datetime_fp",$GLOBALS['tabulator_datetime_fp'],$temp);
      $datadefinitions[7]=json_decode($temp,true);

        break;
      case 8:  
      // -------------------------------- datadefID=8 k8references ------------------------------------------
      $temp=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8references.json');
      $temp=str_replace("GLOBALS_decimal_point",$GLOBALS['decimal_point'],$temp);
      $temp=str_replace("GLOBALS_thousands_sep",$GLOBALS['thousands_sep'],$temp);
      $temp=str_replace("GLOBALS_tabulatordateformat",$GLOBALS['tabulatordateformat'],$temp);
      $temp=str_replace("GLOBALS_tabulator_datetime_fp",$GLOBALS['tabulator_datetime_fp'],$temp);
      $datadefinitions[8]=json_decode($temp,true);
      $datadefinitions[8]['js_rec_container']['main']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8references_imgcat_container.html');
      $datadefinitions[8]['js_rec_record']['main']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8references_imgcat_record.html');

        break;
      case 9:  
          // -------------------------------- datadefID=9 k8languages ------------------------------------------
          $temp=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8languages.json');
          $temp=str_replace("GLOBALS_decimal_point",$GLOBALS['decimal_point'],$temp);
          $temp=str_replace("GLOBALS_thousands_sep",$GLOBALS['thousands_sep'],$temp);
          $temp=str_replace("GLOBALS_tabulatordateformat",$GLOBALS['tabulatordateformat'],$temp);
          $temp=str_replace("GLOBALS_tabulator_datetime_fp",$GLOBALS['tabulator_datetime_fp'],$temp);
          $datadefinitions[9]=json_decode($temp,true);
          $datadefinitions[9]['js_rec_container']['lineedit']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8languages_lineedit_container.html');
          $datadefinitions[9]['js_rec_record']['lineedit']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8languages_lineedit_record.html');

            break;

      case 10:  
      // -------------------------------- datadefID=10 username no pass word ------------------------------------------
      $temp=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8login.json');
      $temp=str_replace("GLOBALS_decimal_point",$GLOBALS['decimal_point'],$temp);
      $temp=str_replace("GLOBALS_thousands_sep",$GLOBALS['thousands_sep'],$temp);
      $temp=str_replace("GLOBALS_tabulatordateformat",$GLOBALS['tabulatordateformat'],$temp);
      $temp=str_replace("GLOBALS_tabulatordatetimeformat",$GLOBALS['tabulatordatetimeformat'],$temp);
      $temp=str_replace("GLOBALS_tabulatortimeformat",$GLOBALS['tabulatortimeformat'],$temp);
      $datadefinitions[5]=json_decode($temp,true);

      //$datadefinitions[5]['jsonform']['form'][1]['value']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/object_complaint_container.html');
      //$datadefinitions[5]['js_rec_record']['points']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/object_complaint_record.html');
      $datadefinitions[5]['masterdata']['formwrapper']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8login_formwrapper.html');
      $roles=getfromarray($_SESSION,'roles',array());
      if(in_array(2,$roles) or in_array(1,$roles)){
          //echo "not in";
      }else{
          $count=count($datadefinitions[5]['jsonform']['form']);
          //echo "count=".$count;
          unset($datadefinitions[5]['jsonform']['form'][$count-1]);
          unset($datadefinitions[5]['jsonform']['form'][$count-2]);
          //var_dump($datadefinitions[5]['jsonform']['form']);
      }
      break;

      case 12:  
          // -------------------------------- datadefID=12 k8pages ------------------------------------------
          $temp=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8pages.json');
          $temp=str_replace("GLOBALS_decimal_point",$GLOBALS['decimal_point'],$temp);
          $temp=str_replace("GLOBALS_thousands_sep",$GLOBALS['thousands_sep'],$temp);
          $temp=str_replace("GLOBALS_tabulatordateformat",$GLOBALS['tabulatordateformat'],$temp);
          $temp=str_replace("GLOBALS_tabulator_datetime_fp",$GLOBALS['tabulator_datetime_fp'],$temp);
          $temp=gsReplaceFromArray(array(), $temp);
          //echo htmlspecialchars($temp);
          $datadefinitions[$datadefID]=json_decode($temp,true);

          $datadefinitions[$datadefID]['html']['detail']['container']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8pages_detail_container.html');
          $datadefinitions[$datadefID]['html']['detail']['record']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8pages_detail_record.html');

          $datadefinitions[$datadefID]['html']['menu']['layout']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8pages_menu_layout.html');
          $datadefinitions[$datadefID]['html']['menu']['container']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8pages_menu_container.html');
          $datadefinitions[$datadefID]['html']['menu']['record']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8pages_menu_record.html');

          //$datadefinitions[11]['jsonform']['form'][1]['value']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/object_complaint_container.html');
          //$datadefinitions[11]['js_rec_record']['points']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/object_complaint_record.html');

          break;
      case 13:  
          // -------------------------------- datadefID=12 k8pages ------------------------------------------
          $temp=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8pages_13.json');
          $temp=str_replace("GLOBALS_decimal_point",$GLOBALS['decimal_point'],$temp);
          $temp=str_replace("GLOBALS_thousands_sep",$GLOBALS['thousands_sep'],$temp);
          $temp=str_replace("GLOBALS_tabulatordateformat",$GLOBALS['tabulatordateformat'],$temp);
          $temp=str_replace("GLOBALS_tabulator_datetime_fp",$GLOBALS['tabulator_datetime_fp'],$temp);
          $temp=gsReplaceFromArray(array(), $temp);
          //echo htmlspecialchars($temp);
          $datadefinitions[$datadefID]=json_decode($temp,true);

          $datadefinitions[$datadefID]['html']['catalog']['layout']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8pages_13_catalog_layout.html');
          $datadefinitions[$datadefID]['html']['catalog']['container']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8pages_13_catalog_container.html');
          $datadefinitions[$datadefID]['html']['catalog']['record']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8pages_13_catalog_record.html');
          $datadefinitions[$datadefID]['html']['detail']['container']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8pages_13_detail_container.html');
          $datadefinitions[$datadefID]['html']['detail']['record']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8pages_13_detail_record.html');
          $datadefinitions[$datadefID]['html']['detail']['layout']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/k8pages_13_detail_layout.html');

          break;
      case 14:  
        // -------------------------------- datadefID=14 register ------------------------------------------
        $temp=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/register/k8login_register.json');
        $temp=gsReplaceFromArray($ph_datadef, $temp);
        $datadefinitions[$datadefID]=json_decode($temp,true);
        //$datadefinitions[$datadefID]['masterdata']['formwrapper']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/register/k8login_register_formwrapper.html');
        $nogenerate=1;
        break;

      case 101:  
        // -------------------------------- datadefID=101 hrhelprequest ------------------------------------------
        $temp=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'myweb/HRhelprequest.json');
        $temp=str_replace("GLOBALS_decimal_point",$GLOBALS['decimal_point'],$temp);
        $temp=str_replace("GLOBALS_thousands_sep",$GLOBALS['thousands_sep'],$temp);
        $temp=str_replace("GLOBALS_tabulatordateformat",$GLOBALS['tabulatordateformat'],$temp);
        $temp=str_replace("GLOBALS_tabulator_datetime_fp",$GLOBALS['tabulator_datetime_fp'],$temp);
        $datadefinitions[101]=json_decode($temp,true);
        $datadefinitions[101]['js_rec_container']['catalog']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'myweb/HRhelprequest_catalog_container.html');
        $datadefinitions[101]['js_rec_record']['catalog']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'myweb/HRhelprequest_catalog_record.html');
        $datadefinitions[101]['js_rec_blank']['catalog']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'myweb/HRhelprequest_catalog_blank.html');
        $datadefinitions[101]['js_rec_nodata']['catalog']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'myweb/HRhelprequest_catalog_nodata.html');
        $datadefinitions[101]['js_rec_container']['detail']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'myweb/HRhelprequest_detail_container.html');
        $datadefinitions[101]['js_rec_record']['detail']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'myweb/HRhelprequest_detail_record.html');

        $datadefinitions[101]['html']['catalog']['filterform']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'myweb/HRhelprequest_catalog_filterform.html');
        $datadefinitions[101]['html']['catalog']['container']=$datadefinitions[101]['js_rec_container']['catalog'];
        $datadefinitions[101]['html']['catalog']['record']=$datadefinitions[101]['js_rec_record']['catalog'];
        $datadefinitions[101]['html']['catalog']['blank']=$datadefinitions[101]['js_rec_blank']['catalog'];
        $datadefinitions[101]['html']['catalog']['nodata']=$datadefinitions[101]['js_rec_nodata']['catalog'];
        $datadefinitions[101]['html']['detail']['container']=$datadefinitions[101]['js_rec_container']['detail'];
        $datadefinitions[101]['html']['detail']['record']=$datadefinitions[101]['js_rec_record']['detail'];

        break;
      case 102:  
        // -------------------------------- datadefID=102 hrhelpoffer ------------------------------------------
        $temp=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'myweb/HRhelpoffer.json');
        $temp=str_replace("GLOBALS_decimal_point",$GLOBALS['decimal_point'],$temp);
        $temp=str_replace("GLOBALS_thousands_sep",$GLOBALS['thousands_sep'],$temp);
        $temp=str_replace("GLOBALS_tabulatordateformat",$GLOBALS['tabulatordateformat'],$temp);
        $temp=str_replace("GLOBALS_tabulator_datetime_fp",$GLOBALS['tabulator_datetime_fp'],$temp);
        $datadefinitions[102]=json_decode($temp,true);
        $datadefinitions[102]['js_rec_container']['catalog']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'myweb/HRhelpoffer_catalog_container.html');
        $datadefinitions[102]['js_rec_record']['catalog']=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'myweb/HRhelpoffer_catalog_record.html');


      default:
          //$error="datadefinition ".$datadefID." do not exist!";
          //$datadefID=0;
      }
    }
  }

// --------------------------- look projectfiles -----------------------------------
//echo 'script_depth='.$GLOBALS['script_depth'].'<br>';
if(isset($GLOBALS['domain_datadeffiles'])){
    foreach($GLOBALS['domain_datadeffiles'] as $value){
        include str_repeat('../',$GLOBALS['script_depth']).$value;
    }
}
/*
    $echo=0; //0=nichts, 1=screen, 2=Log
    mylog("_prep_definition Start",$echo);
    mylog($_REQUEST,$echo);
    $dbclass=new dbclass();

    // ------------ Identifikation
    $datadefID=getfromArray($_REQUEST,'datadefID',0);
    $table=getfromArray($_REQUEST,'table');
    $nogenerate=getfromArray($_REQUEST,'dialog',0);
    $error='';
    $o=0;
*/    

    if(0){echo 'before check $datadefID='.$datadefID.'<br>';echo "<pre>";print_r($datadefinitions[$datadefID]);echo "</pre>";}
    //if(gbnull($datadefID)){
    if(!isset($datadefinitions[$datadefID])){
        mylog(array("Line"=>__LINE__ ,"message"=>'datadefinition not set, $datadefID='.$datadefID),$echo);
        // --------------------------- new datadefinition from table -----------------------------
        if(gbnull($table)){
          if($GLOBALS['domain_urlmode']==1){
            $error="page not found!";
          }else{
            $error="please specify table or datadefID!";
          }
        }else if($GLOBALS['domain_development']==1 or ($GLOBALS['domain_development']==2 and ini_get("display_errors")==1)){
            if(gbnull($datadefID)){
                $datadefID=-1;
            }
            //$connector=getfromArray() !!!!!!
            if($dbclass->bexist("information_schema.tables", "table_schema = DATABASE() AND table_name=".gsstr2sql($table))){
              $datadefinitions[$datadefID]['datadefID']=$datadefID;
              $datadefinitions[$datadefID]['table']=$table;
              //$datadefinitions[$datadefID]['name']=getfromArray($_REQUEST,'name',$datadefID);
              //$datadefinitions[$datadefID]['headtitle']=getfromArray($_REQUEST,'name',$datadefID);
              $datadefinitions[$datadefID]['name']=getfromArray($_REQUEST,'name',$table);
              $datadefinitions[$datadefID]['headtitle']=getfromArray($_REQUEST,'name',$table);
              $datadefinitions[$datadefID]['headdescription']="This is element wast created with K8 Web Kit";
              $datadefinitions[$datadefID]['revision']=2;
              $datadefinitions[$datadefID]['objectclass']="data_accessclass";
              $datadefinitions[$datadefID]['requiredfile']="masterdata/class_data_accessclass.php";
              if(gbnull(getFromArray($_REQUEST,"headtitlecolumn"))){
                mylog("headtitlecolumn is null",$echo);
              }else{
                mylog("headtitlecolumn set",$echo);
                $headtitlecolumn=getFromArray($_REQUEST,"headtitlecolumn");
                $headdescriptioncolumn=getFromArray($_REQUEST,"headdescriptioncolumn");
                $datadefinitions[$datadefID]['displaycolumn']=$headtitlecolumn;
                $ph_datadef['headtitlecolumn']=$headtitlecolumn;
                $ph_datadef['headdescriptioncolumn']=$headdescriptioncolumn;
                $filename=str_repeat('../',$GLOBALS['script_depth']).'masterdata/templates/catalog_onthefly.json';
                if(file_exists($filename)){
                  $temp=gsread_file($filename);
                  $temp=gsReplaceFromArray($ph_datadef, $temp);
                  $datadefinitions[$datadefID]=array_merge($datadefinitions[$datadefID],json_decode($temp,true));
                  if(true){
                  //if($datadefID==-1){
                    if(!isset($datadefinitions[$datadefID]['head_end'])){
                      $datadefinitions[$datadefID]['head_end']=array();
                    }
                    $datadefinitions[$datadefID]['head_end'][]="<script src=\"{{root}}masterdata/templates/detail_template.js\"></script>";
                  }
                }
              }
            }else{
              $error=$table.", table does not exist!";
            }
        }else{
            $error="no datadefinition on the fly!";
        }
    }else{
        $table=$datadefinitions[$datadefID]['table'];
    }
    
    //mylog('$datadefID='.$datadefID,$echo);
    if(isset($datadefinitions[$datadefID])){
        mylog('datadefinition set, $datadefID='.$datadefID,$echo);
        mylog(array("objectives"=>$objectives),$echo);
        //if(isset($datadefinitions[$datadefID]['connector']) and $objectives==-1){
        if(isset($datadefinitions[$datadefID]['connector'])){
        //if(false){
          mylog(array("connector"=>$datadefinitions[$datadefID]['connector']),$echo);
          mylog("connector parameters",$echo);
          $connector=$datadefinitions[$datadefID]['connector']['name'];
          if(isset($GLOBALS['domain_connectors'][$connector]['parameter'])){
            $datadefinitions[$datadefID]['connector']['parameter']=$GLOBALS['domain_connectors'][$connector]['parameter'];
          }else{
            $error="connector=$connector not in GLOBALS[connectors]!";
          }
          //mylog($datadefinitions[$datadefID],$echo);
        }
        
        //$nogenerate=false;
        if($nogenerate){
          if(!isset($datadefinitions[$datadefID]['masterdata']))$datadefinitions[$datadefID]['masterdata']=array();
        }else{            
            // --------------------------- generate or check the definition --------------------------
            mylog('check for generation, $datadefID='.$datadefID,$echo);
            if(!isset($datadefinitions[$datadefID]['rightcheck']))$datadefinitions[$datadefID]['rightcheck']=1;
            if(!isset($datadefinitions[$datadefID]['columns']) and !gbnull($datadefinitions[$datadefID]['table'])){
              mylog('before column generation, table='.$datadefinitions[$datadefID]['table'],$echo);
              $datadefinitions[$datadefID]['columns']=$dbclass->ShowTable($datadefinitions[$datadefID]['table'],$datadefinitions[$datadefID]['key']);
              if(!gbnull($dbclass->error)){
                $error=$dbclass->error;
                mylog($error,$echo);
                goto end;
              }else if(gbnull($datadefinitions[$datadefID]['key'])){
                $error="no primarykey detected";
                mylog($error,$echo);
                goto end;
              }else{
                $index=ArrayIndexFromProperty($datadefinitions[$datadefID]['columns'],"Field", $datadefinitions[$datadefID]['key']);
                mylog('$index='.$index,$echo);
                if($datadefinitions[$datadefID]['columns'][$index]['Extra']=="auto_increment"){
                  mylog('table without error',$echo);
                }else{
                  $error="key column without auto_increment";
                  mylog($error,$echo);
                  goto end;
                }
              }
            }else{
              mylog('columns already present, $datadefID='.$datadefID,$echo);
            }
            if(!isset($datadefinitions[$datadefID]['masterdata']))$datadefinitions[$datadefID]['masterdata']=array();
            //if(!isset($datadefinitions[$datadefID]['masterdata']['object_mode']))$datadefinitions[$datadefID]['masterdata']['object_mode']=0;
            //if(!isset($datadefinitions[$datadefID]['masterdata']['add_empty_rec']))$datadefinitions[$datadefID]['masterdata']['add_empty_rec']=0;
            if(!isset($datadefinitions[$datadefID]['masterdata']['url_readfilter'])){
                //$file='../ProcessData.php';
                // script_depth=1
                //$file='masterdata/ProcessData.php';
                //$file=dirname($_SERVER['SCRIPT_NAME']).'/masterdata/ProcessData.php';
                //$file=str_repeat('../',$GLOBALS['script_depth']).'masterdata/ProcessData.php';

                $file='masterdata/ProcessData.php';
                //$datadefinitions[$datadefID]['masterdata']['root']=''; //str_repeat('../',$GLOBALS['script_depth']);

                //mylog("GENERATE URL datadefID=".$datadefID,$echo);

                //"url_new":"index.php?page=form&datadefID=100&page_mode=2&action=New",
                //"url_edit":"index.php?page=form&datadefID=100&page_mode=2&action=Edit"

                //if($datadefID<=0){
                if(gbnull($datadefID_default)){
                    $datadefinitions[$datadefID]['masterdata']['url_new']=$GLOBALS['domain_indexfile']."?page=form&table=$table&process_action=New&page_mode=2";
                    $datadefinitions[$datadefID]['masterdata']['url_edit']=$GLOBALS['domain_indexfile']."?page=form&table=$table&process_action=Edit&page_mode=2";
                    $datadefinitions[$datadefID]['masterdata']['url_detail']=$GLOBALS['domain_indexfile']."?page=detail&table=$table";
                    //$datadefinitions[$datadefID]['masterdata']['url_getR']=$file."?table=$table&process_action=getRecords";
                    //$datadefinitions[$datadefID]['masterdata']['url_init']=$file."?table=$table&process_action=Init";
                    $datadefinitions[$datadefID]['masterdata']['url_load']=$file."?table=$table&process_action=Load";
                    $datadefinitions[$datadefID]['masterdata']['url_save']=$file."?table=$table&process_action=Save";
                    $datadefinitions[$datadefID]['masterdata']['url_del'] =$file."?table=$table&process_action=Del";
                    $datadefinitions[$datadefID]['masterdata']['url_readfilter']=$file;
                    $datadefinitions[$datadefID]['masterdata']['data_readfilter']=array('table'=>$table,'process_action'=>"ReadFilter");
                }else{
                    $datadefinitions[$datadefID]['masterdata']['url_new']=$GLOBALS['domain_indexfile']."?page=form&datadefID=$datadefID&process_action=New&page_mode=2";
                    $datadefinitions[$datadefID]['masterdata']['url_edit']=$GLOBALS['domain_indexfile']."?page=form&datadefID=$datadefID&process_action=Edit&page_mode=2";
                    $datadefinitions[$datadefID]['masterdata']['url_detail']=$GLOBALS['domain_indexfile']."?page=detail&datadefID=$datadefID";
                    //$datadefinitions[$datadefID]['masterdata']['url_getR']=$file."?datadefID=$datadefID&process_action=getRecords";
                    //$datadefinitions[$datadefID]['masterdata']['url_init']=$file."?datadefID=$datadefID&process_action=Init";
                    $datadefinitions[$datadefID]['masterdata']['url_load']=$file."?datadefID=$datadefID&process_action=Load";
                    $datadefinitions[$datadefID]['masterdata']['url_save']=$file."?datadefID=$datadefID&process_action=Save";
                    $datadefinitions[$datadefID]['masterdata']['url_del'] =$file."?datadefID=$datadefID&process_action=Del";
                    $datadefinitions[$datadefID]['masterdata']['url_readfilter']=$file;
                    $datadefinitions[$datadefID]['masterdata']['data_readfilter']=array('datadefID'=>$datadefID,'process_action'=>"ReadFilter");
                }
                
                // sqlderived?
                $bsql=false;
                $selectcolumns="$table.*,'' as k8select";
                $selectfrom=$table;
                
                $headtitlecolumn=getFromArray($_REQUEST,"headtitlecolumn",getfromArray($datadefinitions[$datadefID],"headtitlecolumn"));
                //mylog(array('$headtitlecolumn'=>$headtitlecolumn),2);
                if(gbnull(getFromArray($datadefinitions[$datadefID]['masterdata'],'sql_derived')) and !gbnull($headtitlecolumn)){
                  $searchfields=table2searchfields($table,$datadefinitions[$datadefID]['columns']);
                  //mylog(array('$searchfields'=>$searchfields),2);
                  if(!gbnull($searchfields)){
                    $bsql=true;
                    $seachexpression='';
                    $arr=explode(',',$searchfields);
                    if(count($arr)>1){
                      //$seachexpression="concat_ws($searchfields) as searchcolumn";
                      $seachexpression="concat_ws(',',$searchfields) as searchcolumn";
                    }else{
                      $seachexpression="$searchfields as searchcolumn";
                    }
                    $selectcolumns=gsclauseand($selectcolumns,$seachexpression,true,',');
                  }
                }
                if($datadefinitions[$datadefID]['rightcheck']){
                  $bsql=true;
                  $selectcolumns=gsclauseand($selectcolumns,"k8login.username",true,',');
                  $selectfrom=gsclauseand($selectfrom,"LEFT OUTER JOIN k8login ON $table.creatorID=k8login.userID",true,' ');
                }
                if($bsql){
                  $datadefinitions[$datadefID]['masterdata']['sql_derived']="SELECT $selectcolumns FROM $selectfrom WHERE 1=1";
                }
            }
            if(!isset($datadefinitions[$datadefID]['tabulator']['columns']) and isset($datadefinitions[$datadefID]['columns'])){
                mylog("before tabulator.columns",$echo);
                $datadefinitions[$datadefID]['tabulator']['columns']=table2tabulator($datadefinitions[$datadefID]['columns'],$placeholders);
                if($datadefinitions[$datadefID]['rightcheck']){
                  $column=array("title"=>"creatorname","field"=>"username","headerFilter"=>true);
                  $datadefinitions[$datadefID]['tabulator']['columns'][]=$column;
                }
            }
            /* no more jsonform
            if(!isset($datadefinitions[$datadefID]['jsonform']['schema']) and isset($datadefinitions[$datadefID]['columns'])){
                $datadefinitions[$datadefID]['jsonform']['schema']=table2jsonform($datadefinitions[$datadefID]['columns']);
            }
            */
            //mylog("before check k8form",$echo);
            if(!isset($datadefinitions[$datadefID]['k8form']) and isset($datadefinitions[$datadefID]['columns'])){
                mylog("k8form generate",$echo);
                $datadefinitions[$datadefID]['k8form']=array();
                $datadefinitions[$datadefID]['k8form']['selector']=".js_dataform";
                $datadefinitions[$datadefID]['k8form']['templatetype']="masterform";
                $datadefinitions[$datadefID]['k8form']['fields']=table2k8form($datadefinitions[$datadefID]['columns']);
            }
            if(!isset($datadefinitions[$datadefID]['objectclass'])){
                $error="datadefID=".$datadefID." objectclass not set";
                mylog($error,$echo);
                exit;
            }
            
            $headtitlecolumn=getfromArray($datadefinitions[$datadefID],'headtitlecolumn');
            //mylog(array('function'=>'getDatadefinition.before html','datadefID'=>$datadefID,'table'=>$table,'ret'=>$ret,'headtitlecolumn'=>$headtitlecolumn,'placeholders'=>$placeholders,'objectives'=>$objectives),$echo);
            if($objectives==3){
              unset($datadefinitions[$datadefID]['html']);
              if(isset($datadefinitions[$datadefID]['headtitlecolumn'])){
                //mylog(array('options'=>$options),$echo);

                $template=getfromArray($options,'catalogtemplate');
                // catalogtemplate
                if(!gbnull($template)){
                  // css
                  $filename=str_repeat('../',$GLOBALS['script_depth']).'masterdata/templates/'.$template.".css";
                  if(file_exists($filename)){
                    $to=$GLOBALS['domain_projectpath'][0].'/'.$datadefinitions[$datadefID]['datadefID'].'/'.$datadefinitions[$datadefID]['datadefID'].'_'.$template.'.css';
                    $filenameto=str_repeat('../',$GLOBALS['script_depth']).$to;
                    copy($filename,$filenameto);
                    if(!isset($datadefinitions[$datadefID]['head'])){
                      $datadefinitions[$datadefID]['head']=array();
                    }
                    //$datadefinitions[$datadefID]['head'][]='<link rel="stylesheet" href="'.$GLOBALS['domain_hostpath'].'masterdata/templates/catalog-4tiles.css">';
                    $datadefinitions[$datadefID]['head'][]='<link rel="stylesheet" href="{{root}}'.$to.'">';
                  }
                  if($template=='catalog-no-search'){
                    $datadefinitions[$datadefID]['masterdata']['search_mode']=0;
                  }else if($template=='catalog-4tiles'){
                    $datadefinitions[$datadefID]['masterdata']['paginationsize']=4;
                    $datadefinitions[$datadefID]['masterdata']['paginationscale']=array(4,8,24);
                  }
                }
                copyHTMLelement($datadefinitions[$datadefID],'catalog','container',$template);
                createHTMLtable($datadefinitions[$datadefID],'catalog','record',$template);

                // detailtemplate
                $template=getfromArray($options,'detailtemplate');
                // css
                if(!gbnull($template)){
                  //mylog("template=".$template,2);
                  if($template=='detail-carousel'){
                    $datadefinitions[$datadefID]['masterdata']['detail-carousel']=true;
                  }
                  //mylog($datadefinitions[$datadefID]['masterdata'],2);
                  
                  $filename=str_repeat('../',$GLOBALS['script_depth']).'masterdata/templates/'.$template.".css";
                  if(file_exists($filename)){
                    $to=$GLOBALS['domain_projectpath'][0].'/'.$datadefinitions[$datadefID]['datadefID'].'/'.$datadefinitions[$datadefID]['datadefID'].'_'.$template.'.css';
                    $filenameto=str_repeat('../',$GLOBALS['script_depth']).$to;
                    copy($filename,$filenameto);
                    if(!isset($datadefinitions[$datadefID]['head'])){
                      $datadefinitions[$datadefID]['head']=array();
                    }
                    //$datadefinitions[$datadefID]['head'][]='<link rel="stylesheet" href="'.$GLOBALS['domain_hostpath'].'masterdata/templates/catalog-4tiles.css">';
                    $datadefinitions[$datadefID]['head'][]='<link rel="stylesheet" href="'.$GLOBALS['domain_hostpath'].$to.'">';
                  }
                }
                copyHTMLelement($datadefinitions[$datadefID],'detail','container',$template);
                createHTMLtable($datadefinitions[$datadefID],'detail','record',$template);
                
                createHTMLlineedit($datadefinitions[$datadefID],'lineedit');
              }
            }
        }
        

    }else{
        $datadefID=0;
        mylog('$datadefinition['.$datadefID.'] not set',$echo);

        goto end;
    }
    
    // --------------------------- inclucde data_access_class -----------------------------------
    //echo 'include $datadefID='.$datadefID.'<br>';
    //echo "requiredfile=".getfromArray($datadefinitions[$datadefID],'requiredfile').'<br>';
    if(gbnull(getfromArray($datadefinitions[$datadefID],'requiredfile'))){
        //include_once 'class_data_accessclass.php';
        include_once str_repeat('../',$GLOBALS['script_depth']).'masterdata/class_data_accessclass.php';
    }else{
        //include_once $datadefinitions[$datadefID]['requiredfile'];
        include_once str_repeat('../',$GLOBALS['script_depth']).$datadefinitions[$datadefID]['requiredfile'];
    }

    
    if(!gbnull($datadefID)){
        //mylog($datadefinitions[$datadefID],$echo);
        $bok=true;
        $loginrequired=getFromArray($datadefinitions[$datadefID]['masterdata'],'loginrequired',0);
        if($loginrequired and gbnull(getFromArray($_SESSION,'userID',0))){
            $bok=false;
            // Cookie
            if(isset($_COOKIE['login'])){
                //echo 'COOKIE LESEN!<br>';
                $arr=explode('|',$_COOKIE['login']);
                //if(login($arr[1],$arr[2],$error)){
                if(login($arr[1],"",$error,false,$arr[2])){
                    $bok=true;
                }else{
                    //echo 'klappt nicht:'.$error.' <br>';
                } 
            }
        }
        mylog(array("line 601, bok"=>$bok),$echo);        
        
        if($bok){
          
            $o=new $datadefinitions[$datadefID]['objectclass']($datadefinitions[$datadefID],true);
            mylog('hier o->error='.$o->error,$echo);
            if(gbnull($o->error)){
              // ---------------------- rightuser_create
              if($o->rightcheck<>0){
                if(!isset($o->permit['create'])){
                  mylog('nothing allowed',$echo);
                }elseif(count($o->roles)>0){
                  $res=0;
                  mylog('$datadefID='.$datadefID,$echo);
                  mylog($o->permit['create'],$echo);
                  foreach($o->roles as $roleID){
                    mylog('$roleID='.$roleID,$echo);
                    if(isset($o->permit['create'][$roleID])){
                      $method=getFromArray($o->permit['create'],$roleID,0);
                      if($method==1000){
                        $res=$o->bcheckMaster($masterkeyvalue,'update',$roleID);
                      }else{
                        $arr=array("method"=>$method);
                        $res=$o->dbclass->bRecordAccess($arr);
                        //echo '$method='.$method.'<br>';
                        //echo '$res='.$res.'<br>';
                      }
                      if($res)break;
                    }
                  }
                  $datadefinitions[$datadefID]['masterdata']['rightuser_create']=$res;
                  //echo "a-Result=".$datadefinitions[$datadefID]['masterdata']['rightuser_create'].'<br>';
                }else{
                    /* deprecated
                    $method=getFromArray($o->permit['create'],$o->roleID,0);
                    if($method==1000){
                      $datadefinitions[$datadefID]['masterdata']['rightuser_create']=$o->bcheckMaster($masterkeyvalue,'update',$o->roleID);
                    }else{
                      $arr=array("method"=>$method);
                      $datadefinitions[$datadefID]['masterdata']['rightuser_create']=$o->dbclass->bRecordAccess($arr);
                    }
                    */
                }
              }
          }
        }else{
            $error=$o->error;
            $o=0;
        }
        /*
        if($echo==0){
            //echo 'childs<br>';
            echo '<pre>';
            //print_r($datadefinitions[$datadefID]);
            echo '</pre>';
            echo '$error='.$error.'<br>';
            exit;
        }
         */
    }
    
    // -------------- dependencies
    if(isset($datadefinitions[$datadefID]['masterdata']['upload'])){
        if(getFromArray($datadefinitions[$datadefID]['masterdata']['upload'],"enabled")==true){
            $tempID=$GLOBALS['domain_datadefIDatt'];
            if(!isset($datadefinitions[$tempID]))getDatadefinition($tempID,$error);
        }
    }
end:
  //if(isset($datadefinitions[$datadefID]))mylog(array('datadefID end set='=>$datadefID),2);

  if(isset($datadefinitions[$datadefID]['html'])){
    mylog(array("datadefID"=>$datadefID,"html"=>$datadefinitions[$datadefID]['html']),$echo);
  }else{
    mylog(array("datadefID"=>$datadefID,"html"=>"not set"),$echo);
  }
  //echo '$ret: '.$ret.'<br>';
  if(gbnull($error)){
    mylog("no error",$echo);
    if($ret){
      return $o;
    }else{
      if($objectives==-1){
        //$datadefinitions[$datadefID]
      }else if($objectives==1){
        unset($datadefinitions[$datadefID]['columns']);
      }
      if(isset($datadefinitions[$datadefID])){
        return $datadefinitions[$datadefID];
      }
    }
  }else{
    mylog($error,$echo);
    return 0;
  }
}

function copyHTMLelement(&$datadefinition,$area,$part,$source=''){
  $from='';
  $from_filename=$area.'_'.$part.'.html';
  if(!gbnull($source)){
    $from_filename=$source.'_'.$part.'.html';
  }
  $from=str_repeat('../',$GLOBALS['script_depth']).'masterdata/templates/'.$from_filename;
  $to=str_repeat('../',$GLOBALS['script_depth']).$GLOBALS['domain_projectpath'][0].'/'.$datadefinition['datadefID'].'/'.$datadefinition['datadefID'].'_'.$area.'_'.$part.'.html';
  //mylog(array('from'=>$from,'to'=>$to),2);
  copy($from,$to);
}

function createHTMLtable(&$datadefinition,$area,$part,$source=''){
  //$template_area=$datadefinition['html'][$area]['record'];
  $filename=str_repeat('../',$GLOBALS['script_depth']).'masterdata/templates/'.$area."_$part.html";
  if(!gbnull($source)){
    $filename=str_repeat('../',$GLOBALS['script_depth']).'masterdata/templates/'.$source."_$part.html";
  }
  //mylog(array('filename'=>$filename),2);
  $template_area=gsread_file($filename);
  $headtitlecolumn=getfromArray($datadefinition,'headtitlecolumn');
  if(!gbnull($headtitlecolumn))$template_area=str_replace('{{headtitlecolumn}}',$headtitlecolumn,$template_area);
  $headdescriptioncolumn=getfromArray($datadefinition,'headdescriptioncolumn');
  if(!gbnull($headdescriptioncolumn))$template_area=str_replace('{{headdescriptioncolumn}}',$headdescriptioncolumn,$template_area);
  
  $template_tablecontainer=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/templates/detail_table_container.html');
  $template_tablerow=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/templates/detail_table_row.html');
  
  // loop columns
  $html_rows='';
  foreach($datadefinition['columns'] as $column){
    if($column['Field']<>$datadefinition['key'] and $column['Field']<>$headtitlecolumn and $column['Field']<>$headdescriptioncolumn and $column['Field']<>'creatorID'){
      $arr=array('field'=>$column['Field'],'value'=>'{{'.$column['Field'].'}}');
      $tablerow=gsReplaceFromArray($arr, $template_tablerow);
      $html_rows.=$tablerow;
    }
  }
  $html=str_replace('{{innerHTML}}',$html_rows,$template_tablecontainer);
  $html=str_replace('{{more_columns}}',$html,$template_area);
  $filename=str_repeat('../',$GLOBALS['script_depth']).$GLOBALS['domain_projectpath'][0].'/'.$datadefinition['datadefID'].'/'.$datadefinition['datadefID']."_$area"."_$part.html";
  gbwrite_file($html, $filename,'w');
}

function createHTMLlineedit(&$datadefinition,$area){
  // headline loop columns
  $template_area=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/templates/lineedit_container.html');
  $template_tablerow=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/templates/lineedit_flex_headline.html');
  $template_type='container';
  
  $html_rows='';
  foreach($datadefinition['columns'] as $column){
    if(gbnull($column['Key']) and $column['Field']<>'creatorID'){
      // no title, no description
      $arr=array('field'=>$column['Field'],'value'=>'{{'.$column['Field'].'}}');
      $tablerow=gsReplaceFromArray($arr, $template_tablerow);
      $html_rows.=$tablerow;
    }
  }
  $html=str_replace('{{more_columns}}',$html_rows,$template_area);
  $filename=str_repeat('../',$GLOBALS['script_depth']).$GLOBALS['domain_projectpath'][0].'/'.$datadefinition['datadefID'].'/'.$datadefinition['datadefID'].'_'.$area.'_'.$template_type.'.html';
  gbwrite_file($html, $filename,'w');
  
  // record loop columns
  $template_area=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/templates/lineedit_record.html');
  $template_tablerow=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/templates/lineedit_flex_record.html');
  $template_type='record';
  $html_rows='';
  
  foreach($datadefinition['columns'] as $column){
    if(gbnull($column['Key']) and $column['Field']<>'creatorID'){
      // no title, no description
      $arr=array('field'=>$column['Field'],'value'=>'{{'.$column['Field'].'}}');
      $tablerow=gsReplaceFromArray($arr, $template_tablerow);
      $html_rows.=$tablerow;
    }
  }
  $html=str_replace('{{more_columns}}',$html_rows,$template_area);
  $html=str_replace('{{key}}',$datadefinition['key'],$html);
  $filename=str_repeat('../',$GLOBALS['script_depth']).$GLOBALS['domain_projectpath'][0].'/'.$datadefinition['datadefID'].'/'.$datadefinition['datadefID'].'_'.$area.'_'.$template_type.'.html';
  gbwrite_file($html, $filename,'w');
}
?>