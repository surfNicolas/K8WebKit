// settingsk8groups

if(page=='lineedit'){
  // too late settingsk8groups.foot_nodefault=false;
  catalog=$('#html1').catalog(settingsk8groups);
}else if(page=='doc_coloredgroup'){
  settingsk8groups.masterdata.clause="type='workflow_main'";
  catalog=$('#masterdatagroup1').catalog(settingsk8groups);
  settingsk8groups.masterdata.clause="type='workflow_sub'";
  catalog=$('#masterdatagroup2').catalog(settingsk8groups);
}else if(page=='masterdata'){
  masterdata=$('#masterdata1').masterdata(settingsk8groups);
}else if(page=='usergroups'){
  url=GLOBALS_hostpath+"masterdata/ProcessData.php?process_action=ReadFilter&datadefID=k8groupdefinitions&clause=creatorID="+userID;
  fetch(url).then(function (response){return response.text();})
  .then(function(text){
    let obj=JSON.parse(text);
    showgroups(settingsk8groups,obj);
    console.log(obj);
  }).catch(function (err) {
    console.warn('fetch error ', err);
  });
}else{
  showgroups(settingsk8groups,basicgroups_array);
}

function showgroups(settingsk8groups,basicgroups_array){
  $('#html1').html(settingsk8groups.html.lineedit['layout']);
  if(basicgroups_array.length>0)$('#groups').empty();
  var h3_cont=settingsk8groups.html.lineedit.container;

  settingsk8groups.masterdata.pagination='internal';
  settingsk8groups.masterdata.paginationsize=0;
  settingsk8groups.masterdata.defaultvalues=[];
  settingsk8groups.masterdata.defaultvalues[0]={};

  // 4 in 1 line
  let lastline=Math.floor(basicgroups_array.length/4)+1;
  let lastcount=(basicgroups_array.length/4-Math.floor(basicgroups_array.length/4))*4;
  let htmlelement='<div class="{{col}}" style="padding: 0 0"><div id="{{id}}"></div></div>';
  let el_main=document.querySelector('#groups');

  //#datadef#withcolor#
  for(let i=0;i<basicgroups_array.length;i++){
    let group=basicgroups_array[i];
    let id=group.type;
    let col="col-sm-3";
    let line=Math.floor(i/4)+1;
    if(line==lastline){
      if(lastcount==1){
        col="col-sm-12";
      }else if(lastcount==2){
        col="col-sm-6";
      }else if(lastcount==3){
        col="col-sm-4";
      }
    }
    // html ÄNDERN
    let html=htmlelement.replace('{{col}}',col);
    $(html.replace('{{id}}',id)).appendTo(el_main);
    let special=getfromArray(group,'special',0);
    settingsk8groups.withcolor=(special==1?true:false);
    settingsk8groups.masterdata.defaultvalues[0]['name']='type';
    settingsk8groups.masterdata.clause="type='"+group.type+"'";
    settingsk8groups.masterdata.defaultvalues[0]['value']=group.type;
    settingsk8groups.html.lineedit.container=h3_cont.replace('<h3>Units</h3>','<h3>'+getl(group.title)+'</h3>');
    catalog=$('#'+group.type).catalog(settingsk8groups);
  }
}
