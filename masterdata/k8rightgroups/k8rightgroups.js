// settingsk8rightgroups
// settingsk8rightmembers

let child_obj={
  id_selector:"#html-child",
  settings:settingsk8rightmembers,
};

settingsk8rightgroups.masterdata.cbAfterLoad=function(options){
  let settings=options.settings;
  setChild(options,child_obj,options.dat[settings.key]);
};
settingsk8rightgroups.masterdata.cbAfterNew=function(options){
  setChild(options,child_obj,0);
};

function setChild(options,child_obj,keyvalue){
  child_obj.settings.masterdata.rightuser_create=(userID==options.dat['creatorID'] || superuser);
  var clause=child_obj.settings.masterkey+'='+keyvalue;
  child_obj.settings.masterdata.clause='('+clause+')';
  child_obj.settings.masterdata.defaultvalues={};
  child_obj.settings.masterdata.defaultvalues[child_obj.settings.masterkey]=keyvalue;
  var el=$(child_obj.id_selector)[0];
  var html='<div id="'+child_obj.id_selector.substring(1)+'" class="mx-n3"></div>';
  if(el){
    $(el).replaceWith(html)
  }else{
    $('#layout1').append(html);
  }
  $(child_obj.id_selector).masterdata(child_obj.settings);
}