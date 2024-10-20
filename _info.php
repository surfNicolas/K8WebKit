        <div class="container mycontainerbg">
          <div class="row" style="min-height: 400px">
            <h1>Info</h1>
            <div class="col-sm-12 pb-4">
                <?php
                    //mylog($GLOBALS['domain_defaultrights'],2);
                    echo "domain_url_login: ".$GLOBALS['domain_url_login'].'<br>';
                    echo "Version: ".$GLOBALS['domain_version'].' from '.$GLOBALS['domain_versdate'].'<br>';
                    echo "Hostpath: ".$GLOBALS['domain_hostpath'].'<br>';
                    //echo "Ihr HTTP_USER_AGENT lautet: ".$_SERVER['HTTP_USER_AGENT'].'<br>'; 
                    echo 'HTTP_ACCEPT_LANGUAGE='.$_SERVER['HTTP_ACCEPT_LANGUAGE'].'<br>';
                    echo 'SESSION.language='.$_SESSION['language'].'<br>';
                    $browserLocale = explode(',',$_SERVER['HTTP_ACCEPT_LANGUAGE'])[0];
                    //if(substr($browserLocale,0,2)=="de")$browserLocale="de";
                    //$setlocale=setlocale(LC_ALL,'');
                    //$setlocale=setlocale(LC_ALL,0);
                    //$setlocale=setlocale(LC_ALL,$browserLocale);
                    echo 'browserLocale='.$browserLocale.'<br>';
                    //echo 'setlocale='.iif($setlocale,$setlocale,"false").'<br>';
                    //echo 'decimal_point='.localeconv()['decimal_point'].'<br>';
                    echo 'GLOBAL.decimal_point='.$GLOBALS['decimal_point'].'<br>';
                    echo "SESSION ID: ".session_id().'<br>'; 
                    echo "SESSION language: ".$_SESSION['language'].'<br>'; 
                    echo "SESSION domain_languageID: ".$_SESSION['domain_languageID'].'<br>'; 
                    echo "SESSION userID: ".getfromArray($_SESSION,'userID').' '.getfromArray($_SESSION,'username').'<br>';
                    echo "SESSION clientID: ".getfromArray($_SESSION,'clientID').'<br>';
                    echo "SESSION rightgroupID: ".getfromArray($_SESSION,'rightgroupID').' '.$dbclass->lookup("name","k8rightgroups","rightgroupID=".getfromArray($_SESSION,'rightgroupID')).'<br>';
                    echo "SESSION roles: ".implode(';',$_SESSION['roles']).'<br>'; 
                    echo "SESSION backurl: ".getfromArray($_SESSION,'backurl').'<br>';
                    echo "SESSION tabulatordatetimeformat: ".getfromArray($_SESSION,'tabulatordatetimeformat').'<br>';
                ?>
                <script>
                  document.write('Number example: '+(1.5).toLocaleString()+'<br>');
                  document.write('Window width x height: '+window.innerWidth+' x '+window.innerHeight+'<br>');
                </script>
                <?php
                    mylog(array('cookie info'=>$_COOKIE),2);
                    if(isset($_COOKIE['login'])){
                        echo 'cookie login set <br>';
                    }else{
                        echo 'cookie login not set <br>';
                    }
                ?>
            </div>
          </div>
        </div>