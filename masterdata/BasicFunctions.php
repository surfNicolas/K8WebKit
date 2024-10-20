<?php // 2023-09-15 webkit copyright Klaus Eisert
// PhpMailer-Klassen in den globalen Namespace importieren
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//include "_init.php";

Global $becho;  //1:website, 2:file
Global $k8db;

//Global $navigation;
Global $gdatareadlimitpage;
Global $datadefinitions;

$GLOBALS['clientID']=0;
$GLOBALS['gdatareadlimit']=50;
$GLOBALS['numericTypesAll'] = array("TINYINT","SMALLINT","MEDIUMINT","BIGINT","INT","FLOAT","DOUBLE","DECIMAL");
$GLOBALS['numericTypesDecimal'] = array("FLOAT","DOUBLE","DECIMAL");

$GLOBALS['generalformat']=0;
$_SESSION['generalformat']=$GLOBALS['generalformat'];
$GLOBALS['thousands_sep']=',';
$GLOBALS['decimal_point']='.';
$GLOBALS['generaldateformat']='m/d/Y';
$GLOBALS['sqldateformat']='%m/%d/%Y';
$GLOBALS['tabulatordateformat']='MM/dd/yyyy';
$GLOBALS['tabulatortimeformat']='h:mm a';
$GLOBALS['tabulatordatetimeformat']='MM/dd/yyyy h:mm a';

$GLOBALS['tabulator_datetime_fp']=json_encode(array('inputFormat'=>'yyyy-MM-dd','outputFormat'=>$GLOBALS['tabulatordateformat']));

//$GLOBALS['langclass']=new languagesupport($domain_language);
//$GLOBALS['langmodule']='';

define('CONST_DATAREAD',1);

// ----------------------------- locale  --------------------------------------
//mylocale($domain_language);
if(!isset($_SESSION['roles']))$_SESSION['roles']=array(0=>0);
mylocale();

function mylocale($browserLocale=''){
    if(gbnull($browserLocale)){
        $browserLocale = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
    }
    $commaLocaleCodes = ['AM', 'AR', 'AT', 'AZ', 'BA', 'BE', 'BG', 'BO', 'BR', 'BY',
                    'CA', 'CH', 'CL', 'CM', 'CO', 'CR', 'CY', 'CZ', 'DE', 'DK',
                    'EC', 'EE', 'ES', 'FI', 'FO', 'FR', 'GE', 'GL',  'HR', 'HU',
                    'ID', 'IS', 'IT', 'KZ', 'LB', 'LT', 'LU', 'LV', 'MA', 'MD', 'MK', 'MO', 'MZ',
                    'NL', 'NO', 'PE', 'PL', 'PT', 'PY', 'RO', 'RS', 'RU',
                    'SE', 'SI', 'SK', 'TN', 'TR', 'UA', 'UY', 'UZ', 'VE', 'VN', 'ZA'];
    if(isset($_SESSION['tabulatordatetimeformat'])){
        $GLOBALS['thousands_sep']=$_SESSION['thousands_sep'];
        $GLOBALS['decimal_point']=$_SESSION['decimal_point'];
        $GLOBALS['tabulatordateformat']=$_SESSION['tabulatordateformat'];
        $GLOBALS['tabulatortimeformat']=$_SESSION['tabulatortimeformat'];
        $GLOBALS['tabulatordatetimeformat']=$_SESSION['tabulatordatetimeformat'];
        if($GLOBALS['decimal_point']==',')$GLOBALS['generalformat']=1;
    }else if(in_array(strtoupper($browserLocale),$commaLocaleCodes)){
        $GLOBALS['generalformat']=1;
        $_SESSION['generalformat']=$GLOBALS['generalformat'];
        $GLOBALS['generaldateformat']='d.m.Y';
        $GLOBALS['sqldateformat']='%d.%m.%Y';
        
        $GLOBALS['thousands_sep']='.';
        $GLOBALS['decimal_point']=',';
        $GLOBALS['tabulatordateformat']='dd.MM.yyyy';
        $GLOBALS['tabulatortimeformat']='HH:mm';
        $GLOBALS['tabulatordatetimeformat']='dd.MM.yyyy HH:mm';
        
        $GLOBALS['tabulator_datetime_fp']=json_encode(array('inputFormat'=>'yyyy-MM-dd','outputFormat'=>$GLOBALS['tabulatordateformat']));
    }
    if(0){
        echo '<pre>';
        print_r(localeconv());
        echo '</pre>';
        echo 'tabulatordateformat='.$GLOBALS['tabulatordateformat'];
    }
}

function datadefIDAreaLines($datadefID,$area){
    Global $datadefinitions;
    Global $domain_resources_linked;
    $b=false;
    if(!gbnull($datadefID)){
        if(isset($datadefinitions[$datadefID][$area])){
            if(isset($datadefinitions[$datadefID][$area."_nodefault"])){
              $b=$datadefinitions[$datadefID][$area."_nodefault"];
            }else{
              $b=true;
            }
            //$b=true;
          
            foreach($datadefinitions[$datadefID][$area] as $k => $v){
              $root=$GLOBALS['domain_hostpath'].str_repeat('../',$GLOBALS['script_depth']);
              $v=str_replace("{{domain_language}}", getFromArray($GLOBALS, "domain_language"), $v);
              $resource=str_replace("{{root}}",$root, $v);
              //mylog(array('$domain_resources_linked'=>$domain_resources_linked),2);
              if(!in_array($resource, $domain_resources_linked)){
                $domain_resources_linked[]=$resource;
                echo $resource;
              }
            }
        }else{
            //echo "no ".$area;
        }
    }
    return $b;
}

function datadefIDsite($site,$area){
  Global $datadefinitions;
  Global $domain_resources_linked;
  if(count($site)>0){
    $elements=getfromArray($site,"elements",array());
    foreach($elements as $element){
      $datadefID_temp=getfromArray($element,"datadefID");
      if(!gbnull($datadefID_temp)){
        if(isset($datadefinitions[$datadefID_temp])){
          if(isset($datadefinitions[$datadefID_temp][$area])){
            foreach($datadefinitions[$datadefID_temp][$area] as $k => $v){
              $root=$GLOBALS['domain_hostpath'].str_repeat('../',$GLOBALS['script_depth']);
              $v=str_replace("{{domain_language}}", getFromArray($GLOBALS, "domain_language"), $v);
              $resource=str_replace("{{root}}",$root, $v);
              //mylog(array('$domain_resources_linked'=>$domain_resources_linked),2);
              if(!in_array($resource, $domain_resources_linked)){
                $domain_resources_linked[]=$resource;
                echo $resource;
              }
            }
          }
        }else{
          //mylog($datadefID_temp.' not set!',2);
        }
      }
    }
  }
}


function datadefIDsettingsadditional($datadefID){
    Global $datadefinitions;
    if(!gbnull($datadefID)){
        if(isset($datadefinitions[$datadefID]["settingsadditional"])){
            //echo "\t\t test=$datadefID+'settingsadditional';\r\n";
            $error="";
            foreach($datadefinitions[$datadefID]["settingsadditional"] as $v){
              if(!in_array($v, $GLOBALS['domain_datadefIDs_declared'])){
                if(!isset($datadefinitions[$v]))getDatadefinition($v,$error);
                if(isset($datadefinitions[$v])){
                  $datadefinitions[$v]['masterdata']['script_depth']=$GLOBALS['script_depth'];
                  echo "\t\tvar settings".$v."=".json_encode($datadefinitions[$v],JSON_NUMERIC_CHECK).";\r\n";
                  echo "\t\tnestedLoop(settings".$v.");\r\n";
                }else{
                  echo "\t\tvar settings".$v."=".'{}'.";\r\n";
                }              
              }
            }
        }else{
            //echo "no ".$area;
        }
    }
    return;
}

function datadefIDAreaIncludes($datadefID,$area){
    // deprecated
    Global $datadefinitions;
    if(!gbnull($datadefID)){
        if(isset($datadefinitions[$datadefID][$area])){
            foreach($datadefinitions[$datadefID][$area] as $k => $v){
               include $v;
            }
        }
    }
}

class luxondatetime{
    public $separatordate;
    public $separatortime;
    public $bhourset;
    public $luxon_parts;
    public $year;
    public $month;
    public $day;
    public $hour;
    public $minute;
    public $second;
    public $error;
    
    public function __construct($type,$luxonstring,$value){
      $this->bhourset=false;
      $echo=0;
      mylog(array('$type'=>$type,'$luxonstring'=>$luxonstring,'$value'=>$value),$echo);
      switch (strtoupper($type)){
        case 'TIME':
        case 'DATETIME':
        case 'DATE':
          if(strtoupper($type)<>"TIME"){
            $datestr=$value;
            $pos=instr($datestr,' ');
            if($pos>=0){
              $datestr=substr($datestr,0,$pos);
            }
            $pos=instr($luxonstring,' ');
            if($pos>=0){
              $luxonstring=substr($luxonstring,0,$pos);
            }
            $temp=substr($luxonstring, 2, 1);
            if(instr('.-/',$temp)<0){
              $temp=substr($luxonstring, 4, 1);
              if(instr('.-/',$temp)<0){
                $this->error="don't detect separatordate";
              }else{
                $this->separatordate=$temp;
              }
            }else{
              $this->separatordate=$temp;
            }
            mylog('$this->separatordate='.$this->separatordate,$echo);
            //echo '$this->error='.$this->error;
            if(!gbnull($this->separatordate)){
              $this->luxon_parts=explode($this->separatordate,$luxonstring);
              mylog(array("luxon_parts"=>$this->luxon_parts),$echo);
              //echo 'count='.count($this->luxon_parts);
              if(count($this->luxon_parts)<>3){
                $this->error="luxon not valid";
                goto end;
              }
              $arr=explode($this->separatordate,$datestr);
              mylog($datestr,$echo);
              if(count($arr)<>3){
                $this->error="value not valid date";
                goto end;
              }
              for ($i = 0; $i < count($arr); $i++) {
                switch(substr($this->luxon_parts[$i],0,1)){
                  case "y":
                    if(is_numeric($arr[$i])){
                      $temp=number($arr[$i]);
                      if($temp>=0 and $temp<=99){
                        $this->year=$temp+2000;
                      }else if($temp>=0 and $temp<=9999){
                        $this->year=$temp;
                      }else{
                        $this->year=0;
                        $this->error="year not valid";
                      }
                    }else{
                      $this->year=0;
                    }
                    break;
                  case "M":
                    if(is_numeric($arr[$i])){
                      $this->month=number($arr[$i]);
                    }else{
                      $this->month=0;
                    }
                    break;
                  case "d":
                    if(is_numeric($arr[$i])){
                      $this->day=number($arr[$i]);
                    }else{
                      $this->day=0;
                    }
                    break;
                }
              }
              if($this->month>0 and $this->month<=12){
                $days=[31,29,31,30,31,30,31,31,30,31,30,31];
                if($this->day>0 and $this->day<=$days[$this->month-1]){
                }else{
                  $this->error="day not valid";
                }
              }else{
                $this->error="month not valid";
              }
            }
          }
          if(strtoupper($type)=="DATETIME" or strtoupper($type)=="TIME"){
            //echo 'datetime<br>';
            $timestr="";
            if(strtoupper($type)=="DATETIME"){
              $pos=strpos($value," ");
              if($pos===false){
                // no time
              }else{
                $timestr=substr($value,$pos+1);
              }
            }else{
              $timestr=$value;
            }
            if(gbnull($timestr)){
              //$this->error="no time";
            }else{
              $arr=explode(":",$timestr);
              if(count($arr)==2){
                if(is_numeric($arr[0])){
                  $this->bhourset=true;
                  $this->hour=number($arr[0]);
                }else{
                  $this->error="hour is not numeric";
                  goto end;
                }
                $temp=$arr[1];
                if(instr($temp,"am")>0){
                  $temp=trim(str_replace("am","",$temp));
                }else if(instr($temp,"pm")>0){
                  $this->hour=$this->hour+12;
                  $temp=trim(str_replace("pm","",$temp));
                }
                if(is_numeric($temp)){
                  $this->minute=number($temp);
                }else{
                  $this->error="minute is not numeric";
                }
                $this->second=0;
              }elseif(count($arr)==3){
                if(is_numeric($arr[0])){
                  $this->bhourset=true;
                  $this->hour=number($arr[0]);
                }else{
                  $this->error="hour is not numeric";
                  goto end;
                }
                if(is_numeric($arr[1])){
                  $this->minute=number($arr[1]);
                }else{
                  $this->error="minute is not numeric";
                  goto end;
                }
                $temp=$arr[2];
                if(instr($temp,"am")>0){
                  $temp=trim(str_replace("am","",$temp));
                }else if(instr($temp,"pm")>0){
                  $this->hour=$this->hour+12;
                  $temp=trim(str_replace("pm","",$temp));
                }
                if(is_numeric($temp)){
                  $this->second=number($temp);
                }else{
                  $this->error="minute is not numeric";
                }
              }else{
                // no number
              }
              if(!($this->second>=0 and $this->second<60)){
                  $this->error="second is not valid";
              }
              if(!($this->minute>=0 and $this->minute<60)){
                  $this->error="minute is not valid";
              }
              if(!($this->hour>=0 and $this->hour<24)){
                  $this->error="hour is not valid";
              }
            }
          }
          break;
        default:
          $this->error="type not valid";
      }
end:      
    }

    public function log($echo){
        mylog(array("separatordate"=>$this->separatordate,"year"=>$this->year,"month"=>$this->month,"day"=>$this->day),$echo);
    }
    public function display(){
        echo $this->year.'<br>';
        echo $this->separatordate.'<br>';
        echo str_pad($this->month, 2, "0", STR_PAD_LEFT).'<br>';
        echo str_pad($this->day, 2, "0", STR_PAD_LEFT).'<br>';
        echo str_pad($this->hour, 2, "0", STR_PAD_LEFT).'<br>';
        echo str_pad($this->minute, 2, "0", STR_PAD_LEFT).'<br>';
        echo $this->error.'<br>';
    }
    
    public function isodate(){
        return $this->year.'-'.str_pad($this->month, 2, "0", STR_PAD_LEFT).'-'.str_pad($this->day, 2, "0", STR_PAD_LEFT);
    }
    public function isodatetime(){
        return $this->year.'-'.str_pad($this->month, 2, "0", STR_PAD_LEFT).'-'.str_pad($this->day, 2, "0", STR_PAD_LEFT).' '.str_pad($this->hour, 2, "0", STR_PAD_LEFT).":".str_pad($this->minute, 2, "0", STR_PAD_LEFT).":".str_pad($this->second, 2, "0", STR_PAD_LEFT);
    }
    public function isotime(){
        return str_pad($this->hour, 2, "0", STR_PAD_LEFT).":".str_pad($this->minute, 2, "0", STR_PAD_LEFT).":".str_pad($this->second, 2, "0", STR_PAD_LEFT);
    }
    public function isDate(){
        return gbnull($this->error);
    }
    public function isDateTime(){
        return ($this->bhourset and gbnull($this->error));
    }
    public function isTime(){
        return ($this->bhourset and gbnull($this->error));
    }
    public function getError(){
        return $this->error;
    }
}

class dbclass{
    public $db;
    public $error;
    public $clientID;

    public function __construct(){
        $this->error='';
        $this->clientID=getfromarray($_SESSION,'clientID',0);
        if(isset($GLOBALS['k8db'])){
            $this->db=$GLOBALS['k8db'];
        }else{
            include('_mysql.php');
            /*
            echo '$server='.$server.'<br>';
            echo '$username='.$username.'<br>';
            echo '$password='.$password.'<br>';
            if($password=="Yeeng1234!!"){
                echo "pwd:Standard".'<br>';
            }else{
                echo "pwd:wrong".'<br>';
            }
            echo '$database='.$database.'<br>';
             */
            try{
                $this->db=@mysqli_connect($server, $username, $password, $database);
                //$this->db=new mysqli($server, $username, $password, $database);
            }catch(Throwable $e){ 
                // nothing
            }
            //if ($this->db->connect_errno){
            if(mysqli_connect_errno()){
                $this->error="no database connection!<br>set your database connection in \"_mysql.php\"";
                //$this->error=mysqli_connect_errno();
                //echo "Error=".$this->error.'<br>';
            }else{
                $this->db->query("SET NAMES 'utf8'");                
                $GLOBALS['k8db']=$this->db;
                //echo 'success: '.$this->clientID."<BR>";
            }
        }
    }

    public function getError(){
        return $this->error;
    }
    
    function bloadimage($basetype,$baseID){
        //$root=iif($GLOBALS['domain_urlmode']==0,"",hostpath());
        $root=iif($GLOBALS['domain_urlmode']==0,"",$GLOBALS['domain_hostpath']);
        $root='';
        $record=array();
        $record['image_ID']=0;
        $record['image_file']=$root.'masterdata/pic/nopicture.svg'; //$gpath_rel_upload.'ohnebild.jpg';
        //$record['image_file']='';
        $record['image_orientation']='landscape';
        $record['image_aspectratio']=1;
        $record['image_width']=180;
        $record['image_height']=180;
        $record['image_count']=$this->expression('count(*)', 'k8references', "basetype=".gsstr2sql($basetype)." and type='image' and baseID=".$baseID);
        //echo 'image_count='.$record['image_count'].'<br>';
        $record['image_array']=[];
        if($record['image_count']>0){
          $clause="basetype=".gsstr2sql($basetype)." and type='image' and baseID=".$baseID;
          $sql="SELECT ID as image_ID,concat(path,'/',filename) as image_file, filename as image_filename, case when width>height then 'landscape' else 'portrait' end as image_orientation, width/height as image_aspectratio, width as image_width, height as image_height from k8references WHERE $clause ORDER BY sort";
          $data_image=$this->getentries($sql);
          if($data_image){
            $record['image_array']=$data_image;
            $record['imagearray']=$data_image;
            $record=array_merge($record,$data_image[0]);
          }
        }
        return $record;
    }
    
