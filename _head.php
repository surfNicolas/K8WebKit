<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="shortcut icon" href="img/webkitfavicon.ico">
<link rel="manifest" href="manifest.json" />

<!--************************** bootstrap ************************** -->
<link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="assets/vendor/bootstrap-icons/bootstrap-icons.min.css">    

<!--************************** tabulator ************************** -->
<link href="https://unpkg.com/tabulator-tables@6.2.5/dist/css/tabulator.min.css" rel="stylesheet">
<script type="text/javascript" src="https://unpkg.com/tabulator-tables@6.2.5/dist/js/tabulator.min.js"></script>
<script type="text/javascript" src="js/xlsx.full.min.js"></script>
<script type="text/javascript" src="<?php echo $GLOBALS['domain_hostpath'];?>js/luxon.min.js"></script>
<script type="text/javascript" src="<?php echo $GLOBALS['domain_hostpath'];?>js/jspdf.umd.min.js"></script>
<script type="text/javascript" src="<?php echo $GLOBALS['domain_hostpath'];?>js/jspdf.plugin.autotable.min.js"></script>

<!--
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/luxon/2.3.1/luxon.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.20/jspdf.plugin.autotable.min.js"></script>
-->

<!--************************** jQuery UI ************************** -->
<link rel="stylesheet" href="masterdata/css/jquery-ui.min.css"> 
<script src="masterdata/js/jquery.min.js"></script>
<script src="masterdata/js/jquery-ui.min.js"></script>
<script src="masterdata/js/jquery.serializejson.js"></script>
<script src="masterdata/js/jquery.ui.touch-punch.min.js"></script>

<!--************************** dropzone ************************** -->
<link href="css/dropzone.css" type="text/css" rel="stylesheet" />
<script src="js/dropzone.js"></script>

<!--************************** masterdata ************************** -->
<link href="masterdata/css/masterdata.css" rel="stylesheet">
<script src="masterdata/js/masterdata.js"></script>

<!--************************** language ************************** -->
<link href="css/flag-icon.css" rel="stylesheet">
<?php echo '<script src="masterdata/js/lang_sys_'.$domain_language.'.js"></script>';?>
<?php echo '<script src="js/lang_kitsamples_'.$domain_language.'.js"></script>';?>

<link href="css/example.css" rel="stylesheet">
<link href="css/k8webkitb5.css" rel="stylesheet">
<?php
$page_arr=getFromArray($pages,$page,array());
$head_include=getFromArray($page_arr,"head_include","_head_standard.php");
include $head_include;
?>
<?php if(!isset($datadefID)){$datadefID=0;}?>  
<?php datadefIDAreaLines($datadefID,'head');
if(count($site)>0){
  $elements=getfromArray($site,"elements",array());
  foreach($elements as $element){
    $datadefID_temp=getfromArray($element,"datadefID");
    if(!gbnull($datadefID_temp) and !($datadefID_temp=="k8pages" and $datadefID=="k8pages")){
      if(isset($datadefinitions[$datadefID_temp])){
        datadefIDAreaLines($datadefID_temp,'head');
      }
    }
  }
}
?> 