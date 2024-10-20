<?php
if($this->bload($this->postfields['userID'])){
  $this->dat['settings']=json_decode($this->dat["settings"],true);
  $_SESSION['dat_user']=$this->dat;
}

