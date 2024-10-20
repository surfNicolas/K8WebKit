<?php //  2023-09-22, copyright Klaus Eisert
require_once "class_check.php";

class data_accessclass{  /*datadefID*/
    public $datadefinition;
    public $datadefID;
    public $db;
    public $dbclass;
    public $error;
    public $table;
    public $clientID;
    public $creatorID;
    public $companyID;
    public $creatormode;
    public $colobject;
    
    public $fieldssystem;
    public $fieldlist;
    public $fieldsnum;
    public $fieldscur;
    public $fieldsdate;
    public $fieldsbool;
    public $key;
    public $keyvalue;
    public $displaycolumn;
    public $parentcolumn;
    public $treearrayname;

    public $sql;
    public $sql_statement;
    public $orderby;
    public $sql_base;    
    
    public $fieldsdisplay;
    public $fieldsrequired;
    public $fieldsmissing;
    public $fieldlistlist;
    public $check;
    
    public $postfields;
    public $data;
    public $dat;
    public $output;
    public $bdatfrompost;
    
    public $roleID;
    public $roles;
    public $permit;
    public $rightcheck; // default=1
    
    public $bobjectread;
    public $type;   // festgelegte Eigenschaft für datadefinitions->bshowlist, muß vor getentries gefüllt sein
    public $header;

    public $rightmode;  // depricated
    public $omaster;
    public $masterkey;  
    public $masterdatadefID;
    public $childs;
    public $baddimage;
    public $overwritecreatorID;
    public $include;
    public $colarray;
    public $echo;
    
    public function __construct($datadefinition,$bonlycheck=false) {
        GLOBAL $datadefinitions;
        $this->echo=0;
        mylog("__construct ".getfromarray($datadefinition,"datadefID"),$this->echo);
        //echo '<pre>';
        //print_r($datadefinition);
        //echo '</pre>';
        $this->datadefinition=$datadefinition;
        $this->datadefID=getfromarray($datadefinition,"datadefID");
        $this->table=$datadefinition['table'];
        $this->key=$datadefinition['key'];
        $this->displaycolumn=getFromArray($datadefinition,'displaycolumn');
        $this->importkey=getFromArray($datadefinition,'importkey');
        $this->colarray['num']=array();
        if(isset($datadefinition['columns'])){
          $this->colobject=table2colobject($datadefinition['columns'],$this->colarray,getFromArray($datadefinition,'revision',0)<2);
        }else if($bonlycheck){
        }else{
          $this->error="no columns[]";
        }
        mylog($this->colobject,$this->echo);
        $this->clientID=getFromArray($_SESSION,"clientID",0);
        $this->creatorID=getfromarray($_SESSION,"userID",0);  //,getfromarray($_COOKIE,"userID",0));
        $this->companyID=getfromarray($_SESSION,"companyID",0);

        $this->keyvalue=0;
        $this->include=array();

        $this->creatormode=1;   // 0=no creator, 1=creatorID, 2=creator.creatorID, 3=companyID
        $this->sql_base='';
        $this->sql='';

        $this->dbclass = new dbclass();
        if(!gbnull($this->dbclass->error)){
            $this->error=$this->dbclass->error;
            return false;
        }
        $this->db = $this->dbclass->db;        

        $this->check= new check();
        $this->data=array();
        $this->dat=array();
        $this->output='';
        $this->bdatfrompost=0;
        $this->postfields='';
                  
        //deprecated:
        $this->rightmode=getfromarray($datadefinition,'rightmode'); //0=Standard new, 1=parent, 2=old

        // --------------------- master
        $this->omaster=0;
        $this->masterkey=getfromarray($datadefinition,'masterkey');
        $this->masterdatadefID=getfromarray($datadefinition,'masterdatadefID');
        if(!gbnull($this->masterdatadefID)){
          //echo '$this->masterdatadefID='.$this->masterdatadefID.'<br>';
          if(!isset($datadefinitions[$this->masterdatadefID]))getDatadefinition($this->masterdatadefID,$this->error,"",0,'',0,true,-1);
          //getDatadefinition(&$datadefID,&$error,$masterkeyvalue="",$rightuser_create_master=0,$table='',$ret=0,$placeholders=true,$objectives=1){          
          $this->omaster=new $datadefinitions[$this->masterdatadefID]['objectclass']($datadefinitions[$this->masterdatadefID]);
        }
        
        // 0=public, 1=admin client, 2=superuser, 3=member, 4=company, 5=friend
        if(isset($_SESSION['roles']) and is_array($_SESSION['roles'])){
            if(count($_SESSION['roles'])==0){
                $_SESSION['roles']=array(0=>0);
            }
            $this->roles=$_SESSION['roles'];
        }else{
          $this->roles[0]=0;
        }
        //$this->roleID=getFromArray($_SESSION,'roleID',0);
        //$this->roles[]=$this->roleID;
        //$this->roles[]=5;
        
        $this->overwritecreatorID=false;
        if(isset($datadefinition['masterdata']['role_change_creator'])){
          $role_change_creator=$datadefinition['masterdata']['role_change_creator'];
          $this->overwritecreatorID=in_array($role_change_creator, $this->roles);
        }
        if($this->overwritecreatorID){
          $this->colobject['creatorID']['noinsert']=0;
          $this->colobject['creatorID']['noupdate']=0;
        }
        
        $this->parentcolumn=getFromArray($datadefinition,'parentcolumn');
        $this->treearrayname=getFromArray($datadefinition,'treearrayname');
        
        if(isset($this->datadefinition['masterdata'])){
          $this->sql_statement=getfromarray($this->datadefinition['masterdata'],'sql_statement');
          $this->orderby=getfromarray($this->datadefinition['masterdata'],'sql_orderby');
        }else{
          $this->datadefinition['masterdata']=array();
        }
        
        if(getfromarray($this->datadefinition['masterdata'],'defaultrights',1)){
          if(gbnull($this->masterdatadefID)){
            $this->permit=$GLOBALS['domain_defaultrights'];
          }else{
            //$this->permit=array("create"=>array(0=>0,1=>1,2=>2,3=>1000),"read"=>array(0=>0,1=>1,2=>2,3=>1000),"update"=>array(0=>0,1=>1,2=>2,3=>1000),"delete"=>array(0=>0,1=>1,2=>2,3=>1000));
          }
        }
        $this->rightcheck=getfromarray($this->datadefinition,'rightcheck',1); //0=no check, 1=matrix
        if($this->datadefinition['table']=='k8login'){
          $this->permit["read"]=array(3=>10);
          $this->rightcheck==1;
        }
        /*
        echo '<pre>';
        print_r($this->datadefinition);
        print_r($this->permit);
        echo '</pre>';
         */
        mylog($this->datadefinition['masterdata'],$this->echo);
        
        //loop datadefinition rights
        if(isset($this->datadefinition['masterdata']['rights'])){
          foreach($this->datadefinition['masterdata']['rights'] as $access=>$i){
              foreach($i as $group => $v){
                //echo '$access='.$access.' $group='.$group.'<br>';
                $this->permit[$access][$group]=$v;
              }
          }
        }
        
        if(!isset($this->datadefinition['masterdata']['upload'])){
          $this->datadefinition['masterdata']['upload']=array();
        }
        $this->baddimage=getfromarray($this->datadefinition['masterdata']['upload'],'enabled',0);
        if($this->baddimage){
            //$datadefimageID=8;
            $datadefimageID=$GLOBALS['domain_datadefIDatt'];
            if(!isset($datadefinitions[$datadefimageID]))getDatadefinition($datadefimageID,$this->error);
        }

        // ---------------------------- childs
        $this->childs=array();
        if(isset($datadefinition['childs'])){
          $this->childs=$datadefinition['childs'];
          foreach($datadefinition['childs'] as $index => $child){
            //mylog("child: ".getfromArray($child,'datadefID',getfromArray($child,"table")),$this->echo);
            $bloadcolumns=true;
            if($bloadcolumns){
              if(!isset($child['columns'])){
                $child['columns']=$this->dbclass->ShowTable($child['table'],$child['key']);
                mylog("generate child columns",$this->echo);
              }
              $this->childs[$index]['objectclass']=$child['objectclass'];

              if(isset($child['requiredfile']))$this->childs[$index]['requiredfile']=$child['requiredfile'];
              //echo '$requiredfile='.$requiredfile.'<br>';
              $requiredfile=getfromArray($this->childs[$index],'requiredfile');
              if(!gbnull($requiredfile))require_once $requiredfile;

              $this->childs[$index]['fieldname']=$child['fieldname'];
              if(0){echo "<pre>";print_r($child);echo "</pre>";}
              $this->childs[$index]['o_class']=new $child['objectclass']($child);
            }
          }
        }
        
        if(isset($datadefinition['masterdata']['include'])){
          foreach($datadefinition['masterdata']['include'] as $k=>$v){
            $this->include[$k]=$v;
          }
        }

    }
    
    public function Gettable(){
      return $this->table;
    }

    public function initType($typeID=0,$bnew=0) {
        Global $settings;
        Global $prep_output;
        if(1){  //$typeID
            //$this->fieldsdisplay.='';
            //$this->fieldsrequired.='';
        }
        //echo 'fieldsdisplay:'.$this->fieldsdisplay.'<br>';
    }

