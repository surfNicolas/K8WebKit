/* set by datadefAddtinymce
settingsk8components.masterdata.cbCreateStructure=[];
settingsk8components.masterdata.cbBeforeNew=[];
settingsk8components.masterdata.cbBeforeLoad=[];
settingsk8components.masterdata.cbBeforeLoad=[];
settingsk8components.masterdata.cbAfterLoad=[];
settingsk8components.masterdata.upload.settings.dataAfterUpload=tinymceInitinline;
*/
k8.datadefAddtinymce(settingsk8components);

settingsk8components.masterdata.cbBeforeNew.push(function(options){
  var el_md=options.el_md;
  var dat=options.dat;
  setRequired(el_md,dat['status']>0);
});
settingsk8components.masterdata.cbBeforeLoad.push(function(options){
  var el_md=options.el_md;
  var dat=options.dat;
  setRequired(el_md,dat['status']>0);
});

settingsk8components.masterdata.cbChange=function(options){
  var el_md=options.el_md;
  var el=options.el;
  var dat=options.dat;
  if(el.name=="status"){
    setRequired(el_md,dat['status']>0);
  }
}

if(page=='masterdata'){
  console.log(grouparray);

  var values_array=getArrayValuesfromArrayObjects(grouparray,"title");

  // tabulator
  values_array_tab=values_array.slice()
  values_array_tab.unshift("");
  var index_category=getArrayIndexfromValue(settings.tabulator.columns,"field","category");
  var o=settings.tabulator.columns[index_category];
  if(o){
    o=Object.assign(o,{"headerFilter":"list","headerFilterFunc":"=","headerFilterParams":{"values":values_array_tab}});
  }

  // k8form
  /*
  values_array.unshift("");
  var k8form=Object.create(k8);
  k8form.initFormfields(settings.k8form);
  settings.k8form.formcollection['category'].options=values_array;
  */
}