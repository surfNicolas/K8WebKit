<noscript>
JavaScript is turned off. Please enable JavaScript!. This website is created with JavaSrcipt and have full functionality only with JavaScript.
</noscript>
  
<?php if(false): //if($page!=='login'):?>
<div class="bg-white k8-border-top py-5">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-6">
        <?php include("_loginlogout_form.php")?>
        <?php if($GLOBALS['domain_language']=='de'): ?> 
          <p class="mt-1">probiere es aus, Benutzername: demo, Kennwort: demo</p>
        <?php else:?>
          <p class="mt-1">check it out: username: demo, password: demo</p>
        <?php endif?>
      </div>
    </div>
  </div>
</div>
<?php endif?>

<?php if($page_mode==0):?>
<footer id="footer">
  <div class="container">
    <div class="row">
      <div class="col-lg-3 col-md-6">
        <?php echo '<h3>'.$GLOBALS['domain_name'].'</h3>';?>
        <p class="mb-0"><?php echo $GLOBALS['domain_operator'];?></p>
        <p>Email: <a href="mailto:<?php echo $GLOBALS['domain_emailto'];?>"><?php echo $GLOBALS['domain_emailto'];?></a><br>
        </p>
      </div>
      <div class="col-lg-3 col-md-6">
        <h3>#ls#Useful Links#</h3>  
        <ul>		
          <li><a href="<?php echo $GLOBALS['domain_pagelinks'][$domain_language]['contact']['href'];?>"><?php echo $GLOBALS['domain_pagelinks'][$domain_language]['contact']['title'];?></a></li>
          <li><a href="<?php echo $GLOBALS['domain_pagelinks'][$domain_language]['legalnotice']['href'];?>"><?php echo $GLOBALS['domain_pagelinks'][$domain_language]['legalnotice']['title'];?></a></li>
          <li><a href="<?php echo $GLOBALS['domain_pagelinks'][$domain_language]['privacypolicy']['href'];?>"><?php echo $GLOBALS['domain_pagelinks'][$domain_language]['privacypolicy']['title'];?></a></li>
          <li><a href="<?php echo $GLOBALS['domain_pagelinks'][$domain_language]['termsofuse']['href'];?>"><?php echo $GLOBALS['domain_pagelinks'][$domain_language]['termsofuse']['title'];?></a></li>
        </ul>            
      </div>
      <div class="col-lg-3 col-md-6">
        <h3>Services</h3>  
        <ul>		
          <li><a href="<?php echo $GLOBALS['domain_pagelinks'][$domain_language]['service1']['href'];?>"><?php echo $GLOBALS['domain_pagelinks'][$domain_language]['service1']['title'];?></a></li>
          <li><a href="<?php echo $GLOBALS['domain_pagelinks'][$domain_language]['service2']['href'];?>"><?php echo $GLOBALS['domain_pagelinks'][$domain_language]['service2']['title'];?></a></li>
        </ul>            
      </div>
      <div class="col-lg-3 col-md-6">
        <h3>K8 Web Kit made</h3>  
        <ul>
          <li><a href="https://k8webkit.com" target="_blank" title="">K8 Web Kit</a></li>
          <li><a href="https://k8webkit.com/index.php?page=community">Community</a>, be part of it</li>
          <li><a href="https://bootstrapmade.com/">Bootstrap made</a>, CSS Template</li>
          <li><a href="https://servicereporter.net" target="_blank" title="">Servicereporter</a>,<br> time recording and invoicing</li>
        </ul>
      </div>
    </div>
  </div>
</footer>
<a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>
<script>
  var el_footer=document.getElementsByTagName('footer')[0];
  el_footer.innerHTML=ReplacePlaceholder(el_footer.innerHTML);
</script>
<?php elseif($page_mode==2):?>
<footer id="footer">
  &nbsp;
</footer>
<?php endif?>
<script src="<?php echo $GLOBALS['domain_hostpath'];?>js/standard.js"></script>
<script src="<?php echo $GLOBALS['domain_hostpath'];?>assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="<?php echo $GLOBALS['domain_hostpath'];?>assets/vendor/aos/aos.js"></script>
<script src="<?php echo $GLOBALS['domain_hostpath'];?>assets/js/main.js"></script>
