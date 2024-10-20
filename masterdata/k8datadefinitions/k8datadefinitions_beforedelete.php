<?php
if($this->bload($ID)){
  if(substr($this->dat['mytable'],0,2)=='ex'){
    $sql="DROP table ".$this->dat['mytable'];
    $this->db->query($sql);
  }
  $folder=str_repeat('../',$GLOBALS['script_depth']).$GLOBALS['domain_projectpath'][0].'/'.$this->dat['mydatadefID'];
  rrmdir($folder);
}