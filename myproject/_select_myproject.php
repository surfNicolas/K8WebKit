<?php
    if(instr("appmode",$search)>-1){
        if($type=="option"){
            $result='<option value="0">service report</option>';
            $result.='<option value="1">sales documents</option>';
        }elseif ($type=="jsonform_enum"){$result="0,1";}
        elseif ($type=="jsonform_titleMap"){$result='"0":"service report","1":"sales documents"';}
    }else{
        $bok=true;
        switch ($search) {
        // erp
        case 'syslang':
            $clause="mygroup='".$search."' and ID IN(2,3) and clientID=".$clientID;    
            $sql= "select ID, concat(value,' ',label) as displayname FROM k8props ".
                " WHERE ".$clause." order by value,label";
            $columnvalue='ID';
            $columndisplay='displayname';
            break;
        case 'countries':
            $clause="mygroup='".$search."' and clientID=".$clientID;    
            $sql= "select ID, concat(value,' ',label) as displayname FROM k8props ".
                " WHERE ".$clause." order by value,label";
            $columnvalue='ID';
            $columndisplay='displayname';
            break;
        default:
            $bok=false;
        }
        if($bok){
            //echo '$search=',$search.'<br>';
            if ($type=="option"){$result=$this->getFormOption($columnvalue,$columndisplay,$sql,"","select $search");}
            elseif ($type=="jsonform_enum"){$result=$this->getjsonForm_enum($columnvalue,$columndisplay,$sql);}
            elseif (strtoupper($type)==strtoupper("getSelectJson")){$result=$this->getSelectJson($columnvalue,$columndisplay,$sql);}
            elseif ($type=="jsonform_titleMap"){
                $result=$this->getjsonForm_titleMap($columnvalue,$columndisplay,$sql,"select $search");
                //$bshowsql=getfromarray($_REQUEST,'bshowsql',0) and ($GLOBALS['domain_development']==1 or ($GLOBALS['domain_development']==2 and ini_get("display_errors")==1));
                //if($bshowsql){echo 'GetjsonForm_titelMap:'.htmlspecialchars($result)."<br>";}
                //echo $search.' : '.htmlspecialchars($sql)."<br>";
            }
        }else{
            echo "$search=".$search.' not defined!<br>';
        }
    }
    if(gbnull($result) and $type=="jsonform_enum")$result='""';

