// variables:
// userIDlogin
// username
// domain_url_register
// error_pwd

// selectors:

/* translation */
/*
var el_login_h2=$('#form_login h2')[0];
el_login_h2.innerHTML=getl(el_login_h2.innerHTML);
var el_send_h2=$('#form_send_password h2')[0];
el_send_h2.innerHTML=getl(el_send_h2.innerHTML);
*/

var el_form_login=document.getElementById('form_login');
var el_login_h=el_form_login.querySelector('#form_login '+htag)
el_login_h.innerHTML=getl(el_login_h.innerHTML);

var el_send_h=document.getElementById('form_send_password').firstChild;
el_send_h.innerHTML=getl(el_send_h.innerHTML);

var k8login=Object.create(k8);
if(gbnull(userIDlogin)){
  if(visituserloginpage){
    // ------------ show links --------------
    var logoutform={
      "template":"{{innerHTML}}",
      "templatetype":"masterform",
      "selector":"#form1",
      "fields":[
        {
          "fieldwraptemplate":'<p class="">'+getl('please visit the ')+'<a href="'+GLOBALS_url_login+'">'+getl('login page')+'</a></p>'
        }
      ]
    };
    k8login.createform(logoutform);
  }else{
    // ------------ login --------------
    if(GLOBALS_loginenabled){
      if(!gbnull(login_message)){
        let el_form1=document.querySelector('#form1');
        let el_message=document.createElement('p');
        el_message.innerHTML=login_message;
        el_form1.prepend(el_message);
      }
      var loginform={
        "template":"{{innerHTML}}",
        "templatetype":"masterform",
        "selector":"#form1",
        /*"labelclass":"control-label label-left col-sm-3",
        "fieldwrapclass":"controls col-sm-9",*/
        "fields":[
          {
            "name":"username",
            "value":username,
            "required":true
          },
          {
            "name":"password",
            "type":"password",
            "required":true
          },
          {
            "fieldwraptemplate":'<div class="row mb-1"><div class="col-sm-9 offset-sm-3"><div class="text-danger">'+getl(error_pwd)+'</div></div></div>',
            "active":!gbnull(error_pwd)
          },
          {
            "name":"rememberme",
            "type":"checkbox",
            "label":getl("allow cookies, remember me")
          },
          {
            "fieldwraptemplate":'<div class="row mb-1"><div class="col-sm-9 offset-sm-3"><a id="sendpassword" href="#">'+getl('send password')+'</a>'+(domain_url_register=="" ? "":', &nbsp;<a href="'+domain_url_register+'">'+getl('register')+'</a></div></div>')
          },
          {
            "fieldwraptemplate":'<div class="text-end">{{fieldelement}}</div>',
            "tagName":"button",
            "type":"submit",
            "name":"submit",
            "fieldclass":"btn btn-primary",
            "value":"Login",
            "text":getl("Login")
          }
        ]
      };
      k8login.createform(loginform);
      var el_login_message=document.getElementById('login_message');
      if(el_login_message){
        el_login_message.innerHTML=getl(login_message);
      }
      // page is reloaded by submit

      //  ----------------- send password -------------------
      var loginform={
        "template":"{{innerHTML}}",
        "templatetype":"masterform",
        "labelclass":"col-form-label label-left col-sm-3",
        "fieldwrapclass":"controls col-sm-9",
        "selector":"#form2",
        "fields":[
          {
            "name":"username",
          },
          {
            "name":"email",
            "label":getl("or email")
          },
          {
            "fieldwraptemplate":'<p id="message_sendpwd">'+'</p>'
          },
          {
            "fieldwraptemplate":'<div class="text-end">{{fieldelement}}</div>',
            "inputgroup":{
              "class":"myinput",
              "fields":[
                {
                  "tagName":"button",
                  "fieldclass":"btn btn-primary",
                  "id":"send_password",
                  "text":getl("send password")
                },
                {
                  "type":"button",
                  "fieldclass":"btn btn-light k8-margin-left-6",
                  "id":"send_back",
                  "value":getl("back")
                }
              ]
            }
          }
        ]
      };
      k8login.createform(loginform);
      
      if(gbnull(username)){
        $("#username").focus();
      }else{
        $("#password").focus();
      }
      
      // Link to change form
      $('#sendpassword').on('click',function(e){
        e.preventDefault();
        $('#form_login').hide();
        $('#form_send_password').show();
      });

      $('#send_password').on('click',function(e){
        e.preventDefault();
        // check input
        var username=document.getElementById('form2').elements.namedItem('username').value;
        var email=document.getElementById('form2').elements.namedItem('email').value;
        if(gbnull(username) && gbnull(email)){
            $('#message_sendpwd').html(getl('please fill out username or email'));
            $('#message_sendpwd').addClass('text-danger');
        }else{
            var url="masterdata/ProcessMethod.php?process_action=sendPwd";
            var o={username:username,
              email:email,
              email_subject:getl(GLOBALS_email.sendPwd.subject),
              email_content:getl(GLOBALS_email.sendPwd.content)
            };
            $.getJSON(url,o, function(ret) {
                if(ret.bok){
                  $('#message_sendpwd').html(getl(ret.message));
                  $('#message_sendpwd').removeClass('text-danger');
                  $('#form2 button').eq(0).prop('disabled',true);
                }else{
                  $('#message_sendpwd').html(getl(ret.error));
                  $('#message_sendpwd').addClass('text-danger');
                }
            })
            .fail(function(jqxhr, textStatus, error ) {
                var err = url+", Request Failed, "+ textStatus + ", " + error;
                //var myk8=Object.create(k8);
                //myk8.message("error by email sending","alert");
                $('#message_sendpwd').html(getl("error by email sending"));
                $('#message_sendpwd').addClass('text-danger');
            });			
        }
      });
      $('#send_back').on('click',function(e){
        e.preventDefault();
        $('#form_login').show();
        $('#form_send_password').hide();
      });
      // page is reloaded by submit
      
    }else{
        var el_form=$('#form1')[0];
        el_form.innerHTML=getl("Login temporarely not available!");
        el_form.style.minHeight = "180px";
    }
  }
}else{
    // ------------ show logout --------------
    var logoutform={
      "template":"{{innerHTML}}",
      "templatetype":"masterform",
      "selector":"#form1",
      "fields":[
        {
          "fieldwraptemplate":'<p class=""><span>'+getl('logged in')+' : '+usernamelogin+'</span></p>'
        },
        {
          "fieldwraptemplate":'<div class="text-end">{{fieldelement}}</div>',
          "tagName":"button",
          "name":"submit",
          "fieldclass":"btn btn-primary",
          "value":"Logout",
          "text":getl("Logout")
        }
      ]
    };
    k8login.createform(logoutform);
}