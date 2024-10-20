<script>
var categoryarray=<?php 
    $result=$dbclass->GetFormMultiFrom('getSelectJson',"item_group");
    echo json_encode($result,JSON_NUMERIC_CHECK);?>;
<?php
$mydatadefID='k8groups';$error='';
$o=getDatadefinition($mydatadefID,$error,"",0,"",1,false,-1);
//mylog("k8groups.error=".$error,2);
$clause="type='item_group'";
$tabledata=$o->getentries($clause);
echo 'var grouparray='.json_encode($tabledata);
?>      
</script>   
<?php
  $bdefault=true;