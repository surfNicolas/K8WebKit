if(page=="catalog"){
  settingsk8components.masterdata.rightuser_create=0;
  settingsk8components.masterdata.search_mode=1;
  k8.datadefAddSearch(settingsk8components);
} 

settingsk8components.masterdata.cbcatLoad=[
  function(options){
    var settings=options.settings;
    var dat=options.dat;
    var el_rec_record=options.el_rec_record;
    var el_detaillink=el_rec_record.getElementsByClassName("js_detaillink")[0];
    var keyvalue=getfromArray(dat,settings.key,0);
    if(el_detaillink){
    if(GLOBALS_urlmode==1){
      el_detaillink.href=build_href({"href":settings.masterdata.url_detail})+"/"+getfromArray(dat,settings.displaycolumn);
    }else{
      el_detaillink.href=settings.masterdata.url_detail+"&keyvalue="+keyvalue;
    }        
    }else{
      console.log("missing js_detaillink")
    }
  }
]