<?php // 2024-10-17 Copyright Klaus Eisert
// webkitb5 
$GLOBALS['script_depth']=0;
include "_init_page.php";
//include "masterdata/class_data_sqlsrv.php";
include "masterdata/_datadefinitions.php";
include("_prepare_head.php");?>
<?php if($page=='phpinfo'): ?>
   <?php echo phpinfo();?>
<?php else:?>
  <!DOCTYPE html>
  <html lang="<?php echo $GLOBALS['domain_language']?>">
  <head>
      <meta charset="UTF-8">
      <title><?php echo $headtitle?></title>
      <meta name="description" content="<?php echo $headdescription?>">
      <meta property="og:image" content="<?php echo hostpath().$headimage;?>">
      <script>var site;</script>  
      <?php if(count($site)>0):?>
      <script>site=<?php echo json_encode($site);?></script>
      <?php endif?>
      <?php //if($datadefID=="k8pages" and count($dataws)==1){
      if(count($dataws)==1){
        if(isset($dataws[0]['head'])){
          if(!gbnull($dataws[0]['head']))echo str_replace ('{{root}}', $GLOBALS['domain_hostpath'], $dataws[0]['head']);
        }
      }?>
      <?php include "_head.php";?>
      <?php include "_head_js.php";?>
      <?php datadefIDAreaLines($datadefID,'head_end');?>
      <?php datadefIDsite($site,'head_end');?>
  </head>

  <body class="Xbg-light">
    <?php if($page_mode==1){ // nothting
    }else if($page_mode==2){include "_header_min.php";
    }else{include "_header.php";}?>
    <main class="mycontainerbg">
      <?php if(gbnull($page) or $page=="Xhome"):?>
        <?php include "_home.php";?>
      <?php elseif($page=='homenew'):?>
        <?php include "_homenew.php";?>
      <?php elseif($page=='info'): 
        //mylog($GLOBALS['domain_defaultrights'],2);
        ?>
        <?php include "_info.php";?>
      <?php elseif(isset($pages[$page]['contentPHP'])):
        include($pages[$page]['contentPHP']);
      else:?>
          <div id="layout0" class="mycontainerbg k8-layout0">
            <div id="masterdata0" class="mx-n3"></div>
            <div id="html0"></div>
          </div>
          <div id="layout1" class="container mycontainerbg k8-layout1">
            <div id="masterdata1" class="mx-n3"></div>
            <div id="html1"></div>
          </div>
          <div class="container mycontainerbg">
            <div id="edit"></div>
          </div>
      <?php endif?>
    </main>
    
    <?php include "_footer.php";?>
    <?php //if($datadefID=='k8pages' and count($dataws)>0){if(!gbnull($dataws[0]['foot']))echo $dataws[0]['foot'];}
      if(count($dataws)==1){
        if(isset($dataws[0]['foot'])){
          //if(!gbnull($dataws[0]['foot']))echo $dataws[0]['foot'];
          if(!gbnull($dataws[0]['foot']))echo str_replace ('{{root}}', $GLOBALS['domain_hostpath'], $dataws[0]['foot']);
        }
      }
    ?>
    <?php datadefIDsite($site,'foot');?>
    <?php $foot_include=getFromArray($page_arr,"foot_include","_foot_standard.php");include $foot_include;?>
    <?php
      $bnoexample=datadefIDAreaLines($datadefID,'foot');
      $bwithexample=true;
      if(isset($page_arr['withexample'])){
        $bwithexample=$page_arr['withexample'];
      }else{
        $bwithexample=!$bnoexample;
      }
      if($bwithexample)echo '<script src="'.$GLOBALS['domain_hostpath'].'js/example.js"></script>';?>    
    <?php include "_googletag.php";?>
    <?php if($GLOBALS['domain_cookiemode']==1):?>
      <?php $cookieconf=$GLOBALS['domain_cookieconf'][$GLOBALS['domain_language']];?>
      <div id="cookie_request" class="container-fluid">
        <div class="container" style="text-align: center">
          <p class="my-1"><strong><?php echo $cookieconf['title'];?></strong></p>
          <p style='max-height: 100px; overflow-y: auto;'><?php echo $cookieconf['text'];?></p>
          <div style="display: flex; justify-content:center">
          <button type="button" onClick="allowCookies(2)" class="m-1 btn btn-primary"><?php echo $cookieconf['allow'];?></button>
          <button type="button" onClick="allowCookies(3)" class="m-1 btn btn-secondary"><?php echo $cookieconf['deny'];?></button>
          </div>
        </div>
      </div>
      <script>
        function allowCookies(cookiemode){
          if(cookiemode==2)setGoogleAnalytics();
          url=GLOBALS_hostpath+"masterdata/ProcessMethod.php?process_action=cookierequest&cookiemode="+cookiemode;
          fetch(url).then(function (response){return response.text();})
          .then(function(text){
            let obj=JSON.parse(text);
            console.log(obj);
          }).catch(function (err) {
            console.warn('fetch error ', err);
          });
          $('#cookie_request').hide();
        }
      </script>
    <?php elseif($GLOBALS['domain_cookiemode']==2):?>
      <script>setGoogleAnalytics()</script>
    <?php endif?>
  </body>
  </html>
<?php endif?>