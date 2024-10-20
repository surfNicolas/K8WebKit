<?php // 2022 Copyright Klaus, 2022-10-25
session_start();
$GLOBALS['script_depth']=0;
include "masterdata/_init.php";
include("masterdata/BasicFunctions.php");
$datadefID=getfromArray($_GET,"datadefID",0);
$table=getfromArray($_GET,"table");
$connector=getfromArray($_GET,"connector");

include "masterdata/_datadefinitions.php";
$error="";
if(gbnull($connector)){
  getDatadefinition($datadefID,$error,"",0,$table,0,true,0);
}else{
  if(createDatadefinition(array("table"=>$table,"datadefID"=>$datadefID,"connector"=>$connector), $error)){
  }
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>get_datadefinition</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="shortcut icon" href="img/webkitfavicon.ico">
 
  <!--************************** bootstrap ************************** -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

  <style>
	#result{
			min-height: 500px;
			width: 100%;
			border: 1px solid #ccc;
			border-radius: 5px;
            margin-bottom: 10px;
	}
    </style>
</head>

<body>
<main class="container-fluid">
	<div class="container mycontainerbg">
		<h1>Datadefinition</h1>
        <?php if(gbnull(getfromArray($_GET,'datadefID')) and gbnull(getfromArray($_GET,'table'))){
            echo "<p>";
            echo "<strong>masterdata</strong>, fill in and add to url: ?table=&datadefID=<br>";
            echo "<strong>catalog</strong>, fill in and add to url: ?table=&datadefID=&headtitlecolumn=&headdescriptioncolumn=<br>";
            echo "&spaces=2, (2 or 4=default)";
            echo "</p>";
        }
        ?>
<!-- <pre id="result">-->
<textarea id="result">
<?php
if(!gbnull($error)){
    echo "Error: ".$error;
    //echo "no datadefID!"; 
}else{
    //white-space: pre-wrap  https://stackoverflow.com/questions/49598336/line-breaks-in-textarea-and-pre/49598463
    //unset($datadefinitions[$datadefID]['columns']);
    //unset($datadefinitions[$datadefID]['masterdata']);
    if(isset($datadefinitions[$datadefID])){
      $spaces=getfromArray($_GET,'spaces',4);
      if($spaces==2){
        echo str_replace('    ','  ',json_encode($datadefinitions[$datadefID], JSON_PRETTY_PRINT));
      }else{
        echo json_encode($datadefinitions[$datadefID], JSON_PRETTY_PRINT);
      }
    }
}
?>
</textarea>
        <!--</pre> -->
        <div class="text-end p-top-small p-bottom-nor">
        <span>the copy clipboard method is not supported in IE8 and earlier.</span>
        <button class="btn btn-info text-end" onclick="myFunction(this)">to clipboard</button>
        </div>

        <script>
        function myFunction(el) {
          var el_copyText = document.getElementById("result");
          el_copyText.disabled=false;
          el_copyText.select();
          el_copyText.setSelectionRange(0, 99999);
          document.execCommand("copy");
          el_copyText.disabled=true;
          //alert("json copied to clipboard");
          el.innerHTML="copied";
        }
        </script>

        <!-- bootstrap js, if nessesary -->
        
        <noscript>
            This website is created with javascript and not work without it. Please turn on javascript!
        </noscript>
    </div>    
</main>    
</body>
</html>