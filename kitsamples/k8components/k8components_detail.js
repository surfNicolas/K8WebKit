/*
$(document).ready(function(){
  $('#html1').on("click",".js_mybtn",function(e){
    var el_rec_record=$(e.target).parents('.js_rec_record')[0];
    var index=Number(el_rec_record.dataset.rec_index);
    var dat=catalog.getData()[index];
    console.log("index="+index);
    console.log(dat);
    alert('Your progamm starts here! Please, look to the console.');
  });
});
*/

settingsk8components.masterdata.cbcatAfterLoadAll=function(options){
  var el_list=options.el_list;
  var data=options.data;
  $(el_list).on("click",".js_mybtn",function(e){
    var el_rec_record=$(e.target).parents('.js_rec_record')[0];
    var index=Number(el_rec_record.dataset.rec_index);
    var dat=data[index];
    console.log(dat);
    alert('Your progamm starts here! Please, look to the console.');
  });
}
