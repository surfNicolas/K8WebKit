if(GLOBALS_pages_html1.includes(page) || page=="catalog" || page=="member" || !gbnull(site)){
  
  settings.masterdata.cbcatAfterContainer=function(options){
    var el_list=options.el_list;
    var settings=options.settings;
    var el_search=document.getElementById('search');
    var search=getfromArray(GET,"search");
    if(el_search){
      
      var el_form=el_search.form;
      el_form.elements.namedItem('datadefID').value=(datadefID<0 ? 0:datadefID);
      el_form.elements.namedItem('page').value=page;
      el_form.elements.namedItem('search').value=search;
      // for datadefinition on the fly
      if(el_form.elements.namedItem('table')) el_form.elements.namedItem('table').value=getfromArray(GET,'table');
      if(el_form.elements.namedItem('headtitlecolumn'))el_form.elements.namedItem('headtitlecolumn').value=getfromArray(GET,'headtitlecolumn');
      if(el_form.elements.namedItem('headdescriptioncolumn'))el_form.elements.namedItem('headdescriptioncolumn').value=getfromArray(GET,'headdescriptioncolumn');
      console.log(GET);
      for(var prop in GET){
        if(el_form.elements.namedItem(prop)){
          // already done above el_form.elements.namedItem(prop)=GET[prop];
        }else{
          var el=document.createElement('input');
          el.type="hidden";
          el.name=prop;
          el.value=GET[prop];
          el_form.appendChild(el);
        }
      }

      var search_internal=getfromArray(settings.masterdata,'search_internal',false);
      if(search_internal){
        el_search.addEventListener('click',(e)=>{
          e.preventDefault();
          var search=el_search.value;
          searchExpression(settings,el_search.search);
        });
      }else{
        var search=getfromArray(GET,'search');
        searchExpression(settings,el_search,search);
      }
    }
  }            
  
  settings.masterdata.cbcatLoad=function(options){
    //var settings=options.settings;
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
}

function searchExpression(settings,el_search,search){
  console.log("searchExpression");
  if(gbnull(search)){
    if(isset(settings,'html','catalog','blank'+GLOBALS_language)){
      var html='blank'+GLOBALS_language;
      settings.html.catalog.blank=settings.html.catalog['blank'+GLOBALS_language];
    }
    settings.return={};
    settings.return.bblank=true;
  }else{
    var keywordarray=[];
    if(isNaN(search)){
      keywordarray=search.split(/[ ,]+/);
    }else{
      keywordarray=[search];
    }
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
    }
  }
}