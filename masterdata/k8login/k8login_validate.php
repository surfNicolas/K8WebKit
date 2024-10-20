<?php
$roles=getfromarray($_SESSION,'roles',array());
if(isset($this->postfields['roles'])){
  if(in_array(1,$roles) or in_array(2,$roles)){
    /*
    $roles_post=explode(",",$this->postfields['roles']);
    $roles_post=\array_diff($roles_post,["2"]);
    $this->postfields['roles']=implode(",",$roles_post);
    */
  }else{
    unset($this->postfields['roles']);
    unset($this->postfields['active']);
  }
}
if(in_array(1,$roles) or in_array(2,$roles)){
  $userID=getfromArray($this->postfields,"userID",0);
  $password=getfromArray($this->postfields,"password",0);
  if(gbnull($userID) && gbnull($password))$this->postfields['password']=generateStrongPassword();
}else{
  $userID=getfromArray($_SESSION,"userID",0);
}

$email=getfromArray($this->postfields,'email');
if(!gbnull($email)){
  if($email==$GLOBALS["domain_testemail"]){
    // made for test only
  }else if($this->dbclass->bexist("k8login","userID<>".$userID." and email=".gsstr2sql($email))){
    //$this->error="email already exists!";
    $this->error="email not available!";
  }
}
$username=getfromArray($this->postfields,'username');
if(!gbnull($username)){
  if($this->dbclass->bexist("k8login","userID<>".$userID." and username=".gsstr2sql($username))){
    //$this->error="username already exists!";
    $this->error="username not available!";
  }
}

function generateStrongPassword($length = 9, $add_dashes = false, $available_sets = 'luds')
{
	$sets = array();
	if(strpos($available_sets, 'l') !== false)
		$sets[] = 'abcdefghjkmnpqrstuvwxyz';
	if(strpos($available_sets, 'u') !== false)
		$sets[] = 'ABCDEFGHJKMNPQRSTUVWXYZ';
	if(strpos($available_sets, 'd') !== false)
		$sets[] = '23456789';
	if(strpos($available_sets, 's') !== false)
		$sets[] = '!@#$%&*?';

	$all = '';
	$password = '';
	foreach($sets as $set)
	{
		$password .= $set[array_rand(str_split($set))];
		$all .= $set;
	}

	$all = str_split($all);
	for($i = 0; $i < $length - count($sets); $i++)
		$password .= $all[array_rand($all)];

	$password = str_shuffle($password);

	if(!$add_dashes)
		return $password;

	$dash_len = floor(sqrt($length));
	$dash_str = '';
	while(strlen($password) > $dash_len)
	{
		$dash_str .= substr($password, 0, $dash_len) . '-';
		$password = substr($password, $dash_len);
	}
	$dash_str .= $password;
	return $dash_str;
}