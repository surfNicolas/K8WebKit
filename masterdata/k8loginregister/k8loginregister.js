      if(GLOBALS_registerenabled!=1){
        var html="<h1>"+getl("Register")+"</h1>" + "<p class=\"pb-3\">"+getl("Sign up is temporarly not available!")+"</p>";
        var el=document.getElementById("html1");
        el.innerHTML=html;
      }else{
        var el=document.getElementById("masterdata1");
        el.innerHTML=" "; // prevent that page not found
        //var url=GLOBALS_hostpath+"masterdata/k8loginregister/_register.html";
        var url=GLOBALS_hostpath+"masterdata/k8loginregister/_register.php";
        fetch(url)
        .then(function (response) {
          return response.text();
        })
        .then(function (html) {
          document.querySelector('#masterdata1').innerHTML=html;
          // title
          // description
          // image
          var datadefinition=settings;
          //datadefinition.masterdata.headline='<div class="row justify-content-md-center"><div class="col-md-6"><div class="headline"><h3 class="js_title p-1">Register</h3></div></div><div><button type="button" class="btn btn-primary js_rec_new" style="display: none;">New</button></div></div>';
          datadefinition.k8form.template='{{innerHTML}} <div class="text-end"> <button type="submit" name="submit" class="btn btn-primary mb-3" value="Save" />'+getl('Create')+'</button> </div>';
          datadefinition.k8form.templatetype="form_save_cancel";
          delete(datadefinition.k8form.labelclass);
          delete(datadefinition.k8form.fieldclass);
          /*datadefinition.k8form.fieldwrapclass="mb-2";*/

          var k8form=Object.create(k8);
          k8form.initFormfields(settings.k8form);
          /*
          k8form.formcollection['password'].active=gbnull(userID);
          k8form.formcollection['username'].disabled=!gbnull(userID);
          */
          settings.k8form.formcollection['password'].active=gbnull(userID);
          settings.k8form.formcollection['username'].disabled=!gbnull(userID);
          settings.k8form.formcollection['clientID'].active=(GLOBALS_rightmode==1);
          settings.k8form.formcollection['name'].active=(GLOBALS_rightmode==1);
          
          if(GLOBALS_registermode==1){
            settings.k8form.formcollection.title.active=true;
            settings.k8form.formcollection.firstname.active=true;
            settings.k8form.formcollection.lastname.active=true;
            settings.k8form.formcollection.street.active=true;
            settings.k8form.formcollection.country.active=true;
            settings.k8form.formcollection.code_city.active=true;
            settings.k8form.formcollection.phone.active=true;
            settings.k8form.formcollection.mobile.active=true;
          }
          
          let label=getl(settings.k8form.formcollection['termsofuse'].label);
          //let termsofuse="<a href=\"index.php?page=termsofuse\" target=\"_blank\">"+getl("terms of use")+"</a>";
          let termsofuse="<a href=\""+GLOBALS_url_termsofuse+"\" target=\"_blank\">"+getl("terms of use")+"</a>";
          
          settings.k8form.formcollection['termsofuse'].label=label.replace("{{termsofuse}}",termsofuse);
          settings.k8form.method="GET";
          if(isset(GET,'name')){
            settings.masterdata.defaultvalues={};
            settings.masterdata.defaultvalues.name=decodeURI(GET['name']);
            settings.masterdata.defaultvalues.clientID=decodeURI(GET['clientID']);
          }
          datadefinition=$.extend(true, datadefinition, {masterdata:{
            "notabulator":true,
            "keyvalue":userID,
            "dataBeforeSave":function(el_md,dat){
              var cancel=false;
              var el_form=$(el_md).find("form")[0];
              var hints=$(el_md).find(".js_hint");
              for(var i=0;i<hints.length;i++){
                if(!gbnull(hints[i].innerHTML)){
                  md.message(getl('please correct form!'),"alert")
                  var el_main=hints[i].previousSibling;
                  //el_username.value="test";
                  el_main.focus();
                  cancel=true;
                }
              }
              return cancel;
            },
            "cbAfterSave":function(options){
            //"btnSave":function(el_md,dat){
              let el_md=options.el_md
              let dat=options.dat
              let bnew=options.bnew;
              if(userID==0){
                if(GLOBALS_useractive==1){  // domain_useractive==1
                  // send activation mail
                  var url="masterdata/ProcessMethod.php?process_action=sendActivation";
                  var params={username:dat['username'],
                    email_subject:getl(GLOBALS_email.activate.subject),
                    email_content:getl(GLOBALS_email.activate.content),
                  };
                  $.getJSON(url,params,function(ret) {
                    document.querySelector('#masterdata1').innerHTML="";
                    var selector="#html1";
                    if(ret.bok){
                      // systemmessage
                      var html="<h1>"+getl("Activation")+"</h1><p>"+getl("Please look in the inbox of your email account and activate your registration.")+"</p>";
                      $(selector).html(html);
                    }else{
                      var html="<h1>"+getl("Systemmessage")+"</h1><p>"+getl("It failed to send the activation mail")+"</p>";
                      $(selector).html(html);
                      console.log(ret.error);
                    }
                  })
                  .fail(function(jqxhr, textStatus, error ) {
                      var err = url+", Request Failed, "+ textStatus + ", " + error;
                      alert(err );
                  });			
                }else{
                  var el_form=$(el_md).find("form")[0];
                  var el_submit=el_form.elements.namedItem("submit");
                  el_submit.disabled=true;
                  $(el_form).find('*').prop("disabled", true);
                  var result=document.getElementById('result');
                  var linklogin='<a href="'+GLOBALS_url_login+'">'+getl('login')+'</a>';
                  result.innerHTML=getl('You created your new account, please ')+linklogin;
                }
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
                                //$(el_help).hide();
                                el_help.innerHTML="";
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
                    case "email":
                        url="masterdata/ProcessMethod.php?process_action=checkuniqueemail&email="+el.value;
                        $.getJSON(url,function(oJson) {
                            el_help=$(el).parent().find('.js_hint')[0];
                            if(!el_help){
                              el_help=$('<span class="js_hint"></span>').appendTo($(el).parent())[0];
                            }
                            if(oJson.bok){
                                //$(el_help).hide();
                                el_help.innerHTML="";
                            }else{
                                el_help.innerHTML=getl("email not available!");
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
          if(gbnull(userID)){datadefinition.name=getl('Register');}else{datadefinition.name=getl('My Data');}
          var masterdata=$('#masterdatasub').masterdata(datadefinition);
          var $masterform=$(masterdata.el_md);


        }).catch(function (err) {
          // There was an error
          console.warn('Something went wrong.', err);
        });
      }