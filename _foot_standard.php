<?php
if(isset($pages[$page]['foot'])){
  foreach($pages[$page]['foot'] as $k => $v){
    $root=$GLOBALS['domain_hostpath'].str_repeat('../',$GLOBALS['script_depth']);
    $v=str_replace("{{domain_language}}", getFromArray($GLOBALS, "domain_language"), $v);
    echo str_replace("{{root}}",$root, $v);
  }
}