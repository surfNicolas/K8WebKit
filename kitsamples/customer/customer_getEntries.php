<?php
$record["phonedial"]=str_replace(" ","",preg_replace("/\([^)]+\)/","",$record["phone"]));
$record["mobiledial"]=str_replace(" ","",preg_replace("/\([^)]+\)/","",$record["mobile"]));