    public function ShowTable($table,&$keycolumn,$bnamedarray=false){
        // Sample
        // fieldname  | mytype   | mynull| mykey | mydefault | myextra        |
        // Field      | Type     | Null  | Key   | Default   | Extra          |
        // Id         | int(11)  | NO    | PRI   | NULL      | auto_increment |        
            
        $this->error="";
        $result=array();
        $sql="DESCRIBE ".$table;
        $query=$this->db->query($sql);
        if ($query) {
            while($row=$query->fetch_array(MYSQLI_ASSOC)){
                $posstart=instr($row['Type'],'(');
                if($posstart>=0){
                    $posende=instr($row['Type'],')');
                    $row['mytype']=strtoupper(substr($row['Type'],0,$posstart));
                    //$row['size']=intval(substr($row['Type'],$posstart+1,$posende-$posstart-1));
                    $row['size']=substr($row['Type'],$posstart+1,$posende-$posstart-1);
                }else{
                    $row['mytype']=strtoupper($row['Type']);
                    //$row['size']=0;
                    $row['size']='';
                }
                if($row['Key']=='PRI'){
                    if(gbnull($keycolumn)){
                        $keycolumn=$row['Field'];
                    }else{
                        //$this->error="Primary Key has >1 columns!";
                    }
                }
                $row['fieldname']=$row['Field'];
                //$row['mynull']=$row['Null'];
                //$row['mykey']=$row['Key'];
                //$row['mydefault']=$row['Default'];
                $row['myextra']=$row['Extra'];
                
                if(getFromArray($row,'Extra')=='auto_increment' or instr(',companyID,clientID,creatorID,datecreated,datetimecreated',','.$row['fieldname'].',')>-1){
                  $row['noupdate']=1;
                }
                if(getFromArray($row,'Extra')=='auto_increment' or instr(',companyID,clientID,creatorID,datecreated,datetimecreated',','.$row['fieldname'].',')>-1){
                  $row['noinsert']=1;
                }
                  
                if($bnamedarray){
                    $result[$row['Field']]=$row;
                }else{
                    $result[]=$row;
                }
                //echo $row['fieldname'].' '.$row['Key'].'<br>';
            }
            return $result;
        }else{
            $this->error="(" .$this->db->errno.") ".$this->db->error;
        }
        return 0;
    }    

    public function ShowTables(){
        $result=array();
        $sql="show tables";
        $query=$this->db->query($sql);
        if ($query) {
            while($record=$query->fetch_array()){
                $result[]=$record[0];
            }
        }
        return $result;
    }

    public function bexist($table, $clause) {
        $myres=false;
        $sql="SELECT '' as field FROM " . $table;

        if(strpos($clause,"§clientID")!==false){
            $clause=str_replace("§clientID","clientID=$this->clientID",$clause);
        }
        
        if ($clause!='') {
            $sql=$sql . " WHERE " . $clause;
        }
        $bshowsql=getfromarray($_REQUEST,'bshowsql',0) and ($GLOBALS['domain_development']==1 or ($GLOBALS['domain_development']==2 and ini_get("display_errors")==1));
        if($bshowsql){echo htmlspecialchars($sql) . '<br>';}
        //echo 'bexist.sql='.htmlspecialchars($sql) . '<br>';
        
        $records=$this->db->query($sql);
        if($records){
            $dat=$records->fetch_array();
            if($dat){
                $myres=true;
            }
        }else{
            $this->error="(" .$this->db->errno.") ".$this->db->error;
            //echo $this->error;
        }
        return $myres;
    }
    
    public function lookup($field, $table, $clause, $default='',$orderby='',$limit='') {
        //if($table=='addresses'){
            //and instr('login') )
        //}
        //if(getfromarray($_SESSION,"superuser",0)>=1)
        $sql="SELECT " . $field . " FROM " . $table;
        
        if ($clause!='') {
            $sql=$sql . " WHERE " . $clause;
        }
        if (!gbnull($orderby)) {
            $sql=$sql." ORDER BY ".$orderby;
        }
        if(gbnull($limit)){
            $sql=$sql." LIMIT 1 ";
        }else{
            $sql=$sql." ".$limit;
        }
        
        if(instr($sql,"§clientID")<0){
            //$this->error="clientID berücksichtigen!";
            //return false;
        }else{
            $sql=str_replace("§clientID","clientID=$this->clientID",$sql);
        }

        if(getfromarray($_SESSION,"developper",0)){echo htmlspecialchars($sql) . '<br>';}
        //if(1){echo htmlspecialchars($sql) . '<br>';}
        //echo htmlspecialchars($sql) . '<br>';
        
        $pos=strpos($field,' as ');
        if($pos!==false){
            $field=substr($field,$pos+strlen(' as '));
        }
        $result=$this->db->query($sql);
        if($result){
            $row=$result->fetch_array();
            if($row){
                //echo '$field='.$field.' value='.$row[$field].'<br>';
                return $row[$field];
            }else{
                return $default;
            }
        }else{
            $this->error="(" .$this->db->errno.") ".$this->db->error;
            //echo $this->error;
        }
    }

    public function expression($exp, $table, $clause='', $default='', $ifnull='') {
        if(gbnull($ifnull)){
            $sql="SELECT $exp as result FROM " . $table;
        }else{
            $sql="SELECT ifnull($exp,$ifnull) as result FROM " . $table;
        }
        if ($clause!='') {
            $sql=$sql . " WHERE " . $clause;
        }
        if(strpos($sql,"§clientID")==0){
            //$this->error="clientID berücksichtigen!";
            //return false;
        }else{
            $sql=str_replace("§clientID","clientID=$this->clientID",$sql);
        }

        $bshowsql=getfromarray($_REQUEST,'bshowsql',0) and ($GLOBALS['domain_development']==1 or ($GLOBALS['domain_development']==2 and ini_get("display_errors")==1));
        if($bshowsql){echo htmlspecialchars($sql) . '<br>';}
        //echo htmlspecialchars($sql) . '<br>';
        
        $result=$this->db->query($sql);
        if($result){
            //echo 'ergebnis<br>';
            $row=$result->fetch_array();
            if($row){
                //echo 'zeile[result]='.$row["result"].'<br>';
                return $row["result"];
            }else{
                //echo 'no zeile<br>';
                return $default;
            }
        }else{
            //echo 'no ergebnis<br>';
            if(gbnull($this->db->error)){
                return $default;
            }else{
                $this->error="(" .$this->db->errno.") ".$this->db->error.'<br>';
                //echo $this->error;
            }
        }
    }
    
    public function getentries($sql,$clientID=-1,$params=array()){
        $data=[];
        if(strpos($sql,"§clientID")!==false){
            if($clientID==-1)$clientID=$this->clientID;
            $sql=str_replace("§clientID","clientID=$clientID",$sql);
        }
        $bshowsql=getfromarray($_REQUEST,'bshowsql',0) and ($GLOBALS['domain_development']==1 or ($GLOBALS['domain_development']==2 and ini_get("display_errors")==1));
        if($bshowsql) echo "sql=".htmlspecialchars($sql).'<br>';
        $records=$this->db->query($sql);
        if($records){
            while($record=$records->fetch_array(MYSQLI_ASSOC)){
                if(getfromarray($params,'baddimage',0)){
                    $key=getfromarray($params,'key');
                    if(!gbnull($key)){
                        $image_array=$this->bloadimage(getfromarray($params,'basetype'),$record[$key]);
                        $record=array_merge($record,$image_array);
                    }
                }
                //mylog(array('domain_hostpath'=>$GLOBALS['domain_hostpath'],'image_file'=>$record['image_file'],'domain_urlmode'=>$GLOBALS['domain_urlmode']),2);
                if(isset($record['image_file']) and $GLOBALS['domain_urlmode']===1){
                  $record['image_file']=$GLOBALS['domain_hostpath'].$record['image_file'];
                }
                $data[]=$record;
            }
        }elseif(!gbnull($this->db->error)){
            $this->error=$this->db->errno." ".$this->db->error;
        }
        return $data;
    }

    function buildSqlInsertFromInput($columns,$postfields,&$sqlfields,&$sqlvalues){
        //mylog($columns,2);
        //mylog(array('$sqlfields'=>$sqlfields),2);
        foreach($postfields as $col=>$v) {
          //mylog($col,2);
          if(isset($columns[$col]) and strpos($sqlfields,"`$col`")===false){
            $column=$columns[$col];
            if(!getfromarray($column,'noinsert',0) or ArrayPropSetAndNotNull($column,'mydefault')){
              if(isset($columns[$col]['Field'])){
                $sqlfields=$sqlfields . "`$col`, ";
                if(table2k8formtype($columns[$col]['mytype'])=='number') {
                  if($v===''){
                    if($columns[$col]['Null']=="YES"){
                      $v=null;
                    }else{
                      $v=0;
                    }
                  }
                }
                if(is_null($v)){
                  $sqlvalues=$sqlvalues.'null, ';
                }else{
                  $sqlvalues=$sqlvalues."'".$this->db->real_escape_string($v)."', ";
                }
              }
            }
          }else{
            //mylog("$col not added",2);
          }
        }
    }

    function buildSqlInsertFromInputMS($columns,$postfields,&$sqlfields,&$sqlvalues){
        //mylog($columns,2);
        //mylog(array('$sqlfields'=>$sqlfields),2);
        foreach($postfields as $col=>$v) {
          //mylog($col,2);
          if(isset($columns[$col]) and strpos($sqlfields,"`$col`")===false){
            $column=$columns[$col];
            if(!getfromarray($column,'noinsert',0) or ArrayPropSetAndNotNull($column,'mydefault')){
              if(isset($columns[$col]['Field'])){
                $sqlfields=$sqlfields . "$col, ";
                if(table2k8formtype($columns[$col]['mytype'])=='number') {
                  if($v===''){
                    if($columns[$col]['Null']=="YES"){
                      $v=null;
                    }else{
                      $v=0;
                    }
                  }
                }
                if(is_null($v)){
                  $sqlvalues=$sqlvalues.'null, ';
                }else{
                  //$sqlvalues=$sqlvalues."'".$v."', ";
                  $sqlvalues=$sqlvalues."'".@iconv("UTF-8","Windows-1252//ignore",$v)."', ";
                }
              }
            }
          }else{
            //mylog("$col not added",2);
          }
        }
    }
    
    function buildSqlUpdateFromInputMS($columns,$postfields,$mode=0){
        // mode: 0=loop postfields, 1=loop fieldlist
        // requires public for fieldlist,db
        $sql='';
        if($mode==0){
            foreach($postfields as $col=>$v){
                if(isset($columns[$col])){
                  if(!getfromarray($columns[$col],'noupdate',0) and isset($columns[$col]['Field'])){
                    //$sql.="$col='".$v."', ";
                    $sql.="$col='".@iconv("UTF-8","Windows-1252//ignore",$v)."', ";
                  }else{
                    //mylog($col." not updated",2);
                  }
                }else{
                    //mylog($col." not in columns",2);
                }
            }
        }else{
            foreach($columns as $column){
              if(!getfromarray($columns[$col],'noupdate',0)){
                if(isset($postfields[$column])){
                    $sql.="$column='".@iconv("UTF-8","Windows-1252//ignore",$postfields[$column])."', ";
                }
              }
            }
        }
        return substr($sql,0,-2);
    }
    
    function buildSqlUpdateFromInput($columns,$postfields,$mode=0){
        // mode: 0=loop postfields, 1=loop fieldlist
        // requires public for fieldlist,db
        $sql='';
        if($mode==0){
            foreach($postfields as $col=>$v){
                if(isset($columns[$col])){
                  if(!getfromarray($columns[$col],'noupdate',0) and isset($columns[$col]['Field'])){
                    $sql.="`$col`='".$this->db->real_escape_string($v)."', ";
                  }else{
                    //mylog($col." not updated",2);
                  }
                }else{
                    //mylog($col." not in columns",2);
                }
            }
        }else{
            foreach($columns as $column){
              if(!getfromarray($columns[$col],'noupdate',0)){
                if(isset($postfields[$column])){
                    $sql.="`$column`='".$this->db->real_escape_string($postfields[$column])."', ";
                }
              }
            }
        }
        return substr($sql,0,-2);
    }

    function bRecordReadPermission($in,&$out){
      $method=$in['method'];
      //$clause=$in['clause'];
      $table=$in['table'];
      $berror=getFromArray($in,'berror',0);
      $out['clause']='';
      $out['join']='';
      $include=getfromArray($GLOBALS['domain_includes'],'RBAC_Read',[]);
      if(count($include)>0){
        //mylog('bRecordReadPermission RBAC_Read set',2);
        foreach($GLOBALS['domain_includes']['RBAC_Read'] as $value){
            include str_repeat('../',$GLOBALS['script_depth']).$value;
        }
      }else{
        //mylog('bRecordReadPermission Standard',2);
        if($method==0){
          $out['clause']='1=2';
          if($berror)$this->error='no rights!';
        }elseif($method==1){
          //check client
          //$out['clause']=gsclauseand($clause,'clientID='.getfromarray($_SESSION,'clientID',0));
          $out['clause']=$table.'.clientID='.getfromarray($_SESSION,'clientID',0);
        }elseif($method==2){
          //$bok=1;
          $out['clause']='1=1';
        }elseif($method==3){
          if(getFromArray($_SESSION,'userID'==0)){
            $out['clause']='1=2';
            if($berror)$this->error='no rights, please login';
          }else{
            $out['clause']='1=1';
          }
        }elseif($method==4){ // check companyID
            $out['clause']=$table.'.companyID='.getfromarray($_SESSION,'companyID',0);
        }elseif($method==6){ // check k8login.companyID
            $out['clause']="EXISTS(SELECT 1 from k8login WHERE ".$table.".creatorID=k8login.userID and k8login.companyID=".getFromArray($_SESSION,'companyID',0).')';
        }elseif($method==7){ // check k8companyemployee.companyID
            $out['clause']="EXISTS(SELECT 1 FROM k8companyemployee WHERE ".$table.".creatorID=k8companyemployee.userID and k8companyemployee.companyID=".getFromArray($_SESSION,'companyID',0).')';
        }elseif($method==8){ // check k8companyemployee.companyID
            $out['clause']="EXISTS(SELECT 1 FROM k8companyemployee WHERE k8documents.creatorID=k8companyemployee.userID and k8companyemployee.companyID=".getFromArray($_SESSION,'companyID',0).')';
        //}elseif($method==9){ // check countryID
        //    $out['clause']=$table.'.countryID='.getfromarray($_SESSION,'countryID',0);
        }elseif($method==10){ // check creatorID
            //$out['clause']=gsclauseand($clause,$table.'.creatorID='.getfromarray($_SESSION,'userID',0));
            $out['clause']=$table.'.creatorID='.getfromarray($_SESSION,'userID',0);
        }elseif($method==11){ // check friendID
            $out['clause']="EXISTS(SELECT 1 from k8loginfriends WHERE ".$table.".creatorID=k8loginfriends.userID and k8loginfriends.friendID=".getFromArray($_SESSION,'userID',0).')';
        }elseif($method==13){ // check table.rightgroupID=k8rightmember.rightgroupID WHERE userID=SESSION[userID]
            $out['clause']="EXISTS(SELECT 1 from k8rightmembers WHERE ".$table.".rightgroupID=k8rightmembers.rightgroupID and k8rightmembers.status>0 and k8rightmembers.userID=".getFromArray($_SESSION,'userID',0).')';
        }elseif($method==14){ // check table.rightgroupID=SESSION[rightgroupID]
            $rightgroupID=getfromarray($_SESSION,'rightgroupID',0);
            $userID=getfromarray($_SESSION,'userID',0);
            $out['clause']="EXISTS(SELECT 1 from k8rightmembers WHERE $table.rightgroupID=k8rightmembers.rightgroupID and k8rightmembers.rightgroupID=$rightgroupID and k8rightmembers.userID=$userID and k8rightmembers.status>0)";
        }
      }
    }

    function bRecordUDPermission($in,&$out){
      // for getentries to get the rights: update and delete
      $userID=getFromArray($_SESSION,'userID',0);
      $method=$in['method'];
      $access=$in['access'];
      $table=$in['table'];
      $out['select']='';
      $include=getfromArray($GLOBALS['domain_includes'],'RBAC_RUD',[]);
      if(count($include)>0){
          foreach($GLOBALS['domain_includes']['RBAC_RUD'] as $value){
              include str_repeat('../',$GLOBALS['script_depth']).$value;
          }
      }else{
        if($method==0){
          $out['select']='0=1 ';
        }elseif($method==1){  //clientID
          $out['select']='('.$table.'.clientID='.getFromArray($_SESSION,'clientID',0).') ';
        }elseif($method==2){  //granted
          $out['select']='1=1 ';
        }elseif($method==3){  //user logged in?
          $value=gbnull(getFromArray($_SESSION,'userID',0));
          $out['select']=$value.' ';
        }elseif($method==4){  //companyID
          $out['select']='('.$table.'.companyID='.getFromArray($_SESSION,'companyID',0).') ';
        }elseif($method==6){  // join k8login by your own!
          $out['select']='(k8login.companyID='.getFromArray($_SESSION,'companyID',0).') ';
        }elseif($method==7){  // check k8companyemployee.companyID
          $out['select']="EXISTS(SELECT 1 FROM k8companyemployee WHERE ".$table.".creatorID=k8companyemployee.userID and k8companyemployee.companyID=".getFromArray($_SESSION,'companyID',0).')';
        }elseif($method==10){ //creatorID
          $out['select']='('.$table.'.creatorID='.getFromArray($_SESSION,'userID',0).') ';
        }elseif($method==11){ // friendID, no right
        }elseif($method==14){ // rightgroup  
          $out['select']="EXISTS(SELECT 1 FROM k8rightmembers WHERE $table.rightgroupID=k8rightmembers.rightgroupID and k8rightmembers.rightgroupID=".getFromArray($_SESSION,'rightgroupID',0)." and k8rightmembers.userID=$userID and ( (k8rightmembers.status=2 and $table.creatorId=$userID".') or k8rightmembers.status=3 ) )';
        }
      }
    }
    
