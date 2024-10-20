<div class="container k8-layout1" id="layout1">
  <div id="html1"></div>
</div>
<script> 
var bactivate=<?php echo iif(gbactivate(getfromarray($_REQUEST,'a',0),getfromarray($_REQUEST,'b',0)),"true","false");?>;
var el=document.querySelector('#layout1');
if(bactivate){
  el.innerHTML="<h1>"+getl("Activation")+"</h1><p style=\"height: 300px\">"+getl("Your account is succesful activated! Now you can ")+"<a href=\""+GLOBALS_url_login+"\">"+getl("sign in")+"</a></p>";
}else{
  el.innerHTML="<h1>"+getl("Activation")+"</h1><p style=\"height: 300px\">"+getl("The activation failed!")+"</p>";
}
</script> 