    public function init($arr=[]){
        Global $settings;
        Global $generaldateformat;

        /*&&class__init&&*/
        /*&&class_init&&*/

        $dat=array();

        foreach($this->colobject as $k=>$col){
            if(isset($this->colobject[$k]['mydefault'])){
                $dat[$k]=$this->colobject[$k]['mydefault'];
            }else{
                $dat[$k]='';
            }
            if(isset($arr[$k])){
                $dat[$k]=$arr[$k];
            }
            
        }

        foreach($_GET as $k=>$v){
            if(isset($this->colobject[$k]) and $k<>$this->key){
                $dat[$k]=$v;
            }
        }
        if(0){echo '<pre>';print_r($dat);echo '</pre>';}
        $this->dat=$dat;
        $this->data=array();
        $this->data[0]=$this->dat;
        return $dat;
    }
    public function getNextSort($clause,$inc=10,$sortcolumn="sort"){
        //"§clientID and basetype='".$basetype."' and baseID=".$baseID
        return $this->dbclass->expression('max('.$sortcolumn.')',$this->table,$clause,0)+$inc;
    }
    public function sort($arr,$prefix="sort_"){
        if(is_array($arr)){
          $index=1;
          $inc=1;
          $ID=0;
          $sortfield=getFromArray($this->datadefinition,'sortcolumn',"sort");
          if(!isset($this->colobject[$sortfield])){
            $this->error="field sort not set!";
            return false;
          }
          for ($i = 0; $i <count($arr); $i++) {
              $ID=str_replace($prefix,'',$arr[$i]);
              if($ID<>0){
                  $sql = 'UPDATE '.$this->table.' SET '.$sortfield.'='.$index.' WHERE '.$this->key.'=?';
                  $stmt = $this->db->prepare($sql);
                  $stmt->bind_param('i', $ID);
                  $stmt->execute();
                  $result = $stmt->affected_rows;
                  $stmt->close();
                  $index+=$inc;
              }
          }
          return true;
        }else{
            return false;
        }
    }
    
    public function getError() {
        return $this->error;
    }

    public function bvalidate($postfields) {
        // Rüpckgabe $this->error
        Global $l;
        Global $prep_output;
        Global $formname;
        Global $settings;
        Global $generaldateformat;

        //echo "davor ".$this->table."<br>";
        //echo '<pre>';
        //print_r($postfields);
        //echo '</pre>';
        
        $echo=$this->echo;
        $this->postfields=$postfields;
        mylog("bvalidate: ".$this->table,$echo);
        mylog($this->postfields,$echo);
        
        $this->keyvalue=getFromArray($this->postfields,$this->key);

        $bnew=(gbnull(getfromArray($this->postfields,$this->key)));
        $this->error="";
        
        if($this->table=="k8references" and !empty($_FILES)){
          mylog($_FILES,$echo);
          $error=getfromArray($_FILES['file'],'error',0);
          mylog('$error='.$error,$echo);
          if(!gbnull($error)){
            $this->error=getfromArray(array(
    0 => 'There is no error, the file uploaded with success',
    1 => 'The uploaded file exceeds the upload_max_filesize directive in php.ini',
    2 => 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form',
    3 => 'The uploaded file was only partially uploaded',
    4 => 'No file was uploaded',
    6 => 'Missing a temporary folder',
    7 => 'Failed to write file to disk.',
    8 => 'A PHP extension stopped the file upload.'),$error);
            mylog('$this->error='.$this->error,$echo);
          }
        }

        // required fiels / datetime
        foreach($this->colobject as $k=>$dat_sel){
            if($dat_sel['mytype']=="DATETIME" and isset($this->postfields[$k])){
              $this->postfields[$k]=str_replace("T", " ", $this->postfields[$k]);
            }
        }
        
        //Besonderheiten checkbox
        /*if(strpos($this->fieldsdisplay,"[active]")!==false){
            $this->postfields["active"]=getfromarray($this->postfields,"active",1);
        }*/ 


        //$this->postfields=gformatpostfields($this->postfields, $this->fieldsnum.$this->fieldscur,$this->fieldsdate);   //change formatting of numeric and date fields
        //$datatype=gbGetDatatype($this->table);                          
        $this->check->gbcheckinputcol($this->colobject,$this->postfields,$this->error);
        
        if($this->table=="k8references" and getFromArray($this->postfields,'type')=="image"){
          $ID=getFromArray($this->postfields,'ID',0);
          if(gbnull($ID) and empty($_FILES)){
            $this->error.="no image";
          }
        }
        
        if($this->table=="k8login"){
          $rightgroupIDdefault=getFromArray($this->postfields,'rightgroupIDdefalut');
          if(!gbnull($rightgroupIDdefault)){
            if(!$this->dbclass->bexist("k8rightmembers","rightgroupID=".gsstr2sql($dbclass->db->real_escape_string($rightgroupIDdefault)).' and userID='.$this->creatorID)){
              $this->error.="no rightgroup member!";
            }
          }
        }
        
        if($this->table=="k8rightgroups" or $this->table=="k8rightmembers"){
          // no check
        }else if(isset($this->colobject['rightgroupID']) and gbnull(getfromArray($_SESSION,'rightgroupID'))){
            $this->error.="rightgroupID is not set";
        }
        
        if(isset($this->include['validate'])){
            include str_repeat('../',$GLOBALS['script_depth']).$this->include['validate'];
        }
        
        // required fields
        foreach($this->colobject as $k=>$dat_sel){
          if(getfromarray($dat_sel,'required')){
            if(gbnull(getfromarray($this->postfields,$dat_sel['fieldname']))){
              if($bnew){
                $this->error.="missing ".$dat_sel['fieldname']." ";
              }else if(isset($this->postfields[$dat_sel['fieldname']])){
                $this->error.="missing ".$dat_sel['fieldname']." ";
              }
            }
          }
        }
        if(0){echo "2 bvalidate.postfields<br>"; echo '<pre>';print_r($this->postfields);echo '</pre>';}

        if(gbnull($this->error)){
            // --------------- childs --------------------
            foreach($this->childs as $index => $x){
                //echo '$index='.$index.'<br>';
                if(isset($this->postfields[$this->childs[$index]['fieldname']])){
                    foreach($this->postfields[$this->childs[$index]['fieldname']] as $k => $v){
                        //echo '$k='.$k.'<br>';
                        if(gbEmptyStructure($v)){
                            unset($this->postfields[$this->childs[$index]['fieldname']][$k]);
                        }else{                            
                            $this->childs[$index]['o_class']->postfields=$v;

                            if($this->childs[$index]['o_class']->bvalidate($v)){
                                //fehlerhaft  !!!  $this->postfields[$this->childs[$index]['fieldname']]=$this->childs[$index]['o_class']->postfields;
                            }else{
                                $this->error.=$this->childs[$index]['o_class']->getError();
                            }
                        }
                    }
                }else if(getFromArray($x, 'bcheckemptyrecord',0)){
                  mylog("childs: ".getFromArray($x,'id')." emptyrecord",$echo);
                  // check empty record
                  if($this->childs[$index]['o_class']->bvalidate(array())){
                      //fehlerhaft  !!!  $this->postfields[$this->childs[$index]['fieldname']]=$this->childs[$index]['o_class']->postfields;
                  }else{
                      $this->error.=$this->childs[$index]['o_class']->getError();
                  }
                }
            }
        }
        //$this->error="shit";
        return gbnull($this->error);
    }

