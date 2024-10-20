<?php
    $echo=2; //0=nichts, 1=screen, 2=Log
    mylog("_prep_definition Start",$echo);
    mylog($_REQUEST,$echo);
    $dbclass=new dbclass();

    // ------------ Identifikation
    $datadefID=getfromArray($_REQUEST,'datadefID',0);
    $table=getfromArray($_REQUEST,'table');
    $dialog=getfromArray($_REQUEST,'dialog',0);
    
    $error='';
    $o=0;
    if(gbnull($datadefID)){
        if(gbnull($table)){
            //$error="please specify table or datadefID!";
        }else{
            $datadefID=-1;
            $datadefinitions[$datadefID]['table']=$table;
            $datadefinitions[$datadefID]['name']=$table;
            $datadefinitions[$datadefID]['objectclass']="data_accessclass";
            $datadefinitions[$datadefID]['requiredfile']="class_data_accessclass.php";
            // key, displaycolumn
        }
    }elseif(!isset($datadefinitions[$datadefID])){
        //$datadefID=0;
        $error='datadefID '.$datadefID.' is not valid!';
    }else{
        $table=$datadefinitions[$datadefID]['table'];
    }

    if(isset($datadefinitions[$datadefID])){
        mylog('datadefID set',2);
        if(!isset($datadefinitions[$datadefID]['columns']) and !gbnull($datadefinitions[$datadefID]['table'])){
            $datadefinitions[$datadefID]['columns']=$dbclass->ShowTable($datadefinitions[$datadefID]['table'],$datadefinitions[$datadefID]['key']);
            if(!gbnull($dbclass->error)){
                $error=$dbclass->error;
                goto end;
            }
            mylog('table without error',$echo);
        }
        if(!isset($datadefinitions[$datadefID]['rightcheck']))$datadefinitions[$datadefID]['rightcheck']=1;
        if(!isset($datadefinitions[$datadefID]['masterdata']['object_mode']))$datadefinitions[$datadefID]['masterdata']['object_mode']=0;
        if(!isset($datadefinitions[$datadefID]['masterdata']['add_empty_rec']))$datadefinitions[$datadefID]['masterdata']['add_empty_rec']=0;
        //if(!isset($datadefinitions[$datadefID]['masterdata']['bwithrights']))$datadefinitions[$datadefID]['masterdata']['bwithrights']=true;
        if(!isset($datadefinitions[$datadefID]['masterdata']['url_getR']) and !$dialog){
            //$file='../ProcessData.php';
            // script_depth=1
            //$file='masterdata/ProcessData.php';
            //$file=dirname($_SERVER['SCRIPT_NAME']).'/masterdata/ProcessData.php';
            //$file=str_repeat('../',$GLOBALS['script_depth']).'masterdata/ProcessData.php';
            
            $file='masterdata/ProcessData.php';
            
            //if($GLOBALS['script_depth']>0){
            //    $file=str_repeat('../',$GLOBALS['script_depth']).$file;
            //}
            //mylog($file,$echo);
            $datadefinitions[$datadefID]['masterdata']['root']=''; //str_repeat('../',$GLOBALS['script_depth']);
            
            mylog("GENERATE URL $datadefID=".$datadefID,$echo);
            
            //!!! "url_new":"index.php?page=form&datadefID=100&page_mode=2&action=New",
            //!!! "url_edit":"index.php?page=form&datadefID=100&page_mode=2&action=Edit"

            if($datadefID<=0){
                $datadefinitions[$datadefID]['masterdata']['url_new']=$domain_indexfile."?page=form&table=$table&process_action=New&page_mode=2";
                $datadefinitions[$datadefID]['masterdata']['url_edit']=$domain_indexfile."?page=form&table=$table&process_action=Edit&page_mode=2";
                $datadefinitions[$datadefID]['masterdata']['url_getR']=$file."?table=$table&process_action=getRecords";
                $datadefinitions[$datadefID]['masterdata']['url_init']=$file."?table=$table&process_action=Init";
                $datadefinitions[$datadefID]['masterdata']['url_load']=$file."?table=$table&process_action=Load";
                $datadefinitions[$datadefID]['masterdata']['url_save']=$file."?table=$table&process_action=Save";
                $datadefinitions[$datadefID]['masterdata']['url_del'] =$file."?table=$table&process_action=Del";
                $datadefinitions[$datadefID]['masterdata']['url_readfilter']=$file;
                $datadefinitions[$datadefID]['masterdata']['data_readfilter']=array('table'=>$table,'process_action'=>"ReadFilter");
            }else{
                $datadefinitions[$datadefID]['masterdata']['url_new']=$domain_indexfile."?page=form&datadefID=$datadefID&process_action=New&page_mode=2";
                $datadefinitions[$datadefID]['masterdata']['url_edit']=$domain_indexfile."?page=form&datadefID=$datadefID&process_action=Edit&page_mode=2";
                $datadefinitions[$datadefID]['masterdata']['url_getR']=$file."?datadefID=$datadefID&process_action=getRecords";
                $datadefinitions[$datadefID]['masterdata']['url_init']=$file."?datadefID=$datadefID&process_action=Init";
                $datadefinitions[$datadefID]['masterdata']['url_load']=$file."?datadefID=$datadefID&process_action=Load";
                $datadefinitions[$datadefID]['masterdata']['url_save']=$file."?datadefID=$datadefID&process_action=Save";
                $datadefinitions[$datadefID]['masterdata']['url_del'] =$file."?datadefID=$datadefID&process_action=Del";
                $datadefinitions[$datadefID]['masterdata']['url_readfilter']=$file;
                $datadefinitions[$datadefID]['masterdata']['data_readfilter']=array('datadefID'=>$datadefID,'process_action'=>"ReadFilter");
            }
        }
        if(!isset($datadefinitions[$datadefID]['tabulator']['columns']) and isset($datadefinitions[$datadefID]['columns'])){
            $datadefinitions[$datadefID]['tabulator']['columns']=table2tabulator($datadefinitions[$datadefID]['columns']);
        }
        if(!isset($datadefinitions[$datadefID]['jsonform']['schema']) and isset($datadefinitions[$datadefID]['columns'])){
            $datadefinitions[$datadefID]['jsonform']['schema']=table2jsonform($datadefinitions[$datadefID]['columns']);
        }
        if(!isset($datadefinitions[$datadefID]['objectclass'])){
            $error="datadefID=".$datadefID." objectclass not set";
            mylog($error,$echo);
            exit;
        }else{
            if(!gbnull(getfromArray($datadefinitions[$datadefID],'requiredfile'))){
                require_once $datadefinitions[$datadefID]['requiredfile'];
            }
            if(!gbnull($datadefID)){
                mylog($datadefinitions[$datadefID],$echo);
                $o=new $datadefinitions[$datadefID]['objectclass']($datadefinitions[$datadefID]);
                //echo '$o->error='.$o->error.'<br>';
                if(gbnull($o->error)){
                  if($o->rightcheck<>0){
                    if(!isset($o->permit['create'])){
                      // nothing allowed
                    }elseif(count($o->roles)>0){
                      $res=0;
                      foreach($o->roles as $roleID){
                        $method=getFromArray($o->permit['create'],$roleID,0);
                        if($method==1000){
                          //echo 'userID='.$_REQUEST[$o->masterkey].'<br>';
                          if(isset($_REQUEST[$o->masterkey])){
                            $res=$o->bcheckMaster($_REQUEST[$o->masterkey],'update',$roleID);
                            //echo "Error=".$o->error.'<br>';
                          }
                        }else{
                          $arr=array("method"=>$method);
                          $res=$o->dbclass->bRecordAccess($arr);
                        }
                        if($res)break;
                      }
                      $datadefinitions[$datadefID]['masterdata']['rightuser_create']=$res;
                      //echo "a-Result=".$datadefinitions[$datadefID]['masterdata']['rightuser_create'].'<br>';
                    }else{
                        $method=getFromArray($o->permit['create'],$o->roleID,0);
                        if($method==1000){
                          if(isset($_REQUEST[$o->masterkey])){
                            $datadefinitions[$datadefID]['masterdata']['rightuser_create']=$o->bcheckMaster($_REQUEST[$this->masterkey],'update',$o->roleID);
                          }
                        }else{
                          $arr=array("method"=>$method);
                          $datadefinitions[$datadefID]['masterdata']['rightuser_create']=$o->dbclass->bRecordAccess($arr);
                        }
                    }
                  }
                }else{
                    $error=$o->error;
                    $o=0;
                }
                if($echo==1){
                    echo 'childs<br>';
                    echo '<pre>';
                    print_r($o->childs);
                    echo '</pre>';
                }
            }
        }
    }else{
      $error=json_encode($_REQUEST)." error datadefID is not set";
      mylog($error,$echo);
      //if($echo>0)exit;
    }
    // /Identifikation
end:    
    //if(0){
    if($echo==1){
        echo "datadefID=".$datadefID.'<br>';
        echo "error=".$error.'<br>';
        echo '<pre>';
        print_r($datadefinitions[$datadefID]['masterdata']);

		//print_r($datadefinitions[$datadefID]);
        echo 'columns-';
        print_r($datadefinitions[$datadefID]['columns']);
        //echo 'tabulator-';
        //print_r($datadefinitions[$datadefID]['tabulator']);
        echo 'jsonform-';
        print_r($datadefinitions[$datadefID]['jsonform']);
        //echo '$o->colobject-';
        //print_r($o->colobject);
        echo '</pre>';
        echo "testEnde<br>";
    }
?>
