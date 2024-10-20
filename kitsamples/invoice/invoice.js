// bootstrap 5 and tabulator 5.x
// settingscustomer
"use strict";
var myk8=Object.create(k8);
var key=getfromArray(Array_GET(),'key');
var action=getfromArray(Array_GET(),'action');

var docdate=new Date();
settingsinvoice.masterdata.defaultvalues={"docdate":docdate.asString()};

myk8.initFormfields(settingsinvoice.k8form);
//console.log(settingsinvoice.k8form.formcollection['customer']);
settingscustomer.masterdata.menuleftobj.displaymode="atlink";
/*
myk8.formcollection['customer_search'].inputgroup.fields[0].dropdown=settingscustomer.masterdata.menuleftobj;
myk8.formcollection['customer_search'].inputgroup.fields[0].dropdown.button.stlye="background-color: #e9ecef; border: 1px solid #ced4da; border-radius: 0.25rem 0 0 0.25rem"
myk8.formcollection['customer_search'].inputgroup.fields[0].dropdown.button.stlye="border: 1px solid #ced4da; border-radius: 0.25rem 0 0 0.25rem"
*/
settingsinvoice.k8form.formcollection['customer_search'].inputgroup.fields[0].dropdown=settingscustomer.masterdata.menuleftobj;
settingsinvoice.k8form.formcollection['customer_search'].inputgroup.fields[0].dropdown.button.stlye="background-color: #e9ecef; border: 1px solid #ced4da; border-radius: 0.25rem 0 0 0.25rem"
settingsinvoice.k8form.formcollection['customer_search'].inputgroup.fields[0].dropdown.button.stlye="border: 1px solid #ced4da; border-radius: 0.25rem 0 0 0.25rem"

//myk8.formcollection['customer_search'].inputgroup.fields[0].style="background-color: #e9ecef; border: 1px solid #ced4da; border-radius: 0.25rem 0 0 0.25rem";

if(!gbnull(key) || action=='New'){
  settingsinvoice.masterdata.notabulator=true;
  settingsinvoice.masterdata.keyvalue=key;
}
settingsinvoice.masterdata.ondelete=function(el_rec_record,el_rec_container){
    //data-rec_object="items"
    var el_form=$(el_rec_container).parents('form')[0];
    var el=el_form.elements.namedItem('amount_gross');
    var value=calculateSum(el_form,el_rec_container,'items','pricetotal');
    gFormatinputfordisplay(el,value);
};

/*
settingsinvoice.masterdata.menulefthtml=
        '<div class="dropdown element">'+
        '  <button type="button" class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">'+
        '  </button>'+
                '<ul class="dropdown-menu" style="z-index: 10000000">'+
                '    <li><a class="dropdown-item js js_menuleft js_pdf_example" href="#">PDF</a></li>'+
                '</ul>'+
        '</div>';

settingsinvoice.masterdata.dataMenuleft=function(el_md,e,row_actual){
    var el=e.target;
    //var bselectable=$(el_md).find('.js_selectmode')[0].checked;
    //var selected=masterdata.tableTab.getSelectedRows();
    var selected=[];
    if(row_actual)selected.push(row_actual);
    
    if(el.classList.contains('js_filter2clipboard')){
    }else if(el.classList.contains('js_pdf_example')){
      if(selected.length==1){
        var myrow=selected[0];
        var parameter='';
        var keyvalue=myrow.getData()['docID'];
        if(gbnull(keyvalue)){
          alert('key not set!');
        }else{
          var url='../'.repeat(GLOBALS_script_depth)+'masterdata/ProcessData.php?jsonfile=kitsamples/invoice/pdf_invoice.json&datadefID=invoice&process_action=pdf&keyvalue='+keyvalue;
          var w=window.open(url,"PDF",parameter);
          w.focus();
        }
      }else{
        alert("please select 1 row");
      }
    }
};
*/
settingsinvoice.masterdata.cbMenuleft=function(options){
  var selected=options.selected;
  var e=options.e;
  var el=e.target;
  var value=getfromArray(el.dataset,"value");
  if(value=="PDF"){
    if(options.settings.masterdata.notabulator){
      displayPDF(getfromArray(options.dat_form,'docID'));
    }else{
      if(selected.length==1){
        var myrow=selected[0];
        var keyvalue=myrow.getData()['docID'];
        displayPDF(keyvalue);
      }else{
        alert("please select 1 row");
      }
    }
  }
  
  function displayPDF(keyvalue){
    if(gbnull(keyvalue)){
      alert('key not set!');
    }else{
      var parameter='';
      var url='../'.repeat(GLOBALS_script_depth)+'masterdata/ProcessData.php?jsonfile=kitsamples/invoice/pdf_invoice.json&datadefID=invoice&process_action=pdf&keyvalue='+keyvalue;
      var w=window.open(url,"PDF",parameter);
      w.focus();
    }
    
  }
};


settingsinvoice.masterdata.dataPrepareSave=function(el_md){
    var childs=$(el_md).find('.js_items')[0].children;
    var el_form=$(el_md).find('.js_dataform')[0];
    var index=0;
    for(var i=0;i<childs.length;i++){
        var bok=true;
        var rec_index=childs[i].dataset.rec_index;
        var el=$(childs[i]).find('input[name="items['+rec_index+'][sort]"]')[0];
        if(i==childs.length-1){
          var obj={'position':el_form.elements.namedItem("items["+rec_index+"][position]").value,
            'componentnumber':el_form.elements.namedItem("items["+rec_index+"][componentnumber]").value,
            'text1':el_form.elements.namedItem("items["+rec_index+"][text1]").value,
            'quantity':el_form.elements.namedItem("items["+rec_index+"][quantity]").value,
            'pricetotal':el_form.elements.namedItem("items["+rec_index+"][pricetotal]").value
          };
          bok=!gbEmptyStructure(obj);
        }
        if(bok)el.value=index;
        index++;
    }
};

