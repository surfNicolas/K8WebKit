<?php
    $bdefault=true;
    if(!gbnull($datadefID)){
        if(isset($datadefinitions[$datadefID]["head_include"])){
            $bdefault=getfromArray($datadefinitions[$datadefID],'head_includedefault',false);
            foreach($datadefinitions[$datadefID]["head_include"] as $k => $v){
                include $v;
            }
        }
    }
    if(count($site)>0){
      $area="head_include";
      $elements=getfromArray($site,"elements",array());
      foreach($elements as $element){
        $datadefID_temp=getfromArray($element,"datadefID");
        if(!gbnull($datadefID_temp)){
          if(isset($datadefinitions[$datadefID_temp])){
            if(isset($datadefinitions[$datadefID_temp][$area])){
              foreach($datadefinitions[$datadefID_temp][$area] as $k => $v){
                include $v;
              }
            }
          }else{
            //mylog($datadefID_temp.' not set!',2);
          }
        }
      }
    }
    if($bdefault){
      ?>
    <script>
      var GLOBALS_urlmode='<?php echo $GLOBALS['domain_urlmode'];?>';
      var GLOBALS_id='<?php echo $GLOBALS['domain_id'];?>';
      var GLOBALS_hostpath='<?php echo $GLOBALS['domain_hostpath'];?>';
      var GLOBALS_serviceworker=<?php echo $GLOBALS['domain_serviceworker'];?>;
      var GLOBALS_projectpath='<?php echo $GLOBALS['domain_projectpath'][0];?>';
      var GLOBALS_registerenabled=<?php echo $GLOBALS['domain_registerenabled'];?>;
      var GLOBALS_registermode=<?php echo $GLOBALS['domain_registermode'];?>;
      var GLOBALS_useractive="<?php echo $GLOBALS['domain_useractive'];?>";
      var GLOBALS_readpassword=<?php echo $GLOBALS['domain_readpassword'];?>;
      var GLOBALS_pagelinks=<?php echo json_encode($GLOBALS['domain_pagelinks'][$GLOBALS['domain_langnative']]);?>;
      var GLOBALS_email={
        "activate":{
          "subject":getl('<?php echo $GLOBALS['domain_email']['activate']['subject'];?>'),
          "content":getl('<?php echo $GLOBALS['domain_email']['activate']['content'];?>')
        }
      };        
      var tabulator_export="";

      /*
      var GLOBALS_tabulatordatetimeformat="<?php echo $GLOBALS['tabulatordatetimeformat'];?>";
      var GLOBALS_tabulatordateformat="<?php echo $GLOBALS['tabulatordateformat'];?>";
      var GLOBALS_tabulatortimeformat="<?php echo $GLOBALS['tabulatortimeformat'];?>";
      var GLOBALS_decimal_point="<?php echo $GLOBALS['decimal_point'];?>";
      var GLOBALS_thousands_sep="<?php echo $GLOBALS['thousands_sep'];?>";
      */
      var GLOBALS_tabulatordateformat=getLuxonLocaleDateString();
      var GLOBALS_tabulatortimeformat=getLuxonLocaleTimeString();
      var GLOBALS_tabulatordatetimeformat=GLOBALS_tabulatordateformat+' '+GLOBALS_tabulatortimeformat;
      var GLOBALS_decimal_point='.';
      var GLOBALS_thousands_sep=',';
      if((1.1).toLocaleString().substring(1,2)==','){
        GLOBALS_decimal_point=',';
        GLOBALS_thousands_sep='.';
      }
<?php if(gbnull(getfromArray($_SESSION,'tabulatordatetimeformat'))):?>
      /*
      GLOBALS_tabulatordatetimeformat="dd/MM/yyyy hh:mm a";
      GLOBALS_tabulatordateformat="dd/MM/yyyy";
      GLOBALS_tabulatortimeformat="hh:mm a";
      */
     
      var url=GLOBALS_hostpath+"masterdata/ProcessMethod.php?process_action=setdatestring";
      var params={
        tabulatordatetimeformat:GLOBALS_tabulatordatetimeformat,
        tabulatordateformat:GLOBALS_tabulatordateformat,
        tabulatortimeformat:GLOBALS_tabulatortimeformat,
        decimal_point:GLOBALS_decimal_point,
        thousands_sep:GLOBALS_thousands_sep,
      };
      $.getJSON(url,params,function(oJson) {
      })
      .fail(function(jqxhr, textStatus, error ) {
          var err = textStatus + ", " + error;
          console.log( "data load, Request Failed: " + err );
      });
<?php endif?>
      
      var GLOBALS_url_logout="<?php echo $GLOBALS['domain_url_logout'];?>";
      var GLOBALS_url_login="<?php echo $GLOBALS['domain_url_login'];?>";
      var GLOBALS_url_termsofuse="<?php echo $GLOBALS['domain_url_termsofuse'];?>";
      var GLOBALS_domain_systemmessage="<?php echo $GLOBALS['domain_systemmessage'];?>";
      var GLOBALS_pages_masterdata1=<?php echo json_encode(array_merge(array("masterdata"),ArrayIndexFromPropertyFilter($GLOBALS['pages'], "js_display","=","masterdata1")));?>;
      var GLOBALS_pages_html1=<?php echo json_encode(array_merge(ArrayIndexFromPropertyFilter($GLOBALS['pages'], "js_display","=","html1")));?>;
      var GLOBALS_script_depth="<?php echo $GLOBALS['script_depth'];?>";
      var GLOBALS_languages=<?php echo json_encode(getfromArray($GLOBALS,'domain_languages',array()));?>;
      var GLOBALS_language="<?php echo $GLOBALS['domain_language'];?>";
      var GLOBALS_indexfile="<?php echo $GLOBALS['domain_indexfile'];?>";
      var GLOBALS_menumode="<?php echo $GLOBALS['domain_menumode'];?>";
      var GLOBALS_layout="<?php echo $GLOBALS['domain_layout'];?>";
      var GLOBALS_classheader="<?php echo $GLOBALS['domain_classheader'];?>";
      var GLOBALS_classmain="<?php echo $GLOBALS['domain_classmain'];?>";
      var pages=<?php echo json_encode(getfromArray($GLOBALS,'pages',array()));?>;
      var dat_user=<?php echo json_encode(getfromArray($_SESSION,'dat_user',array()));?>;
      var GET=<?php echo json_encode($_GET,JSON_NUMERIC_CHECK);?>;
      var languageID=<?php echo glclng($GLOBALS['domain_languageID']);?>;
      var keyvalue=<?php echo $keyvalue;?>;
      var page="<?php echo $page;?>";
      var pagetype="<?php echo $pagetype;?>";
      var datadefID=<?php echo iif(is_numeric($datadefID),$datadefID,"'$datadefID'");?>;
      var table='<?php echo $table;?>';
      var layout='<?php echo $layout;?>';
      var systemmessage='<?php echo getfromarray($GLOBALS,'domain_systemmessage');?>';
      var bwithpagetimer=<?php echo iif(getfromArray($_SESSION,'userID',0)>0 and !isset($_COOKIE['login']),1,0);?>;  
      var userID=<?php echo getFromArray($_SESSION,'userID',0);?>;
      var GLOBALS_rightmode="<?php echo $GLOBALS['domain_rightmode'];?>";
      var rightgroupID='<?php echo getfromarray($_SESSION,'rightgroupID');?>';
      var superuser=<?php 
$arr=getFromArray($_SESSION,'roles',array());
//echo iif(in_array(2,$arr),1,0);
echo iif(in_array(2,$arr),'true','false');?>;
      var admin=<?php 
$arr=getFromArray($_SESSION,'roles',array());
//echo iif(in_array(1,$arr),1,0);
echo iif(in_array(1,$arr),'true','false');?>;
  var k8menudisp=<?php
if(($GLOBALS['domain_menumode']==2 or $GLOBALS['domain_menumode']==3 or $GLOBALS['domain_menumode']==4) and isset($GLOBALS['k8db'])){
  $datadefID_temp="k8menudisp";
  $error="";
  $o=getDatadefinition($datadefID_temp,$error,"",0,"",1,true,-1);
  $myclause="parentID=0";
  //if($GLOBALS['domain_menumode']==4 and !gbnull($_SESSION['userID']))$clause=gsclauseand($clause,"creatorID=".$_SESSION['userID']);
  $data=$o->getEntries($myclause);
  if($data){
    echo json_encode($data,JSON_NUMERIC_CHECK);
  }else{
    echo '[]';
  }
}else{
  echo '[]';
}?>;
      var settings=<?php if(isset($datadefinitions[$datadefID])){
          echo json_encode($datadefinitions[$datadefID],JSON_NUMERIC_CHECK);}else{echo '{}';}
          if(!gbnull($datadefID))$GLOBALS['domain_datadefIDs_declared'][]=$datadefID;
          ?>;
<?php if(!gbnull($datadefID))echo "var settings".str_replace('-','_',$datadefID)."=settings;";?>
      if(isset(dat_user,'settings','datadefinitions',datadefID)){
        settings = $.extend(true, settings, dat_user['settings']['datadefinitions'][datadefID]);
      }
      // restore column width for masterdata
      if(isset(dat_user,'settings','datadefinitions',datadefID,'masterdata','tabcolumns')){
        settings.masterdata.tabcolumns=dat_user.settings.datadefinitions[datadefID].masterdata.tabcolumns;
      }else if(isset(settings,"masterdata")){
        settings.masterdata.tabcolumns={};
      }
      if(isset(settings,"masterdata"))settings.masterdata.url_saveuser="masterdata/ProcessData.php?datadefID=k8login&process_action=Save";
      nestedLoop(settings);  // replace placeholders
<?php
//mylog(array('domain_datadefIDs_declared'=>$GLOBALS['domain_datadefIDs_declared']),2);
if(count($site)>0){
  $elements=getfromArray($site,"elements",array());
  $i=0;
  foreach($elements as $element){
    $datadefID_temp=getfromArray($element,"datadefID");
    if(!gbnull($datadefID_temp)){
      if(isset($datadefinitions[$datadefID_temp])){
        if(!in_array($datadefID_temp, $GLOBALS['domain_datadefIDs_declared'])){
          echo "var settings".$datadefID_temp."=".json_encode($datadefinitions[$datadefID_temp],JSON_NUMERIC_CHECK).";\r\n";
          $GLOBALS['domain_datadefIDs_declared'][]=$datadefID_temp;
          echo "nestedLoop(settings".$datadefID_temp.");\r\n";
        }
        // copy element to masterdata
        if(in_array($datadefID_temp,$datadefIDs_double)){
          $element['datadefalias']=$datadefID_temp.$i;
          if(isset($element['datadefinition'])){
            echo "var element=".json_encode($element,JSON_NUMERIC_CHECK).";\r\n";
            echo "settings".$datadefID_temp.$i."="."$.extend(true,{},settings".$datadefID_temp.",element.datadefinition);\r\n";
          }
          //echo "nestedLoop(settings".$datadefID_temp.");\r\n";
        }else{
          if(isset($element['datadefinition'])){
            echo "var element=".json_encode($element,JSON_NUMERIC_CHECK).";\r\n";
            echo "settings".$datadefID_temp."="."$.extend(true,{},settings".$datadefID_temp.",element.datadefinition);\r\n";
          }
          //echo "nestedLoop(settings".$datadefID_temp.");\r\n";
        }
      }else{
        mylog($datadefID_temp.' not set!',2);
      }
    }
    $i++;
  }
}?>
<?php datadefIDsettingsadditional($datadefID);
if(count($site)>0){
  $elements=getfromArray($site,"elements",array());
  foreach($elements as $element){
    $datadefID_temp=getfromArray($element,"datadefID");
    if(!gbnull($datadefID_temp) and !($datadefID_temp==$datadefID)){
      if(isset($datadefinitions[$datadefID_temp])){
        datadefIDsettingsadditional($datadefID_temp);
      }
    }
  }
}?>
      if(isset(settings,'masterdata'))settings.masterdata.script_depth=<?php echo $GLOBALS['script_depth'];?>;
      settings.data=<?php if(count($dataws)){echo json_encode($dataws,JSON_NUMERIC_CHECK);}else{echo '[]';};?>;
    </script>
<?php }?>
<?php if(isset($datadefinitions[$datadefID]) and getfromArray($_SESSION,'userID',0)>0 and isset($_COOKIE['login'])):?>
  <script>if(!isset(settings,"masterdata",'cbConnectionfail')){
    k8.datadefConnectionfailAdd(settings);
  }</script>
<?php endif?>