    function bRecordAccess($in){
      // return brecordaccess
      // clause empty -> true
      //mylog(array('in'=>$in),2);
      $userID=getFromArray($_SESSION,'userID',0);
      $bok=0;
      $method=$in['method'];
      $clause=getfromarray($in,'clause');
      $table=getfromarray($in,'table');
      $include=getfromArray($GLOBALS['domain_includes'],'RBAC_CUD',[]);
      if(count($include)>0){
          foreach($GLOBALS['domain_includes']['RBAC_CUD'] as $value){
              include str_repeat('../',$GLOBALS['script_depth']).$value;
          }
      }else{
        if($method==0){
          $this->error='no rights!';
        }elseif($method==1){
          //check client
          if(gbnull($clause)){
              $bok=1;
          }else{
              $clause=gsclauseand($clause,'clientID='.getfromarray($_SESSION,'clientID',0));
              $bok=$this->bexist($table,$clause);
              if(!$bok){
                //!!$this->error=$l->getlangValue("system","no rights");
                $this->error='no rights!';
              }
          }
        }elseif($method==2){
          $bok=1;
        }elseif($method==3){
          $bok=getFromArray($_SESSION,'userID'<>0);
        }elseif($method==4){
          if(gbnull($clause)){
              $bok=1;
          }else{
            $clause=gsclauseand($clause,'companyID<>0 and companyID='.getfromarray($_SESSION,'companyID',0));
            $bok=$this->bexist($table,$clause);
          }  
        }elseif($method==6){
          // deprecated
          $from=$table.' INNER JOIN k8login ON '.$table.'.creatorID=k8login.creatorID';
          $clause=gsclauseand($clause,'k8login.companyID<>0 and k8login.companyID='.getfromarray($_SESSION,'companyID',0));
          $bok=$this->bexist($from,$clause);

        }elseif($method==7){ // check k8companyemployee.companyID
          $from=$table;
          $clause="EXISTS(SELECT 1 FROM k8companyemployee WHERE ".$table.".creatorID=k8companyemployee.userID and k8companyemployee.companyID=".getFromArray($_SESSION,'companyID',0).')';
          $bok=$this->bexist($from,$clause);

        }elseif($method==10){ // check creatorID
            $clause=gsclauseand($clause,'creatorID<>0 and creatorID='.getfromarray($_SESSION,'userID',0));
            $bok=$this->bexist($table,$clause);
            if(!$bok){
              $this->error='no rights!';
            }

        }elseif($method==11){ // friends
          $from=$table.' INNER JOIN k8loginfriends ON '.$table.'.creatorID=k8loginfriends.userID';
          $clause=gsclauseand($clause,'k8loginfriends.friendID<>0 and k8loginfriends.friendID='.getfromarray($_SESSION,'userID',0));
          $bok=$this->bexist($from,$clause);
          if(!$bok){
            $this->error='no rights!';
          }
        }elseif($method==14){ // rightgroups
          if(gbnull($clause)){
            if(!gbnull(getFromArray($_SESSION,'rightgroupID',0))){
              $clausetemp="rightgroupID=".$_SESSION['rightgroupID']." and userID=".getfromarray($_SESSION,'userID',0)." and status>1";
              //mylog(array('clausetemp'=>$clausetemp),2);
              $bok=$this->bexist("k8rightmembers",$clausetemp);
            }
          }else{
            $clause="EXISTS(SELECT 1 FROM k8rightmembers WHERE $table.rightgroupID=k8rightmembers.rightgroupID and k8rightmembers.rightgroupID=".getFromArray($_SESSION,'rightgroupID',0)." and k8rightmembers.userID=$userID and ( (k8rightmembers.status=2 and $table.creatorId=$userID".') or k8rightmembers.status=3 ) )';
            $bok=$this->bexist($table,$clause);
          }        
        }else{
          $this->error='permission method not valid!';
        }
      }
      //mylog(array('bok'=>$bok),2);
      return $bok;
    }
    
    public function GetFormMultiFrom($type,$search,$arr=array()) {
        // no more used $content_selected="",$category="",$clause="",$leertext='please select',$name='radio',$tags='',$columnvalue='',$columndisplay='',$sql=''
        //$type     "array", "option", "radio", "multicheck", "json", "display"
        //$search   zum Beispiel "category", "universal"
        Global $settings;
        Global $l;
        Global $basiclanguage;

        //echo '$tags: '.$tags.'<br>';
        $clientID=getFromArray($_SESSION,'clientID',0);
        $result="";
        switch ($search) {
        case 'page_parentID':
            $page_current=getfromArray($arr,'page_current');
            $clause="1=1";
            if(!gbnull($page_current)){
                $clause="pageID<>".$page_current;
            }
            $sql= "select pageID as ID, headtitle as displayname FROM k8pages ".
                " WHERE ".$clause." order by marking";
            $columnvalue='ID';
            $columndisplay='displayname';
            
            if ($type=="option"){$result=$this->getFormOption($columnvalue,$columndisplay,$sql,"","select $search");}
            elseif ($type=="jsonform_enum"){$result=$this->getjsonForm_enum($columnvalue,$columndisplay,$sql);}
            elseif (strtoupper($type)==strtoupper("getSelectJson")){$result=$this->getSelectJson($columnvalue,$columndisplay,$sql);}
            elseif (strtoupper($type)==strtoupper("getSelectJson_encode")){$result=json_encode($this->getSelectJson($columnvalue,$columndisplay,$sql));}
            elseif ($type=="jsonform_titleMap"){
              $result=$this->getjsonForm_titleMap($columnvalue,$columndisplay,$sql,"select $search");
            }elseif ($type=="select_object"){
              $result="";
            }
            break;
        }
        if(isset($GLOBALS['domain_selectfiles'])){
            foreach($GLOBALS['domain_selectfiles'] as $value){
                include str_repeat('../',$GLOBALS['script_depth']).$value;
            }
        }
        return $result;
    }
    
    public function GetFormOption($columnvalue,$columndisplay,$sql,$content_selected="",$leertext="") {
        //$columnvalue      gebundende Spalte
        //$columndisplay    angezeigte Spalte
        //$sql              SQL-Statement
        //$content_selected  aktueller Wert der Spalte
        //$leertext         falls dieser vorhanden ist, wird die Zeile mit Text ausgegeben            

        //$_SESSION["language"]=$GLOBALS['domain_language'];
        $bselected=false;
        $result="";
        //$a='\"';
        $a="'";
        if(instr($sql,"§clientID")<0){
            if (instr($sql,"datadefinitions")>=0 or instr($sql,"dataselections")>=0 or instr($sql,"groupstructure")>=0){
                //ok
            }else{
                //bei language ohne clientID
                //return "<option value='1' selected>bitte SQL-Statement richtig aufbauen</option>\n";
            }
        }else{
            $sql=str_replace("§clientID",iif(instr($sql,"datadefinitions")>=0,"1=1","clientID=$this->clientID"),$sql);
        }
        //$sql=str_replace("§language",$_SESSION["language"], $sql);
        $sql=str_replace("§language",$GLOBALS['domain_language'], $sql);
        $sql=gsReplaceFromArray(array(),$sql);
        //if (getfromarray($_SESSION,"developper",0)){echo 'GetFormOption:'.htmlspecialchars($sql)."<br>";}
        //echo '$sql='.htmlspecialchars($sql)."<br>";
        $ergebnis=$this->db->query($sql);
        if($ergebnis){
            //echo "ergebnis=true";
            while($zeile=$ergebnis->fetch_array()){
                if ($zeile[$columnvalue]==$content_selected) {
                    $selected="selected";
                    $bselected=true;
                }else {
                    $selected="";
                }
                //echo "vor result<br>";
                $result.="<option value=$a$zeile[$columnvalue]$a $selected>$zeile[$columndisplay]</option>\n";
                //echo "nach result<br>";
            }
        }else{
            $this->error="(" .$this->db->errno.") ".$this->db->error;
            echo $this->error;
        }
        if(!gbnull($leertext)){
            if (!$bselected) {
                $selected="selected";
            }else{
                $selected="";
            }
            //$result="<option value=\"\" $selected>bitte wählen</option>\n" . $result;
            $result="<option value=$a$a >$leertext</option>\n" . $result;
        }
        //echo "<pre>";
        //print_r($result);
        //echo "</pre>";
        return $result;       
    }
    /*
    public function GetOptionArray($columnvalue,$columndisplay,$sql,$content_selected="",$leertext="") {
        //$columnvalue      gebundende Spalte
        //$columndisplay    angezeigte Spalte
        //$sql              SQL-Statement
        //$content_selected  aktueller Wert der Spalte
        //$leertext         falls dieser vorhanden ist, wird die Zeile mit Text ausgegeben            

        //$_SESSION["language"]=$GLOBALS['domain_language'];
        $bselected=false;
        $result=gsclauseand($result,"$a$a:$a$leertext$a\n",!gbnull($leertext),",");
        $a='\"';
        //$a="'";
        if(instr($sql,"§clientID")<0){
            if (instr($sql,"datadefinitions")>=0 or instr($sql,"dataselections")>=0 or instr($sql,"groupstructure")>=0){
                //ok
            }else{
                //bei language ohne clientID
                //return "<option value='1' selected>bitte SQL-Statement richtig aufbauen</option>\n";
            }
        }else{
            $sql=str_replace("§clientID",iif(instr($sql,"datadefinitions")>=0,"1=1","clientID=$this->clientID"),$sql);
        }
        //$sql=str_replace("§language",$_SESSION["language"], $sql);
        $sql=str_replace("§language",$GLOBALS['domain_language'], $sql);
        $sql=gsReplaceFromArray(array(),$sql);
        //if (getfromarray($_SESSION,"developper",0)){echo 'GetFormOption:'.htmlspecialchars($sql)."<br>";}
        //echo '$sql='.htmlspecialchars($sql)."<br>";
        $ergebnis=$this->db->query($sql);
        if($ergebnis){
            //echo "ergebnis=true";
            while($zeile=$ergebnis->fetch_array()){
                if ($zeile[$columnvalue]==$content_selected) {
                    $selected=" selected:true";
                    $bselected=true;
                }else {
                    $selected="";
                }
                //echo "vor result<br>";
                $result.=gsclauseand($result,"{\"value\":$a$zeile[$columnvalue]$a,\"text\":$a$zeile[$columndisplay]$a$selected}\n",true,",");
                //echo "nach result<br>";
            }
        }else{
            $this->error="(" .$this->db->errno.") ".$this->db->error;
            echo $this->error;
        }
        //echo "<pre>";
        //print_r($result);
        //echo "</pre>";
        return $result;       
    }
    */
    
    
    public function GetjsonForm_enum($columnvalue,$columndisplay,$sql) {
        //$columnvalue      gebundende Spalte
        //$columndisplay    angezeigte Spalte
        //$sql              SQL-Statement
        //$content_selected  aktueller Wert der Spalte
        //$leertext         falls dieser vorhanden ist, wird die Zeile mit Text ausgegeben            

        //$_SESSION["language"]=$GLOBALS['domain_language'];
      
        $bselected=false;
        $result='""';
        //$sql=str_replace("§language",$_SESSION["language"], $sql);
        $sql=str_replace("§language",$GLOBALS['domain_language'], $sql);
        $sql=gsReplaceFromArray(array(),$sql);
        //if (getfromarray($_SESSION,"developper",0)){echo 'GetjsonForm_enum:'.htmlspecialchars($sql)."<br>";}
        $ergebnis=$this->db->query($sql);
        if($ergebnis){
            //echo "ergebnis=true";
            while($zeile=$ergebnis->fetch_array()){
                $result=gsclauseand($result,'"'.$zeile[$columnvalue].'"',true,',');
            }
        }else{
            $this->error="(" .$this->db->errno.") ".$this->db->error;
            echo $this->error."<br>";
            echo '$sql='.htmlspecialchars($sql)."<br>";
        }
        //return '['.$result.']';
        //echo '$result='.$result.'<br>';
        return $result;
    }
    public function GetjsonForm_titleMap($columnvalue,$columndisplay,$sql,$leertext) {
        //$columnvalue      gebundende Spalte
        //$columndisplay    angezeigte Spalte
        //$sql              SQL-Statement

        //$_SESSION["language"]=$GLOBALS['domain_language'];
        $bselected=false;
        //$a="'";
        $result='"":"'.$leertext.'"';
        //$sql=str_replace("§language",$_SESSION["language"], $sql);
        $sql=str_replace("§language",$GLOBALS['domain_language'], $sql);
        //$sql=gsReplaceFromArray(array(),$sql);
        //if (getfromarray($_SESSION,"developper",0)){echo 'GetjsonForm_enum:'.htmlspecialchars($sql)."<br>";}
        //$bshowsql=getfromarray($_REQUEST,'bshowsql',0) and ($GLOBALS['domain_development']==1 or ($GLOBALS['domain_development']==2 and ini_get("display_errors")==1));
        //if($bshowsql){echo 'GetjsonForm_enum:'.htmlspecialchars($sql)."<br>";}
        //echo 'GetjsonForm_titleMap.sql:'.htmlspecialchars($sql)."<br>";
        $ergebnis=$this->db->query($sql);
        if($ergebnis){
            //echo "ergebnis=true";
            while($zeile=$ergebnis->fetch_array()){
                $result=gsclauseand($result,'"'.$zeile[$columnvalue].'":"'.$zeile[$columndisplay].'"',true,',');
            }
        }else{
            $this->error="(" .$this->db->errno.") ".$this->db->error;
            echo $this->error."<br>";
            echo '$sql='.htmlspecialchars($sql)."<br>";
        }
        return $result;
    }
    public function getSelectJson($columnvalue,$columndisplay,$sql) {
        //$columnvalue      gebundende Spalte
        //$columndisplay    angezeigte Spalte
        //$sql              SQL-Statement

        //$_SESSION["language"]=$GLOBALS['domain_language'];
        $bselected=false;
        $result=array();
        $result[]=array("value"=>"","text"=>"please select");
        //$sql=str_replace("§language",$GLOBALS['domain_language'], $sql);
        //!!! $sql=str_replace("§language",$_SESSION["language"], $sql);
        $ergebnis=$this->db->query($sql);
        if($ergebnis){
            while($zeile=$ergebnis->fetch_array(MYSQLI_ASSOC)){
              /*
              */
              $record=array();
              foreach($zeile as $k=>$v){
                if($k==$columnvalue){
                  $record['value']=$v;
                }else if($k==$columndisplay){
                  $record["text"]=$v;
                }else{
                  $record[$k]=$v;
                }
              }
              $result[]=$record;
              //$result[]=array("value"=>$zeile[$columnvalue],"text"=>$zeile[$columndisplay]);
            }
        }else{
            $this->error="(" .$this->db->errno.") ".$this->db->error;
            echo $this->error."<br>";
            echo '$sql='.htmlspecialchars($sql)."<br>";
        }
        return $result;
    }
    
    public function check_foreignkey($table,$column,$value,$bwithclientID=0,$text='',$clause=''){
        //Global $l;
        //Global $langmodule;
        $error='';
        if(gbnull($text)){$text=$table;}
        $clause=gsclauseand($clause, $column.'='.gsstr2sql($value));
        $clause=gsclauseand($clause,'clientID='.$this->clientID,$bwithclientID);
        if($this->bexist($table,$clause)){
            //$error=$l->getlangValue('system','delete first').': '.$l->getlangValue('system',$text).'<br>';
            //$error='delete first '.$text.'  ';
            $error=$text.'  ';
        }else{
            $error=$this->error;
        }
        return $error;
    }
}

class languagesupport{
	private $language = array ();
        private $mylanguage;
        private $module;
	public $dbclass;
        public $loadedmodules; // string
        private $bexmark;
        private $mode;  // 0=deaktiviert, 1=aktiviert mit "!", 2=aktiviert ohne "!"
        private $echo;
        
	public function __construct($languageID=0,$module=''){
            $this->echo=0;
            $this->mode=2;
            $this->dbclass=new dbclass();
            $this->loadedmodules='';
            //$this->mode=getfromarray($GLOBALS,'languagemode',0);
            if($this->mode==1){
                $this->bexmark=1;            
            }
            if($languageID==0){
                //$this->mylanguage=$_SESSION['domain_languageID'];
                $this->mylanguageID=$GLOBALS['domain_languageID'];
            }else{
                $this->mylanguageID=$languageID;
            }
            if(gbnull($module)){
                $this->module="system";
            }else{
                $this->module=$module;
            }
            mylog('__construct('.$languageID.','.$module.')',$this->echo);
            $this->addLangModule($this->module);
            //echo '$this->mylanguageID='.$this->mylanguageID.'<br>';
        }

	public function isLoadedLangModule($module)	{
            $bloaded=(strpos($this->loadedmodules,'['.$module.']')!==false);
            /*if($bloaded){
                echo '1.loadedmodules: '.$this->loadedmodules.' loaded. '.$module.'<br>';
            }else{
                echo '1.loadedmodules: '.$this->loadedmodules.' not loaded. '.$module.'<br>';
            }
             */
            return $bloaded;
        }
        
	public function addLangModule($module)	{
            // Fügt ein Sprachmodul zum globalen Array language hinzu
            // @param varchar Modulname
            if($GLOBALS['domain_langsupport']){
                if(!gbnull($module)){
                    if($this->isLoadedLangModule($module)){
                        return;
                    }
                    $this->loadedmodules=gsclauseand($this->loadedmodules,'['.$module.']',1,',');
                    mylog('addLangModule.loadedmodules: '.$this->loadedmodules,$this->echo);

                    $query = "SELECT * FROM k8languages WHERE module = '".$module."' AND languageID = '".$this->mylanguageID."'";
                    $result = $this->dbclass->db->query($query);
                    if($result){
                        while ($lang=$result->fetch_array()){
                                $key = $lang['key'];
                                $value = $lang['value'];
                                //echo $module . " Key:". $key ."<br>";
                                $this->language[$module][$key] = $value;
                        }
                    }
                }
            }
	}

