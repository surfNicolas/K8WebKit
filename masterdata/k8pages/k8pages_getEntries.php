<?php
if(!gbnull($record['settings'])){
  $settings=@json_decode($record['settings'],true);
  if(is_array($settings))$record=array_merge($settings,$record);
}