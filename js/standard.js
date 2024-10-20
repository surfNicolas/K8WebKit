// 2022-10-24 Copyright Klaus Eisert
if(bwithpagetimer){
    var pagetimer=Object.create(k8pagetimer);
    pagetimer.init({interval:5000,maxtime:1000*60*20,url_login:GLOBALS_url_login,url_logout:GLOBALS_url_logout});
    setInterval(function(){
        pagetimer.mytime-=pagetimer.interval;
        //if(mytime>=maxtime){
        if(pagetimer.mytime<=0){
            $.getJSON(pagetimer.url_logout, function(oJson) {
                window.location.href=pagetimer.url_login;
            })
            .fail(function(jqxhr, textStatus, error ) {
                var err = pagetimer.url_logout+" Request Failed, "+ textStatus + ", " + error;
                console.log(err);
            });			
        }else{
            if(pagetimer.el_timer)pagetimer.display();
        }
    },pagetimer.interval);

    if(settings.masterdata)settings.masterdata.pagetimer=pagetimer;
}else if(GLOBALS_serviceworker){
  window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(GLOBALS_hostpath+'service-worker.js');
    }
  });  
}

function InsertRecord(dat,returnflag,options){
  // options.datadefalias
  // options.datadefID
  // options.sourceelement
  // settings
  // masterdata
  // catalog
  options=typeof options!=='undefined' ? options : {};        
  console.log('InsertRecord');
  console.log(options);
  let dadefIDlocal = getfromArray(options,'datadefID');
  let datadefalias=getfromArray(options,'datadefalias');
  let mysettings;
  if(gbnull(datadefalias)){
    if(gbnull(dadefIDlocal)){
      console.error('datadefID not set!');
    }else{
      if(window["settings"+dadefIDlocal]){
        mysettings=window["settings"+dadefIDlocal];
      }else{
        console.error("settings"+dadefIDlocal+' not defined');
      }
    }
  }else{
    mysettings=window["settings"+datadefalias];
  }
  if(!mysettings){
    mysettings=settings;
  }
  switch(Number(returnflag)){
    case 1:
      location.reload(true);
      break;
    case 2:
      let mymasterdata
      if(isNumeric(options.sourceelement)){
        mymasterdata=sourceelement[options.sourceelement];
      }else{
        mymasterdata=masterdata;
      }
      var bin=false;
      for(var i=0;i<mymasterdata.tableTab.getRows().length;i++){
          if(mymasterdata.tableTab.getRows()[i].getData()[mysettings.key]==dat[mysettings.key]){
              bin=true;
              mymasterdata.tableTab.getRows()[i].update(dat);
          }
      }
      if(!bin){
        mymasterdata.tableTab.addRow(dat, true);
      }
      break;
    case 3:
      let mycatalog;
      if(isNumeric(options.sourceelement)){
        mycatalog=sourceelement[options.sourceelement];
      }else{
        mycatalog=catalog;
      }
      if(typeof mycatalog=='undefined'){
        conole.error('InsertRecord catalog not defined');
      }else{
        console.log('catalog');
        var keyvalue=getfromArray(dat,mysettings.key,0);
        if(gbnull(keyvalue)){
          console.log('keyvalue not set!');
        }else{
          var selector='.js_rec_record[data-keyvalue="'+keyvalue+'"]';
          el_record=$(mycatalog.listedit).find(selector)[0];
          if(el_record){
            // replace
            mycatalog.replaceRecord(dat,selector);
          }else{
            mycatalog.insertRecord(dat,'','first');
          }
        }
      }
      break;
  }
}