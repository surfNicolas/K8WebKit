<script>
var datadeffriends=<?php $datadefIDtemp="k8loginfriends";$error="";echo json_encode(getDatadefinition($datadefIDtemp,$error,getFromArray($_SESSION,'userID',0)),JSON_NUMERIC_CHECK);?>;
datadeffriends.masterdata.script_depth="<?php echo $GLOBALS['script_depth'];?>";
var GLOBAL_roles=<?php echo json_encode($GLOBALS['domain_roles']);?>;
</script>
