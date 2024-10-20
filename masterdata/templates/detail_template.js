// please don't link it!
// copy it to your datadefinition JavaScript file

settings.masterdata.cbcatAfterLoadAll=function(options){
  var el_list=options.el_list;
  var data=options.data;
  $(el_list).on("click",".js_mybtn",function(e){
    var el_rec_record=$(e.target).parents('.js_rec_record')[0];
    var index=Number(el_rec_record.dataset.rec_index);
    var dat=data[index];
    console.log(dat);
    alert('please look to the console');
  });
}