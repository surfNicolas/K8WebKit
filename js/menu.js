/*
var titel_language="<span class=\"flag-icon flag-icon-us\"></span>";
switch(GLOBALS_language){
  case 'de':
    titel_language="<span class=\"flag-icon flag-icon-de\"></span>";
}
*/
var titel_language=GLOBALS_languages[GLOBALS_language]['flag'];
var page_object=getfromArray(pages,page,{});
var langchoice=getfromArray(page_object,"langchoice",true);

var menu_js=[
    {
      "ID":"200",
      "title":getl("Examples"),
      "condition":true,
      "children":[
        {
          "ID":"201",
          "href":"index.php?page=masterdata&datadefID=1",
          "title":getl("Persons")
        },
        /*
        {
          "page":"basic",
          "title":getl("Basics")
        },
        {
          "page":"item_list",
          "title":getl("Items")
        },
        {
          "title":getl("Customer"),
          "href":"index.php?page=masterdata&datadefID=customer"
        },
        {
          "href":"index.php?page=catalog&datadefID=k8components",
          "title":getl("Catalog")
        },
        {
          "title":getl("Members"),
          "href":"index.php?page=member&layout=member&datadefID=k8components",
          "li_class": gbnull(userID)?"disabled":""
        },
        {
          "page":"invoice",
          "title":getl("Invoice")
        },
        {
          "page":"customerturnover",
          "title":getl("Customer turn over")
        }
        */
      ]
    },
    {
      "ID":"200",
      "title":getl("Member"),
      "condition":true,
      "children":[
        {
          "href":"index.php?page=login",
          /*"li_class": gbnull(userID)?"":"disabled",*/
          "title":getl("Login")
        },
        {
          "href":"index.php?submit=Logout",
          "li_class": gbnull(userID)?"disabled":"",
          "title":getl("Logout")
        },
        {
          "title":GLOBALS_pagelinks.membership.title,
          "href":GLOBALS_pagelinks.membership.href,
          "condition":!gbnull(userID)
        },
        {
          "title":getl('My Data'),
          "page":"mydata",
          "condition":!gbnull(userID)
        },
        {
          "title":getl("My Items"),
          "href":GLOBALS_hostpath+"index.php?page=catalog&datadefID=k8componentsfilterbutton",
          "active_by":"url",
          "li_class": gbnull(userID)?"disabled":""
        }
      ]
    },
    {
      "title":getl('Register'),
      "page":"register",
      "condition":gbnull(userID)
    }
  ];
    
var menu=[];
if(superuser)menu.push(
  {
    "ID":"150",
    "title":getl("Elements online"),
    "children":[
      {
        "title":getl("Elements online"),
        "href":GLOBALS_hostpath+GLOBALS_indexfile+"?page=masterdata&datadefID=k8datadefinitions"
      },
      {
        "title":getl("Group definition"),
        "href":GLOBALS_hostpath+"index.php?page=masterdata&datadefID=k8groupdefinitions"
      },
      {
        "title":getl("User groups"),
        "href":GLOBALS_hostpath+"index.php?page=usergroups"
      },
      {
        "title":getl("Menu"),
        "href":GLOBALS_hostpath+GLOBALS_indexfile+"?page=treeview&datadefID=k8menuentries"
      }        
    ]
  }
);
if((GLOBALS_menumode==2 || GLOBALS_menumode==3 || GLOBALS_menumode==4) && k8menudisp.length>0)menu.unshift(...k8menudisp);
if(GLOBALS_menumode==1 || GLOBALS_menumode==3 || GLOBALS_menumode==4)menu.push(...menu_js);
menu.push(
    {
      "title":getl("Admin"),
      "condition":(superuser || admin),
      "children":[
        {
          "page":"basic",
          "title":getl("Basics")
        },
        {
          "title":getl("User list"),
          "page":"user_list",
        },
        {
          "title":getl("Pages"),
          "href":GLOBALS_indexfile+"?page=masterdata&datadefID=k8pages"
        },
        {
          "title":getl("Menu"),
          "href":GLOBALS_indexfile+"?page=masterdata&datadefID=k8menuentries",
          "condition":"GLOBALS_menumode==2 || GLOBALS_menumode==3"
        },
        {
          "title":getl("Clients"),
          "href":GLOBALS_indexfile+"?page=masterdata&datadefID=k8clients",
          "condition":"GLOBALS_rightmode==1 && superuser"
        },
        {
          "title":getl("Right groups"),
          "href":GLOBALS_indexfile+"?page=masterdata&datadefID=k8rightgroups",
          "condition":"GLOBALS_rightmode==2"
        }
      ]
    },
    {
      "ID":"998",
      "title":getl("Translation"),
      "href":"index.php?page=translation"
    }
);

