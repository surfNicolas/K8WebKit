// k8componentsfilterbutton
settings=settingsk8componentsfilterbutton;
settingsk8componentsfilterbutton.masterdata.clause="creatorID="+userID;

let category=getfromArray(GET,'category');
let status=getfromArray(GET,'status');

let queryparams=JSON.parse(JSON.stringify(GET));
delete(queryparams.pageno);

//myhtml='<form class="js_filterform">';
let myhtml='<input type="hidden" name="status"><input type="hidden" name="category">';
myhtml+='<div class="js_category text-center">';
myhtml+='<a class="btn btn-secondary m-3" href="index.php?'+k8.obj2queryparameters($.extend({},queryparams,{"category":""}))+'">All</a>';
for(let i=0;i<item_group.length;i++){
  myhtml+='<a class="btn btn-secondary m-3" href="index.php?'+k8.obj2queryparameters($.extend({},queryparams,{"category":item_group[i].title}))+'">'+item_group[i].title+'</a>';
}
myhtml+='</div>';

status_group=[
  {"status":-1,"title":"All"},
  {"status":0,"title":"Prepared"},
  {"status":1,"title":"Published"},
  {"status":2,"title":"Closed"},
];
myhtml+='<div class="js_status text-center">';
myhtml+='<a class="btn btn-secondary m-3" href="index.php?'+k8.obj2queryparameters($.extend({},queryparams,{"status":status_group[0].status}))+'">'+status_group[0].title+'</a>';
myhtml+='<a class="btn btn-secondary m-3" href="index.php?'+k8.obj2queryparameters($.extend({},queryparams,{"status":status_group[1].status}))+'">'+status_group[1].title+'</a>';
myhtml+='<a class="btn btn-secondary m-3" href="index.php?'+k8.obj2queryparameters($.extend({},queryparams,{"status":status_group[2].status}))+'">'+status_group[2].title+'</a>';
myhtml+='<a class="btn btn-secondary m-3" href="index.php?'+k8.obj2queryparameters($.extend({},queryparams,{"status":status_group[3].status}))+'">'+status_group[3].title+'</a>';
myhtml+='</div>';
//myhtml+='</form>';
//settingsk8componentsfilterbutton.myhtml.catalog.filterform=myhtml;

k8.datadefAddSearchFilterForm(settingsk8componentsfilterbutton);
window.addEventListener("load", (event) => {
  //let  category=getfromArray(GET,'category','All');
  //let el=$('.js_filterform a:contains("'+category+'")')[0];
  let el_form=$('.js_filterform')[0];
  $(myhtml).appendTo(el_form);
  let status=getfromArray(GET,'status',-1);
  if(status>=-1 && status<=2){
    let el=$('.js_filterform .js_status a:contains("'+status_group[status+1].title+'")')[0];
    el.classList.add('active');
    el_form.elements.namedItem('status').value=status;
  }
  let category=getfromArray(GET,'category');
  if(gbnull(category)){
      let el=$('.js_filterform .js_category a:contains("All")')[0];
      el.classList.add('active');
  }else{
    let item_index=getArrayIndexfromValue(item_group,'title',category)
    if(item_index>=0){
      let el=$('.js_filterform .js_category a:contains("'+item_group[item_index].title+'")')[0];
      el.classList.add('active');
    }
  }
  el_form.elements.namedItem('category').value=category;
});


settingsk8componentsfilterbutton.masterdata.cbcatLoad=function(options){
  let el_rec_record=options.el_rec_record;
  let dat=options.dat;
  let el_status=el_rec_record.querySelector('.js_status');
  let arr_status_color=['bg-warning','bg-success','bg-danger'];
  let arr_status_text=[getl('prepared'),getl('published'),getl('closed')];
  let myclass=arr_status_color[dat['status']];
  el_status.classList.add(myclass);
  el_status.innerHTML=arr_status_text[dat['status']];
}; 

// for the detail button
settings.masterdata.cbcatAfterLoadAll=function(options){
  var el_list=options.el_list;
  var data=options.data;
  $(el_list).on("click",".js_mybtn",function(e){
    var el_rec_record=$(e.target).parents('.js_rec_record')[0];
    var index=Number(el_rec_record.dataset.rec_index);
    var dat=data[index];
    //console.log(dat);
    localStorage.setItem("catalog_datadefID", settings.datadefID);
    if(settings.displaycolumn){
      let displayvalue=dat[settings.displaycolumn]
      window.location=settings.masterdata.url_detail+"&displayvalue="+displayvalue+((settings.datadefID==-1) ? "&headtitlecolumn="+settings.headtitlecolumn+"&headdescriptioncolumn="+settings.headdescriptioncolumn :"");
    }else{
      let keyvalue=dat[settings.key]
      window.location=settings.masterdata.url_detail+"&keyvalue="+keyvalue+((settings.datadefID==-1) ? "&headtitlecolumn="+settings.headtitlecolumn+"&headdescriptioncolumn="+settings.headdescriptioncolumn :"");
    }
  });
}