	public function l($key, $module=''){
            if(!gbnull($module))$this->module=$module;
            return $this->getlangValue($this->module, $key); 
        }
        
	/**
	 * Gibt den korrekten Sprachwert zurück
	 * 
	 * @param varchar Name des Moduls
	 * @param varchar Bezeichner des Sprachwertes
	 * @param boolean Ausgabe direkt oder per Rückgabewert
	 * @param boolean Soll die Ausgabe für eine Schaltfläche erfolgen
	 * 
	 * @return varchar Gibt den spezifischen Sprachwert zurück
	 */
	public function getlangValue($module, $key, $echo = false, $button = false){
            
            mylog("getlangValue($module,$key)",$this->echo);
            if($this->mode==0) return $key;
            mylog("after mode",$this->echo);
            if(gbnull($module)){return $key;}elseif(gbnull($key)) return '$module:'.$module.' $key:'.$key;
            
            if($GLOBALS['domain_langsupport']){

                if(isset($this->language["".$module.""]["".$key.""])){
                    $value=$this->language["".$module.""]["".$key.""];
                    mylog("loaded",$this->echo);
                }else{
                    mylog("not loaded",$this->echo);
                    if($this->isLoadedLangModule($module)){
                        //echo $module." loaded, key will be added<br>";
                        $value=null;
                    }else{
                        $this->addLangModule($module);
                        if(isset($this->language["".$module.""]["".$key.""])){
                            //echo "after addLangModule=$module, key=$key set<br>";
                            $value=$this->language["".$module.""]["".$key.""];
                        }else{
                            if(0){
                            echo "after addLangModule: language='$this->mylanguageID' module=$module, key=$key not set<br>";
                            echo '<pre>';
                            print_r($this->language);
                            echo '</pre>';
                            exit;
                            }
                            $value=null;
                        }
                    }
                }    
                //Ist der Wert vorhanden
                if ($value == null and !gbnull($key)){
                        $this->addLanguageValue($module, $key);
                        //$return = iif($this->bexmark,"!".$_SESSION["language"]. " ",'').$key;
                        $return = iif($this->bexmark,"!".$GLOBALS["domain_language"]. " ",'').$key;
                }else{
                        $return = $value;
                }

                //Return-Wert bearbeiten wenn Debug-Modus an
                if (defined('LanguageDebugModus')){
                        if ($button){
                                $return = "[".$return."]";
                        }else{
                                $return = "<span style='background-color:orange;'>".$return."</span>";
                        }
                }
                if ($echo){
                        echo $return;
                }else{
                        return $return;
                }
            }else{
                return $key;
            }
	}

	/**
	 * Diese Methode fügt einen Sprachwert automatisch in die 
	 * Datenbank ein. 
	 * 
	 * @param varchar Modulname
	 * @param varchar Bezeichner des Sprachwertes
	 */
	private function addLanguageValue($module, $key){
            mylog("addLanguageValue($module, $key)",$this->echo);
            if(!gbnull($module) and !gbnull($key)){
                mylog("this->mylanguageID=$this->mylanguageID",$this->echo);
                if($this->mylanguageID==2){
                    //Alle benutzten Sprache aus der Datenbank finden.
                    $sql = "SELECT DISTINCT languageID FROM k8languages";
                    $ergebnis = $this->dbclass->db->query($sql);
                    //Für jede Sprache einen Wert hinzufügen:
                    if($ergebnis){
                      while ($zeile=$ergebnis->fetch_array()){
                          //echo "<pre>";
                          //print_r ($zeile);
                          //echo "</pre>";
                          if(!$this->dbclass->bexist('k8languages','module='.gsstr2sql($module).' and `key`='.gsstr2sql($key).' and languageID='.$zeile['languageID'])){
                              $sql = "INSERT INTO k8languages (module,k8languages.key,languageID,value) 
                                      VALUES ('".$module."','".$key."',".$zeile['languageID'].",".gsstr2sql(iif($this->bexmark,'! ','').$key).");";
                                  //echo htmlspecialchars($sql).'<br>';
                                  $result=$this->dbclass->db->query($sql);
                          }
                      }
                    }
                }else{
                    if(!$this->dbclass->bexist('k8languages','module='.gsstr2sql($module).' and `key`='.gsstr2sql($key).' and languageID='.$this->mylanguageID)){
                        $sql = "INSERT INTO k8languages (module,k8languages.key,languageID,value) 
                            VALUES ('".$module."','".$key."','".$this->mylanguageID."', ".gsstr2sql(iif($this->bexmark,'! ','').$key).");";
                        //echo htmlspecialchars($sql).'<br>';
                        mylog($sql,$this->echo);
                        $result=$this->dbclass->db->query($sql);
                    }
                }
            }
	}

        public function Language_tablecolumns_read($module,$languageID,$pk,$dat){
            $sql='SELECT value FROM language WHERE module='.gsstr2sql($module).' and languageID='.gsstr2sql($languageID).' and pk='.gsstr2sql($pk);
            $ergebnis=$this->dbclass->db->query($sql);
            if($ergebnis){
		while ($zeile=$ergebnis->fetch_array()){
                    if (!gbnull($zeile['value'])){
                        $dat[$zeile['key']]=$zeile['value'];
                    }
		}
            }
            return $dat;
	}

        public function Language_tablecolumn_read($module,$languageID,$pk,$column,$default=''){
            $value=$this->dbclass->lookup('value','languageID','module='.gsstr2sql($module).' and languageID='.gsstr2sql($languageID).' and pk='.gsstr2sql($pk).' and `key`='.gsstr2sql($column));
            return iif(gbnull($value),$default,$value);
	}

        public function Language_tablecolumn_write($module,$languageID,$pk,$column,$value){
            if($this->dbclass->bexist('language','module='.gsstr2sql($module).' and language='.gsstr2sql($languageID).' and pk='.gsstr2sql($pk).' and `key`='.gsstr2sql($column))){
                //update
                $sql = "UPDATE k8languages SET value='".$value."' ".
                    " WHERE module='".$module."' and language='".$languageID."' and pk='".$pk."' and `key`='".$column."'";
                //echo $sql;
            }else{
                //insert
                $sql = "INSERT INTO k8languages (module,languageID,pk,`key`,value) ".
                    "VALUES ('".$module."','".$languageID."','".$pk."','".$column."','" .$value. "');";
            }
            //echo 'save auskommentiert: '.htmlspecialchars($sql).'<br>';
            $result=$this->dbclass->db->query($sql);
            return $result;
	}
        
        public function Language_tablecolumn_delete($module,$languageID,$pk,$column){
            $result=$this->dbclass->query('DELETE FROM k8languages WHERE module='.gsstr2sql($module).' and languageID='.gsstr2sql($languageID).' and pk='.gsstr2sql($pk).' and `key`='.gsstr2sql($column));
            return $result;
	}
        
}

function customError($errno, $errstr) {
    echo "<b>Error:</b> [$errno] $errstr<br>";
    echo "Ending Script";
    die();
  } 

  
function table2searchfields($table,$cols){
    Global $becho;
    $searchfields="";
    if($cols){
      foreach($cols as $k=>$col){
        if(isset($col['fieldname'])){
          $searchfields=gsclauseand($searchfields,$table.'.'.'`'.$col['fieldname'].'`',$col['mytype']=="VARCHAR" or $col['mytype']=="TEXT",",");
        }
      }
    }
    return $searchfields;
}
  
function table2colobject($cols,&$colarray,$fix=false){
    $columns=array();
    if($cols){
      foreach($cols as $k=>$col){
        if(isset($col['fieldname'])){
          if($fix){
            if(!isset($col['noupdate'])){
              $col['noupdate']=0;
              if(getFromArray($col,'Extra')=='auto_increment' or instr(',companyID,clientID,creatorID,datecreated,datetimecreated',','.$col['fieldname'].',')>-1){
                $col['noupdate']=1;
              }
            }
            if(!isset($col['noinsert'])){
              $col['noinsert']=0;
              if(getFromArray($col,'Extra')=='auto_increment' or instr(',companyID,clientID,creatorID,datecreated,datetimecreated',','.$col['fieldname'].',')>-1){
                $col['noinsert']=1;
              }
            }
          }
          $col['noupdate']=getFromArray($col,'noupdate',0);
          $col['noinsert']=getFromArray($col,'noinsert',0);
            
          $columns[$col['fieldname']]=$col;
          
          if(in_array($col['mytype'],$GLOBALS['numericTypesAll'])){
              $colarray['num'][]=$col['fieldname'];
          }
        }
      }
    }
    return $columns;
}

function table2tabulator($cols,$placeholders){
    Global $becho;
    // 	columns:[ //Define Table Columns
	// 	{title:"Name", field:"name", width:150, headerFilter:true, headerFilterLiveFilter:false,cssClass:"test"},
	// 	{title:"Age", field:"age", align:"left", formatter:"progress"},
	// 	{title:"Favourite Color", field:"col", headerFilter:true},
	// 	{title:"Date Of Birth", field:"dob", sorter:"date", align:"center",headerFilter:true},
 	//],
    $columns=array();
    $colmax=8;
    $i=0;
    if($cols){
      foreach($cols as $k=>$col){
          if($becho){
          //echo '<br>';
          //var_dump($col);
          //echo $col.'<br>';
          }
          //if(instr(',clientID,creatorID,datecreated,datetimecreated',','.$col['fieldname'].',')===-1){
          if(instr(',companyID,clientID,creatorID',','.$col['fieldname'].',')===-1){
          
              $mytype=getfromArray($col,'mytype');
              $dat=array();
              //if(getFromArray($col,'myextra')=='auto_increment'){
              if(false){
                  // dont display
              }else{
                  $title=(gbnull(getfromArray($col,'label'))? $col['fieldname'] : $col['label']);
                  $dat=array('title'=>$title,'field'=>$col['fieldname'],'headerFilter'=>true);
                  if(is_tablefieldnumeric($col['mytype'])){
                      $dat['hozAlign']='right';
                      $dat['width']='80';
                      //echo $col['Type'].'<br>';
                      //echo $col['mytype'].'<br>';
                      if(is_tablefielddecimal($col['mytype']) and gbnull(getfromArray($col,'decimals',0))){
                          $col['decimals']=2;
                          if(is_tablefielddecimal($col['mytype'])=="DECIMAL"){
                            preg_match_all("/\((.*?)\)/", $col['Type'], $matches); 
                            if(isset($matches[1][0])){
                                $arr=explode(",",$matches[1][0]);
                                if(isset($arr[1]))$col['decimals']=$arr[1];
                            }
                          }
                      }
                      if(getfromArray($col,'decimals',0)>0){
                          $dat['formatter']='money';
                          if($placeholders){
                            $dat['formatterParams']=array('decimal'=>'GLOBALS_decimal_point','thousand'=>'GLOBALS_thousands_sep','precision'=>$col['decimals']);
                          }else{
                            $dat['formatterParams']=array('decimal'=>$GLOBALS['decimal_point'],'thousand'=>$GLOBALS['thousands_sep'],'precision'=>$col['decimals']);
                          }
                      }
                  }elseif(instr($mytype,'CHAR')>=0 and !gbnull(getfromArray($col,'size'))){
                      $width=getfromArray($col,'size')*10;
                      if($width>250)$width=250;
                      //$dat['width']=$width;
                  }elseif($mytype=='DATE'){
                      $dat['width']=120;
                      $dat['headerFilter']='input';
                      $dat['formatter']='datetime';
                      if($placeholders){
                          $dat['formatterParams']=array('inputFormat'=>'yyyy-MM-dd','outputFormat'=>'GLOBALS_tabulatordateformat');
                      }else{
                          $dat['formatterParams']=array('inputFormat'=>'yyyy-MM-dd','outputFormat'=>$GLOBALS['tabulatordateformat']);
                      }
                  }elseif($mytype=='TIME'){
                      $dat['width']=70;
                      $dat['headerFilter']='input';
                      $dat['formatter']='datetime';
                      if($placeholders){
                          $dat['formatterParams']=array('inputFormat'=>'HH:mm:ss','outputFormat'=>'GLOBALS_tabulatortimeformat');
                      }else{
                          $dat['formatterParams']=array('inputFormat'=>'HH:mm:ss','outputFormat'=>$GLOBALS['tabulatortimeformat']);
                      }
                  }elseif($mytype=='DATETIME'){
                      $dat['width']=160;
                      $dat['headerFilter']='input';
                      $dat['formatter']='datetime';
                      if($placeholders){
                          $dat['formatterParams']=array('inputFormat'=>'yyyy-MM-dd HH:mm:ss','outputFormat'=>'GLOBALS_tabulatordatetimeformat');
                      }else{
                          $dat['formatterParams']=array('inputFormat'=>'yyyy-MM-dd HH:mm:ss','outputFormat'=>$GLOBALS['tabulatordatetimeformat']);
                      }
                  }
              }
              if(getFromArray($col,'myextra')=='auto_increment' or $i>$colmax){
                  $dat['visible']=false;
              }
              $columns[]=$dat;
              $i++;
              //if($colmax>0 and $i>$colmax)break;
          }
      }
    }
    return $columns;
}

function table2jsonform($cols){
    /* $cols:
    fieldname, mytype are obligatory!
    
    retruns object structure:
    schema:{
        name: {
            type: 'string',
            title: 'Name',
            required: true
        }
    }
    */
    $schema=array();
    $jsontype="";
    if($cols){
      foreach($cols as $k=>$col){
          if(instr('companyID,clientID,creatorID,datecreated,datetimecreated',','.$col['fieldname'].',')===-1){
              $mytype=getfromArray($col,'mytype');
              if(getfromArray($col,'fieldtype',0)==1 or getFromArray($col,'myextra')=='auto_increment'){
                  $jsontype='hidden';
              }else{
                  $jsontype=table2jsonformtype($col['mytype']);
              }
              $schema[$col['fieldname']]=array('type'=>$jsontype);
              if(gbnull(getfromArray($col,'label'))){
                  $schema[$col['fieldname']]['title']=$col['fieldname'];
              }else{
                  $schema[$col['fieldname']]['title']=$col['label'];
              }
              //echo instr(getfromArray($col,'mytype'),'CHAR').' / '.getfromArray($col,'size').'<br>';
              if(instr($mytype,'CHAR')>=0 and !gbnull(getfromArray($col,'size'))){
                  $schema[$col['fieldname']]['maxLength']=$col['size'];
              }
              if(getfromArray($col,'decimals',0)>0)$schema[$col['fieldname']]['step']='0.'.str_repeat('0',$col['decimals']-1).'1';
              if(getfromArray($col,'required',false)) $schema[$col['fieldname']]['required']=true;
          }
      }
    }
    return $schema;
}

function table2k8form($cols){
    // $cols:
    // name/fieldname, mytype are obligatory!
    //mylog("table2k8form",2);
    $fields=array();
    $jsontype="";
    if($cols){
      foreach($cols as $k=>$col){
          if(instr(',companyID,clientID,creatorID,datecreated,datetimecreated,',','.$col['fieldname'].',')===-1){
              $field=array();
              $mytype=getfromArray($col,'mytype');
              if(getfromArray($col,'fieldtype',0)==1 or getFromArray($col,'myextra')=='auto_increment'){
                  $jsontype='hidden';
              }else{
                  $jsontype=table2k8formtype($col['mytype']);
              }
              $field['name']=$col['fieldname'];
              if(instr($mytype,"TEXT")>-1){
                $field['tagName']="textarea";
              }else{
                $field['type']=$jsontype;
              }
              if(gbnull(getfromArray($col,'label'))){
                  $field['label']=$col['fieldname'];
              }else{
                  $field['label']=$col['label'];
              }
              if(instr($mytype,'CHAR')>=0 and !gbnull(getfromArray($col,'size'))){
                  if(!isset($field['attributes']))$field['attributes']=array();
                  $field['attributes']['maxlength']=$col['size'];
              }
              if(is_tablefielddecimal($col['mytype']) and gbnull(getfromArray($col,'decimals',0))){
                //mylog(array('is decimal'=>$col),2);
                if($col['mytype']=='DECIMAL'){
                  $arr=explode(',',$col['size']);
                  //mylog($arr,2);
                  if(count($arr)==2){
                    $col['decimals']=$arr[1];
                  }else{
                    $col['decimals']=0;
                  }
                }else{
                  $col['decimals']=2;
                }
              }
              if(getfromArray($col,'decimals',0)>0){
                  //mylog($col,2);
                  $field['decimals']=$col['decimals'];
                  if(!isset($field['attributes']))$field['attributes']=array();
                  $field['attributes']["step"]='0.'.str_repeat('0',$col['decimals']-1).'1';
                  //mylog(array('$field'=>$field),2);
              }
              if(getfromArray($col,'required',false)) $field['required']=true;
              $fields[]=$field;
          }
      }
    }
    return $fields;
}

function table2fieldlist($cols){
    $fieldarr=array();
    if($cols){
      foreach($cols as $k=>$col){
          if(instr(',companyID,clientID,creatorID,datecreated,datetimecreated',','.$col['fieldname'].',')===-1){
              $fieldarr[]=$col['fieldname'];
          }
      }
    }
    return $fieldarr;
}

function searchtype($mytype){
  $searchtype="OTHER";
  if(is_tablefieldnumeric($mytype)){
    $searchtype="NUMBER";
  }elseif(in_array($mytype,$GLOBALS['stringTypes'])){
    $searchtype="STRING";
  }elseif(in_array($mytype,array("DATE","DATETIME","TIME","BOOLEAN"))){
    $searchtype=$mytype;
  }else{
    $searchtype=$mytype;
  }
  return $searchtype;
}

function is_tablefieldnumeric($mytype){
    $arr=explode('(',$mytype);
    $t='';
    if(isset($arr[0])){
        $t=strtoupper($arr[0]);
    }else{
        $t=strtoupper($mytype);
    }
    return (in_array($t,$GLOBALS['numericTypesAll']));
}

function is_tablefielddecimal($mytype){
    $arr=explode('(',$mytype);
    $t='';
    if(isset($arr[0])){
        $t=strtoupper($arr[0]);
    }else{
        $t=strtoupper($mytype);
    }
    return (in_array($t,$GLOBALS['numericTypesDecimal']));
}

