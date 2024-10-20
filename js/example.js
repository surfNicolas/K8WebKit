// 01.09.24
var masterdata;
var catalog;
var exk8=Object.create(k8);
var sourceelement=[];
// pagetype

if(page=='systemmessage'){
    $('#html1').html('<h1>System message</h1><p>'+GLOBALS_domain_systemmessage+'</p>');
}else{
    if(isset(site,'elements')){
      let el_main=$('#layout0')[0];
      let classmain="";
      site.autoappend=getfromArray(site,'autoappend',false);
      if(isset(site,'layout')){
        $('#layout1').html(site['layout']);
      }else if(datadefID=="k8pages"){
        if(!gbnull(pagetype)){
          settings.masterdata.htmlout=pagetype;
        }else{
          settings.masterdata.htmlout="detail";
        }
        if(settings.data){
          settings.masterdata.loaddata=false
          classmain=settings.data[0].classmain;
        }else{
          var filter={"field":settings.key,"type":"=","value":getfromArray(GET,'keyvalue')};
          settings.masterdata.filters=[];
          settings.masterdata.filters.push(filter);
          //settings.masterdata.keyvalue=getfromArray(GET,'keyvalue');
        }
        settings.masterdata.paginationsize=0;
        settings.masterdata.selector=getfromArray(settings.masterdata,'selector','#html1');
        catalog=$(settings.masterdata.selector).catalog(settings);
      }else if(settings.masterdata){
        let selector=getfromArray(settings.masterdata,'selector','#html1');
        settings.masterdata.htmlout=getfromArray(settings.masterdata,'htmlout','catalog');
        if(settings.masterdata.htmlout=="lineedit"){
          showLineedit(settings,selector);
        }else if(page=="list"){
          showList(settings,selector);
        }else if(settings.masterdata.htmlout=="form"){
          showForm(settings,selector);
        }else if(settings.masterdata.htmlout=="masterdata" || settings.masterdata.htmlout=="form"){
          sourceelement[i]=$(selector).masterdata(settings);
        }else if(settings.masterdata.htmlout=="simpledata"){
          settings.k8form.selector=selector;
          showSimpledata(settings);
        }else if(settings.masterdata.htmlout=="chartjs"){
          settings.chartjs_def.selector=selector;
          sourceelement[i]=exk8.displayChartjs(settings);
        }else{
          /*
          if(datadefID=="k8pages"){
            settings.masterdata.loaddata=true;
            settings.data=[];
          }
          */
          // htmlout ?
          // loaddata=false, if selector are in the html.record layout!
          if(!gbnull(pagetype))settings.masterdata.htmlout=pagetype;
          sourceelement[i]=$(selector).catalog(settings);
        }
      }
      //if(gbnull(classmain))classmain="container-fluid";
      for(var i=0;i<site.elements.length;i++){
        let element=site.elements[i];
        let element_datadefinition=getfromArray(element,'datadefinition',{});
        
        let selector;
        if(site.autoappend){
          selector='.selector'+i;
          let classlist=gsclauseand(classmain,selector.substr(1),true,' ');
          $('<div class="'+classlist+'"></div>').appendTo(el_main);
        }else{
          let datadeftemp=selector=element.datadefinition
          if(isset(element,'datadefinition','masterdata','selector')){
            selector=element.datadefinition.masterdata.selector;
          }else{
            if(element.selector){
              selector=element.selector;
            }else{
              //selector=getfromArray(mydatadefinition.masterdata,'selector',getfromArray(mydatadefinition.masterdata,'selector_layout'));
              console.log('datadefID='+getfromArray(element,'datadefID')+': please define the selector in your site element');
            }
          }
        }
        
        /*
        if(element.keyvalue)mydatadefinition.masterdata.keyvalue=element.keyvalue;
        if(element.displayvalue)mydatadefinition.masterdata.displayvalue=element.displayvalue;
        if(element.clause)mydatadefinition.masterdata.clause=element.clause;
        if(element.filters)mydatadefinition.masterdata.filters=element.filters;

        mydatadefinition.masterdata.keyvalue=getfromArray(element,'keyvalue');
        mydatadefinition.masterdata.displayvalue=getfromArray(element,"displayvalue");
        mydatadefinition.masterdata.clause=getfromArray(element,'clause');
        mydatadefinition.masterdata.filters=getfromArray(element,'filters',[]);
        */
       
        /*
        if(element.page=="detail" || element.page=="catalog"){
          if(element.datadefID=="k8pages"){
            if(!element_datadefinition.masterdata)element_datadefinition.masterdata={};
            element_datadefinition.masterdata.htmlout=element.page;
            element_datadefinition.masterdata.selector=mydatadefinition.masterdata.selector
            element_datadefinition.sourceelement=mydatadefinition.sourceelement=i;
            let url='masterdata/ProcessData.php?process_action=GetObject&datadefID='+element.datadefID;
            displayCatalog(selector,url,element_datadefinition);  // reload k8pages
          }else{
            mydatadefinition.masterdata.htmlout=element.page;
            var search_mode=getfromArray(mydatadefinition.masterdata,'search_mode',0);
            if(search_mode>0){
              exk8.datadefAddSearch(mydatadefinition);
            }
            sourceelement[i]=$(selector).catalog(mydatadefinition);
          }
        }else if(element.page=="lineedit"){
        */
        if(!gbnull(selector)){
          let objectbasis="settings"+element.datadefID;
          let objectvariable="settings"+element.datadefID+i;
          let mydatadefinition;
          if(window[objectvariable]){
            mydatadefinition=window[objectvariable];
          }else if(window[objectbasis]){
            mydatadefinition=window[objectbasis];
          }
          if(!mydatadefinition){
            console.error(element.datadefID+' no settings!');
            continue;
          }
          mydatadefinition.sourceelement=i;
          mydatadefinition.masterdata.selector=selector;
          
          if(element.page=="lineedit"){
            showLineedit(mydatadefinition,selector);
          }else if(element.page=="list"){
            showList(mydatadefinition,selector);
          }else if(element.page=="form"){
            showForm(mydatadefinition,selector);
          }else if(element.page=="masterdata" || element.page=="form"){
            sourceelement[i]=$(selector).masterdata(mydatadefinition);
          }else if(element.page=="simpledata"){
            mydatadefinition.k8form.selector=selector;
            showSimpledata(mydatadefinition);
          }else if(element.page=="chartjs"){
            mydatadefinition.chartjs_def.selector=selector;
            sourceelement[i]=exk8.displayChartjs(mydatadefinition);
          }else{
            if(element.datadefID=="k8pages"){
              mydatadefinition.masterdata.loaddata=true;
              mydatadefinition.data=[];
            }
            mydatadefinition.masterdata.htmlout=element.page;
            sourceelement[i]=$(selector).catalog(mydatadefinition);
          }
        }
      }
    }else if(gbnull(datadefID) && gbnull(table) && (gbnull(page) || GLOBALS_pages_masterdata1.includes(page) || GLOBALS_pages_html1.includes(page) || "masterdata,lineedit,detail,catalog,html,form,list,register,mydata,userlist,member".indexOf(page)>=0)){
      $('#html1').html('<h1>System message</h1><p>please set valid datadefID</p>');
/*
    }else if(pagetype=='detail'){
        settings.masterdata.htmlout=pagetype;
        settings.masterdata.loaddata=false;
        settings.masterdata.paginationsize=0;
        settings.masterdata.selector=getfromArray(settings.masterdata,'selector','#html1');
        bok=true;
        if(settings.data){
          bok=(settings.data.length>0);
        }
        if(bok){
          catalog=$(settings.masterdata.selector).catalog(settings);
        }else{
          $(settings.masterdata.selector).html('<h1>System message</h1><p>'+'no data!'+'</p>');
        }
*/    
    }else if(gbnull(page) || page=='masterdata' || GLOBALS_pages_masterdata1.includes(page)){
        settings.masterdata.selector=getfromArray(settings.masterdata,'selector','#masterdata1');
        masterdata=$(settings.masterdata.selector).masterdata(settings);
        //$('#html1').empty();
    }else if(GLOBALS_pages_html1.includes(page)){
        settings.masterdata.selector=getfromArray(settings.masterdata,'selector','#html1');
        settings.masterdata.edittype=getfromArray(settings.masterdata,'edittype',1);
        settings.masterdata.htmlout=getfromArray(settings.masterdata,'htmlout',page);
        catalog=$(settings.masterdata.selector).catalog(settings);
    }else if(page=='chartjs'){
        exk8.displayChartjs(settings);
    }else if(page=='lineedit'){
        settings.masterdata.selector=getfromArray(settings.masterdata,'selector','#masterdata1');
        showLineedit(settings,settings.masterdata.selector);
    }else if(page=='simpledata'){
        //settings.k8form.selector=getfromArray(settings.k8form,'selector','#html1');
        settings.k8form.selector='#html1';
        showSimpledata(settings);
   }else if(page=='detail'){
        settings.masterdata.selector=getfromArray(settings.masterdata,'selector','#html1');
        settings.masterdata.htmlout=page;
        let pagetype=getfromArray(GET,'pagetype');
        if(!gbnull(pagetype))settings.masterdata.htmlout=pagetype;
        settings.masterdata.loaddata=false;
        settings.masterdata.paginationsize=0;
        bok=true;
        if(settings.data){
          bok=(settings.data.length>0);
        }
        //bok=false;
        if(bok){
          catalog=$(settings.masterdata.selector).catalog(settings);
        }else{
          $('#html1').html('<h1>System message</h1><p>'+'no data!'+'</p>');
        }
    }else if(page=='catalog'){
        settings.masterdata.selectorlayout=getfromArray(settings.masterdata,'selectorlayout','#layout1');
        if(!gbnull(layout))$(settings.masterdata.selectorlayout).html(settings.html[layout]['layout']);
        if(isset(settings.html,page,'layout'))$(settings.masterdata.selectorlayout).html(settings.html[page]['layout']);
        
        settings.masterdata.selector=getfromArray(settings.masterdata,'selector','#html1');
        settings.masterdata.htmlout=page;
        let pagetype=getfromArray(GET,'pagetype');
        if(!gbnull(pagetype))settings.masterdata.htmlout=pagetype;
        let edittype=getfromArray(settings.masterdata,'edittype',1);
        if(('8').indexOf(edittype)>-1)edittype=1;
        settings.masterdata.edittype=edittype;
        /*
        settings.masterdata.edittype=2;
        settings.masterdata.edit_selector='#edit';
        */
        
        var clause='';
        clause=getfromArray(GET,'clause');
        if(isset(GET,'keyvalue'))clause=gsclauseand(clause,settings.key+'='+GET['keyvalue']);
        if(isset(GET,'displayvalue'))clause=gsclauseand(clause,settings.displaycolumn+'='+GET['displayvalue']);
        settings.masterdata.clause=gsclauseand(settings.masterdata.clause,clause,!gbnull(clause));
                
        var search_mode=getfromArray(settings.masterdata,'search_mode',0);
        if(search_mode>0){
          exk8.datadefAddSearch(settings);
        }
        var catalog=$(settings.masterdata.selector).catalog(settings);
        
    }else if(page=='html'){
        settings.masterdata.selector=getfromArray(settings.masterdata,'selector','#html1');
        settings.masterdata.htmlout=page;
        settings.masterdata.loaddata=false;
        settings.masterdata.paginationsize=0;
        bok=true;
        if(settings.data){
          bok=(settings.data.length>0);
        }
        if(bok){
          catalog=$(settings.masterdata.selector).catalog(settings);
        }else{
          $('#html1').html('<h1>System message</h1><p>'+'no data!'+'</p>');
        }
    }else if(page=='XcatalogOLD'){
        settings.masterdata.htmlout=page;
        el_search=document.getElementById('search');
        if(el_search){
          //settings.masterdata.rightuser_create=false;
          settings.masterdata.edittype=1;
          var search=getfromArray(GET,'search');
          var el_form=el_search.form;
          el_form.elements.namedItem('datadefID').value=datadefID;
          el_form.elements.namedItem('page').value=page;
          el_form.elements.namedItem('search').value=search;
          if(gbnull(search)){
            if(isset(settings,'html','catalog','blank'+GLOBALS_language)){
              var html='blank'+GLOBALS_language;
              $('#html1').html(settings.html.catalog[html]);
              var el=$('#html1')[0];
              conditional_output(el);
            }else if(isset(settings,'html','catalog','blank')){
              $('#html1').html(settings.html.catalog.blank);
              var el=$('#html1')[0];
              conditional_output(el);
            }
          }else{
              var keywordarray=search.split(/[ ,]+/);
              var clause='';
              var searchcolumn=getfromArray(settings,'searchcolumn');
              if(gbnull(searchcolumn)){
                  console.log('searchcolumn not set in datadefinition');
              }else{
                  for(var i=0;i<keywordarray.length;i++){
                    clause=gsclauseand(clause,searchcolumn+" like '%"+keywordarray[i]+"%'",!gbnull(keywordarray[i]),' or ');
                    //clause=gsclauseand(clause,"city like '%"+keywordarray[i]+"%'",!gbnull(keywordarray[i]),' or ');
                    //clause=gsclauseand(clause,"partoftown like '%"+keywordarray[i]+"%'",!gbnull(keywordarray[i]),' or ');
                  }
                  settings.masterdata.clause=clause;
                  if(isset(settings,'masterdata','filters_'+page)){
                      if(!isset(settings,'masterdata','filters')){
                          settings.masterdata.filters=[];
                      }
                      settings.masterdata.filters.push(settings.masterdata['filters_'+page]);
                  }
                  var catalog=$('#html1').catalog(settings);
              }
          }
        }else{
          catalog=$('#html1').catalog(settings);
        }
    }else if(page=='form'){
      showForm(settings,'#masterdata1',GET);
    }else if(page=='list'){
      settings.masterdata.selector=getfromArray(settings.masterdata,'selector','#masterdata1');
      showList(settings,settings.masterdata.selector);
    }else if(page=='listedit'){
      settings.masterdata.selector=getfromArray(settings.masterdata,'selector','#masterdata1');
      showListedit(settings,settings.masterdata.selector);
    }else if(page=='treeview'){
      settings.masterdata.selector=getfromArray(settings.masterdata,'selector','#masterdata1');
      showTreeview(settings,settings.masterdata.selector);
    }else if(page=='mydata'){
        /*
        //settings.masterdata.addfriends=true;
        //settings.masterdata.upload.enabled=true;
        //settings.masterdata.showdelete=true;
        //settings.masterdata.showsetdelete=true;

        var datadefinition=settings;
        if(userID==0){
          datadefinition.masterdata.upload.enabled=false;
        }
        datadefinition.masterdata.upload.singleimage=true;
        
        var k8form=Object.create(k8);
        k8form.initFormfields(datadefinition.k8form);
        //k8form.formcollection['roles_inputgroup'].active=false;
        //k8form.formcollection['roles'].active=false;
        //k8form.formcollection['active'].active=false;
        //k8form.formcollection['password'].active=gbnull(userID);
        //k8form.formcollection['username'].disabled=!gbnull(userID);
        datadefinition.k8form.formcollection['roles_inputgroup'].active=false;
        datadefinition.k8form.formcollection['roles'].active=false;
        datadefinition.k8form.formcollection['active'].active=false;
        datadefinition.k8form.formcollection['password'].active=gbnull(userID);
        datadefinition.k8form.formcollection['username'].disabled=!gbnull(userID);

        //var datadeffriends=<?php $datadefID=6;$error="";echo json_encode(getDatadefinition($datadefID,$error),JSON_NUMERIC_CHECK);?>;                
        Dropzone.autoDiscover = false;
        var listedit;
        //var userID=<?php echo getFromArray($_SESSION,'userID',0);?>;
        datadefinition=$.extend(true, datadefinition, {masterdata:{
          "notabulator":true,
          "keyvalue":userID,
          "dataAfterSave":function(el_md,dat,bnew){
            if(userID==0){
              // new Registration go to login page
              window.location.replace(GLOBALS_url_login);
            }
          },
          "dataChange":function(el_md,el){
              switch(el.name)    {
                  case "username":
                      url="masterdata/ProcessMethod.php?process_action=checkusername&username="+el.value;
                      $.getJSON(url,function(oJson) {
                          el_help=$(el).parent().find('.js_hint')[0];
                          if(!el_help){
                            el_help=$('<span class="js_hint"></span>').appendTo($(el).parent())[0];
                          }
                          if(oJson.bok){
                              $(el_help).hide();
                          }else{
                              el_help.innerHTML=getl("username not available!");
                              $(el_help).show();
                              el.focus();
                          }
                      })
                      .fail(function(jqxhr, textStatus, error ) {
                          var err = textStatus + ", " + error;
                          console.log( "data load, Request Failed: " + err );
                      });

                      break;
              }
          }
        }});
        if(gbnull(userID)){datadefinition.name='Register'}else{datadefinition.name='My Data'}
        var md=$('#masterdata1').masterdata(datadefinition);
        var $masterform=$(md.el_md);

        if(gbnull(userID)){
        }else{
          // ----------------- change password form ------------------
          $('.js_changepasswordform').show();
          var options={"template":"{{innerHTML}}<div class=\"text-end mb-3\"><input type=\"submit\" name=\"submit\" class=\"btn btn-primary js_changepassword\" value=\""+getl('Change')+"\" /></div>",
            "fieldwrapclass":"controls col-sm-9",
            "labelclass":"col-form-label label-left col-sm-3",
            "selector":".js_changepasswordform",
            "fields":[
              {"name":"oldpassword","label":"old password","type":"password","required":true},
              {"name":"newpassword","label":"new password","type":"password","minlength":6,"maxlength":50,"required":true},
              {"name":"confirmedpassword","label":"confirmed pw.","type":"password","minlength":6,"maxlength":50,"required":true}
            ]
          };
          var k8form=Object.create(k8);
          k8form.createform(options);

          if(settings.masterdata.showdelete){
            $('#delete').parents('.row').show();
            // ----------------- delete button ------------------
            $('#delete').on("click",function(e){
              var result=prompt(getl('Your profile will be deleted! type: ')+getl('Yes'),"");
              if(result==getl('Yes')){
                var url='../'.repeat(settings.masterdata.script_depth)+settings.masterdata.url_del;
                var o={"key":userID};
                $.getJSON(url,o, function(oJson) {
                  if(oJson.bok){
                    md.message("your profile is deleted","saved");
                    window.location.href="index.php?submit=Logout";
                  }else{
                    md.message(oJson.error,"alert");
                  }
                })
                .fail(function(jqxhr, textStatus, error ) {
                    var err = url+", Request Failed, "+ textStatus + ", " + error;
                    console.log(err);
                });			
              }
            });
          }

          if(settings.masterdata.showsetdeleted){
            // ----------------- setdeleted button ------------------
            $('#setdeleted').parents('.row').show();
            $('#setdeleted').on("click",function(e){
              var result=prompt(getl('Your profile will be set as deleted! type: ')+getl('Yes'),"");
              if(result==getl('Yes')){
                var url='../'.repeat(settings.masterdata.script_depth)+'masterdata/ProcessMethod.php?process_action=setdeleted';
                var o={"key":userID};
                $.getJSON(url,o, function(oJson) {
                  if(oJson.bok){
                    md.message("your profile is set as deleted","saved");
                    window.location.href="index.php?submit=Logout";
                  }else{
                    md.message(oJson.error,"alert");
                  }
                })
                .fail(function(jqxhr, textStatus, error ) {
                    var err = url+", Request Failed, "+ textStatus + ", " + error;
                    console.log(err);
                });			
              }
            });
          }

          // ----------------- add picture ------------------
          if(settings.masterdata.upload.enabled){
            var el_row=$('.form-wrapper').parent()[0];
            el_row.children[0].classList.remove('col-sm-12');
            el_row.children[0].classList.add('col-sm-7');
            $(el_row.children[1]).show();
          }

          // ----------------- change password ------------------
          $('.js_changepasswordform').on("submit",function(e){
            e.preventDefault();
            var o=form2obj(e.target);
            var url='../'.repeat(settings.masterdata.script_depth)+"masterdata/ProcessMethod.php?process_action=changePassword";
            $.getJSON(url,o, function(oJson) {
              if(oJson.bok){
                md.message("password changed","saved");
              }else{
                md.message(oJson.error,"alert");
              }
            })
            .fail(function(jqxhr, textStatus, error ) {
                var err = url+", Request Failed, "+ textStatus + ", " + error;
                console.log(err);
            });			
          });
        }

        // ----------------- add friends ------------------
        if(!gbnull(userID) && getfromArray(datadefinition.masterdata,'addfriends',0)){
            $("#layout1").append('<div id="htmlcont" class="mx-n3 masterdata"></div>');
            if(typeof(datadeffriends)!=="undefined"){
                datadeffriends.masterdata.htmlout="lineedit";
                //datadeffriends has formwrapper!
                listedit=$('#htmlcont').catalog(datadeffriends);
                //listedit=$('#html1').catalog(datadeffriends);
                if(gbnull(userID)){
                  $('.js_rec_newsearch').hide();
                }

                $('.js_rec_newsearch').on("click",function(e){
                  var el=e.target;
                  newline_search(el);
                });

            }else{
                console.log("datadeffriends not defined!");
            }
        }
        */
    }else if(page=='user_list'){
      /*
        var k8form=Object.create(k8);
        k8form.initFormfields(settings.k8form);
        //if(GLOBALS_readpassword==0 || GLOBALS_readpassword==2)k8form.formcollection['password'].active=false;
        if(GLOBALS_readpassword==0 || GLOBALS_readpassword==2)settings.k8form.formcollection['password'].active=false;
        masterdata=$('#masterdata1').masterdata(settings);
        $('#html1').empty();
      */
    }else if(page=='member'){
        /*
        $('#layout1').html(settings.html['member']['layout']);
        //if(!gbnull(layout))$('#layout1').html(settings.html['member']['layout']);
        //if(layout=='member'){
            settingsk8components.masterdata.edittype=9;
            delete(settingsk8components.html.catalog.blank);
            settingsk8components.masterdata.dataAfterLoadAll=function(el_list,data){
              $('.js_catalog.js_rec_head').hide();
              $('.js_member.js_rec_head').show();
            }
            //settings.masterdata.edittype=9;
            settings.masterdata.editreload=true;
            settings.masterdata.search_mode=0;
            settings.masterdata.disprecdirect=1;
            if(settings.html.catalog.blankde)delete(settings.html.catalog.blankde);
            
            //settings.masterdata.edittype=6;
            //settings.masterdata.edit_selector='#edit';

            settings.masterdata.paginationsize=2;
            settings.masterdata.pagination='internal';
            settings.masterdata.clause="creatorID="+userID+" and status=0";
            catalog=$('#catalog_prepared').catalog(settings);
            settings.masterdata.rightuser_create=false;
            //settings.masterdata.filters=[{"field":"creatorID","type":"=","value":userID},{"field":"status","type":"=","value":1}];
            settings.masterdata.clause="creatorID="+userID+" and status=1";
            var catalog1=$('#catalog_open').catalog(settings);
            //settings.masterdata.filters=[{"field":"creatorID","type":"=","value":userID},{"field":"status","type":"=","value":2}];
            settings.masterdata.clause="creatorID="+userID+" and status=2";
            var catalog2=$('#catalog_closed').catalog(settings);
        //}
          */
    }else if(page=='translation'){
        /*
        if(pages[page]['title'])document.title=pages[page]['title'];
        if(pages[page]['description']){
          document.querySelector('meta[name="description"]').setAttribute("content",pages[page]['description']);
        }
        if(pages[page]['og:image']){
          document.querySelector('meta[property="og:image"]').setAttribute("content",pages[page]['og:image']);
        }
        */

        var url=GLOBALS_hostpath+"_translation.html";
        fetch(url)
        .then(function (response) {
          return response.text();
        })
        .then(function (html) {
          //document.querySelector('#layout1').innerHTML=html;
          //document.querySelector('#layout1').classList.add("pb-3");
          document.querySelector('#layout0').innerHTML=html;
          var k8login=Object.create(k8);
          var form={
            "template":"{{innerHTML}}",
            "templatetype":"form_save_cancel",
            "selector":"#form1",
            "translation":false,
            "fields":[
              {
                "label":"Origin",
                "labelclass":"form-label fw-bold",
                "name":"origin",
                "tagName":"textarea"
              },
              {
                "label":"Translation",
                "labelclass":"form-label fw-bold",
                "name":"translation",
                "tagName":"textarea"
              },
              {
                "fieldwraptemplate":"<div class=\"mb-3 text-end\">{{fieldelement}}</div>",
                "name":"createfile",
                "tagName":"button",
                "text":"Create File",
                "fieldclass":"btn btn-light"
              },
              {
                "label":"File",
                "labelclass":"form-label fw-bold",
                "name":"result",
                "tagName":"textarea"
              }
            ]
          };
          k8login.createform(form);

          var el_origin=document.getElementById('origin');
          var textvalue="";
          for(prop in text){
            if(text.hasOwnProperty(prop)){
              textvalue+=prop+String.fromCharCode(10);
            }
          }
          el_origin.value=textvalue.substring(0,textvalue.length-1);
          var el_translation=document.getElementById('translation');
          var el_result=document.getElementById('result');
          var nl=String.fromCharCode(10);
          $('#createfile').on("click",function(){
            var arr_origin=el_origin.value.split(nl);
            var arr_translation=el_translation.value.split(nl);
            if(arr_origin.length!==arr_translation.length){
              alert("line number not equal!");
            }else{
              var textvalue="";
              for(var i=0;i<arr_origin.length;i++){
                textvalue+="text['"+arr_origin[i]+"']=\""+arr_translation[i]+"\";"+String.fromCharCode(10);
              }
              el_result.value=textvalue;
            }

          });
          source_arr="";

        });
    }else if(isset(pages,page)){
        // load file
        if(pages[page]['contentfile']){
          var url=GLOBALS_hostpath+pages[page]['contentfile'];
          fetch(url)
          .then(function (response) {
            return response.text();
          })
          .then(function (html) {
            var htmlID=getfromArray(pages,"htmlID",'#html1');
            document.querySelector(htmlID).innerHTML=html;
            /* dont work for facebook
            if(pages[page]['title'])document.title=pages[page]['title'];
            if(pages[page]['description']){
              document.querySelector('meta[name="description"]').setAttribute("content",pages[page]['description']);
            }
            if(pages[page]['og:image']){
              document.querySelector('meta[name="og:image"]').setAttribute("content",pages[page]['og:image']);
            }
            */
          }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
          });
        }
        // script
        /* insert your code here */

    }else if(!(page in pages)){
        /* --- page not found? --- */
        var el_masterdata1=document.getElementById('masterdata1');
        var el_html1=document.getElementById('html1');
        if(el_html1 && el_masterdata1){
          if(gbnull(el_html1.innerHTML) && gbnull(el_masterdata1.innerHTML)){
            el_html1.innerHTML="<h1>"+getl("page not found")+"</h1><p>"+getl("This page is not implemented in this website.")+"</p>";
          }
        }
    }
}

