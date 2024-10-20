<?php
$dataws=[];
if(isset($GLOBALS['k8db']) or $datadefID==1){
  mylog(array('file'=>'_prepage_head.php','$datadefID'=>$datadefID,'$table'=>$table),$echo);
  $error="";
  if(gbnull($table) and gbnull($datadefID)){
    // not datadefinition
  }else if(gbnull($table)){
      //$datadefID=getFromArray($_REQUEST,'datadefID',$datadefID);
      //echo '$datadefID='.$datadefID.'<br>';
      getDatadefinition($datadefID,$error);
      //makes an error, when datadefintion don't exist!  mylog(array('datadefinitions'=>$datadefinitions[$datadefID],'error'=>$error),2);
  }elseif(!gbnull($table)){    
      //echo '$table='.$table.'<br>';
      //echo 'before get data $datadefID='.$datadefID.'<br>';
      getDatadefinition($datadefID,$error,"",0,$table);
      //echo '$datadefID='.$datadefID.'<br>';
  }
  if(!gbnull($error)){
    $page='systemmessage';
    $GLOBALS['domain_systemmessage']=$error;
  }
  //mylog('$headtitle='.$headtitle,2);
  //mylog('$datadefID='.$datadefID,2);
  //mylog($datadefinitions[$datadefID],1);
  
  if(!gbnull($datadefID) and gbnull($error)){
      if(isset($datadefinitions[$datadefID]["optionsadditional"])){
        prepare_optionsadditional($datadefinitions[$datadefID]);
      }
      
      if(!isset($GLOBALS['pages'][$page]['headtitle']))      $headtitle=getfromarray($datadefinitions[$datadefID],'headtitle',$headtitle);
      if(!isset($GLOBALS['pages'][$page]['headdescription']))$headdescription=getfromarray($datadefinitions[$datadefID],'headdescription',$headdescription);
      if(!isset($GLOBALS['pages'][$page]['headimage']))      $headimage=getfromarray($datadefinitions[$datadefID],'headimage',$headimage);
      //mylog(array('headtitle'=>$headtitle),2);
      
      // include
      $bdefault=true;
      if(!gbnull($datadefID)){
          if(isset($datadefinitions[$datadefID]["php_include"])){
              $bdefault=false;
              foreach($datadefinitions[$datadefID]["php_include"] as $k => $v){
                  include $v;
              }
          }
      }
      
      if($bdefault){
          //$o=getDatadefinition($datadefID,$error,"",0,"",1);
          $o=new $datadefinitions[$datadefID]['objectclass']($datadefinitions[$datadefID]);
          if(!gbnull($datadefID)){
              $init_data=getFromArray($datadefinitions[$datadefID]['masterdata'],'init_data',0);
              $init_page=getFromArray($datadefinitions[$datadefID]['masterdata'],'init_page',0);
              //mylog(array('$pagetype'=>$pagetype,'$init_page'=>$init_page,'$init_data'=>$init_data),2);
              if($pagetype=="detail" or $pagetype=="form" or $page=="detail" or $page=="form" or $init_data or $init_data){
                  $marking=getFromArray($_REQUEST,'marking');
                  //$displayvalue=getFromArray($_REQUEST,'displayvalue',getFromArray($_REQUEST,'displayvalue'));
                  //mylog(array('$keyvalue'=>$keyvalue,'$displayvalue'=>$displayvalue,'$marking'=>$marking,'$intit_data'=>$init_data),2);
                  if(gbnull($displayvalue) and gbnull($keyvalue) and gbnull($marking) and !boolval($init_data)){
                      $headtitle="New ".$datadefinitions[$datadefID]['name'];
                      $headdescription=getfromarray($datadefinitions[$datadefID],'headdescription');
                  }else{
                      if(is_object($o)){
                        $clause="";
                        if(gbnull($displayvalue)){
                          // look above
                        }else{
                          if(isset($datadefinitions[$datadefID]['displaycolumn'])){
                            $clause=$datadefinitions[$datadefID]['displaycolumn']."=".gsstr2sql($displayvalue);
                          }else{
                            mylog("datadefinition $datadefID: 'displaycolumn' not set!",2);
                            $clause="Z=123";
                          }
                        }
                        if(!gbnull($keyvalue))$clause=$datadefinitions[$datadefID]['key']."=$keyvalue";
                        if(!gbnull($marking) and $datadefinitions[$datadefID]['displayvalue']="marking")$clause="marking='$marking'";
                        if(!gbnull(getfromArray($_REQUEST,'clause')))$clause=getfromArray($_REQUEST,'clause');
                        if(!gbnull($clause) and !isset($datadefinitions[$datadefID]['masterdata']['sql_derived'])){
                            $clause=$datadefinitions[$datadefID]['table'].'.'.$clause;
                        }
                        //mylog(array('$clause'=>$clause),2);
                        if($o->getentries($clause)){
                          $dataws=$o->data;
                          /*
                          mylog(array('$dataws'=>$dataws,
                            "headdescriptioncolumn"=>getfromarray($datadefinitions[$datadefID],'headdescriptioncolumn')),
                            2);
                            // getfromarray($datadefinitions[$datadefID],'headdescriptioncolumn')=>getfromarray($dataws[0],$datadefinitions[$datadefID]['headdescriptioncolumn']))
                          */
                          if($pagetype=="detail" or $pagetype=="form" or $page=="detail" or $page=="form" or $init_page){
                            if(isset($datadefinitions[$datadefID]['headtitlecolumn'])) $headtitle=getfromarray($dataws[0],$datadefinitions[$datadefID]['headtitlecolumn']);
                            if(isset($datadefinitions[$datadefID]['headdescriptioncolumn']))$headdescription=getfromarray($dataws[0],$datadefinitions[$datadefID]['headdescriptioncolumn']);
                            if(isset($datadefinitions[$datadefID]['headimagecolumn'])){
                              $temp=getfromarray($dataws[0],$datadefinitions[$datadefID]['headimagecolumn']);
                              if($temp<>'masterdata/pic/nopicture.svg')$headimage=$temp;
                            }
                          }
                          if(!($pagetype=="detail" or $pagetype=="form" or $page=="detail" or $page=="form") or $init_data){
                            $datadefinitions[$datadefID]['data']=$dataws;
                          }
                          
                          //if($datadefID=="k8pages" and count($dataws)==1 and $page!='form'){
                          if(count($dataws)==1 and $page!='form'){
                            if(isset($dataws[0]['site'])){
                              $sitestr=getfromArray($dataws[0],'site');
                              if(!gbnull($sitestr)){
                                $site=json_decode($sitestr,true);
                                loadDatadefFromSite($site);
                              }
                            }
                          }                            
                        }else{
                          $datadefinitions[$datadefID]['masterdata']['loaddata']=0;
                          //echo "no data<br>";
                        }
                      }
                  }
              }
          }
      }
  }else{
    mylog(array('status'=>'no datadefID','error'=>$error,'datadefID'=>$datadefID),$echo);
  }
}

