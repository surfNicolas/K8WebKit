<?php // 2020-06-02 Copyright Klaus Eisert
class data_session{
    // data is stored in session
    public $table;
    public $key;
    public $keyvalue;
    public $postfields;
    public $colobject;
    public $error;
    public $rightcheck;
    public $colarray;
    
    public function __construct($datadefinition) {
        $this->rightcheck=0;
        $this->table=$datadefinition['table'];
        $this->key=$datadefinition['key'];
        if(isset($datadefinition['columns']))$this->colobject=table2colobject($datadefinition['columns'],$this->colarray);

        if(0){echo '<pre>';
        print_r($datadefinition);
        echo '</pre>';
        }

        //$_SESSION['tables'][$this->table][recno=ID][fieldname][value]
        if(!isset($_SESSION['tables'][$this->table])){
            if($datadefinition['data']){
                foreach($datadefinition['data'] as $dat){
                    //echo '<pre>';print_r($dat);echo '</pre>';
                    $_SESSION['tables'][$this->table][$dat['ID']]=$dat;
                }
            }else{
                // error
                echo 'data_session.__construct: no data'.'<br>';
            }
    
        }
    }

    public function bsettable($datadefinition){
        //$this->table=$datadefinitions['table'];
        //$this->key=$datadefinitions['key'];
        //$this->colobject=table2colobject($datadefinitions['columns']);
    }
    
    public function initType($typeID=0,$bnew=0) {
    }

    public function init($typeID){
        Global $settings;
        Global $generaldateformat;

        $dat=array();
        foreach($_GET as $k=>$v){
            if(isset($this->colobject['$k'])){
                if(0){
                    // no keycolumn
                }else{
                    $dat[$k]=$v;
                }
            }
        }
        $this->dat=$dat;
        $this->data=array();
        $this->data[0]=$this->dat;
        return $dat;
    }

    public function getError() {
        return $this->error;
    }

    public function bvalidate($postfields) {
        $this->postfields=$postfields;
        $this->keyvalue=getfromArray($this->postfields,$this->key);
        $this->error='';

        // validation
        // $this->error=''

        return gbnull($this->error);
    }

    public function validate(&$postfields) {
        // Rüpckgabe $error
        Global $langclass;
        Global $langmodule;
        Global $prep_output;
        Global $formname;
        Global $settings;
        Global $generaldateformat;
        $action=getfromarray($_GET,"action",'');
        $bnew=($action=="New");
        //$this->initType($postfields["typeID"],$bnew);
        $error="";
        
        //Besonderheiten checkbox
        /*if(strpos($this->fieldsdisplay,"[aktiv]")!==false){
            $postfields["aktiv"]=getfromarray($postfields,"aktiv",1);
        }*/ 

        //echo '<pre>';
        //print_r($postfields);
        //echo '</pre>';

        $postfields=gformatpostfields($postfields, $this->fieldsnum.$this->fieldscur,$this->fieldsdate);   //change formatting of numeric and date fields
        $datatype=gbGetDatatype($this->table);                          
        $this->check->gbcheckinput($datatype,$postfields,$error);
        gbnofields_missing($postfields,$error,$this->fieldsbool,$this->fieldsrequired,$prep_output,$formname); //required fields
        
        if(gbnull(getfromarray($postfields,'creatorID','')))$postfields['creatorID']=getfromarray($_SESSION,'userID',0);
        
        return $error;
    }

    public function save(){
        if(0){
        echo '<pre>';
        print_r($this->postfields);
        echo '</pre>';}
        
        $result=0;
        if(gbnull($this->keyvalue)){
            $result=$this->add();
        }elseif($this->bexist($this->keyvalue,0,1)){
            $result=$this->update();
        }else{
            $this->error=$ID.' doesn`t exists!<br>';
        }
        return $result;
    }
    
    public function add() {
        Global $langclass;
        $result=glclng(max(array_keys($_SESSION['tables'][$this->table])))+1;
        $this->postfields[$this->key]=$result;
        $_SESSION['tables'][$this->table][$result][$this->key]=$result;
        foreach($this->postfields as $col=>$v) {
            if (isset($this->colobject[$col])){
                $_SESSION['tables'][$this->table][$result][$col]=$v;
            }
        }
        if(0){echo '<pre>';
            print_r($_SESSION['tables'][$this->table]);
            echo '</pre>';}
        return $result;
    }
    
    public function update() {
        Global $langclass;

        $result=$this->keyvalue;
        if(gbnull($this->keyvalue)){
            $this->error='keyvalue not set';
        }else{
            foreach($this->postfields as $col=>$v) {
                if (isset($this->colobject[$col])){
                    //echo $col.' vorher: '.$_SESSION['tables'][$this->table][$result][$col].'<br>';
                    $_SESSION['tables'][$this->table][$result][$col]=$v;
                    //echo $col.': '.$_SESSION['tables'][$this->table][$result][$col].'<br>';
                }
            }
        }
        return $result;   
    }

    public function bexist($ID=0){
        if(gbnull($ID))return 0;
        return isset($_SESSION['tables'][$this->table][$ID]);
    }
    