function showLineedit(settings,selector){
  settings.masterdata.edittype=6;
  settings.masterdata.htmlout="lineedit";
  if(settings.sourceelement){
    sourceelement[settings.sourceelement]=$(selector).catalog(settings);
  }else{
    catalog=$(selector).catalog(settings);
  }
}
function showForm(settings,selector,GET){
  settings.masterdata.notabulator=true;
  settings.masterdata.bnoform=false
  if(typeof(GET)!=='undefined'){
    settings.masterdata.keyvalue=getfromArray(GET,'keyvalue');
  }
  if(settings.sourceelement){
    sourceelement[settings.sourceelement]=$(selector).masterdata(settings);
  }else{
    masterdata=$(selector).masterdata(settings);
  }
}

function showListedit(settings,selector){
  //window['tableTab']=new Tabulator(selector,settings.tabulator);
  k8.datadefAddlistedit(settings);
  k8.displaytabulator(selector,settings);
}
function showTreeview(settings,selector){
  //window['tableTab']=new Tabulator(selector,settings.tabulator);
  k8.datadefAddtreeview(settings);
  masterdata=$(selector).masterdata(settings);
}

function showList(settings,selector){
  settings.masterdata.edittype=getfromArray(settings.masterdata,'edittype',3);
  if(settings.masterdata.edittype==8){
    settings.masterdata.edittype=3;
  }
  settings.masterdata.notabulator=false;
  settings.masterdata.bnoform=true
  if(!settings.tabulator.height && !settings.tabulator.maxHeight)settings.tabulator.height="100%";
  if(settings.sourceelement){
    sourceelement[settings.sourceelement]=$(selector).masterdata(settings);
  }else{
    masterdata=$(selector).masterdata(settings);
  }
}