function tablefieldtype($mytype){
    $arr=explode('(',$mytype);
    $t='';
    if(isset($arr[0])){
        $t=strtoupper($arr[0]);
    }else{
        $t=strtoupper($mytype);
    }
    return $t;
}

function table2jsonformtype($mytype){
    /*
    $arr=explode('(',$mytype);
    $t='';
    if(isset($arr[0])){
        $t=strtoupper($arr[0]);
    }else{
        $t=strtoupper($mytype);
    }
    if(in_array($t,$GLOBALS['numericTypesAll'])){
    //if(strtoupper(substr($t,0,3))=='INT' or strtoupper(substr($t,0,7))=='NUMERIC' or strtoupper($t)=='FLOAT'){
        */
    $t=tablefieldtype($mytype);
    if(is_tablefieldnumeric($mytype)){
        return "number";
    }elseif($t=='DATE'){
        return "date";
    }elseif($t=='DATETIME'){
        return "datetime-local";
    }elseif($t=='TIME'){
        return "time";
//    }elseif($t=='DATE' or $t=='DATETIME' or $t=='TIME'){
//        return "date";
    }else{
        return "text";
    }
}
function table2k8formtype($mytype){
    $t=tablefieldtype($mytype);
    if(is_tablefieldnumeric($mytype)){
        return "number";
    }elseif($t=='DATE'){
        return "date";
    }elseif($t=='DATETIME'){
        return "datetime-local";
    }elseif($t=='TIME'){
        return "time";
    }else{
        return "text";
    }
}

Function gsclauseand($sql,$clause,$condition=1,$delimiter=' and '){
    if($condition){
        if(strlen($sql)>0 and strlen($clause)>0){
            return $sql.$delimiter.$clause;
        }else{
            if(strlen($sql)>0){
                return $sql;
            }else{
                return $clause;
            }
        }
    }else{
        return $sql;
    }
}

Function iif($if,$t1,$t2=''){
if($if){
    $result= $t1;
}else{
    $result= $t2;
} 
return $result;
}

function gsstr2sql($v){
    return "'". str_replace("'"," ",$v)."'";
}

function gbnull($v){
    if(is_numeric($v)){
        return ($v==0);
    }elseif(is_array($v)){
        return false;
    }elseif(substr($v,0,10)=="0000-00-00"){
        return true;
    }else{
        return (strlen(trim($v))==0);
    }
}

function glclng($v){
    if(is_numeric($v)){
        return (intval($v));
    }else{
        return (0);
    }
}

function getFromArray($arr,$term,$default='',$bn=0){
    //falls Array-Term gesetzt, Rückgabe des Wertes, sonst Default
    //bn=1, es wird auch bei 0 oder '' default zurückgegeben
    if (isset($arr[$term])) {
        if($arr[$term]==='' || ($bn and ($arr[$term]=='0' or $arr[$term]==0))){   // or $arr[$term]=='0' or $arr[$term]==0){  problems when you try to set 0
        //if($bn and (($arr[$term]=='0' or $arr[$term]==0))){   // or $arr[$term]=='0' or $arr[$term]==0){  problems when you try to set 0
            return $default;
        }else{
            //echo $arr[$term].'<br>';
            return $arr[$term];
        }
    }else{
        return $default;
    }    
}
function InStr($haystack,$needle,$offset=0){
    if(empty($needle) or empty($haystack)){
        return -1;
    }
    if(is_numeric($haystack))$haystack=strval($haystack);
    $pos=strpos($haystack,$needle,$offset);
    if ($pos !== false){
        return $pos;
    }else{
        return -1;
    }
} 

function isDate($value){
    if(!$value) {
        return false;
    }
    try{
        new \DateTime($value);
        return true;
    } catch (\Exception $e) {
        return false;
    }
}

function mylog($message,$mode=0){
    // $message: array or value
    // $mode: 0=no log, 1=window, 2=Log.txt
    if(is_array($message)){
        if($mode===1){
            echo '<pre>';
            print_r($message);
            echo '</pre>';
        }elseif($mode===2){
            //WriteLog("array");
            WriteLog(json_encode($message));
        }
    }else{
        if($mode===1) echo $message.'<br>';
        if($mode===2){
          //WriteLog("no array"); 
          WriteLog($message);
        }
    }
}

function WriteLog($txt,$filename='Log.txt',$mode='a'){
    $path=str_repeat('../',getFromArray($GLOBALS,'script_depth',0));
    $myfile = fopen($path.$filename, $mode) or die("Unable to open file!");
    fwrite($myfile, date('d.m.Y h:i:s').' '.$txt.PHP_EOL);
    fclose($myfile);
}

function gbwrite_file($txt,$filename,$mode='a'){
    $myfile = fopen($filename, $mode) or die("Unable to open file!");
    fwrite($myfile,$txt);
    fclose($myfile);
    return true;
}

function gsread_file($file){
    $temp="";
    $handle=fopen($file,"r");
    if(filesize($file))$temp=fread($handle,filesize($file));
    fclose($handle);
    $bom = pack('H*','EFBBBF');
    $temp=preg_replace("/^$bom/", '', $temp);
    return $temp;
}
function rrmdir($src) {
  if(file_exists($src)){
    $dir = opendir($src);
    while(false !== ( $file = readdir($dir)) ) {
        if (( $file != '.' ) && ( $file != '..' )) {
            $full = $src . '/' . $file;
            if ( is_dir($full) ) {
                rrmdir($full);
            }
            else {
                unlink($full);
            }
        }
    }
    closedir($dir);
    rmdir($src);
  }
}

function str_endsWith( $haystack, $needle ) {
    $length = strlen( $needle );
    if( !$length ) {
        return true;
    }
    return substr( $haystack, -$length ) === $needle;
}

function gbEmptyStructure($structure){
    if(is_array($structure)){
        foreach($structure as $k => $v){
            if(is_array($v)){
                if(!gbEmptyStructure($v)){
                    return false;
                }
            }elseif(!gbnull($v)){
                //echo $k."=".$v.'<br>';
                return false;
            }
        }
    }
    return true;
}


// ----------------- login / logout ---------------------
function logout(){
    /*
    if(isset($_SESSION['clientID']))unset($_SESSION['clientID']);
    if(isset($_SESSION['userID']))unset($_SESSION['userID']);
    if(isset($_SESSION['username']))unset($_SESSION['username']);
    if(isset($_SESSION['password']))unset($_SESSION['password']);
    if(isset($_SESSION['pwdencrypted']))unset($_SESSION['pwdencrypted']);
    if(isset($_SESSION['roleID']))unset($_SESSION['roleID']);
    if(isset($_SESSION['dat_user']))unset($_SESSION['dat_user']);
    if(isset($_SESSION['rightgroupID']))unset($_SESSION['rightgroupID']);
    if(isset($_SESSION['roles'])){
        unset($_SESSION['roles']);
        $_SESSION['roles']=array(0=>0);
    }
    */
    //unset($_SESSION['tabulatordatetimeformat']);
    foreach($_SESSION as $k=>$v)        {
      //mylog($k,2);
      unset($_SESSION[$k]);
    }
    //mylog($_SESSION,2);
    
    $_SESSION['roles']=array(0=>0);
    setcookie("login","",time()-3600,"/",$_SERVER['HTTP_HOST']); //Chrome
    if(isset($_COOKIE['login'])){
        if(setcookie("login",$_COOKIE['login'],time()-3600,"/",$_SERVER['HTTP_HOST'])){ //firefox
            //mylog('cookie deleted',2);
        }else{
            //mylog('cookie NOT deleted',2);
        }
    }else{
        //mylog('logout(): cookie[login] not set',2);
    }
    //session_destroy();
    $status=iif(isset($_COOKIE['login']),1,0);
    if(isset($GLOBALS['domain_includes']['logout'])){
        foreach($GLOBALS['domain_includes']['logout'] as $value){
            include str_repeat('../',$GLOBALS['script_depth']).$value;
        }
    }
    //header("Refresh:0");
    //exit;
    return $status;
}

function changePassword($oldpassword,$newpassword,$confirmedpassword,&$error){
  $bok=false;
  if($newpassword!==$confirmedpassword){
    $error="new and confirmed password are not equal!";
  }elseif(gbnull($newpassword)){
    $error="please enter new password!";
  }elseif(gbnull(getfromArray($_SESSION,'userID'))){
    $error="please login first!";
  }else{
    $dbclass=new dbclass();
    $password=$dbclass->lookup("password","k8login","userID=".$_SESSION['userID']);
    if($password==$oldpassword){
      // change
      $sql="UPDATE k8login SET password=".gsstr2sql($newpassword)." WHERE userID=".$_SESSION['userID'];
      $result=$dbclass->db->query($sql);
      if($result){
        $bok=true;
        
        // delete cookie
        setcookie($_SERVER['SERVER_NAME'],'',time()-3600,"/",$_SERVER['HTTP_HOST']);                
        
      }else{
        $error="(" .$this->db->errno.") ".$this->db->error;
      }
    }else{
      $error="old password is not correct!";
    }
  }
  return $bok;
}

function login($name,$pwd,&$error="",$rememberme=0,$nopwd=0,$pwdencrypted="",$autologin=0){
    Global $l;
    Global $langmodule;
    Global $settings;
    $echo=2;
    $result=0;
    $_SESSION['clientID']=0;
    $_SESSION['userID']=0;
    $_SESSION['roles']=[];
    //$_SESSION["superuser"]=0;
    //$_SESSION["userdispname"]="";
    $_SESSION["username"]="";
    $_SESSION["password"]="";
    //$_SESSION["user_onlyname"]="";
    //$_SESSION["user_email"]="";
    //$_SESSION["user_array"]=array();
 
    //active:
    //0 not active
    //1 active
    //2 blocked
    //3 deleted
    //mylog(array("function"=>"login","backurl"=>getfromArray($_SESSION,'backurl')),2);
    if($GLOBALS['domain_loginenabled']==1){
      //echo "login :".$name." pwd:".$pwd.', $rememberme='.$rememberme."<br>";
      $bwithout_activ=!getFromArray($GLOBALS,'domain_useractive',1);

      $dat=array();
      $dbclass=new dbclass();

      //$data=$getEntries("username='$name'");
      //$sql="SELECT k8login.* FROM k8login WHERE §clientID and username=".gsstr2sql($dbclass->db->real_escape_string($name));
      $sql="SELECT k8login.* FROM k8login WHERE username=".gsstr2sql($dbclass->db->real_escape_string($name));
      $data=$dbclass->getEntries($sql);
      if(!is_array($data)){
          $data=$dbclass->getEntries($sql,0);
      }
      if(0){
        //echo 'Error:'.$getError();
        echo '<pre>';
        print_r($data);
        echo '</pre>';
        exit;
      }    
      if($data){
          $data[0]["settings"]=json_decode($data[0]["settings"],true);
          list($dat)=$data;
          //echo '<pre>';
          //print_r($dat);
          //echo '</pre>';
          if($nopwd){
              $result=true;
          }elseif($dat['active']==0){
              //echo 'active==0'.'<br>';
              if($bwithout_activ){
                  $result=false;
                  if(gbnull($pwdencrypted)){
                    $result=($dat["password"]==$pwd);
                  }else{
                    $result=(md5($dat["password"])==$pwdencrypted);
                  }
                  if(!$result){
                    $error=$l->getlangValue($langmodule,"password not valid");
                  }
              }else{
                  $error=$l->getlangValue($langmodule,"account inactive");
              }            
          }elseif($dat['active']==1){
              $result=false;
              if(gbnull($pwdencrypted)){
                $result=($dat["password"]==$pwd);
              }else{
                $result=(md5($dat["password"])==$pwdencrypted);
              }
              if(!$result){
                $error=$l->getlangValue($langmodule,"password not valid");
              }
          }elseif($dat['active']==2){
              $error=$l->getlangValue($langmodule,"account blocked");
          }elseif($dat['active']==3){
              $error=$l->getlangValue($langmodule,"account deleted");
          }else{
              $error=$l->getlangValue($langmodule,"account inactive");
          }
          //echo '$error='.$error.'<br>';
          //echo '$result='.$result.'<br>';
          //exit;
          if($result){
              //mylog("login successful",2);
              //mylog(array('login backurl'=>getfromArray($_SESSION,'backurl'),2);
              $result=$dat["userID"];    
              $_SESSION['clientID']=$dat["clientID"];
              $_SESSION['userID']=$dat["userID"];
              $_SESSION["username"]=$name;
              $_SESSION["password"]=$pwd;
              $_SESSION["pwdencrypted"]=md5($dat["password"]);
              $_SESSION['rightgroupID']=$dat["rightgroupIDdefault"];
              unset($dat['password']);
              $_SESSION["dat_user"]=$dat;
              //$_SESSION["roleID"]=$dat["roleID"];
              if(!gbnull($dat["roles"]))$_SESSION["roles"]=explode(',',$dat["roles"]);
              //$_SESSION["superuser"]=$dat["superuser"];
              //$_SESSION["userdispname"]=getfromarray($dat,"disptitle",''). " " . $dat["lastname"];
              //setcookie('login',$_SESSION['clientID'].'|'.$_SESSION['username'].'|'.$_SESSION['password'],(time()+60*60*24*3000));
              if($rememberme){
                  //$_SESSION['bnewlogin']=1;
                  $companyID=getFromArray($_SESSION,'companyID',0);
                  setcookie('login',$companyID.'|'.$_SESSION['username'].'|'.$_SESSION['pwdencrypted'],(time()+60*60*24*3000),"/",$_SERVER['HTTP_HOST']);
              }else{
                  //setcookie($_SERVER['SERVER_NAME'],'',time()-3600);                
                  setcookie($_SERVER['SERVER_NAME'],'',time()-3600,"/",$_SERVER['HTTP_HOST']);                
              }
              if(isset($GLOBALS['domain_includes']['login'])){
                  foreach($GLOBALS['domain_includes']['login'] as $value){
                      include str_repeat('../',$GLOBALS['script_depth']).$value;
                  }
              }
              
              //mylog(array("before redirect backurl"=>getfromArray($_SESSION,'backurl')),2);
              // 2024-08-14 by auto login, it's always displayed!  $backurl=$GLOBALS['domain_url_afterlogin'];
              if(!$autologin){
                $backurl="";
                $domain_url_afterlogin=getFromArray($GLOBALS,'domain_url_afterlogin');
                if(isset($_SESSION['backurl'])){
                  $backurl=$_SESSION['backurl'];
                  unset($_SESSION['backurl']);
                }elseif(!gbnull($domain_url_afterlogin)){
                  $backurl=$GLOBALS['domain_url_afterlogin'];
                }
                if(!gbnull($backurl)){
                  header("Location: $backurl");
                  exit;                    
                }
              }
          }
      }else{
        $error="user or password not valid!";
      }
      //echo "result:".$result."<br>";
      //echo "Error:".$error."<br>";
    }else{
        $error="Login temporarely not available!";
    }
    //mylog(array("login error"=>$error),2);
    return $result;
}

function updateSession(){
  //mylog("updateSession",2);
  if(!gbnull(getfromArray($_SESSION,'userID'))){
    $dbclass = new dbclass();
    $sql="SELECT * FROM k8login WHERE userID=".gsstr2sql($dbclass->db->real_escape_string($_SESSION['userID']));
    $data=$dbclass->getEntries($sql);
    if($data){
      $data[0]["settings"]=json_decode($data[0]["settings"]);
      $_SESSION["username"]=$data[0]["username"];
      //$_SESSION["password"]=$data[0]["password"];
      $_SESSION["pwdencrypted"]=md5($data[0]["password"]);
      $_SESSION['rightgroupID']=$data[0]["rightgroupIDdefault"];
      unset($data[0]["password"]);
      $_SESSION["dat_user"]=$data[0];
    }
  }
}

function gbactivate($userID,$code){
    $result=0;

    $dat=array();
    $dbclass = new dbclass();
    //$data=$getEntries("userID=$userID");
    $sql="SELECT * FROM k8login WHERE §clientID and userID=$userID and (ifnull(active,0)=0 or active=1)";
    $data=$dbclass->getEntries($sql);
    if($data){
        //echo "adresse gefunden<br>";
        list($dat)=$data;
        if (gdecrypt($code)==$userID){
            $sql="UPDATE k8login SET active=1 WHERE userID=".$dat["userID"];
            $result=$dbclass->db->query($sql);
            return (boolean) $result;
        }
    }
    return false;
}

function gbsendEmail($params,&$error){
    //$GLOBALS['domain_emailmode']
    // not used Global $l;
    // not used Global $langmodule;
    
    $to=getfromarray($params,'to');
    $cc=getfromarray($params,'cc');
    $bcc=getfromarray($params,'bcc');
    $subject=getfromarray($params,'subject');
    $message=getfromarray($params,'message');
    //$attachments=getfromarray($params,'attachments');
    
    $error="";
    $error=gsclauseand($error,"to missing",gbnull($to),", ");
    $error=gsclauseand($error,"subject missing",gbnull($subject),", ");
    $error=gsclauseand($error,"message missing",gbnull($message),", ");
    
    if(gbnull($error)){
      $o_mail=new eMailbyServer($to);
      if($GLOBALS['domain_emailmode']==1)$o_mail=new eMailbyPHPMailer($to);
      $o_mail->cc=$cc;
      $o_mail->bcc=$bcc;
      $o_mail->subject=$subject;
      $o_mail->message=$message;

      // attachments

      if($o_mail->bsend()){
        return 1;
      }else{
        $error=$o_mail->getError();
        return 0;
      }
    }
    return 0;
}

