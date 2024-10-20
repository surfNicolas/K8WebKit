var path=GLOBALS_hostpath+GLOBALS_projectpath+"/_contact/";
var url=path+"_contact_en.html";
      if(GLOBALS_language=='de')url=path+"_contact_de.html";
      fetch(url)
      .then(function (response) {
        return response.text();
      })
      .then(function (html) {
        html=html.replaceAll("{{classmain}}",GLOBALS_classmain);
        document.querySelector('#html'+GLOBALS_layout).innerHTML=html;
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
                "value": getl("Send")
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
                el_note.innerHTML=getl(ret.message);
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
      }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
      });