if($page=="form"){
  // no site
}else if(isset($GLOBALS['pages'][$page]['site'])){
  //mylog(array('$page with site)'=>$page),2);
  $site=$GLOBALS['pages'][$page]['site'];
  loadDatadefFromSite($site);
}
//mylog(array('prepare_head.php, count($site)'=>count($site)),$echo);

if(count($site)>0){
  //mylog($site,2);
  $datadefIDs_list=array();
  if(!gbnull($datadefID))$datadefIDs_list[]=$datadefID;
  $datadefIDs_double=array();
  if(isset($site['elements'])){
    foreach($site['elements'] as $element){
      $datadefID_temp=getfromArray($element,'datadefID');
      if(!in_array($datadefID_temp,$datadefIDs_list)){
        $datadefIDs_list[]=$datadefID_temp;
      }else{
        $datadefIDs_double[]=$datadefID_temp;
      }
    }
    //mylog(array('datadefIDs_double'=>$datadefIDs_double),2);
    foreach($site['elements'] as $k => $element){
      $datadefID_temp=getfromArray($element,"datadefID");
      //if(!gbnull($datadefID_temp) and !($datadefID_temp=="k8pages" and $datadefID=="k8pages")){
      //mylog(array('$datadefID_temp'=>$datadefID_temp,"datadefID"=>$datadefID),2);
      if(!gbnull($datadefID_temp) and ($datadefID_temp!==$datadefID)){
        if(isset($datadefinitions[$datadefID_temp])){
          if(isset($datadefinitions[$datadefID_temp]["optionsadditional"])){
            prepare_optionsadditional($datadefinitions[$datadefID_temp]);
          }
        }
        if(isset($datadefinitions[$datadefID_temp]["php_include"])){
            $bdefault=false;
            foreach($datadefinitions[$datadefID_temp]["php_include"] as $k => $v){
                include $v;
            }
        }
      }
      if(in_array($datadefID_temp,$datadefIDs_double)){
        $site['elements'][$k]['alias']=true;
      }
    }
  }
}

