// 2022-11-26

if(page=="catalog"){
  //uncomment it for a filterform
  //settingsnewspages.masterdata.search_internal=true;
  //k8.datadefAddSearchFilterForm(settingsnewspages);
}else{
  settingsnewspages.masterdata.htag='h2';
}

var image_list="";
var baseID=0;
var basetype=settingsnewspages.table;
var field_baseID=settingsnewspages.key;
var path='../'.repeat(GLOBALS_script_depth);

/*
settingsnewspages.masterdata.cbcatAfterLoadAll=function(options){
  var el_list=options.el_list;
  var el_sidebar=el_list.getElementsByClassName('js_sidebar')[0];
  settingsnewspages.masterdata.data_readfilter.mytable_offset=0;
  settingsnewspages.masterdata.data_readfilter.mytable_limit=2;
  settingsnewspages.masterdata.htmlout="catalog";
  delete(settingsnewspages.data);
  $(el_sidebar).catalog(settingsnewspages);
};
*/

settingsnewspages.masterdata.cbcatLoad=[
  function(options){
    var settings=options.settings;
    var dat=options.dat;
    var el_rec_record=options.el_rec_record;
    var el_detaillink=el_rec_record.getElementsByClassName("js_detaillink")[0];
    var keyvalue=getfromArray(dat,settings.key,0);
    if(el_detaillink){
    if(GLOBALS_urlmode==1){
      el_detaillink.href=build_href({"href":settings.masterdata.url_detail})+"/"+getfromArray(dat,settings.displaycolumn);
    }else{
      el_detaillink.href=settings.masterdata.url_detail+"&keyvalue="+keyvalue;
    }        
    }else{
      console.log("missing js_detaillink")
    }
  }
]

settingsnewspages.masterdata.cbCreateStructure=function(options){
  var settings=options.settings;
  if(!settings.masterdata.notabulator){
    tinymceInit(image_list);
    if(tinymce.activeEditor)tinymce.activeEditor.setContent("");
  }
};
settingsnewspages.masterdata.cbBeforeLoad=function(options){
    tinymce.remove();
};
settingsnewspages.masterdata.cbAfterLoad=function(options){
    var el_md=options.el_md;
    var dat=options.dat;
    tinymce.remove();
    baseID=getfromArray(dat,field_baseID,0);
    image_list=path+"masterdata/ProcessMethod.php?process_action=tinymce_images&basetype="+basetype+"&baseID="+baseID;
    var disabled=!Number(getfromArray(dat,'rightuser_update',false));
    tinymceInit(image_list,disabled);
};
settingsnewspages.masterdata.cbBeforeNew=function(options){
    tinymce.remove();
};
settingsnewspages.masterdata.cbAfterNew=function(options){
    tinymceInit("");
};

if(!isset(settingsnewspages.masterdata,"upload"))settingsnewspages.masterdata.upload={};
if(!isset(settingsnewspages.masterdata.upload,"settings"))settingsnewspages.masterdata.upload.settings={};
settingsnewspages.masterdata.upload.settings.dataAfterUpload=tinymceInitinline;

function tinymceInitinline(){
  if(tinymce)tinymce.remove();
  var el_form=$('.js_dataform')[0];
  baseID=el_form.elements.namedItem(field_baseID).value;
  image_list=path+"masterdata/ProcessMethod.php?process_action=tinymce_images&basetype="+basetype+"&baseID="+baseID;
  tinymceInit(image_list);
}

function tinymceInit(image_list,readonly){
  readonly= typeof readonly !== 'undefined' ? readonly : false;
  //$('#tinymce').attr('disabled',false);
  var options={
      selector: "textarea.tinymce", 
      height: '300px',
      image_dimensions: false,
      image_class_list: [{title: 'Standard', value: 'img-fluid d-block mx-auto img-responsive center-block k8-margin-top-6 k8-margin-bottom-6'}],
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste imagetools wordcount'
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
      content_style: "img{display: block; margin-left: auto; margin-right: auto; width: 50%;}"
  };
  if(GLOBALS_urlmode==1){
    options.relative_urls=false;
    options.remove_script_host=false;
    options.convert_urls=true;
    delete(options.images_base_path);
  }
  if(!gbnull(image_list))options.image_list=image_list;
  if(readonly){
    options.readonly=true;
  }
  tinymce.init(options);
}