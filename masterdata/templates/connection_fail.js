settings.masterdata.cbConnectionfail=function(options){
  //console.log("cbConnectionfail");
  var el=document.getElementsByClassName('navbar-brand')[0];
  if(el){
    if(el.style.color!=="red"){
      var color_backup=el.style.color;
      el.style.color="red";
      var intervalID=setInterval(checkConnection,5000);

      function checkConnection(){
        console.log("checkConnection");
        $.getJSON("masterdata/ProcessData.php", function(oJson) {
          el.style.color=color_backup;
          clearInterval(intervalID);
          if(isset(options,"saveRecord")){
            options.saveRecord();
          }
          if(isset(options,"tableTab")){
            // reloaddata
            options.tableTab.setData(options.url,options.params);
          }
        })
        .fail(function(jqxhr, textStatus, error ) {
        });			
      }  
    }  
  }else{
    concole.log("cbConnectionfail: no navbar-brand, no connection check");
  }
};