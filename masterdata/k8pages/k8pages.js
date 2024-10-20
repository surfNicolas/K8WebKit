
if(window['settingsk8pages']){
  if(page=="masterdata")settingsk8pages.masterdata.selector="#html1";
  var ok8=Object.create(k8);
  tinyoptions={"language":GLOBALS_language}; // put in your specific tinymce configuration
  ok8.datadefAddtinymce(settingsk8pages,tinyoptions);

  settingsk8pages.masterdata.cbBeforeSave=function(options){
    var dat=options.dat;
    var cancel=false;
    if(!gbnull(dat.site)){
      var obj={};
      try{
        obj=JSON.parse(dat.site);
      }
      catch(e){
        cancel=true;
        alert("error in site");
      }
    }
    if(!gbnull(dat.settings)){
      var obj={};
      try{
        obj=JSON.parse(dat.settings);
      }
      catch(e){
        cancel=true;
        alert("error in settings");
      }
    }
    return cancel;
  }

  settingsk8pages.masterdata.cbMenuleft=function(options){
    var el_md=options.el_md, e=options.e, row_actual=options.row_actual, dat_form=options.dat_form,settings=options.settings;
    var el=e.target;
    var value=getfromArray(el.dataset,"value");
    if(value=="preview"){
      // save
      var url='masterdata/ProcessData.php?process_action=SavePreview&datadefID=k8pages';
      dat_form['marking']=dat_form['marking']+'_preview';
      postData(url,dat_form).then((obj) => {
        console.log(obj);
        if(obj.bok){
          var keyvalue=obj.dat['pageID'];
          var path='';
          var url=path+settings.masterdata.url_detail+'&page_mode=2&keyvalue='+keyvalue;
          var parameter="width="+window.innerWidth.toString()+",height="+window.innerHeight.toString()+",resizable=yes,scrollbars=yes";
          parameter="top="+(window.screenY).toString()+",left="+(window.screenX).toString()+","+parameter;
          var w = window.open(url,'Edit', parameter);
          if(w)w.focus();
        }else{
          ok8.message(obj.error,'alert');
        }
      });
    }else if(value=="prevdatadef"){
      let datadefID_temp=datadefID;
      //let elementtype='detail';
      let pagetype='catalog';
      datadefID_temp=prompt('datadefID',datadefID);
      //elementtype=prompt('elementtype',elementtype);
      pagetype=prompt('pagetype',pagetype);
      if(gbnull(datadefID) || gbnull(pagetype)){
        return;
      }else{
        var url='masterdata/ProcessData.php?process_action=SavePreview&datadefID=k8pages';
        dat_form['marking']=dat_form['marking']+'_preview';
        postData(url,dat_form).then((obj) => {
          console.log(obj);
          if(obj.bok){
            var keyvalue=obj.dat['pageID'];
            var path='';
            var url=path+GLOBALS_indexfile+'?page=catalog&pagetype='+pagetype+'&datadefID='+datadefID_temp+'&page_mode=2&keyvalue='+keyvalue;
            console.log(url);
            var parameter="width="+window.innerWidth.toString()+",height="+window.innerHeight.toString()+",resizable=yes,scrollbars=yes";
            parameter="top="+(window.screenY).toString()+",left="+(window.screenX).toString()+","+parameter;
            var w = window.open(url,'Edit', parameter);
            console.log(w);
            if(w)w.focus();
          }else{
            ok8.message(obj.error,'alert');
          }
        });
      }
    }
  };
}