    public function save(){
        Global $l;
        $echo=$this->echo;
        $bnew=0;
        $myres=0;
        mylog("function save",$echo);
        mylog(array('postfields'=>$this->postfields),$echo);
        if(gbnull($this->keyvalue)){
            if(!gbEmptyStructure($this->postfields)){
                $myres=$this->add();

                $this->postfields[$this->key]=$myres;
                $bnew=1;
                
                if(!gbnull($myres) and $this->table=="k8references" and !empty($_FILES)){
                    $end="";
                    $sql_set="";
                    $text=$_FILES["file"]["name"];
                    $pos=strrpos($text,".");
                    if($pos!==false){
                        $end=substr($text,$pos+1);
                    }
                    $exif = exif_read_data($_FILES["file"]["tmp_name"]);
                    //mylog($exif,2);
                    $image_info = getimagesize($_FILES["file"]["tmp_name"]);
                    //mylog($image_info,2);
                    if($image_info !== false){
                        // https://www.geeksforgeeks.org/php-getimagesize-function/
                        $mimetypen = array (
                          "image/jpeg" => "jpg",
                          "image/gif" => "gif",
                          "image/png" => "png"
                        );
                        
                        //$sort=$this->getNextSort('clientID='.$this->clientID.' and basetype='.gsstr2sql($this->postfields['basetype']).' and baseID='.$this->postfields['baseID']);
                        $sort=$this->getNextSort('basetype='.gsstr2sql($this->postfields['basetype']).' and baseID='.$this->postfields['baseID']);
                        $sql_set.="width='".$image_info[0]."',height='".$image_info[1]."',sort='".$sort."',filetype='".$end."',";
                    }
                    $storeFolder = '../uploads'; 
                    $tempFile = $_FILES['file']['tmp_name'];
                    $targetPath = dirname( __FILE__ ).DIRECTORY_SEPARATOR.$storeFolder.DIRECTORY_SEPARATOR; 
                    //$targetFile =  $targetPath. $_FILES['file']['name'];
                    $filename=getFromArray($this->postfields,'basetype').'_'.$myres.'.'.$end;
                    $targetFile =  $targetPath.$filename;
                    move_uploaded_file($tempFile,$targetFile); 
                    
                    //sort, filetype, height, width, aspectratio
                    $sql_set.="path='uploads',filename='".$filename."',";
                    $result=$this->db->query("Update k8references set ".substr($sql_set,0,-1)." WHERE ID=".$myres);      
                    if (!$result){
                      $this->error= "(".$this->db->errno.") " . $this->db->error;
                    }
                }
            }
        }elseif($this->bexist($this->keyvalue,0,1)){
            if($this->update()){
                $myres=$this->keyvalue;
            }
        }else{
            $this->error=$this->keyvalue.' doesn`t exists!<br>';
        }
        
        if($myres and count($this->childs)>0){
            // ============================================================ save childs
            $postfields=$this->postfields;
            if(gbnull($this->keyvalue))$postfields[$this->key]=$myres;
            //and isset($o->postfields['deliverydate']
            if($echo)mylog($this->table.' Main successful, '.$this->key.'='.$postfields[$this->key].'<br>',$echo);

            //if($echo){
            if(0){
                echo $this->table.'$postfields'.'<br>';
                echo '<pre>';
                print_r($postfields);
                echo '</pre>';
                exit;
            }

            if($echo)echo '$this->table='.$this->table.' count(childs)='.count($this->childs).'<br>';

            foreach($this->childs as $index => $child){
              if(0){
                // =========================================== childs 1:1
                //set parentkey
                $dat[$this->childs[$index]['o_class']->masterkey]=getfromarray($postfields,$this->key);
                $keyval_child=getfromArray($this->postfields,$this->childs[$index]['o_class']->key,0);
                if($keyval_child){
                }
              }else{
                  // =========================================== childs 1:n
                  $item_in='';
                  if(isset($postfields[$child['fieldname']])){
                      foreach($postfields[$child['fieldname']] as $k=>$dat){
                          if(isset($this->include['savechildloop'])){
                              include str_repeat('../',$GLOBALS['script_depth']).$this->include['savechildloop'];
                          }

                          //set parentkey
                          $dat[$this->childs[$index]['o_class']->masterkey]=getfromarray($postfields,$this->key);

                          //echo 'masterkey='.$this->childs[$index]['o_class']->masterkey.'<br>';
                          //if($echo)echo $this->table.' index='.$k.'<br>';     // 'key='.$this->o_main->postfields[$this->o_main->key].'<br>';
                          mylog($dat,$this->echo);
                          if($this->childs[$index]['o_class']->bvalidate($dat)){
                              //if($echo){
                              if(0){echo '<pre>';print_r($this->childs[$index]['o_class']->postfields);echo '</pre>';}
                              // values are in $dat=$this->childs[$index]['o_class']->postfields;
                              $ressub=$this->childs[$index]['o_class']->save();
                              if($ressub){
                                  $dat[$this->childs[$index]['o_class']->key]=$ressub;
                                  $item_in.=$dat[$this->childs[$index]['o_class']->key].',';
                              }else{
                                  $this->error.='child.loop: '.$this->childs[$index]['o_class']->getError();                            
                              }
                          }else{
                              $this->error.='child.loop: '.$this->childs[$index]['o_class']->getError();
                          }
                          //echo '$this->error='.$error.'<br>';
                          //exit;
                      }
                  }
                  $deletechildpos=getfromArray($this->datadefinition['masterdata'],'childs_save_delete',true);

                  if(!$bnew){
                      if(isset($this->include['savechildbeforedelete'])){
                          include str_repeat('../',$GLOBALS['script_depth']).$this->include['savechildbeforedelete'];
                      }
                      if($deletechildpos){
                          // ggf Positionen löschen
                          if(count($this->childs[$index]['o_class']->childs)>0){
                              // rekursive löschen
                              $clause=gsclauseand($this->childs[$index]['o_class']->masterkey.'='.$postfields[$this->key],'not '.$this->childs[$index]['o_class']->key.' in('.substr($item_in,0,strlen($item_in)-1).')',!gbnull($item_in));
                              if($echo)mylog($this->childs[$index]['o_class']->table.' check to delete Pos?.$clause='.$clause,$echo);
                              $data_del=$this->childs[$index]['o_class']->getEntries($clause);
                              if($data_del){
                                  foreach($data_del as $dat_del){
                                      if($echo)mylog($this->childs[$index]['o_class']->table.' delete Pos='.$this->childs[$index]['o_class']->key.'.'.$dat_del[$this->childs[$index]['o_class']->key],$echo);
                                      if($this->childs[$index]['o_class']->delete($dat_del[$this->childs[$index]['o_class']->key])){
                                      }else{
                                          $this->error.='child.delete: '.$this->childs[$index]['o_class']->geterror();
                                      }
                                  }
                              }else{
                                  if($echo)mylog('no pos to delete<br>',$echo);
                              }
                          }else{
                              // without children SQL-DELETE
                              $clause=gsclauseand($this->childs[$index]['o_class']->masterkey.'='.$postfields[$this->key],'not '.$this->childs[$index]['o_class']->key.' in('.substr($item_in,0,strlen($item_in)-1).')',!gbnull($item_in));
                              $sql='DELETE FROM '.$this->childs[$index]['o_class']->table.' WHERE '.$clause;
                              //if($echo)echo $this->table.','.htmlspecialchars($sql).'<br>';
                              if(!$this->childs[$index]['o_class']->db->query($sql)){
                                  $this->error.='child.delete: '.$this->childs[$index]['o_class']->geterror();
                              }
                          }
                      }
                  }
              }
              if(isset($this->include['aftersavechilds'])){
                  include str_repeat('../',$GLOBALS['script_depth']).$this->include['aftersavechilds'];
              }
          }
        }
        
        return $myres;
    }
    
    public function add($system=0) {
        // system=1 allows to insert pageID
        Global $l;
        $result=0;
        $bok=0;
        $creatorID=0;
        if($this->overwritecreatorID)$creatorID=getFromArray($this->postfields,'creatorID');
        $roles=getfromarray($_SESSION,'roles',array());
        $bshowsql=(boolval(getfromarray($_REQUEST,'bshowsql',0)) and ($GLOBALS['domain_development']==1 or ($GLOBALS['domain_development']==2 and ini_get("display_errors")==1)));
        $echo=0; //$this->echo;
        
        $clause=""; //$this->key.'='.$this->keyvalue;
        if($this->rightcheck==0){
          $bok=1;
        }elseif($this->rightcheck==1){
          //if(!isset($this->permit['create'])){
          //   $this->error='no create rights!';
          //}elseif(count($this->roles)>0){
          if(count($this->roles)>0){
            if(isset($this->permit['create'])){
                foreach($this->roles as $roleID){
                  if(isset($this->permit['create'][$roleID])){
                    $method=getFromArray($this->permit['create'],$roleID,0);
                    if($method==1000){
                      $bok=$this->bcheckMaster($this->postfields[$this->masterkey],'update',$roleID);
                    }else{
                      $arr=array("method"=>$method,"table"=>$this->table,"clause"=>$clause);
                      If($this->dbclass->bRecordAccess($arr)){
                        $bok=1;
                      }
                    }
                    if($bok)break;
                  }
                }
            }
            if(!$bok and gbnull($this->error)){
                $this->error='no rights !';
            }
          }else{
            /* deprecated
            $method=getFromArray($this->permit['create'],$this->roleID,0);
            //echo '$this->roleID='.$this->roleID.'<br>';
            //echo '$method='.$method.'<br>';
            if($method==1000){
              $bok=$this->bcheckMaster($this->postfields[$this->masterkey],'update',$this->roleID);
            }else{
              $arr=array("method"=>$method,"table"=>$this->table,"clause"=>$clause);
              If($this->dbclass->bRecordAccess($arr)){
                $bok=1;
              }else{
                $this->error=$this->dbclass->error;
              }
            }
            */
          }
        }
        
        if($bok){
          $sqlfields='';
          $sqlvalues='';
          
          //mylog(array("system"=>$system),2);
          //mylog(array("key"=>$this->key),2);
          if($system==1){
            if(isset($this->colobject[$this->key])){
              $this->colobject[$this->key]['noinsert']=0;
              //mylog(array("noinsert"=>$this->colobject['pageID']['noinsert']),2);
              //mylog(array("col after noinsert"=>$this->colobject),2);
            }
          }
          
          if(isset($this->include['beforeinsert'])){
              $cancel=false;
              include str_repeat('../',$GLOBALS['script_depth']).$this->include['beforeinsert'];
              if($cancel)$result=0;
          }
          
          if(isset($this->colobject['clientID']) and $this->table!=="k8clients"){
              $sqlfields.='`clientID`, ';
              if($this->table=="k8login"){
                $sqlvalues.= "'".getfromArray($this->postfields,'clientID',$this->clientID)."', ";
              }else{
                $sqlvalues.= "'$this->clientID', ";
              }
          }
          if(isset($this->colobject['creatorID'])){ 
              $sqlfields.='`creatorID`, ';
              if(!gbnull($creatorID)){
                $sqlvalues.= "'$creatorID', ";
              }else{
                $sqlvalues.= "'$this->creatorID', ";
              }
          }
          /*
          if(isset($this->colobject['userID'])){
              $sqlfields.='userID, ';
              $sqlvalues.= "'$this->creatorID', ";
          }
          */
          if(isset($this->colobject['datecreated'])){
              $sqlfields.='`datecreated`, ';
              $sqlvalues.= "Now(), ";
          }
          if(isset($this->colobject['datetimecreated'])){
              $sqlfields.='`datetimecreated`, ';
              $sqlvalues.= "Now(), ";
              if(isset($this->postfields['datetimecreated']))unset($this->postfields['datetimecreated']);
          }
          if(isset($this->colobject['companyID'])){
              $sqlfields.='`companyID`, ';
              $sqlvalues.=gsstr2sql(getfromarray($_SESSION,'companyID',0)).', ';
          }
          if($this->table=="k8rightgroups" or $this->table=="k8rightmembers"){
            // checked in validation!
          }else if(isset($this->colobject['rightgroupID'])){
              $sqlfields.='`rightgroupID`, ';
              $sqlvalues.=gsstr2sql(getfromarray($_SESSION,'rightgroupID',0)).', ';
          }
          
          // default values
          foreach($this->colobject as $column){
            if(isset($column['mydefault'])){
              $fieldname=$column['fieldname'];
              if(instr(',clientID,creatorID,rightgroupID,datecreated,datetimecreated,companyID',','.$fieldname.',')===-1 and !gbnull($fieldname)){
                if(in_array(1,$roles)){
                  // admin
                  if(!isset($this->postfields[$fieldname])){
                    $this->postfields[$fieldname]=$column['mydefault'];
                  }
                }else{
                  // normal user
                  if(getfromarray($column,'noinsert',0)){
                    $this->postfields[$fieldname]=$column['mydefault'];
                  }else if(!isset($this->postfields[$fieldname])){
                    $this->postfields[$fieldname]=$column['mydefault'];
                  }else{
                    // postfields are not changed
                  }
                }
              }
            }
          }
          if($bshowsql){
            if($echo==1){
              echo '<pre>';print_r($this->postfields);echo '</pre>';
              echo "sqlfields=".$sqlfields.'<br>';
            }
          }
          $this->dbclass->buildSqlInsertFromInput($this->colobject,$this->postfields,$sqlfields,$sqlvalues); 
          
          $this->sql = 'INSERT INTO ' . $this->table . '(';
          $this->sql=$this->sql . substr($sqlfields,0,-2) . ') ';
          $this->sql=$this->sql . ' VALUES(' . substr($sqlvalues,0,-2) . ') ';
          if($bshowsql){
            mylog(htmlspecialchars($this->sql),1);
          }
          mylog(htmlspecialchars($this->sql),$echo);
          
          $result=$this->db->query($this->sql);
          if(!$result){
                mylog("add ".$this->table." failed: ".htmlspecialchars($this->sql),$echo);
                $this->error="(".$this->db->errno.") " . $this->db->error;
                mylog("error=".$this->error,$echo);
          }else{
                if($system==1){
                  $result=$this->postfields[$this->key];
                  mylog("add inserted_id:".$this->db->insert_id." ",$echo);
                }else{
                  $result=$this->db->insert_id;
                }
                mylog("add ".$this->table.".".$this->key.":".$result." successful!",$echo);
                $this->keyvalue=$result;
                $this->postfields[$this->key]=$result;
                if($this->table=='k8login'){
                  $this->db->query("Update k8login set creatorID=userID WHERE userID=".$result);      
                }
                if(isset($this->include['afterinsert'])){
                    $cancel=false;
                    include str_repeat('../',$GLOBALS['script_depth']).$this->include['afterinsert'];
                    if($cancel)$result=0;
                }
              
          }
        }
        return $result;
    }
    
