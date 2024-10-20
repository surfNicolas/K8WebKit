settingsk8components.masterdata.cbBeforeSave=function(options){
  var el_md=options.el_md;
  var dat=options.dat;
  var el_form=$(el_md).find('.js_dataform')[0];
  var bmissing=false;
  var el_focused;
  var count=1;
  $(el_form).find('.k8-border-red').removeClass('k8-border-red');

  setRequired(el_md,dat['status']>0);
  if(dat['status']>0){
    /*
    if(gbnull(dat['text1'])){
      var el=el_form.elements.namedItem("text1");
      if(!el_focused)el_focused=el;
      $(el).addClass('k8-border-red');
      bmissing=true;
    }
    if(gbnull(dat['textdimensions'])){
      var el=el_form.elements.namedItem("textdimensions");
      if(!el_focused)el_focused=el;
      $(el).addClass('k8-border-red');
      bmissing=true;
    }
    */
    if(gbnull(dat['descriptionlong'])){
      tinyMCE.activeEditor.focus();
      $('.js_dataform .tox-sidebar-wrap').addClass('k8-border-red');
      bmissing=true;
    }
    count=$(el_md).find('.k8-images .js_rec_record').length;
  }
  if(bmissing){
    masterdata.message("fill out the missing fields 1st!","alert");
  }else if(count==0){
    masterdata.message("upload images 1st!","alert");
  }
  if(el_focused)el_focused.focus();
  return (bmissing || (count==0));
};

function setRequired(el_md,brequired){
  if(el_md){
    var el_form=el_md.getElementsByClassName('js_dataform')[0];
    //var el_text1=el_form.elements.namedItem("text1");
    if(el_form){
      var el_textdimensions=el_form.elements.namedItem("textdimensions");
      //el_text1.required=brequired;
      el_textdimensions.required=brequired;
    }
  }
}