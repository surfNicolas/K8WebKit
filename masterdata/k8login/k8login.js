let myk8=Object.create(k8);
myk8.initFormfields(settingsk8login.k8form);
//settingsk8login.masterdata.rightuser_create=true;
settingsk8login.k8form.formcollection.rightgroupname.datalist.defaultclause="EXISTS(SELECT 1 FROM k8rightmembers WHERE k8rightmembers.rightgroupID=k8rightgroups.rightgroupID and k8rightmembers.userID="+userID+")";
if(GLOBALS_registermode==1){
  settingsk8login.k8form.formcollection.title.active=true;
  settingsk8login.k8form.formcollection.firstname.active=true;
  settingsk8login.k8form.formcollection.lastname.active=true;
  settingsk8login.k8form.formcollection.street.active=true;
  settingsk8login.k8form.formcollection.country.active=true;
  settingsk8login.k8form.formcollection.code_city.active=true;
  settingsk8login.k8form.formcollection.phone.active=true;
  settingsk8login.k8form.formcollection.mobile.active=true;
}

if(page=="mydata"){
  settingsk8login.masterdata.cbAfterSave=function(options){
    let dat=options.dat;
    if(userID==dat['userID']){
      dat_user=dat;
    }
  }

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
  /*
  k8form.formcollection['roles_inputgroup'].active=false;
  k8form.formcollection['roles'].active=false;
  k8form.formcollection['active'].active=false;
  k8form.formcollection['password'].active=gbnull(userID);
  k8form.formcollection['username'].disabled=!gbnull(userID);
  */
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
  
  function newline_search(el){
      if(!$(el).hasClass('js_disabled')){
          // getting parent record
          var el_rec_container=$(el).parents('.js_rec_container')[0];
          var form=$(el).parents('form')[0];
          //var el_rec_record=$(el).parents('.js_rec_record')[0];
          //var index=Number(el_rec_record.dataset.rec_index);
          var index=0;
          //var datadefID=7;
          var datadefID="k8loginsearch";
          var url='masterdata/ProcessData.php?process_action=GetObject&datadefID='+datadefID;
          var obj={"function_name":"newline_insert","index":index,"form":form};
          obj['mydisplayfield']='friendname';
          obj['searchdisplayfield']='username';
          obj['myIDfield']='friendID';
          obj['searchIDfield']='userID';
          obj['el_rec_container']=el_rec_container;
          //obj['']='userID';
          displaySearchBox(url,obj);
      }
  }

  function newline_insert(obj){
    var o={};
    o.userID=userID;
    o.friendID=obj.data[obj.js_return.searchIDfield];
    o.friendname=obj.data[obj.js_return.searchdisplayfield];

    $.getJSON(datadeffriends.masterdata.url_save,o, function(oJson) {
        if(oJson.bok){
            //o['ID']=oJson.bok;
            o=oJson.dat;
            listedit.insertRecord(o,'','first');
        }else{
            console.log('error by save: '+oJson.error);
        }
    })
    .fail(function(jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log("saverecord.Request Failed: " + err );
    });
  }  
}else if(page=="user_list"){
  delete(settingsk8login.html.masterdata.formwrapper);
  
  settingsk8login.masterdata.cbCreateStructure=function(options){
    let el_btnroles=document.getElementById('js_btnroles');
    if(el_btnroles){
      let el_input=el_btnroles.getElementsByTagName('input')[0];
      //el_btnroles.addEventListener("click",function(e){
      el_btnroles.addEventListener("click",myfunc);
      el_input.addEventListener("focus",myfunc);

      function myfunc(e){
        let el_overlay=document.getElementsByClassName('k8-overlay')[0];
        if(!el_overlay){
          let el=e.target;
          let el_form=$(el).parents('form')[0];
          dat={}; //$(el_form).serializeJSON({checkboxUncheckedValue: "0"});
          dat['username']=el_form.elements.namedItem("username").value;
          dat['roles']=el_form.elements.namedItem("roles").value;
          //if(dat['roles']){
            el_overlay=myk8.createOverlay();

            // form erstellen
            html='<div>'+getl('roles')+'</div><form id="role_form">';
            for(let prop in GLOBAL_roles){
              if(GLOBAL_roles.hasOwnProperty(prop)){
                html+='<div class="form-check"><input name="role'+prop+'" value="'+prop+'" type="checkbox" id="role'+prop+'" class="form-check-input"><label class="form-check-label" for="role'+prop+'">'+prop+': '+GLOBAL_roles[prop]+'</label></div>';
              }
            }
            html+='<div class="text-end"> <input type="submit" name="submit" class="btn btn-primary me-4" value="'+getl('Save')+'"/> </div>';
            html+='</form>';
            myk8.el_content.innerHTML=html;

            let el_form_roles=document.getElementById('role_form');
            let roles=dat['roles'].split(',');
            for( let i=0;i<roles.length;i++){
              let el=el_form_roles.elements.namedItem('role'+roles[i]);
              if(el)el.checked=true;
            }

            el_form_roles.addEventListener("submit",function(e){
              e.preventDefault();
              let roles_string="";
              for(let prop in GLOBAL_roles){
                if(GLOBAL_roles.hasOwnProperty(prop)){
                  let el=el_form_roles.elements.namedItem('role'+prop);
                  if(el.checked)roles_string=gsclauseand(roles_string,prop,true,',');
                }
              }
              el_form.elements.namedItem('roles').value=roles_string;
              el_overlay.remove();
              if(masterdata)masterdata.setDirty(true);
            });
          //}
        }
      }
    }
  }; 
  
  if(GLOBALS_readpassword==0 || GLOBALS_readpassword==2)settingsk8login.k8form.formcollection['password'].active=false;
  masterdata=$('#masterdata1').masterdata(settingsk8login);
  $('#html1').empty();
  
}