    public function bloadrec(){
        $ID=getFromArray($this->postfields,$this->key);
        $filters[]=array("field"=>$this->key,"type"=>"=","value"=>$ID);
        return (boolean)$this->getentries($filters);
    }
    
    public function bload($ID,$bintern=0,$brightok=0){
        $filters[]=array("field"=>$this->key,"type"=>"=","value"=>$ID);
        return (boolean)$this->getentries($filters);
    }

    public function getEntries($filters) {  // /*datadefID*/
        Global $gdatareadlimit;
        Global $langclass;
        Global $settings;
        $this->data=array();
        $this->dat=array();
        $result=array();
        $filter='';

        foreach($_SESSION['tables'][$this->table] as $k=>$dat){
            // -------------- filter
            //filters[0][field]=name&filters[0][type]=like&filters[0][value]=b
            //echo $dat['name'].'<br>';
            $filterok=true;
            if(is_array($filters)){
                foreach($filters as $filter){
                    if(substr($filter['value'],0,2)==='>='){
                        $filter['type']='>=';
                        $filter['value']=substr($filter['value'],-strlen($filter['value'])+2);
                    }elseif(substr($filter['value'],0,2)==='<='){
                        $filter['type']='<=';
                        $filter['value']=substr($filter['value'],-strlen($filter['value'])+2);
                    }elseif(substr($filter['value'],0,1)==='>'){
                        $filter['type']='>';
                        $filter['value']=substr($filter['value'],-strlen($filter['value'])+1);
                    }elseif(substr($filter['value'],0,1)==='<'){
                        $filter['type']='<';
                        $filter['value']=substr($filter['value'],-strlen($filter['value'])+1);
                    }elseif(substr($filter['value'],0,2)==='!='){
                        $filter['type']='!=';
                        $filter['value']=substr($filter['value'],-strlen($filter['value'])+2);
                    }elseif(substr($filter['value'],0,1)==='='){
                        $filter['type']='=';
                        $filter['value']=substr($filter['value'],-strlen($filter['value'])+1);
                    }


                    //echo $dat[$filter['field']].'&gt;='.$filter['value'].'<br>';
                    $value=$filter['value'];
                    $dat_value=$dat[$filter['field']];
                    $mytype=$this->colobject[$filter['field']]['mytype'];
                    if(tablefieldtype($this->colobject[$filter['field']]['mytype'])=='DATE'){
                        if(isdate($filter['value'])){
                            $value=trim(strtotime($filter['value']));
                            $dat_value=trim(strtotime($dat[$filter['field']]));
                        }else{
                            $filterok=false;
                        }
                    }elseif(is_tablefieldnumeric($mytype)){
                        $value=str_replace(',','.',$value);
                        if(is_numeric($value)){
                            $value=floatval($value);
                        }
                    }

                    //echo $dat_value.$filter['type'].$value.'<br>';
                    //echo instr($dat_value,$value).'<br>';
                    if($filter['type']==='like'){
                        if(instr(strtolower($dat_value),strtolower($value))==-1)$filterok=false;
                    }elseif($filterok){
                        /*
                        if($filter['type']==='>=')$filterok=($dat_value>=$value);
                        if($filter['type']==='<=')$filterok=($dat_value<=$value);
                        if($filter['type']==='>')$filterok=($dat_value>$value);
                        if($filter['type']==='<')$filterok=($dat_value<$value);
                        if($filter['type']==='!=')$filterok=($dat_value!=$value);
                        if($filter['type']==='=')$filterok=($dat_value==$value);
                         */
                        if($filter['type']==='>=')$filterok=(strtolower($dat_value)>=strtolower($value));
                        if($filter['type']==='<=')$filterok=(strtolower($dat_value)<=strtolower($value));
                        if($filter['type']==='>')$filterok=(strtolower($dat_value)>strtolower($value));
                        if($filter['type']==='<')$filterok=(strtolower($dat_value)<strtolower($value));
                        if($filter['type']==='!=')$filterok=(strtolower($dat_value)!=strtolower($value));
                        if($filter['type']==='=')$filterok=(strtolower($dat_value)==strtolower($value));
                    }
                    //$filter['field']
                    //$filter['type']
                    //$filter['value']
                }
            }
            /*
            if(count($filters)>0){
                $filterok=($dat['ID']===1 or $dat['ID']===2);
            }
            */
            if($filterok){
                $result[]=$dat;
            }
        }
        $this->data=$result;
        if(count($this->data)>0){$this->dat=$this->data[0];}
        if(0){
            echo "<pre>";
            print_r($result);
            echo "</pre>";
        }
        return $result;       
    }
    
    public function delete($ID) {
        Global $settings;
        Global $langclass;
        $this->error='';
        $bok=0;
        if(!is_numeric($ID)) return false;
        $ID = (int)$ID;
        $result=false;

        $bok=1; // check rigths

        if($bok){
            if(isset($_SESSION['tables'][$this->table][$ID])){
                unset($_SESSION['tables'][$this->table][$ID]);
                $result=true;
            }else{
                $this->error='dont exist';
            }
        }
        return (boolean)$result;
    }
}