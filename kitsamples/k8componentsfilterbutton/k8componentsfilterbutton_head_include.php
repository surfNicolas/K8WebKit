<script>
var item_group=<?php
  $datadefID_temp='k8groups';
  $ok8groups=getDatadefinition($datadefID_temp,$error,'',0,'',1,true,-1);
  $data=$ok8groups->getEntries("type='item_group'");
  echo json_encode($data);
?>;  
</script>
<?php
  $bdefault=true;