function showSimpledata(settings){
  if(!settings.datalistcolumn || !isset(settings,'masterdata','simpledatawrapper')){
    
    var datalistcolumn=getfromArray(settings,'datalistcolumn',getfromArray(GET,'datalistcolumn',getfromArray(settings,'searchcolumn', settings.headtitlecolumn)));
    /*
    if(gbnull(datalistcolumn)){
      for(var i=0;i<settings.columns.length;i++){
        let field=settings.columns[i];
        if(["CHAR","TEXT","VARCHAR"].includes(field.mytype)){
          datalistcolumn=field.name;
          break;
        }
      }
    }
    */
    if(!gbnull(datalistcolumn)){
      var k8searchfield={ 
        "identifier":"search",
        "inputgroup":{
          "fields":[
            {
                "name": "k8search",
                "type": "search",
                "attributes":{
                  "list":"simpledata",
                  "autocomplete": "OFF"
                },
                "label": "Search"
            }
          ],
          "template":"<div class=\"input-group\">{{control_delete}}{{field0}}{{control_save}}{{control_new}}</div>"
        }
      };
      settings.k8form.template='<form class=\"js_dataform masterdata-form\">{{innerHTML}}</form>';
      settings.masterdata.simpledatawrapper=getfromArray(settings.masterdata,'simpledatawrapper',true);
      if(settings.masterdata.simpledatawrapper){
        if(!settings.html)settings.html={};
        if(!settings.html.simpledata)settings.html.simpledata={};
        let html=getfromArray(settings.html.simpledata,'wrapper','<div class="masterdata"><div class="headline"><div><h1 class="js_title">'+settings.name+'</h1></div><div></div></div><div class="maindata">{{innerHTML}}</div></div>');
        settings.k8form.template=html.replace('{{innerHTML}}',settings.k8form.template);
      }
      
      if(!settings.k8form.fields)settings.k8form.fields=[];
      let index=getArrayIndexfromValue(settings.k8form.fields,'name','search');
      if(index==-1)index=getArrayIndexfromValue(settings.k8form.fields,'name','k8search');
      if(index==-1)index=getArrayIndexfromValue(settings.k8form.fields,'identifier','searchdatalist');
      if(index==-1)settings.k8form.fields.unshift(k8searchfield);
      settings.datalistfield="k8search";
      settings.datalistcolumn=datalistcolumn;
    }          
  }
  var myk8=Object.create(k8);
  //settings.k8form.selector=getfromArray(settings.k8form,'selector','masterdata1');
  myk8.createform(settings.k8form);
  myk8.initSimpleFormEvents(settings);
}