    public function update() {
        Global $l;
        $echo=$this->echo;
        $echo=0;
        mylog(array("function"=>"update","table"=>$this->table,"key"=>$this->key),$echo);
        $result=0;
        $bok=0;
        $clause=$this->key.'='.$this->keyvalue;
        if($this->rightcheck==0){
          $bok=1;
        }elseif($this->rightcheck==1){
          //mylog(array("roles"=>$_SESSION['roles']),$echo);
          //mylog(array('this->permit[update]'=>$this->permit['update']),$echo);
          $permission="update";
          if(!isset($this->permit[$permission])){
            // nothing allowed
          }elseif(count($this->roles)>0){
            foreach($this->roles as $roleID){
              if(isset($this->permit[$permission][$roleID])){
                $method=getFromArray($this->permit[$permission],$roleID,0);
                //mylog(array('roleID'=>$roleID,'method'=>$method),$echo);
                if($method==1000){
                  $bok=$this->bcheckMaster($this->postfields[$this->masterkey],'update',$roleID);
                }else{
                  $arr=array("method"=>$method,"table"=>$this->table,"clause"=>$clause);
                  If($this->dbclass->bRecordAccess($arr)){
                    $bok=1;
                  }
                }
                if($bok)break;
              }
            }
            if(!$bok and gbnull($this->error)){
                $this->error='no rights!';
            }
          }else{
            /* deprecated
            $method=getFromArray($this->permit[$permission],$this->roleID,0);
            if($method==1000){
              $bok=$this->bcheckMaster($this->postfields[$this->masterkey],'update',$this->roleID);
            }else{
              $arr=array("method"=>$method,"table"=>$this->table,"clause"=>$clause);
              If($this->dbclass->bRecordAccess($arr)){
                $bok=1;
              }else{
                $this->error=$this->dbclass->error;
              }
            }
            */
          }
        }
        if($bok){
          if(isset($this->include['beforeupdate'])){
              include str_repeat('../',$GLOBALS['script_depth']).$this->include['beforeupdate'];
          }
          mylog($this->postfields,$echo);
          mylog($this->colobject,$echo);
          $this->sql='UPDATE ' . $this->table . ' SET ';
          $this->sql.=$this->dbclass->buildSqlUpdateFromInput($this->colobject,$this->postfields)
                  .' WHERE '.$clause;   //clientID='.$this->clientID
          //$bshowsql=getfromarray($_REQUEST,'bshowsql',0) and ($GLOBALS['domain_development']==1 or ($GLOBALS['domain_development']==2 and ini_get("display_errors")==1));
          $bshowsql=(boolval(getfromarray($_REQUEST,'bshowsql',0)) and ($GLOBALS['domain_development']==1 or ($GLOBALS['domain_development']==2 and ini_get("display_errors")==1)));          
          if($bshowsql) echo '$sql='.htmlspecialchars($this->sql).'<br>';
          $result=$this->db->query($this->sql);
          if($result){
              mylog("update successful: ".$this->sql,$echo);
              if(isset($this->include['afterupdate'])){
                  include str_repeat('../',$GLOBALS['script_depth']).$this->include['afterupdate'];
              }
          }else{
              mylog("update ".$this->table." failed: ".htmlspecialchars($this->sql),$echo);
              $this->error= $this->db->error . " " . $this->db->error;
          }
        }
        return (boolean)$result;   
    }

    public function bexist($ID=0){
        if(gbnull($ID))return 0;
        //echo '$clause='.$clause.'<br>';
        $clause=$this->key.'='.$ID;
        return (boolean)$this->dbclass->bexist($this->table,$clause);
    }

    public function bloadrec(){
        Global $l;
        $ID=getFromArray($this->postfields,$this->key);
        $result=0;
        $clause=$this->table.'.'.$this->key.'='.$ID;
        if(!gbnull(getfromArray($this->datadefinition['masterdata'],'sql_derived'))){
            $clause=$this->key.'='.$ID;
        }
        $data=$this->getentries($clause);
        if(count($data)==0){
            if(gbnull($this->error)){
              $this->error=$ID.' record not found';
            }
        }else{
            $result=1;
        }
        return (boolean) $result;
    }
    
    public function bload($ID){
        Global $l;
        $result=0;
        $clause=$this->table.'.'.$this->key.'='.$ID;
        if(!gbnull(getfromArray($this->datadefinition['masterdata'],'sql_derived'))){
            $clause=$this->key.'='.$ID;
        }
        $data=$this->getentries($clause);
        if(count($data)==0){
            if(gbnull($this->error)){
              $this->error=$ID.' record not found';
            }
        }else{
            $result=1;
        }
        return (boolean) $result;
    }

