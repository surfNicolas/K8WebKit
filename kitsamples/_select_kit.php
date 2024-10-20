<?php
    $dat_company=getfromarray($_SESSION,'dat_company',array());
    $creatorID=getfromarray($_SESSION,'userID',0);
    $companyID=getfromarray($_SESSION,'companyID',0);
    $countryID=getfromarray($dat_company,'countryID',0);
    //var_dump($dat_company);
    if(false){
    }else{
        $bok=true;
        switch ($search) {
        // kit
        case 'basic_units':
        case 'item_group':
            $clause="type='$search' and parentID=0 and clientID=$clientID and k8groups.creatorID=$creatorID";
            $sql= "select groupID as ID, title as displayname FROM k8groups ".
                " WHERE ".$clause." order by title";
            $columnvalue='ID';
            $columndisplay='displayname';
            break;
        case 'users':
            $clause="1=1";
            $sql= "select userID as ID, username as displayname FROM k8login ".
                " WHERE ".$clause." order by username";
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
            elseif (strtoupper($type)==strtoupper("getSelectJson_encode")){$result=json_encode($this->getSelectJson($columnvalue,$columndisplay,$sql));}
            elseif ($type=="jsonform_titleMap"){
                $result=$this->getjsonForm_titleMap($columnvalue,$columndisplay,$sql,"select $search");
                //if(getfromarray($_REQUEST,"bshowsql",0)){echo 'GetjsonForm_titelMap:'.htmlspecialchars($result)."<br>";}
                //echo $search.' : '.htmlspecialchars($sql)."<br>";
            }
        }else{
            echo "$search=".$search.' not defined!<br>';
        }
    }
    if(gbnull($result) and $type=="jsonform_enum")$result='""';