function prepare_optionsadditional(&$datadefinition){
  mylog(array("prepare_optionsadditional.datadefID"=>$datadefinition['datadefID']),2);
  foreach($datadefinition["optionsadditional"] as $k_datadef => $v_datadef){
    $datadefID_temp=getfromArray($v_datadef,'datadefID');
    $map=getfromArray($v_datadef,'column_mapping',array());
    $field=getfromArray($v_datadef,'fieldname');
    $clause=getfromArray($v_datadef,'defaultclause');
    $emptytext=getfromArray($v_datadef,'emptytext','please select');  // with select line
    $bok=(!gbnull($datadefID_temp) and !gbnull($map) and !gbnull($field));
    $options=array();
    if($bok){
      
      $options=array();
      if($emptytext<>"none"){
        if(isset($map['value'])){
          $options[]=array("value"=>"","text"=>$emptytext);
        }else{
          $options[]=array("text"=>"");
        }
      }
      //$o_temp=getDatadefinition($datadefID_temp,$error,'',0,'',1,true,-1);
      $o_temp=getDatadefinition($datadefID_temp,$error,'',0,'',1,true,0);
      if($o_temp->getEntries($clause)){
        //mylog(array('$datadefID_temp'=>$datadefID_temp),2);
        foreach($o_temp->data as $dat_temp){
          $option=array();
          foreach($map as $k => $v){
            $option[$k]=getfromArray($dat_temp,$v);
          }
          $options[]=$option;
        }
        //mylog(array("options"=>$options),2);
      }

      $datadefinition["optionsadditional"][$k_datadef]["values"]=$options;
      if(isset($datadefinition['k8form'])){
        k8containerfieldsaddoptions($datadefinition['k8form'],$field,$options);
      }
      if(isset($datadefinition['masterdata']['filterobject'])){
        k8containerfieldsaddoptions($datadefinition['masterdata']['filterobject'],$field,$options);
      }
      if(isset($datadefinition['tabulator']) and isset($datadefinition["optionsadditional"][$k_datadef]['tabulatorcolumn'])){
        k8tabulatoraddoptions($datadefinition,$v_datadef,$options);
      }
    }else{
      mylog("optionsadditional not bok",2);
    }
  }
}
        


function k8containerfieldsaddoptions(&$container,$field,$options){
  //mylog(array('$container'=>$container),2);
  if(isset($container['fields'])){
    // fields searching
    $index=getArrayIndexfromValue($container['fields'], 'name', $field);
    //mylog(array("index"=>$index),2);
    if($index>-1){
      $container['fields'][$index]['options']=$options;
    }
  }
  if(isset($container['containers'])){
    foreach($container['containers'] as $k => $subcontainer){
      k8containerfieldsaddoptions($container['containers'][$k],$field,$options);
    }
  }
}

function k8tabulatoraddoptions(&$datadefinition,$option_element,$options){
  $tabulatorcolumn=$option_element['tabulatorcolumn'];
  if(!gbnull($tabulatorcolumn)){
    $index=getArrayIndexfromValue($datadefinition['tabulator']['columns'], 'field', $tabulatorcolumn);
    //mylog(array('$index'=>$index),2);
    if($index>-1){
      $type="";
      if(isset($datadefinition['tabulator']['columns'][$index]['formatterParams'])){
        //mylog(array('formatterParams'=>"set"),2);
        $type=getfromArray($datadefinition['tabulator']['columns'][$index]['formatterParams'],'type');
        if($type=='color'){
          $obj=[];
          $obj_header=array(""=>"");
          foreach($options as $option){
            //mylog(array("option"=>$option),2);
            /*
            if(isset($option['data-fontcolor'])){
              $obj[$option['value']]=array(
                "text"=>$option['text'],
                "fontcolor"=>$option['data-fontcolor'],
                "backgroundcolor"=>$option['data-backgroundcolor']);
              $obj_header[$option['value']]=$option['text'];
            }
            */
            $obj[$option['value']]=array();
            if(isset($option['text']))$obj[$option['value']]["text"]=$option['text'];
            if(isset($option['data-fontcolor']))$obj[$option['value']]["fontcolor"]=$option['data-fontcolor'];
            if(isset($option['data-backgroundcolor']))$obj[$option['value']]["backgroundcolor"]=$option['data-backgroundcolor'];
            $obj_header[$option['value']]=$option['text'];
          }
          $datadefinition['tabulator']['columns'][$index]['headerFilterParams']['values']=$obj_header;
          $datadefinition['tabulator']['columns'][$index]['formatterParams']['values']=$obj;
        }
      }else{
        //mylog(array('formatterParams'=>"not set"),2);
      }
    }
  }
}

function loadDatadefFromSite($site){
  Global $datadefinitions;
  $elements=getfromArray($site,"elements",array());
  foreach($elements as $element){
    $datadefID_temp=getfromArray($element,"datadefID");
    //mylog($datadefID_temp,2);
    if(!gbnull($datadefID_temp)){
      if(!isset($datadefinitions[$datadefID_temp])){
        getDatadefinition($datadefID_temp,$error);
        //mylog(array("error"=>$error),2);
      }
    }
    //mylog($element,2);
    //mylog($datadefinitions[$datadefID_temp],2);
    /*
    if(isset($datadefinitions[$datadefID_temp]) and isset($element['datadefinition'])){
      //mylog($element['datadefinition'],2);
      array_extend($datadefinitions[$datadefID_temp],$element['datadefinition']);
      //mylog($datadefinitions[$datadefID_temp],2);
    }
    */
  }
}

function array_extend(&$result) {
  if (!is_array($result)) {
    $result = array();
  }

  $args = func_get_args();

  for ($i = 1; $i < count($args); $i++) {
    // we only work on array parameters:
    if (!is_array($args[$i])) continue;

    // extend current result:
    foreach ($args[$i] as $k => $v) {
      if (!isset($result[$k])) {
        $result[$k] = $v;
      }
      else {
        if (is_array($result[$k]) && is_array($v)) {
          array_extend($result[$k], $v);
        }
        else {
          $result[$k] = $v;
        }
      }
    }
  }

  return $result;
}
?>