    public function getEntries($clause='',$orderby='',$psort='',$bchild=false,$level=0) {  // /*datadefID*/
        // ATTENTION RETURN VALUE FALSE WHEN recourdcount=0
        Global $l;
        Global $datadefinitions;
        Global $gdatareadlimit;
        $echo=$this->echo;
        $this->data=array();
        $this->dat=array();
        $select='';
        $from='';
        $clausein=getfromArray($_REQUEST,"clausein");
        //$rightuser_create=1;//gRightObject($this->rights,'create');
        mylog("getentries,rightcheck=".$this->rightcheck,$echo);
        mylog(array("getentries start.error"=>$this->error),$echo);
        if($this->rightcheck==1){
            if(0){echo 'count='.count($this->roles).'<br>'; echo "<pre>";print_r($this->permit);echo "</pre>";}
            if(count($this->roles)>0){
              $clause_or='(1=2)';
              $update_or='(1=2)';
              $delete_or='(1=2)';
              if(!gbnull($this->masterdatadefID)){
                mylog('$this->masterdatadefID='.$this->masterdatadefID,$echo);
                $update_master_or='';

                /*
                if(isset($datadefinitions[$this->masterdatadefID]['masterdata']['rights'])){
                  mylog(getfromArray($datadefinitions[$this->masterdatadefID]['masterdata']['rights'],"read"),$echo);
                }else{
                  mylog("not set",$echo);
                }
                 */
                mylog($this->omaster->permit,$echo);
                foreach($this->roles as $roleID){
                  // -------- read
                  mylog("xx.roleID=".$roleID,$echo);
                  if(isset($this->omaster->permit['read'][$roleID])){

                    //if($this->table=='k8loginfriends'){
                    //  $clause=gsclauseand($clause,$this->table.'.userID='.getFromArray($_SESSION,'userID',0));
                    //  $select=gsclauseand($select,'1 as rightuser_update, 1 as rightuser_delete',true,',');
                    //}
                    
                    $method=$this->omaster->permit['read'][$roleID];
                    $arr=array("method"=>$method,"table"=>$datadefinitions[$this->masterdatadefID]['table']);
                    //mylog(array('$roleID'=>$roleID,'$method'=>$method),$echo);
                    $this->dbclass->bRecordReadPermission($arr,$out);
                    
                    /*
                    $clause_or=gsclauseand($clause_or,$out['clause'],!gbnull($out['clause']),' or ');
                    if(getfromarray($this->datadefinition['masterdata'],'sql_addmaster',true)){
                      $from=" INNER JOIN ".$datadefinitions[$this->masterdatadefID]['table'].' ON '.
                        $datadefinitions[$this->masterdatadefID]['table'].'.'.$datadefinitions[$this->masterdatadefID]['key'].'='.$this->table.'.'.$this->masterkey;
                    }
                    */
                    $clause_or=gsclauseand($clause_or,'EXISTS(select 1 FROM '.$datadefinitions[$this->masterdatadefID]['table'].' WHERE '.$this->table.'.'.$this->masterkey.'='.$datadefinitions[$this->masterdatadefID]['table'].'.'.$datadefinitions[$this->masterdatadefID]['key'].' and '.$out['clause'].')',!gbnull($out['clause']),' or ');
                  }
                  
                  // update
                  if(isset($this->omaster->permit['update'][$roleID])){
                      $arr=array("method"=>getFromArray($this->omaster->permit['update'],$roleID,0),"table"=>$datadefinitions[$this->masterdatadefID]['table'],"access"=>"update");
                      $this->dbclass->bRecordUDPermission($arr,$out);
                      //$update_master_or=gsclauseand($update_master_or,$out['select'],!gbnull($out['select']),' or ');
                      $update_master_or=gsclauseand($update_master_or,'EXISTS(select 1 FROM '.$datadefinitions[$this->masterdatadefID]['table'].' WHERE '.$this->table.'.'.$this->masterkey.'='.$datadefinitions[$this->masterdatadefID]['table'].'.'.$datadefinitions[$this->masterdatadefID]['key'].' and '.$out['select'].')',!gbnull($out['select']),' or ');
                  }
                }                
                //echo '$update_master_or'.$update_master_or.'<br>';
                $update_or=$update_master_or;
                $delete_or=$update_master_or;
              }
              
              // $this->roles
              mylog(array("error before richtcheck of table="=>$this->error),$echo);
              mylog(array("roles"=>$this->roles),$echo);
              mylog(array('$this->permit[read]='=>getfromArray($this->permit,'read')),$echo);
              foreach($this->roles as $roleID){
                if(isset($this->permit['read'][$roleID])){
                  $method=getFromArray($this->permit['read'],$roleID,-1);
                  mylog(array("method"=>$method,"roleID"=>$roleID),$echo);
                  if($method>=0){
                    $arr=array("method"=>$method,"table"=>$this->table);
                    mylog(array('$roleID'=>$roleID,"arr"=>$arr),$echo);
                    $this->dbclass->bRecordReadPermission($arr,$out);
                    //echo '$out[clause]'.$out['clause'].'<br>';
                    $clause_or=gsclauseand($clause_or,$out['clause'],!gbnull($out['clause']),' or ');
                  }
                }else{
                  //06.12.2020 $clause_or="1=2";
                }
                mylog('$clause_or='.$clause_or,$echo);
                
                if(isset($this->permit['update'][$roleID])){
                  //echo $roleID.'/'.getFromArray($this->permit['update'],$roleID,0).'<br>';
                  $arr=array("method"=>getFromArray($this->permit['update'],$roleID,0),"table"=>$this->table,"access"=>"update");
                  $this->dbclass->bRecordUDPermission($arr,$out);
                  $update_or=gsclauseand($update_or,$out['select'],!gbnull($out['select']),' or ');
                }
                
                if(isset($this->permit['delete'][$roleID])){
                  $arr=array("method"=>getFromArray($this->permit['delete'],$roleID,0),"table"=>$this->table,"access"=>"delete");
                  $this->dbclass->bRecordUDPermission($arr,$out);
                  $delete_or=gsclauseand($delete_or,$out['select'],!gbnull($out['select']),' or ');
                }                
              }
              $clausein=gsclauseand($clausein,'('.$clause_or.')',!gbnull($clause_or));
              if(gbnull($update_or)){
                $select=gsclauseand($select,'0 as rightuser_update',true,',');
              }else{ 
                $select=gsclauseand($select,$update_or.' as rightuser_update',!gbnull($update_or),',');
              }
              if(gbnull($delete_or)){
                  $select=gsclauseand($select,'0 as rightuser_delete',true,',');
              }else{
                  $select=gsclauseand($select,$delete_or.' as rightuser_delete',!gbnull($delete_or),',');
              }
            }else{
              /* deprecated !!!
              if(isset($this->permit['read'])){
                $method=getFromArray($this->permit['read'],$this->roleID,0);
                //$arr=array("method"=>$method,"table"=>$this->table,"clause"=>$clausein);
                $arr=array("method"=>$method,"table"=>$this->table);
                $this->dbclass->bRecordReadPermission($arr,$out);
                //echo '$out[clause]'.$out['clause'].'<br>';
                $clausein=gsclauseand($clausein,$out['clause'],!gbnull($out['clause']));
                //join
              }else{
                $clausein="1=2";
              }

              if(isset($this->permit['update'])){
                $arr=array("method"=>getFromArray($this->permit['update'],$this->roleID,0),"table"=>$this->table,"access"=>"update");
                $this->dbclass->bRecordUDPermission($arr,$out);
                $select=gsclauseand($select,$out['select'].' as rightuser_update',!gbnull($out['select']),',');
              }
              if(isset($this->permit['delete'])){
                $arr=array("method"=>getFromArray($this->permit['delete'],$this->roleID,0),"table"=>$this->table,"access"=>"delete");
                $this->dbclass->bRecordUDPermission($arr,$out);
                $select=gsclauseand($select,$out['select'].' as rightuser_delete',!gbnull($out['select']),',');
              }
               */
            }
            if(gbnull($clausein))$clausein="1=2";
        }
        $clause=str_replace('§userID',getFromArray($_SESSION,'userID',0),$clause);
        mylog(array("error richtcheck finished="=>$this->error),$echo);
        mylog(array("clause"=>$clause),$echo);
        
        $result = []; 
        if(gbnull($orderby)) $orderby=$this->orderby;
        if(getfromArray($this->datadefinition,'datamode',0)==3){
            $clause=gsclauseand($clause,$clausein);
            $this->sql_base = str_replace('§WHERE', iif(gbnull($clause),'1=1',$clause), getfromArray($this->datadefinition,'statement'));
            //echo "1".'<br>';
        }elseif($this->creatormode==2){
            $clause=gsclauseand($clause,$clausein);
            $this->sql_base = 'SELECT '.$this->table.'.*'.iif(gbnull($select),'',','.$select).
               ', creator.creator as creator_corporateID'.
               ' FROM '.$this->table. 
               iif(gbnull($from),'',$from).
               ' LEFT OUTER JOIN addresses as creator ON '.$this->table.'.creatorID=creator.addressID'.
               ' WHERE 1=1 and ' . gsclauseand($clause,$this->table.'.clientID='.iif($clientID==-1,$this->clientID,$clientID)). 
               iif(gbnull($orderby),'',' ORDER BY '.$orderby);
            //echo "2".'<br>';
        }elseif(isset($this->include['getEntries_sql'])){
            include str_repeat('../',$GLOBALS['script_depth']).$this->include['getEntries_sql'];
        }elseif(!gbnull($this->sql_statement)){
            $clause=gsclauseand($clause,$clausein);
            $this->sql_base = $this->sql_statement;
            if(instr($this->sql_base,"'' as k8select")==-1 and instr($this->sql_base,"§select")==-1)mylog(array("warning"=>'sql dont contains k8select',"datadefID"=>$this->datadefID),2);
            if(instr($this->sql_base,"WHERE 1=1")==-1)mylog(array("warning"=>'sql dont contains WHERE 1=1',"datadefID"=>$this->datadefID),2);
            $this->sql_base = str_replace('§userID',getFromArray($_SESSION,'userID',0),$this->sql_base);
            $this->sql_base = str_replace('§domain_languageID',getfromArray($_SESSION,'domain_languageID',3),$this->sql_base);
            $this->sql_base = str_replace('§dateformat',$GLOBALS['sqldateformat'],$this->sql_base);
            $this->sql_base = str_replace('§select',iif(gbnull($select),'',','.$select),$this->sql_base);
            $this->sql_base = str_replace("'' as k8select",iif(gbnull($select),'',$select),$this->sql_base);
            if(!gbnull($from))$this->sql_base = str_replace('WHERE 1=1',$from.' WHERE 1=1',$this->sql_base);
            if(!gbnull($clause))$this->sql_base = str_replace('1=1',$clause,$this->sql_base);
            if(!gbnull($orderby))$this->sql_base.=" ORDER BY ".$orderby;
        }elseif(!gbnull(getfromArray($this->datadefinition['masterdata'],'sql_derived'))){
            $this->sql_base = $this->datadefinition['masterdata']['sql_derived'];
            if(instr($this->sql_base,"'' as k8select")==-1 and instr($this->sql_base,"§select")==-1)mylog(array("warning"=>'sql dont contains k8select',"datadefID"=>$this->datadefID),2);
            if(instr($this->sql_base,"WHERE 1=1")==-1)mylog(array("warning"=>'sql dont contains WHERE 1=1',"datadefID"=>$this->datadefID),2);
            $this->sql_base = str_replace('§userID',getFromArray($_SESSION,'userID',0),$this->sql_base);
            $this->sql_base = str_replace('§domain_languageID',getfromArray($_SESSION,'domain_languageID',3),$this->sql_base);
            $this->sql_base = str_replace('§dateformat',$GLOBALS['sqldateformat'],$this->sql_base);
            $this->sql_base = str_replace('§select',iif(gbnull($select),'',','.$select),$this->sql_base);
            $this->sql_base = str_replace("'' as k8select",iif(gbnull($select),'',$select),$this->sql_base);
            if(!gbnull($from))$this->sql_base = str_replace('WHERE 1=1',$from.' WHERE 1=1',$this->sql_base);
            if(!gbnull($clausein))$this->sql_base = str_replace('1=1',$clausein,$this->sql_base);
            $this->sql_base="SELECT derived.* FROM (".$this->sql_base.") as derived";
            if(!gbnull($clause))$this->sql_base.=" WHERE ".$clause;
            if(gbnull($orderby)){
              $sql_orderby=getFromArray($this->datadefinition['masterdata'],'sql_orderby');
              if(!gbnull($sql_orderby)){
                $this->sql_base.=" ORDER BY ".$sql_orderby;
              }
            }else{
              $this->sql_base.=" ORDER BY ".$orderby;
            }
        }else{
            $clause=gsclauseand($clause,$clausein);
            $clause=gsclauseand('1=1',$clause);
            $this->sql_base = 'SELECT '.$this->table.'.*'.iif(gbnull($select),'',','.$select).
               ' FROM '.$this->table.
               iif(gbnull($from),'',$from).
               ' WHERE '.$clause. 
               iif(gbnull($orderby),'',' ORDER BY '.$orderby);
            //echo "4".'<br>';
        }
        // get sqlstatement from definition
        //Global $navigation;
        Global $gdatareadlimit;
        Global $gdatareadlimitpage;
        $recordcount=0;
        $navigation=0;
        if($bchild){
            $this->sql=$this->sql_base;
        }else{
            if(isset($_REQUEST['mytable_offset'])){
                $navigation=1;
                $limit=getfromarray($_REQUEST,'mytable_limit',$gdatareadlimitpage);
                if($limit<=0){
                    //$this->sql=$this->sql_base." LIMIT ".getfromarray($_REQUEST,'mytable_offset',0);
                    $this->sql=$this->sql_base;
                }else{
                    $this->sql=$this->sql_base." LIMIT ".getfromarray($_REQUEST,'mytable_offset',0).','.$limit;
                }
                $recordcount=$this->dbclass->expression('count(*)','('.$this->sql_base.') as d','');
                //turn on bshowsql
                //exit();
            }else{
                $this->sql=$this->sql_base." LIMIT ".$gdatareadlimit;
            }
        }
        //echo "navigation=".iif($navigation,1,0).'<br>';
        //echo "bchild=".iif($bchild,1,0).'<br>';

        mylog(array("error before sql="=>$this->error),$echo);
        //$bshowsql=getfromarray($_REQUEST,'bshowsql',0) and ($GLOBALS['domain_development']==1 or ($GLOBALS['domain_development']==2 and ini_get("display_errors")==1));
        $bshowsql=(boolval(getfromarray($_REQUEST,'bshowsql',0)) and ($GLOBALS['domain_development']==1 or ($GLOBALS['domain_development']==2 and ini_get("display_errors")==1)));        if($bshowsql)echo htmlspecialchars($this->sql).'<br>';
        $records=$this->db->query($this->sql);
        if($records){
            //also without data you are here
            $bfirst=1;
            while($record=$records->fetch_array(MYSQLI_ASSOC)){
                /*
                if(0){echo '<pre>';print_r($this->colarray);echo '</pre>';}
                foreach($this->colarray['num'] as $numcol){
                    if(isset($record[$numcol]))$record[$numcol]=floatval($record[$numcol]);
                }
                 */

                mylog($record,$echo);
                if(isset($record['password'])){
                  $roles=getfromArray($_SESSION,'roles',array());
                  if($GLOBALS['domain_readpassword']==0){
                    unset($record['password']);
                  }else{
                    if(in_array(1,$roles) or in_array(2,$roles)){
                      // admin
                      if($GLOBALS['domain_readpassword']==1 or $GLOBALS['domain_readpassword']==3){
                        // read password ok
                      }else{
                        unset($record['password']);
                      }
                    }else{
                      // user
                      if($GLOBALS['domain_readpassword']==1 or $GLOBALS['domain_readpassword']==2){
                        // read password ok
                      }else{
                        unset($record['password']);
                      }
                    }
                  }
                }
                
                // ------------------------------ images
                if($this->baddimage){
                    //$image_array=$this->dbclass->bloadimage($this->table,$record[$this->key]);
                    mylog("add image",$echo);
                    $table=getfromArray($this->datadefinition['masterdata']['upload'],"table",$this->table);
                    $keyvalue=$record[$this->key];
                    if(isset($this->datadefinition['masterdata']['upload']['key'])){
                      $keycolumn=$this->datadefinition['masterdata']['upload']['key'];
                      $keyvalue=getfromArray($record,$keycolumn,$this->key);
                    }
                    $image_array=$this->dbclass->bloadimage($table,$keyvalue);
                    $record=array_merge($record,$image_array);
                }else if(isset($record['image_file']) and $GLOBALS['domain_urlmode']===1){
                  $record['image_file']=$GLOBALS['domain_hostpath'].$record['image_file'];
                }


                if(count($this->childs)){
                    //echo "<pre>";
                    //print_r($this->childs);
                    //echo "</pre>";
                    if(isset($this->include['getEntries_childs'])){
                        include str_repeat('../',$GLOBALS['script_depth']).$this->include['getEntries_childs'];
                    }else{
                        foreach($this->childs as $k => $x){
                          if(!gbnull($this->childs[$k]['fieldname'])){
                            $record[$this->childs[$k]['fieldname']]=array();
                            $clause=$this->childs[$k]['o_class']->table.'.'.$this->childs[$k]['o_class']->masterkey.'='.$record[$this->key];
                            //echo "child.table=".$this->childs[$k]['table'].'<br>';
                            //mylog(getfromArray($this->childs[$k],'masterdata'),2);
                            $data=$this->childs[$k]['o_class']->getentries($clause,'','',true);
                            if($data){
                                $record[$this->childs[$k]['fieldname']]=$data;
                            }
                          }
                        }
                    }
                }
                if($navigation and !$bchild){
                   $record['k8_recordcount']=$recordcount;
                }
                
                if(isset($this->include['getEntries'])){
                    include str_repeat('../',$GLOBALS['script_depth']).$this->include['getEntries'];
                }
                
                if(!gbnull($this->parentcolumn)){
                    $record['bhaschilds']=0;
                    $record['gsort']='';
                    if(isset($this->colobject['sort'])){
                      if(gbnull($psort)){
                          $record['gsort']=$record['sort'];
                      }else{
                          $record['gsort']='&nbsp;&nbsp;'.$psort.'.'.$record['sort'];
                      }
                      //echo " gsort:".htmlspecialchars($record['gsort']).'<br>';
                    }                    
                    if($this->bhasChilds($record[$this->key])){
                        $record['bhaschilds']=1;
                        //$o->level=$this->level+1;
                        if(gbnull($this->treearrayname)){
                            $result[]=$record;
                        }
                        $clausesub=$this->table.'.'.$this->parentcolumn.'='.$record[$this->key];
                        if(isset($this->datadefinition['masterdata']['sql_derived'])){
                            $clausesub=$this->parentcolumn.'='.$record[$this->key];
                        }
                        //mylog(array("child orderby"=>$orderby),2);
                        $data=$this->getEntries($clausesub,$orderby,$record['gsort'],true,$level+1);
                        if($data){
                            if(gbnull($this->treearrayname)){
                                foreach($data as $dat){
                                    $result[]=$dat;
                                }
                            }else{
                                $record[$this->treearrayname]=$data;
                                $result[]=$record;
                            }
                        }else{
                            //echo 'error='.$this->error.'<br>';
                            if(!gbnull($this->treearrayname)){
                                $record[$this->treearrayname]=array();
                                $result[]=$record;
                            }                            
                        }
                    }else{
                        if(!gbnull($this->treearrayname)){
                            $record[$this->treearrayname]=array();
                        }
                        $result[]=$record;
                    }                    
                }else{
                    $result[]=$record;
                }
            }
            $this->data=$result;
            if(count($this->data)>0){$this->dat=$this->data[0];}
        }else{
            $this->error=$this->db->errno . " " . $this->db->error;
            //$bshowsql=getfromarray($_REQUEST,'bshowsql',0) and ($GLOBALS['domain_development']==1 or ($GLOBALS['domain_development']==2 and ini_get("display_errors")==1));
            $bshowsql=(boolval(getfromarray($_REQUEST,'bshowsql',0)) and ($GLOBALS['domain_development']==1 or ($GLOBALS['domain_development']==2 and ini_get("display_errors")==1)));            
            if($bshowsql) echo $this->error;
        }
        if(0){
            echo "<pre>";
            //print_r($result);
            var_dump($result);            
            echo "</pre>";
        }
        return $result;       
    }
    
