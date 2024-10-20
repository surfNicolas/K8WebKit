<?php 
$url=basename($_SERVER['PHP_SELF']);
$url=gsclauseand($url,$_SERVER['QUERY_STRING'],!gbnull($_SERVER['QUERY_STRING']),'?');
?>
  <header>
    <div class="container px-0 mynavi">
      <nav class="navbar navbar-expand-lg navbar-light Xbg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="<?php echo $GLOBALS['domain_hostpath'];?>"><?php echo $GLOBALS['domain_name'];?></a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <!-- write your menu here -->
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </header>
<?php if($GLOBALS['domain_menumode']>=1):?>
  <script src="<?php echo $GLOBALS['domain_hostpath'];?>js/menu.js"></script>  
<?php endif?>
