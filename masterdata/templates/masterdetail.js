// settingsdetails=[{"settings":settingsemployee,"mode":"catalog","selector":"html2"},{"settings":settingsinvoice,"mode":"masterdata"},{"settings":settingsturnoversimple,"mode":"chartjs"}];
// please don't link it!
// copy it to your datadefinition JavaScript file

settings.masterdata.cbAfterNew=[
function(options){
  var el_md=options.el_md;
  for(var i=0;i<settingsdetails.length;i++){
    showMasterDetail(el_md,settingsdetails[i]['mode'],settingsdetails[i]['selector'],settingsdetails[i]['settings'],-1,0,i);
  }
}];
settings.masterdata.cbAfterLoad=[
function(options){
  var settings=options.settings;
  var el_md=options.el_md;dat=options.dat;
  for(var i=0;i<settingsdetails.length;i++){
    showMasterDetail(el_md,settingsdetails[i]['mode'],settingsdetails[i]['selector'],settingsdetails[i]['settings'],dat[settings.key],dat['rightuser_update'],i);
  }
}];

function showMasterDetail(el_md,submode,selector,settingssub,ID,rightuser_create,index){
  index=typeof index=="undefined" ? 0 :  index;
  rightuser_create=typeof rightuser_create=="undefined" ? false :  rightuser_create;
  settingssub.masterdata.rightuser_create=rightuser_create;
  var clause=settingssub.table+'.'+settingssub.masterkey+'='+ID;
  settingssub.masterdata.clause='('+clause+')';
  settingssub.masterdata.defaultvalues={};
  settingssub.masterdata.defaultvalues[settingssub.masterkey]=ID;

  if(selector){
    if(!document.querySelector(selector))console.error('selector: '+selector+' does not exist!');
  }else{
    var el_main=el_md.parentElement;
    var subclass="mx-n0";
    if(el_main.classList.contains('container'))subclass="mx-n3";
    if(submode=="chartjs")subclass=gsclauseand(subclass,"k8-border k8-padding-6-12",true," ");
    var el=$('#html-sub'+index)[0];
    var html='<div id="html-sub'+index+'" class="'+subclass+'"></div>';
    if(el){
      $(el).replaceWith(html)
    }else{
      $(el_main).append(html);
    }
    selector='#html-sub'+index;
  }
  if(submode=="masterdata"){
    masterdata_sub=$(selector).masterdata(settingssub);
  }else if(submode=="catalog"){
    catalog_sub=$(selector).catalog(settingssub);
  }else if(submode=="chartjs"){
    settingssub.chartjs_def.selector=selector;
    var exk8=Object.create(k8);
    if(settingssub.chartjs_def.chartjs.data.datasets.length>0){
      for(var i=0;i<settingssub.chartjs_def.chartjs.data.datasets.length;i++){
        settingssub.chartjs_def.chartjs.data.datasets[i].data={};
      }
    }
    if(settingssub.chartjs_def.chartjs.data.labels)settingssub.chartjs_def.chartjs.data.labels=[];
    exk8.displayChartjs(settingssub);
  }else{
    $(selector).html("submode not valid");
  }
}