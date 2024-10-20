let editor = 0;
// catalog

settings.masterdata.cbAfterNew=[
function(options){
  var el_md=options.el_md;
  showDatadef(el_md,{'mytable':'','mydatadefID':''},false);
  disabledatadefID(options.el_form,{});
}];
settings.masterdata.cbAfterLoad=[
function(options){
  var settings=options.settings;
  var el_md=options.el_md;dat=options.dat;
  disabledatadefID(options.el_form,dat);
  showDatadef(el_md,dat,Number(dat.rightuser_update));
}];
settings.masterdata.cbAfterSave=[
function(options){
  var settings=options.settings;
  var el_md=options.el_md;dat=options.dat;
  disabledatadefID(options.el_form,dat);
  showDatadef(el_md,dat,Number(dat.rightuser_update));
}];

function showDatadef(el_md,dat,rightuser_update){
  rightuser_update=typeof rightuser_update=="undefined" ? false :  rightuser_update;
  let mydatadefID=dat.mydatadefID;
  let mytable=dat.mytable;
  let mydatadefIDdisp=gbnull(mydatadefID)?'no datadefID':mydatadefID;
  let mytabledisp=gbnull(mytable)?'no table':mytable;
  var el_main=el_md.parentElement;
  var subclass="mx-n3 masterdata";
  if(el_main.classList.contains('container'))subclass="mx-n3 mb-3 masterdata";
  
  // ------------------------------------------------ display table
  let index="1";
  var el=$('#html-sub'+index)[0];
  var html='<div id="html-sub'+index+'" class="mt-3 '+subclass+'"></div>';
  if(el){
    $(el).replaceWith(html)
  }else{
    $(el_main).append(html);
  }
  let selector='#html-sub'+index;
  //$(selector).html('<h2>Table: '+mytabledisp+'</h2><div id="tableTab" class="mb-2"></div><button id="save_table">Save table</button>  <button id="create_datadefID">Create datadefID</button><br>');
  $(selector).html(settings.html.layout.table);
  $('#html-sub1 .js_title').html('Table: '+mytabledisp);
  let el_form=$(selector)[0].querySelector('form');

  k8.formDirtycontrol({el_form:el_form});
  
  //var tableTab = new Tabulator("#tableTab", {
  otable={
    "tabulator":{
      height:"311px",
      movableRows: true,
      columns:[
        {title:"Name", field:"Field",editor:"input", Xvalidator:"alphanumeric",
          cellEdited:function(cell){
            //console.log('edited');
          }
        },
        {title:"Type", field:"mytype",editor:"list",
          editorParams:{
            values:["TINYINT","SMALLINT","MEDIUMINT","INT","BIGINT","BIT","FLOAT","DOUBLE","DECIMAL","CHAR","VARCHAR","TINYTEXT","TEXT","MEDIUMTEXT","LONGTEXT","DATE","TIME","YEAR","DATETIME","TIMESTAMP"]  
          },
          cellEdited:function(cell){
            let row=cell.getRow();
            let dat=cell.getRow().getData();
            let size=getfromArray(dat,'size');
            if(dat.mytype=="VARCHAR" && gbnull(size)){
              row.update({size:50});
            }
          }
        },
        {title:"Size", field:"size",editor:"input",
          validator:[{
            type:function(cell,value,parameters){
              //console.log(value);
              let bok=true;
              let dat=cell.getRow().getData();
              let mytype=getfromArray(dat,'mytype');
              switch (mytype){
                case 'DECIMAL':
                  let error='please wrtite it like this: 5,2'
                  let arr=value.split(',');
                  if(arr.length==2){
                    if(gbnull(arr[0])){
                      bok=false;
                    }else{
                      bok=!isNaN(arr[0]);
                    }
                    if(gbnull(arr[1])){
                      bok=false;
                    }else{
                      bok=!isNaN(arr[1]);
                    }
                  }else{
                    bok=false;
                  }
                  if(!bok)k8.message(error,'alert');
                  break;
                case 'CHAR':
                case 'VARCHAR':
                  if(gbnull(value)){
                    bok=false;
                  }else{
                    bok=!isNaN(value);
                  }
                  break;    
              }
              return bok;
            }
            }]
        },
        {title:"Extra", field:"Extra",editor:false},
      ]
    },
    "masterdata":{
      tabulatorwrapper:false,
      tabulatoreditajax:false,
      tabulatorform:el_form
    }
  };
  k8.datadefAddlistedit(otable);
  let tableTab=k8.displaytabulator("#tableTab",otable);
  if(false){
    // empty
  }else if(gbnull(dat.mytable)){
    // New
  }else{
    let url=GLOBALS_hostpath+"masterdata/ProcessMethod.php?process_action=readtable";
    url=url+'&table='+dat.mytable;
    fetch(url).then(function (response){return response.text();})
    .then(function(text){
      let obj=JSON.parse(text);
      //console.log(obj);
      if(obj.bok){
        // display table
        tableTab.setData(obj.data);
      }else{
        let data_table=[];
        data_table.push({"Field":"ID","mytype":"INT","size":"11","Extra":"AUTO_INCREMENT"});
        data_table.push({"Field":"mytext","mytype":"VARCHAR","size":"50","Extra":""});
        data_table.push({"Field":"mynumber","mytype":"DOUBLE","size":"50","Extra":""});
        data_table.push({"Field":"creatorID","mytype":"INT","size":"11","Extra":""});
        tableTab.setData(data_table);
        k8.formDirtymanual({el_form:el_form});
      }
    }).catch(function (err) {
      console.warn('fetch error ', err);
    });
  }

  let el_savetable=document.getElementById('save_table');
  if(!rightuser_update)el_savetable.disabled=true;
  el_savetable.addEventListener('click',function(){
    //console.log('createtable');
    let data_table=tableTab.getData();
    
    // auto increment prüfen
    let error='';
    let array_with_size=["CHAR","VARCHAR","DECIMAL"];
    for(let i=0;i<data_table.length;i++){
      let dat=data_table[i];
      dat.Field=getfromArray(dat,'Field');
      dat.mytype=getfromArray(dat,'mytype');
      dat.size=getfromArray(dat,'size');
      dat.Extra=getfromArray(dat,'Extra');
      if(gbnull(dat.Field)){
        k8.message('line '+i+', please remove lines without "Name"','alert');
        return;
      }
      if(gbnull(dat.mytype)){
        k8.message('line '+i+', please add missing "Type"','alert');
        return;
      }
      if(array_with_size.includes(dat.mytype) && gbnull(dat.size)){
        k8.message('line '+i+', please add missing "Size"','alert');
        return;
      }
    }
    
    let url=GLOBALS_hostpath+"masterdata/ProcessMethod.php?process_action=savetable&table="+mytable;
    postData(url,{columns:data_table}).then((obj) => {
      //console.log(obj);
      if(obj.bok){
        k8.message(getl("executed"),'saved');
      }else{
        k8.message(obj.error,'alert');
      }
    });
  });

  let el_createdatadefID=document.getElementById("create_datadefID");
  if(!rightuser_update)el_createdatadefID.disabled=true;
  el_createdatadefID.addEventListener('click',function(){
    //console.log('createdatadefID');
    let url=GLOBALS_hostpath+"masterdata/ProcessMethod.php?process_action=createdatadefID";
    url=url+'&table='+mytable+'&datadefID='+mydatadefID+'&name='+dat.name;
    if(!gbnull(dat.myheadtitlecolumn)){
      url=url+'&headtitlecolumn='+dat.myheadtitlecolumn+'&headdescriptioncolumn='+dat.myheaddescriptioncolumn;
    }
    fetch(url).then(function (response){return response.text();})
    .then(function(text){
      let obj=JSON.parse(text);
      //console.log(obj);
      if(obj.bok){
        //editor.setValue(obj.file);
        k8.message('created','saved');
        manageFolder(el_formfolder,mydatadefID);
      }else{
        k8.message(obj.error,'alert');
      }
    }).catch(function (err) {
      //console.warn('fetch error ', err);
    });
  });
  
  // -------------------------------------------------- display folder
  index="2";
  var el=$('#html-sub'+index)[0];
  var html='<div id="html-sub'+index+'" class="'+subclass+'"></div>';
  if(el){
    $(el).replaceWith(html)
  }else{
    $(el_main).append(html);
  }
  let selector2='#html-sub'+index;
  $(selector2).html(settings.html.layout.folder);
  $('#html-sub2 .js_title').html('Folder: '+mydatadefIDdisp);
  
  let el_formfolder=$(selector2)[0].querySelector('form');
  k8.formDirtycontrol({el_form:el_formfolder});
  if(!gbnull(mydatadefID)){
    manageFolder(el_formfolder,mydatadefID);
  }
  
  let el_copy=document.querySelector(".js_copy");
  if(!rightuser_update)el_copy.disabled=true;
  el_copy.addEventListener('click',function(){
    let el_copyText=document.getElementById("texteditor");
    el_copyText.select();
    el_copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
  });
  
  let el_file_new=document.getElementById("file_new");
  if(!rightuser_update)el_file_new.disabled=true;
  el_file_new.addEventListener('click',function(){
    let el_filename=document.getElementById("filename");
    el_filename.value='';
    el_filename.disabled=false;
    el_filename.focus();
    
    let el_texteditor=document.getElementById("texteditor");
    el_texteditor.value="";
    
    initCodeMirror(el_texteditor,"");
  });  
  
  let el_save=document.getElementById("save");
  if(!rightuser_update)el_save.disabled=true;
  el_save.addEventListener('click',function(){
    //console.log('save');
    
    let text=editor.getValue();
    //let el_texteditor=document.getElementById("texteditor");
    //let text=el_texteditor.value;

    let el_filename=document.getElementById('filename');
    let ending='';
    let error="";
    
    if(gbnull(el_filename.value)){
      error='no filename','alert';
    }

    if(gbnull(error)){
      let arr=el_filename.value.split('.');
      if(arr.length>0){
        ending=arr[arr.length-1];
      }
      if(ending.toUpperCase()=='JSON'){
        // check json
        if(!gbnull(text)){
          try{
            let obj=JSON.parse(text);
          }
          catch(e){
            error="error in JSON";
          }
        }
      }
    }    
    
    if(!gbnull(error)){
      k8.message(error,'alert');
    }else{
      let url=GLOBALS_hostpath+"masterdata/ProcessMethod.php?process_action=saveFile&file="+mydatadefID+'/'+el_filename.value;
      dat={'content':text};
      postData(url,dat).then((obj) => {
        //console.log(obj);
        if(obj.bok){
          k8.message(getl("saved"),'saved');
          // if new
          if(el_filename.disabled==false){
            let dat_file={'folder':mydatadefID,'filename':el_filename.value};
            catalog.insertRecord(dat_file,'','last');
          }
        }else{
          k8.message(obj.error,'alert');
        }
      });
    }
  });  
  
  // -------------------------------------- Preview
  index="3";
  var el=$('#html-sub'+index)[0];
  var html='<div id="html-sub'+index+'" class="'+subclass+'"></div>';
  if(el){
    $(el).replaceWith(html)
  }else{
    $(el_main).append(html);
  }
  
  let selector3='#html-sub'+index;
  $(selector3).html(settings.html.layout.preview);
  $('#html-sub3 .js_title').html('Preview: '+mydatadefIDdisp);
  
  let el_chooseelement=document.getElementById("choose_element");
  let el_url=document.getElementById("url");
  let el_documentation=document.getElementById("documentation");
  let el_hint=document.getElementById("hint");
  let el_open=document.getElementById("open");
  if(el_chooseelement.selectedIndex==-1){
    el_documentation.style.visibility="hidden";
  }else{
    el_documentation.style.visibility="inherit";
  }
  let arr_options=[
    {'text':'masterdata',"helpurl":GLOBALS_hostpath+GLOBALS_indexfile+"?page=doc_masterdata"},
    {'text':'list',"helpurl":GLOBALS_hostpath+GLOBALS_indexfile+"?page=doc_filterform"},
    {'text':'treeview',"helpurl":GLOBALS_hostpath+GLOBALS_indexfile+"?page=doc_treeview","hint":
      'necessary columns in the table:\n'+
      ' parentID,\n'+
      ' sort,\n'+
      'please insert this lines in the datadefinition:\n'+
      ' "parentcolumn":"parentID",\n'+
      ' "treearrayname":"_children",\n'+
      'please change the parentID in k8form to hidden:\n'+
      ' "type":"hidden"\n'
    },
    {'text':'listedit',"helpurl":GLOBALS_hostpath+GLOBALS_indexfile+"?page=doc_listedit","hint":"not ready yet! only for watching"},
    {'text':'form',"helpurl":GLOBALS_hostpath+GLOBALS_indexfile+"?page=doc_form"},
    {'text':'simpledata',"helpurl":GLOBALS_hostpath+GLOBALS_indexfile+"?page=doc_datalistform"},
    {'text':'catalog',"helpurl":GLOBALS_hostpath+GLOBALS_indexfile+"?page=doc_catalog"},
    {'text':'detail',"helpurl":GLOBALS_hostpath+GLOBALS_indexfile+"?page=doc_detail","hint":"url: enter keyvalue or displayvalue when displaycolumn is set in data defintion."},
    {'text':'lineedit',"helpurl":GLOBALS_hostpath+GLOBALS_indexfile+"?page=doc_lineedit"},
    {'text':'chartjs',"helpurl":GLOBALS_hostpath+GLOBALS_indexfile+"?page=detail&datadefID=k8pages&displayvalue=doc_chartjs","hint":
      'please insert this lines in the datadefinition:\n'+
      '"head":["<script src=\\"{{root}}js/chart.js\\"></script>"],\n'
    }
  ]
  for(let i=0;i<arr_options.length;i++){
    let option=arr_options[i];
    let el_option=document.createElement('option');
    el_option.text=option.text;
    el_chooseelement.appendChild(el_option);
  }

  el_url.addEventListener('change',function(e){
    urlDetailCheck(el_url,el_open)
  });

  el_chooseelement.addEventListener('change',function(){
    el_url.value=GLOBALS_hostpath+GLOBALS_indexfile+'index.php?page='+el_chooseelement.value+'&datadefID='+mydatadefID;
    el_url.value=build_href({"href":'page='+el_chooseelement.value+'&datadefID='+mydatadefID});
    if(el_chooseelement.selectedIndex==-1){
      el_documentation.style.visibility="hidden";
    }else{
      let element=arr_options[el_chooseelement.selectedIndex].text;
      el_documentation.style.visibility="inherit";
      el_documentation.href=arr_options[el_chooseelement.selectedIndex].helpurl;
      el_documentation.innerHTML=arr_options[el_chooseelement.selectedIndex].text;
      el_hint.value=getfromArray(arr_options[el_chooseelement.selectedIndex],'hint');
      el_open.disabled=true;
      if(!gbnull(mydatadefID)){
        let url=GLOBALS_hostpath+"masterdata/ProcessMethod.php?process_action=checkDefinition";
        url=url+'&element='+element+'&datadefID='+mydatadefID;
        fetch(url).then(function (response){return response.text();})
        .then(function(text){
          let obj=JSON.parse(text);
          //console.log(obj);
          if(obj.bok){
            if(el_documentation.innerHTML=='detail'){
              urlDetailCheck(el_url,el_open);
            }else{
              el_open.disabled=false;
            }
          }else{
            k8.message(obj.error,'alert');
          }
        }).catch(function (err) {
          console.warn('fetch error ', err);
        });
      }
    }
  });  
  el_open.addEventListener('click',function(e){
    e.preventDefault();
    //console.log('open');
    var url=el_url.value;
    var parameter="width="+window.innerWidth.toString()+",height="+window.innerHeight.toString()+",resizable=yes,scrollbars=yes";
    parameter="top="+(window.screenY).toString()+",left="+(window.screenX).toString()+","+parameter;
    //var w = window.open(url,'Edit', parameter);
    //var w = window.open(url,'Test','noopener');
    var w = window.open(url,'Test');
    if(w)w.focus();
  });
}