function gbsendActivation($postfields,&$error,&$message){
    // postfields: username, email_subject, email_content
    Global $l;
    Global $langmodule;
    Global $domain_name;
    
    $username=getfromarray($postfields,'username','');
    $to=getfromarray($postfields,'email','');
    $dbclass=new dbclass();
    //echo('username:'.$username.'<br>');
    if(gbnull($username)){
        $error="username is necessary!";
    }else{
        //echo 'test';
        $sql="SELECT * FROM k8login WHERE ";
        if(gbnull($username)){
            $sql.="§clientID and email=".gsstr2sql($dbclass->db->real_escape_string($to));
            $data=$dbclass->getentries($sql);
        }else{
            $sql.="§clientID and username=".gsstr2sql($dbclass->db->real_escape_string($username));
            $data=$dbclass->getentries($sql);
        }
        if(0){echo '<pre>';print_r($data);echo '</pre>';}
        if($data){
            list($dat)=$data;
            $to=$dat['email'];
            if(gbnull($to)){
                $error="no email!";
            }else{
                $a=$dat["userID"];
                $b=gencrypt($dat["userID"]);
                $dat["activation_link"]=domain_url().$GLOBALS['domain_indexfile']."?page=activate&a=".$a."&b=".$b;
                $dat["domain_name"]=$domain_name;

                  $o_mail=new eMailbyServer($to);
                  if($GLOBALS['domain_emailmode']==1)$o_mail=new eMailbyPHPMailer($to);
                  $o_mail->subject=getfromArray($postfields,"email_subject","activate your account");
                  $email_content=gsReplaceFromArray($dat,getfromArray($postfields,"email_content",'please activate your account: <a href="{{activation_link}}">activation link</a><br>Greetings<br>{{domain_name}}'));
                  $o_mail->message=gsReplaceFromArray($dat,$email_content);
                  //mylog(array("email_content"=>$o_mail->message),2);

                  if($o_mail->bsend()){
                      $message="link for activation is send to your email";
                      return 1;
                  }else{
                      $error=$o_mail->getError();
                      return 0;
                  }
            }
        }else{
            $error=$l->getlangValue($langmodule,"username").' '.$l->getlangValue('system',"invalid");
            //echo '$dbclass->error='.$dbclass->error;
        }
    }
    return 0;
}

function gbSendPwd($postfields,&$error,&$message,&$formmode){
    // postfields: username, email
    Global $l;
    Global $langmodule;
    Global $domain_name;
    
    $echo=0; 
    $username=getfromarray($postfields,'username','');
    $to=getfromarray($postfields,'email','');
    $dbclass=new dbclass();
    mylog($postfields,$echo);
    if(gbnull($username) and gbnull($to)){
        $error=$l->getlangValue($langmodule,"username").' '.$l->getlangValue('system',"invalid").
            $l->getlangValue($langmodule,"email").' '.$l->getlangValue('system',"invalid");
    }elseif(!gbnull($username) and !gbnull($to)){
        $error=$l->getlangValue($langmodule,"username").' '
            .$l->getlangValue('system',"or").' '
            .$l->getlangValue($langmodule,"email");
    }elseif(instr("demo,guest1",$username)>-1){
        $error=$l->getlangValue($langmodule,"changing password not allowed");
    }else{
        $sql="SELECT * FROM k8login WHERE ";
        if(gbnull($username)){
            $sql.="§clientID and email=".gsstr2sql($dbclass->db->real_escape_string($to));
            $data=$dbclass->getentries($sql);
        }else{
            $sql.="§clientID and username=".gsstr2sql($dbclass->db->real_escape_string($username));
            $data=$dbclass->getentries($sql);
        }
        //mylog($data,2);
        if($data){
            list($dat)=$data;
            $to=$dat['email'];
            if(gbnull($to)){
                $error="no email!";
            }else{
                //create new pasword and save
                $dat["password"]=substr(md5(trim(microtime())),0,8);
                $dat["domain_name"]=$domain_name;
                $sql="UPDATE k8login set password='".$dat["password"]."' WHERE userID=".$dat['userID'];
                if(!$dbclass->db->query($sql)){
                    $error=$dbclass->error;
                }else{
                    //neues Kennwort senden
                    //$message='mail deactivated';
                    //return 1;
                    $o_mail=new eMailbyServer($to);
                    if($GLOBALS['domain_emailmode']==1)$o_mail=new eMailbyPHPMailer($to);
                    $o_mail->subject=getfromArray($postfields,"email_subject","new password");
                    $email_content=getfromArray($postfields,"email_content","Dear member,<br>your new password: {{password}}<br>Greetings<br>{{domain_name}}");
                    mylog(array("email_content"=>$email_content),$echo);
                    $o_mail->message=gsReplaceFromArray($dat,$email_content);
                    if($o_mail->bsend()){
                        $message="new password sent to your email";
                        mylog('$message='.$message,$echo);
                        return 1;
                    }else{
                        $error=$o_mail->getError();
                        mylog('$error='.$error,$echo);
                        return 0;
                    }
                }
            }
        }else{
            $error=$l->getlangValue($langmodule,"username").' '.$l->getlangValue('system',"invalid");
            //echo '$dbclass->error='.$dbclass->error;
        }
    }
    return 0;
}

function gbSendContact($postfields,&$error,&$message){
    // postfields: username, email
    Global $l;
    Global $langmodule;
    Global $domain_name;
    Global $domain_emailto;
    
    if(0){echo "<pre>";
    print_r($postfields);
    echo "</pre>";}
    $to=$domain_emailto;
    $cc=getfromarray($postfields,'email');
    $subject=getfromarray($postfields,'subject');
    $content=getfromarray($postfields,'message');
    //$content=$content.'\r\rUser agent: '. $_SERVER['HTTP_USER_AGENT'];
    
    $sender=getfromarray($postfields,'gender').' '.getfromarray($postfields,'firstname').' '.getfromarray($postfields,'lastname').', Email: '.getfromarray($postfields,'email');
    if(gbnull($subject) or gbnull($to) or gbnull($content)){
        $error=$l->getlangValue($langmodule,"please fill out the complete form").'<br>';
        return 0;
    }else{
        $o_mail=new eMailbyServer($to);
        if($GLOBALS['domain_emailmode']==1)$o_mail=new eMailbyPHPMailer($to);
        $o_mail->subject=$subject;
        $o_mail->message=$content.'<br><br>'.$sender;
        if($o_mail->bsend()){
            $message="thank you for your message";
            return 1;
        }else{
            $error=$o_mail->getError();
            return 0;
        }
    }
    return 0;
}

function gbcheckDateTime($ts,$datetimestr,$bcheckdate = 1,$bchecktime=1){

    //echo $datetimestr.iif($bcheckdate,"checkdate","")." ".iif($bchecktime,"checktime",""). "<br>";

    $month=0;$day=0;$year=0;$hour=0;$minute=0;$second=0;
    if(gbnull($ts)){
        if(gbnull($datetimestr)){
            return false;
        }else{
            if(instr($datetimestr,":")>=0){
                if(instr($datetimestr," ")>=0){
                    list($datestr,$timestr)=explode(" ",$datetimestr);
                }else{
                    $datestr="";
                    $timestr=$datetimestr;
                }
            }else{
                $datestr=$datetimestr;
                $timestr="";
            }
            //echo '$datetimestr='.$datetimestr."<br>";
            //echo 'instr='.instr($datetimestr," ")."<br>";
            //echo '$datestr='.$datestr."<br>";
            //echo '$timestr='.$timestr."<br>";
            
            if(!gbnull($datestr)){
                if(substr_count($datestr,".")>=2){
                    list($day,$month,$year)=explode(".",$datestr );
                }elseif(substr_count($datestr,"/")>=2){
                    list($month,$day,$year)=explode("/",$datestr );
                }elseif(substr_count($datestr,"-")>=2){
                    list($year,$month,$day)=explode("-",$datestr );
                }else{
                    return false;
                }
            }
            if(!gbnull($timestr)){
                if (substr_count($timestr,":")==1){
                    list($hour,$minute)=explode(":",$timestr);
                }elseif (substr_count($timestr,":")==2){
                    list($hour,$minute,$second)=explode(":",$timestr);
                }else{
                    //echo " return timestr".$datetimestr."<br>";
                    return false;
                }
            }

        }
    }else {
        list($second,$minute,$hour,$day,$month,$year)=explode(".",date("s.i.H.d.m.Y",$ts));
    }
    //echo "Zeit:$second,$minute,$hour<br>";
    if (is_numeric($second) and is_numeric($minute) and is_numeric($hour) and is_numeric($day) and is_numeric($month) and is_numeric($year)){
            //ok
    }else{
        return false;
    }
    $btime=(intval($hour)<=23) and (intval($minute)<=60) and (intval($second)<=60);
    //echo "btime:" .iif($btime,"true","false")."<br>";
    if($bchecktime and $bcheckdate){
        //echo $datetimestr." check date + time <br>";
        //echo iif(checkdate($month,$day,$year),"Datum ok<br>","$month,$day,$year");
        //echo iif($btime,"time ok<br>","");
        return ($btime and checkdate($month,$day,$year));
    }elseif($bchecktime){
        //echo $datetimestr." check  time"."<br>";
        return ($btime);
    }elseif($bcheckdate){
        //echo $datetimestr." check date "."<br>";
        return checkdate($month,$day,$year);
    }else{
        return true;
    }
}

function gsGetValue($s,$del1, $del2=")"){
    $temp="";
    $pos1=strpos($s,$del1);
    if ($pos1 !==false){
        $pos2=strpos($s,$del2,$pos1+strlen($del1));
        if ($pos2 !==false){
            $temp=substr($s,$pos1+strLen($del1 ),$pos2-strlen($del1)-$pos1 );
        }
    }
    return $temp;
}

function data_sel_extendstructure($arr=array()){
    //$arr=array_merge($this->init($arr),$arr);
    if(0){
        echo '<pre>';
        print_r($arr);
        echo '</pre>';
        //exit;
    }
    if(is_array($arr)){
        $yoffset=0;
        $lasttop=0;
        $lastheight=0;
        foreach($arr as $a => $b){
            //echo 'element:'.$a.'<br>';
            if(is_array($arr[$a])){
                if(strval($a)<>"page"){
                  $arr[$a]=data_sel_init($arr[$a]);
                  $arr[$a]['yoffset']=0;
                }
                if(instr("page,reportheader,detail,reportfooter",$a)<0){
                    //echo '$lasttop-$lastheight='.($lasttop+$lastheight).'<BR>';
                    $arr[$a]['yoffset']=$arr[$a]['top']-($lasttop+$lastheight);
                    $lasttop=$arr[$a]['top'];
                    $lastheight=$arr[$a]['height'];
                }
                if(isset($arr[$a]['subs'])){
                    $arr[$a]['subs']=data_sel_extendstructure($arr[$a]['subs']);
                }
            }
            if(0){
                echo '<pre>';
                print_r($arr[$a]);
                echo '</pre>';
                exit;
            }
        }
    }
    if(0){
        echo 'Result<br>';
        echo '<pre>';
        print_r($arr);
        echo '</pre>';
        //exit;
    }
    return $arr;
}

function data_sel_init($arr=array()){
    $bauto=1;
    if(isset($arr['bauto']))$bauto=$arr['bauto'];
    $dat=$arr;
    $dat["ID"]=getfromarray($arr,'ID');
    $dat["object"]=getfromarray($arr,'object');
    $dat["parentID"]=getfromarray($arr,'parentID',0);
    $dat["figure"]=getfromarray($arr,'figure',1);

    $dat["fieldname"]=getfromarray($arr,'fieldname',iif($bauto,getfromarray($arr,'mycolumn')));
    //$dat["label"]=getfromarray($arr,'label',iif($bauto,getfromarray($arr,'mycolumn')));
    $dat["label"]=getfromarray($arr,'label');
    $dat["labelhtml"]=getfromarray($arr,'labelhtml');
    $dat["mytable"]=getfromarray($arr,'mytable');
    $dat["mycolumn"]=getfromarray($arr,'mycolumn');
    $dat["inwhere"]=getfromarray($arr,'inwhere');
    $dat["datatype"]=getfromarray($arr,'datatype',0);
    $dat["fieldtype"]=getfromarray($arr,'fieldtype',0);
    $dat["specification"]=getfromarray($arr,'specification');
    $dat["asclause"]=getfromarray($arr,'asclause');
    $dat["obligatory"]=getfromarray($arr,'obligatory',0);
    $dat["width"]=getfromarray($arr,'width',0);
    $dat["mydefault"]=getfromarray($arr,'mydefault');
    $dat["mytype"]=getfromarray($arr,'mytype');
    $dat["myextra"]=getfromarray($arr,'myextra');
    $dat["decimals"]=getfromarray($arr,'decimals',0);
    $dat["sameline"]=getfromarray($arr,'sameline',0);
    $dat["height"]=getfromarray($arr,'height',5);
    $dat["alignement"]=getfromarray($arr,'alignement',0);
    $dat["top"]=getfromarray($arr,'top',0);
    $dat["left"]=getfromarray($arr,'left',0);
    if(isset($arr['left'])){
        $dat["leftpos"]=getfromarray($arr,'left',0);
    }else{
        $dat["leftpos"]=getfromarray($arr,'leftpos',0);
    }
    $dat["htmltag"]=getfromarray($arr,'htmltag');
    $dat["format"]=getfromarray($arr,'format');
    $dat["class"]=getfromarray($arr,'class');
    $dat["style"]=getfromarray($arr,'style');
    $dat["checktype"]=getfromarray($arr,'checktype');
    $dat["checkdetails"]=getfromarray($arr,'checkdetails');
    $dat["aggregation"]=getfromarray($arr,'aggregation',0);
    $dat['shrinkable']=getfromarray($arr,'shrinkable',0);
    $dat['enlargeable']=getfromarray($arr,'enlargeable',0);
    $dat['parentlinkfields']=getfromarray($arr,'parentlinkfields');
    $dat['childlinkfields']=getfromarray($arr,'childlinkfields');
    $dat['newpage']=getfromarray($arr,'newpage',0);
    $dat['fontcolor']=getfromarray($arr,'fontcolor');
    $dat['backgroundcolor']=getfromarray($arr,'backgroundcolor');
    $dat['border']=getfromarray($arr,'border');
    $dat['bordercolor']=getfromarray($arr,'bordercolor');
    $dat['fontname']=getfromarray($arr,'fontname');
    $dat['fontsize']=getfromarray($arr,'fontsize',0);
    $dat['fontstyle']=getfromarray($arr,'fontstyle');        
    $dat['visible']=getfromarray($arr,'visible',1); 
    $dat['visibleeval']=getfromarray($arr,'visibleeval'); 
    $dat['enabled']=getfromarray($arr,'enabled',1);  
    $dat['javascript']=getfromarray($arr,'javascript');  
    $dat['labelwidth']=getfromarray($arr,'labelwidth');  
    if(isset($arr['subs']))$dat['subs']=$arr['subs'];
    return $dat;
}

// --------------------  Formatierung von Nummern (tcpdf)
function number_formatx($number,$dp=-1,$from=-1){
    //return number in generalformat
    //
    //$from -1: generalformat
    //       0: american
    //       1: european
    //$GLOBALS,'generalformat'
    $generalformat=getFromArray($GLOBALS,'generalformat',0);
    if($from==-1){
        $from=$generalformat;
    }
    if($from==1){
        // first 2 english
        //$temp=str_replace(".","D",$number);
        //$temp=str_replace(",","T",$temp);
        //$temp=str_replace("D",",",$temp);
        //$number=str_replace("T","",$temp);
        $temp=str_replace(",","D",$number);
        $temp=str_replace(".","T",$temp);
        $temp=str_replace("D",".",$temp);
        $number=str_replace("T","",$temp);
        //echo "Number:".$number.'<br>';
    }
    if($generalformat){
        $thousand='.';
        $decimal=',';
    }else{
        $thousand=',';
        $decimal='.';
    }
    if(!is_numeric($number)){
        //echo "Number:".$number.'<br>';
        $number=0;
    }
    if($dp==-1){
        return gnumber_convert($number,$from,$generalformat);
    }else{
        return number_format($number,$dp,$decimal,$thousand);
    }
}

function gnumber($number,$bgeneralformat=1){
    return number($number,$bgeneralformat);
}
function number($number,$bgeneralformat=1){
    // convert to the internalformat
    // ',' -> '.'
    if($bgeneralformat){
        $generalformat=getfromarray($_SESSION,'generalformat',0);
    }else{
        $generalformat=0;
    }
    if($generalformat==1){
        $temp=str_replace(",","D",$number);
        $temp=str_replace(".","T",$temp);
        $temp=str_replace("D",".",$temp);
        $temp=str_replace("T","",$temp);
        //echo "T".str_replace("T",",",$temp).'<br>';
        $temp=floatval($temp);
        //echo "float".str_replace("T",",",$temp).'<br>';
        return $temp;
    }else{
        return floatval(str_replace(",","",$number));
    }
}

function gnumber_convert($temp,$from,$to){
    //echo 'temp: '.$temp.' from: '.$from.' to: '.$to.'<br>';
    if($from==$to){
        return $temp;
    }else{
        if($from==1){
            $dec_source=',';
            $tho_source='.';
            $dec_target='.';
            $tho_target=',';
        }else{
            $dec_source='.';
            $tho_source=',';
            $dec_target=',';
            $tho_target='.';
        }
        $temp=str_replace($dec_source,"D",$temp);
        $temp=str_replace($tho_source,"T",$temp);
        $temp=str_replace("D",$dec_target,$temp);
        $temp=str_replace("T",$tho_target,$temp);
        //echo 'temp: '.$temp.'<br>';
        return $temp;
    }
}

function gformat_number($temp,$to,$from=-1){
    // to=1 nach data_enter, =0 nach data save
    if($_SESSION["generalformat"]==1){
        if($to){
            $temp=str_replace(",","D",$temp);
            $temp=str_replace(".","T",$temp);
            $temp=str_replace("D",".",$temp);
            $temp=str_replace("T",",",$temp);
            return $temp;
        }else{
            $temp=str_replace(".","T",$temp);
            $temp=str_replace(",","D",$temp);
            $temp=str_replace("D",".",$temp);
            $temp=str_replace("T",",",$temp);
            return $temp;
        }
    }else{
        return $temp;
    }
}

