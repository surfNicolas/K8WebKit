<?php
if(isset($pages[$page]['head'])){
  foreach($pages[$page]['head'] as $k => $v){
    $root=$GLOBALS['domain_hostpath'].str_repeat('../',$GLOBALS['script_depth']);
    $v=str_replace("{{domain_language}}", getFromArray($GLOBALS, "domain_language"), $v);
    echo str_replace("{{root}}",$root, $v);
  }
}