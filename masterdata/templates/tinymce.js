// 2022-11-26
//  datadefinition: "head":["<script src='{{root}}tinymce/tinymce.js'></script>"],
//  selector: "textarea.tinymce",
var image_list="";
var baseID=0;
var basetype=settings.table;
var field_baseID=settings.key;
var path='../'.repeat(GLOBALS_script_depth);

settings.masterdata.cbCreateStructure=function(options){
  var settings=options.settings;
  var notabulator=getfromArray(settings.masterdata,'notabulator',false);
  if(!notabulator){
    tinymceInit(image_list);
    if(tinymce.activeEditor)tinymce.activeEditor.setContent("");
  }
};
settings.masterdata.cbBeforeLoad=function(options){
    tinymce.remove();
};
settings.masterdata.cbAfterLoad=function(options){
    var el_md=options.el_md;
    var dat=options.dat;
    tinymce.remove();
    baseID=getfromArray(dat,field_baseID,0);
    image_list=path+"masterdata/ProcessMethod.php?process_action=tinymce_images&basetype="+basetype+"&baseID="+baseID;
    var disabled=!Number(getfromArray(dat,'rightuser_update',false));
    tinymceInit(image_list,disabled);
};
settings.masterdata.cbBeforeNew=function(options){
    tinymce.remove();
};
settings.masterdata.cbAfterNew=function(options){
    tinymceInit("");
};

if(settings.masterdata.upload){
  if(!isset(settings.masterdata.upload,"settings"))settings.masterdata.upload.settings={};
  settings.masterdata.upload.settings.dataAfterUpload=function(){
    if(tinymce)tinymce.remove();
    var el_form=$('.js_dataform')[0];
    baseID=el_form.elements.namedItem(field_baseID).value;
    image_list=path+"masterdata/ProcessMethod.php?process_action=tinymce_images&basetype="+basetype+"&baseID="+baseID;
    tinymceInit(image_list);
  }
}

function tinymceInit(image_list,readonly){
  readonly= typeof readonly !== 'undefined' ? readonly : false;
  //$('#tinymce').attr('disabled',false);
  var options={
      selector: "textarea.tinymce", 
      height: '300px',
      image_dimensions: false,
      image_class_list: [
        {title: 'no class', value: ''},
        {title: 'Standard 600px', value: 'img-fluid d-block mx-auto img-responsive k8-max-wdith-600 center-block k8-margin-top-6 k8-margin-bottom-6'},
        {title: 'width 100%', value: 'img-fluid img-responsive k8-margin-top-6 k8-margin-bottom-6'}],
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste imagetools wordcount'
        /*,'fullpage'*/
      ],
      force_p_newlines: false,
      forced_root_block:"",
      relative_urls : true,
      images_base_path: 'uploads',
      toolbar: "bullist | numlist | bold | italic | underline | alignleft | aligncenter | alignjustify | alignright | link image",
      setup: function (editor) {
          editor.on('change', function () {
              editor.save();
              masterdata.setDirty(true);
          });
      },
      valid_elements:'*[*]',
      content_style: "img{max-width: 600px; display: block; margin-left: auto; margin-right: auto; width: 50%;}",
      content_css: "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css",

  };
  if(!gbnull(image_list))options.image_list=image_list;
  if(readonly){
    options.readonly=true;
  }
  tinymce.init(options);
}

// Prevent bootstrap dialog from blocking focusin
document.addEventListener('focusin', function(e) {
    if (e.target.closest(".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root") !== null) {
		e.stopImmediatePropagation();
	}
});