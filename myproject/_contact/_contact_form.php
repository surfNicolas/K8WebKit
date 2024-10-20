<?php
// 24.03.2020 copyright Klaus Eisert
$bshowform=true;
$error='';

if(isset($_REQUEST['submit'])){
    // no more used!
    // validierung
    if(gbnull($_REQUEST['prename']) or gbnull($_REQUEST['name']) or gbnull($_REQUEST['email']) or gbnull($_REQUEST['subject']) or gbnull($_REQUEST['message'])){
        //$error="Bitte füllen Sie das Formular vollständig aus!";
        $error="Please fill out the form completely!";
    }else{
        echo '<p>thank you for your message:</p>';
        echo '<div class="row"><div class="col-sm-3">your name:</div><div class="col-sm-9">'.$_REQUEST['prename'].' '.$_REQUEST['name'].'</div></div>';
        echo '<div class="row"><div class="col-sm-3">e-mail:</div><div class="col-sm-9">'.$_REQUEST['email'].'</div></div>';
        echo '<div class="row"><div class="col-sm-3">subject:</div><div class="col-sm-9">'.$_REQUEST['subject'].'</div></div>';
        echo '<p>'.$_REQUEST['message'].'</p>';
        $bshowform=false;
    }
}

if($bshowform){?>
  <?php if($GLOBALS['domain_language']=='de'):?>
    <p>Sende uns bitte eine Nachricht für weitere Informationen oder Anregungen:</p>
  <?php else:?>
    <p>if you need further informations or like to tell us about your ideas, please get in contact with us:</p>
  <?php endif?>
    
    <form id="form1" class="form-horizontal form-dialog-round k8-margin-bottom-normal"></form>

    <script>
      var error="";
      var options={
         "selector":"#form1",
         "fields":[
            {
              "name":"firstname",
              "label": "First name",
              "maxLength": 50,
              "required": true
            },
            {
              "name":"lastname",
              "label": "Last name",
              "maxLength": 50,
              "required": true
            },
            {
              "name":"email",
              "type": "email",
              "label": "E-mail",
              "required": true
            },
            {
              "name":"subject",
              "label": "Subject",
              "maxLength": 50,
              "required": true
            },
            {
              "name":"message",
              "tagName": "textarea",
              "rows":5,
              "label": "Message",
              "required": true
            },
            {
              "fieldwraptemplate":"<div class=\"contact_note\">"+error+"</div>",
            },
            {
              "fieldwraptemplate":"<div class=\"text-end\">{{fieldelement}}</div>",
              "name": "submit",
              "type": "submit",
              "fieldclass":"btn btn-primary",
              "label": getl("send")
            }
          ]
      };
      var k8form=Object.create(k8);
      k8form.createform(options);
      var el_form=document.querySelector(options.selector);
      var el_note=document.querySelector('.contact_note');
      
      el_form.addEventListener("submit",function(e){
        e.preventDefault();
        $(el_form).find('input[type="submit"]').attr("disabled",true);
        var dat=form2obj(el_form);
        var url="masterdata/ProcessMethod.php?process_action=sendContact";
        $.getJSON(url,dat, function(ret) {
            if(ret.bok){
              // deactivate form
              for(var i=0;i<el_form.elements.length;i++){
                el_form.elements[i].disabled=true;
              }
              $(el_note).removeClass('text-danger');
              el_note.innerHTML=ret.message;
            }else{
              el_note.innerHTML=ret.error;
              $(el_note).addClass('text-danger');
            }
        })
        .fail(function(jqxhr, textStatus, error ) {
            var err = url+", Request Failed, "+ textStatus + ", " + error;
            alert(err );
        });			
      });
  </script>

  <?php
}