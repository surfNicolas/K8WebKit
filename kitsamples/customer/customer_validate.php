<?php
if(gbnull($this->postfields['accountID']) and gbnull($this->postfields['accountnumber'])){
  $this->postfields['accountnumber']=$this->nextnumber('accountnumber','','',"°°°°°",1);
  /*
  if(gbnull(getfromArray($this->postfields,'categoryID'))){
    $clause="type='customer_group' and title='New'";
    $categoryID=$this->dbclass->lookup('groupID',"k8groups",$clause,0);
    $this->postfields['categoryID']=$categoryID;
  }
  */
}