    public function bhasChilds($ID,$clientID=-1,$clause=''){
      $clause=gsclauseand($clause,$this->parentcolumn.'='.$ID);
      $clause=gsclauseand($clause,'clientID='.iif($clientID==-1,$this->clientID,$clientID),isset($this->colobject['clientID']));
      return $this->dbclass->bexist($this->table,$clause);
    }
    
    public function delete($ID,$system=0) {
        Global $l;
        //Global $settings;
        //Global $langclass;
        
        if(!is_numeric($ID)){
          $this->error=$ID.' is not numeric!';
          return false;
        }
        $ID=(int)$ID;
        
        $this->error='';
        $result=0;
        $echo=2; //$this->echo;
        mylog("function delete",$echo);
        $bok=0;
        $IDdeleted=0;
        $clause=$this->key.'='.$ID;
        //mylog(array("clause"=>$clause,"userID"=>getfromArray($_SESSION,"userID",0),"roles"=>$this->roles,"permit.delete"=>$this->permit['delete']),$echo);
        
        // check rights
        if($this->rightcheck==0){
          $bok=1;
        }elseif($this->rightcheck==1 and !$system){
          $permission="delete";
          if(!isset($this->permit[$permission])){
               $this->error='no rights defined!';
          }elseif(count($this->roles)>0){
            //mylog(array("this->roles"=>$this->roles,"this.permit.delete"=>$this->permit[$permission]),$echo);
            foreach($this->roles as $roleID){
              if(isset($this->permit[$permission][$roleID])){
                $method=getFromArray($this->permit[$permission],$roleID,0);
                //mylog(array('$roleID'=>$roleID,"method"=>$method),$echo);
                if($method==1000){
                  $masterkey=$this->dbclass->lookup($this->masterkey,$this->table,$clause);
                  $bok=$this->bcheckMaster($masterkey,'update',$roleID);
                }else{
                  $arr=array("method"=>$method,"table"=>$this->table,"clause"=>$clause);
                  If($this->dbclass->bRecordAccess($arr)){
                     $this->dbclass->error='';
                     $bok=1;
                  }
                }
                if($bok)break;
              }
            }
            if(!$bok and gbnull($this->error)){
                $this->error='no rights!';
            }
          }else{
            /* deprecated 
            $method=getFromArray($this->permit[$permission],$this->roleID,0);
            //echo '2, $method='.$method.'<br>';
            if($method==1000){
              //echo $this->masterkey.' / '.$this->table.' / '.$this->key.'='.$ID;
              $masterkeyvalue=$this->dbclass->lookup($this->masterkey,$this->table,$this->key.'='.$ID);
              $bok=$this->bcheckMaster($masterkeyvalue,'update',$this->roleID);
            }else{
              $arr=array("method"=>$method,"table"=>$this->table,"clause"=>$this->key.'='.$ID);
              If($this->dbclass->bRecordAccess($arr)){
                $this->dbclass->error='';
                $bok=1;
              }else{
                $this->error=$this->dbclass->error;
              }
            }
            */
          }
        }
        
        if($bok){
            //check foreign keys
            if(isset($this->datadefinition['backend']['foreignkeys'])){
                foreach($this->datadefinition['backend']['foreignkeys'] as $fk){
                    $clause=getFromArray($fk,'clause');
                    $text=getFromArray($fk,'text',$fk['table']);
                    $this->error.=$this->dbclass->check_foreignkey($fk['table'],$fk['key'],$ID,0,$text,$clause);
                }
                $bok=gbnull($this->error);
            }
        }
        
        if($bok){
            if(isset($this->include['beforedelete'])){
                include str_repeat('../',$GLOBALS['script_depth']).$this->include['beforedelete'];
            }
        }
        
        if($bok){
          //childs
          if(!getfromArray($this->datadefinition['masterdata'],'childs_deletetrigger',0)){
            foreach($this->childs as $index => $child){
                // delete by program
                mylog(array('child'=>$child['table']),$echo);
                if(count($this->childs[$index]['o_class']->childs)>0 or getfromArray($child,"childasclass",0)){
                    // read childs of child
                    $clause="";
                    $clause=gsclauseand($clause, $this->childs[$index]['o_class']->table.'.clientID='.$this->clientID,$this->childs[$index]['o_class']->colobject['clientID']);
                    $clause=gsclauseand($clause, $this->childs[$index]['o_class']->masterkey.'='.$ID);
                    if($echo)echo '$clause='.$clause.'<br>';
                    $data_del=$this->childs[$index]['o_class']->getEntries($clause);
                    if($data_del){
                        foreach($data_del as $dat_del){
                            mylog('delete='.$dat_del[$this->childs[$index]['o_class']->key],$echo);
                            if($this->childs[$index]['o_class']->delete($dat_del[$this->childs[$index]['o_class']->key])){
                                //
                            }else{
                                $this->error.=$this->childs[$index]['o_class']->geterror();
                            }
                        }
                    }
                }else if(isset($this->include['childdelete'])){
                    include str_repeat('../',$GLOBALS['script_depth']).$this->include['childdelete'];
                }else{
                    $sql = 'DELETE FROM '.$this->childs[$index]['o_class']->table . ' WHERE '.$this->childs[$index]['o_class']->masterkey. ' = ?';
                    $stmt = $this->db->prepare($sql);
                    $stmt->bind_param('i', $ID);
                    $stmt->execute();
                    $result = $stmt->affected_rows;
                    if($echo){
                        echo 'Delete='.htmlentities($sql).'<br>';
                        echo '<pre>';
                        print_r($result);
                        echo '<pre>';
                    }
                    $stmt->close();
                }
            }
            
          }else{
            //echo "with deletetrigger<br>";
          }
                    
          // ----------- with image support ----------------
          if($this->baddimage){
            Global $datadefinitions;
            if(isset($datadefinitions[$GLOBALS['domain_datadefIDatt']])){
              $o_image=new data_accessclass($datadefinitions[$GLOBALS['domain_datadefIDatt']]);
              $data=$o_image->getentries('basetype='.gsstr2sql($this->table).' and baseID='.$ID);
              if($data){
                foreach($data as $dat){
                  if(!$o_image->delete($dat['ID'],1)){
                    $this->error.=$o_image->getError();
                  }
                }
              }
            }else{
              $this->error.='datadefinitions['.$GLOBALS['domain_datadefIDatt'].'] not set!';
            }
          }
          
          if(!gbnull($this->parentcolumn)){
            //read and delete the whole tree
            //$data=$this->getentries($this->parentcolumn.'='.gsstr2sql($ID));
            $data=$this->getentries($this->key.'='.gsstr2sql($ID));
            if($data){
              $this->deletetree($data[0][$this->treearrayname]);
            }
          }
          
          if(isset($this->datadefinition['backend']['foreigndeletions'])){
              foreach($this->datadefinition['backend']['foreigndeletions'] as $fk){
                  //$clause=getFromArray($fk,'clause');
                  $table=getfromArray($fk,'table');
                  $childkey=getfromArray($fk,'childkey');
                  if(gbnull($table) or gbnull($childkey)){
                    $this->error.="table or childkey not set";
                  }else{
                    $sql = 'DELETE FROM ' . $table . ' WHERE '.$childkey. ' = ?';
                    $stmt = $this->db->prepare($sql);
                    $stmt->bind_param('i', $ID);
                    $resultsub=$stmt->execute();
                    //$resultsub = $stmt->affected_rows;
                    $stmt->close();
                    //if($resultsub==0){
                    if(!$resultsub){
                        $this->error.=$this->db->errno . " " . $this->db->error;
                    }
                  }
              }
              $bok=gbnull($this->error);
          }
          
          if($bok and gbnull($this->error)){
            
                $path='';
                $filename='';
                //echo '$this->table='.$this->table.'<br>';
                if($this->table=="k8references"){
                  $type=$this->dbclass->lookup("type",$this->table,"ID=".$ID);
                  //echo '$type='.$type.'<br>';
                  if($type=="image"){
                      $path=$this->dbclass->lookup("path",$this->table,"ID=".$ID);
                      $filename=$this->dbclass->lookup("filename",$this->table,"ID=".$ID);
                  }
                }                

                $this->sql = 'DELETE FROM ' . $this->table . ' WHERE '.$this->key. ' = ?';
                $stmt = $this->db->prepare($this->sql);
                $stmt->bind_param('i', $ID);
                $stmt->execute();
                $result = $stmt->affected_rows;
                //echo '<pre>';
                //print_r($result);
                //echo '<pre>';
                $stmt->close();
                //echo 'Error:'.$this->db->error.'<br>';
                if($result==0){
                    $this->error=$this->db->errno . " " . $this->db->error;
                }else{
                    $IDdeleted=$ID;
                      if(isset($this->include['afterdelete'])){
                          include str_repeat('../',$GLOBALS['script_depth']).$this->include['afterdelete'];
                      }
                }
                    
                if($result and $this->table=="k8references" and !gbnull($filename)){
                    //$targetfile=dirname( __FILE__ ).DIRECTORY_SEPARATOR.'../'.$path."/".$filename;
                    $targetfile='../'.$path."/".$filename;
                    mylog("$targetfile=".$targetfile,$echo);
                    if(file_exists($targetfile)){
                        mylog("exist: targetfile=".$targetfile,$echo);
                        if(!unlink($targetfile)){
                          mylog("not deleted: targetfile=".$targetfile,$echo);
                        }else{
                          mylog("deleted: targetfile=".$targetfile,$echo);
                        }
                    }
                }
            }
        }
        //return (boolean)$result;
        return $IDdeleted;
    }

