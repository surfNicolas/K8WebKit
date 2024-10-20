<?php
$username=$this->dbclass->lookup("username","k8login","userID=".$ID);
if($username=="demo"){
  $this->error="not allowed!";
  $bok=false;
}else{
  $this->db->query("DELETE FROM k8loginfriends WHERE userID=".$ID);
  // add your tables here
}

