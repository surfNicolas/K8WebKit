/*
settingsk8pagesaos.masterdata.cbcatAfterLoadAll=function(options){
  let aos_array=["fade-right","fade-up","fade-left"];
  let col_aos= $('.selector2 [data-aos]');
  console.log("col_aos.length="+col_aos.length);
  for(let i=0;i<col_aos.length;i++){
    col_aos[i].dataset['aos']=aos_array[i];
  }
  
  $(document).ready(function() {
    AOS.init({
      offset: 100, duration:700, easing:"ease",anchorPlacement: 'top-center'
    });
  });
}
*/

$(document).ready(function(){
  //$('#layout0').addClass('k8-bg-stripes');
  //$('#layout0').find('.js_rec_record').addClass('k8-bg-stripes');
});

let object_datadefID='k8pagesaos';
let elementtype=page;
let objectvariable;
if(site){
  for(let i=0;i<site.elements.length;i++){
    if(site.elements[i].datadefID==object_datadefID){
      elementtype=getfromArray(site.elements[i],'page');
      let alias=getfromArray(site.elements[i],'alias',false);
      if(alias){
        objectvariable="settings"+object_datadefID+i;
      }else{
        objectvariable="settings"+object_datadefID;
      }
      if(elementtype=='catalog' || elementtype=='catext'){
        datadefAdd_catalog(window[objectvariable]);
      }else if(elementtype=='caticon'){
        datadefAdd_caticon(window[objectvariable]);
      }
    }
  }
}else{
  if(elementtype=='catalog'){
    datadefAdd_catalog(settingsk8pagesaos);
  }else if(elementtype=='caticon'){
    datadefAdd_caticon(settingsk8pagesaos);
  }
}

function datadefAdd_caticon(settings){
  settings.masterdata.cbcatAfterLoadAll=function(options){
    let aos_array=[200,400,600,800];
    let col_aos= $('.k8-k8pagesaos-catalog .js_rec_record[data-aos-delay]');
    console.log("col_aos.length="+col_aos.length);
    if(col_aos.length>0){
      for(let i=0;i<col_aos.length;i++){
        col_aos[i].dataset['aosDelay']=aos_array[i];
      }
    }    
  }
}

function datadefAdd_catalog(settings){
  settings.masterdata.cbcatAfterLoadAll=function(options){
    let aos_array=["fade-right","fade-up","fade-left"];
    let col_aos= $('.k8-k8pagesaos-catalog .js_rec_record[data-aos]');
    //console.log("col_aos.length="+col_aos.length);
    if(col_aos.length>0){
      for(let i=0;i<col_aos.length;i++){
        col_aos[i].dataset['aos']=aos_array[i];
      }
    }    
  }
}