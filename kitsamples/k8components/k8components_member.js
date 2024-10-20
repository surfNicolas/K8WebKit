$('#layout1').html(settings.html['member']['layout']);
//if(!gbnull(layout))$('#layout1').html(settings.html['member']['layout']);
//if(layout=='member'){
    //settingsk8components.masterdata.edittype=9;
    settingsk8components.masterdata.edittype=2;
    settingsk8components.masterdata.edit_selector='#edit';
    settingsk8components.masterdata.search_internal=true;
    delete(settingsk8components.html.catalog.blank);
    
    //settings.masterdata.edittype=9;
    settings.masterdata.search_mode=0;
    settings.masterdata.editreload=true;
    settings.masterdata.disprecdirect=1;
    if(settings.html.catalog.blankde)delete(settings.html.catalog.blankde);

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
$('.js_catalog.js_rec_head').hide();
$('#catalog_prepared .js_member.js_rec_head').show();