settingsinvoice.masterdata.dataCreateStructure=function(el_md,dat,settings){
  $('.js_items').sortable();

  // dropdown
  var el_form=$(el_md).find('.js_dataform')[0];
  $(el_form).find(".dropdown-item").on("click",function(e){
    let el=e.target;
    let el_form=$(el).parents('form')[0];
    let accountID=el_form.elements.namedItem('accountID').value;
    let action=getfromArray(el.dataset,'action',getfromArray(el.dataset,'value'));
    console.log('action='+action);
    switch(action){
      case 'remove':
        searchBox_delete(el);
        break;
      case 'edit':
        if(gbnull(accountID)){
          alert("no partner set");
        }else{
          //window.open(settingscustomer.masterdata.url_master+'&keyvalue='+accountID, '_blank');
          let partnernumber=el_form.elements.namedItem('partnernumber').value;
          window.open(settingscustomer.masterdata.url_master+'&bselect=1'+'&filters[0][field]=accountnumber&filters[0][type]=like&filters[0][value]='+partnernumber, '_blank');
        }
        break;
      case 'businesscard':
        let dat={accountID:accountID};
        if(gbnull(accountID)){
          alert("no partner set");
        }else{
          //myk8.show_customerbusinesscard({"dat":dat});
          myk8.show_customerbusinesscard({"settingscustomer":settingscustomer,"accountID":accountID});
        }
        break;
    }
  });
};

settingsinvoice.masterdata.dataChange=function(el_md,el){
    var el_form=el.form;
    var name=getSubName('name',el.name);
    var namestr=getSubName('namestr',el.name);
    switch(name){
      case 'partnernumber':
        searchbox_search(el,undefined,undefined,settingscustomer);
        break;
      case 'partnername':
        searchbox_search(el,undefined,undefined,settingscustomer,undefined,true);
        break;
      case 'items.quantity':
      case 'items.pricesingle':
        calculateTotal(el_form,namestr,name);
        break;
    }
};

if(page=='form'){
    settingsinvoice.masterdata.notabulator=true;
    settingsinvoice.masterdata.keyvalue=getfromArray(GET,'keyvalue');
}else if(page=='list'){
    settingsinvoice.masterdata.bnoform=true
    settingsinvoice.tabulator.height="100%";
}    
var selector=getfromArray(settingsinvoice.masterdata,'selector','#masterdata1');
var masterdata=$(selector).masterdata(settingsinvoice);

var actions=$(".js_rec_action");
$(actions).on("click",function(e){
  var el=e.target;
  var el_form=$(el).parents('form')[0];
  var dat=$(el_form).serializeJSON({checkboxUncheckedValue: "0"});
  var el_action=$(el).parents("[data-action]")[0];
  var action=el_action.dataset.action;
  console.log(action);
  switch(action){
    case "searchBox_open_customer":
      searchBox_open(el,undefined,undefined,settingscustomer);
      break;
  }
});
    
function calculateTotal(el_form,namestr,name){
    var el=el_form.elements.namedItem(namestr+'[pricetotal]');
    var value=el_form.elements.namedItem(namestr+'[pricesingle]').value*el_form.elements.namedItem(namestr+'[quantity]').value;
    gFormatinputfordisplay(el,value);

    // calculate sum
    var el_rec_container=$(el).parents(".js_rec_container")[0];
    var el=el_form.elements.namedItem('amount_gross');
    var value=calculateSum(el_form,el_rec_container,'items','pricetotal');
    gFormatinputfordisplay(el,value);
}  

function calculateSum(el_form,el_rec_container,areastr,column){
    var max=Number(el_rec_container.dataset.rec_indexmax);
    var sum=0;
    var el;
    for(var i=0;i<=max;i++){
        el=el_form.elements.namedItem(areastr+'['+i+']['+column+']');
        if(el){
            sum=sum+Number(el.value);
        }
    }
    return sum;
}

function item_search(el){
    if(!$(el).hasClass('js_disabled')){
        // getting parent record
        var el_form=$(el).parents('form')[0];
        var el_rec_record=$(el).parents('.js_rec_record')[0];
        var index=Number(el_rec_record.dataset.rec_index);
        var obj={"function_name":"insertComponent","index":index,"form":el_form};
        settingsk8components['js_return']=obj;
        //settingsk8components.tabulator.selectable=false;
        $('body').searchbox(settingsk8components);
    }
}

function insertComponent(obj){
    var namestr="items["+obj.js_return.index+"]";
    var el_form=obj.js_return.form;
    var name="items.pricesingle";
    el_form.elements.namedItem(namestr+'[position]').value=obj.js_return.index+1;
    el_form.elements.namedItem(namestr+'[componentID]').value=obj.data.componentID;
    el_form.elements.namedItem(namestr+'[componentnumber]').value=obj.data.componentnumber;
    el_form.elements.namedItem(namestr+'[text1]').value=obj.data.text1;
    el_form.elements.namedItem(namestr+'[quantity]').value=1;
    el_form.elements.namedItem(namestr+'[salesunit]').value=obj.data.salesunit;
    el_form.elements.namedItem(namestr+'[pricesingle]').value=obj.data.price;
    calculateTotal(el_form,namestr,name);
}