    private function deletetree($childs){
      foreach($childs as $dat){
        if(count($dat[$this->treearrayname])>0){
          $this->deletetree($dat[$this->treearrayname]);
        }
        // delete record
        $sql="DELETE FROM ".$this->table." WHERE ".$this->key."=".$dat[$this->key];
        $result=$this->db->query($sql);
        /*
        if(!$result){
          $this->error.=$this->db->errno . " " . $this->db->error;
        }
        */
      }
    }
    
    function bcheckMaster($master_ID,$permission,$roleID){
      Global $datadefinitions;
      //echo 'bcheckMaster.$master_ID='.$master_ID.'<br>';
      $result=0;
      if(!is_object($this->omaster)){
        if(gbnull($this->masterdatadefID)){
          $this->error='master object not set!<br>';
        }else{
          //$this->omaster=new $datadefinitions[$this->masterdatadefID]['objectclass']($datadefinitions[$this->masterdatadefID]);
          $this->omaster=getDatadefinition($this->masterdatadefID,$this->error,$master_ID,0,"",1);
        }
      }
      if(is_object($this->omaster)){
        if(isset($this->omaster->permit[$permission])){
          $this->omaster->keyvalue=$master_ID;
          if(gbnull($this->omaster->keyvalue)){
             $this->error='master key missing';
          }else{
            //check master
            $clause=$this->omaster->key.'='.$this->omaster->keyvalue;
            $method=getFromArray($this->omaster->permit[$permission],$roleID,0);
            $arr=array("method"=>$method,"table"=>$this->omaster->table,"clause"=>$clause);
            //mylog(array("permission"=>$permission,"arr"=>$arr),2);
            If($this->dbclass->bRecordAccess($arr)){
              $result=1;
            }else{
              $this->error=$this->dbclass->error;
            }
          }
        }
      }else{
        //mylog("this->omaster no object",2);
      }
      return $result;
    }
    
