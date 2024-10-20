// settingscustomer

var myk8=Object.create(k8);

// by parameter exclude fields
userparameter=getfromArray(settingscustomer.masterdata,'userparameter',0);
if(userparameter==1){
  // direct entry
  myk8.initFormfields(settingscustomer.k8form);
  settingscustomer.k8form.formcollection['categoryID']['active']=false;
  settingscustomer.k8form.formcollection['representativename']['active']=false;
  settingscustomer.masterdata.menuleftobj={};
}

settingscustomer.masterdata.cbMenuleft=function(options){
  var el_md=options.el_md, e=options.e, row_actual=options.row_actual;
  //var settings=options.settings, selected=options.selected;
  //options.display_record
  
  // menu:
  // - businesscard
  // - insert (new reocrd)
  // remove
  // edit
  // open form with invoices
  var el=e.target;
  var value=getfromArray(el.dataset,"value");
  if(value=="businesscard"){
    if(options.selected.length!==1){
      alert(getl("Please select 1 row"));
    }else if(options.isDirty){
      myk8.message(getl('please, save record'),"alert");
    }else{
      myk8.show_customerbusinesscard({"dat":options.dat});
    }
  }else if(value=="insert"){
    // open overlay
    var ov_form={
      "templatetype":"form",
      "selector":".k8-overlay_content",
      "form":{"id":"dialog_form"},
      "fields":[
        {"name":"mycontent","tagName":"textarea","required":true},
        {"name":"OK","type":"submit","tagName":"button","fieldclass":"btn btn-primary"}
      ]
    };
    var el_overlay=myk8.createOverlay({});
    myk8.createform(ov_form);
    var el_form=document.getElementById("dialog_form");
    el_form.addEventListener("submit", function(e){
      e.preventDefault();
      var obj=form2obj(el_form);
      $(el_overlay).remove();
      //console.log("mycontent="+obj.mycontent);
      //console.log("content hex="+convertToHex(obj.mycontent));
      var dat={};
      var arr=obj.mycontent.split(/\r?\n/);
      for(var i=0;i<arr.length;i++) {
        var temp=arr[i];
        if(!gbnull(temp)){
          var oType=getoType(temp);
          console.log(i+":"+arr[i]);
          var bnumber=/\d/.test(temp);
          if(bnumber){
            bnumberstart=/\d/.test(temp.trim().substr(0,1));
            bnumberend=/\d/.test(temp.trim().substr(-1));
          }

          if(gbnull(oType)){
            if(i==0){
              dat['name1']=temp;
            }else if(bnumber){
              if(bnumberend){
                dat['street']=temp;
              }else if(bnumberstart){
                // search last caracter
                for(var j=0;j<temp.length;j++){
                  if(isNaN(temp.substr(j,1)) || temp.substr(j,1)==" "){
                  //if(a || b){
                    break;
                  }
                }
                dat['code']=temp.substr(0,j).trim();
                dat['city']=temp.substr(j).trim();
              }else{
                // number in middle
                dat['name2']=temp;
              }
            }else{  
              dat['name2']=arr[i];
            }
          }else{
            dat[oType.type]=oType.value;
          }
        }
      }
      console.log(dat);
      //var dat={"name1":"Hugo","city":"Burscheid"};
      delete(options.row_actual);
      masterdata.newRecordExt(dat);
      //options.display_record(dat);
      //masterdata.insertRecord(dat,"","first");
    });
  }
}

function getoType(temp){
  var tsearch=temp.toUpperCase();
  var searchobject=[
    {type:"street","searches":["STREET:","STRAßE:"]},
    {type:"city","searches":["CITY:"]},
    {type:"phone","searches":["PHONE:","PHONE","TELEPHONE:","TELEPHONE","TELEFON:","TELEFON"]},
    {type:"fax","searches":["FAX:","FAX"]},
    {type:"email","searches":["EMAIL:","EMAIL"]},
    {type:"website","searches":["WEBSITE:","WEBSITE ","WEBPAGE:","WEBPAGE ","WEBSEITE:","WEBSEITE "]}
  ];
  for(var i=0;i<searchobject.length;i++){
    for(var j=0;j<searchobject[i]['searches'].length;j++){
      var searchstring=searchobject[i]['searches'][j];
      var pos=tsearch.indexOf(searchstring);
      if(pos>-1){
        value=temp.substr(pos+searchstring.length);
        return {"type":searchobject[i].type,"value":value.trim()};
      }
    }
  }
  var pos=temp.indexOf('@');
  if(pos>-1){
    return {"type":"email","value":temp.trim()};
  }
  var pos=temp.indexOf('http');
  if(pos>-1){
    return {"type":"website","value":temp.trim()};
  }
  return 0;
}

function convertToHex(str) {
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ' '+str.charCodeAt(i).toString(16);
    }
    return hex;
}