var options={
  "selector":".mynavi .navbar-nav",
  "pages":pages,
  "menu":menu
};

// languages
if(Object.keys(GLOBALS_languages).length>1 && langchoice){
  menu_lang={
    "ID":"700",
    "title":titel_language,
    "children":[]
  };
  for(prop in GLOBALS_languages){
    if(GLOBALS_languages.hasOwnProperty(prop)){
      var obj_lang=GLOBALS_languages[prop];
      var menu_entry={
        "title":obj_lang['flag']+"  "+obj_lang['label'],
        "active_by":"none",
        "condition":"GLOBALS_language!='"+prop+"'",
        "a_attributes": "class=\"dropdown-item\" onclick=\"lang2url('"+prop+"')\""
      };
      menu_lang.children.push(menu_entry);
    }
  }
  options.menu.push(menu_lang);
}

if(bwithpagetimer){
  options.menu.push(
    {
        "ID":"800",
        "li_attributes":"id=\"pagetimer\"",
    }    
  );
}

const menu_bsp=Object.create(k8);
menu_bsp.createbsmenu(options);

function lang2url(language){
    if (window.history.replaceState) {
        var baseurl='';
        var baseqry="";
        if(window.location.href.indexOf('?')>-1){
            baseurl=window.location.href.split('?')[0];
            var obj=Array_GET();
            var bin=false;
            for(var prop in obj){
                if(obj.hasOwnProperty(prop)){
                    if(prop=="domain_language"){
                        baseqry+='&'+prop+'='+language;
                        bin=true;
                    }else{
                        baseqry+='&'+prop+'='+obj[prop];
                    }
                }
            }
            if(!bin)baseqry+='&domain_language='+language;
        }else{
            baseqry='&domain_language='+language;
        }
        var url=baseurl+'?'+baseqry.substr(1);
        window.location.href=url;
    }        
}
function build_href(options){
  // options
  //  .href
  //  .elements
  //  .urlmode
  elements_array=['masterdata','list','treeview','listedit','form','simpledata','catalog','detail','lineedit','chartjs'];
  let url='';
  let urlmode=Number(getfromArray(options,'urlmode',GLOBALS_urlmode));
  if(urlmode==1){
    if(options.href){
      //page=detail&datadefID=k8pages&marking=pre_form
      let querystring=options.href;
      let arr=options.href.split('?');
      if(arr.length>1)querystring=arr[1];
      url=GLOBALS_hostpath;
      let parameters=k8.query_str_to_obj(querystring);
      if(isset(parameters,'page')){
        if(parameters.page=='catalog'){
          url+=getfromArray(parameters,'datadefID');
        }else if(parameters.page=='detail'){
          url+=getfromArray(parameters,'datadefID');
          if(isset(parameters,'marking')){
            url=gsclauseand(url,parameters.marking,true,'/');
          }else if(isset(parameters,'keyvalue')){
            console.log('menu keyvalue not supported');
          }else if(isset(parameters,'displayvalue')){
            url=gsclauseand(url,parameters.displayvalue,true,'/');
          }
        }else if(elements_array.includes(parameters.page)){
          url+='e/'+parameters.page;
          let datadefID=getfromArray(parameters,'datadefID');
          url=gsclauseand(url,datadefID,!gbnull(datadefID),'/');
        }else{
          url+='p/'+parameters.page;
        }
      }
    }else if(options.elements){
      url=GLOBALS_hostpath+options.element.join('/');
    }      
  }else{
    // urlmode=0
    if(options.href){
      let querystring=options.href;
      let arr=options.href.split('?');
      if(arr.length>1)querystring=arr[1];
      url=GLOBALS_hostpath+GLOBALS_indexfile+"?"+querystring;
    }else if(options.elements){
      url=GLOBALS_hostpath+GLOBALS_indexfile;
      if(options.elements.length==1){
        url+='?page=catalog&datadefID='+options.elements[0];
      }else if(options.elements.length>=2){
        if(options.elements[0]=="p"){
          url+="?p/"+options.elements[1];
        }else if($urlslashparts[0]=="e"){
          if(count($urlslashparts)>=3){
            url+="?page="+options.elements[1]+'&datadefID='+options.elements[2];
          }
          if(count($urlslashparts)>=4){
            url+="&displayvalue="+options.elements[3];
          }
        }else{
          url+='?page=catalog&datadefID='+options.elements[0]+'&displayvalue='+options.elements[1];
        }
      }  
    }
  }
  return url;
}