    public function nextnumber($colnumber,$clause,$default,$format="####",$increment=1){
        $number=$this->dbclass->expression("max($colnumber)",$this->table,$clause,$default);
        //echo '$number='.$number.'<br>';
        //echo '$format='.$format.'<br>';
        if(gbnull($number)){
            $number=$default;
        }else{
            $number=$number+$increment;
        }
        if(!gbnull($format)){
            $number=maskformat($format,$number);
        }
        return $number;
    }

    function bSendEmail($params){
        Global $gpath_rel_client;
        
        $clause=getfromArray($params,"clause");
        $jsonfile=getfromArray($params,"jsonfile");
        
        //$filepath=AddorDel($_SERVER['DOCUMENT_ROOT'],'/',0,1).
        AddorDel(untrailingslashit('upload'),'/',1,0);
        $file=""; //$filepath.'/test.pdf'; // name will be changed!
        
        //echo 'Path: '.$_SERVER['DOCUMENT_ROOT'];
        //echo "File: ".$file."<br>";
        //exit;
        //mylog("bsendemail.clause=".$clause,2);
        
        if($this->bPreparePDF($jsonfile,$clause,'F',$file)){
            $typ='';
            $dat=array();

            $to=getfromArray($params,"to");
            $dat['subject']=getfromArray($params,"subject");
            $dat['from']=getfromArray($params,"from");
            $dat['cc']=getfromArray($params,"cc");
            $dat['bcc']=getfromArray($params,"bcc");
            $dat['message']=getfromArray($params,"message","please regard the attached PDF");
              
            if(isset($this->include['sendEmail'])){
              include str_repeat('../',$GLOBALS['script_depth']).$this->include['sendEmail'];
            }
            
            $email=new eMailbyServer($to,$dat,$typ);
            //$email->subject=$this->dat['docname'].' '.$this->dat['docnumber'];
            if($email->bprepareAttachment($file,1)){
                //mylog("email->bprepare..., filename=".$file,2);
                if($email->bsend()){
                    return 1;
                }else{
                    $this->error=$email->getError();
                    return 0;
                }
            }else{
                $this->error=$email->getError();
                return 0;
            }
        }else{
            return 0;
        }
    }

    public function bPreparePDF($jsonfile,$clause='',$dest='I',&$filename='',$bmodel=0){
        //echo 'bPreparePDF.clause='.$clause."<br>";
        $type=getfromarray($_GET,'type',0);
        $this->output='';
        $data=array();
        $pdfmulti=0;
        
        // pdf-Defintion
        //$temp=gsread_file(str_repeat('../',$GLOBALS['script_depth']).'masterdata/'.$jsonfile);
        $temp=gsread_file(str_repeat('../',$GLOBALS['script_depth']).$jsonfile);
        $data_sel=json_decode($temp,true);
        
        if(isset($this->include['preparePDF_structure'])){
            include str_repeat('../',$GLOBALS['script_depth']).$this->include['preparePDF_structure'];
        }
        
        $data_sel=data_sel_extendstructure($data_sel);
        $bload=(count($data_sel)>0);
        
        if($bload){
            
            if(0){
                echo '<pre>';
                print_r($data_sel);
                //print_r($_SESSION);
                //print_r($data['translate']);
                echo '</pre>';
                exit;
            }
            
            if($this->getentries($clause)){

                // ------------- filename
                //Global $gpath_rel_client;
                //$filepath=AddorDel($_SERVER['DOCUMENT_ROOT'],'/',0,1).AddorDel(untrailingslashit($gpath_rel_client),'/',1,0);
                //$filepath=untrailingslashit($gpath_rel_client);
                //$filename='/'.$filepath.'/'.$this->dat['docname'].' '.$this->dat['docnumber'].'.pdf';
                //$filename='/'.$filepath.'/'.$this->dat['docname'].' '.$this->dat['docnumber'].'.pdf';
                $filename=$_SERVER['DOCUMENT_ROOT'].'download/test.pdf';
                //echo '$filename='.$filename.'<br>';
                
                // ---------- sender
                /*
                $addresses=new addresses();
                $clause=$addresses->table.'.addressID='.getfromarray($_SESSION,'corporateID',0);
                if($addresses->getEntries($clause)){
                    $addresses->dat['logo']=$this->dbclass->lookup("Concat(path,'/',filename)",'ref',"title='Logo' and basetype='addresses' and baseID=".getfromarray($_SESSION,'corporateID',0));
                    $dat_adr=gArrayNameAddConst($addresses->dat,'sender.');
                    //echo '<pre>';
                    //print_r($dat_adr);
                    //echo '</pre>';
                    //exit;
                }else{
                    $this->error.='no sender!';
                    return 0;
                }*/
                //echo 'getentries='.$filename.'<br>';
                
                if($this->data){
                    //echo '$this->data=true'.'<br>';
                    
                    require_once str_repeat('../',$GLOBALS['script_depth'])."masterdata/jsonpdf.php";
                    if(!isset($data_sel['page']))$data_sel['page']=array();
                    $orientation = getFromArray($data_sel['page'],'orientation','P');
                    $unit = getFromArray($data_sel['page'],'unit','mm');
                    $format = getFromArray($data_sel['page'],'format','A4');
                    //$pdf = new jsonPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
                    $pdf = new jsonPDF($orientation, $unit, $format, true, 'UTF-8', false);

                    if($bmodel)$pdf->borderdefault=1;     //1 set border
                    //echo '$this->borderdefault='.$this->borderdefault.'<br>';
                    //exit;

                    //$data['data']=$this->data;

                    if($pdfmulti){
                        foreach($this->data as $dat){
                            //$dat=array_merge($dat,$dat_adr);
                            $dat['pdf.author']=getFromArray($_SESSION,'username');
                            $dat['pdf.title']='';
                            
                            //$dat['pdf.subject']='';
                            //$dat['pdf.keywords']='';
                            //$filename='';
                            $data=array();
                            $data['data']=$dat;

                            //echo '<pre>';
                            //print_r($this->data);
                            //print_r($odatadefinitions->dataselections->data);
                            //echo '</pre>';
                            //exit;
                            if($pdf->_PrintOut($data_sel,$data,$dest,$filename)){
                            }else{
                                $this->error.=$odatadefinitions->getError();
                            }
                        }
                    }else{
                        $data['data']=$this->data;
                        $data['pdf.author']=getFromArray($_SESSION,'username');
                        $data['pdf.title']='PDF by webkit';

                        if(isset($this->include['preparePDF_loop'])){
                            include str_repeat('../',$GLOBALS['script_depth']).$this->include['preparePDF_loop'];
                        }
                        
                        if(0){
                            echo '<pre>';
                            echo 'data:'.'<br>';
                            print_r($data);
                            print_r($data_sel);
                            echo '</pre>';
                            exit;
                        }                
                        
                        //mylog('$filename='.$filename,2);
                        if($pdf->_PrintOut($data_sel,$data,$dest,$filename)){
                            //mylog("printout ok",2);
                            return 1;
                        }else{
                            //mylog("printout error",2);
                            $this->error=$pdf->error;
                            return 0;
                        }
                    }
                    
                }else{
                    $this->error='no data';
                    return 0;
                }
            }else{
              if(gbnull($this->getError())){
                  $this->error.='no data';
              }else{
                  $this->error.=$this->getError();
              }
            }
        }else{
          if(gbnull($this->getError())){
              $this->error.='not loaded';
          }else{
              $this->error.=$this->getError();
          }
        }
        return (strlen($this->error)==0);
    }   
    
    public function bPrintPDF($o,$data,$clause='',$dest='I',$filename="test.pdf",$bmodel=0){

        if(0){
        echo '<pre>';
        //print_r($this->data);
        print_r($this->dataselections->data);
        //print_r($data);
        echo '</pre>';
        exit();
        }
        
        if($data){
            //if(count($data)==0){
            //    $this->error='no data';
            //    return 0;
            //}
            require_once "../tcpdf/tcpdf.php";
            $pdf = new oPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
            if($bmodel)$pdf->borderdefault=1;     //1 set border
            //echo '$this->borderdefault='.$this->borderdefault.'<br>';
            //exit;
            
            // init PAGE
            // set document (meta) information
            //_PrintOut($o,$datadefinitions,$data,$dest='I',$filename="test.pdf"){
            $data_sel=array();  //!!!!!!!!!
            if($pdf->_PrintOut($data_sel,$data,$dest,$filename)){
                return 1;
            }else{
                $this->error=$pdf->error;
                return 0;
            }
        }else{
            $this->error='no data';
            return 0;
        }
    }
    
}