<?php
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