function floatvalue($val){
    $val = str_replace(",",".",$val);
    $val = preg_replace('/\.(?=.*\.)/', '', $val);
    return floatval($val);
}

class eMailbyServer{
    
    public $from;
    private $to;
    public $cc;
    public $bcc;
    public $subject;    
    public $message;
    public $attachments;
    private $error;
    
    public function __construct($to,$dat=array(),$typ=0){
        //Global $settings;
        Global $domain_name;
        Global $domain_emailto;
        Global $domain_emailfrom;
        //$domain_name='Example Website';
        // BasicFunctions: $domain_language='en';
        //$domain_email='mail@example.com';
      
        $this->to=$to;
        // $typ laden
        // $dat
        $this->subject=getfromArray($dat,'subject');
        $this->message=getfromArray($dat,'message');
        $this->cc=getfromArray($dat,"cc");
        $this->bcc=getfromArray($dat,"bcc");
        //$this->from="$domain_name<$domain_email>";
        //$this->from=$domain_email;
        //$this->from='surfnicolas.ns@gmail.com';
        $this->from=getfromArray($dat,'from',$_SERVER['HTTP_HOST'].'<'.$domain_emailfrom.'>');
        $this->attachments=array();
    }
    
    public function bprepareAttachment($filename,$temporary=0){
        if(file_exists($filename)){
            $anhang = array();
            $anhang["filename"] = $filename;
            $anhang["name"] = basename($filename);
            $anhang["size"] = filesize($filename);
            $handle=fopen($filename,"r");
            $temp=fread($handle,filesize($filename));
            /*$bom = pack("CCC", 0xef, 0xbb, 0xbf);   // BOM entfernen
            if (0 == strncmp($temp, $bom, 3)) {
                $temp = substr($str, 3);
            } */               
            fclose($handle);
            $anhang["data"] = chunk_split(base64_encode($temp))."\r\n";
            if(function_exists("mime_content_type")){
                $anhang["type"] = mime_content_type($filename);
            }else{
                $anhang["type"] = "application/octet-stream";
            }
            $anhang["temporary"]=$temporary;
            $this->attachments[]=$anhang;
            return 1;
        }else{
            $this->error="file doesn't exist";
            return 0;
        }
    }
    
    public function getError(){
        return $this->error;
    }
    public function bSend(){
        Global $settings;
        $b=false;
        // check properties
        if(gbnull($this->to)){
            $this->error="to missing";
            return 0;
        }
        if(gbnull($this->subject)){
            $this->error="subject missing";
            return 0;
        }
        
        // send
        if(count($this->attachments)>0){
            $mime_boundary = md5(uniqid(mt_rand(), 1));
            $header='';
            //$header  ="From:".getfromarray($settings,'3201','')."<".$this->from.">\n";
            $header.="From: ".$this->from."\r\n";
            if(!gbnull($this->cc)){
              $header.="Cc: ".$this->cc."\r\n";
            }
            if(!gbnull($this->bcc)){
              $header.="Bcc: ".$this->bcc."\r\n";
            }
            //$header.="Reply-To: ".$this->from."\r\n";
            $header.='X-Mailer: PHP/' . phpversion()."\r\n";
            $header.= "MIME-Version: 1.0\r\n";
            $header.= "Content-Type: multipart/mixed; boundary=".$mime_boundary."\r\n\r\n";
            //mylog($header,2);
            //Mailbody
            $content='';
            $content.= "--".$mime_boundary."\r\n";
            $content.= "Content-Type: text/html; charset=utf-8\r\n";
            $content.= "Content-Transfer-Encoding: 8bit\r\n\r\n";
            $content.= $this->message."\r\n";
            

            // add attachment
            foreach($this->attachments as $anhang){
                $content.= "--".$mime_boundary."\r\n";
                $content.= "Content-Type: ".$anhang['type']."; name=".'"'.$anhang['name'].'"'."\r\n";
                $content.= "Content-Disposition: attachment; filename=".'"'.$anhang['name'].'"'."\r\n";
                $content.= "Content-Transfer-Encoding: base64\r\n";
                $content.= "\r\n";
                $content.= $anhang['data']; //."\r\n";
            }

            //ini_set('sendmail_from', $this->from);
            try{
              $b=@mail($this->to,'=?UTF-8?B?'.base64_encode($this->subject).'?=',$content,$header);
            }catch(Exception $ex){
              $this->error=$ex;
            }            
            
            // Delete temporary files?
            foreach($this->attachments as $anhang){
                if(getfromarray($anhang,'temporary',0)){
                    unlink($anhang['filename']); // Datei löschen
                }
            }
        }else{
            $header='';
            $header.="From: ".$this->from."\r\n";
            //$header.="Reply-To: ".$this->from."\r\n";
            $header.='X-Mailer: PHP/' . phpversion()."\r\n";
            $header.= "MIME-Version: 1.0\r\n";
            $header.= "Content-type: text/html; charset=UTF-8\r\n";
            //mylog($header,2);
            //ini_set('sendmail_from', $this->from);
            try{
              //ini_set('display_errors', '0');
              $b=mail($this->to,$this->subject,$this->message,$header);
              mylog("bSend no error",2);
            }catch(Exception $ex){
              mylog($ex,2);
              $this->error=$ex;
            }            
        }
        return $b;
    }
    
}

class eMailbyPHPMailer{
    //$GLOBALS['domain_PHPMailer']
    private $to;
    public $cc;
    public $bcc;
    public $subject;    
    public $message;
    public $attachments;
    private $error;
    public $mailconfig;
    
    public function __construct($to,$dat=array()){
        //mylog("init PHPMailer",2);
        //mylog($dat,2);
        
        // PHPMailer einbinden
        require "../PHPMailer/Exception.php";
        require "../PHPMailer/PHPMailer.php";
        require "../PHPMailer/SMTP.php";

        $this->to=$to;
        $this->subject=getfromArray($dat,'subject');
        $this->message=getfromArray($dat,'message');
        $this->cc=getfromArray($dat,"cc");
        $this->bcc=getfromArray($dat,"bcc");
        //$this->from=getfromArray($dat,'from',$GLOBALS['domain_PHPMailer']['from']);
        //$this->fromname=getfromArray($dat,'fromname',$GLOBALS['domain_PHPMailer']['fromname']);
        if(isset($dat['PHPMailer'])){
          $this->mailconfig=$dat['PHPMailer'];
        }else{
          $this->mailconfig=$GLOBALS['domain_PHPMailer'];
        }
        $this->attachments=array();
    }
    
    public function bprepareAttachment($filename,$temporary=0){
        if(file_exists($filename)){
            $anhang = array();
            $anhang["filename"] = $filename;
            $anhang["name"] = basename($filename);
            $anhang["size"] = filesize($filename);
            $anhang["temporary"]=$temporary;
            $this->attachments[]=$anhang;
            return 1;
        }else{
            $this->error="file doesn't exist";
            return 0;
        }
    }
    
    public function getError(){
        return $this->error;
    }
    
    public function bSend(){
        $b=false;
        
        // check properties
        if(gbnull($this->to)){
            $this->error="to missing";
            return 0;
        }
        if(gbnull($this->subject)){
            $this->error="subject missing";
            return 0;
        }
        
        // send
        $mail = new PHPMailer(true);
        $mail->CharSet = "UTF-8";
        //$mail->SMTPDebug = true; // Ausführliche Debugausgabe aktivieren
        $mail->isSMTP(); // Senden mit SMTP
        $mail->Host = $this->mailconfig['host'];           // Postausgangsserver (SMTP)
        $mail->SMTPAuth = $this->mailconfig['SMTPAuth'];   // SMTP-Authentifizierung aktivieren
        $mail->Username = $this->mailconfig['username'];   // SMTP Benutzername
        $mail->Password = $this->mailconfig['password'];   // SMTP Passwort
        $mail->SMTPSecure = getFromArray($this->mailconfig,'SMTPSecure',PHPMailer::ENCRYPTION_SMTPS);   // Implizite TLS-Verschlüsselung aktivieren
        $mail->Port = intval($this->mailconfig['port']);           // Port - Postausgangsserver (SMTP)
        //mylog($this->mailconfig,2);
        $mail->isHtml(true);
        
        // Absender
        $mail->setFrom($this->mailconfig['from'],$this->mailconfig['fromname']); // Absender
        
        // Empfänger
        $arr=explode(",",str_replace(';',',',$this->to));
        foreach($arr as $email){
          $mail->addAddress($email);
        }
        if(!gbnull($this->cc)){
          $arr=explode(",",str_replace(';',',',$this->cc));
          foreach($arr as $email){
            $mail->addCC($email);
          }
        }
        if(!gbnull($this->bcc)){
          $arr=explode(",",str_replace(';',',',$this->bcc));
          foreach($arr as $email){
            $mail->addBCC($email);
          }
        }
        
        // Sonderzeichen in HTML-Codes umwandeln
        //$_POST = array_map('htmlspecialchars', $_POST);

        // Betreff
        $mail->Subject = $this->subject;
        $mail->Body = $this->message.PHP_EOL;

        if(count($this->attachments)>0){
            foreach($this->attachments as $anhang){
                $mail->addAttachment($anhang["filename"]);
            }
        }
        
        try {
          $b=$mail->send();
          if(!$b)$this->error=$mail->ErrorInfo;
        } catch (Exception $e) {
           $this->error=$mail->ErrorInfo;
        }          
        
        if(count($this->attachments)>0){
            // Delete temporary files?
            foreach($this->attachments as $anhang){
                if(getfromarray($anhang,'temporary',0)){
                  unlink($anhang['filename']); // Datei löschen
                }
            }
        }
        
        return $b;
    }
}

function gbnofields_missing($postfields,&$error,$fieldsbool,$fieldsrequired,&$prep_output,$formname){        // Required fields
    Global $l;
    Global $langmodule;
    $jslist='';    
    $fieldsmissinglist='';
    //echo '$fieldsrequired:'.$fieldsrequired."<br>";
    if(!gbnull(trim($fieldsrequired))){
        $temp=  str_replace("[", "", trim($fieldsrequired));
        $temp=  str_replace("]", "", $temp);
        //echo "T:".$temp."<br>";
        $arr=explode(",",$temp);
        $fieldsmissing=" ";
        foreach($arr as $k){
            if(!gbnull($k)){
                $bmissing=0;
                if(isset($postfields[$k])){
                    if (strpos($fieldsbool,"[".$k."]")!==false) {
                        $bmissing=!($postfields[$k]==0 or $postfields[$k]==1);
                    }else{
                        $bmissing=gbnull(getfromarray($postfields,$k,''));
                    }
                }else{
                    // error
                    $bmissing=1;
                }
                if($bmissing){
                    //$jslist.="window.document.abook.$k.style.border=\"thin solid #FF6347\";";
                    $jslist.="window.document.$formname.$k.style.backgroundColor=\"#f4e2df\";\n";
                    $fieldsmissing.="[".$k."],";
                    //echo $langmodule.', '.$k.'<br>';
                    $fieldsmissinglist.=$l->getlangValue($langmodule,$k).", ";
                }
            }
        }
        if(!gbnull(trim($fieldsmissing))){
            // ." " . $this->fieldsmissing
            $prep_output.="<script type=\"text/javascript\"> \nfunction colorfields(){";
            $prep_output.= $jslist;
            $prep_output.="}\n</script>";
            $error.=$l->getlangValue("system","data_fields_required_missing")  ."<br>".substr($fieldsmissinglist,0,strlen($fieldsmissinglist)-2)."<br>";
        }
    }  
    return (gbnull($error));
}

// ************** Datums und Zeit **********************
function checktime($hour, $min, $sec) {
     if ($hour < 0 || $hour > 23 || !is_numeric($hour)) {
         return false;
     }
     if ($min < 0 || $min > 59 || !is_numeric($min)) {
         return false;
     }
     if ($sec < 0 || $sec > 59 || !is_numeric($sec)) {
         return false;
     }
     return true;
}

Function gstr2timestamp($datetimestr){
  //$datestr="15.12.2012"
  $zeitstempel=0;
  $month=0;$day=0;$year=0;$hour=0;$minute=0;$second=0;
  if (strpos($datetimestr,":")>0){
      if (strpos($datetimestr," ")==0){
          $datestr="";
          $timestr=$datetimestr;
      }else{
          list($datestr,$timestr)=explode(" ",$datetimestr );
      }
  }else{
      $datestr=$datetimestr;
      $timestr="";
  }
  //echo 'datesstr:' . $datestr . '<br>';
  if(!gbnull($datestr)){
      if(substr_count($datestr,".")>=2){
          list($day,$month,$year)=explode(".",$datestr );
      }elseif(substr_count($datestr,"/")>=2){
          list($month,$day,$year)=explode("/",$datestr );
      }elseif(substr_count($datestr,"-")>=2){
          list($year,$month,$day)=explode("-",$datestr );
      }else{
          return 0;
      }
  }

  if(!gbnull($timestr)){
      if (substr_count($timestr,":")==1){
          list($hour,$minute)=explode(":",$timestr);
      }elseif (substr_count($timestr,":")==2){
          list($hour,$minute,$second)=explode(":",$timestr);
      }else{
          return 0;
      }
  }
  //$year=$a[3];
  if(0){
  echo 'hour:' . $hour . '<br>';
  echo 'minute:' . $minute . '<br>';
  echo 'second:' . $second . '<br>';
  echo 'day:' . $day . '<br>';
  echo 'month:' . $month . '<br>';
  echo 'year:' . $year . '<br>';
  }
  if (is_numeric($second) and is_numeric($minute) and is_numeric($hour) and is_numeric($day) and is_numeric($month) and is_numeric($year)){
      $zeitstempel=mktime($hour,$minute,$second,$month,$day,$year);
      //echo 'zeitstempel:' . $zeitstempel. '<br>';
      return $zeitstempel;
  }else{
      return 0;
  }
}

function gsReplaceFromArray($arr,$text,$parameter="",$plangmodule='',$datadefID=0,$bprocessdatadef=1){
    // $arr         array mit den Werten des Datensatzes
    // $text        string der durchsucht wird
    // $parameter   Tabelle des Datensatzes
    // $langmodule  $langmodule
    // $datadefID   Kennung des Listings

    //echo 'gsReplace.... groupID='.$arr['groupID'].'<br>';
    
    $langmodule='';
    if(gbnull($plangmodule)){
        if(gbnull($langmodule)){
            $langmodule="frmAddress";
        }
    }else{
        $langmodule=$plangmodule;
    }
    
    //echo '$langmodule: '.$langmodule.'<br>';
    /*
    $photo_width=round($gphoto_height_n*$gphoto_rel_h_w);
    $pictureviewer_width=$photo_width+10;
    $pictureviewer_height=$gphoto_height_n+100;
    $pictureviewer_parameter= "width=$pictureviewer_width,height=$pictureviewer_height,resizable=yes,scrollbars=yes";
    $iconpath="/pic";
    $l->addLangModule($langmodule);
    */
    
    $dbclass=new dbclass();
    $texttemp=$text;
    $stemp="";
    $n=0;

    //echo $texttemp.'<br>';

    //echo'<pre>';
    //print_r($arr);
    //echo '</pre>';
    
    //echo $datadefID.'<br>';

    //************************************************* select
    $identifier="#select#";
    while(InStr($texttemp,$identifier)>=0){
        $pos_start=strpos($texttemp,$identifier);
        $pos_ende=strpos($texttemp,"#",$pos_start+strlen($identifier)+1);
        //echo "pos_ende:".$pos_ende."<br>";
        if($pos_ende>0){
            $replace="";
            $placeholder=substr($texttemp,$pos_start,$pos_ende-$pos_start+1);
            $temp=substr($texttemp,$pos_start+strlen($identifier),$pos_ende-strlen($identifier)-$pos_start);
            if(!gbnull($temp)){
                //echo '$temp :'.$temp.'<br>';
                $replace=$dbclass->GetFormMultiFrom('option',$temp);
                //echo '$temp :'.$temp.'<br>';
            }
            $texttemp=str_replace($placeholder,$replace,$texttemp);
        }else{
            $texttemp=substr($texttemp,0,$pos_start).substr($texttemp,$pos_start+strlen($identifier));
        }
    }
    $identifier='"#jsonform_enum#';
    $identifend='#"';
    while(InStr($texttemp,$identifier)>=0){
        $pos_start=strpos($texttemp,$identifier);
        $pos_ende=strpos($texttemp,$identifend,$pos_start+strlen($identifier)+1);
        //echo "pos_ende:".$pos_ende."<br>";
        if($pos_ende>0){
            $replace="";
            $placeholder=substr($texttemp,$pos_start,$pos_ende-$pos_start+strlen($identifend));
            $temp=substr($texttemp,$pos_start+strlen($identifier),$pos_ende-strlen($identifier)-$pos_start);
            if(!gbnull($temp)){
                $replace=$dbclass->GetFormMultiFrom('jsonform_enum',$temp);
            }
            //echo '$replace='.htmlspecialchars($replace)."<br>";
            $texttemp=str_replace($placeholder,$replace,$texttemp);
        }else{
            $texttemp=substr($texttemp,0,$pos_start).substr($texttemp,$pos_start+strlen($identifier));
        }
    }
    $identifier='"#jsonform_titleMap#';
    $identifend='#":0';
    while(InStr($texttemp,$identifier)>=0){
        $pos_start=strpos($texttemp,$identifier);
        $pos_ende=strpos($texttemp,$identifend,$pos_start+strlen($identifier)+1);
        //echo "pos_ende:".$pos_ende."<br>";
        if($pos_ende>0){
            $replace="";
            $placeholder=substr($texttemp,$pos_start,$pos_ende-$pos_start+strlen($identifend));
            $temp=substr($texttemp,$pos_start+strlen($identifier),$pos_ende-strlen($identifier)-$pos_start);
            if(!gbnull($temp)){
                //echo '$temp:'.$temp."<br>";
                $replace=$dbclass->GetFormMultiFrom('jsonform_titleMap',$temp);
            }
            $texttemp=str_replace($placeholder,$replace,$texttemp);
        }else{
            $texttemp=substr($texttemp,0,$pos_start).substr($texttemp,$pos_start+strlen($identifier));
        }
    }

    $identifier='"#k8form_select#';
    $identifend='#"';
    while(InStr($texttemp,$identifier)>=0){
        $pos_start=strpos($texttemp,$identifier);
        $pos_ende=strpos($texttemp,$identifend,$pos_start+strlen($identifier)+1);
        //echo "pos_ende:".$pos_ende."<br>";
        if($pos_ende>0){
            $replace="\"\"";
            $placeholder=substr($texttemp,$pos_start,$pos_ende-$pos_start+strlen($identifend));
            $temp=substr($texttemp,$pos_start+strlen($identifier),$pos_ende-strlen($identifier)-$pos_start);
            if(!gbnull($temp)){
                //echo '$temp:'.$temp."<br>";
                $replace=$dbclass->GetFormMultiFrom('getSelectJson_encode',$temp);
            }
            $texttemp=str_replace($placeholder,$replace,$texttemp);
        }else{
            $texttemp=substr($texttemp,0,$pos_start).substr($texttemp,$pos_start+strlen($identifier));
        }
    }
    
    $identifier='#class#';
    $identifend='#';
    while(InStr($texttemp,$identifier)>=0){
        $pos_start=strpos($texttemp,$identifier);
        $pos_ende=strpos($texttemp,$identifend,$pos_start+strlen($identifier)+1);
        //echo "pos_ende:".$pos_ende."<br>";
        if($pos_ende>0){
            $replace="";
            $placeholder=substr($texttemp,$pos_start,$pos_ende-$pos_start+strlen($identifend));
            $ident=substr($texttemp,$pos_start+strlen($identifier),$pos_ende-strlen($identifier)-$pos_start);
            if($ident=="display_price"){
                $replace=iif(getfromarray($_REQUEST,'display_price',true),"","hidden");
                //$replace="hidden";
            }
            $texttemp=str_replace($placeholder,$replace,$texttemp);
        }else{
            $texttemp=substr($texttemp,0,$pos_start).substr($texttemp,$pos_start+strlen($identifier));
        }
    }

    // ********************** Array ersetzen
    if(is_array($arr)){
        Global $show_arr;
        $show_arr=false;
        if($show_arr){
            //echo '<pre>';
            //print_r($arr);
            //echo '<pre>';
        }
        foreach($arr as $k=>$v) {
            //mylog($k,2);
            if(substr($k,0,8)=="GLOBALS_"){
              if(instr('GLOBALS_tabulatortimeformat,GLOBALS_tabulatordateformat,GLOBALS_tabulatordatetimeformat,GLOBALS_decimal_point,GLOBALS_thousands_sep',$k)==-1){
                $texttemp=str_replace($k,$v,$texttemp);
              }
            }else{
                if(!is_array($v)){
                    if($show_arr)echo $k.'='.$v.'<br>';
                    if(gbnull($v)){
                        $texttemp=str_replace('{{'.$k.'_}}','',$texttemp);
                        $texttemp=str_replace('{{'.$k.'_br}}','',$texttemp);
                    }else{
                        $texttemp=str_replace('{{'.$k.'_}}',$v.' ',$texttemp);
                        $texttemp=str_replace('{{'.$k.'_br}}',$v.'<br>',$texttemp);
                    }
                    $texttemp=str_replace('{{'.$k.'}}',$v,$texttemp);
                    if($show_arr)echo 'texttemp='.$texttemp.'<br>';
                }else{
                    if($show_arr)echo $k.'=array'.'<br>';
                }
            }
        }
    }
    
    //echo '$texttemp :'.$texttemp.'<br>';
    return $texttemp;
}