function urlDetailCheck(el_url,el_open){
  let keyvalue=k8.getQueryParameter(el_url.value,'keyvalue');
  let displayvalue=k8.getQueryParameter(el_url.value,'displayvalue');
  el_open.disabled=(gbnull(keyvalue) && gbnull(displayvalue));
}

function manageFolder(el_formfolder,mydatadefID){
    let el_texteditor=document.getElementById("texteditor");
    initCodeMirror(el_texteditor,"");

    let url=GLOBALS_hostpath+"masterdata/ProcessMethod.php?process_action=readFolder&folder="+mydatadefID;
    fetch(url).then(function (response){return response.text();})
    .then(function(text){
      let obj=JSON.parse(text);
      //console.log(obj);
      if(obj.bok){
        var settingsfolder={
          "data":obj.data,
          "masterdata":{
              "edittype":10,
              "htmlout":"catalog",
              "cbcatDelete":function(options){  // edittype=10
                var dat=options.dat;
                let data=options.data;
                let index=options.index;
                let el_record=options.el_rec_record;
                let url=GLOBALS_hostpath+"masterdata/ProcessMethod.php?process_action=deleteFile&file="+dat.folder+'/'+dat.filename;
                fetch(url).then(function (response){return response.text();})
                .then(function(text){
                  let obj=JSON.parse(text);
                  if(obj.bok){
                    el_record.remove();
                    delete data[index];

                    let el_filename=document.getElementById('filename');
                    el_filename.value="";
                    let el_texteditor=document.getElementById("texteditor");
                    el_texteditor.value="";
                    initCodeMirror(el_texteditor,"");
                  }else{
                    console.log('bok:false');
                  }
                }).catch(function (err) {
                  console.warn('fetch error ', err);
                });
              },
              "cbcatEdit":function(options){  // edittype=10
                var dat=options.dat;
                let filename=dat.filename;
                let url=GLOBALS_hostpath+"masterdata/ProcessMethod.php?process_action=readFile&file="+dat.folder+'/'+dat.filename;
                fetch(url).then(function (response){return response.text();})
                .then(function(text){
                  let obj=JSON.parse(text);
                  //console.log(obj);
                  if(obj.bok){
                    let el_filename=document.getElementById("filename");
                    el_filename.value=filename;
                    el_filename.disabled=true;
                    el_texteditor.value=obj.file;

                    if(el_filename.value.toUpperCase().endsWith('.JSON')){
                      let el_jsonlint=document.querySelector(".js_jsonlint");
                      //el_jsonlint.href='https://jsonlint.com/?json='+encodeURI(obj.file);
                      //el_jsonlint.href='https://jsonlint.com/?json='+encodeURI('{"a":"b"}');
                    }
                    initCodeMirror(el_texteditor,obj.file);
                    k8.formDirtymanual({el_form:el_formfolder,dirty:false});

                  }
                }).catch(function (err) {
                  console.warn('fetch error ', err);
                });
              }
          },
          "html":{
              "catalog":{
                  "container":"<div class=\"js_rec_container\"><div class=\"js_rec_records\"</div></div>",
                  "record":"<div class=\"js_rec_record\" style=\"overflow: hidden;white-space: nowrap;text-overflow: ellipsis\" data-keyvalue=\"{{keyvalue}}\">{{control_delete}}&nbsp;&nbsp;{{control_edit}}&nbsp;&nbsp;<span>{{filename}}</span></div>"
              }
          }
        };
        catalog=$('#folder').catalog(settingsfolder);
      }else{
        // folder empty  k8.message(obj.error,'alert');
      }
    }).catch(function (err) {
      console.warn('fetch error ', err);
    });
}
function disabledatadefID(el_form,dat){
  let ID=getfromArray(dat,'ID');
  el_form.elements.namedItem('mydatadefID').disabled=!gbnull(ID);
  el_form.elements.namedItem('mytable').disabled=!gbnull(ID);
};

function initCodeMirror(el_texteditor,content){
  if(el_texteditor){
    let mode="text/javascript";
    let el_form=el_texteditor.form;
    el_filename=el_form.elements.namedItem('filename');
    let arr=el_filename.value.split('.');
    let filetype="html";
    if(arr.length>1)filetype=arr[1];
    switch(filetype){
      case "html":
        mode="text/html";
        break;
      case "css":
        mode="text/css";
        break;
    }

    if(editor){
      editor.getWrapperElement().remove();
    }
    //if(editor){
    if(false){
      editor.setValue(content);
    }else{
      editor = CodeMirror.fromTextArea(el_texteditor, {
        lineNumbers: true,
        lineWrapping: true,
        mode: mode,
        tabSize:2
      });
      //mode: "application/json"
      editor.setSize("100%", "354px");
      editor.setValue(content);
      editor.on('changes', (cm, change) => {
        console.log('codemirror change');
        document.getElementById("texteditor").value=editor.getValue();
        k8.formDirtymanual({"el_form":el_form,"dirty":true});
      });
   }
  }
}