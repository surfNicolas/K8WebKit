<?php
if(getFromArray($this->postfields,'status',0)==1){
  $fieldsmissing=array();
  $keyvalue=getfromArray($this->postfields,$this->key,0);
  if(gbnull($keyvalue)){
    $this->error='save first preparation status';
  }else{
    if(!$this->dbclass->bexist('k8references','clientID='.$this->clientID.' and basetype="'.$this->db->real_escape_string($this->table).
            '" and baseID="'.$this->db->real_escape_string($keyvalue).'" and type="image"')){
      $this->error.='upload picture please';
    }
  }
  if(gbnull(getFromArray($this->postfields,'componentnumber')))$fieldsmissing[]='componentnumber';
  if(gbnull(getFromArray($this->postfields,'text1')))$fieldsmissing[]='text1';
  if(gbnull(getFromArray($this->postfields,'textdimensions')))$fieldsmissing[]='textdimensions';
  if(gbnull(getFromArray($this->postfields,'descriptionlong')))$fieldsmissing[]='descriptionlong';
  if(count($fieldsmissing)>0){
    $this->error=gsclauseand($this->error,'missing fields: '.implode(',',$fieldsmissing),true,", ");
  }
}