function hex2rgb($hex) {
   $hex = str_replace("#", "", $hex);

   if(strlen($hex) == 3) {
      $r = hexdec(substr($hex,0,1).substr($hex,0,1));
      $g = hexdec(substr($hex,1,1).substr($hex,1,1));
      $b = hexdec(substr($hex,2,1).substr($hex,2,1));
   } else {
      $r = hexdec(substr($hex,0,2));
      $g = hexdec(substr($hex,2,2));
      $b = hexdec(substr($hex,4,2));
   }
   $rgb = array($r, $g, $b);
   //return implode(",", $rgb); // returns the rgb values separated by commas
   return $rgb; // returns an array with the rgb values
}

function rgb2hex($rgb) {
   $hex = "#";
   $hex .= str_pad(dechex($rgb[0]), 2, "0", STR_PAD_LEFT);
   $hex .= str_pad(dechex($rgb[1]), 2, "0", STR_PAD_LEFT);
   $hex .= str_pad(dechex($rgb[2]), 2, "0", STR_PAD_LEFT);

   return $hex; // returns the hex value including the number sign (#)
}

function maskformat($mask,$number){
    $masklen=mb_strlen($mask,mb_internal_encoding());
    $numberstr=strval($number);
    $count=$masklen-strlen($numberstr);
    mylog($count.' | '.$mask.','.$masklen.' | '.$numberstr.','.strlen($numberstr),2);
    if(mb_substr($mask,0,1,mb_internal_encoding())=='#'){
        // align right
        return str_repeat('0',$count).$numberstr;
    }else if(mb_substr($mask,0,1,mb_internal_encoding())=='°'){
        // align left
        return $numberstr.str_repeat('0',$count);
    }else{
        mylog('Mist='.$numberstr,2);
    }
}

function ground($v,$nks=0,$mode=0){
    // mode 0=kaufmännisch, 1=aufrunden, 2=abrunden
    //echo 'value: '.$v.' dec: '.$nks.' mode: '.$mode.'<br>';
    //echo '10^'.$nks.'='.pow(10,$nks).'<br>';
    if($mode==1){
        $v=$v+.4999999*pow(10,-$nks);
    }elseif($mode==2){
        $v=$v-.5*pow(10,-$nks);
    }
    return round($v,$nks);
}
function AddorDel($string,$char='/',$bdel=1,$bend=1){
    // character
    // $bdel=1 del
    // $bdel=0 add
    // $bend=0 first
    // $bend=1 last
    
    if($bend){
        if($bdel){   //Del
            if(substr($string,-strlen($char))==$char){   
                return substr($string,0,strlen($string)-strlen($char));
            }
        }else{  //Add
            if(substr($string,-strlen($char))<>$char){   
                return $string.$char;
            }
        }
    }else{
        // begining
        if($bdel){   //Del
            if(substr($string,0,strlen($char))==$char){   
                return substr($string,strlen($char));
            }
        }else{  //Add
            if(substr($string,0,strlen($char))<>$char){   
                return $char.$string;
            }
        }
    }
    return $string;
}

function trailingslashit($string) {
        // Adds trailing slash
	return untrailingslashit($string) . '/';
}

function untrailingslashit($string) {
    // Removes trailing slash if it exists.
    return rtrim($string, '/');
}

function parse_csv ($csv_string, $delimiter = ",", $skip_empty_lines = true, $trim_fields = true)
{
    return array_map(
        function ($line) use ($delimiter, $trim_fields) {
            return array_map(
                function ($field) {
                    return str_replace('!!Q!!', '"', utf8_decode(urldecode($field)));
                },
                $trim_fields ? array_map('trim', explode($delimiter, $line)) : explode($delimiter, $line)
            );
        },
        preg_split(
            $skip_empty_lines ? ($trim_fields ? '/( *\R)+/s' : '/\R+/s') : '/\R/s',
            preg_replace_callback(
                '/"(.*?)"/s',
                function ($field) {
                    return urlencode(utf8_encode($field[1]));
                },
                $enc = preg_replace('/(?<!")""/', '!!Q!!', $csv_string)
            )
        )
    );
}

function glimportCSVfile($o,$importname,$file,$arrconst,&$error,&$prot){
    // return:  $count
    //          $error
    //          $prot
    Global $langclass;
    Global $langmodule;
    Global $filesystem;
    $row = 0;
    $count=0;
    $nCharacter=1;      //0 utf-8 1=Windows
    $keycolumn='';
    
    //ShowTable($table,&$keycolumn)
    $dat_table=$o->dbclass->ShowTable($o->table,$keycolumn);
    if(!$dat_table){
        $error='table '.$o->table.' don\'t exists!<br>';
        return 0;
    }
    if(0){
    echo '<pre>';
    echo '$dat_table<br>';
    print_r($dat_table);
    echo '</pre>';
    echo '$o->fieldlist='.$o->fieldlist.'<BR>';
    }
    
    if(!$filesystem->exists($file)){
        $error='file '.$file.' don\'t exists!<br>';
        return 0;
    }elseif (($handle = fopen($file, "r")) !== FALSE) {
        while (($datrec = fgetcsv($handle, 1000, ";")) !== FALSE) {
            glimportline($o,$row,$datrec,$arrconst,$error,$prot);
        }//close loop
import_close:
    
        fclose($handle);
    }else{
        $error='error file open!'.'<br>';
    }
    return $count;
}

function glimportCSVdata($o,$data,$arrconst,$decimalseparator,&$error,&$prot){
    // under construction
    // return:  $count
    //          $error
    //          $prot
    Global $langclass;
    Global $langmodule;
    Global $filesystem;
    $countcoded=0;
    $columnn=array();   // column name of table
    $row = 0;
    $count=0;
    $nCharacter=1;      //0 utf-8 1=Windows
    $keycolumn='';
    
    //ShowTable($table,&$keycolumn)
    $dat_table=$o->dbclass->ShowTable($o->table,$keycolumn,true);
    if(!$dat_table){
        $error='table '.$o->table.' don\'t exists!<br>';
        return 0;
    }
    if(0){
        echo '<pre>';
        echo '$dat_table<br>';
        print_r($dat_table);
        echo '</pre>';
        //echo '$o->fieldlist='.$o->fieldlist.'<BR>';
    }
    foreach($data as $datrec){
        $row++;
        glimportLine($o,$row,$datrec,$dat_table,$arrconst,$decimalseparator,$column,$countcoded,$error,$prot);
    }
    return $row;
}

function glimportLine($o,$row,$datrec,$dat_table,$arrconst,$decimalseparator,&$column,&$countcoded,&$error,&$message){
            //$message=array();
            //$message['row']=$row;
            $count=0;

            if(0){
            echo '<pre>';
            echo '$datrec, row='.$row.'<br>';
            print_r($datrec);
            echo '</pre>';
            }
            $bcut_varchar=true;
            $message['row']=$row;
            if($row==1){
                $countcoded=count($datrec);
                for($i=0;$i<count($datrec);$i++){
                    if(gbnull($datrec[$i])){
                        $column[$i]='';
                    }else{
                        $field=$datrec[$i];
                        if(instr($datrec[$i],'[')>=0){
                            $field=substr($field,1,strlen($field)-2);
                        }
                        //if(instr($o->fieldlist, '['.$field.']')>=0){
                        // !!! columname valid ???
                        if(true){
                            $column[$i]=$field;
                        }else{
                            $error.='column '.$field.' not exists!<br>';
                        }
                    }
                }
                if(!gbnull($error)){
                    // continue
                    // return 0;
                }
            }else{
                $num = count($datrec);
                if(count($datrec)<>$countcoded){
                    mylog($datrec,2);
                    $message['text']=$row." Spaltenanzahl (Soll=$countcoded; Ist=".count($datrec).") falsch!".'<br>';
                    $message['status']=0;
                }else{
                
                    //echo "<p> $num Felder in Zeile $row: <br /></p>\n";
                    /*for ($c=0; $c < $num-1; $c++) {
                        //echo iconv("Windows-1252", 'UTF-8',$datrec[$c]). "<br />\n";
                    }*/
                    //echo '$o->fieldlist'.'='.$o->fieldlist.'<br>';
                    
                    // ================================== import row
                    $dat=array();
                    for($i=0;$i<$num;$i++){
                        $columnname=getfromarray($column,$i);
                        if(!gbnull($columnname)){
                            //echo $columnname.'='.$datrec[$i].'<br>';
                            /*
                            if($nCharacter=1){
                                $value=iconv("Windows-1252", 'UTF-8',$datrec[$i]);
                            }else{
                                $value=$datrec[$i];
                            }*/
                            $value=mb_convert_encoding(getfromarray($datrec,$i),"UTF-8","auto");
                            
                            if(is_tablefieldnumeric($dat_table[$columnname]['Type'])){
                                if($decimalseparator<>'.')$value= str_replace ($decimalseparator,'.',$value);
                                $dat[$columnname]=$value;
                            }elseif($dat_table[$columnname]['Type']=='datetime'){
                                $dat[$columnname]=date("Y-m-d H:i:s", gstr2timestamp($value));
                            }elseif($dat_table[$columnname]['Type']=='date'){
                                $dat[$columnname]=date("Y-m-d", gstr2timestamp($value));
                            //}elseif($dat_table[$columnname]['Type']=='time'){
                            }elseif(substr($dat_table[$columnname]['Type'],0,7)=='varchar'){
                                $length=getvalueBetween($dat_table[$columnname]['Type'],'varchar(',')');
                                $dat[$columnname]=mb_substr($value,0,$length);
                                mylog(array("varchar"=>$dat_table[$columnname],"length"=>length),2);
                            }else{
                                $dat[$columnname]=$value;
                                mylog(array("else"=>$dat_table[$columnname]),2);
                            }
                        }
                    }
                    $dat=array_merge($dat,$arrconst);
                    
                    if(0){
                    echo '<pre>';
                    print_r($dat);
                    echo 'messsage<br>';
                    print_r($message);
                    echo '</pre>';
                    }
                    
                    if(property_exists($o,'displaycolumn')){
                        $message['key']=getfromarray($dat,$o->displaycolumn,'');
                    }elseif($importname=='addresses'){
                        $message['key']=getfromarray($dat,'name1');
                    }
                    $bok=$o->bvalidate($dat); //-> $o->postfields
                    if($bok){
                        $o->keyvalue=getfromarray($o->postfields,$o->key,'');
                        //check bexist with rights!
                        $bexist=false;
                        if(property_exists($o,'importkey')){
                            $clause=$o->importkey."=".gsstr2sql(getfromarray($dat,$o->importkey));
                            $data=$o->getentries($clause);
                        }else{
                            $clause=$o->key."=".gsstr2sql(getfromarray($dat,$o->key));
                            $data=$o->getentries($clause);
                        }
                        $bexist=(count($data)>0);
                        if($bexist){
                            //$clause=$o->displaycolumn.'='.gsstr2sql($o->postfields[$o->displaycolumn]);
                            //if($o->dbclass->bexist($o->table,$clause)){
                            $o->keyvalue=$data[0][$o->key];
                            $result=$o->update($o->keyvalue,$o->postfields);
                            if($result){
                                $message['text']="updated"; //$langclass->getlangValue('system',"already exists");
                                $message['status']=1;
                            }else{
                                $message['text']="update error"; //$langclass->getlangValue('system',"already exists");
                                $message['status']=0;
                            }
                        }else{
                            // ========================== add ============================
                            if(0){  //addresses
                                // customer
                                // supplier
                                
                                // documents
                                
                                // accjournal
                                
                            }else{
                                $result=$o->add($o->postfields);
                            }
                            
                            // ========================== protocol ===============================
                            if($result){
                                $count++;
                                $message['text']="imported"; //$langclass->getlangValue('system',"imported");
                                $message['status']=1;
                            }else{
                                $message['text']=$o->geterror();
                                $message['status']=0;
                            }
                        }
                    }else{
                        $message['text']=$row.' '.$o->geterror();
                        $message['status']=0;
                    }
                }
                $prot[]=$message;
            }
    return $count;
}

function getvalueBetween($subject,$patleft,$patright){
    $posstart=instr($subject,$patleft);
    if($posstart>=0){
        $posende=instr($subject,$patright,$posstart);
        if($posstart>=0){
            return substr($subject,$posstart+strlen($patleft),$posende-$posstart-strlen($patleft));
        }
    }
}

function ArrayIndexFromPropertyFilter($arr, $prop, $op, $value){
    $ret=array();
    if(is_array($ret)){
        foreach($arr as $k=>$props) {
            if(isset($props[$prop])){
                if($props[$prop]==$value){
                    $ret[]=$k;
                }
            }
        }
    }
    return $ret;
}

function ArrayIndexFromProperty($arr, $prop, $value){
  $ret=-1;
  foreach($arr as $k=>$props) {
      if(isset($props[$prop])){
          if($props[$prop]==$value){
              $ret=$k;
              break;
          }
      }
  }
  return $ret;
}

function ArrayPropSetAndNotNull($arr,$prop){
  if(isset($arr[$prop])){
    return !is_null($arr[$prop]);
  }
  return false;
}

function domain_url(){
  $sub="";
  $temp=getFromArray($_SERVER,'HTTPS',"off");
  $protocol=iif($temp==='on',"https://","http://");
  $pos = strrpos($_SERVER['REQUEST_URI'], "/");
  if ($pos !== false){
      $sub=substr($_SERVER['REQUEST_URI'],0,$pos+1);
  }
  //mylog("script_depth=".$GLOBALS['script_depth'],2);
  if($GLOBALS['script_depth']==1){
    $pos = strrpos($sub, "/");
    if ($pos !== false){
      $sub=substr($sub,0,$pos);
      $pos = strrpos($sub, "/");
      if ($pos === false){
          $sub="/";
      }else{
        $sub=substr($sub,0,$pos+1);
      }
    }
  }
  //mylog($protocol.$_SERVER['HTTP_HOST'].$sub,2);
  return $protocol.$_SERVER['HTTP_HOST'].$sub;
}

function gencrypt($v)    {
  return ($v)*$GLOBALS['domain_activekey'];
}
function gdecrypt($v)    {
  $ID=round($v/$GLOBALS['domain_activekey']);
  //mylog($ID,2);
  return $ID;
}

function getArrayIndexfromValue($arr,$field,$value){
    $index=-1;
    if(is_array($arr)){
      foreach($arr as $k => $v){
        if(isset($v[$field])){
          if($v[$field]==$value){
            $index=$k;
            break;
          }
        }
      }
    }
    return $index;
}