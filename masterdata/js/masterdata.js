// K8 Web Construction Kit, 2022-06-11 Copyright Klaus Eisert
//"use strict";

/*
JSONForm.fieldTypes['htmlsnippet'] = {
    template: '<%=node.value%>'
};
*/

(function($){
$.fn.myPlugin = function(options) {
    // support multiple elements
    if (this.length > 1){
        this.each(function(){ 
            $(this).myPlugin(options);
        });
        return this;
    }

    // private variables
    var pOne = '1';
    var pTwo = '2';
    // ...

    // private methods
    var foo = function() {
        // do something ...
    };
    // ...

    // public methods        
    this.initialize = function() {
        // do something ...
        return this;
    };

    this.bar = function() {
        console.log('bar');
    };
    return this.initialize();
};
})(jQuery);


/*  --------------- customizeMenuItem
var menu=[
  {
    "ID":"0",
    "url":"index.php",
    "target":"",
    "title":"Home",
    "condition":"jscode für eval",
    "children":[]
  },
  {
    "ID":"1",
    "url":"index.php?page=Belege",
    "target":"",
    "title":"Belege",
    "condition":"",
    "children":[
      {
        "ID":"2",
        "url":"index.php?page=dddd",
        "target":"",
        "title":"dddd",
        "condition":"jscode für eval",
        "children":[
        ]
      }
    ]
  }
];

// mode -1=entfernen, 0=ersetzen, 1=anfügen
var changes=[
  {
    "IDreference":"2",
    "mode":0,
    "menu":[{
      "ID":"1001",
      "url":"index.php?page=BelegeNeu",
      "target":"",
      "title":"Belege Neu",
      "condition":"jscode für eval",
      "children":[]
    }]
  }  
];
customizeMenu(menu,changes);
console.log(menu);
*/

function cb(settings,cbfunction,options){
  var ret;
  if(settings.masterdata[cbfunction]) {
    if(Array.isArray(settings.masterdata[cbfunction])){
      for(var i=0;i<settings.masterdata[cbfunction].length;i++){
        ret=settings.masterdata[cbfunction][i](options);
      }
    }else{
      ret=settings.masterdata[cbfunction](options);
    }
  }
  return ret;
}

function k8tabulatorformatter(cell, formatterParams, onRendered){
  let text;
  //  if(cell.getValue()){
  if(cell){
    text=cell.getValue();
    let mytype=getfromArray(formatterParams,'type',"color");
    switch(mytype){
    case "color":
      //console.log(cell);
      let arr=formatterParams.values;
      if(arr){
        let value=''
        //if(cell.getValue()!==null && cell.getValue()!=="undefined")value=cell.getValue().toString();
        if(cell.getValue())value=cell.getValue().toString();
        if(arr[value]){
          let defaultfontcolor=getfromArray(formatterParams,"defaultfontcolor","#000000");
          let setbackgroundcolor=getfromArray(formatterParams,"setbackgroundcolor",true);
          if(setbackgroundcolor)cell.getElement().style.backgroundColor = arr[value].backgroundcolor;
          cell.getElement().style.color = getfromArray(arr[value],'fontcolor',defaultfontcolor);
          if(arr[value].text)text=arr[value].text;
        }else{
          text="";
        }
      }
    }
  }
  return text;
}

function bCatalogCall(){
  const catalog_datadefID=localStorage.getItem("catalog_datadefID");
  localStorage.removeItem("catalog_datadefID");
  return !gbnull(catalog_datadefID);
}

async function postData(url = "", data = {}) {
  //console.log(data);
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects  });
}

function getLuxonLocaleDateString(){
  var mydate=new Date(2000,12-1,31);
  var str=mydate.toLocaleDateString();
  str=str.replace("31","dd");
  str=str.replace("12","MM");
  str=str.replace("2000","yyyy");
  return str;
}

function getLuxonLocaleTimeString(){
  var mydate=new Date(2000,12-1,31,10,0,0);
	if(mydate.toLocaleTimeString().indexOf('AM')==-1){
  	return "HH:mm";
  }else{
  	return "hh:mm a";
  }
}

function getMomentLocaleDateString(){
  var mydate=new Date(2000,12-1,31);
  var str=mydate.toLocaleDateString();
  str=str.replace("31","DD");
  str=str.replace("12","MM");
  str=str.replace("2000","YYYY");
  return str;
}

function getMomentLocaleTimeString(){
  var mydate=new Date(2000,12-1,31,10,0,0);
	if(mydate.toLocaleTimeString().indexOf('AM')==-1){
  	return "hh:mm";
  }else{
  	return "h:mma";
  }
}

function customizeMenu(menu,changes){
  for(var i=0;i<changes.length;i++){
    customizeMenuItem(menu,changes[i]);
  }
}

function customizeMenuItem(menu,item){
  var prop=item['IDreference'];
  var i=0;
  while(i<menu.length){
    if(menu[i]['ID']==prop){
      switch(item['mode']){
        case -1: //delete
          delete(menu[i]);
          break;
        case 0: //replace
          menu[i]=item['menu'][0];
          break;
        default: //append
          for(var n=0;n<item['menu'].length;n++){
            menu.splice(i+1,0,item['menu'][n]);
            i++;
          }
      }
    }else{
      if(menu[i]['children']){
        customizeMenuItem(menu[i]['children'],item)
      }
    }
    i++;
  }
}

/*  --------------- arraySortByArray
var array=[
        {title:"Name", field:"name", editor:"input"},
        {title:"Gender", field:"gender", width:95, editor:"select", editorParams:{values:["male", "female"]}},
        {title:"Rating", field:"rating", formatter:"star", hozAlign:"center", width:100, editor:true},
        {title:"Driver", field:"car", width:90,  hozAlign:"center", formatter:"tickCross", sorter:"boolean", editor:true},
    ];
var array_order=["car","gender","name","rating"];
array=arraySortByArray(array,"field",array_order);
console.log(array);
*/
function arraySortByArray(array,prop,array_order){
	return array.sort(function (a, b){
    if(array_order.indexOf(a[prop])>array_order.indexOf(b[prop])){
        return 1;
    }else{
        return -1;
    }
    return 0;
  });
}

function getIndexarray(el_rec_record){
  var indexarray=[];
  var el_rec_lfd=el_rec_record;
  do{
      var el_rec_contlfd=$(el_rec_lfd).parents('.js_rec_container')[0];
      var indexlfd=Number(el_rec_lfd.dataset.rec_index);
      var arrayname=el_rec_contlfd.dataset.rec_object;
      if(!gbnull(arrayname)){
        indexarray.unshift(indexlfd);
        indexarray.unshift(arrayname);
      }else{
        indexarray.unshift(indexlfd);
      }
      el_rec_lfd=$(el_rec_contlfd).parents('.js_rec_record')[0];
  }while(typeof(el_rec_lfd)!=="undefined");
  return indexarray;
}

function getArrayIndexfromValue(arr,field,value){
    var index=-1;
    if(Array.isArray(arr)){
        for(var i=0;i<arr.length;i++){
            if(isset(arr[i],field)){
                if(arr[i][field]==value){
                    index=i;
                    break;
                }
            }
        }
    }
    return index;
}

function createfromindexarray(dat,indexarray){
  if(indexarray.length>0){
    if(!dat[indexarray[0]]){
      dat[indexarray[0]]={};
    }
    createfromindexarray(dat[indexarray[0]],indexarray.slice(1));
  }
}

function getArrayValuesfromArrayObjects(arr,prop){
  // PLEASE CHECK IT
  
    // arr=[{"name":"Hugo","number":1234},{"name":"Jane","number":3456}]
    // by prop=name: ["Hugo","Jane"]
    if(Array.isArray(arr)){
        var arrayValues=[];
        for(var i=0;i<arr.length;i++){
            if(isset(arr[i],prop)){
                arrayValues.push(arr[i][prop]);
            }
        }
    }
    return arrayValues;
}

/* examples*/
/*
var o={"number":4511,"items":[
    {"position":1,"times":[
        {"ID":1,"time":"10:00"},
        {"ID":2,"time":"10:00"}
      ]
    }
  ]
};
var fullname="items[0][position]";
//var indexes=["items",0,"position"];
var indexes=["items",0];
var o_sub=getObjectValuefromIndexArray(o,indexes);
console.log(o_sub);
//delete(o_sub);
//console.log(o);
//console.log(getIndexArrayfromName(fullname));
//console.log(getObjectValuefromName(o,fullname));
*/

function getObjectValuefromName(obj,fullname){
  var indexes=getIndexArrayfromName(fullname);
  //console.log(indexes);
  return getObjectValuefromIndexArray(obj,indexes);
}

function getObjectValuefromIndexArray(obj,indexes){
  //indexes=["items",0,"position"];
  var i=0;
  var onew=[];
  onew[i]=obj;
  //console.log(indexes)
  indexes.forEach(function(prop){
      i++;
      if(onew[i-1]){
        if(onew[i-1][prop]=='undefined'){
          return;
        }else{
          onew[i]=onew[i-1][prop];
        }
      }
  });
  return onew[i];
}

function getIndexArrayfromName(fullname){
  //items[0][itemID]
  var indexes=[];
  
  while(fullname.length>0){
    var pos1=fullname.indexOf('[');
    if(pos1>=0){
      var part1;
      if(pos1==0){
        var pos2=fullname.indexOf(']');
        part1=fullname.slice(pos1+1,pos2);
        fullname=fullname.substr(pos2+1);
    }else{
        var pos2=fullname.indexOf('[');
        part1=fullname.slice(0,pos2);
        fullname=fullname.substr(pos2);
      }
      indexes.push(part1);
    }else{
      fullname='';
    }
  }
  return indexes;
}

function getIndexPairs(el_rec_lfd){
  var indexes={};
  do{
      var el_rec_contlfd=$(el_rec_lfd).parents('.js_rec_container')[0];
      var indexlfd=Number(el_rec_lfd.dataset.rec_index);
      var arrayname=el_rec_contlfd.dataset.rec_object;
      indexes[arrayname]=indexlfd;
      el_rec_lfd=$(el_rec_contlfd).parents('.js_rec_record')[0];
  }while(typeof(el_rec_lfd)!=="undefined")
  return indexes;
}

function getNamestrfromindexarray(indexarray){
  var i=0;
  var namestr="";
  indexarray.forEach(function(prop){
      if(i==0){
        namestr+=prop;
      }else{
        namestr+="["+prop+"]";
      }
      i++;
  });
  return namestr;
}

function getIndexesfrom(el_rec_lfd){
  var index_arr=[];
  do{
      var el_rec_contlfd=$(el_rec_lfd).parents('.js_rec_container')[0];
      var indexlfd=Number(el_rec_lfd.dataset.rec_index);
      index_arr.push(indexlfd);
      var arrayname=el_rec_contlfd.dataset.rec_object;
      index_arr.push(arrayname);
      el_rec_lfd=$(el_rec_contlfd).parents('.js_rec_record')[0];
  }while(typeof(el_rec_lfd)!=="undefined")
  return index_arr;
}

function replaceElWith(el,html){
  var mydiv = document.createElement("div");
  mydiv.innerHTML = html;
  /*
  if(mydiv.childNodes.length>1){
    console.log("replaceElWith.error=only 1 child allowed!");
    return el;
  }else if(mydiv.childNodes.length>0){
    var myChild=mydiv.childNodes[0];
    el.parentNode.replaceChild(myChild,el);
    return myChild;
  */
  if(mydiv.children.length>1){
    console.log("replaceElWith.error=only 1 child allowed!");
    return el;
  }else if(mydiv.children.length>0){
    var myChild=mydiv.children[0];
    el.parentNode.replaceChild(myChild,el);
    return myChild;
  }else{
    return el;
  }
}

var k8pagetimer={
    interval:5000,
    maxtime:1000*60*20,
    idtimer:"pagetimer",
    format:"mm:ss", /*"HH:mm:ss",*/
    url_logout:"",
    url_login:"",
    mytime:0,
    el_timer:0,
    init:function(options){
        if(options.interval)this.interval=options.interval;
        if(options.maxtime)this.maxtime=options.maxtime;
        if(options.idtimer)this.idtimer=options.idtimer;
        if(options.format)this.format=options.format;
        if(options.url_logout){
            this.url_logout=options.url_logout;
        }else{
            console.log("url_logout not set!");
            return;
        }
        if(options.url_login){
            this.url_login=options.url_login;
        }else{
            console.log("url_login not set!");
            return;
        }
        this.mytime=this.maxtime;
        this.el_timer=document.getElementById(this.idtimer);
        if(this.el_timer)this.display();
    },
    reset:function(){
        this.mytime=this.maxtime;
        if(this.el_timer)this.display();
    },
    display:function(){
        var hours = Math.floor(this.mytime /(1000 * 60 * 60));
        var minutes = Math.floor((this.mytime % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((this.mytime % (1000 * 60)) / 1000);
        var temp=this.format.replace('hh',String(hours).padStart(2, '0'));
        temp=temp.replace('mm',String(minutes).padStart(2, '0'));
        temp=temp.replace('ss',String(seconds).padStart(2, '0'));
        this.el_timer.innerHTML = temp;
        
        // simple request, if online
        /*
        var el_timer=this.el_timer;
        $.getJSON("masterdata/ProcessData.php",function(oJson) {
          el_timer.style.background="green";
        })
        .fail(function(jqxhr, textStatus, error ) {
          el_timer.style.background="red";
        });		
        */
        
        /* // not working
        if(navigator.onLine){
          this.el_timer.style.background="green";
        }else{
          this.el_timer.style.background="red";
        }
        */
    }
};

var k8tabulator={
  accessor:function(value, data, type, params, column, row){
    //value - original value of the cell
    //data - the data for the row
    //type - the type of access occurring  (data|download|clipboard)
    //params - the accessorParams object passed from the column definition
    //column - column component for the column this accessor is bound to
    //row - row component for the row
    //tabulator_export
    
        if(value==null || typeof value=='undefined'){
          if(column.getDefinition().formatter=="money"){
            value=0;
          }else{
            value="";
          }
          return value;
        }else if(column.getDefinition().formatter=="money"){
            var obj=column.getDefinition();
            if(tabulator_export=="xlsx"){
              return Number(value);
            }else if(tabulator_export=="csv"){
              if(GLOBALS_decimal_point=='.'){
                return Number(value);
              }else if(typeof value=="string"){
                return value.replace('.',GLOBALS_decimal_point);
              }else{
                return value.toString().replace('.',GLOBALS_decimal_point);
              }
            }else if(tabulator_export=="pdf"){
              return k8formatter.format(obj,value);
            }else{
              return Number(value);
            }
        }else if(column.getDefinition().formatter=="datetime"){
            var formatterParams=column.getDefinition().formatterParams;
            var inputFormat = formatterParams.inputFormat || "yyyy-MM-dd HH:mm:ss";
            var outputFormat = formatterParams.outputFormat || "DD/MM/YYYY HH:mm:ss";
            var invalid = typeof formatterParams.invalidPlaceholder !== "undefined" ? formatterParams.invalidPlaceholder : "";

            //var newDatetime = moment(value, inputFormat);
            var newDatetime = luxon.DateTime.fromFormat(value, inputFormat);

            //if (newDatetime.isValid()) {
            if (newDatetime.isValid) {
                    return formatterParams.timezone ? newDatetime.tz(formatterParams.timezone).format(outputFormat) : newDatetime.toFormat(outputFormat);
            } else {

                    if (invalid === true) {
                            return value;
                    } else if (typeof invalid === "function") {
                            return invalid(value);
                    } else {
                            return invalid;
                    }
            }
        }else{
          return value;
        }
    }       
};

var k8tabulatorOLD={
    accessor:function(value, data, type, params, column, row){
	//value - original value of the cell
	//data - the data for the row
	//type - the type of access occurring  (data|download|clipboard)
	//params - the accessorParams object passed from the column definition
	//column - column component for the column this accessor is bound to
	//row - row component for the row
        if(value==null){
            value="";
        }else if(column.getDefinition().formatter=="money"){
            var params=column.getDefinition().formatterParams;
            if(params.precision==undefined){
                value=value.toString();
            }else{
                value=Number(value).toFixed(params.precision);
            }
            /*
            if(params.decimal!=undefined){
                value=value.replace(".",",");
            }
            if(params.thousand!=undefined){
                var thousand=getfromArray(params,"thousand",",");
                value=value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1'+thousand);
            }
            */
           return Number(value);
        }else if(column.getDefinition().formatter=="datetime"){
            var formatterParams=column.getDefinition().formatterParams;
            var inputFormat = formatterParams.inputFormat || "yyyy-MM-dd HH:mm:ss";
            var outputFormat = formatterParams.outputFormat || "DD/MM/YYYY HH:mm:ss";
            var invalid = typeof formatterParams.invalidPlaceholder !== "undefined" ? formatterParams.invalidPlaceholder : "";

            //var newDatetime = moment(value, inputFormat);
            var newDatetime = luxon.DateTime.fromFormat(value, inputFormat);

            //if (newDatetime.isValid()) {
            if (newDatetime.isValid) {
                    return formatterParams.timezone ? newDatetime.tz(formatterParams.timezone).format(outputFormat) : newDatetime.toFormat(outputFormat);
            } else {

                    if (invalid === true) {
                            return value;
                    } else if (typeof invalid === "function") {
                            return invalid(value);
                    } else {
                            return invalid;
                    }
            }
        }else{
            //value=k8tabulator.utf8decode(value);
        }
	return value;  //Math.floor(value); //return the new value for the cell data.
    },
    utf8encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },
    utf8decode : function (s) {
        /*
        var arr=s.split("");
        for(var i=0;i<arr.length;i++){
            //console.log(s.substr(i,1)+":"+s.charCodeAt(i));
            console.log(arr[i]+":"+arr[i].charCodeAt(0));
        }
        */
        return "s";
    }       
};


function checkdatadef(obj){
    if(isset(obj,"jsonform","schema")){
        for(prop in obj.jsonform.schema){
            if(obj.jsonform.schema.hasOwnProperty(prop)){
                console.log(prop)
                var field=obj.jsonform.schema[prop];
                if(field.hasOwnProperty("enum")){
                    var myenum=field.enum;
                    for(var i=0;i<myenum.length;i++){
                        myenum[i]=myenum[i].toString();
                    }
                }
            }            
        }
    }
}

function encode_obj(obj){
  let o={};
  for(var prop in obj){
    if(obj.hasOwnProperty(prop)){
      o[encodeURI(prop)]=obj[prop]
    }
  }
  return o;
}

function filter2url(headerfilters,selects,multiselect){
    if (window.history.replaceState) {
        var baseurl=window.location.href.split('?')[0];
        var baseqry="";
        //var objqry={};
        var obj=Array_GET();
        for(var prop in obj){
            if(obj.hasOwnProperty(prop)){
                if(prop.substring(0,8)!=="filters["){
                    baseqry+='&'+prop+'='+obj[prop];
                }
            }
        }
        obj.selects=selects;
        var qry=filter2querystring(headerfilters);
        if(gbnull(qry) && gbnull(baseqry)){
          if(baseurl!==window.location.href)window.history.replaceState(null, document.title, baseurl);
        }else{
            url=baseurl+'?'+baseqry.substr(1)+qry;
            if(url!==window.location.href)window.history.replaceState(null, document.title, url);
        }
    }        
}

function obj2url(objadd){
    if (window.history.replaceState) {
        var baseurl=window.location.href.split('?')[0];
        var baseqry="";
        var obj={...Array_GET(), ...objadd};
        for(var prop in obj){
            if(obj.hasOwnProperty(prop)){
              baseqry+='&'+prop+'='+obj[prop];
            }
        }
        var url=baseurl+'?'+baseqry.substr(1)
        window.history.replaceState(null, document.title, url);
    }        
}

function filter2querystring(filters){
    var qs="";
    for(var i=0;i<filters.length;i++){
        qs+='&filters['+i+'][field]='+filters[i]['field']+'&filters['+i+'][type]='+filters[i]['type']+'&filters['+i+'][value]='+filters[i]['value'];
    }
    return qs;
}

Date.prototype.asString = function(generalformat){
    generalformat= typeof generalformat !== 'undefined' ? generalformat : 0;
    var year = this.getFullYear();
    var month = '0' + (this.getMonth() + 1);
    month = month.slice(-2, (month.length - 2) + 3);
    var day = '0' + this.getDate();
    day = day.slice(-2, (day.length - 2) + 3);
    //var generalformat=1;    
    
    if(generalformat==1){
        return day + '.' + month + '.' + year;
    }else{
        return year + '-' + month + '-' + day;
    }
}
Date.prototype.asISOString = function(bwithseconds){
    bwithseconds= typeof bwithseconds !== 'undefined' ? bwithseconds : 0;
    var year = this.getFullYear();
    var month = '0' + (this.getMonth() + 1);
    month = month.slice(-2, (month.length - 2) + 3);
    var day = '0' + this.getDate();
    day = day.slice(-2, (day.length - 2) + 3);
    var hour= '0' + this.getHours();
    hour = hour.slice(-2, (hour.length - 2) + 3);
    var minute= '0' + this.getMinutes();
    minute = minute.slice(-2, (minute.length - 2) + 3);
    var second= '0' + this.getSeconds();
    second = second.slice(-2, (second.length - 2) + 3);
    var result=year + '-' + month + '-' + day + ' ' + hour +':'+minute
    if(bwithseconds)result+=':'+second;
    return result;
}

Date.prototype.asTime = function(nformat){
    var minutes = '0' + (this.getMinutes());
    minutes = minutes.slice(-2, (minutes.length - 2) + 3);
    var hours = '0' + (this.getHours());
    hours = hours.slice(-2, (hours.length - 2) + 3);
    
    return hours + ':' + minutes;
}

Date.prototype.add = function(count,format){
    // format:
    // 0 Millisekunden
    // 1 Sekunden
    // 2 Minuten
    // 3 Stunden
    // 4 Tage
    // 5 Wochen
    // 6 später Monate
    // 7 später Jahre
    switch(format){
    case 0:
        var milliseconds=count;
        break;
    case 1:
        var milliseconds=count*1000;
        break;
    case 2:
        var milliseconds=count*60*1000;
        break;
    case 3:
        var milliseconds=count*60*60*1000;
        break;
    case 4:
        var milliseconds=count*24*60*60*1000;
        break;
    case 5:
        var milliseconds=count*7*24*60*60*1000;
        break;
    default:
        var milliseconds=0;
    }
    //alert(milliseconds.toString()+'/'+count.toString()+'/'+format.toString());
    return this.setTime(this.getTime()+milliseconds);
}

Date.prototype.addtime = function(timestring){
    // timestring: 10:00
    var milliseconds=0;
    if(timestring.indexOf(':')>0){
        var arr=timestring.split(':');
        milliseconds=arr[0]*60*60*1000 + arr[1]*60*1000;
    }
    return this.setTime(this.getTime()+milliseconds);
}

Date.prototype.setDaytime = function(timestring){
    // timestring: 10:00
    var milliseconds=0;
    if(timestring.indexOf(':')>0){
        var arr=timestring.split(':');
    }
    var newdate=new Date(this.getFullYear(),this.getMonth(),this.getDate(),arr[0],arr[1],0,0);
    return this.setTime(newdate.getTime());
}

Date.prototype.difference = function(mydate,format,bint,ndec){
    // format:
    // 0 Millisekunden
    // 1 Sekunden
    // 2 Minuten
    // 3 Stunden
    // 4 Tage
    // 5 Wochen
    // 6 später Monate
    // 7 später Jahre
    bint= typeof bint !== 'undefined' ? bint : 0;
    //ndec= typeof ndec !== 'undefined' ? ndec : 9;
    
    var result=0;
    var milliseconds=mydate-this;
    //document.getElementById("output").innerHTML="from / to / milliseconds: " + mydate.asString(1) + " / " + this.asString(1) + " / " + milliseconds;

    switch(format){
    case 0:
        result= milliseconds;
        break;
    case 1:
        //result=Math.round(milliseconds/1000);
        //result=parseInt(milliseconds/1000);
        result=(milliseconds/1000);
        break;
    case 2:
        //result=Math.round(milliseconds/(60*1000));
        //result=parseInt(milliseconds/(60*1000));
        result=(milliseconds/(60*1000));
        break;
    case 3:
        //result=Math.round(milliseconds/(60*60*1000));
        //result=parseInt(milliseconds/(60*60*1000));
        result=(milliseconds/(60*60*1000));
        break;
    case 4:
        //result=Math.round(milliseconds/(24*60*60*1000));
        //+1 Stunde, wegen Sommerzeit 3600000
        //result=parseInt((milliseconds+3600000)/(24*60*60*1000));
        result=((milliseconds+3600000)/(24*60*60*1000));
        break;
    case 5:
        //result=Math.round(milliseconds/(7*24*60*60*1000));
        //+1 Stunde, wegen Sommerzeit 3600000
        //result=parseInt((milliseconds+3600000)/(7*24*60*60*1000));
        result=((milliseconds+3600000)/(7*24*60*60*1000));
        break;
    }
    if(bint){
        result=parseInt(result);
    }
    if(typeof ndec !== 'undefined'){
        result=ground(result,ndec);
    }
    return result;
}

function conditional_output(el,dat_cond){
  el_conditions=$(el).find('*[data-v_if]');
  for(var i=0;i<el_conditions.length;i++){
    var str=el_conditions[i].dataset.v_if;
    var mode=el_conditions[i].dataset.v_mode;
    mode=typeof mode !== 'undefined' ? mode : "empty";
    //console.log("str=" + str); 
   try{
      if(!eval(str)){
        switch(mode){
            case 'hide':
                $(el_conditions[i]).hide();
                break;
            case 'hidechildren':
                $(el_conditions[i]).children().hide();
                break;
            case 'remove':
                $(el_conditions[i]).remove();
                break;
            case 'empty':
                $(el_conditions[i]).empty();
                break;
        }
      }
    }
    catch(e){
      // error
      console.log('error by expression: '+str);
    }
  }
}        

function ground(value, dec, mode) {
    // mode 0=kaufmännisch, 1=aufrunden, 2=abrunden
    dec= typeof dec !== 'undefined' ? dec : 0;
    mode= typeof mode !== 'undefined' ? mode : 0;
    if(isNaN(value)){
        mydec=0;
    }else{
        if(mode==1){
            value=value+.4999999*Math.pow(10,-dec)
        }else if(mode==2){
            value=value-.5*Math.pow(10,-dec)
        }
        mydec=Math.round(value*Math.pow(10,dec))/Math.pow(10,dec);
    }
    return mydec;
}

function array2Options(arr,map){
    var html="";
    for(var i=0;i<arr.length;i++){
      var attributes="";
      if (typeof arr[i] === 'object'){
        var obj=arr[i];
        if(map){
          text=getfromArray(map,'text');
          for(column in map){
            if(map.hasOwnProperty(column)){
              if(map[column]=="selected"){
                if(obj[map[column]])attributes+=" selected";
              }else if(column=="text"){
                // look beneath
              }else{
                attributes+=" "+column+"=\""+obj[map[column]]+"\"";
              }
            }
          }          
          html+='<option{{attributes}}>'.replace('{{attributes}}',attributes)+getfromArray(arr[i],text)+'</option>';
        }else{
          for(prop in obj){
            if(obj.hasOwnProperty(prop)){
              if(prop=="selected"){
                if(obj[prop])attributes+=" selected";
              }else if(prop=="text"){
                // look beneath
              }else{
                attributes+=" "+prop+"=\""+obj[prop]+"\"";
              }
            }
          }
          html+='<option{{attributes}}>'.replace('{{attributes}}',attributes)+getfromArray(arr[i],"text")+'</option>';
        }
      }else{
        html+='<option>'+arr[i]+'</option>';
      }
    }
    return html;
}

function options2Select(el,arr,value){
    $(el).empty(); // remove old options
    for(var i=0;i<arr.length;i++) {
        if(arr[i]){
          let selected=false;
          if(value){
            if(isset(arr[i],"value")){
              selected=(arr[i].value==value);
            }else{
              selected=(arr[i].text==value);
            }
          }
          let el_option=document.createElement('option')
          if(selected)el_option.selected=selected;
          if(isset(arr[i],"value"))el_option.setAttribute("value",arr[i].value);
          el_option.innerHTML=arr[i].text;
          el.appendChild(el_option);
          /*
          if(selected){
            if(isset(arr[i],"value")){
              $(el).append($("<option></option>")
                 .attr("value", arr[i].value)
                 .text(arr[i].text))
                 .attr("selected", true);
            }else{
              $(el).append($("<option></option>")
                 .text(arr[i].text))
                 .attr("selected", true);
            }
          }else{
            if(isset(arr[i],"value")){
              $(el).append($("<option></option>")
                 .attr("value", arr[i].value)
                 .text(arr[i].text));
            }else{
              $(el).append($("<option></option>")
                 .text(arr[i].text));
            }
          }
          */
       }
    }
}

/*
function displayDropdownHTML(options){
    // deprecated under construction
    //https://getbootstrap.com/docs/3.3/components/
    var html="";
    if(obj['items']){
        var obj=$.extend(true,{'class_ul':'dropdown-menu'},options);
        var class_str_li="";
        if(obj['class_li']){
            var class_str_li=' class="'+obj['class_li']+'"';
        }
        
        // ------------- button
        var label='please select';
        if(obj['value_selected']){
            for(var i=0;i<obj['items'].length;i++){
                if(obj['items'][i]['value']==obj['value_selected']){
                    label=getfromArray(obj,'pretext')+obj['items'][i]['label'];
                }
            }
        }
        html+='<a class="btn btn-primary dropdown-toggle" data-toggle="dropdown">'+label+' <span class="caret"></span></a>';
        
        // ----------- ul
        html+='<ul class="'+obj.class_ul+'">';
        for(var i=0;i<obj['items'].length;i++){
            if(obj['items'][i]['value']!==obj['value_selected']){
                html+='<li'+class_str_li+'><a data-value="'+obj['items'][i]['value']+'" href="'+obj['items'][i]['link']+'">'+obj['items'][i]['label']+'</a></li>';
            }
        }
        html+='</ul>';
    }
    return html;
}
*/

function displayDropdownel(options){
    var obj=$.extend(true,{
        'button':{
            'html':'<button data-bs-toggle="dropdown" aria-expanded="false"></button>',
            /*'html':'<button data-bs-toggle="dropdown" class="dropdown-toggle" aria-expanded="false"></button>',*/
            'text':'please select',
            'carettype':1,
            /*'button_id':'dropdownMenuButton1'*/
            'class':'btn btn-light',
        },
        /* value_selected */
        'class_ul':'dropdown-menu',
        /*'class_li':'',*/
        'class_a':'dropdown-item'
      },options
    );
    var displaymode=getfromArray(obj,"displaymode","inform");
    if(obj['items'] && obj.el_dd){
        var el_dd=obj.el_dd;
        el_dd.classList.add('dropdown');
        var class_str_li="";
        if(obj['class_li'])class_str_li=' class="'+obj['class_li']+'"';
        
        var label=obj.button.text;
        if(obj['value_selected']){
            for(var i=0;i<obj['items'].length;i++){
                if(obj['items'][i]['value']==obj['value_selected']){
                    label=getfromArray(obj.button,'pretext')+obj['items'][i]['label'];
                }
            }
        }else if(isset(obj,"button","text")){
            label=obj.button.text;
        }
        if(obj.button.carettype==1){
            obj.button.class+=" dropdown-toggle";
        }
        var el_button=$(obj.button.html).appendTo(el_dd)[0];
        el_button.innerHTML=label;
        var arr=obj.button.class.split(" ");
        for(var i=0;i<arr.length;i++){
          el_button.classList.add(arr[i]);
        }
        if(obj.button.id)el_button.setAttribute("id",obj.button.id);
          
        // ----------- ul
        el_ul=$('<ul class="'+obj.class_ul+'">').appendTo(el_dd)[0];
        //displayDropdownItems(el_ul,obj['items']);
        for(var i=0;i<obj['items'].length;i++){
          let inform=getfromArray(obj['items'][i],'inform',true);
          let atlink=getfromArray(obj['items'][i],'atlink',true);
          if((displaymode=="inform" && inform) || (displaymode=="atlink" && atlink) ){
            if(obj['items'][i]['items']){
              // append sub item
              // call submenu
            }else if(obj['items'][i]['value']!==obj['value_selected']){
                el_li=$('<li'+class_str_li+'><a class="'+getfromArray(obj['items'][i],'class_a','dropdown-item')+'"'+
                    ' data-value="'+obj['items'][i]['value']+'" href="'+getfromArray(obj['items'][i],'href','#',true)+'">'+obj['items'][i]['label']+'</a></li>').appendTo(el_ul);
            }
          }
        }
    }
}

function getl(word){
    // text, textnew
    if(typeof text=='undefined'){
    }else if(text.hasOwnProperty(word)){
        return text[word];
    }else{
        if(typeof textnew!=='undefined'){
            textnew[word]=word;
        }
        return word;
    }
    return word;
}

function form2obj(el_form){
  var obj={};
  for(var n=0;n<el_form.elements.length;n++){
    var el=el_form.elements[n];
    //var type=typeof el.type !== "undefined" ? "" : el.type;
    var type=el.type;
    if(!gbnull(el.name)){
      if(el.length){
        if(el.type=="select-multiple"){
          var prop=el.name.replace('[]','');
          obj[prop]=[];
          for(var i=0;i<el.length;i++){
            var el_opt=el[i];
            if(el_opt.selected){
              obj[prop].push(el_opt.value);
            }
          }
        }else if(el.type=="select-one"){
          obj[el.name]=el.value;
        }else{
          console.log(el.name+' not supported');
        }
      }else if(type=="checkbox"){
          if(el.checked){
            obj[el.name]=el.value;
          }else{
            //obj[el.name]=null;
            obj[el.name]=0;
          }
      }else if(type=="radio"){
          if(el.checked){
            obj[el.name]=el_form.elements[el.name].value;
          }
          /*
          if(el.checked){
            obj[el.name]=el.value;
          }else if(!obj[el.name]){
            obj[el.name]=null;
          }
         */
      }else{
        obj[el.name]=el.value;
      }
    }
  }
  return obj;
}

function obj2form(obj,el_form,bonlyadd){
  bonlyadd=typeof bonlyadd!=='undefined' ? bonlyadd : false;
  let badded=false;
  if(el_form){
    if(bonlyadd){
      for(var prop in obj){
          var name=prop;
          el=el_form.elements.namedItem(name);
          if(el!=undefined){
              badded=true;
              if(el.length){
                  var type=el[el.length-1].type;
                  if(type=="checkbox"){
                      el=el[el.length-1];
                      if(Number(obj[prop])){
                          el.checked=true;
                      }else{
                          el.checked=false;
                      }
                  }else if(type=="radio"){
                      $(el_form).find("input[name='"+name+"'][value='"+obj[prop]+"']").prop('checked', true);
                  }else{
                      //console.log('fill out form, new type='+type);
                      $(el).val(obj[prop]);
                  }
              }else{
                  if(el.disabled){
                      el.disabled=false;
                      //el.value=obj[prop];
                      gFormatinputfordisplay(el,obj[prop]);
                      el.disabled=true;
                  }else{
                      //el.value=obj[prop];
                      gFormatinputfordisplay(el,obj[prop]);
                  }
              }
          }else{
              //console.log('element: '+name+ " don't exist!"); 
          }
      }
    }else{
      for(var n=0;n<el_form.elements.length;n++){
        var el=el_form.elements[n];
        var prop=el.name;
        if(obj.hasOwnProperty(prop))badded=true;
        if(prop.indexOf('[')>=0 && prop.indexOf('[]')<0){
          var value=getObjectValuefromName(obj,prop);
          if(value!=undefined){
            el.value=value;
          }else{
            el.value="";
          }
        }else{
          if(el.tagName=="BUTTON" || el.type=="BUTTON" || el.type=="submit"){
            // nothing
          }else if(el.tagName=="SELECT"){
              //console.log(el.type);
              if(el.name.indexOf('[]')>-1){
                prop=prop.replace('[]','');
                if(obj.hasOwnProperty(prop)){
                  if(Array.isArray(obj[prop])){
                    for(var i=0;i<el.length-1;i++){
                      var el_opt=el[i];
                      if(obj[prop].indexOf(el_opt.value)>-1){
                        el_opt.selected=true;
                      }else{
                        el_opt.selected=false;
                      }
                    }
                  }else{
                    if(obj[prop]==null){
                      el.value="";
                    }else{
                      el.value=obj[prop];
                    }
                  }
                }else{
                  el.value="";
                }                  
              }else{
                if(obj.hasOwnProperty(prop)){
                  if(obj[prop]==null){
                    el.value="";
                  }else{
                    el.value=obj[prop];
                  }
                }else{
                  //el.value=null;
                  el.value="";
                }
              }
          }else{
            if(obj.hasOwnProperty(prop)){
              if(el.type=="checkbox"){
                if(gbnull(obj[prop])){
                  el.checked=false;
                }else{
                  //el.value=obj[prop];
                  el.checked=true;
                }
              }else if(el.type=="radio"){
                el.checked=false;
                if(obj[prop]==el.value)el.checked=true;
              }else{
                gFormatinputfordisplay(el,obj[prop]);
              }
            }else{
              if(el.type=="checkbox"){
                el.checked=false;
              }else if(el.type=="radio"){
                el_form.elements[el.name].value=null;
              }else{
                //el.value=null;
                el.value="";
              }
            }
          }
       }
     }
   }
  }else{
    console.log('obj2form, el_form is undefined!');
  }
  return badded;
}

function gFormatinputfordisplay(el,value){
    if(el.type=="checkbox"){
      if(value==el.value){
        el.checked=true;
      }else{
        el.checked=false;
      }
    }else{
      if(el.type=="number"){
          if(el.step){
              var arr=el.step.split('.');
              if(arr.length>1){
                var dp=arr[1].length;
                value=Number(value).toFixed(dp);
                if(navigator.userAgent.indexOf('Firefox')>-1 && GLOBALS_decimal_point==','){
                    value=value.replace('.',',');
                }
              }else{
                value=Number(value).toFixed(0);
              }
          }
          //console.log('gFormatinputfordisplay '+el.name+": "+value);
      }
      el.value=value;
    }
}

function tinymceInitOptions(options,optionstiny){
  var settings=options.settings;
  var dat=options.dat;
  var image_list='';
  var readonly=false;
  if(tinymce)tinymce.remove();
  if(dat){
    var basetype=settings.table;
    var field_baseID=settings.key;
    var path=GLOBALS_hostpath+'../'.repeat(GLOBALS_script_depth);
    baseID=getfromArray(dat,field_baseID,0);
    image_list=path+"masterdata/ProcessMethod.php?process_action=tinymce_images&basetype="+basetype+"&baseID="+baseID;
    if(settings.rightcheck && !gbnull(baseID))readonly=!Number(getfromArray(dat,'rightuser_update',false));
  }
  optionstiny.setup=function (editor) {
      editor.on('change', function () {
          editor.save();
          if(options.setDirty) options.setDirty(true);
      });
  }
  if(!gbnull(image_list))optionstiny.image_list=image_list;
  optionstiny.readonly=readonly;
  tinymce.init(optionstiny);
}

//default data formatters, tabulator.modules.format.js
var k8formatter = {
  "format":function(obj,value){
    var formatterParams=obj.formatterParams;
    switch(obj.formatter){
      case "money":
        if (isNaN(value)) {
          return this.emptyToSpace(this.sanitizeHTML(value));
        }else if(typeof value=='undefined' || value==null){
          return "";
        }
        
        value=parseFloat(value);
                
        var decimalSym = formatterParams.decimal || ".";
        var thousandSym = formatterParams.thousand || ",";
        var symbol = formatterParams.symbol || "";
        var after = !!formatterParams.symbolAfter;
        var precision = typeof formatterParams.precision !== "undefined" ? formatterParams.precision : 2;

        var number = precision !== false ? value.toFixed(precision) : value;
        number = String(number).split(".");

        var integer = number[0];
        var decimal = number.length > 1 ? decimalSym + number[1] : "";

        var rgx = /(\d+)(\d{3})/;

        while (rgx.test(integer)) {
          integer = integer.replace(rgx, "$1" + thousandSym + "$2");
        }

        return after ? integer + decimal + symbol : symbol + integer + decimal;
                
        break;
      case "datetime":
        if(!gbnull(value)){
          var inputFormat = formatterParams.inputFormat || "yyyy-MM-dd HH:mm:ss";
          var outputFormat = formatterParams.outputFormat || "DD/MM/YYYY HH:mm:ss";
          var invalid = typeof formatterParams.invalidPlaceholder !== "undefined" ? formatterParams.invalidPlaceholder : "";

          //var newDatetime = moment(value, inputFormat);
          var newDatetime = luxon.DateTime.fromFormat(value, inputFormat);

          //if (newDatetime.isValid()) {
          if (newDatetime.isValid) {
            return formatterParams.timezone ? newDatetime.tz(formatterParams.timezone).format(outputFormat) : newDatetime.toFormat(outputFormat);
          } else {

            if (invalid === true) {
              return value;
            } else if (typeof invalid === "function") {
              return invalid(value);
            } else {
              return invalid;
            }
          }
        }
      default:
        if(typeof value=='undefined' || value==null){
          return "";
        }else{
          return value;
        }
    }
  },
  "sanitizeHTML":function (value) {
  if (value) {
			var entityMap = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;',
				'/': '&#x2F;',
				'`': '&#x60;',
				'=': '&#x3D;'
			};

			return String(value).replace(/[&<>"'`=\/]/g, function (s) {
				return entityMap[s];
			});
		} else {
			return value;
		}
	},
	"emptyToSpace": function (value) {
		return value === null || typeof value === "undefined" || value === "" ? "&nbsp;" : value;
	}
};

function addCallback(myobj,cbname,myfunction){
  if(myobj[cbname]){
    if(!Array.isArray(myobj[cbname])){
      let x=myobj[cbname];
      myobj[cbname]=[];
      myobj[cbname].push(x);
    }
  }else{
    myobj[cbname]=[];
  }
  myobj[cbname].push(myfunction);
}

var k8={
  formDirtycontrol:function(options){
    let el_form=options.el_form;
    let script_depth=getfromArray(options,'script_depth',0);
    let path=GLOBALS_hostpath+'../'.repeat(script_depth);
    var el_dirty_main=$(el_form).find('.js_dirty')[0];
    if(el_dirty_main){
      let el_dirty=$(el_dirty_main).find('img')[0];
      if(!el_dirty){
        el_dirty = document.createElement("IMG");
        el_dirty.src=path+'masterdata/pic/icon_saved.png';
        el_dirty_main.append(el_dirty);
      }
      $(el_form).on("input","textarea",function(e){
        el_dirty.src=path+"masterdata/pic/icon_dirty.png";
      });
      el_form.addEventListener('change', function(e) {
        //console.log(e.target);
        let el=e.target;
        let bremove=el.classList.contains('js_dirtyremove');
        if(bremove){
          el_dirty.src=path+'masterdata/pic/icon_saved.png';
        }else{
          el_dirty.src=path+'masterdata/pic/icon_dirty.png';
        }
      });
      el_form.addEventListener('click', function(e) {
        e.preventDefault();
        //console.log(e.target);
        let el=e.target;
        let bremove=el.classList.contains('js_dirtyremove');
        if(bremove){
          el_dirty.src=path+'masterdata/pic/icon_saved.png';
        }
      });
    }else{
      console.log('js_dirty not set');
    }
  },
  formDirtymanual:function(options){
    let el_form=options.el_form;
    let script_depth=getfromArray(options,'script_depth',0);
    let path=GLOBALS_hostpath+'../'.repeat(script_depth);
    var el_dirty_main=$(el_form).find('.js_dirty')[0];
    if(el_dirty_main){
      let el_dirty=$(el_dirty_main).find('img')[0];
      /*
      if(!el_dirty){
        el_dirty = document.createElement("IMG");
        el_dirty.src=path+'masterdata/pic/icon_saved.png';
        el_dirty_main.append(el_dirty);
      }
      */
      let dirty=getfromArray(options,'dirty',true);
      if(dirty){
        el_dirty.src=path+'masterdata/pic/icon_dirty.png';
      }else{
        el_dirty.src=path+'masterdata/pic/icon_saved.png';
      }
    }      
  },

  "setselectcolorvalue":function (el_select,value){
    el_select.value=value;
    this.setselectcolor(el_select);
  },
  "setselectcolor":function (el_select){
    let backgroundcolor='#ffffff';
    let fontcolor='#000000';
    if(el_select.disabled && el_select.selectedIndex==-1){
      //$(el_select).css('background-color','initial'); // remove background color
      el_select.style.removeProperty('background-color');
    }else{
      if(el_select.selectedIndex>-1){
        let el_option=el_select.options[el_select.selectedIndex];
        if(el_option.dataset.backgroundcolor)backgroundcolor=el_option.dataset.backgroundcolor;
        if(el_option.dataset.fontcolor)fontcolor=el_option.dataset.fontcolor;
      }
      $(el_select).css('background-color',backgroundcolor);
      $(el_select).css('color',fontcolor);
    }
  },
  
  "datadefAddcoloredgroups":function(settings){
    let othis=this;
    addCallback(settings.masterdata,'cbAfterNew',function(options){
      setselectcolor2form(options.el_form);
    });
    addCallback(settings.masterdata,'cbAfterLoad',function(options){
      setselectcolor2form(options.el_form);
    });
    
    function setselectcolor2form(el_form){
      let allselects=el_form.querySelectorAll('select');
      for(let i=0;i<allselects.length;i++){
        othis.setselectcolor(allselects[i])
        setoptioncolor(allselects[i]);
      }
      $('select').change(function(e) {
        var el_select = e.target;
        othis.setselectcolor(el_select)
      }); 
    }
/*
    function setselectcolor(el_select){
      let backgroundcolor='#ffffff';
      let fontcolor='#000000';
      if(el_select.selectedIndex>-1){
        let el_option=el_select.options[el_select.selectedIndex];
        if(el_option.dataset.backgroundcolor)backgroundcolor=el_option.dataset.backgroundcolor;
        if(el_option.dataset.fontcolor)fontcolor=el_option.dataset.fontcolor;
      }
      $(el_select).css('background-color',backgroundcolor);
      $(el_select).css('color',fontcolor);
    }
*/
    function setoptioncolor(el_select){
      let backgroundcolor='#ffffff';
      let fontcolor='#000000';
      for(let i=0;i<el_select.options.length;i++){
        let el_option=el_select.options[i];
        if(el_option.dataset.backgroundcolor)backgroundcolor=el_option.dataset.backgroundcolor;
        if(el_option.dataset.fontcolor)fontcolor=el_option.dataset.fontcolor;
        $(el_option).css('background-color',backgroundcolor);
        $(el_option).css('color',fontcolor);
      }
    }
  },
  "datadefConnectionfailAdd":function(settings){
    if(GLOBALS_serviceworker){
      settings.masterdata.cbConnectionfail=function(options){
        //console.log("cbConnectionfail");
        var el=document.getElementsByClassName('navbar-brand')[0];
        if(el){
          if(el.style.color!=="red"){
            var color_backup=el.style.color;
            el.style.color="red";
            var intervalID=setInterval(checkConnection,5000);

            function checkConnection(){
              console.log("checkConnection");
              $.getJSON("masterdata/ProcessData.php", function(oJson) {
                el.style.color=color_backup;
                clearInterval(intervalID);
                if(isset(options,"saveRecord")){
                  options.saveRecord();
                }
                if(isset(options,"tableTab")){
                  // reloaddata
                  options.tableTab.setData(options.url,options.params);
                }
              })
              .fail(function(jqxhr, textStatus, error ) {
              });			
            }  
          }  
        }else{
          concole.log("cbConnectionfail: no navbar-brand, no connection check");
        }
      };
    }
  },

  "datadefAddmasterdetail":function(settings,settingsdetails){
    /*
    settingsdetails=[
      {"settings":settingsemployee,"mode":"catalog"},
      {"settings":settingsinvoice,"mode":"masterdata","selector":"#html2"},
      {"settings":settingsturnoversimple,"mode":"chartjs","selector":"#html3"}
    ];
    */
    let othis=this;
    addCallback(settings.masterdata,'cbAfterNew',function(options){
      var el_md=options.el_md;
      for(var i=0;i<settingsdetails.length;i++){
        othis.showMasterDetail(el_md,settingsdetails[i]['mode'],settingsdetails[i]['selector'],settingsdetails[i]['settings'],-1,0,i);
      }
    });
    addCallback(settings.masterdata,'cbAfterLoad',function(options){
      var settings=options.settings;
      var el_md=options.el_md;dat=options.dat;
      for(var i=0;i<settingsdetails.length;i++){
        othis.showMasterDetail(el_md,settingsdetails[i]['mode'],settingsdetails[i]['selector'],settingsdetails[i]['settings'],dat[settings.key],dat['rightuser_update'],i);
      }
    });
  },
  "showMasterDetail":function(el_md,submode,selector,settingssub,ID,rightuser_create,index){
    index=typeof index=="undefined" ? 0 :  index;
    rightuser_create=typeof rightuser_create=="undefined" ? false :  rightuser_create;
    settingssub.masterdata.rightuser_create=rightuser_create;
    var clause;
    if(isset(settingssub,'masterdata','sql_derived')){
      clause=settingssub.masterkey+'='+ID;
    }else{
      clause=settingssub.table+'.'+settingssub.masterkey+'='+ID;
    }
    settingssub.masterdata.clause='('+clause+')';
    settingssub.masterdata.defaultvalues={};
    settingssub.masterdata.defaultvalues[settingssub.masterkey]=ID;

    if(selector){
      if(!document.querySelector(selector))console.error('selector: '+selector+' does not exist!');
    }else{
      var el_main=el_md.parentElement;
      var subclass="mx-n0";
      if(el_main.classList.contains('container'))subclass="mx-n3";
      if(submode=="chartjs")subclass=gsclauseand(subclass,"k8-border k8-padding-6-12",true," ");
      var el=$('#html-sub'+index)[0];
      var html='<div id="html-sub'+index+'" class="'+subclass+'"></div>';
      if(el){
        $(el).replaceWith(html)
      }else{
        $(el_main).append(html);
      }
      selector='#html-sub'+index;
    }
    if(submode=="masterdata"){
      if(isset(settingssub,'sourceelement')){
        sourceelement[settingssub.sourceelement]=$(selector).masterdata(settingssub);
      }else{
        masterdata_sub=$(selector).masterdata(settingssub);
      }
    }else if(submode=="catalog"){
      if(isset(settingssub,'sourceelement')){
        sourceelement[settingssub.sourceelement]=$(selector).catalog(settingssub);
      }else{
        catalog_sub=$(selector).catalog(settingssub);
      }
    }else if(submode=="chartjs"){
      settingssub.chartjs_def.selector=selector;
      var exk8=Object.create(k8);
      if(settingssub.chartjs_def.chartjs.data.datasets.length>0){
        for(var i=0;i<settingssub.chartjs_def.chartjs.data.datasets.length;i++){
          settingssub.chartjs_def.chartjs.data.datasets[i].data={};
        }
      }
      if(settingssub.chartjs_def.chartjs.data.labels)settingssub.chartjs_def.chartjs.data.labels=[];
      exk8.displayChartjs(settingssub);
    }else{
      $(selector).html("submode not valid");
    }
  },

  "datadefAddtreeview":function(settings){
    //settings.headtitlecolumn
    
    // masterdata
    settings.parentcolumn=getfromArray(settings,'parentcolumn',"parentID");
    settings.treearrayname=getfromArray(settings,'treearrayname',"_children");
    settings.masterdata.clause=getfromArray(settings,'clause',settings.parentcolumn+'=0');
    settings.masterdata.edittype=getfromArray(settings.masterdata,'edittype',3);
    settings.masterdata.bnoform=getfromArray(settings.masterdata,'bnoform',true);
    settings.masterdata.btabselectstandard=getfromArray(settings.masterdata,'btabselectstandard',true);
    
    // settings.masterdata menuleft!!!!!!!!
    
    settings.tabulator.maxHeight=getfromArray(settings.tabulator,'maxHeight',"100%");
    settings.tabulator.dataTree=getfromArray(settings.tabulator,'dataTree',true);
    settings.tabulator.dataTreeElementColumn=getfromArray(settings.tabulator,'dataTreeElementColumn',settings.headtitlecolumn);
    settings.tabulator.dataTreeStartExpanded=getfromArray(settings.tabulator,'dataTreeStartExpanded',true);
    
    let columns=settings.tabulator.columns;
    let column={
      formatter:function(cell, formatterParams, onRendered){ //plain text value
        let html='';
        let rightuser_update=Number(getfromArray(cell.getData(),'rightuser_update',false));
        if(rightuser_update && superuser){
          html+='<button type="button" class="k8-btn-small"><i class="bi-box-arrow-in-down-right"></i></button>';
        }
        return html;
      },"headerSort":false,"download":false,"width":50, "hozAlign":"center",
      cellClick:function(e, cell){
        console.log('cellClick add child');
        let row=cell.getRow();

        // Formular öffnen
        let new_settings=settings;
        let searchparams=new URLSearchParams(settings.masterdata.url_edit); 
        let datadefID_edit=searchparams.get('datadefID');
        if(datadefID_edit==settings.datadefID){
          //new_settings=JSON.parse(JSON.stringify(settings));
          new_settings=settings;
        }else{
          new_settings=window['settings'+datadefID_edit];
          if(new_settings){
            new_settings.masterdata.edittype=settings.masterdata.edittype;
            new_settings.masterdata.window_mode=settings.masterdata.edittype;
            new_settings.masterdata.edit_selector=settings.masterdata.edit_selector;
            new_settings.masterdata.form_selector=settings.masterdata.form_selector;
          }
        }
        if(new_settings){
          new_settings.masterdata.notabulator=true;
          new_settings.masterdata.bnoform=false;
          new_settings.masterdata.htag="h2";
          new_settings.name=getl('New / Edit');

          new_settings.return={};
          new_settings.return.row=row;

          let options={};
          k8.createOverlayid(options);
          let dat_parent=row.getData();
          let sort=10;
          if(dat_parent._children){
            for(let i=0;i<dat_parent._children.length;i++){
              let dat_sub=dat_parent._children[i];
              if(Number(dat_sub.sort)>=sort)sort=Number(dat_sub.sort)+10;
            }
          }
          // parentID0,"parenttitle":dat_parent.title
          let dat={"parentID":dat_parent[settings.key],"sort":sort};
          new_settings.data=[];
          new_settings.data.push(dat);
          let el_masterdata=$('#overlay_content').masterdata(new_settings);
        }else{
          console.error('settings not defined');
        }
      }
    }
    columns.splice(columns.length, 0, column);

    // Menu
    settings.masterdata.menuleftobj={
        "button":{
          "text":"",
          "carettype":0
        }
      };
    if(!settings.masterdata.menuleftobj.items)settings.masterdata.menuleftobj.items=[];
    settings.masterdata.menuleftobj.items.push({"inform":false,"value":"collapse_all","label":"Collapse all"});
    settings.masterdata.menuleftobj.items.push({"inform":false,"value":"expand_all","label":"Expand all"});
    settings.masterdata.menuleftobj.items.push({"inform":false,"value":"collapse_process","label":"Collapse tree"});
    settings.masterdata.menuleftobj.items.push({"inform":false,"value":"expand_process","label":"Expand tree"});
    
    addCallback(settings.masterdata,'cbMenuleft',function(options){
      var el_md=options.el_md, e=options.e, row_actual=options.row_actual;
      var el=e.target;
      var value=getfromArray(el.dataset,"value");
      if(value=="expand_all"){
        let bak=options.settings.masterdata.tabulatorfilter2url;
        options.settings.masterdata.tabulatorfilter2url=false;
        traverseRows(options.tableTab, "expand");
        options.settings.masterdata.tabulatorfilter2url=bak;
      }else if(value=="collapse_all"){
        traverseRows(options.tableTab, "collapse");
      }else if(value=="expand_process"){
        if(options.selected.length===0){
          alert(getl("Please select 1 row"));
        }else{
          for(let i=0;i<options.selected.length;i++){
            executeChild(options.selected[i], "expand");
          }
        }
      }else if(value=="collapse_process"){
        if(options.selected.length===0){
          alert(getl("Please select 1 row"));
        }else{
          for(let i=0;i<options.selected.length;i++){
            executeChild(options.selected[i], "collapse");
          }
        }
      }
    });
    function executeChild(row, action) {
        if (action == "expand"){
            row.treeExpand();
        }else{
            row.treeCollapse()
        };

        var childRows = row.getTreeChildren();

        if (childRows.length > 0){
            childRows.forEach(function(child){
                if (child.getTreeChildren().length > 0){
                    executeChild(child, action)
                }
            });
        }
    }

    function traverseRows(tbl, action) {
        var tblRows = tbl.getRows();
        //console.log(tblRows);
        tblRows.forEach(function(row){
            if (row.getTreeChildren().length > 0){
                executeChild(row, action)
            }
        });
    }
    addCallback(settings.masterdata,'cbAfterSave',function(options){
      console.log("cbAfterSave");
      let dat=options.dat;
      let bnew=options.bnew;
      let settings=options.settings;

      if(bnew && !gbnull(dat.parentID)){ // only by append sub
        let settings=options.settings;
        $('#k8-overlay').remove();
        if(isset(settings,'return','row')){
            settings.return.row.addTreeChild(dat);
            settings.return.row.treeExpand();
        }else{
            console.log('after Save: return.row not set!')
        }
      }    
    });
    settings.masterdata.cbbtnCancel=function(options){
      console.log("cbbtnCancel");
      $('#k8-overlay').remove();
    }

  },
  "datadefAddlistedit":function(settings){
    let othis=this;
    let datadefID=getfromArray(settings,'datadefID');

    if(!settings.masterdata)settings.masterdata={};
    settings.masterdata.tabulatoreditajax=getfromArray(settings.masterdata,'tabulatoreditajax',true);
    let bajax=settings.masterdata.tabulatoreditajax;
    settings.masterdata.script_depth=getfromArray(settings.masterdata,'script_depth',0);
    let path=GLOBALS_hostpath+'../'.repeat(settings.masterdata.script_depth);
    
    settings.masterdata.lineedithook=getfromArray(settings.masterdata,"linehook",'<button type="button" class="js_rec_save btn k8-btn-small" aria-label="Left Align"><i class="bi-check-lg"></i></button>');
    settings.masterdata.lineeditsubmit=getfromArray(settings.masterdata,"lineeditsubmit",'<button style="display:none" type="submit" class="js_rec_save btn btn-primary k8-btn-small" aria-label="Left Align"><i class="bi-check-lg"></i></button>');
    settings.masterdata.linecreate=getfromArray(settings.masterdata,"linecreate",'<button type="button" class="js_rec_create btn btn btn-outline-secondary k8-btn-small" aria-label="Left Align"><i class="bi-plus-lg"></i></button>');
    settings.masterdata.linedel=getfromArray(settings.masterdata,   "linedel",'<button type="button" class="js_rec_create btn btn-outline-secondary k8-btn-small" aria-label="Left Align"><i class="bi-x-lg"></i></button>');
    settings.masterdata.url_save=getfromArray(settings.masterdata,   "url_save", "masterdata\/ProcessData.php?process_action=Save&datadefID="+datadefID);
    settings.masterdata.url_del=getfromArray(settings.masterdata,    "url_del", "masterdata\/ProcessData.php?&process_action=Del&datadefID="+datadefID);
    settings.masterdata.url_readfilter=getfromArray(settings.masterdata,    "url_readfilter","masterdata\/ProcessData.php");
    settings.masterdata.data_readfilter=getfromArray(settings.masterdata,"data_readfilter",{"datadefID": datadefID,"process_action": "ReadFilter"});

    settings.masterdata.tabulatorbinsert=getfromArray(settings.masterdata,'tabulatorbinsert',false);
    settings.masterdata.tabulatorform=getfromArray(settings.masterdata,'tabulatorform',false);
    settings.masterdata.tabulatorwrapper=getfromArray(settings.masterdata,'tabulatorwrapper',true);

    settings.tabulator.index=getfromArray(settings.tabulator,'index',settings.key);
    settings.tabulator.autoResize=getfromArray(settings.tabulator,'autoResize',true);
    settings.tabulator.layout=getfromArray(settings.tabulator,'layout',"fitColumns");
    settings.tabulator.height=getfromArray(settings.tabulator,'height',"200");
    settings.tabulator.movableColumns=getfromArray(settings.tabulator,'movableColumns',true);
    settings.tabulator.movableRows=getfromArray(settings.tabulator,'movableRows',true);
    settings.tabulator.headerFilterPlaceholder=getfromArray(settings.tabulator,'headerFilterPlaceholder',"");
    
    if(settings.masterdata.tabulatorwrapper){
      if(!settings.html)settings.html={};
      if(!settings.html.listedit)settings.html.listedit={};
      settings.html.listedit.wrapper='<div><div class="headline"><div><h1 class="js_title"></h1></div><div></div></div><div class="js_listedit maindata"></div></div>';
    }
    
    if(settings.masterdata.tabulatoreditajax){
      settings.tabulator.ajaxFiltering=getfromArray(settings.tabulator,'ajaxFiltering',true)
      settings.tabulator.ajaxURL=path+getfromArray(settings.masterdata,'url_readfilter');
      settings.tabulator.ajaxParams=getfromArray(settings.masterdata,'data_readfilter');
    }else{
      settings.tabulator.data=settings.data;
    }
    
    for(var i=0;i<settings.tabulator.columns.length;i++){
      var column=settings.tabulator.columns[i];
      if(!isset(column,'editor')){
        let formatter=getfromArray(column,'formatter');
        if(!column.editorParams)column.editorParams={};
        switch (formatter){
          case 'datetime':
            let formatterParams=getfromArray(column,'formatterParams');
            let outputFormat=getfromArray(formatterParams,'outputFormat');
            switch (outputFormat){
              case GLOBALS_tabulatortimeformat:
                column.editor='time';
                column.editorParams={
                  "format":"HH:mm:ss"
                }
                break;
              case GLOBALS_tabulatordateformat:
                column.editor='date';
                break;
              case GLOBALS_tabulatordatetimeformat:
                column.editor='datetime';
                column.editorParams={
                  "format": "yyyy-MM-dd HH:mm:ss"
                }
                break;
              default:
                column.editor='input';
            }
            //column.editorParams.verticalNavigation='editor';
            break;
          case 'money':
            column.editor='number';
            column.editorParams.step='0.01';
            break;
          default:
            column.editor='input';
        }
      }
      if(column.editor && !column.cellEdited){
        column.cellEdited=function(cell){
          var row=cell.getRow();
          //var el_cell_save=row.getCell('save').getElement();
          //el_cell_save.setAttribute("tabindex","0");
          if(bajax){
            var el_save=row.getCell('save').getElement().querySelector('button');
            el_save.style.display="inherit";
          }
        };
      }
    }

    settings.tabulator.columns.unshift(
      {
        field:"delete","download":false,"width":25, "hozAlign":"center","headerSort":false,
        "headerHozAlign":"center",
        "titleFormatter":function(cell, formatterParams, onRendered){
          var html=settings.masterdata.linecreate;
          if(bajax){
            //rightcheck
          }
          return html;
        },
        "formatter":function(cell, formatterParams, onRendered){
          var row=cell.getRow()
          var keyvalue=row.getData()[settings.tabulator.index];
          var html=settings.masterdata.linedel;
          return html;
        },
        cellClick:function(e, cell){
          console.log('cell-click');
          if(confirm("delete?")){
            var dat=cell.getData();
            let params={};
            params[cell.getTable().options.index]=dat[cell.getTable().options.index];
            let url=path+settings.masterdata.url_del;
            ajax(url,params,function(obj){
              if(obj.bok){
                cell.getRow().delete();
                if(settings.masterdata.tabulatorform)othis.formDirtymanual({el_form:settings.masterdata.tabulatorform});
              }else{
                k8.message(obj.error,'alert');
              }
            });
          }
        }
      }
    );

    if(settings.masterdata.tabulatoreditajax){
      settings.tabulator.columns.push(
        {
          field:"save","download":false,"width":25, "hozAlign":"center","headerSort":false,"editor":function(){},
          "formatter":function(cell, formatterParams, onRendered){
            var html=settings.masterdata.lineedithook+settings.masterdata.lineeditsubmit;
            
            return html;
          },
          cellClick:function(e, cell){
            console.log('save-click');
            var dat=cell.getData();
            var params=dat;
            params[cell.getTable().options.index]=dat[cell.getTable().options.index];
            let url=path+settings.masterdata.url_save;
            ajax(url,params,function(obj){
              if(obj.bok){
                console.log("saved");
                othis.message(getl('Saved'),'saved');
                var row=cell.getRow();
                var el_save=row.getCell('save').getElement().querySelector('button');
                el_save.style.display="none";
                row.update(obj.dat);
              }else{
                othis.message(obj.error,'alert');
              }
            });
          }
        }
      );
    }    
    settings.masterdata.cbAfterTabulator=function(options){
      let table=options.table;
      table.on("rowClick", function(e, row){
        //e - the click event object
        //row - row component
        //console.log('row click');
      });
      table.on("headerClick", function(e, column){
          console.log('header click');
          let dat={};
          let firstfield='';
          let cds=table.getColumnDefinitions();
          for(let i=0;i<cds.length;i++){
            if(cds[i].editor){
              firstfield=cds[i].field;
              dat[firstfield]='';
              break;
            }
          }
          table.addRow(dat, settings.masterdata.tabulatorbinsert).then(function(row){
            //row.reformat();
            if(!gbnull(firstfield)){
              console.log(row.getData());
              row.getCell(firstfield).edit();
            }
            //table.navigateDown();
          });
      });    
    }
    function ajax(url,params,eventfunc){
      console.log(url);
      console.log(params);

      if(bajax){
        $.getJSON(url,params,function(oJson) {
          eventfunc(oJson);
        })
        .fail(function(jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "data load, Request Failed: " + err );
        });
      }else{
        var obj={"bok":true,"error":"","dat":{}};
        eventfunc(obj);
      }
    }    
  },
  "displaytabulator":function(selector,settings){
    if(isset(settings,'html','listedit','wrapper')){
      let el_main=$(selector)[0];
      $(el_main).html(settings.html.listedit.wrapper);
      $(el_main).find('.js_title').html(settings.name);
      $(el_main).addClass(getfromArray(settings.masterdata,'class','masterdata'));

      window['tableTab']=new Tabulator('.js_listedit',settings.tabulator);
    }else{
      window['tableTab']=new Tabulator(selector,settings.tabulator);
    }
    if(settings.masterdata.cbAfterTabulator){
      settings.masterdata.cbAfterTabulator({table:tableTab});
    }
    return tableTab;
  },
  
  "datadefAddchartjs":function(settings){
    let xAxisKey=settings.headtitlecolumn;
    let datasets=[];
    /*
    for(var i=0;i<settings.columns.length;i++){
      let field=settings.columns[i];
      if(["TINYINT","SMALLINT","MEDIUMINT","BIGINT","INT","FLOAT","DOUBLE","DECIMAL"].includes(field.mytype)){
        yAxisKey=field.name;
        break;
      }
    }*/

    backgroundColor_arr=[
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ];
    borderColor_arr=[
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ];

    //settings.chartjs_def={
    let mydefault={
      selector:"#html1",
      /*reversedata:true,*/
      chartjs:{
        type: 'bar',
        data: {
            responsive: true,
            /*datasets:datasets*/
            /*
            datasets:[
              {
                label: label,
                data: [],
                parsing: {
                  yAxisKey: yAxisKey
                },
                borderColor: 'rgba(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              }
            ]
            */
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          parsing: {
            xAxisKey: xAxisKey
          },
          /*
          scales:{
            y:{ 
              beginAtZero: true
            }
          },
          */
          plugins:{
            legend: {
              display: true,
              position: "top"
            }/*,
            title: {
              display: true,
              text: yAxisKey
            }
            */
          },
          onClick: (e) => {
            var datasetIndex;
            var index;

            const nearest = e.chart.getElementsAtEventForMode(e, 'nearest', {
              intersect: false, axis:'y'
            }, false)
            if(nearest.length>0){
              var bar=nearest[0];
              index=bar.index;
              datasetIndex=bar.datasetIndex;
            }
            if(index!=="undefined"){
              console.log(e.chart.data.datasets[datasetIndex].data[index]);
              /* write in your action, example:
              var partnernumber=e.chart.data.datasets[datasetIndex].data[index]['partnernumber'];
              setinvoices("partnernumber='"+partnernumber+"'");
              */
            }
          }
        }
      }
    };
    settings.chartjs_def = $.extend(true, mydefault, settings.chartjs_def);

    /*
    if(settings.chartjs_def.chartjs.type=="bar" || settings.chartjs_def.chartjs.type=="line"){
      if(!settings.chartjs_def.chartjs.options.scales)settings.chartjs_def.chartjs.options.scales={};
      settings.chartjs_def.chartjs.options.scales.y={ 
        beginAtZero: true
      }
    }else{
      settings.chartjs_def.chartjs.options.plugins.legend.position="right";
    }
    */

    if(isset(settings,'chartjs_def','yAxisParsingColumns')){
      let yAxisParsingColumns_arr=[];
      if(Array.isArray(settings.chartjs_def.yAxisParsingColumns)){
        yAxisParsingColumns_arr=settings.chartjs_def.yAxisParsingColumns;
      }else{
        yAxisParsingColumns_arr=settings.chartjs_def.yAxisParsingColumns.split(',');
      }
      if(yAxisParsingColumns_arr.length>0){
        let options=getfromArray(settings.chartjs_def.chartjs,'options',{});
        let indexAxis=getfromArray(options,'indexAxis');
        for(var i=0;i<yAxisParsingColumns_arr.length;i++){
          let field=yAxisParsingColumns_arr[i];
          if(true){
            let dataset={};
            dataset.label=field;
            dataset.parsing={};
            if(indexAxis=='y'){
              dataset.parsing.xAxisKey=field;
              dataset.parsing.yAxisKey=xAxisKey;
            }else{
              dataset.parsing.yAxisKey=field;
              dataset.parsing.key=field;
            }
            dataset.borderColor=borderColor_arr[datasets.length];
            dataset.backgroundColor=backgroundColor_arr[datasets.length];
            dataset.borderWidth=2;
            datasets.push(dataset);
            if(datasets.length>borderColor_arr.length)i=yAxisParsingColumns_arr.length;
          }
        }
      }
    }else{
      for(var i=0;i<settings.tabulator.columns.length;i++){
        let field=settings.tabulator.columns[i];
        if(getfromArray(field,'formatter')=='money'){
          let dataset={};
          dataset.label=field.field;
          dataset.parsing={};
          dataset.parsing.yAxisKey=field.field;
          dataset.parsing.key=field.field;
          dataset.borderColor=borderColor_arr[datasets.length];
          dataset.backgroundColor=backgroundColor_arr[datasets.length];
          dataset.borderWidth=2;
          datasets.push(dataset);
          if(datasets.length>borderColor_arr.length)i=settings.tabulator.columns.length;
        }
      }
    }    

    /*
    if(!settings.chartjs_def){
      settings.chartjs_def={
        selector:"#html1"
      };
    }
    */
    settings.chartjs_def.chartjs.data.datasets=datasets;
    
  },
  "datadefAddtinymce":function(settings,optionstinydefault){
    var optionstinylocal={
        selector: "textarea.tinymce", 
        height: '300px',
        image_dimensions: false,
        image_class_list: [
          {title: 'width 100%', value: 'img-fluid img-responsive k8-margin-top-6 k8-margin-bottom-6'},
          {title: 'Standard 600px', value: 'img-fluid d-block mx-auto img-responsive k8-max-wdith-600 center-block k8-margin-top-6 k8-margin-bottom-6'},
          {title: 'no class', value: ''}
        ],
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste imagetools wordcount' 
          /*,'fullpage'*/
        ],
        force_p_newlines: false,
        forced_root_block:"",
        relative_urls : true,
        images_base_path: 'uploads',
        toolbar: "bullist | numlist | bold | italic | underline | alignleft | aligncenter | alignjustify | alignright | link image",
        valid_elements:'*[*]',
        content_style: "img{max-width: 600px; display: block; margin-left: auto; margin-right: auto; width: 50%;}",
        content_css: "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css",
    };
    if(GLOBALS_urlmode==1){
      optionstinylocal.relative_urls=false;
      optionstinylocal.remove_script_host=false;
      optionstinylocal.convert_urls=true;
      delete(optionstinylocal.images_base_path);
    }
    var optionstiny = $.extend(true, optionstinylocal,optionstinydefault);

    // Prevent bootstrap dialog from blocking focusin
    document.addEventListener('focusin', function(e) {
        if (e.target.closest(".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root") !== null) {
        e.stopImmediatePropagation();
      }
    });

    addCallback(settings.masterdata,'cbCreateStructure',function(options){
      var settings=options.settings;
      var notabulator=getfromArray(settings.masterdata,'notabulator',false);
      if(!notabulator){
        tinymceInitOptions(options,optionstiny);
        if(tinymce.activeEditor)tinymce.activeEditor.setContent("");
      }
    });

    addCallback(settings.masterdata,'cbBeforeNew',function(options){
        tinymce.remove();
    });
    addCallback(settings.masterdata,'cbAfterNew',function(options){
        tinymceInitOptions(options,optionstiny);
    });
    addCallback(settings.masterdata,'cbBeforeLoad',function(options){
        tinymce.remove();
    });
    addCallback(settings.masterdata,'cbAfterLoad',function(options){
        tinymceInitOptions(options,optionstiny);
    });

    if(settings.masterdata.upload){
      if(!isset(settings.masterdata.upload,"settings"))settings.masterdata.upload.settings=[];
      settings.masterdata.upload.settings.dataAfterUpload=function(optionssmall){
        if(tinymce)tinymce.remove();
        tinymceInitOptions({settings:settings,dat:optionssmall.dat},optionstiny);
      }
    }
  },

  "datadefAddSearch":function(settings){  // this only for the fly
    //GLOBALS_hostpath+GLOBALS_indexfile
    let datadefAddSearch_executed=getfromArray(settings.masterdata,'datadefAddSearch_executed',false);
    if(!datadefAddSearch_executed){
      settings.masterdata.datadefAddSearch_executed=true;
      addCallback(settings.masterdata,'cbcatAfterContainer',function(options){
        var el_list=options.el_list;
        var settings=options.settings;
        if(getfromArray(settings.masterdata,'search_mode',0)>0){
          var search_internal=getfromArray(settings.masterdata,'search_internal',false);

          var el_searchbtn=el_list.querySelector('.js_rec_search');
          var search=getfromArray(GET,"search");
          var el_form;
          let el_head=$(el_list).find('.js_rec_head')[0];

          if(el_searchbtn){

            el_form=el_searchbtn.form;
            if(el_form.getAttribute('action')){
              el_form.setAttribute('action',GLOBALS_hostpath+el_form.getAttribute('action'));
            }else{
              el_form.setAttribute('action',GLOBALS_hostpath+GLOBALS_indexfile);
            }
            let el_search=el_form.elements.namedItem('search');
            if(!el_search){
              console.error('no form element name=search');
              return;
            }
            el_search.value=search;
            el_form.elements.namedItem('datadefID').value=(datadefID<0 ? 0:datadefID);
            el_form.elements.namedItem('page').value=page;
            // for datadefinition on the fly
            if(el_form.elements.namedItem('table')) el_form.elements.namedItem('table').value=getfromArray(GET,'table');
            if(el_form.elements.namedItem('headtitlecolumn'))el_form.elements.namedItem('headtitlecolumn').value=getfromArray(GET,'headtitlecolumn');
            if(el_form.elements.namedItem('headdescriptioncolumn'))el_form.elements.namedItem('headdescriptioncolumn').value=getfromArray(GET,'headdescriptioncolumn');
            //console.log(GET);
            for(var prop in GET){
              if(el_form.elements.namedItem(prop)){
                // element already in form
              }else{
                var el=document.createElement('input');
                el.type="hidden";
                el.name=prop;
                el.value=GET[prop];
                el_form.appendChild(el);
              }
            }

            if(search_internal){
              el_searchbtn.addEventListener('click',(e)=>{
                e.preventDefault();

                search=el_form.elements.namedItem('search').value
                GET.search=search;
                window.history.replaceState(null, document.title, GLOBALS_indexfile+'?'+k8.obj2queryparameters(GET));

                var search=el_form.elements.namedItem('search').value;
                searchExpression(settings,search,e.target);
                $(el_list).find('.js_rec_records').empty();
                options.loaddata(1);
              });
            }else{
              el_search.addEventListener('change',(e)=>{
                e.preventDefault();
                let el_pageno=el_form.elements.namedItem('pageno');
                if(el_pageno)el_pageno.value=1;
              });
            }
            if(isset(GET,'submit')){
              searchExpression(settings,search,el_form.elements.namedItem('submit'));
            }else{
              searchExpression(settings,search);
            }
          }
        }else{
          searchExpression(settings,"");
        }

        function searchExpression(settings,search,el_clicked){
          console.log("searchExpression");
          let data=getfromArray(settings,'data',[]);
          if(settings.data.count>0){
            // nothing
          }else if(gbnull(search)){
            if(isset(settings,'html','catalog','blank'+GLOBALS_language)){
              var html='blank'+GLOBALS_language;
              settings.html.catalog.blank=settings.html.catalog['blank'+GLOBALS_language];
            }
            if(settings.masterdata.disprecdirect==1){
              // display records
              settings.masterdata.data_readfilter.clause=gsclauseand(settings.masterdata.clause,settings.masterdata.clause,!gbnull(settings.masterdata.clause));
              settings.masterdata.data_readfilter.filters=getfromArray(settings.masterdata,"filters",[]);
              if(settings.masterdata.filters_catalog)settings.masterdata.data_readfilter.filters.push(settings.masterdata.filters_catalog);
            }else{
              settings.return={};
              settings.return.bblank=true;
            }
          }else if(settings.masterdata.disprecdirect==0 && !el_clicked){
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
                console.error('searchcolumn not set in datadefinition');
            }else{
                let ff=[];
                for(var i=0;i<keywordarray.length;i++){
                  clause=gsclauseand(clause,searchcolumn+" like '%"+keywordarray[i]+"%'",!gbnull(keywordarray[i]),' or ');
                  //clause=gsclauseand(clause,"city like '%"+keywordarray[i]+"%'",!gbnull(keywordarray[i]),' or ');
                  //clause=gsclauseand(clause,"partoftown like '%"+keywordarray[i]+"%'",!gbnull(keywordarray[i]),' or ');
                }

                // default
                settings.masterdata.data_readfilter.clause=gsclauseand(settings.masterdata.clause,settings.masterdata.clause,!gbnull(settings.masterdata.clause));
                settings.masterdata.data_readfilter.filters=getfromArray(settings.masterdata,"filters",[]);
                if(settings.masterdata.filters_catalog)settings.masterdata.data_readfilter.filters.push(settings.masterdata.filters_catalog);

                let filtermode=getfromArray(settings.masterdata.filterobject,'filtermode',1);
                if(filtermode==1){ // clause
                  settings.masterdata.data_readfilter.clause=gsclauseand(settings.masterdata.data_readfilter.clause,clause,!gbnull(clause));
                }else{
                  // array filters
                  ff.forEach(function(filter){
                    settings.masterdata.data_readfilter.filters.push(filter);
                  });
                }

                /*
                settings.masterdata.clause=clause;
                if(isset(settings,'masterdata','filters_'+page)){
                    if(!isset(settings,'masterdata','filters')){
                        settings.masterdata.filters=[];
                    }
                    settings.masterdata.filters.push(settings.masterdata['filters_'+page]);
                }
              */
            }
          }
        }      
      });            
    }
  },

  "datadefAddSearchFilterForm":function(settings){
      addCallback(settings.masterdata,'cbcatAfterContainer',function(options){
      var el_list=options.el_list;
      var settings=options.settings;
      var search_internal=getfromArray(settings.masterdata,'search_internal',false);
      
      //var el_searchbtn=el_list.querySelector('.js_rec_search');
      //var search=getfromArray(GET,"search");
      var el_form;
      let el_head=$(el_list).find('.js_rec_head')[0];
      
      if(isset(settings,"masterdata","filterobject")){
        // filterform
        if(isset(settings,'html',"catalog",'filterform')){
            el_head.innerHTML+=settings.html.catalog.filterform;
        }else if(isset(settings,"masterdata","filterobject")){
            filterobject=settings.masterdata.filterobject;
            let createform=getfromArray(filterobject,'createform',true);
            if(createform){
              if(!filterobject.templatetype)filterobject.templatetype="filterform";
              if(!filterobject.method)filterobject.method="GET";
              if(isset(settings,'html',"catalog",'filtertemplate')){
                filterobject.template=settings.html.catalog.filtertemplate;
              }
              if(GLOBALS_urlmode==1){
                if(!filterobject.form)filterobject.form={};
                filterobject.form['action']=GLOBALS_hostpath+GLOBALS_indexfile;
              }
              k8.initFormfields(filterobject);
              filterform=k8.createform(filterobject);
              el_head.innerHTML+=filterform;
            }            
            // funktionen anhängen
          }
          
          // event submit
          el_form=$(el_head).find('.js_filterform')[0];
          if(el_form){
            
            
            if(search_internal){
              el_form.addEventListener('submit',(e)=>{
                e.preventDefault();

                // adopte url by relative Urls
                if(GLOBALS_urlmode==0){
                  let obj_form=form2obj(el_form);
                  let obj={...GET, ...obj_form};
                  delete(obj.pageno);
                  if(GLOBALS_urlmode==1){
                    k8.obj2url(obj,GLOBALS_hostpath+GLOBALS_indexfile);
                  }else{
                    k8.obj2url(obj);
                  }
                }
                
                if(options.buildformfilter(el_form,e.target)){
                  console.log('buildformfilter=true');
                }
                $(el_list).find('.js_rec_records').empty();
                options.loaddata(1);
              });
            }else{
              k8.obj2formelements(GET,el_form);
            }
          }else{
            console.error('no .js_filterform');
          }
          
          let badded=obj2form(GET,el_form);
          
          if(!settings.return)settings.return={};
          if(settings.masterdata.disprecdirect==0){
            settings.return.bblank=true;
          }else if(settings.masterdata.disprecdirect==1){
            options.buildformfilter(el_form);
          }else if(settings.masterdata.disprecdirect==2){
            if(badded){
              options.buildformfilter(el_form);
            }else{
              settings.return.bblank=true
            }
          }else{
            settings.return.bblank=true
          }
          // !!!  filter bauen searchExpression(settings,search);
      }else{
        console.warn("no filterobject defined");
      }
    });
  },
  
  datadefAddCarousel:function(settings){
    addCallback(settings.masterdata,'cbcatAfterLoadAll',function(options){
      // for the carousel
      let carouselitems=options.el_list.querySelectorAll('.carousel-item');
      if(carouselitems.length>0){
        let el_carouselindicators=options.el_list.querySelector('.carousel-indicators');
        let bfirst=true;
        for(let i=0;i<carouselitems.length;i++){
          let item=carouselitems[i];
          let html='<button type="button" data-bs-target="#carouselExampleSlidesOnly" data-bs-slide-to="'+i+'" aria-label="Slide '+i+'"></button>';
          let el_itemindicator=$(html).appendTo(el_carouselindicators)[0];

          let el_img=$(item).find('img')[0];
          el_img.src=el_img.dataset.src;
          if(bfirst){
            item.classList.add("active");
            el_itemindicator.setAttribute('aria-current',true);
            el_itemindicator.classList.add("active");
            bfirst=false;
          }
        };
        var myCarousel = document.querySelector('#carouselExampleSlidesOnly');
        var carousel = new bootstrap.Carousel(myCarousel, {
          interval: 2000,
          wrap: true
        });
        myCarousel.addEventListener('click', function(e){
          if($('#carouselExampleSlidesOnly')[0].dataset['ride']=="false"){
            $('#carouselExampleSlidesOnly').carousel("cycle");
            $('#carouselExampleSlidesOnly')[0].dataset['ride']="carousel";
            $('#carouselExampleSlidesOnly')[0].classList.add('slide');
            $("#carouselExampleSlidesOnly").attr('data-interval', '2000');
          }else{
            $('#carouselExampleSlidesOnly').carousel("pause");
            $('#carouselExampleSlidesOnly')[0].dataset['ride']=false;
            $('#carouselExampleSlidesOnly')[0].classList.remove('slide');
            $('#carouselExampleSlidesOnly').carousel("dispose");
          }  
        });
      }
    });
  },
  
  datadefAddLink:function(settings){
    settings.masterdata.cbcatLoad=[];
    settings.masterdata.cbcatLoad.push(function(options){
      //var settings=options.settings;
      var dat=options.dat;
      var el_rec_record=options.el_rec_record;
      var el_detaillink=el_rec_record.getElementsByClassName("js_detaillink")[0];
      var keyvalue=getfromArray(dat,settings.key,0);
      if(el_detaillink){
        el_detaillink.href=settings.masterdata.url_detail+"&keyvalue="+keyvalue+((settings.datadefID==-1) ? "&headtitlecolumn="+settings.headtitlecolumn+"&headdescriptioncolumn="+settings.headdescriptioncolumn :"");
      }else{
        console.log("missing js_detaillink")
      }
    });
  },
          
  displayChartjs:function(options){
    // clause oder filter aufbereiten
    if(options.masterdata.clause){
        options.masterdata.data_readfilter.clause=options.masterdata.clause;
    }
    if(options.masterdata.filters){
        options.masterdata.data_readfilter.filters=options.masterdata.filters;
    }
    var othis=this;
    var settings=options;
    let bAddCharts=false;
    if(!settings.chartjs_def){
      console.warn('displayChartjs options.chartjs_def not set!');
      bAddCharts=true;
    }else{
      if(settings.chartjs_def.chartjs){
        if(!isset(settings.chartjs_def.chartjs,'data'))bAddCharts=true;
      }else{
        bAddCharts=true;
      }
    }
    if(bAddCharts){
      this.datadefAddchartjs(options);
    }
    if(!settings.chartjs_def.callbacks) settings.chartjs_def.callbacks={};
    let datadefault=getfromArray(settings,'data',[]);
    //if(settings.data){
    if(datadefault.length>0){    
      othis.displayGraph({data_obj:settings.data,settings:settings});
    }else if(settings.chartjs_def.callbacks.dataLoad){
      settings.chartjs_def.callbacks.dataLoad({othis:othis,settings:settings});
    }else if(settings.masterdata.url_readfilter){
      var data=settings.masterdata.data_readfilter;
      var path=GLOBALS_hostpath+'../'.repeat(settings.masterdata.script_depth);
      var url=path+settings.masterdata.url_readfilter;
      $.getJSON(url,data, function(oJson) {
        othis.displayGraph({data_obj:oJson,settings:settings});
      })
      .fail(function(jqxhr, textStatus, error ) {
        var err = url+", Request Failed, "+ textStatus + ", " + error;
        console.log(err);
      });			
    }else{
      othis.displayGraph({data_obj:[],settings:settings});
    }
  },
  
  data_chartjs:{},
  displayGraph:function(options){
    var othis=this;
    let settings=options.settings;
    settings.chartjs_def.height=getfromArray(settings.chartjs_def,'height',"350px");
    let data_obj=options.data_obj;
    let reversedata=getfromArray(settings.chartjs_def,"reversedata",false);
    if(reversedata)data_obj.reverse();
    //console.log(data_obj);
    
    let chartjs=settings.chartjs_def.chartjs;
    if(settings.chartjs_def.callbacks.dataAdd){
      settings.chartjs_def.callbacks.dataAdd({othis:othis,data_obj:data_obj,settings:settings});
    }else if(data_obj.length>0){
      //chartjs.data.datasets[0].data=data_obj;
      for(var i=0;i<chartjs.data.datasets.length;i++){
        chartjs.data.datasets[i].data=data_obj;
      }

      // ----------------- labels
      if(!chartjs.data.labels)chartjs.data.labels=[];
      if(chartjs.data.labels.length==0 && settings.headtitlecolumn && (settings.chartjs_def.chartjs.type=="pie" || settings.chartjs_def.chartjs.type=="doughnut")){
      //if(chartjs.data.labels.length==0 && settings.headtitlecolumn){
        for(let i=0;i<data_obj.length;i++){
          chartjs.data.labels.push(getfromArray(data_obj[i],settings.headtitlecolumn));
        }
      }
      
      // ----------------- backgroundColor, borderColor
      backgroundColor_arr=[
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
      ];
      borderColor_arr=[
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
      ];

      if(settings.chartjs_def.chartjs.type=="pie" || settings.chartjs_def.chartjs.type=="doughnut"){
        if(!Array.isArray(chartjs.data.datasets[0].backgroundColor))chartjs.data.datasets[0].backgroundColor=[];
        if(!Array.isArray(chartjs.data.datasets[0].borderColor))chartjs.data.datasets[0].borderColor=[];
        for(let i=0;i<data_obj.length;i++){
          let backgroundColor=backgroundColor_arr[0];
          if(i<backgroundColor_arr.length)backgroundColor=backgroundColor_arr[i];
          let borderColor=borderColor_arr[0];
          if(i<borderColor_arr.length)borderColor=borderColor_arr[i];
          chartjs.data.datasets[0].backgroundColor.push(backgroundColor);
          chartjs.data.datasets[0].borderColor.push(borderColor);
        }
      }
      /*
      chartjs.options.parsing['xAxisKey']="Alter";
      chartjs.options.parsing['yAxisKey']="name";
      delete(chartjs.data.labels);
      */
    }
    this.data_chartjs=data_obj;
    //console.log(chartjs);
    let selector=getfromArray(settings.chartjs_def,'selector',getfromArray(settings.masterdata,'selector','#html1',true));
    //console.log(selecor);
    let el_selector=document.querySelector(selector);
    let htag=getfromArray(settings.chartjs_def,'htag','h1');
    let mainclasses=getfromArray(settings.chartjs_def,'mainclasses','k8-chartjs masterdata');
    
    let html='<div class="'+mainclasses+'"><div class="headline"><div><'+htag+' class="js_title">'+getl(settings.name)+'</'+htag+'></div><div></div></div>';
    
    //let html='<div class="'+mainclasses+'"><'+htag+'>'+getl(settings.name)+'</'+htag+'>';
    
    if(settings.chartjs_def.height){
      html+='<div class="maindata p-2" style="height: '+settings.chartjs_def.height+'">';
    }else{
      html+='<div class="maindata">';
    }
    html+='<canvas></canvas></div></div>';
    
    if(isset(settings,'html','chart','layout'))html=settings.html.chart.layout;
    el_selector.innerHTML=html;
    var el_canvas=el_selector.getElementsByTagName('canvas')[0];
    var xChart = new Chart(el_canvas,chartjs);
  },
  
    "property1":0,
    "mes":function(text){
          alert(text);
    },
    "message":function(text,myclass,delay){
      delay=typeof delay==='undefined'?4000:delay;
      var el=$('.k8-browser-bottomline')[0];
      if(!el){
        el=$('<div class="k8-browser-bottomline"><div class="container k8-message"><div></div></div></div>').appendTo('body')[0];
      }
      var el_child=$(el).children().children()[0];
      //var el_child=el;
      $(el).show();
      el_child.innerHTML=text;
      el_child.classList.remove('alert');
      el_child.classList.remove('saved');
      el_child.classList.add(myclass);
      $(el).show();
      if(delay>0){
          setTimeout(function(){
              $(el).fadeOut("slow");
          }, delay);
      }
    },
    "beep":function(duration, frequency, volume, type, callback) {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);
      //All arguments are optional:
      //duration of the tone in milliseconds. Default is 500
      //frequency of the tone in hertz. default is 440
      //volume of the tone. Default is 1, off is 0.
      //type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
      //callback to use on end of tone
      var oscillator = audioCtx.createOscillator();
      var gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (volume){gainNode.gain.value = volume;}
      if (frequency){oscillator.frequency.value = frequency;}
      if (type){oscillator.type = type;}
      if (callback){oscillator.onended = callback;}

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + ((duration || 500) / 1000));
    },

    "createoptions": function(options){
      // too late!
      // 
      //if(JSON.stringify(options.formcollection) === '{}' || typeof(options.formcollection=="undefined")){
      if(!isset(options,'formcollection')){
        this.initFormfields(options);
      }
      for(prop in options.formcollection){    
        if(options.formcollection.hasOwnProperty(prop)){
          var obj=options.formcollection[prop];
          var active=getfromArray(obj,'active',true);
          if(obj.dataoptions && active){
            var datadefID=getfromArray(obj.dataoptions,"datadefID");
            var mysettings=window["settings"+datadefID];
            if(mysettings){
              var mode=getfromArray(obj.dataoptions,'mode',0);
              var emptytext=getfromArray(obj.dataoptions,'emptytext','none');
              var el=this.el_form.elements.namedItem(obj.name);
              var path=GLOBALS_hostpath+'../'.repeat(settings.masterdata.script_depth);
              var mydatalist={
                  el:el,
                  url_readfilter:path+mysettings.masterdata.url_readfilter,
                  data_readfilter:mysettings.masterdata.data_readfilter,
                  defaultclause:getfromArray(obj.dataoptions,"defaultclause"),
                  datalistcolumn:mysettings.datalistcolumn,
              };
              if(emptytext=='none'){
                // not set
              }else if(emptytext=='standard'){
                mydatalist.emptytext=getl('please select');
              }else{
                mydatalist.emptytext=emptytext;
              }
              if(mode>0){
                mydatalist.key=mysettings.key;
              }
              let attributes=getfromArray(obj,'attributes',{});
              filloptions(mydatalist,attributes.value);
            }else{
              console.log("createoptions: settings"+datadefID+" not set!");
            }            
          }
        }
      }
      
      function filloptions(mydatalist,defaultvalue){
        if(!gbnull(mydatalist.defaultclause))mydatalist.data_readfilter.clausein=mydatalist.defaultclause;
        $.getJSON(mydatalist.url_readfilter,mydatalist.data_readfilter,function(oJson) {
          console.log(oJson);
          var optionsarray=[];
          if(isset(mydatalist.emptytext)){
            let dat;
            if(isset(mydatalist,'key')){
              dat={
                "value":"",
                "text":mydatalist.emptytext
              };
            }else{
              dat={
                "value":""
              };
            }
            optionsarray.push(dat);
          }
          for(var i=0;i<oJson.length;i++){
            let dat={
              "text":oJson[i][mydatalist.datalistcolumn],
            };
            if(isset(mydatalist,'key')){
              dat["value"]=oJson[i][mydatalist.key];
            }
            optionsarray.push(dat);
          }
          options2Select(mydatalist.el,optionsarray,defaultvalue);
        })
        .fail(function(jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log("saverecord.Request Failed: " + err );
        });

      }
    },

    //"datalists":{},
    "adddatalists": function(options){
      // windows[settingsXXX]
      
      //if(JSON.stringify(this.formcollection) === '{}'){
      //  this.initFormfields(this.formoptions);
      //}
      //for(prop in this.formcollection){    
      //  if(this.formcollection.hasOwnProperty(prop)){
      //    var obj=this.formcollection[prop];
      if(JSON.stringify(options.formcollection) === '{}' || typeof(options.formcollection=="undefined")){
        this.initFormfields(options);
      }
      for(prop in options.formcollection){    
        if(options.formcollection.hasOwnProperty(prop)){
          var obj=options.formcollection[prop];
          var active=getfromArray(obj,'active',true);
          if(obj.datalist && active){
            var datadefID=getfromArray(obj.datalist,"datadefID");
            if(!gbnull(datadefID)){
              var mysettings=window["settings"+datadefID];
              if(mysettings){
                var el=this.el_form.elements.namedItem(obj.name);
                var el_IDfield;
                if(obj.datalist.IDfield){
                  el_IDfield=this.el_form.elements.namedItem(obj.datalist.IDfield);
                }else{
                  var el_inputgroup=$(el).parents('.input-group')[0];
                  if(el_inputgroup)el_IDfield=$(el_inputgroup).find('input[type=hidden]')[0];
                }
                if(!el_IDfield)console.log(prop+": no IDfield");
                var obj={
                  datalistfield:obj.name,
                  defaultclause:getfromArray(obj.datalist,"defaultclause"),
                  url_readfilter:mysettings.masterdata.url_readfilter,
                  data_readfilter:mysettings.masterdata.data_readfilter,
                  datalistcolumn:mysettings.datalistcolumn,
                  onlyoptions:getfromArray(obj.datalist,"onlyoptions",false),
                  key:mysettings.key,
                  el_key:el_IDfield
                }
                this.adddatalist(options,obj);
              }else{
                console.log("adddatalists: settings"+datadefID+" not set!");
              }            
            }
          }
        }
      }
    },
    "adddatalist": function(structure,options){
      /* example:
      options={
        datalistfield:"customer",
        datadefID:"customer",
        defaultclause:"",
        url_readfilter:settingscustomer.masterdata.url_readfilter,
        data_readfilter:settingscustomer.masterdata.data_readfilter,
        datalistcolumn:settingscustomer.datalistcolumn
      };
      */
      var othis=this;
      var datalistfield=options.datalistfield;
      let el_datalist=document.createElement("datalist");
      el_datalist.id=datalistfield+"_datalist";
      othis.el_form.append(el_datalist);
      var el_datalistfield=othis.el_form.elements.namedItem(options.datalistfield);
      
      //othis.datalists[datalistfield]={
      if(!isset(structure,'datalists'))structure.datalists={};
      structure.datalists[datalistfield]={
        datalistfield:options.datalistfield,
        /*datadefID:options.datadefID,*/
        defaultclause:options.defaultclause,
        url_readfilter:options.url_readfilter,
        data_readfilter:options.data_readfilter,
        datalistcolumn:options.datalistcolumn,
        el_datalistfield:el_datalistfield,
        onlyoptions:options.onlyoptions,
        el_datalist:el_datalist,
        key:options.key,
        el_key:options.el_key
      };
      //if(!gbnull(this.datalists[datalistfield].url_readfilter)){
      //  othis.datalists[datalistfield].el_datalistfield.addEventListener("input",function(e){
      
      if(!gbnull(structure.datalists[datalistfield].url_readfilter)){
        structure.datalists[datalistfield].el_datalistfield.addEventListener("input",function(e){
          //console.log("event_input");
          //console.log(structure.datalists[datalistfield]);
          var el=e.target;
          //var mydatalist=othis.datalists[el.name];
          var mydatalist=structure.datalists[el.name];
          mydatalist.data_readfilter.clause=mydatalist.datalistcolumn+" like '%"+el.value+"%'";
          if(gbnull(mydatalist.defaultclause)){
            delete(mydatalist.data_readfilter.clausein);
          }else{
            mydatalist.data_readfilter.clausein=mydatalist.defaultclause;
          }
          var url=GLOBALS_hostpath+'../'.repeat(settings.masterdata.script_depth)+mydatalist.url_readfilter;
          $.getJSON(url,mydatalist.data_readfilter,function(oJson) {
            //console.log(oJson);
            mydatalist['data']=oJson;
            othis.fillDatalist({"el_datalist":mydatalist.el_datalist,"data":mydatalist['data'],"field":mydatalist.datalistcolumn});
          })
          .fail(function(jqxhr, textStatus, error ) {
              var err = textStatus + ", " + error;
              console.log("datalist.Request Failed: " + err );
          });
        });
      }
    },
    
    "loadDatalist": function(mydatalist){
      var othis=this;
      //mydatalist.data_readfilter.clause=mydatalist.datalistcolumn+" like '%"+el.value+"%'";
      if(!gbnull(mydatalist.defaultclause))mydatalist.data_readfilter.clausein=mydatalist.defaultclause;
      var url=GLOBALS_hostpath+'../'.repeat(settings.masterdata.script_depth)+mydatalist.url_readfilter;
      $.getJSON(url,mydatalist.data_readfilter,function(oJson) {
        //console.log(oJson);
        mydatalist['data']=oJson;
        othis.fillDatalist({"el_datalist":mydatalist.el_datalist,"data":mydatalist['data'],"field":mydatalist.datalistcolumn});
      })
      .fail(function(jqxhr, textStatus, error ) {
          var err = textStatus + ", " + error;
          console.log("datalist.Request Failed: " + err );
      });
    },
      
    "fillDatalist": function(options){
      var el_datalist=options.el_datalist;
      var data=options.data;
      var field=options.field;
      el_datalist.innerHTML="";
      if(data){
        for(var i=0;i<data.length;i++){
          if(data[i]){
            var option = document.createElement('option');
            option.value = data[i][field];
            el_datalist.appendChild(option);
          }
        }
      }
    },
    "onChangeDatalist": function(options){
      if(options.datalists){
        let el_form=this.el_form
        $(el_form).on("change","input",function(e){
          var el=e.target;
          var name=el.name
          if(options.datalists[name]){
            var datalist=options.datalists[name];
            var index_datalist=getArrayIndexfromValue(datalist.data,datalist.datalistcolumn,this.value);
            var dat_datalist={};
            if(index_datalist!==-1){
              if(datalist.el_key)datalist.el_key.value=datalist.data[index_datalist][datalist.key];
              dat_datalist=datalist.data[index_datalist];
            }else{
              if(datalist.el_key)datalist.el_key.value=0;
              if(datalist.onlyoptions)datalist.el_datalistfield.value='';
            }

            var el_inputgroup=$(this).parents('.input-group')[0];
            if(!el_inputgroup)el_inputgroup=this;
            if(el_inputgroup.dataset.fieldlist){
              var fields=el_inputgroup.dataset.fieldlist.split(',');
              for(var i=0;i<fields.length;i++){
                if(fields[i].indexOf('=')>-1){
                    var map=fields[i].split('=');
                    dat_datalist[map[0]]=getfromArray(dat_datalist,map[1]);
                }else{
                    dat_datalist[fields[i]]=getfromArray(dat_datalist,fields[i]);
                }
              }
              obj2form(dat_datalist,el_form,true);
            }
          }                    
        });
      }
    },
    
    "addHiddenFields": function(options){
      if(JSON.stringify(options.formcollection) === '{}' || typeof(options.formcollection=="undefined")){
        this.initFormfields(options);
      }
      for(var prop in options.GET){
        if(!isset(options.formcollection,prop)){
          if(!isset(options,'fields'))options.fields=[];
          let field={};
          field.name=prop;
          field.type="hidden";
          field.value=options.GET[prop];
          var i=options.fields.push(field);
          options.formcollection[itemname]=options.fields[i];
        }
      }
    },
    
    "innerHTML":"",
    "displayDropdownCount": function(options){
      let count=0;
      let items=options['items'];
      var displaymode=getfromArray(options,"displaymode","inlist");
      for(var i=0;i<items.length;i++){
        let inlist=getfromArray(items[i],'inlist',true);inform=getfromArray(items[i],'inform',true);atlink=getfromArray(items[i],'atlink',true);
        if((displaymode=="inlist" && inlist) || (displaymode=="inform" && inform) || (displaymode=="atlink" && atlink)){
          count++;
        }
      }
      return count;
    },
    "displayDropdown": function(options){
      var obj=$.extend(true,{
          'button':{
              'html':'<button data-bs-toggle="dropdown" class="dropdown-toggle" aria-expanded="false"></button>',
              'text':'please select',
              'carettype':1,
              /*'pretext':''*/
              /*'id':'dropdownMenuButton1'*/
              /*'tagName':''*/
              'class':'btn btn-light',
          },
          'class_main':'dropdown',
          /* value_selected */
          'class_ul':'dropdown-menu',
          /*'class_li':'',*/
          /*'back':'innerHTML'*/
        },options
      );
      var displaymode=getfromArray(obj,"displaymode","inlist");
      var el_button;
      if(!obj.el_dd)obj.el_dd=document.createElement("div");
      if(obj['items'] && obj.el_dd){
          var el_dd=obj.el_dd;
          el_dd.classList.add(obj.class_main);
          var class_str_li="";
          if(obj['class_li'])class_str_li=' class="'+obj['class_li']+'"';

          var label=obj.button.text;
          if(obj['value_selected']){
              for(var i=0;i<obj['items'].length;i++){
                  if(obj['items'][i]['value']==obj['value_selected']){
                      label=getfromArray(obj.button,'pretext')+obj['items'][i]['label'];
                  }
              }
          }else if(isset(obj,"button","text")){
              label=obj.button.text;
          }
          if(obj.button.carettype==1){
              obj.button.class+=" dropdown-toggle";
          }
          if(isset(obj.button.tagName))obj.button.html=obj.button.html.replaceAll('button',obj.button.tagName)
          el_button=$(obj.button.html).appendTo(el_dd)[0];
          if(obj.button.stlye)el_button.style.cssText=obj.button.stlye;
          
          el_button.innerHTML=label;
          var arr=obj.button.class.split(" ");
          if(arr.length>0){
            for(var i=0;i<arr.length;i++){
              if(!gbnull(arr[i]))el_button.classList.add(arr[i]);
            }
          }
          if(obj.button.id)el_button.setAttribute("id",obj.button.id);
          if(obj.button.attributes){
            this.obj2attributes(el_button,obj.button.attributes);
          }
            
          // ----------- ul
          el_ul=$('<ul class="'+obj.class_ul+'">').appendTo(el_dd)[0];
          displayDropdownItems(el_ul,obj['items']);
          if(obj.button.dataBsAutoClose)el_button.dataset.bsAutoClose=obj.button.dataBsAutoClose;
          this.innerHTML=el_dd.innerHTML;
          
          function displayDropdownItems(el_ul,items){
            for(var i=0;i<items.length;i++){
              let inlist=getfromArray(items[i],'inlist',true);inform=getfromArray(items[i],'inform',true);atlink=getfromArray(items[i],'atlink',true);
              if((displaymode=="inlist" && inlist) || (displaymode=="inform" && inform) || (displaymode=="atlink" && atlink)){
                var type=getfromArray(items[i],"type");
                if(items[i]['items']){
                  //var el_li=$('<li class="dropdown-submenu dropend"><a class="'+getfromArray(items[i],'class_a','dropdown-item')+'"'+' data-value="'+obj['items'][i]['value']+'" data-bs-toggle="dropdown" href="'+getfromArray(obj['items'][i],'href','#',true)+'">'+obj['items'][i]['label']+'</a></li>').appendTo(el_ul);
                  //var el_li=$('<li class="dropend"><a class="'+getfromArray(items[i],'class_a','dropdown-item dropdown-toggle')+'"'+' data-bs-toggle="dropdown" data-value="'+obj['items'][i]['value']+'" href="'+getfromArray(obj['items'][i],'href','#',true)+'">'+obj['items'][i]['label']+'</a></li>').appendTo(el_ul);
                  var el_li=$('<li class="dropdown-submenu dropend"><a class="'+getfromArray(items[i],'class_a','dropdown-item')+'"'+' data-value="'+items[i]['value']+'" data-bs-auto-close="outside" data-bs-toggle="dropdown" href="'+getfromArray(items[i],'href','#',true)+'">'+items[i]['label']+'</a></li>').appendTo(el_ul);
                  var el_ulsub=$('<ul class="'+obj.class_ul+'">').appendTo(el_li)[0];
                  displayDropdownItems(el_ulsub,items[i]['items']);
                }else if(type=="divider"){
                  var el_li=$('<li'+class_str_li+'><hr class="dropdown-divider"></li>').appendTo(el_ul);
                }else if(obj['value_selected']){
                  if(items[i]['value']==obj['value_selected']){
                    // no display
                  }else{
                    displayDropdownItem(items[i],el_ul);
                  }
                }else{
                    displayDropdownItem(items[i],el_ul);
                }
              }
            }
          }
          
          function displayDropdownItem(item,el_ul){
            var el_li=$('<li'+class_str_li+'><a class="'+getfromArray(item,'class_a','dropdown-item')+'"'+
                      ' data-value="'+getfromArray(item,'value')+'" href="'+getfromArray(item,'href','#',true)+'">'+getfromArray(item,'label')+'</a></li>').appendTo(el_ul);
          }
      }
    },
    "onChangeDatalist": function(options){
      if(options.datalists){
        let el_form=this.el_form
        $(el_form).on("change","input",function(e){
          var el=e.target;
          var name=el.name
          if(options.datalists[name]){
            var datalist=options.datalists[name];
            var index_datalist=getArrayIndexfromValue(datalist.data,datalist.datalistcolumn,this.value);
            var dat_datalist={};
            if(index_datalist!==-1){
              if(datalist.el_key)datalist.el_key.value=datalist.data[index_datalist][datalist.key];
              dat_datalist=datalist.data[index_datalist];
            }else{
              if(datalist.el_key)datalist.el_key.value=0;
              if(datalist.onlyoptions)datalist.el_datalistfield.value='';
            }

            var el_inputgroup=$(this).parents('.input-group')[0];
            if(!el_inputgroup)el_inputgroup=this;
            if(el_inputgroup.dataset.fieldlist){
              var fields=el_inputgroup.dataset.fieldlist.split(',');
              for(var i=0;i<fields.length;i++){
                if(fields[i].indexOf('=')>-1){
                    var map=fields[i].split('=');
                    dat_datalist[map[0]]=getfromArray(dat_datalist,map[1]);
                }else{
                    dat_datalist[fields[i]]=getfromArray(dat_datalist,fields[i]);
                }
              }
              obj2form(dat_datalist,el_form,true);
            }
          }                    
        });
      }
    },

    "show_customerbusinesscard":function(options){
      // options:
      //  dat
      //  accountID
      //  settingscustomer
      let thisobj=this;
      let settingscustomer=options.settingscustomer;
      if(isset(options,'dat')){
        show_overlay(options.dat,settingscustomer);
      }else{
        let path=GLOBALS_hostpath+'../'.repeat(settings.masterdata.script_depth);
        let url=path+settingscustomer.masterdata.url_readfilter;
        let accountID=options.accountID;
        let params=Object.assign({},settingscustomer.masterdata.data_readfilter);
        params.clause="accountID="+accountID;
        $.getJSON(url,params, function(oJson) {
          if(oJson.length==1){
            show_overlay(oJson[0],settingscustomer);
          }
        })
        .fail(function(jqxhr, textStatus, error ) {
            var err = url+", Request Failed, "+ textStatus + ", " + error;
            console.log(err);
        });			
      }
      function show_overlay(dat,settingscustomer){
        let el_overlay=thisobj.createOverlay()[0];
        thisobj.el_content.innerHTML=ReplacePlaceholder(settingscustomer.html.display.record,dat,2);
        conditional_output(thisobj.el_content,dat);
      }
    },

    "obj2formelements":function(obj,el_form){
      for(var prop in obj){
        if(obj.hasOwnProperty(prop)){
          if(el_form.elements.namedItem(prop)){
            // element already in form
          }else{
            var el=document.createElement('input');
            el.type="hidden";
            el.name=prop;
            el.value=obj[prop];
            el_form.appendChild(el);
          }
        }
      }
    },

    "obj2url":function(obj,baseurl){
      if (window.history.replaceState) {
        //baseurl=window.location.href.split('?')[0];
        baseurl=typeof arr=='undefined' ? window.location.href.split('?')[0] : baseurl;        
        var baseqry="";
        for(var prop in obj){
          if(obj.hasOwnProperty(prop)){
            baseqry+='&'+prop+'='+obj[prop];
          }
        }
        var url=baseurl+'?'+baseqry.substr(1)
        window.history.replaceState(null, document.title, url);
      }
    },

    "query_str_to_obj":function(str,parameter){
      let arr=str.split('?');
      if(arr.length==2){
        str=arr[1];
      }else{
        str=arr[0];
      }
      arr=str.split('&');
      let parameters={};
      for(let i=0;i<arr.length;i++){
        let pairs=arr[i].split("=");
        if(pairs.length==2){
          parameters[pairs[0]]=pairs[1];
        }
      }
      return parameters;
    },
    
    "getQueryParameter":function(str,parameter){
      let arr=str.split('?');
      if(arr.length==2){
        str=arr[1];
      }else{
        str=arr[0];
      }
      arr=str.split('&');
      let parameters={};
      for(let i=0;i<arr.length;i++){
        let pairs=arr[i].split("=");
        if(pairs.length==2){
          parameters[pairs[0]]=pairs[1];
        }
      }
      return getfromArray(parameters,parameter);
      
    },
    "obj2queryparameters":function(obj,arr){
      arr=typeof arr!=='undefined' ? arr : [];        
      let parameters='';
      for(var prop in obj){
        if(arr.length==0 || arr.indexOf(prop)>=0){
          parameters=gsclauseand(parameters,prop+'='+obj[prop],true,'&');
        }          
      }
      return parameters;
    },
  
    "displayImage":function(options){
      // GLOBALS_hostpath
        var el_main;
        var myobj=this;
        var my=$.extend(true,
            {
                el_base:document,
                selector:'.pic_ph',
                basetype:'',
                baseID:0,
                dat:[],         /* parent dat */
                data:[],        /* imagearray */
                mode:0,         /* 0=single, 1=multiple image */
                loaddata:0,
                "parent_rightuser_update":0,
                "script_depth":0,
                "showtext":false,
                html:{
                    upload_blank:'<div style="height: 140px; border: 1px solid #bbb"><p class="text-center" style="padding: 10px; position: relative; top: 40px">upload image not yet possible</p></div>',
                    upload_dropzone:'<form style="height:100%" class="d-flex align-items-center justify-content-center dropzone k8-margin-bottom-normal"> <input type="hidden" name="basetype" value=""> <input type="hidden" name="baseID" value=""> <input type="hidden" name="type" value="image"></form>',
                    upload_1_container:'<div class="js_rec_container" data-rec_object="k8references" data-rec_indexmax="-1"> <div class="js_rec_record" data-keyvalue="{{image_ID}}" style="position: relative"> <!--<div class="k8-checkbox"><input type="checkbox" class="js_img_delete"></div>--> <button type="button" class="btn btn-light js_img_delete k8-iamge-btn-delete">#ls#Delete#</button> <div class="k8-box-square k8-margin-bottom-normal"> <div class="k8-box-content"> <img class="k8-image-{{image_orientation}}" src="'+'{{image_file}}"> </div> </div> </div></div>',
                    upload_m_blank:"<div class='k8-images'> <div class='js_rec_container rec_container k8-padding-12' data-rec_object='k8references' data-rec_indexmax='-1'> <div style='display: flex;'> <div style='flex: 1 1 25%'><h3 class=\"mt-1\">"+getl('Images')+"</h3></div> <div style='flex: 1 1 50%' id='picutes'> <div style='border: 2px solid rgba(0, 0, 0, 0.3);'> <p style='text-align: center; margin: 0.5em 0'>upload image not yet possible</p> </div> </div> <div style='flex: 1 1 25%;text-align: right; padding-top: 0px;'></div> </div> <div class='row js_rec_records'></div> </div></div>",
                    upload_m_container:"<div class='k8-images'> <div class='js_rec_container rec_container k8-padding-12' data-rec_object='k8references' data-rec_indexmax='-1'> <div style='display: flex;'> <div style='flex: 1 1 25%'><h3 class=\"mt-1\">"+getl('Images')+"</h3></div> <div style='flex: 1 1 50%;margin:0 5px' class='dropzone-wrapper'> </div> <div style='flex: 1 1 25%;text-align: right; padding-top: 0px;'> <button type='button' class='btn btn-primary js_DeleteSelected'>#ls#Delete#</button> </div> </div> <div class='row js_rec_records'> </div> </div></div>",
                    upload_m_record:"<div id='image_{{image_ID}}' class='px-2 col-md-4 js_rec_record' style='position: relative' data-keyvalue='{{image_ID}}' data-rec_index=''> <div class='k8-checkbox'> <input type='checkbox' class='js_selected'> </div> <div class='k8-box-square k8-margin-bottom-normal'> <div class='k8-box-content'> <img class='k8-image-{{image_orientation}}' src='"+"{{image_file}}'><div class='k8-top-centered js_text' style='display: none;'>{{image_filename}}</div></div> </div></div>"
                },
                url_readfilter:"masterdata/ProcessData.php",
                url_save: "masterdata\/ProcessData.php?datadefID=8&process_action=Save",
                url_del:'masterdata/ProcessData.php?datadefID=8&process_action=Del',
                data_readfilter:{datadefID:8,process_action:"ReadFilter"},
                dropzone:{
                    init: function() {
                        var $this = this;
                        $(el_main).find("button#clear-dropzone").click(function() {
                            $this.removeAllFiles(true);
                        }),
                        this.on("thumbnail",(file) => {
                          // Do the dimension checks you want to do
                          var bok=true;
                          if(my.minImageWidth){
                            if (file.width < my.minImageWidth) {
                              bok=false;
                            }
                          }
                          if(my.minImageHeight){
                            if (file.height < my.minImageHeight) {
                              bok=false;
                            }
                          }
                          if(bok){
                            file.acceptDimensions();
                          }else{
                            file.rejectDimensions()
                          }
                        }),
                        this.on("complete", function (file) {
                            if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
                              console.log('finished upload');
                              if(my.dataAfterUpload){
                                  my.dataAfterUpload({dat:my.dat});
                              }
                              reloadData();
                            }
                        });
                    },
                    accept(file, done) {
                      file.acceptDimensions = done;
                      file.rejectDimensions = () => { done("Invalid dimension."); };
                    },
                    error: function(e,error) {
                        console.log(error);
                        myobj.message(error,"alert");
                    },
                    paramName: "file",
                    maxFilesize: 5,
                    maxFiles : 5,
                    autoProcessQueue : true
                }
            }, options);
        if(options.data)my.data=options.data;
        if(options.dat)my.dat=options.dat;
        el_main=my.el_base.querySelector(my.selector);
        if(!el_main){console.log(
            my.selector+' not valid!');
            return 0;
        }
        if(my.basetype==''){console.log('basetype not valid');}

        //catalog
        var el_rec_container;
        var el_records;
        var path=GLOBALS_hostpath+'../'.repeat(my.script_depth);
        
        init();
        
        function init(){
            if(my.mode==0){ 
                // single image
                my.dropzone.maxFiles=1;
                if(my.baseID==0){
                    el_main.innerHTML=ReplacePlaceholder(my.html.upload_blank);
                }else if(my.data.length==0){
                    if(my.loaddata){
                        my.data_readfilter.filters=[{"field":"basetype","type":"=","value":my.basetype},
                                {"field":"baseID","type":"=","value":my.baseID},
                                {"field":"type","type":"=","value":"image"}
                            ];
                        var url=path+my.url_readfilter;    
                        $.getJSON(url,my.data_readfilter, function(oJson) {
                            showImageSingle(oJson);
                        })
                        .fail(function(jqxhr, textStatus, error ) {
                            var err = url+", Request Failed, "+ textStatus + ", " + error;
                            console.log(err);
                        });			
                    }else{
                        insertDropzone(el_main);
                    }
                }else{
                    showImageSingle(my.data);
                }
            }else{
                if(my.baseID==0){
                    el_main.innerHTML=my.html.upload_m_blank;
                }else{
                    el_main.innerHTML=ReplacePlaceholder(my.html.upload_m_container);
                    el_rec_container=$(el_main).find('.js_rec_container')[0];
                    el_records=$(el_main).find('.js_rec_records')[0];

                    //console.log(my.data.length);
                    if(my.data.length>0){
                        showImageCatalog(my.data);
                    }else if(my.loaddata){
                        //ajax
                        my.data_readfilter.filters=[{"field":"basetype","type":"=","value":my.basetype},
                                {"field":"baseID","type":"=","value":my.baseID},
                                {"field":"type","type":"=","value":"image"}
                            ];
                        var url=path+my.url_readfilter;    
                        $.getJSON(url,my.data_readfilter, function(oJson) {
                            showImageCatalog(oJson);
                        })
                        .fail(function(jqxhr, textStatus, error ) {
                            var err = url+", Request Failed, "+ textStatus + ", " + error;
                            console.log(err);
                        });			
                    }else{
                        showImageCatalog(my.data);
                    }
                } 
                return el_main;
            }
        }
        
        function reloadData(){
            my.data_readfilter.filters=[{"field":"basetype","type":"=","value":my.basetype},
                    {"field":"baseID","type":"=","value":my.baseID},
                    {"field":"type","type":"=","value":"image"}
                ];
            var url=path+my.url_readfilter;    
            $.getJSON(url,my.data_readfilter, function(oJson) {
                my.data=oJson;
                if(my.row)updaterow();
                //console.log(my.data);
                init();
            })
            .fail(function(jqxhr, textStatus, error ) {
                var err = url+", Request Failed, "+ textStatus + ", " + error;
                console.log(err);
            });			
        }
        function showImageSingle(data){
            if(data.length==0){
                if(my.parent_rightuser_update){
                    insertDropzone(el_main);
                }else{
                    el_main.innerHTML=ReplacePlaceholder(my.html.upload_1_container);
                }
            }else{
                el_main.innerHTML=ReplacePlaceholder(my.html.upload_1_container,data[0],2,path);
                if(my.parent_rightuser_update){
                    // ----------- delete
                    $(el_main).on("click",".js_img_delete",function(){
                        if(!$(this).hasClass('js_disabled')){
                            if(confirm(getl('delete')+'?')){
                                var el_rec_record=$(this).parents('.js_rec_record')[0];
                                var index=el_rec_record.dataset.rec_index;
                                var keyvalue=el_rec_record.dataset.keyvalue;
                                var o={}
                                o['ID']=keyvalue;
                                $.getJSON(path+my.url_del,o, function(oJson) {
                                    if(oJson.bok){
                                        delete(my.data[index]);
                                        if(my.row)updaterow();
                                        $(el_main).off("click",".js_img_delete");
                                        insertDropzone(el_main);
                                        if(my.dataAfterDelete){
                                            my.dataAfterDelete();
                                        }
                                    }else{
                                        console.log('error by delete: '+oJson.error);
                                    }
                                })
                                .fail(function(jqxhr, textStatus, error ) {
                                    var err = url+", Request Failed, "+ textStatus + ", " + error;
                                    console.log(err);
                                });			

                            }
                        }
                    });
                }else{
                    $(el_main).find('.js_img_delete').hide();
                }
            }
        }
        function insertDropzone(el){
            if(my.parent_rightuser_update){
                el.innerHTML=my.html.upload_dropzone;
                el_dropzone_form=el.querySelector(".dropzone");
                el_dropzone_form.setAttribute("action", path+my.url_save);
                el_dropzone_form.elements.namedItem('basetype').value=my.basetype;
                el_dropzone_form.elements.namedItem('baseID').value=my.baseID;
                $(el_dropzone_form).dropzone(my.dropzone);
            }else{
                el.innerHTML=my.html.upload_blank;
            }
        }

        function showImageCatalog(data){
            el=$(el_main).find('.dropzone-wrapper')[0];
            if(el){
                if(data.length>0){
                    if(my.parent_rightuser_update){
                        //insertDropzone(el);
                    }
                }else{
                    insertDropzone(el);
                }
            }
            
            // ----------------- delete button
            var el_btndelete=$(el_rec_container).find('.js_DeleteSelected');
            if(my.parent_rightuser_update && data.length>0){
                $(el_btndelete).on('click',function(){
                  var el_checked=$(el_rec_container).find('input:checked');
                  if(el_checked.length>0){
                    if(confirm(getl('delete')+'?')){
                        for(var n=0;n<el_checked.length;n++){
                          var el_rec_record=$(el_checked[n]).parents('.js_rec_record')[0];
                          var index=el_rec_record.dataset.rec_index;
                          var o={};
                          o['ID']=el_rec_record.dataset.keyvalue;
                          $.getJSON(path+my.url_del,o, function(oJson) {
                              if(oJson.bok){
                                delete(my.data[index]);
                                if(my.row)updaterow();
                                var el_rec_record=$(el_rec_container).find('.js_rec_record[data-keyvalue="'+oJson.bok+'"]')[0];
                                el_rec_record.remove();
                                if(my.dataAfterDelete){
                                    my.dataAfterDelete();
                                }
                              }else{
                                  console.log('error by delete: '+oJson.error);
                              }
                          });
                        }
                    }
                }else{
                    alert(getl('please select images!'));
                }
                });
            }else{
                //$(el_btndelete).prop("disabled", true);
                $(el_btndelete).hide();
            }
            let el_image1;
            let el_dropzone_wrapper;
            if(data.length==1){
              el_dropzone_wrapper=$('<div class="col-md-8 pb-3"></div>').appendTo(el_records)[0];
              if(my.parent_rightuser_update){
                insertDropzone(el_dropzone_wrapper);
              }
            }else if(data.length>=2){
              el_dropzone_wrapper=$('<div class="col-md-4 pb-3"></div>').appendTo(el_records)[0];
              if(my.parent_rightuser_update){
                insertDropzone(el_dropzone_wrapper);
              }
            }
           
            for(var i=0;i<data.length;i++){
                var line=ReplacePlaceholder(my.html.upload_m_record,data[i],2,path);
                $(el_records).append(line);
                var el_rec_record=$(el_records).children().last()[0];
                el_rec_record.dataset['rec_index']=i;
                if(my.showtext)$(el_rec_record).find(".js_text").show();
                if(i==0)el_image1=el_rec_record;

            }
            el_rec_container.dataset.rec_indexmax=i;
            if(el_image1)el_dropzone_wrapper.height=el_image1.height;
              
            // disable checkbox
            if(!my.parent_rightuser_update){
                $(el_rec_container).find(':checkbox').hide();
            }else{
                $(el_records).find('.js_rec_record').css('cursor','all-scroll');
                $(el_records).sortable({
                    update: function(event, ui) {
                        var arr = $(this).sortable('toArray');
                        var url=path+"masterdata/ProcessData.php?datadefID=8&process_action=sort";
                        $.getJSON(url,{"arr":arr,prefix:"image_"}, function(oJson) {
                            if(oJson.bok){
                                var arrID=[];
                                for(var i=0;i<arr.length;i++){
                                  arrID.push(arr[i].substring(6));
                                }
                                arraySortByArray(my.data,"ID",arrID);
                                if(my.row)updaterow();
                                /*
                                var datasort=[];
                                for(var i=0;i<arr.length;i++){
                                  //var index=getArrayIndexfromValue(my.data,"ID",);
                                }
                                my.data=oJson.data;
                                */
                                if(my.dataSortUpdate){
                                    my.dataSortUpdate();
                                }
                            }else{
                                console.log(oJson.error);
                            }
                          })
                          .fail(function(jqxhr, textStatus, error ) {
                              var err = url+", Request Failed, "+ textStatus + ", " + error;
                              console.log(err);
                        });			
                    }
                });
            }
        }
        function updaterow(){
          my.row.update({imagearray:my.data});
          if(my.dat && my.data[0]){
            my.dat["image_count"]=my.data.length;
            my.dat["image_ID"]=my.data[0]["image_ID"];
            my.dat["image_file"]=my.data[0]["image_file"];
            my.dat["image_filename"]=my.data[0]["image_filename"];
            my.dat["image_height"]=my.data[0]["image_height"];
            my.dat["image_orientation"]=my.data[0]["image_orientation"];
            my.dat["image_width"]=my.data[0]["image_width"];
            my.dat["image_aspectratio"]=my.data[0]["image_aspectratio"];
          }
        }
    },
    
/* overlay    */
    "el_content":0,
    "createOverlay":function(options){
      var width=Math.round(window.innerWidth*0.9);
      if(width>1170)width=1170;
      var height=Math.round(window.innerHeight*0.9);
      
      var class_overlay=getfromArray(options,"class_overlay","k8-overlay");
      var class_content=getfromArray(options,"class_overlay","k8-overlay_content");
      var html='<div class="'+class_overlay+'">' +
                  '<div style="width: '+width+'px;max-height: '+height+'px;overflow-y:auto">' +
                      '<div style="text-align: right; padding-right: 6px"><a style="cursor:pointer;" id="btnOverlay">&times;</a></div>'+
                      '<div style="padding: 0 20px 20px 20px" class="'+class_content+'">'+
                          '<div class="masterdata">' +
                      '</div>'+
                  '</div>'+
              '</div>';
      
      var el_md=$(html).appendTo('body')[0];
      //var el_md=document.getElementById('k8-overlay');
      $(el_md).find('#btnOverlay').on('click',function(e){
          e.preventDefault();
          $("."+class_overlay).remove();
      });
      //return $(el_md).find('#overlay_content')[0];
      //return $(el_md);
      this.el_content=$(el_md).find('.'+class_content)[0];
      return el_md;
    },
    
    "createOverlayid":function(options){
      var width=Math.round(window.innerWidth*0.9);
      if(width>1170)width=1170;
      var height=Math.round(window.innerHeight*0.9);
      
      var html='<div id="k8-overlay">' +
                  '<div style="width: '+width+'px;max-height: '+height+'px;overflow-y:auto">' +
                      '<div style="text-align: right; padding-right: 6px"><a style="cursor:pointer;" id="btnOverlay">&times;</a></div>'+
                      '<div style="padding: 0 20px 20px 20px" id="overlay_content">'+
                          '<div class="masterdata">' +
                      '</div>'+
                  '</div>'+
              '</div>';
      
      var el_md=$(html).appendTo('body')[0];
      $(el_md).find('#btnOverlay').on('click',function(e){
          e.preventDefault();
          $("#k8-overlay").remove();
      });
      this.el_content=$(el_md).find('#overlay_content')[0];
      return el_md;
    },

/* form    */
    "el_form":0,
    "data":[],
    "initSimpleFormEvents":function(options){
      // selector
      var othis=this;
      var dat={};
      var index=-1;
      var path=GLOBALS_hostpath+'../'.repeat(options.masterdata.script_depth);
      
      let key=options.key;
      let datalistcolumn=options.datalistcolumn;
      let datalistfield=getfromArray(options,'datalistfield',datalistcolumn);
      let datalistid=getfromArray(options.masterdata,'datalistid',"simpledata");
      let url_save=getfromArray(options.masterdata,'url_save');
      let url_del=getfromArray(options.masterdata,'url_del');
      let url_readfilter=getfromArray(options.masterdata,'url_readfilter');
      let data_readfilter=getfromArray(options.masterdata,'data_readfilter');
      let defaultvalues=getfromArray(options.masterdata,'defaultvalues',{});
      let el_md=othis.el_form.parentElement;
      if(gbnull(key)){
        console.log('key column not set!');
        return;
      }
      if(gbnull(datalistcolumn)){
        console.log('datalistcolumn not set!');
        return;
      }
      othis.data=options.data;
      if(!othis.el_form)othis.el_form=document.querySelector(options.selector);
      if(othis.el_form){

        let el_datalist=document.createElement("datalist");
        el_datalist.id=datalistid;
        othis.el_form.append(el_datalist);
        var el_datalistfield=othis.el_form.elements.namedItem(datalistfield);
        
        othis.fillDatalist({"el_datalist":el_datalist,"data":othis.data,"field":datalistcolumn});
        if(!gbnull(url_readfilter)){
          el_datalistfield.addEventListener("input",function(e){
            var el=e.target;
            console.log(el.value);
            data_readfilter.clause=datalistcolumn+" like '%"+el.value+"%'";
            let url=path+url_readfilter;
            $.getJSON(url,data_readfilter,function(oJson) {
              othis.data=oJson;
              othis.fillDatalist({"el_datalist":el_datalist,"data":othis.data,"field":datalistcolumn});
            })
            .fail(function(jqxhr, textStatus, error ) {
                var err = textStatus + ", " + error;
                console.log("saverecord.Request Failed: " + err );
            });
          });
        }        
        
        el_datalistfield.addEventListener("change",function(e){
          console.log("datalistfield change");
          var el=e.target;
          index=getArrayIndexfromValue(othis.data,datalistcolumn,el.value);
          if(gbnull(el.value)){
            // nothing initform();
          }else if(index!==-1){
            dat=othis.data[index];
            /*
            if(options.masterdata.cbBeforeLoad) {
              options.masterdata.cbBeforeLoad({"el_md":el_md,"dat":dat,"settings":options});
            }
            */
            cb(options,'cbBeforeLoad',{"settings":options,"el_md":el_md,"el_form":othis.el_form,"dat":dat});

            obj2form(dat,othis.el_form);
            /*
            if(options.masterdata.cbAfterLoad) {
                options.masterdata.cbAfterLoad({"el_md":el_md,"dat":dat,"settings":options});
            }
            */
            cb(options,'cbAfterLoad',{"settings":options,"el_md":el_md,"el_form":othis.el_form,"dat":dat});
            
          }else {
            // do nothing
          }
        });

        $(othis.el_form).on("change","input,textarea,select",function(e){
            gFormatinputfordisplay(this,this.value);
            //if(bwithdirty)el_dirty.src=path+"masterdata/pic/icon_dirty.png";
            /*
            if(options.masterdata.cbChange) {
                options.masterdata.cbChange({"el_md":el_md, "el":this,"name":this.name,"dat":dat,"this":this});
            }
            */
            cb(options,'cbBeforeDelete',{"settings":options,"el_md":el_md,"el_form":othis.el_form,"el":this,"name":this.name,"dat":dat,"this":this});
        });
        
        
        let el_rec_new=othis.el_form.querySelector('.js_rec_new');
        el_rec_new.addEventListener("click",function(){
          initform();
          othis.el_form.elements.namedItem(datalistfield).focus();
        });

        let el_rec_delete=othis.el_form.querySelector('.js_rec_delete');
        el_rec_delete.addEventListener("click",function(){
          console.log('js_rec_delete')
          if(confirm(getl('Delete?'))){
            var cancel=false;
            //var dat={};
            // deprecated:
            dat[key]=othis.el_form.elements.namedItem(key).value;
            index=getArrayIndexfromValue(othis.data,key,dat[key]);
            /*
            if(options.masterdata.cbBeforeDelete){
              cancel=options.masterdata.cbBeforeDelete({"el_md":el_md,"dat":dat});
            }
            */
            cb(options,'cbBeforeDelete',{"settings":options,"el_md":el_md,"el_form":othis.el_form,"dat":dat});
            if(!cancel){
              if(gbnull(url_del)){
                /*
                if(options.masterdata.cbAfterDelete){
                  cancel=options.masterdata.cbAfterDelete({"el_md":el_md,"dat":dat});
                }
                */
                cb(options,'cbAfterDelete',{"settings":options,"el_md":el_md,"el_form":othis.el_form,"dat":dat});
                delete(othis.data[index]);
                othis.fillDatalist({"el_datalist":el_datalist,"data":othis.data,"field":datalistcolumn});
                initform();
              }else{
                let url=path+url_del;
                $.getJSON(url,dat,function(oJson) {
                  if(oJson.bok){
                    /*
                    if(options.masterdata.cbAfterDelete){
                      cancel=options.masterdata.cbAfterDelete({"el_md":el_md,"dat":dat});
                    }
                    */
                    cb(options,'cbAfterDelete',{"settings":options,"el_md":el_md,"el_form":othis.el_form,"dat":dat});
                    delete(othis.data[index]);
                    othis.fillDatalist({"el_datalist":el_datalist,"data":othis.data,"field":datalistcolumn});
                    
                    initform();
                  }else{
                      console.log('error by delete: '+oJson.error);
                      othis.message('error by delete: '+oJson.error,'alert',undefined,options.masterdata.message_position);
                  }
                })
                .fail(function(jqxhr, textStatus, error ) {
                    var err = textStatus + ", " + error;
                    console.log("delete.Request Failed: " + err );
                });
              }
            }
          }
        });

        othis.el_form.addEventListener("submit",function(e){
          e.preventDefault();
          var cancel=false;
          /*
          if(options.masterdata.cbPrepareSave) {
              options.masterdata.cbPrepareSave({"el_form":othis.el_form,"el_md":el_md});
          }
          */
          cb(options,'cbPrepareSave',{"settings":options,"el_md":el_md,"el_form":othis.el_form});
          dat=form2obj(othis.el_form);
          var bnew=gbnull(dat[key]);
          index=getArrayIndexfromValue(othis.data,key,dat[key]);
          /*
          if(options.masterdata.cbBeforeSave){
            cancel=options.masterdata.cbBeforeSave({"el_form":othis.el_form,"el_md":el_md,"dat":dat});
          }
          */
          cb(options,'cbBeforeSave',{"settings":options,"el_md":el_md,"el_form":othis.el_form,"dat":dat,"bnew":bnew});
          
          if(!cancel){
            if(gbnull(url_save)){
              if(index>-1){
               othis.data[index]=dat;
              }else{
                othis.data.push(dat);
              }
              othis.fillDatalist({"el_datalist":el_datalist,"data":othis.data,"field":datalistcolumn});
            }else{
              let url=path+url_save;
              $.getJSON(url,dat, function(oJson) {
                if(oJson.bok){
                    var dat=oJson.dat;
                    obj2form(dat,othis.el_form);
                    if(index>-1){
                     othis.data[index]=dat;
                    }else{
                      othis.data.push(dat);
                    }
                    othis.fillDatalist({"el_datalist":el_datalist,"data":othis.data,"field":datalistcolumn});
                    othis.message(getl('Saved'),'saved');
                    /*
                    if(options.masterdata.cbAfterSave) {
                        options.masterdata.cbAfterSave({"el_md":el_md,"el_form":othis.el_form,"dat":dat,"bnew":bnew});
                    }
                    */
                    cb(options,'cbAfterSave',{"settings":options,"el_md":el_md,"el_form":othis.el_form,"dat":dat,"bnew":bnew});

                }else{
                    othis.message(oJson.error,'alert');
                }
              })
              .fail(function(jqxhr, textStatus, error ) {
                  var err = textStatus + ", " + error;
                  console.log("saverecord.Request Failed: " + err );
              });
            }
          }
        });
        initform();

        function initform(){
          index=-1;
          dat=defaultvalues;
          /*
          if(options.masterdata.cbBeforeNew) {
              options.masterdata.cbBeforeNew({"el_md":el_md,"dat":dat});
          }
          */
          cb(options,'cbBeforeNew',{"settings":options,"el_md":el_md,"el_form":othis.el_form,"dat":dat});

          obj2form(dat,othis.el_form);
          /*
          if(options.masterdata.cbAfterNew) {
              options.masterdata.cbAfterNew({"el_md":el_md,"dat":dat});
          }
          */
          cb(options,'cbAfterNew',{"settings":options,"el_md":el_md,"el_form":othis.el_form,"dat":dat});
         
        }
        
        
      }else{
        console.log("options.selector="+options.selector+" not found!");
      }
    },

    "download_ics":function(options){
      // moment.js
      let filename=getfromArray(options,'filename',"date.ics");
      let dat=getfromArray(options,'dat',{});
      let template=getfromArray(options,'template','BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:{{website}}\nMETHOD:PUBLISH\nBEGIN:VEVENT\nUID:{{uid}}\nORGANIZER;CN={{company}}:MAILTO:{{mailfrom}}\nATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN={{name_ATTENDEE}};X-NUM-GUESTS=0:mailto:{{email_ATTENDEE}}\nLOCATION:{{location}}\nSUMMARY:{{subject}}\nDESCRIPTION:{{description}}\nCLASS:PUBLIC\nDTSTART:{{datetimefrom_ics}}\nDTEND:{{datetimeto_ics}}\nDTSTAMP:{{datetimecreated_ics}}\nEND:VEVENT\nEND:VCALENDAR');
      
      var docdate=moment();
      if(!gbnull(getfromArray(dat,'datetimefrom')))docdate=moment(dat['datetimefrom']);
      dat['datetimefrom_ics']=docdate.format("YYYYMMDDTHHmmss");
      if(!gbnull(getfromArray(dat,'datetimeto')))docdate=moment(dat['datetimeto']);
      dat['datetimeto_ics']=docdate.format("YYYYMMDDTHHmmss");
      if(!gbnull(getfromArray(dat,'datetimecreated')))docdate=moment(dat['datetimecreated']);
      dat['datetimecreated_ics']=docdate.format("YYYYMMDDTHHmmss");

      let text=ReplacePlaceholder(template,dat,2);
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURI(text));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    "obj2attributes":function(el,attributes){
      if(el){
        for(prop in attributes){
          if(attributes.hasOwnProperty(prop)){
            el.setAttribute(prop,attributes[prop]);
          }
        }
      }else{
        console.log('obj2attributes: el not set!');
      }
    },
    "obj2attributes_str":function(attributes){
      var input_attributes="";
      /*
      for(prop in attributes){
        if(attributes.hasOwnProperty(prop)){
          if(prop=='class_add'){
            if(!attributes.class)attributes.class="";
            attributes.class=gsclauseand(attributes.class,attributes[prop],true," ");
          }
        }
      }
      */
      for(prop in attributes){
        if(attributes.hasOwnProperty(prop)){
          if((",required,readonly,disabled,checked,").indexOf(","+prop+",")>-1){
            input_attributes=gsclauseand(input_attributes,prop,attributes[prop],' ');
          }else if(prop=='class_add'){
            // nothing
          }else{
            input_attributes=gsclauseand(input_attributes,prop+'="'+attributes[prop]+'"',true,' ');
          }
        }
      }
      return input_attributes;
    },
    /*
    "formcollection":{},
    "formoptions":{},
    "initFormfields":function(options,first){
      first=typeof first!=='undefined' ? first : true;        
      if(first){
        this.formoptions=options;
      }
      var fields=options.fields;
      var containers=getfromArray(options,'containers',[]);
        */
    "initFormfields":function(options,container){
      if(!isset(options,"formcollection"))options.formcollection={};
      //this.formcollection=new {};
      var fields;
      var containers;
      if(container){
        fields=container.fields;
        containers=getfromArray(container,'containers',[]);
      }else{
        fields=options.fields;
        containers=getfromArray(options,'containers',[]);
      }
      if(fields){
        for(var i=0;i<fields.length;i++){
          var itemname=getfromArray(fields[i],"identifier",getfromArray(fields[i],"name"));
          if(!gbnull(itemname)){
            //if(typeof(this.formcollection)=="undefined")this.formcollection={};
            //this.formcollection[itemname]=fields[i];
            if(typeof(options.formcollection)=="undefined")options.formcollection={};
            options.formcollection[itemname]=fields[i];
          }
          if(fields[i].inputgroup){
            var fields_inputgroup=fields[i].inputgroup.fields
            for(var j=0;j<fields_inputgroup.length;j++){
              //var tagName=getfromArray(fields_inputgroup,'tagName','input');
              //if((",input,select,textarea,").indexOf(","+tagName+",")>-1){
              var itemname=getfromArray(fields_inputgroup[j],"identifier",getfromArray(fields_inputgroup[j],"name"));
              if(!gbnull(itemname)){
                //this.formcollection[itemname]=fields_inputgroup[j];
                options.formcollection[itemname]=fields_inputgroup[j];
              }
            }
          }
        }
      }
      if(containers){
        for(var i=0;i<containers.length;i++){
          var itemname=getfromArray(containers[i],"identifier",getfromArray(containers[i],"name"));
          if(!gbnull(itemname)){
            //this.formcollection[itemname]=containers[i];
            options.formcollection[itemname]=containers[i];
          }
          //this.initFormfields(containers[i],false);
          this.initFormfields(options,containers[i]);
        }
      }
    },
    
    "changeFormfields":function(options,formchange){
      for(field in formchange){
        if(formchange.hasOwnProperty(field) && options.formcollection.hasOwnProperty(field)){
          let formfield=options.formcollection[field];
          for(prop in formchange[field]){
            switch(prop){
              case 'active':
                formfield.active=formchange[field][prop];
                break;
              case 'disabled':
                formfield.disabled=formchange[field][prop];
                break;
            }
          }
        }
      }
    },
    
    "getFormfield":function(options,fieldname){
      var formfield={};
      var fields=options.fields;
      var containers=getfromArray(options,'containers',[]);
      if(fields){
        for(var i=0;i<fields.length;i++){
          //inputgroup
          if(getfromArray(fields[i],'name')==fieldname){
            formfield=fields[i];
            return formfield;
            break;
          }
        }
      }
      if(containers){
        for(var i=0;i<containers.length;i++){
          formfield=this.getFormfield(containers[i],fieldname);
          if(Object.keys(formfield).length>0){
            break;
          }
        }
      }
      return formfield;
    },
  
  "createform":function(options){
    //GLOBALS_hostpath+GLOBALS_indexfile
    // getl()
    var othis=this;
    options=typeof options!=='undefined' ? options : this.formoptions; 
    this.formoptions=options;
    options.innerHTML="";
    /* example object 2021-06-22
    var fields=options.fields=[
        {"fieldname":"year","label":"year","figure":1,"operator":"=","tagName":"input"},
        {"fieldname":"month","label":"month","figure":1,"operator":"=","tagName":"input"},
        {"fieldname":"employeeID","label":"emplyoee","figure":1,"operator":"=","tagName":"input"}
    ]
    */

    if(!options.form)options.form={};
    // query string must be added!!!!  options.form.action=getfromArray(options.form,"action",GLOBALS_hostpath+GLOBALS_indexfile);

    switch(options.templatetype){
    case 'filterform':
    case 'filterblank':
      options.form.class=getfromArray(options.form,'class','js_filterform masterdata-form');
      break;
    }
    /* form attributes */
    // name, id, method, action, class, form_attributes
    var method=getfromArray(options,'method',getfromArray(options.form,"method",'POST'));
    var form_attributes="";
    form_attributes=gsclauseand(form_attributes,'name="'+getfromArray(options.form,"name")+'"',isset(options.form,'name')," ");
    form_attributes=gsclauseand(form_attributes,'id="'+getfromArray(options.form,"id")+'"',isset(options.form,'id')," ");
    form_attributes=gsclauseand(form_attributes,'method="'+method+'"',true," ");
    form_attributes=gsclauseand(form_attributes,'action="'+getfromArray(options.form,"action")+'"',isset(options.form,'action')," ");
    form_attributes=gsclauseand(form_attributes,'class="'+getfromArray(options.form,"class")+'"',isset(options.form,'class')," ");
    form_attributes=gsclauseand(form_attributes,getfromArray(options.form,"form_attributes"),isset(options.form,'form_attributes')," ");
    if(!gbnull(form_attributes))form_attributes=" "+form_attributes;
    options.form_attributes=form_attributes;
    
    var GET={};
    if(method=="GET")GET=Array_GET();
    var id_preset=getfromArray(options,'id_preset');
    //  name="{{formname}}" method="{{method}}" action="{{action}}" class="form-horizontal masterdata-form"
    var blanguage=getfromArray(options,"translation",true);

    // bootstrap 5 horizontal form default
    var fieldwraptemplatedefault=getfromArray(options,'fieldwraptemplate','<div class="row mb-1">{{labelelement}}<div class="{{fieldwrapclass}}">{{fieldelement}}</div></div>');
    var fieldwrapclassdefault=getfromArray(options,'fieldwrapclass','controls col-sm-9');
    var fieldwrapclassinputgroup='';
    var labelclassdefault=getfromArray(options,'labelclass',"col-form-label col-sm-3");  //label-left 
    var labeltemplate=getfromArray(options,'labeltemplate','<label class="{{labelclass}}" for="{{id}}">{{label}}</label>');
    var fieldclassdefault=getfromArray(options,'fieldclass','form-control');
    var inputgrouptemplate=getfromArray(options,'inputgrouptemplate','<div class="{{groupclass}}"{{group_attributes}}>{{fieldelements}}</div>');
    var groupclassdefault=getfromArray(options,'groupclass','input-group');

    // checkbox
    var fieldwraptemplatedefault_checkbox='<div class="row mb-3"><div class="{{fieldwrapclass}}"><div class="form-check">{{fieldelement}}{{labelelement}}</div></div></div>';
    var fieldwrapclassdefault_checkbox='col-sm-9 offset-sm-3';

    // radio
    var fieldwraptemplatedefault_radio='';
    var labeltemplate_radio='';
    var texttemplate='';
    var fieldtemplate_radio='';
    var labelclassdefault_radio='';
    var fieldwrapclassdefault_radio='';
    var fieldclassdefault_radio='';
    var textclassdefault_radio='';

    // select
    var fieldclassdefault_select='form-select';
    
    // button
    var fieldwraptemplatedefault_button=getfromArray(options,'fieldwraptemplate_button','<div class="text-end">{{fieldelement}}</div>');
    var fieldwrapclassdefault_button=getfromArray(options,'fieldwrapclass_button','text-end');
    
    var mytemplate;    
    var enabledArray=getfromArray(options,'enabledArray',[]);
    var templatetype=getfromArray(options,'templatetype');
    //var bfloating=(templatetype.indexOf('floating')>=0);
    var bfloating=false;
    
    switch(options.templatetype){
        case 'save_cancel':
            options.template=getfromArray(options,'template','{{innerHTML}}<div class="text-end"> <input type="submit" name="submit" class="btn btn-primary me-4" value="#ls#Save#" /> <button type="button" class="btn btn-light js_cancel js_rec_cancel">#ls#Cancel#</button> </div>');
            break;
        case 'form':
            options.template=getfromArray(options,'template','<form{{form_attributes}}>{{innerHTML}}</form>');
            break;
        case 'form_save_cancel':
            options.template=getfromArray(options,'template','<form{{form_attributes}}>{{innerHTML}}<div class="text-end"> <input type="submit" name="submit" class="btn btn-primary me-4" value="#ls#Save#" /> <button type="button" class="btn btn-light js_cancel js_rec_cancel">#ls#Cancel#</button> </div></form>');
            break;
        case 'filterblank':
            //options.template=getfromArray(options,'template','<form name="{{formname}}" class="js_filterform masterdata-form"> <div class="row"> <div class="col-sm-10"> {{innerHTML}} </div> <div class="col-sm-2 k8-margin-bottom-normal"> <div class="col-sm-12 text-end"> <input type="submit" class="js_replacedata btn btn-primary" value="Go"> </div> </div> </div> </form>');                
            options.template=getfromArray(options,'template','<div class="col-sm-12"><form{{form_attributes}}> <div class="row"> <div class="col-sm-10"> {{innerHTML}} </div> <div class="col-sm-2 k8-margin-bottom-normal"> <div class="col-sm-12 text-end"> <input type="submit" class="js_replacedata btn btn-primary" value="Go"> </div> </div> </div> </form></div>');                
            options.formname=getfromArray(options.form,"name","filterform");
            break;
        case 'filterform':
            options.template=getfromArray(options,'template','<form name="{{formname}}" class="js_filterform masterdata-form"> <div class="row"> <div class="col-xs-6"> {{innerHTML}} <div class="form-group"> <div class="col-sm-12 text-end"> <input type="submit" class="js_replacedata btn btn-primary" value="Go"> </div> </div> </div> <div class="col-xs-6 k8-margin-bottom-normal"> <div class="row"> <div class="col-md-4 text-center"> <button type="button" class="btn btn-secondary mt-1 js-download-csv">Download CSV</button> </div> <div class="col-md-4 text-center"> <button type="button" class="btn btn-secondary mt-1 js-download-xlsx">Download Excel</button> </div> <div class="col-md-4 text-center"> <button type="button" class="btn btn-secondary mt-1 js-download-pdf">Download PDF</button> </div> </div> </div> </div></form>');                
            options.formname=getfromArray(options.form,"name","filterform");
            break;
        case 'bs3masterform':    
            /* bootstrap 3 horizontal */
            break;
        case 'masterform':
            options.template=getfromArray(options,'template','{{innerHTML}}<div class="row"> <div class="col-1 js_dirty"></div> <div class="col-5 js_middle"></div> <div class="col-6"> <div class="text-end"> <input type="submit" name="submit" class="btn btn-primary " value="#ls#Save#"> <button type="button" class="btn btn-light js_cancel js_rec_cancel">#ls#Cancel#</button></div></div></div>');
        default:
            options.template=getfromArray(options,'template','{{innerHTML}}');
    }
    switch(getfromArray(options,"formlayout",'horizontal')){
        case 'vertical':
            fieldwraptemplatedefault=getfromArray(options,'fieldwraptemplate','<div class="{{fieldwrapclass}}">{{labelelement}}{{fieldelement}}</div>');
            labeltemplate='<label class="{{labelclass}}" for="{{id}}">{{label}}</label>';
            // fieldtemplate in createfield
            fieldwrapclassdefault='mb-3';
            labelclassdefault="form-label";
            fieldclassdefault='form-control';
            
            // checkbox
            fieldwraptemplatedefault_checkbox=getfromArray(options,'fieldwraptemplate_checkbox','<div class="form-check">{{fieldelement}}{{labelelement}}</div>');
            fieldwrapclassdefault_checkbox=getfromArray(options,'fieldwrapclass_checkbox');

            // radio
            fieldwraptemplatedefault_radio='<div class="mb-3">{{labelelement}}{{fieldradiotemplates}}</div>';
            labeltemplate_radio='<label class="{{labelclass}}" for="{{id}}">{{label}}</label>';
            texttemplate='<label class="{{textclass}}" for="{{id}}">{{text}}</label>';
            fieldtemplate_radio='<div class="form-check">{{fieldelement}}{{textelement}}</div>';
            fieldwrapclassdefault_radio='';
            labelclassdefault_radio=labelclassdefault;  // "form-label pt-0";
            fieldclassdefault_radio="form-check-input";
            textclassdefault_radio="form-check-label";
            break;
            
          case 'floating':
            bfloating=true;
            
            labelclassdefault=getfromArray(options,'labelclass',"");
            fieldwrapclassdefault='form-floating mb-1';
            fieldwrapclassinputgroup='form-floating';
            groupclassdefault=getfromArray(options,'groupclass','input-group mb-1');

            fieldwraptemplatedefault="<div class=\"{{fieldwrapclass}}\">{{fieldelement}}{{labelelement}}</div>";

            // inputgroup
            inputgrouptemplate=getfromArray(options,'inputgrouptemplate','<div class="input-group mb-1">{{fieldelements}}</div>');

            // checkbox
            fieldwraptemplatedefault_checkbox=getfromArray(options,'fieldwraptemplate_checkbox','<div class="form-check">{{fieldelement}}{{labelelement}}</div>');
            
            // radio
            fieldwraptemplatedefault_radio='<div class="mb-3">{{labelelement}}{{fieldradiotemplates}}</div>';
            labeltemplate_radio='<label class="{{labelclass}}" for="{{id}}">{{label}}</label>';
            texttemplate='<label class="{{textclass}}" for="{{id}}">{{text}}</label>';
            fieldtemplate_radio='<div class="form-check">{{fieldelement}}{{textelement}}</div>';
            fieldwrapclassdefault_radio=getfromArray(options,'fieldwrapclass_radio');
            labelclassdefault_radio=getfromArray(options,'labelclass_radio',labelclassdefault);
            fieldclassdefault_radio=getfromArray(options,'fieldclass_radio',"form-check-input");
            textclassdefault_radio=getfromArray(options,'textclass_radio',"form-check-label");
            break;
            
        case 'horizontal':
        default:
            fieldwraptemplatedefault=getfromArray(options,'fieldwraptemplate','<div class="row mb-1">{{labelelement}}<div class="{{fieldwrapclass}}">{{fieldelement}}</div></div>');
            fieldwrapclassdefault=getfromArray(options,'fieldwrapclass','col-sm-9');
            labelclassdefault=getfromArray(options,'labelclass',"col-sm-3 col-form-label");
            labeltemplate=getfromArray(options,'labeltemplate','<label class="{{labelclass}}" for="{{id}}">{{label}}</label>');
            fieldclassdefault=getfromArray(options,'fieldclass','form-control');

            // checkbox
            fieldwraptemplatedefault_checkbox=getfromArray(options,'fieldwraptemplate_checkbox','<div class="row mb-1"><div class="{{fieldwrapclass}}"><div class="form-check">{{fieldelement}}{{labelelement}}</div></div></div>');
            fieldwrapclassdefault_checkbox=getfromArray(options,'fieldwrapclass_checkbox','col-sm-9 offset-sm-3');

            // radio
            fieldwraptemplatedefault_radio=getfromArray(options,'fieldwraptemplate_radio','<fieldset class="row mb-1">{{labelelement}}<div class="{{fieldwrapclass}}">{{fieldradiotemplates}}</div></fieldset>');
            labeltemplate_radio=getfromArray(options,'labeltemplate_radio','<legend class="col-form-label col-sm-3 pt-0">{{label}}</legend>');
            texttemplate=getfromArray(options,'texttemplate_radio','<label class="{{textclass}}" for="{{id}}">{{text}}</label>');
            fieldtemplate_radio=getfromArray(options,'fieldtemplate_radio','<div class="form-check">{{fieldelement}}{{textelement}}</div>');
            labelclassdefault_radio=getfromArray(options,'labelclass_radio',"form-label col-sm-3 pt-0");
            fieldwrapclassdefault_radio=getfromArray(options,'fieldwrapclass_radio','col-sm-9');
            fieldclassdefault_radio=getfromArray(options,'fieldclass_radio',"form-check-input");
            textclassdefault_radio=getfromArray(options,'textclass_radio',"form-check-label");

            fieldwraptemplatedefault_button=getfromArray(options,'fieldwraptemplate_button','<div class="text-end">{{fieldelement}}</div>');
            break;
    }
    var html=ReplacePlaceholder(options.template,Object.assign(options,{"innerHTML":executeArrays(options)}),2);

    //html=ReplacePlaceholder(options.template,{"innerHTML":html,"formname":"filterform"},2);  // options, method ,.....
    //var el_form;
    if(options.el_form){
      this.el_form=options.el_form;
      this.el_form.innerHTML=html;
    }else if(options.selector){
      var el;
      el=document.querySelector(options.selector);
      if(el){
        el.innerHTML=html;
        if(el.tagName=="FORM"){
          this.el_form=el;
        }else{
          this.el_form=$(el).find("form")[0];
        }
      }else{
        console.log("selector: "+options.selector+" not found!");
      }
    }
    if(this.el_form){
      if(options.form){
        for(attribute in options.form){
          if(options.form.hasOwnProperty(attribute)){
            if(attribute=="class"){
              var arr=options.form[attribute].split(" ");
              for(var i=0;i<arr.length;i++){
                this.el_form.classList.add(arr[i]);
              }
            }else{
              this.el_form.setAttribute(attribute,options.form[attribute]);
            }
          }
        }
      }
    }
    return html;
    
    function executeArrays(container){
      var html="";
      var fieldwraptemplatelevel=getfromArray(container,'fieldwraptemplate',fieldwraptemplatedefault);
      var labelclasslevel=getfromArray(container,'labelclass',labelclassdefault);
      var fieldwrapclasslevel=getfromArray(container,'fieldwrapclass',fieldwrapclassdefault);
      var fields=container.fields;
      var containers=getfromArray(container,'containers',[]);
      if(fields){
        for(var i=0;i<fields.length;i++){
          var identifier=getfromArray(fields[i],'identifier',getfromArray(fields[i],"name"));
          var active=getfromArray(fields[i],"active",true);
          var bok=active;
          if(enabledArray.length>0 && gbnull(identifier)){
            bok=false;
          }else if(enabledArray.length>0 && !gbnull(identifier)){
            bok=(enabledArray.indexOf(identifier)>=0);
          }
          if(bok){
            if(getfromArray(fields[i],'type')=="hidden"){
                var field=setField(fields[i]);
                html+=createfield(field);
            }else{
              var fieldelement;
              
              var fieldwraptemplate;
              if(isset(fields[i]["fieldwraptemplate"])){
                fieldwraptemplate=getfromArray(fields[i],"fieldwraptemplate",fieldwraptemplatelevel);
              }else if(getfromArray(fields[i],"tagName","input")=="button" || getfromArray(fields[i],"type")=="button"){
                fieldwraptemplate=fieldwraptemplatedefault_button;
              }else{
                fieldwraptemplate=fieldwraptemplatelevel;
              }
              fieldwraptemplate=ReplacePlaceholder(fieldwraptemplate,options.html,2);
              
              var labelclass=getfromArray(fields[i],"labelclass",labelclasslevel);
              var fieldwrapclass=getfromArray(fields[i],"fieldwrapclass",fieldwrapclasslevel);
              
              if(isset(fields[i],"fieldtemplate")){
                fields[i]["fieldtemplate"]=ReplacePlaceholder(fields[i]["fieldtemplate"],options.html,2);
              }              
              if(isset(fields[i],'inputgroup')){
                var inputgroup=fields[i]['inputgroup'];
                var fieldelements={};
                var field;
                var grouptemplate="";
                var elements_html="";
                var template_inputgroup=inputgrouptemplate;
                if(bfloating){
                  //template_inputgroup='<div class="input-group mb-1">{{fieldelements}}</div>';
                  for(var j=0;j<inputgroup.fields.length;j++){
                    var tagName=getfromArray(inputgroup.fields[j],'tagName','input');
                    var labelelement='';
                    var htmlelement=getfromArray(inputgroup.fields[j],'htmlelement');
                    if(htmlelement=="dropdown"){
                      othis.displayDropdown(inputgroup.fields[j].dropdown);
                      fieldelements['field'+j]=othis.innerHTML;
                    }else if(getfromArray(inputgroup.fields[j],'type')=="hidden"){
                      field=setField(inputgroup.fields[j]);
                      fieldelements['field'+j]=createfield(field);
                    }else{
                      var tagName=getfromArray(inputgroup.fields[j],'tagName','input');
                      if(tagName=="button"){
                        field=setField(inputgroup.fields[j],'btn btn-light');
                      }else if((",input,select,textarea,").indexOf(","+tagName+",")<0){
                        field=setField(inputgroup.fields[j],'input-group-text');
                      }else{
                        field=setField(inputgroup.fields[j],fieldclassdefault);
                      }
                      if((",input,select,textarea,").indexOf(","+tagName+",")>-1){
                        labelelement=ReplacePlaceholder(labeltemplate,Object.assign(field,{"labelclass":labelclass}),2);
                        fieldwrapclass=getfromArray(field,"fieldwrapclass",fieldwrapclassinputgroup);
                        fieldelement=createfield(field);
                        fieldelements['field'+j]=ReplacePlaceholder(fieldwraptemplate,Object.assign(field,{"fieldwrapclass":fieldwrapclass,"fieldelement":fieldelement,"labelelement":labelelement}),2);
                      }else{
                        fieldelements['field'+j]=createfield(field);
                      }
                    }
                    grouptemplate+="{{field"+j+"}}";
                  }
                  
                  /* copy from beneath
                  if(inputgroup.template){
                    template_inputgroup=ReplacePlaceholder(inputgroup.template,options.html,2);
                  }else{
                    template_inputgroup=ReplacePlaceholder(inputgrouptemplate,{"fieldelements":grouptemplate},2);
                  }*/
                  
                  elements_html=ReplacePlaceholder(grouptemplate,fieldelements,2);
                  html+=ReplacePlaceholder(template_inputgroup,{"fieldelements":elements_html},2);
                }else{
                  for(var j=0;j<inputgroup.fields.length;j++){
                    var tagName=getfromArray(inputgroup.fields[j],'tagName','input');
                    var htmlelement=getfromArray(inputgroup.fields[j],'htmlelement');
                    if(htmlelement=="dropdown"){
                      othis.displayDropdown(inputgroup.fields[j].dropdown);
                      fieldelements['field'+j]=othis.innerHTML;
                    }else{
                      if(tagName=="button"){
                        field=setField(inputgroup.fields[j],'btn btn-light');
                        if(!fields[i].fieldwraptemplate){
                          fieldwraptemplate=fieldwraptemplatedefault_button;
                        }
                        if(!fields[i].fieldwrapclass){
                          fieldwrapclass=fieldwrapclassdefault_button;
                        }
                      }else{
                        var inputgroupclass=fieldclassdefault;
                        if((",input,select,textarea,").indexOf(","+tagName+",")<0){
                          inputgroupclass="input-group-text";
                        }
                        field=setField(inputgroup.fields[j],inputgroupclass);
                      }
                      fieldelements['field'+j]=createfield(field);
                    }
                    grouptemplate+="{{field"+j+"}}";
                  }
                  var field0=getfromArray(inputgroup.fields,0,{});
                  var objlabel=Object.assign(field0,inputgroup,{"labelclass":labelclass});
                  inputgroup.groupclass=getfromArray(inputgroup,"groupclass",getfromArray(inputgroup,"class",groupclassdefault));
                  if(isset(inputgroup,'label')){
                    if(blanguage){
                      objlabel['label']=getl(inputgroup.label);
                    }else{
                      objlabel['label']=inputgroup.label;
                    }
                  }else{
                    objlabel['label']=getfromArray(field,"label");
                  }
                  var labelelement=ReplacePlaceholder(labeltemplate,objlabel,2);

                  if(inputgroup.template){
                    template_inputgroup=ReplacePlaceholder(inputgroup.template,options.html,2);
                  }else{
                    template_inputgroup=ReplacePlaceholder(inputgrouptemplate,{"fieldelements":grouptemplate},2);
                  }
                  inputgroup.group_attributes=othis.obj2attributes_str(getfromArray(inputgroup,'attributes',{}));

                  fieldelement=ReplacePlaceholder(template_inputgroup,Object.assign(fieldelements,inputgroup),2);
                  fieldwrapclass=getfromArray(inputgroup,"fieldwrapclass",fieldwrapclass);
                  html+=ReplacePlaceholder(fieldwraptemplate,{"fieldwrapclass":fieldwrapclass,"fieldelement":fieldelement,"labelelement":labelelement},2);
                }
              }else if(getfromArray(fields[i],'figure',0)==2){
                // from to
                var field=setField(Object.assign({},fields[i]),undefined,"from");
                var attributes=getfromArray(field,'attributes');
                var value=getfromArray(attributes,'value');
                field.attributes['value']=getfromArray(attributes,'valuefrom',value);
                delete(field.valuefrom);
                delete(field.valueto);
                var labelelement=ReplacePlaceholder(labeltemplate,Object.assign(field,{"labelclass":labelclass}),2);
                fieldelement=createfield(field,"from");
                
                var field=setField(Object.assign({},fields[i]),undefined,"to");
                var attributes=getfromArray(field,'attributes');
                field.attributes['value']=getfromArray(attributes,'valueto',value);
                delete(field.valueto);
                fieldelement+=createfield(field,"to");
                var fieldwrapclass=gsclauseand(fieldwrapclassdefault,'k8-flex-row',true," ");
                html+=ReplacePlaceholder(fieldwraptemplate,{"fieldwrapclass":fieldwrapclass,"fieldelement":fieldelement,"labelelement":labelelement},2);
              }else{
                var field;
                if(fields[i]["type"]=="radio"){
                  field=setField(fields[i],fieldclassdefault_radio);
                  field.labelclass=getfromArray(field,"labelclass",labelclassdefault_radio);
                  field.textclass=getfromArray(field,"textclass",textclassdefault_radio);
                  var labelelement=ReplacePlaceholder(labeltemplate_radio, field, 2);
                  fieldelement=createfield(field);
                  html+=ReplacePlaceholder(fieldwraptemplatedefault_radio,{"fieldwrapclass":fieldwrapclassdefault_radio,"fieldradiotemplates":fieldelement,"labelelement":labelelement},2);
                }else{
                  var tagName=getfromArray(fields[i],"tagName","input");
                  var type=getfromArray(fields[i],'type');
                  if(tagName=="select"){
                    field=setField(fields[i],fieldclassdefault_select);
                  }else if(tagName=="button" || type=="button"){
                    field=setField(fields[i],'btn btn-light');
                  }else{
                    field=setField(fields[i],fieldclassdefault);
                  }
                  if(field.type=="checkbox"){
                    field.fieldclass="form-check-input";
                    fieldwraptemplate=fieldwraptemplatedefault_checkbox;
                    fieldwrapclass=fieldwrapclassdefault_checkbox;
                    labelclass=getfromArray(field,"labelclass","form-check-label");
                  }                
                  var labelelement=ReplacePlaceholder(labeltemplate,Object.assign(field,{"labelclass":labelclass}),2);
                  fieldelement=createfield(field);
                  fieldwrapclass=getfromArray(field,"fieldwrapclass",fieldwrapclass);
                  html+=ReplacePlaceholder(fieldwraptemplate,Object.assign(field,{"fieldwrapclass":fieldwrapclass,"fieldelement":fieldelement,"labelelement":labelelement}),2);
                }
              }
            }
          }
        }
      }
      for(var i=0;i<containers.length;i++){
        containers[i].innerHTML="";
        var identifier=getfromArray(containers[i],'identifier',getfromArray(containers[i],"name"));
        var active=getfromArray(containers[i],"active",true);
        var bok=active;
        if(enabledArray.length>0 && gbnull(identifier)){
          bok=false;
        }else if(enabledArray.length>0 && !gbnull(identifier)){
          bok=(enabledArray.indexOf(identifier)>=0);
        }
        if(bok){
          if(gbnull(getfromArray(containers[i],'template'))){
              containers[i]['template']='{{innerHTML}}';
          }
          if(!gbnull(id_preset) && !containers[i]['id_preset'])containers[i]['id_preset']=id_preset;
          containers[i]['method']=method;
          html+=ReplacePlaceholder(containers[i]['template'],Object.assign(containers[i],{"innerHTML":executeArrays(containers[i])}),2);
        }
      }
      return html;
    }

    function setField(field,fieldclass,name_ext){
      // blanguage=true;
      fieldclass=typeof fieldclass!=='undefined' ? fieldclass : fieldclassdefault;        
      name_ext=typeof name_ext!=='undefined' ? name_ext : "";        
      
      if(!isset(field,'attributes'))field.attributes={};
      var attributes=getfromArray(field,"attributes",{});
      var tagName=getfromArray(field,"tagName","input");
      var type=getfromArray(field,"type",getfromArray(attributes,"type",{}));

      if(tagName=="button" && !isset(field,'text'))field.text=field.name;
      if(!isset(field,'figure'))field.figure=1;
      if(!isset(field,'name')){
        if(isset(field,'fieldname')){
          field['name']=field['fieldname'];
        }else if(isset(attributes,'name')){
          field['name']=attributes['name'];
          delete(attributes['name']);
        }
      }
      if(isset(field,'name') && method=="GET"){
        var nameGET=field.name;
        if(field.figure==2){
          nameGET=field.name+name_ext;
        }
        if(isset(GET,nameGET)){
          if(!isset(field,'attributes'))field['attributes']={};
          field['attributes']['value'+name_ext]=decodeURI(GET[nameGET]);
        }
      }
      if(!isset(field,'fieldclass')){
        field['fieldclass']=fieldclass;
      }else if(isset(attributes,'class')){
        field['fieldclass']=attributes['class'];
        delete(attributes['class']);
      }
      if(tagName=="input"){
        if(!isset(field,'type')){
          if(isset(attributes,'type')){
            field['type']=attributes['type'];
            delete(attributes['type']);
          }else{
            field['type']='text';
          }
        }
      }else if(tagName=="button"){
        if(isset(attributes,'type'))field['type']=attributes['type'];
      }
      if(!isset(field,'id') && isset(field,'name'))field['id']=id_preset+field['name'];
      //if(!isset(field,'tags'))field['tags']='';
      //if(!isset(field,'value'))field.value="";
      if(blanguage){
        if(isset(field,'label')){
          field.label=getl(field.label);
        }else if(tagName=='button' || type=='button'){
        }else{
          if(field.name)field.label=getl(field.name);
        }
      }else{
        if(field.name)if(!isset(field,'label'))field.label=field.name;
      }
      
      figure=getfromArray(field,'figure',1);
      if(figure==2){
        if(isset(field,'attributes')){
          if(isset(field,'attributes','value'+name_ext)){
              attributes['value']=field['attributes']['value'+name_ext];
          }
        }
      }else{
        if(isset(field,'value')){
          if(!isset(attributes,'value')){
            attributes['value']=field['value'];
          }
          delete(field['value']);
        }
      }
      if(isset(field,'maxLength')){
        if(!isset(attributes,'maxlength')){
          attributes['maxlength']=field['maxLength'];
        }
        delete(field['maxLength']);
      }
      if(isset(field,'step')){
        if(!isset(attributes,'step')){
          attributes['step']=field['step'];
        }
        delete(field['step']);
      }
      if(isset(field,'placeholder')){
        if(isset(attributes,'placeholder')){
        }else{
          attributes['placeholder']=field['placeholder'];
        }
        delete(field['placeholder']);
      }

      var decimals=getfromArray(field,"decimals",0);
      if(field.type=="number" && decimals!=0){
          if(!attributes.step){
              attributes.step="0."+"0".repeat(field.decimals-1)+'1';
          }
      }
      
      if(attributes.value){
        var prop="value";
        var value=attributes[prop];
        var step="";
        step=getfromArray(attributes,'step');
        if(field.decimals){
          attributes.value=Number(value).toFixed(field.decimals);
        }else if(!gbnull(step)){
          var arr=step.split('.');
          if(arr.length>1){
            var dp=arr[1].length;
            value=Number(value).toFixed(dp);
          }
          attributes.value=value;
        }
      }
      
      if(blanguage){
        if(attributes.placeholder)attributes.placeholder=getl(getfromArray(attributes,"placeholder"));
      }
      
      if(bfloating){
        //field.placeholder=getfromArray(field,"placeholder"," ");
        attributes.placeholder=getfromArray(attributes,"placeholder"," ");
      }
      return field;
    }

    function createfield(field,name_ext){
        var obj=JSON.parse(JSON.stringify(field));
        var fieldtemplate;
        var html='';
        var input_attributes="";
        if(!obj.tagName && !obj.fieldtemplate){
            obj.tagName="input";
        }
        if(typeof(name_ext)!=='undefined'){
            obj.name=obj.name+name_ext;
            obj.id=obj.id+name_ext;
        }
        if(obj.type=="hidden"){
          //if(obj.value){
          //  html='<input type="hidden" name="'+obj.name+'" value="'+obj.value+'">';
          let attributes=getfromArray(obj,'attributes');
          if(attributes.value){
            html='<input type="hidden" name="'+obj.name+'" value="'+attributes.value+'">';
          }else{
            html='<input type="hidden" name="'+obj.name+'">';
          }
        }else{
          switch(obj.tagName){
              case "input":
                  fieldtemplate='<input{{input_attributes}}>';
                  if(obj.type=="radio"){
                    var html_radio="";
                    for(var k=0;k<obj.options.length;k++){
                      //create field
                      var option=obj.options[k];
                      var obj_radio={};
                      obj_radio['name']=obj.name;
                      obj_radio['type']=obj.type;
                      obj_radio['fieldclass']=obj.fieldclass;
                      obj_radio['textclass']=obj.textclass; // bootstrap 5 "form-check-label"
                      if(getfromArray(obj,"required"))obj_radio['required']=true;
                      obj_radio['id']=obj.id+k;
                      obj_radio['attributes']={};
                      obj_radio['attributes']['value']=option.value;
                      obj_radio['text']=option.text;
                      obj_radio['checked']=getfromArray(option,"checked",false);
                      
                      var standard_attributes=createAttributes(obj_radio);
                      standard_attributes=gsclauseand(standard_attributes,othis.obj2attributes_str(obj_radio.attributes),obj_radio.attributes,' ');
                      if(!gbnull(standard_attributes))standard_attributes=' '+standard_attributes;
                      obj_radio.input_attributes=standard_attributes;
                      obj_radio['fieldelement']=ReplacePlaceholder(fieldtemplate,obj_radio,2);
                      
                      obj_radio['textelement']=ReplacePlaceholder(texttemplate,obj_radio,2);
                      html_radio+=ReplacePlaceholder(fieldtemplate_radio,obj_radio,2);
                    }
                    html=html_radio;
                  }else{
                    if(obj.type=="checkbox"){
                      //input_attributes=gsclauseand(input_attributes,'checked',isset(obj,'checked')," ");
                    }else{
                      //input_attributes=gsclauseand(input_attributes,'class="'+getfromArray(obj,"fieldclass")+'"',isset(obj,'fieldclass')," ");
                    }
                    /*
                    input_attributes=gsclauseand(input_attributes,'type="'+obj.type+'"',isset(obj,'type')," ");
                    input_attributes=gsclauseand(input_attributes,'step="'+getfromArray(obj,"step")+'"',isset(obj,'step')," ");
                    input_attributes=gsclauseand(input_attributes,'value="'+getfromArray(obj,"value")+'"',isset(obj,'value')," ");
                    input_attributes=gsclauseand(input_attributes,'maxlength="'+getfromArray(obj,"maxlength")+'"',isset(obj,'maxlength'),' ');
                    input_attributes=gsclauseand(input_attributes,'placeholder="'+getfromArray(obj,"placeholder")+'"',isset(obj,"placeholder"),' ');
                    */
                    var standard_attributes=createAttributes(obj);
                    standard_attributes=gsclauseand(standard_attributes,othis.obj2attributes_str(obj.attributes),obj.attributes,' ');
                    input_attributes=gsclauseand(input_attributes,standard_attributes,!gbnull(standard_attributes),' ');
                    if(!gbnull(input_attributes))input_attributes=' '+input_attributes;
                    obj['input_attributes']=input_attributes;
                    html=ReplacePlaceholder(fieldtemplate,obj,2);
                  }
                  break;
              case "select":
                  if(obj.options){
                    if(Array.isArray(obj.options)){
                      if(obj.translate){
                        for(var i=0;i<obj.options.length;i++){
                          var option=obj.options[i];
                          if(obj.translate=="standard"){
                            var text=getfromArray(option,"text");
                            option.text=getl(text);
                          }else{
                            var sysArray=getfromArray(window['text'],'sysArray',{});
                            var textSysArray=getfromArray(sysArray,obj.translate,{});
                            option.text=getfromArray(textSysArray,option.text,option.text);
                          }
                        }
                      }
                      obj.options=array2Options(obj.options);
                    }
                  }
                  //fieldtemplate='<select class="{{fieldclass}}" name="{{name}}" id="{{id}}" {{tags}}>{{options}}</select>';
                  var standard_attributes=createAttributes(obj);
                  standard_attributes=gsclauseand(standard_attributes,othis.obj2attributes_str(obj.attributes),obj.attributes,' ');
                  input_attributes=gsclauseand(input_attributes,standard_attributes,!gbnull(standard_attributes),' ');
                  if(!gbnull(input_attributes))input_attributes=' '+input_attributes;
                  obj['input_attributes']=input_attributes;
                  fieldtemplate='<select{{input_attributes}}>{{options}}</select>';
                  html=ReplacePlaceholder(fieldtemplate,obj,2);
                  break;
              case "textarea":
                  /*
                  if(!gbnull(input_attributes))input_attributes=' '+input_attributes;
                  obj['input_attributes']=input_attributes;
                  if(!isset(field,'value'))obj.value="";
                  fieldtemplate='<textarea class="{{fieldclass}}" name="{{name}}" id="{{id}}" {{tags}}{{input_attributes}}>{{value}}</textarea>';
                  html=ReplacePlaceholder(fieldtemplate,obj,2);
                  */
                  var standard_attributes=createAttributes(obj);
                  standard_attributes=gsclauseand(standard_attributes,othis.obj2attributes_str(obj.attributes),obj.attributes,' ');
                  input_attributes=gsclauseand(input_attributes,standard_attributes,!gbnull(standard_attributes),' ');
                  if(!gbnull(input_attributes))input_attributes=' '+input_attributes;
                  obj['input_attributes']=input_attributes;
                  if(!isset(obj,'value'))obj.value="";
                  fieldtemplate='<textarea{{input_attributes}}>{{value}}</textarea>';
                  html=ReplacePlaceholder(fieldtemplate,obj,2);
                  break;
              case "button":
                  var standard_attributes=createAttributes(obj);
                  standard_attributes=gsclauseand(standard_attributes,othis.obj2attributes_str(obj.attributes),obj.attributes,' ');
                  input_attributes=gsclauseand(input_attributes,standard_attributes,!gbnull(standard_attributes),' ');
                  if(!gbnull(input_attributes))input_attributes=' '+input_attributes;
                  obj['input_attributes']=input_attributes;
                  fieldtemplate='<button{{input_attributes}}>{{text}}</button>';
                  html=ReplacePlaceholder(fieldtemplate,obj,2);
                  break;
              default:
                  fieldtemplate="";
                  if(obj.fieldtemplate){
                    fieldtemplate=obj.fieldtemplate;
                  }else if(obj.tagName){
                    //var element=document.createElement(obj.tagName);
                    //fieldtemplate='<'+obj.tagName+'{{input_attributes}}>{{text}}</'+obj.tagName+'>';
                    fieldtemplate='<'+obj.tagName+'{{input_attributes}}>{{innerHTML}}</'+obj.tagName+'>';
                  }
                  if(!gbnull(fieldtemplate)){
                    input_attributes=createAttributes(obj);
                    input_attributes=gsclauseand(input_attributes,othis.obj2attributes_str(obj.attributes),obj.attributes,' ');
                    if(!gbnull(input_attributes))input_attributes=' '+input_attributes;
                    obj['input_attributes']=input_attributes;
                    html=ReplacePlaceholder(fieldtemplate,obj,2);
                  }
          }
        }
        return html;
    }
    /*
    function createTagAttributes(attributes){
      var input_attributes="";
      for(prop in attributes){
        if(attributes.hasOwnProperty(prop)){
          if(prop=='class_add'){
            if(!attributes.class)attributes.class="";
            attributes.class=gsclauseand(attributes.class,prop,true," ");
          }
        }
      }
      for(prop in attributes){
        if(attributes.hasOwnProperty(prop)){
          if((",required,readonly,disabled,checked,").indexOf(","+prop+",")>-1){
            input_attributes=gsclauseand(input_attributes,prop,obj[prop],' ');
          }else if(prop=='class_add'){
            // nothing
          }else{
            input_attributes=gsclauseand(input_attributes,prop+'="'+attributes[prop]+'"',true,' ');
          }
        }
      }
      return input_attributes;
    }
    */
    function createAttributes(obj,tagName,type){
      var input_attributes="";
      /*
      name
      type
      id
      fieldclass
      fieldclass_add
      //maxLength
      //step
      //placeholder
      //value
      //decimals
      required
      disabled
      readonly
      aria-disabled
       */

      if(isset(obj,'fieldclass_add')){
        if(!isset(obj,'fieldclass'))obj.fieldclass='';
        obj.fieldclass=gsclauseand(obj.fieldclass,obj.fieldclass_add,true,' ');
      }
         
      input_attributes=gsclauseand(input_attributes,'name="'+getfromArray(obj,"name")+'"',isset(obj,'name')," ");
      input_attributes=gsclauseand(input_attributes,'type="'+getfromArray(obj,"type")+'"',isset(obj,'type')," ");
      input_attributes=gsclauseand(input_attributes,'id="'+getfromArray(obj,"id")+'"',isset(obj,'id')," ");
      input_attributes=gsclauseand(input_attributes,'class="'+getfromArray(obj,"fieldclass")+'"',isset(obj,'fieldclass')," ");
      //input_attributes=gsclauseand(input_attributes,'maxlength="'+getfromArray(obj,"maxLength")+'"',isset(obj,'maxLength')," ");
      //input_attributes=gsclauseand(input_attributes,'step="'+getfromArray(obj,"step")+'"',isset(obj,'step')," ");
      input_attributes=gsclauseand(input_attributes,getfromArray(obj,"input_attributes"),isset(obj,"input_attributes"),' ');
      input_attributes=gsclauseand(input_attributes,getfromArray(obj,"tags"),isset(obj,"tags"),' ');
      input_attributes=gsclauseand(input_attributes,'required',getfromArray(obj,"required",false),' ');
      input_attributes=gsclauseand(input_attributes,'readonly',getfromArray(obj,"readonly",false),' ');
      input_attributes=gsclauseand(input_attributes,'disabled',getfromArray(obj,"disabled",false),' ');
      input_attributes=gsclauseand(input_attributes,'aria-disabled=true',getfromArray(obj,"disabled",false),' ');
      
      return input_attributes;
    }
  },
  
  "createbsmenu":function(options){
      var html_li_simple='<li{{li_attributes}}><a href="{{href}}"{{a_attributes}}>{{title}}</a></li>';
      var html_li_no_a='<li{{li_attributes}}>{{title}}</li>';
  
      //bs5
      var html_li_dropdown='<li{{li_attributes}}>'+
          '<a data-bs-toggle="dropdown" role="button" href="#" data-bs-auto-close="outside" aria-expanded="false" {{a_attributes}}>{{title}}</a>'+
          /*'<a data-bs-toggle="dropdown" class="dropwon-toggle" role="button" href="#" aria-expanded="false" {{a_attributes}}>{{title}}</a>'+*/
          '<ul class="dropdown-menu" aria-label-ledby="navbarDropdown">'+
          '{{innerHTML}}'+
          '</ul></li>';
      var html_li_dropdown2='<li{{li_attributes}}>'+
          '<a data-bs-toggle="dropdown" role="button" href="#" aria-expanded="false" {{a_attributes}}>{{title}}</a>'+
          '<ul class="dropdown-menu" aria-label-ledby="navbarDropdown">'+
          '{{innerHTML}}'+
          '</ul></li>';
      
      var lis=getfromArray(options,"menu",[]);
      var selector=getfromArray(options,"selector",".mynavi .navbar-nav"); 
      options.html_li_simple=getfromArray(options,"html_li_simple",html_li_simple);
      options.html_li_dropdown=getfromArray(options,"html_li_dropdown",html_li_dropdown);
      options.html_li_dropdown2=getfromArray(options,"html_li_dropdown2",html_li_dropdown2);
      options.html_li_no_a=getfromArray(options,"html_li_no_a",html_li_no_a);
      options.li_class_active=getfromArray(options,"li_class_active","active");
      
      // bs5
      options.level=-1;
      options.li_class0_default=getfromArray(options,"li_class0_default","nav-item");
      options.li_class1_default=getfromArray(options,"li_class1_default");

      options.a_class0_default=getfromArray(options,"a_class0_default","nav-link");
      options.a_class0_dd_default=getfromArray(options,"a_class0_dd_default","nav-link dropdown-toggle");
      options.a_class1_default=getfromArray(options,"a_class1_default","dropdown-item");

      var html=this.createbslis(options,lis);
      $(selector).html(html);
    },
    "createbslis":function(options,lis){
      //' class="active"' :  '' ?>
      //'<li{{li_attr}}><a tabindex="-1" href="{{href}} target="{{target}}">{{title}}</a></li>'
      options.level++;
      var pages=getfromArray(options,"pages",{});
      var html="";
      for(var i=0;i<lis.length;i++){
        var item=lis[i];
        var bvisible=true;
        if(isset(item,'condition')){
          if(!gbnull(item['condition'])){
            var condition=getfromArray(item,"condition","true");
            try{
              bvisible=eval(condition);
            }
            catch(e){
              // error
              console.log('error by expression: '+condition);
            }
          }
        }
        if(bvisible){ //condition
          var bactive=false;
          var children=getfromArray(item,"children",[],true);
          item.target=getfromArray(item,"target");
          item.li_attributes=getfromArray(item,"li_attributes");
          item.a_attributes=getfromArray(item,"a_attributes");
          item.page=getfromArray(item,"page");
          var href="#";
          if(!gbnull(item.page)){
            if(isset(pages,item.page))href=build_href({"href":getfromArray(pages[item.page],"url")});
          }
          item.href=getfromArray(item,"href",href,true);
          var active_default="";
          if(item.page)active_default="page";
          if(item.href)active_default="url";
          item.active_by=getfromArray(item,"active_by",active_default,true);
          switch(item.active_by){
            case "page":
              if(!gbnull(page))bactive=(item.page==page);
              break;
            case "url":
              //var url=window.location.href.replace(/.*\//, '');
              var url=window.location.href
              bactive=((url+'#').indexOf(item.href+'#')>-1);
              break;
            case "basename":
              var url=window.location.href.replace(/.*\//, '');
              var basename=url.split('?')[0];
              bactive=(item.href==basename);
              break;
            case "none":
            default:
          }
          var li_class_default=options.li_class0_default;
          if(options.level>0){
            li_class_default=options.li_class1_default;
          }
          var li_class=getfromArray(item,"li_class",li_class_default,true);
          //li_class=gsclauseand(li_class,options.li_class_active,bactive," ");

          //bs5
          li_class=gsclauseand(li_class,"dropdown",children.length>0," ");
          
          var li_attributes="";
          li_attributes=gsclauseand(li_attributes,'class="'+li_class+'"',!gbnull(li_class)," ");
          li_attributes=gsclauseand(li_attributes,item.li_attributes,!gbnull(item.li_attributes)," ");
          item.li_attributes=gbnull(li_attributes) ? "" : " "+li_attributes;

          var a_class_default=options.a_class0_default;
          if(options.level>0){
            if(children.length>0){
              a_class_default="dropdown-item"; //options.a_class1_default;
            }else{
              a_class_default=options.a_class1_default;
            }
          }else if(children.length>0){
              a_class_default=options.a_class0_dd_default;
          }
          var a_class=getfromArray(item,"a_class",a_class_default,true);
          a_class=gsclauseand(a_class,options.li_class_active,bactive," ");

          var a_attributes=item.a_attributes;
          a_attributes=gsclauseand(a_attributes,'target="'+item.target+'"',!gbnull(item.target)," ");
          //if(!(item.href=="#" && gbnull(a_attributes))){
          if(item.href!=="#" || children.length>0){
            a_attributes=gsclauseand(a_attributes,'class="'+a_class+'"',!gbnull(a_class)," ");
          }
          item.a_attributes=gbnull(a_attributes) ? "" : " "+a_attributes;

          //onclick
          if(children.length>0){
            if(options.level>=2){
              var html_item=ReplacePlaceholder(options.html_li_dropdown2,item,2);
            }else{
              var html_item=ReplacePlaceholder(options.html_li_dropdown,item,2);
            }
            var innerHTML=this.createbslis(options,children);
            html+=html_item.replace('{{innerHTML}}',innerHTML);
          }else if(isset(item,'li_template')){
            html+=ReplacePlaceholder(item.li_template,item,2);
          }else if(item.href=="#" && gbnull(getfromArray(item,"a_attributes"))){
            html+=ReplacePlaceholder(options.html_li_no_a,item,2);
          }else{
            html+=ReplacePlaceholder(options.html_li_simple,item,2);
          }
        }
      }
      options.level--;
      return html;
    }
};

var storage = new function () {
    var dataContainer = {};
    function linearize () {
            var string = "", name, value;
            for (name in dataContainer) {
                    value = encodeURIComponent(dataContainer[name]);
                    name = encodeURIComponent(name);
                    string += name + "=" + value + "&";
            }
            if (string != "") {
                    string = string.substring(0, string.length - 1);
            }
            return string;
    }
    function read () {
            if (window.name == '' || window.name.indexOf("=") == -1) {
                    return;
            }
            var pairs = window.name.split("&");
            var pair, name, value;
            for (var i = 0; i < pairs.length; i++) {
                    if (pairs[i] == "") {
                            continue;
                    }
                    pair = pairs[i].split("=");
                    name = decodeURIComponent(pair[0]);
                    value = decodeURIComponent(pair[1]);
                    dataContainer[name] = value;
            }
    }
    function write () {
            window.name = linearize();
    }

    /* --------- Public Methods --------- */
    this.set = function (name, value) {
            dataContainer[name] = value;
            write();
    };

    this.get = function (name) {
            var returnValue = dataContainer[name];
            return returnValue;
    };

    this.getAll = function () {
            return dataContainer;
    };

    this.remove = function (name) {
            if (typeof(dataContainer[name]) != undefined) {
                    delete dataContainer[name];
            }
            write();
    };

    this.removeAll = function () {
            dataContainer = {};
            write();
    };

    /* --------- Construction --------- */
    read();
};

function array2str(obj,delimiter){
    var str="";
    delimiter=typeof delimiter!=='undefined' ? delimiter : '&';        
    for(var prop in obj){
        str=gsclauseand(str,prop+'='+obj[prop],true,delimiter);
    }
    return str;
}

function isset(obj,prop1,prop2,prop3,prop4,prop5,prop6){
    try {
        if(typeof(prop6)!='undefined'){
            return obj[prop1][prop2][prop3][prop4][prop5].hasOwnProperty(prop6);
        }else if(typeof(prop5)!='undefined'){
            return obj[prop1][prop2][prop3][prop4].hasOwnProperty(prop5);
        }else if(typeof(prop4)!='undefined'){
            return obj[prop1][prop2][prop3].hasOwnProperty(prop4);
        }else if(typeof(prop3)!='undefined'){
            return obj[prop1][prop2].hasOwnProperty(prop3);
        }else if(typeof(prop2)!='undefined'){
            return obj[prop1].hasOwnProperty(prop2);
        }else if(typeof(prop1)!='undefined'){
            return obj.hasOwnProperty(prop1);
        }else if(typeof(obj)!='undefined'){
            return true;
        }
        return false;
    }
    catch(err) {
      return false;
    }    
}

function searchbox_search(el,datadefID,insertfunction,datadefinition,filters,bsc2){
    // under construction
    // masterdata.filters !!!
    insertfunction=typeof insertfunction!=='undefined' ? insertfunction:'searchBox_insert';        
    bsc2=typeof bsc2!=='undefined' ? bsc2:false;        
    var form=$(el).parents('form')[0];
    var el_rec_record=$(el).parents('.js_rec_record')[0];
    var inputgroup=$(el).parents('.js_searchbox_group')[0];
    var el_IDfield=$(inputgroup).find('input[type=hidden]')[0];
    var el_displayfield=$(inputgroup).find('input[type=text]')[0];
    if(el_IDfield && el_displayfield && datadefinition){
        //var clause;
        var qs='';
        if(bsc2){
          if(datadefinition.searchcolumn2){
            qs='&filters[0][field]='+datadefinition.searchcolumn2+'&filters[0][type]=like&filters[0][value]='+el.value;
          }else{
            console.log('datadefinition.searchcolumn2 not set!');
            return;
          }
        }else if(el_displayfield.value.substring(0,1)=='?' && datadefinition.searchcolumn2){
            //clause=(datadefinition.searchcolumn2+" like '%"+el_displayfield.value.substring(1)+"%'");
            qs='&filters[0][field]='+datadefinition.searchcolumn2+'&filters[0][type]=like&filters[0][value]='+el_displayfield.value.substring(1);
        }else if(datadefinition.searchcolumn1){
            //clause=(datadefinition.searchcolumn1+" like '%"+el_displayfield.value+"%'");
            qs='&filters[0][field]='+datadefinition.searchcolumn1+'&filters[0][type]=like&filters[0][value]='+el_displayfield.value;
        }else if(datadefinition.displaycolumn){
            //clause=(datadefinition.displaycolumn+" like '%"+el_displayfield.value+"%'");
            qs='&filters[0][field]='+datadefinition.displaycolumn+'&filters[0][type]=like&filters[0][value]='+el_displayfield.value;
        }else{
            console.log('displaycolumn not set!');
            return;
        }
        //var url="masterdata/ProcessData.php?process_action=ReadFilter&datadefID="+datadefID+"&clause="+clause;
        var url='../'.repeat(GLOBALS_script_depth)+"masterdata/ProcessData.php?process_action=ReadFilter&datadefID="+datadefID+qs;
        var data=filters;
        if(isset(datadefinition,'masterdata','url_readfilter')){
          url='../'.repeat(GLOBALS_script_depth)+datadefinition.masterdata.url_readfilter+'?'+qs;
          data=$.extend(true,data,datadefinition.masterdata.data_readfilter);
        }
        $.getJSON(url,data,function(ret) {
            var index=0;
            if(el_rec_record)index=Number(el_rec_record.dataset.rec_index);
            if(ret.length==1){
                // return object
                var obj={};
                obj.data=ret[0];
                obj.js_return={};
                obj.js_return.form=form;
                obj.js_return.index=index;
                obj.js_return.mydisplayfield=el_displayfield.name;
                obj.js_return.myIDfield=el_IDfield.name;
                
                obj.js_return.displaycolumn=datadefinition.displaycolumn;
                obj.js_return.key=datadefinition.key;
                
                if(typeof insertfunction === 'function') {
                    insertfunction(obj);
                }else{
                    var fn=window[insertfunction];
                    if(typeof fn === 'function') {
                      fn(obj);
                    }else{
                      console.log(func_name+' is not a function!');
                    }
                }
            }else{
                var initialHeaderFilter={};
                var obj={"function_name":insertfunction,"form":form};
                obj['index']=index;
                obj['myIDfield']=el_IDfield.name;
                obj['mydisplayfield']=el_displayfield.name;
                if(bsc2){
                  if(datadefinition.searchcolumn2){
                    initialHeaderFilter=[{"field":datadefinition.searchcolumn2,"type":"like","value":el.value}];
                  }else{
                    console.log('datadefinition.searchcolumn2 not set!');
                    return;
                  }
                }else if(el_displayfield.value.substring(0,1)=='?' && datadefinition.searchcolumn2){
                    initialHeaderFilter=[{"field":datadefinition.searchcolumn2,"type":"like","value":el_displayfield.value.substring(1)}];
                }else if(datadefinition.searchcolumn1){
                    initialHeaderFilter=[{"field":datadefinition.searchcolumn1,"type":"like","value":el_displayfield.value}];
                }else if(datadefinition.displaycolumn){
                    initialHeaderFilter=[{"field":datadefinition.displaycolumn,"type":"like","value":el_displayfield.value}];
                }else{
                    console.log('displaycolumn not set!');
                    return;
                }
                
                if(typeof datadefinition.tabulator=="undefined"){
                    if(typeof datadefID=="undefined"){
                        console.log('datadefID and datadefinition undefined!');
                    }else{
                        var url='masterdata/ProcessData.php?process_action=GetObject&datadefID='+datadefID;
                        displaySearchBox(url,obj,{'tabulator':{'initialHeaderFilter':initialHeaderFilter}});
                    }
                }else{
                    datadefinition['js_return']=obj;
                    datadefinition.tabulator.initialHeaderFilter=initialHeaderFilter;
                    $('body').searchbox(datadefinition);
                }
            }
        })
        .fail(function(jqxhr, textStatus, error ) {
            var err = url+", Request Failed, "+ textStatus + ", " + error;
            alert(err );
        });			
    }else{
        console.log('not set IDfield, displayfield or datadefinition');
    }
}  

function searchBox_open(el,datadefID,insertfunction,datadefinition,filters){ 
  //GLOBALS_script_depth
    if(!$(el).hasClass('js_disabled')){
        insertfunction=typeof insertfunction!=='undefined' ? insertfunction:'searchBox_insert';
        // getting parent record
        var form=$(el).parents('form')[0];
        var el_inputgroup=$(el).parents('.js_searchbox_group')[0];
        var el_IDfield=$(el_inputgroup).find('input[type=hidden]')[0];
        var el_displayfield=$(el_inputgroup).find('input[type=text]')[0];
        var el_next=$(el_inputgroup).next().find('input,select,textarea')[0];
        if(!el_next){
            var el_parent=$(el_inputgroup).parent()[0];
            var el_next=$(el_parent).next().find('input,select,textarea')[0];
            if(!el_next){
                var el_parent=$(el_parent).parent()[0];
                var el_next=$(el_parent).next().find('input,select,textarea')[0];
            }
        }
        if(el_IDfield && el_displayfield){
            var obj={"function_name":insertfunction,"form":form};
            obj['myIDfield']=el_IDfield.name;
            obj['mydisplayfield']=el_displayfield.name;
            if(el_next)obj['el_next']=el_next;
            if(typeof datadefinition=="undefined"){
                if(typeof datadefID=="undefined"){
                    console.log('datadefID and datadefinition undefined!');
                }else{
                    var url='../'.repeat(GLOBALS_script_depth)+'masterdata/ProcessData.php?process_action=GetObject&datadefID='+datadefID;
                    displaySearchBox(url,obj,{"masterdata":{"script_depth":GLOBALS_script_depth}});
                }
            }else{
                if(typeof filters!=='undefined'){
                  if(isset(datadefinition.masterdata,'filters')){
                    for(var i=0;i<filters.length;i++){
                      var index=getArrayIndexfromValue(datadefinition.masterdata.filters,"field",filters[i]['field']);
                      if(index>-1){
                        datadefinition.masterdata.filters[index]=filters[i];
                      }else{
                        datadefinition.masterdata.filters.push(filters[i]);
                      }
                    }
                  }else{
                    datadefinition.masterdata.filters=filters;
                  }
                }
                //console.log(datadefinition.masterdata.filters);
                datadefinition['js_return']=obj;
                $('body').searchbox(datadefinition);
            }
        }else{
            console.log('el_IDfield or el_displayfield not found!');
        }
    }
}

function searchBox_insert(obj){
  var o={};
  var el_form=obj.js_return.form;
  el_form.elements.namedItem(obj.js_return.mydisplayfield).value=obj.data[obj.js_return.displaycolumn];
  el_form.elements.namedItem(obj.js_return.myIDfield).value=obj.data[obj.js_return.key];
  var el_inputgroup=$(el_form.elements.namedItem(obj.js_return.myIDfield)).parents('.js_searchbox_group')[0];
  if(el_inputgroup.dataset.fieldlist){
    var fields=el_inputgroup.dataset.fieldlist.split(',');
    for(var i=0;i<fields.length;i++){
      if(fields[i].indexOf('=')>-1){
          var map=fields[i].split('=');
          o[map[0]]=obj.data[map[1]];
          /*
          if(el_form.elements.namedItem(map[0])){
             el_form.elements.namedItem(map[0]).value=obj.data[map[1]];
          }*/
      }else{
          o[fields[i]]=obj.data[fields[i]];
          /*
          if(el_form.elements.namedItem(fields[i])){
             el_form.elements.namedItem(fields[i]).value=obj.data[fields[i]];
          }
          */
      }
    }
    obj2form(o,el_form,true);
  }
  if(obj.js_return.el_next)obj.js_return.el_next.focus();
}

function searchBox_delete(el){ 
    if(!$(el).hasClass('js_disabled')){
        var el_inputgroup=$(el).parents('.input-group')[0];
        var el_key=$(el_inputgroup).find('input[type=hidden]')[0];
        el_key.value=null;
        $(el_inputgroup).find('input[type=text]')[0].value=null;
        if(el_inputgroup.dataset.fieldlist){
            var el_form=el_key.form;
            var fields=el_inputgroup.dataset.fieldlist.split(',');
            for(var i=0;i<fields.length;i++){
                if(fields[i].indexOf('=')>-1){
                    var map=fields[i].split('=');
                    if(el_form.elements.namedItem(map[0])){
                        el_form.elements.namedItem(map[0]).value=null;
                    }
                }else{
                    if(el_form.elements.namedItem(fields[i])){
                       el_form.elements.namedItem(fields[i]).value=null;
                    }
                }
            }
        }
    }
}
function searchBox_delete_array(el){ 
    if(!$(el).hasClass('js_disabled')){
        var el_inputgroup=$(el).parents('.input-group')[0];
        var el_key=$(el_inputgroup).find('input[type=hidden]')[0];
        var namestr=getSubName('namestr',el_key.name);
        el_key.value=null;
        $(el_inputgroup).find('input[type=text]')[0].value=null;
        if(el_inputgroup.dataset.fieldlist){
            var el_form=el_key.form;
            var fields=el_inputgroup.dataset.fieldlist.split(',');
            for(var i=0;i<fields.length;i++){
                if(fields[i].indexOf('=')>-1){
                    var map=fields[i].split('=');
                    if(el_form.elements.namedItem(namestr+map[0])){
                        el_form.elements.namedItem(namestr+map[0]).value=null;
                    }
                }else{
                    if(el_form.elements.namedItem(namestr+fields[i])){
                       el_form.elements.namedItem(namestr+fields[i]).value=null;
                    }
                }
            }
        }
    }
}

function SetArrayAll(myarray,prop,value){
    for(var i=0;i<myarray.length;i++){
    	if(myarray[i][prop]){
            myarray[i][prop]=value;
       }else{
            myarray[i][prop]=value;
       }
    }
}

function Array_GET(){
    var GET = {};
    if(window.location.search.substr(1)){
        var parts = window.location.search.substr(1).split("&");
        for (var i = 0; i < parts.length; i++) {
            var temp = parts[i].split("=");
            GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
        }
    }
    return GET; //this is an object
}

function gsclauseand(sql,clause,condition,delimiter){
    sql=typeof sql!=='undefined' ? sql:"";        
    clause=typeof clause!=='undefined' ? clause:"";        
    condition=typeof condition!=='undefined' ? condition:true;        
    delimiter=typeof delimiter!=='undefined' ? delimiter:' and ';        
    if(condition){
        if(sql.length>0 && clause.length>0){
            return sql+delimiter+clause;
        }else{
            if(sql.length>0){
                return sql;
            }else{
                return clause;
            }
        }
    }else{
        return sql;
    }
}

function gbEmptyStructure(obj){
    for (var prop in obj) {
        if(typeof(obj[prop])=='object'){
            if(!gbEmptyStructure(obj[prop])){
                return false;
            }
        }else if(typeof(obj[prop])=='function'){
            // nothing
        }else if(!gbnull(obj[prop])){
            return false;
        }
    }
    return true;
}

function DeleteEmptyStructure(obj){
    for (var prop in obj) {
        if(typeof(obj[prop])=='object'){
            if(gbEmptyStructure(obj[prop])){
                delete obj[prop];
            }else{
                DeleteEmptyStructure(obj[prop]);
            }
        }else if(typeof(obj[prop])=='function'){
            // nothing
        }else if(!gbnull(obj[prop])){
            //return false;
        }
    }
    //return true;
}

function getobjectfromstr(namestr){
    /*
    var pos1=namestr.lastIndexOf('[');
    if(pos1>-1){
        var pos2=namestr.lastIndexOf(']');
        return namestr.slice(pos1+1,pos2);
    */
    var pos1=namestr.lastIndexOf(']');
    if(pos1>-1){
        return namestr.slice(pos1+1);
    }else{
       return namestr;
    }
}
function getobjectfromstrCatalog(namestr){
    var pos1=namestr.lastIndexOf('[');
    if(pos1>-1){
        var pos2=namestr.lastIndexOf(']');
        return namestr.slice(pos1+1,pos2);
    }else{
       return namestr;
    }
}


//function displayMasterData(sel,url,masterdata,oOverwrite){
function displayMasterData(sel,url,oOverwrite){
    var selector=sel;
    $.getJSON(url, function(ret) {
        if(ret.bok){
            oOverwrite=$.extend(true,ret['data'],oOverwrite);
            nestedLoop(oOverwrite);
            var masterdata_nest=$(selector).masterdata(oOverwrite);
        }else{
            $(selector).html(ret.error);
        }
    })
    .fail(function(jqxhr, textStatus, error ) {
        var err = url+", Request Failed, "+ textStatus + ", " + error;
        alert(err );
    });			
}

function displaySearchBox(url,obj_return,oOverwrite){
    var overlay=document.getElementById('k8-overlay');
    if(!overlay){
        var selector="body";
        $.getJSON(url, function(ret) {
            if(ret.bok){
                var o=$.extend(true,ret['data'],oOverwrite);
                o['js_return']=obj_return;
                var masterform=$(selector).searchbox(ret['data']);
            }else{
                //var masterform=$(selector).html(ret.error);
            }
        })
        .fail(function(jqxhr, textStatus, error ) {
            var err = url+", Request Failed, "+ textStatus + ", " + error;
            alert(err );
        });			
    }
}

function displayCatalog(sel,url,oOverwrite){
    var selector=sel;
    $.getJSON(url, function(ret) {
        if(ret.bok){
            var o=ret['data'];
            o=$.extend(true,o,oOverwrite);
            let sourceelement=getfromArray(o,'sourcelelment','');
            /*
            let datadefalias=o.datadefID+getfromArray(o,'sourceelement');
            let datadefvariable='settings'+datadefalias;
            window[datadefvariable]=o;
            window[datadefvariable].datadefalias=datadefalias;
            nestedLoop(window[datadefvariable]);
            */
            let datadefvariable='settings'+datadefID;
            sourceelement[window[datadefvariable].sourceelement]=$(selector).catalog(window[datadefvariable]);
        }else{
            $(selector).html(ret.error);
        }
    })
    .fail(function(jqxhr, textStatus, error ) {
        var err = url+", Request Failed, "+ textStatus + ", " + error;
        alert(err );
    });			
}

function getfromArray(arr,key,mydefault,bn){
    mydefault=typeof mydefault !== 'undefined' ? mydefault : '';        
    bn=typeof bn==="undefined" ? false : bn;
    var result;
    try {
        if(isNaN(key)){
            if(arr.hasOwnProperty(key)){
                if(gbnull(arr[key]) && bn){
                    result=mydefault;
                }else{
                    result=arr[key];
                }
            }else{
                result=mydefault;
            }
        }else{
            if(gbnull(arr[key]) && bn){
                result=mydefault;
            }else{
                result=arr[key];
            }
        }
    }
    catch(err) {
        result=mydefault;
    }
    return result;
}
function gbnull(v){
  if(typeof v=='undefined' || v==null){
    return true;
  }else if(v.constructor === Object ){
    return (Object.keys(v).length === 0);
  }else if(v===false){
    return false;
  }
  return (v=='' || v=='0' || v=='');
}
function gsstr2sql(v){
  return "'"+v.replaceAll("'","''")+"'";
}

function objReplacePlaceholder(o,obj,mode,path){
    const iterate = (o) => {
        Object.keys(o).forEach(key => {
            console.log(`key: ${key}, value: ${o[key]}`)
            if (typeof o[key] === 'object') {
                iterate(o[key])
            }else if(typeof o[key] === 'string'){
                //${o[key]}=ReplacePlaceholder(${o[key]},obj,mode,path);
            }
        })
    }    
}

function nestedLoop(obj){
    function recurse(obj, current) {
        for (const key in obj) {
            let value = obj[key];
            if(value != undefined) {
                if (value && typeof value === 'object') {
                    recurse(value, key);
                } else if(typeof value === 'string'){
                    var str=value;
                    
                    var $identifier="#ls#";
                    while(str.indexOf($identifier)>=0){
                        var $pos_start=str.indexOf($identifier);
                        var $pos_ende=str.indexOf("#",$pos_start+$identifier.length+1);
                        if($pos_ende>0){
                            var $placeholder=str.substr($pos_start,$pos_ende-$pos_start+1);
                            var $temp=str.substr($pos_start+$identifier.length,$pos_ende-$identifier.length-$pos_start);
                            $temp=getl($temp);
                            str=str.replace($placeholder,$temp);
                        }else{
                            str=str.substr(0,$pos_start)+str.substr($pos_start+$identifier.length);
                        }
                    }
                    
                    //var $identifier="GLOBALS";
                    //while(str.indexOf($identifier)>=0){
                      str=str.replaceAll("GLOBALS_decimal_point",GLOBALS_decimal_point);
                      str=str.replaceAll("GLOBALS_thousands_sep",GLOBALS_thousands_sep);
                      str=str.replaceAll("GLOBALS_tabulatordatetimeformat",GLOBALS_tabulatordatetimeformat);
                      str=str.replaceAll("GLOBALS_tabulatordateformat",GLOBALS_tabulatordateformat);
                      str=str.replaceAll("GLOBALS_tabulatortimeformat",GLOBALS_tabulatortimeformat);
                    //  str=str.replaceAll("GLOBALS","");
                    //}
                    obj[key] = str;
                    
                    
                    var $identifier="#function#";
                    var str=value;
                    if(str.indexOf($identifier)>=0){
                        var $pos_start=str.indexOf($identifier);
                        var $pos_ende=str.indexOf("#",$pos_start+$identifier.length+1);
                        if($pos_ende>0){
                            var $placeholder=str.substr($pos_start,$pos_ende-$pos_start+1);
                            var $temp=str.substr($pos_start+$identifier.length,$pos_ende-$identifier.length-$pos_start);
                            $temp=getl($temp);
                            str=str.replace($placeholder,$temp);
                        }else{
                            str=str.substr(0,$pos_start)+str.substr($pos_start+$identifier.length);
                        }
                        obj[key] = window[str];
                    }
                }
            }
        }
    }
    if(isset(obj,"tabulator","columns")){
      for(var i=0;i<obj.tabulator.columns.length;i++){
        if(!isset(obj.tabulator.columns[i],"accessor")){
          obj.tabulator.columns[i].accessor=k8tabulator.accessor;
        }
      }
    }
    
    recurse(obj);
}

function ReplacePlaceholder(str,dat,mode,path,k8formatter,oformatter,settings){
  str=typeof str !== 'undefined' ? str : "";
  dat=typeof dat !== 'undefined' ? dat : {};
  mode=typeof mode !== 'undefined' ? mode : 1;
  oformatter=typeof oformatter !== 'undefined' ? oformatter : [];
  if(str.length>0){
    if(str.indexOf("control_")>-1){
      var d={}; // will be a global variable in future
      d['control_new']=getfromArray(d,"control_new",'<button type="button" class="js_rec_control k8_rec_control js_rec_new btn btn-outline-secondary"><i class="bi-plus-lg"></i></button>');
      d['control_edit']=getfromArray(d,"control_edit",'<button type="button" class="js_rec_control k8_rec_control js_rec_edit btn btn-outline-secondary"><i class="bi-pencil-square"></i></button>');
      d['control_delete']=getfromArray(d,"control_delete",'<button type="button" class="js_rec_control k8_rec_control js_rec_delete btn btn-outline-secondary"><i class="bi-x-lg"></i></button>');
      d['control_cancel']=getfromArray(d,"control_cancel",'<button type="button" class="js_rec_control k8_rec_control js_rec_cancel btn btn-outline-secondary" style="display: none"><i class="bi-x-circle"></i></button>');
      d['control_canceledit']=getfromArray(d,"control_canceledit",'<button type="button" class="js_rec_control k8_rec_control js_rec_canceledit btn btn-outline-secondary"><i class="bi-x-circle"></i></button>');
      d['control_save']=getfromArray(d,"control_save",'<button type="submit" class="js_rec_control k8_rec_control js_rec_save btn btn-primary"><i class="bi-check-lg"></i></button>');
      d['control_search']=getfromArray(d,"control_search",'<button type="button" class="js_rec_control k8_rec_control js_rec_search btn btn-primary"><i class="bi-search"></i></button>');
      d['control_sort']=getfromArray(d,"control_sort",'<span class="js_rec_control k8_rec_control js_rec_search btn"><i class="bi-arrow-down-up"></i></span>');
      for (var key in d) {
          if (d.hasOwnProperty(key)){
            var value=d[key];
            if(mode==1){
                str = replaceAll(str,"["+key+"]",value);
            }else if(mode==2){
                str = replaceAll(str,"{{"+key+"}}",value);
            }else if(mode==3){
                str = replaceAll(str,"{{"+key+"*}}",value);
                str = replaceAll(str,"["+key+"*]",value);
            }else{
                str = replaceAll(str,key,value);
            }
          }
      }
    }
    
    for (var key in dat) {
        if (dat.hasOwnProperty(key)){
            
            var value=dat[key];
            if(typeof k8formatter !=='undefined'){
                var index=getArrayIndexfromValue(oformatter,'field',key);
                if(index>-1){
                    if(isset(oformatter[index])){
                        value=k8formatter.format(oformatter[index],value);
                    }   
                }
            }
            
            if(mode==1){
                str = replaceAll(str,"["+key+"]",value);
            }else if(mode==2){
                str = replaceAll(str,"{{"+key+"}}",value);
            }else if(mode==3){
                str = replaceAll(str,"{{"+key+"*}}",value);
                str = replaceAll(str,"["+key+"*]",value);
            }else{
                str = replaceAll(str,key,value);
            }
        }
    }
    var $identifier="#ls#";
    while(str.indexOf($identifier)>=0){
        var $pos_start=str.indexOf($identifier);
        var $pos_ende=str.indexOf("#",$pos_start+$identifier.length+1);
        if($pos_ende>0){
            var $placeholder=str.substr($pos_start,$pos_ende-$pos_start+1);
            var $temp=str.substr($pos_start+$identifier.length,$pos_ende-$identifier.length-$pos_start);
            $temp=getl($temp);
            str=str.replace($placeholder,$temp);
        }else{
            str=str.substr(0,$pos_start)+str.substr($pos_start+$identifier.length);
        }
    }
    var $identifier="#ss#";
    while(str.indexOf($identifier)>=0){
        var $pos_start=str.indexOf($identifier);
        var $pos_ende=str.indexOf("#",$pos_start+$identifier.length+1);
        if($pos_ende>0){
            var $placeholder=str.substr($pos_start,$pos_ende-$pos_start+1);
            var $temp=str.substr($pos_start+$identifier.length,$pos_ende-$identifier.length-$pos_start);
            $temp=getl($temp);
            str=str.replace($placeholder,$temp);
        }else{
            str=str.substr(0,$pos_start)+str.substr($pos_start+$identifier.length);
        }
    }
    var $identifier="#js#";
    while(str.indexOf($identifier)>=0){
        var $pos_start=str.indexOf($identifier);
        var $pos_ende=str.indexOf("#",$pos_start+$identifier.length+1);
        if($pos_ende>0){
            var $placeholder=str.substr($pos_start,$pos_ende-$pos_start+1);
            var $temp=str.substr($pos_start+$identifier.length,$pos_ende-$identifier.length-$pos_start);
            let result='';
            try{
              result=eval($temp);
            }
            catch(e){
              console.log('error by expression: '+$temp);
            }
            str=str.replace($placeholder,result);
        }else{
            str=str.substr(0,$pos_start)+str.substr($pos_start+$identifier.length);
        }
    }
    
    if(typeof settings !== 'undefined'){
      var $identifier="#datadef#";
      while(str.indexOf($identifier)>=0){
          var $pos_start=str.indexOf($identifier);
          var $pos_ende=str.indexOf("#",$pos_start+$identifier.length+1);
          if($pos_ende>0){
              var $placeholder=str.substr($pos_start,$pos_ende-$pos_start+1);
              var $temp=str.substr($pos_start+$identifier.length,$pos_ende-$identifier.length-$pos_start);
              $temp=getfromArray(settings,$temp);
              str=str.replace($placeholder,$temp);
          }else{
              str=str.substr(0,$pos_start)+str.substr($pos_start+$identifier.length);
          }
      }
      var masterdata=getfromArray(settings,"masterdata",{});
      var $identifier="#masterdata#";
      while(str.indexOf($identifier)>=0){
          var $pos_start=str.indexOf($identifier);
          var $pos_ende=str.indexOf("#",$pos_start+$identifier.length+1);
          if($pos_ende>0){
              var $placeholder=str.substr($pos_start,$pos_ende-$pos_start+1);
              var $temp=str.substr($pos_start+$identifier.length,$pos_ende-$identifier.length-$pos_start);
              $temp=getfromArray(masterdata,$temp);
              str=str.replace($placeholder,$temp);
          }else{
              str=str.substr(0,$pos_start)+str.substr($pos_start+$identifier.length);
          }
      }
    }
    if(typeof path!='undefined'){
        //str = replaceAll(str,"uploads",path+'uploads');
        str = replaceAll(str,"masterdata/pic/",path+'masterdata/pic/');
    }
  }
  return str;
}

/* Define functin to find and replace specified term with replacement string */
function replaceAll(str, term, replacement) {
  return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
}
function escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function getSubName(type,fullname,index){
    index= typeof index !== 'undefined' ? index : 0;
    var pos1=fullname.lastIndexOf('[');
    switch(type){
    case 'name': // items.itemID
        var part1;
        var part2;
        if(pos1>=0){
            var pos2=fullname.lastIndexOf(']');
            part2=fullname.slice(pos1+1,pos2);
            var pos3=fullname.lastIndexOf('[',pos1-1);
            if(pos3>0){
                // erase number
                var rest=fullname.slice(0,pos3);
                var pos4=rest.lastIndexOf(']',pos1-1);
                if(pos4>=0){
                    var pos5=rest.lastIndexOf('[',pos4-1);
                    part1=fullname.slice(pos5+1,pos4);
                }else{
                    part1=rest;
                }
            }else{
                part1=fullname.slice(0,pos1);
            }
            //return fullname.slice(pos1+1,pos2);
        }else{
            return fullname;
        }
        if(gbnull(part2)){
            return part1;
        }else{
            return part1+'.'+part2;
        }
        break;
    case 'columnname':  // itemID
        if(pos1>=0){
	    var pos2=fullname.lastIndexOf(']');
    	    return fullname.slice(pos1+1,pos2);
        }
        break;
    case 'namestr':
        if(pos1>=0){
            return fullname.slice(0,pos1);
        }else{
            return '';
        }
        break;
    case 'namestr1':
        var pos1=fullname.indexOf(']');
        if(pos1>=0){
            return fullname.slice(0,pos1+1);
        }else{
            return '';
        }
        break;
    case 'namemain':
        if(pos1>=0){
            var namenew=fullname.slice(0,pos1);
            pos1=namenew.lastIndexOf('[');
            if(pos1>=0){
                return fullname.slice(0,pos1);
            }else{
                return '';
            }
        }else{
            return '';
        }
        break;
    case 'part':
        var arr=fullname.split('[');
        for(var i=1;i<arr.length;i++){
            arr[i]=arr[i].replace(']','');
        }
        return arr[index];
        break;
    }
}

    
    
    // NOT USED
    function object2input(el_record,dat){
        var el_form=$(el_record).parents('form')[0];
        for(var i=0;i<el_form.elements.length;i++){
            $(el_form.elements[i]).val(getfromArray(dat,el_form.elements[i].name));
        }
    }

(function($){
    $.fn.masterdata = function( options ) {
        // used variables:
        // - GET
        // GLOBALS_hostpath
        //var k8form=Object.create(k8,{datalists:{},formcollection:{},formoptions:{}});
        var tabulator_loaddata1st=true;
        var k8form=Object.create(k8);
        var othis=this;
        // funzt nicht var k8form=new Object();
        // k8form=Object.assign({},k8);
        var bselectable=false;
        var datadefID;
        var data;
        var dat;
        var mymaster={};
        /*
        options.masterdata=getfromArray(options,'masterdata',{});
        options.masterdata.root=getfromArray(options.masterdata,'root',"");
        if(options.masterdata){
          if(options.masterdata.clause){
              options.masterdata.data_readfilter.clause=options.masterdata.clause;
          }
          if(options.masterdata.filters){
              options.masterdata.data_readfilter.filters=options.masterdata.filters;
          }
          if(isset(options.masterdata,'datareadlimit')){
              options.masterdata.data_readfilter.mytable_offset=0;
              options.masterdata.data_readfilter.mytable_limit=options.masterdata.datareadlimit;
          }
        }
        */
        var mydefault={
            "tabulator":{
                /*height:205,*/
                /*height:"100%",*/
                movableColumns: true,
                headerFilterPlaceholder:"",
                layout:"fitColumns",
                debugInvalidComponentFuncs:false,
                /*,
                selectableCheck:function(row){
                    return bselectable;
                },
                "selectableRangeMode": "click"*/
                filterMode:"remote",
                /* ajaxURL:GLOBALS_hostpath+'../'.repeat(settings.masterdata.script_depth)+options.masterdata.url_readfilter, */
                /* look down ajaxParams:options.masterdata.data_readfilter */
                
                /*"selectable":1,*/
                "selectableRows":true,
                index:options.key
            },
            "masterdata": {
                tabulatoreditpos:"right",
                menuleft_options:true,
                disprecdirect:1, /* 0=no, 1=yes, 2=filled filter, */
                focusnew:true,      
                bGETname2filters:false,
                bGETfilters:true,
                tabulatorfilter2url:true,
                init_after_save:true,
                auto_save:false,
                window_mode:0,
                edittype:8,
                formmode:3, /* 1 html, 2 jsonform, 3 k8form */
                placeholder_mode:2, /* 1=[ph] 2={{ph}} 2={{ph*}} else=ph */
                message_position:4,
                /*bresize:true,*/
                upload:{
                  enabled:false,
                  singleimage:false
                },
                /*
                icon_edit:'<img src="'+getfromArray(options.masterdata,'root')+'masterdata/pic/icon_edit.png" alt="edit" title="edit">',
                icon_delete:'<img src="'+getfromArray(options.masterdata,'root')+'masterdata/pic/icon_delete.png" alt="'+getl('Delete')+'" title="'+getl('Delete')+'">  ',
                icon_block:'<img src="'+getfromArray(options.masterdata,'root')+'masterdata/pic/icon_no_edit.png" alt="'+getl('Edit')+'" title="'+getl('no edit')+'">',
          
                icon_edit:'<button class="k8-btn-small"><svg width="16" height="16" fill="currentColor"><use xlink:href="'+GLOBALS_hostpath+'css/bootstrap-icons.svg#pencil-square"/></svg></button>',
                icon_block:'<div class="k8-ban-small"><svg width="18" height="18" fill="currentColor"><use xlink:href="'+GLOBALS_hostpath+'css/bootstrap-icons.svg#ban"/></svg></div>',
                icon_delete:'<button class="k8-btn-small"><svg width="16" height="16" fill="currentColor"><use xlink:href="'+GLOBALS_hostpath+'css/bootstrap-icons.svg#x-lg"/></svg></button>',
                
                icon_edit:'<button class="k8-btn-small"><svg width="16" height="16" fill="currentColor"><use xlink:href="'+GLOBALS_hostpath+'assets/vendor/css/bootstrap-icons.svg#pencil-square"/></svg></button>',
                icon_block:'<div class="k8-ban-small"><svg width="18" height="18" fill="currentColor"><use xlink:href="'+GLOBALS_hostpath+'assets/vendor/css/bootstrap-icons.svg#ban"/></svg></div>',
                icon_delete:'<button class="k8-btn-small"><svg width="16" height="16" fill="currentColor"><use xlink:href="'+GLOBALS_hostpath+'assets/vendor/css/bootstrap-icons.svg#x-lg"/></svg></button>',
                */
                icon_display:'<button type="button" class="k8-btn-small"><i class="bi-display"></i></button>',
                icon_edit:'<button type="button" class="k8-btn-small"><i class="bi-pencil-square"></i></button>',
                icon_block:'<button type="button" class="k8-btn-small"><i class="bi-ban"></i></button>',
                icon_delete:'<button type="button" class="k8-btn-small"><i class="bi-x-lg"></i></button>',
                
                defaultvalues:{},
                defaultvaluesobject:{},
                "object_mode": 1,   /* 0=form2obj(), 1=o=$(el_form).serializeJSON() */
                "add_empty_rec": 0,
                "htag":"h1",
                "btabselectstandard":false,
                "root": ""
            },
            "html":{"masterdata":{}},
            "return":{}/*,
            "jsonform_conf":{
                "formtype":2,
                "formclass":"form-horizontal",
                "labelHtmlClass":"control-label label-left col-sm-3",
                "fieldWrapClass":"col-sm-9"
            }*/
        };
        
        if(options.hasOwnProperty('datadefID')){
            datadefID=options.datadefID;
            mymaster={'masterdata':{
                "url_new":  "index.php?page=form&page_mode=2&datadefID="+datadefID,
                "url_edit": "index.php?page=form&page_mode=2&process_action=Edit&datadefID="+datadefID,
                /*"url_getR": "masterdata\/ProcessData.php?process_action=getRecords&datadefID="+datadefID,*/
                /*"url_init": "masterdata\/ProcessData.php?process_action=Init&datadefID="+datadefID,*/
                "url_load": "masterdata\/ProcessData.php?process_action=Load&datadefID="+datadefID,
                "url_save": "masterdata\/ProcessData.php?process_action=Save&datadefID="+datadefID,
                "url_del":  "masterdata\/ProcessData.php?&process_action=Del&datadefID="+datadefID,
                "url_readfilter": "masterdata\/ProcessData.php",
                "data_readfilter": {
                    "datadefID": datadefID,
                    "process_action": "ReadFilter"
                    }
                }
            }
        }
        var settings = $.extend(true, mydefault, mymaster, options );
        if(settings.masterdata.notabulator)settings.masterdata.menuleft_options=false;
        var headtitlecolumn=getfromArray(GET,"headtitlecolumn");
        if(!gbnull(headtitlecolumn)){
          settings.masterdata.data_readfilter['headtitlecolumn']=headtitlecolumn;
          settings.masterdata.url_save+="&headtitlecolumn="+headtitlecolumn;
        }
        let btabselectstandard=settings.masterdata.btabselectstandard;
        if(btabselectstandard)settings.tabulator.selectableRows=1;

        var url='';
        //var path='../'.repeat(settings.masterdata.script_depth);
        var path=GLOBALS_hostpath+'../'.repeat(settings.masterdata.script_depth);
        settings.masterdata.root=path;
        settings.title=(isset(settings,"title")?settings.title:getl(getfromArray(settings,"name",getfromArray(settings,"datadefID"))));

        /*
        if(!settings.jsonform_conf){
            settings.jsonform_conf={"formtype":2,
                            "formclass":'form-horizontal',
                            "labelHtmlClass":'control-label label-left col-sm-3',
                            "fieldWrapClass":"col-sm-9"};
        }
        */
       
        if(settings.masterdata.bGETname2filters || settings.masterdata.bGETfilters){
          //external GET from PHPvar GET=Array_GET();
          for(prop in GET){
              if(GET.hasOwnProperty(prop)){
                  if(prop=='reset_filter'){
                      if(GET[prop])settings.tabulator.initialHeaderFilter=[];
                  }
              }
          }
          
          if(settings.masterdata.bGETfilters){
            if(isset(GET,'filters')){
              var myfilters=GET.filters;
              for(var i=0;i<myfilters.length;i++){
                 var filter=myfilters[i];
                  if(isset(filter,'field')){
                      var prop=filter.field;
                      if(getArrayIndexfromValue(settings.tabulator.columns,'field',prop)>-1){
                          var filter={field:prop,type:getfromArray(filter,'type','='),value:getfromArray(filter,'value')}
                          if(settings.tabulator.initialHeaderFilter){
                              settings.tabulator.initialHeaderFilter.push(filter);
                          }else{
                              settings.tabulator.initialHeaderFilter=[filter];
                          }
                      }
                  }
              }
            }
          }
          if(settings.masterdata.bGETname2filters){
            for(prop in GET){
              if(GET.hasOwnProperty(prop)){
                  if(getArrayIndexfromValue(settings.tabulator.columns,'field',prop)>-1){
                      if(settings.tabulator.initialHeaderFilter){
                          settings.tabulator.initialHeaderFilter.push({field:prop,type:'=',value:GET[prop]});
                      }else{
                          settings.tabulator.initialHeaderFilter=[{field:prop,type:'=',value:GET[prop]}];
                      }
                  }
              }
            }
          }
        }       
        if(settings.masterdata.heartbeat){
            setInterval(function(){
                $.getJSON('masterdata/ProcessData.php');
                //if(settings.masterdata.fninittimer)settings.masterdata.fninittimer();
                if(settings.masterdata.pagetimer)settings.masterdata.pagetimer.reset();
            }, settings.masterdata.heartbeat);
        }
        if(!settings.masterdata.url_readfilter){
            console.log('settings.masterdata.readfilter not set!');
        }
        var blanguages=true //typeof insertfunction!=='undefined' ? insertfunction:'searchBox_insert';        

        var notabulator=getfromArray(settings.masterdata,'notabulator',false);
        var bwithdirty=getfromArray(settings.masterdata,'bwithdirty',true);
        var bnoform=getfromArray(settings.masterdata,'bnoform',false);
        var el_md;
        var el_form;
        var el_filterform;
        var tableTab;
        var row_actual=0;
        var returnflag=Number(getfromArray(Array_GET(),'returnflag',0));
        var returnopener=Number(getfromArray(Array_GET(),'returnopener',0));
        if(Array_GET()['sourcedatadefID'])settings.sourcedatadefID=getfromArray(Array_GET(),'sourcedatadefID');
        if(Array_GET()['sourcedatadefalias'])settings.sourcedatadefalias=getfromArray(Array_GET(),'sourcedatadefalias');
        if(Array_GET()['sourceelement'])settings.sourceelement=getfromArray(Array_GET(),'sourceelement');
        var img_settings={};
        
        // 08.04. 2024 if(!notabulator && !bnoform)settings.masterdata.edittype=8;
        
        if(notabulator){
          settings.tabulator.selectable=false;
          //settings.tabulator.selectableRows=false;
        }else if(!isset(settings.tabulator,'columns')){
          notabulator=true;
          console.log("no tabulator.columns set!");
        }
        if(!notabulator){
          if(!bnoform && !isset(settings.masterdata,"bresize"))settings.masterdata.bresize=true
        }

        //return this.each(function(){
        //this.each(function(){
        if(this.length==1){
            // create listbox
            //el_md=this;
            el_md=this[0];
            $(el_md).off();
            img_settings={
                el_base:el_md,
                basetype:settings.table,
                mode:!settings.masterdata.upload.singleimage,
                script_depth:settings.masterdata.script_depth
            };
            if(settings.masterdata.upload.enabled){
                //"js_rec_container":"<div class='k8-images'>   <div class='js_rec_container rec_container k8-padding-6' data-rec_object='k8references' data-rec_indexmax='-1'>     <div style='display: flex;'>       <div>         <h3>Images</h3>       </div>       <div style='flex: 1 1 30%;text-align: right; padding-top: 10px;'>         <button type='button' class='btn btn-primary js_DeleteSelected'>Delete</button>       </div>     </div>         <div id='picutes'>       <form action='masterdata/ProcessData.php?process_action=Save&datadefID=8' name='dropzone' class='dropzone k8-margin-bottom-normal'>         <input type='hidden' name='basetype' value=''>         <input type='hidden' name='baseID' value=''>         <input type='hidden' name='type' value='image'>       </form>     </div>          <div class='row js_rec_records'>      </div>   </div> </div>"
                Dropzone.autoDiscover = false;
                img_settings=$.extend(true,img_settings,settings.masterdata.upload.settings);
            }

            $(this).addClass(getfromArray(settings.masterdata,'class','masterdata'));
            
            // ------------------------------------------ HTML -------------------------------------------
            var menulefthtml='';
            if(notabulator){
                if(isset(settings.masterdata,'menuleftformhtml')){
                    menulefthtml=settings.masterdata.menuleftformhtml;
                }
                settings.masterdata.menuleft_options=false;
            }else if(isset(settings.masterdata,'menulefthtml')){
                menulefthtml=settings.masterdata.menulefthtml;
            }
            
            if(settings.masterdata.menuleftobj){
                menulefthtml='<div class="dropdown js_MenuMainLeft element"></div>';
            }else if(gbnull(menulefthtml) && settings.masterdata.menuleft_options){
                menulefthtml='<div class="dropdown js_MenuMainLeft element">'+
                    '<button type="button" id="dropdownMenuLeft" class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="true" aria-haspopup="true">'+
                    '</button>'+
                    '<ul class="dropdown-menu" aria-labelledby="dropdownMenuLeft" style="z-index: 10000000"></ul>'+
                    '</div>';
            }
            var headline='<div class="headline">' +
                            '<div>'+
                                /*(menulefthtml) +*/
                                '<'+settings.masterdata.htag+' class="js_title">Master Data Form</'+settings.masterdata.htag+'></div>'+
                            '<div>'+
                                /*(settings.tabulator.selectable ? 'M <input type="checkbox" class="js_selectmode" style="margin-right:15px">' : '') +*/
                                '<button type="button" class="btn btn-secondary js_rec_new">'+getl('New')+'</button>'+
                            '</div>'+
                         '</div>';
            if(settings.masterdata.hasOwnProperty('headline')){
                headline=ReplacePlaceholder(settings.masterdata.headline,{"menulefthtml":menulefthtml},2);
            }else if(isset(settings,'html','masterdata','headline')){
                headline=settings.html.masterdata.headline;
            }
            
            //var formwrapper='<div class="form-wrapper">'+
            //            '<form class="'+(bnoform?"":"masterdata-form js_dataform")+'"></form>'+
            //            '</div>';
            var formwrapper;
            if(bnoform){
              formwrapper='<div class="form-wrapper">'+
                        '</div>';
            }else{
              formwrapper='<div class="form-wrapper">'+
                        '<form class="'+(bnoform?"":"masterdata-form js_dataform")+'"></form>'+
                        '</div>';                      
            }
            if(settings.masterdata.hasOwnProperty('formwrapper')){
                formwrapper=settings.masterdata.formwrapper;
            }else if(isset(settings,'html','masterdata','formwrapper')){
                formwrapper=settings.html.masterdata.formwrapper;
            }
            var footline='<div class="footline">'+
                            '<div></div>'+
                         '</div>';
            if(settings.masterdata.hasOwnProperty('footline')){
                footline=settings.masterdata.footline;
                if(gbnull(footline) && settings.masterdata.message_position==0){
                    settings.masterdata.message_position=2;
                }
            }else if(isset(settings,'html','masterdata','footline')){
                footline=settings.html.masterdata.footline;
            }
            
            // ------------------------------------------ filterform -------------------------------------------
            var filterform="";
            var filterobject;
            if(!notabulator){
              if(isset(settings,'html',"masterdata",'filterform')){
                  filterform=settings.html.masterdata.filterform;
              //}else if(isset(settings,"masterdata","filterfields")){
              //    filterform=k8.createform({"templatetype":"filterform","method":"GET","fields":settings.masterdata.filterfields});
              //}
              }else if(isset(settings,'html',"masterdata",'filterformwrapper')){
                  filterform=settings.html.masterdata.filterformwrapper;
              }else if(isset(settings,"masterdata","filterobject")){
                  filterobject=settings.masterdata.filterobject;
                  if(!filterobject.templatetype)filterobject.templatetype="filterform";
                  if(!filterobject.method)filterobject.method="GET";
                  if(isset(settings,'html',"masterdata",'filtertemplate')){
                    filterobject.template=settings.html.masterdata.filtertemplate;
                  }
                  if(!filterobject.fields){
                      console.log('masterdata.filterobject.fields not set!');
                  }else{
                      filterform=k8.createform(filterobject);
                  }
              }
            }
            
            var tabulatorwrapper="";
            if(!notabulator){
              if(settings.masterdata.tabcolumns){
                //tabulatorwrapper='<div style="display: flex; width:100%; border: 1px solid #ccc">'+
                tabulatorwrapper='<div class="js_resizer">'+
                  '<div style="display: flex; width:100%;height:100%">'+
                    '<div class="js_columnlist">'+
                      '<div style="display: flex;">'+
                        '<div style="flex: 0 0 50%">'+
                          '<h4>Columns</h4>'+
                        '</div>            '+
                        '<div style="flex: 0 0 50%; text-align: right;">'+
                        '  <button class="btn btn-light" id="js_close_columnlist">Close</button>'+
                        '</div>            '+
                      '</div>'+
                      '  <form id="columnlist_form"></form>'+
                    '</div>'+
                    '<div style="width:100%" class="tabulator"></div>'+
                   '</div>'+
                '</div>';
                //'<div style="width:100%" class="tabulator'+(settings.masterdata.bresize ? ' resize-s' : "")+'"></div>'+
              }else{
                //tabulatorwrapper='<div class="tabulator'+(settings.masterdata.bresize ? ' resize-s' : "")+'"></div>';
                //tabulatorwrapper='<div class="js_resizer k8-resizer" style="width:100%"><div class="tabulator"></div></div>';
                tabulatorwrapper='<div class="js_resizer" style="width:100%"><div class="tabulator"></div></div>';
              }
            }
            tabulatorwrapper=getfromArray(settings.html.masterdata,'tabulatorwrapper',tabulatorwrapper);
            
            var messageline='<div class="k8-browser-bottom" style="display: none;"><div class="container"></div></div>';
            var html='{{headline}}'+
                    '<div class="maindata">'+
                      '{{filterformwrapper}}'+
                      '{{tabulatorwrapper}}'+
                      '{{formwrapper}}'+
                    '</div>'+
                    '{{footline}}'+
                    '{{messageline}}';
            
            html=getfromArray(settings.html.masterdata,'wrapper',html);
            var html=ReplacePlaceholder(html,{
              "headline":headline,
              "filterformwrapper":filterform,
              /*"filterformwrapper":'<div class="js_filterformwrapper"></div>',*/
              "tabulatorwrapper":tabulatorwrapper,
              "formwrapper":formwrapper,
              "footline":footline,
              "messageline":messageline,
            },2);
            
            $(el_md).html(html);
            if(settings.masterdata.bresize){
              var el=$(el_md).find('.tabulator')[0];
              el=$(el_md).find('.js_resizer')[0];
              if(el){
                el.classList.add('k8-resizer');
                if(settings.masterdata.resizer_height){
                  if(!isNaN(settings.masterdata.resizer_height)){
                    settings.masterdata.resizer_height=settings.masterdata.resizer_height+'px'
                  }
                  el.style.height=settings.masterdata.resizer_height;
                }else if(settings.masterdata.tabulator_height){
                  if(!isNaN(settings.masterdata.tabulator_height)){
                    settings.masterdata.tabulator_height=settings.masterdata.tabulator_height+'px'
                  }
                  el.style.height=settings.masterdata.tabulator_height;
                }else{
                  //let tabulatorheight=
                  el.style.height='311px';
                }
                $(el).addClass('resize-s');
                settings.tabulator.height='100%';
              }else if(settings.masterdata.notabulator){
                // no console error
              }else{
                console.error('no resizer in HTML!');
              }
            }
            
            if(!gbnull(menulefthtml)){
              var el=el_md.querySelector('.js_title');
              if(el)el.insertAdjacentHTML("beforebegin",menulefthtml);
            }
            
            el_filterform=el_md.querySelector(".js_filterform");
            if(el_filterform){
              if(filterobject){
                k8form.el_form=el_filterform;
                k8form.adddatalists(filterobject);
                k8form.onChangeDatalist(filterobject);
                //k8form.createoptions(filterobject);
                obj2form(GET,el_filterform,true); // query string to form
              }else{
                obj2form(GET,el_filterform,true); // query string to form
              }
            }
            
            // ------------------------------------------ dropdown menu -------------------------------------------
            if(settings.masterdata.menuleftobj){
              settings.masterdata.menuleftobj.displaymode=(notabulator ? 'inform':'inlist');
              if(k8form.displayDropdownCount(settings.masterdata.menuleftobj)>0){
                settings.masterdata.menuleftobj.el_dd=el_md.querySelector('.dropdown');
                //displayDropdownel(settings.masterdata.menuleftobj);
                if(!settings.masterdata.menuleftobj.button)settings.masterdata.menuleftobj.button={};
                if(!settings.masterdata.menuleftobj.button.attributes)settings.masterdata.menuleftobj.button.attributes={};
                settings.masterdata.menuleftobj.button.attributes['data-bs-auto-close']="outside";
                k8form.displayDropdown(settings.masterdata.menuleftobj);
              }
            } 
            var el_menu=$(el_md).find('.dropdown-menu')[0];
            if(el_menu && settings.masterdata.menuleft_options && !notabulator){  
                /*
                //var menuleftoptions='<li class="dropdown-submenu"><a href="#">'+getl('Options')+'</a><ul class="dropdown-menu">';
                var menuleftoptions='<li class="dropdown"><a href="#">'+getl('Options')+'</a><ul class="dropdown-menu">';
                menuleftoptions+='<li><a class="js_menuleft js_export_csv" href="#">'+getl('utf-8 CSV Export')+'</a></li>';
                menuleftoptions+='<li><a class="js_menuleft js_export_xlsx" href="#">'+getl('Excel Export')+'</a></li>';
                menuleftoptions+='<li><a class="js_menuleft js_export_pdf" href="#">'+getl('PDF Export')+'</a></li>';
                menuleftoptions+='<li><a class="js_menuleft js_datareadlimit" href="#">'+getl('Set read limt')+'</a></li>';
                if(settings.masterdata.tabcolumns){
                  menuleftoptions+='<li><a class="js_menuleft js_choosecolumns" href="#">'+getl('Choose columns')+'</a></li>';
                  if(!gbnull(userID)){
                    menuleftoptions+='<li><a class="js_menuleft js_saveconfiguration" href="#">'+getl('Save configuration')+'</a></li>';
                    menuleftoptions+='<li><a class="js_menuleft js_resetconfiguration" href="#">'+getl('Reset configuration')+'</a></li>';
                  }
                }
                menuleftoptions+='</ul></li>';
                */
                //var menuleftoptions='<li class="dropdown-submenu"><a class="dropdown-item" href="#">'+getl('Options')+'</a><ul class="dropdown-menu">';
                //var menuleftoptions='<li class="dropdown-submenu"><a class="dropdown-item dropdown-toggle" href="#" data-bs-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">'+getl('Options')+'</a><ul class="dropdown-menu">';
                var menuleftoptions='<li class="dropdown dropend"><a class="dropdown-item dropdown-toggle" href="#" data-bs-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">'+getl('Options')+'</a><ul class="dropdown-menu">';
                menuleftoptions+='<li><a class="dropdown-item js_menuleft js_export_csv" href="#">'+getl('utf-8 CSV Export')+'</a></li>';
                menuleftoptions+='<li><a class="dropdown-item js_menuleft js_export_xlsx" href="#">'+getl('Excel Export')+'</a></li>';
                menuleftoptions+='<li><a class="dropdown-item js_menuleft js_export_pdf" href="#">'+getl('PDF Export')+'</a></li>';
                menuleftoptions+='<li><a class="dropdown-item js_menuleft js_datareadlimit" href="#">'+getl('Set read limt')+'</a></li>';
                if(settings.masterdata.tabcolumns){
                  menuleftoptions+='<li><a class="dropdown-item js_menuleft js_choosecolumns" href="#">'+getl('Choose columns')+'</a></li>';
                  if(gbnull(userID) || gbnull(datadefID)){
                    menuleftoptions+='<li class="disabled"><a class="dropdown-item js_menuleft js_saveconfiguration" href="#">'+getl('Save configuration')+'</a></li>';
                  }else{
                    menuleftoptions+='<li><a class="dropdown-item js_menuleft js_saveconfiguration" href="#">'+getl('Save configuration')+'</a></li>';
                  }
                  menuleftoptions+='<li><a class="dropdown-item js_menuleft js_resetconfiguration" href="#">'+getl('Reset configuration')+'</a></li>';
                }
                if(settings.tabulator.selectable){
                //if(settings.tabulator.selectableRows){
                    menuleftoptions+='<li><a class="dropdown-item js_menuleft js_multiselect" href="#">'+getl('Multiselect')+' <span id="js_multistatus">'+(bselectable ? 'off' : 'on')+'</span></a></li>';
                }
                menuleftoptions+='</ul></li>';
                $(el_menu).append(menuleftoptions);
            }
            
            //message
            if(settings.masterdata.message_position==0){
                $(el_md).find('.footline div').addClass('js_message');
            }
            
            //var el_form=this.getElementsByClassName('jsonform')[0];
            //var table=this.getElementsByClassName('tabulator')[0];
            
            //el_form=el_md.getElementsByClassName('jsonform')[0];
            //el_form=el_md.getElementsByClassName('masterdata-form')[0];
            
            //if(isset(settings.masterdata,"form_selector") && !bnoform ){ //&& !notabulator
            if(isset(settings.masterdata,"form_selector") && (!bnoform && settings.masterdata.edittype==2 || settings.masterdata.edittype==8)){
              $(el_md).find(".js_dataform").hide();
              el_form=document.querySelector(settings.masterdata.form_selector);
              if(el_form){
                if(el_form.tagName=="DIV"){
                  el_form=$('<form class="masterdata-form js_dataform"></form>').appendTo(el_form)[0];
                }
              }
              if(!el_form){
                console.log('no form');
                return;
              }
            }else{
              el_form=el_md.getElementsByClassName('js_dataform')[0];
            }
            //el_form=el_md.getElementsByClassName('js_dataform')[0];
            
            if(settings.masterdata.jsonformID){
                if(document.getElementById(settings.masterdata.jsonformID)){
                    el_form=document.getElementById(settings.masterdata.jsonformID);
                }else{
                    console.log(settings.materdata.jsonformID+' dont exist!');
                }
            }
            var table=el_md.getElementsByClassName('tabulator')[0];
            var o={};
            var el_dirty;
            
            // ------------------------------------------ Masterdata -------------------------------------------
            //$(el_form).addClass(getfromArray(settings.jsonform_conf,'formclass','form-vertical'))
            //$(el_md).find('.headline').find('h3').eq(0).html(getl(settings.name));
            $(el_md).find('.js_title').html(getl(settings.name));

            // ------------------------------------------ Filterform -------------------------------------------
            var el_filterform=$(el_md).find('.js_filterform')[0];
            if(el_filterform){
                if(settings.masterdata.filterobject.defaultvalues){
                    obj2form(settings.masterdata.filterobject.defaultvalues,el_filterform)  
                }
                //$(el_md).find('.js_replacedata').on('click',function(e){
                $(el_filterform).on('submit',function(e){
                    e.preventDefault();
                    
                    // url ändern
                    var dat_form=form2obj(el_filterform);
                    obj2url(dat_form)
                    
                    if(buildformfilter(el_filterform,e.target)){
                      url=path+settings.masterdata.url_readfilter;
                      tableTab.setData(url,settings.masterdata.data_readfilter);
                    }

                    /*
                    var ff=[]; //[{"field":"year","type":"=","value":year},{"field":"effect","type":"&","value":effect}];
                    //var fields=settings.masterdata.filterfields;
                    var fields=settings.masterdata.filterobject.fields;
                    for(var i=0;i<fields.length;i++){
                        var name=getfromArray(fields[i],'name',getfromArray(fields[i],'fieldname'));
                        if(fields[i].figure==1){
                            var el=el_filterform.elements.namedItem(name);
                            if(el){
                                var value="";
                                if(el.value!=="undefined"){
                                    value=el.value;
                                    if(!gbnull(value)) ff.push({"field":name,"type":fields[i]['operator'],"value":value});
                                }
                            }else{
                                console.log(name+' dont exist!');
                            }
                        }else if(fields[i].figure==2){
                            var el=el_filterform.elements.namedItem(name+'from');
                            if(el){
                                var value="";
                                if(el.value!=="undefined"){
                                    value=el.value;
                                    if(!gbnull(value)) ff.push({"field":name,"type":">=","value":value});
                                }
                            }else{
                                console.log(name+'from dont exist!');
                            }
                            var el=el_filterform.elements.namedItem(name+'to');
                            if(el){
                                var value="";
                                if(el.value!=="undefined"){
                                    value=el.value;
                                    if(!gbnull(value)) ff.push({"field":name,"type":"<=","value":value});
                                }
                            }else{
                                console.log(name+'to dont exist!');
                            }
                        }
                    }
                    url=path+settings.masterdata.url_readfilter;
                    //var filters=$.extend(settings.masterdata.data_readfilter,{"filters":ff},true);
                    //tableTab.setData(url,filters);
                    settings.masterdata.data_readfilter=$.extend(settings.masterdata.data_readfilter,{"filters":ff},true);
                    tableTab.setData(url,settings.masterdata.data_readfilter);
                    */
                });
                if(el_md.getElementsByClassName("js-download-csv").length>0){
                    el_md.getElementsByClassName("js-download-csv")[0].addEventListener("click", function(){
                      tabulator_export="csv";
                        if(GLOBALS_decimal_point==","){
                          tableTab.download(tabulator_export, "data.csv",{"delimiter":";",bom:true});
                        }else{
                          tableTab.download(tabulator_export, "data.csv",{bom:true});
                        }
                    });
                }
                if(el_md.getElementsByClassName("js-download-json").length>0){
                    el_md.getElementsByClassName("js-download-json")[0].addEventListener("click", function(){
                        tabulator_export="json";
                        tableTab.download(tabulator_export, settings.title+".json");
                    });
                }
                if(el_md.getElementsByClassName("js-download-xlsx").length>0){
                    el_md.getElementsByClassName("js-download-xlsx")[0].addEventListener("click", function(){
                        tabulator_export="xlsx";
                        tableTab.download(tabulator_export, settings.title+".xlsx", {decimal:GLOBALS_decimal_point,sheetName:settings.title});
                    });
                }
                if(el_md.getElementsByClassName("js-download-pdf").length>0 || el_md.getElementsByClassName("js-download-pdf-landscape").length>0){
                    //el_md.getElementsByClassName("js-download-pdf,js-download-pdf-landscape")[0].addEventListener("click", function(){
                    el_md.querySelectorAll(".js-download-pdf,.js-download-pdf-landscape").forEach(item => {
                      item.addEventListener('click', event => {
                          var columnStyles={};
                          /*
                          columnStyles:{
                                  0: {halign:'left'},
                                  1: {halign:'right'},
                          }
                          */
                          var j=0;
                          for(var i=0;i<otable.columns.length;i++){
                            if(otable.columns[i]){
                              var visible=getfromArray(otable.columns[i],"visible",true);
                              var download=getfromArray(otable.columns[i],"download",true);
                              if(visible && download){
                                var align=getfromArray(otable.columns[i],"hozAlign","left");
                                if(isset(otable.columns[i],'width')){
                                  columnStyles[j]={"halign":align,"columnWidth":ground(Number(otable.columns[i]['width']*0.7),0)};
                                }else{
                                  columnStyles[j]={"halign":align};
                                }
                                j++
                              }
                            }
                          }
                          var orientation=(event.target.classList.contains("js-download-pdf") ? "portrait" : "landscape");
                          tabulator_export="pdf";
                          tableTab.download(tabulator_export, settings.title+".pdf", {
                              orientation:orientation, //set page orientation
                              title:settings.title,    //add title to report
                              autoTable:{             //advanced table styling
                                columnStyles:columnStyles
                              }
                          });
                      });
                    });
                }
            }
            
            
            // --------------- selectmode ---------------
            $(el_md).find('.headline .js_selectmode').on('click',function(e){
                var el=e.target;
                bselectable=el.checked;
                setSelectmode(bselectable);
                /*
                if(bselectable){
                    if(row_actual){
                        row_actual.toggleSelect();
                        row_actual=0;
                        $(el_md).find('.row_selected').removeClass('row_selected');
                    }
                }else{
                    var selected=tableTab.getSelectedRows();
                    if(selected.length>0){
                        row_actual=selected[0];
                        var count=selected.length;
                        for(var i=0;i<selected.length;i++){
                            //tableTab.deselectRow(selected[i][settings.key]);
                            tableTab.deselectRow(selected[i].getIndex());
                        }
                        $(row_actual.getElement()).addClass("row_selected");
                        if(count!=1){
                            o=row_actual.getData();
                            if(!bnoform){
                                if(bwithdirty)el_dirty.src=path+'masterdata/pic/icon_saved.png';
                                display_record(o);
                            }else{
                                if(settings.masterdata.dataLoad) {
                                    settings.masterdata.dataLoad(el_md,o,settings);
                                }
                            }
                        }                        
                        
                    }
                }
                */
            });

            function setSelectmode(bselectable){
                if(bselectable){
                    if(row_actual){
                        row_actual.toggleSelect();
                        row_actual=0;
                        $(el_md).find('.row_selected').removeClass('row_selected');
                    }
                }else{
                    var selected=tableTab.getSelectedRows();
                    if(selected.length>0){
                        row_actual=selected[0];
                        var count=selected.length;
                        for(var i=0;i<selected.length;i++){
                            //tableTab.deselectRow(selected[i][settings.key]);
                            tableTab.deselectRow(selected[i].getIndex());
                        }
                        if(!btabselectstandard)$(row_actual.getElement()).addClass("row_selected");
                        if(count!=1){
                            o=row_actual.getData();
                            if(!bnoform){
                                if(bwithdirty)el_dirty.src=path+'masterdata/pic/icon_saved.png';
                                display_record(o);
                            }else{
                                if(settings.masterdata.dataLoad) {
                                    settings.masterdata.dataLoad(el_md,o,settings);
                                }
                                cb(settings,'cbBeforeLoad',{"settings":settings,"el_md":el_md,"dat":o})
                            }
                        }                        
                        
                    }
                }
            }
        
            // --------------- New ---------------
            if(notabulator || settings.masterdata.edittype==0){
                $(el_md).find('.headline .js_rec_new').hide();
            }else{
                if(settings.rightcheck!=0 && !Number(settings.masterdata.rightuser_create)){
                    $(el_md).find('.headline .js_rec_new').prop("disabled", true);
                }else{
                    $(el_md).find('.headline .js_rec_new').on('click',function(e){
                        row_actual=0;	// delete tabulator record pointer 
                        $(table).find(".row_selected").removeClass("row_selected");
                        if(bnoform){
                            if(settings.masterdata.url_new){
                                executeControl(0);
                            }else{
                                alert('pleae set url_new');
                            }
                        }else{
                            newRecord(el_md,el_form);
                        }
                    });
                }
            }
            
            if(notabulator){
            }else{
                // ------------------------------------------ Tabulator -------------------------------------------
                if(isset(settings.masterdata,'datareadlimit')){
                    settings.masterdata.data_readfilter.mytable_offset=0;
                    settings.masterdata.data_readfilter.mytable_limit=settings.masterdata.datareadlimit;
                }
                if(!buildformfilter(el_filterform))settings.masterdata.data_readfilter.clause='1=2';
                /*
                if(settings.masterdata.disprecdirect==0){
                  settings.masterdata.data_readfilter.clause='1=2';
                }else if(settings.masterdata.disprecdirect==1){
                  if(settings.masterdata.filterobject){
                    buildformfilter(el_filterform);
                  }else{
                    // defaultfilter
                    if(settings.masterdata.clause){
                        settings.masterdata.data_readfilter.clause=settings.masterdata.clause;
                    }
                    if(settings.masterdata.filters){
                        settings.masterdata.data_readfilter.filters=settings.masterdata.filters;
                    }
                  }
                }else{
                  if(!settings.masterdata.filterobject){
                    console.log('filterobject not set');
                  }
                  if(!buildformfilter(el_filterform)){
                    settings.masterdata.data_readfilter.clause='1=2';
                  }
                }
                */
                settings.tabulator.ajaxURL=path+settings.masterdata.url_readfilter;
                settings.tabulator.ajaxParams=settings.masterdata.data_readfilter;
                
                var bdelclicked=false;
                var keyfield=settings['key'];
                
                var otable=settings.tabulator;
                /*
                var otable=$.extend(
                    settings.tabulator,
                    {
                        rowClick:function(e, row){ //trigger an alert message when the row is clicked
                            if(bdelclicked){
                                tableTab.deselectRow(row.id);
                            }else{
                                //console.log("Row " + row.getPosition() +' ID='+row.getData().ID + " Clicked");
                                row_actual=row;
                                o=row.getData();
                                //o=JSON.parse(JSON.stringify(row.getData()));
                                //o={"userID":45,"username":"Leif","email":"ee@dd.de","password":"Leif"};
                                $(table).find(".row_selected").removeClass("row_selected");
                                //$(".row_selected").removeClass("row_selected");
                                if(bselectable){
                                }else{
                                    tableTab.deselectRow(row.id);
                                    $(row.getElement()).addClass("row_selected");
                                }
                                if(!bnoform){
                                    if(bwithdirty)el_dirty.src=path+'masterdata/pic/icon_saved.png';
                                    //display_record(row.getData());
                                    display_record(o);
                                }else{
                                    if(settings.masterdata.dataLoad) {
                                        settings.masterdata.dataLoad(el_md,o,settings);
                                    }
                                }
                            }
                            bdelclicked=false;
                            
                            if(settings.masterdata.url_ping){
                                // ping
                                url=path+settings.masterdata.url_ping;
                                $.getJSON(url,function(oJson){
                                    //if(settings.masterdata.fninittimer)settings.masterdata.fninittimer();
                                    if(settings.masterdata.pagetimer)settings.masterdata.pagetimer.reset();
                                })
                                .fail(function(jqxhr, textStatus, error ) {
                                    var err = textStatus + ", " + error;
                                    console.log("Ping Failed: " + err );
                                });			
                            }                            
                        },
                        dataFiltering:function(filters){
                            //console.log('filters');
                            //console.log(filters);
                        },
                        dataFiltered:function(filters,rows){
                            //console.log("dataFiltered");
                            if(1){
                                // selected
                            }
                            //if(settings.masterdata.fninittimer)settings.masterdata.fninittimer();
                            if(settings.masterdata.pagetimer)settings.masterdata.pagetimer.reset();
                            //if(pagetimer)pagetimer.reset();
                            row_actual=0;
                            var selects="";
                            if(tableTab)filter2url(tableTab.getHeaderFilters(),selects);
                            initForm(settings.masterdata.defaultvalues);
                        }
                    }
                );
                */
               
                //-------------------------------- Define Table Columns --------------------------------
                //otable.columns=settings.tabulator.columns;
                
                /* -------- language support ----------- */
                if(blanguages){
                    for (var property in otable.columns) {
                      if (otable.columns.hasOwnProperty(property)) {
                        if(otable.columns[property].hasOwnProperty('title')){
                            //console.log(otable.columns[property]['title']);
                            otable.columns[property]['title']=getl(otable.columns[property]['title']);
                        }
                      }
                    }                
                }
                if(otable.columns){
                  settings.masterdata.tabulator_columnsbackup=JSON.parse(JSON.stringify(otable.columns));
                }
                
                if(settings.masterdata.tabcolumns){
                  //if(!_.isEmpty(settings.masterdata.tabcolumns)){
                  if(!gbnull(settings.masterdata.tabcolumns)){
                    for (var i=0;i<otable.columns.length;i++) {
                      if(settings.masterdata.tabcolumns.hasOwnProperty(otable.columns[i]['field'])){
                        otable.columns[i].width=settings.masterdata.tabcolumns[otable.columns[i]['field']]['width'];
                        otable.columns[i]['visible']=true;  
                      }else{
                        otable.columns[i]['visible']=false;
                      }
                    }
                    //delete(settings.masterdata.tabcolarr);
                    settings.masterdata.tabcolarr=[];
                    settings.masterdata.tabcolumns
                    for(prop in settings.masterdata.tabcolumns){
                      if(settings.masterdata.tabcolumns.hasOwnProperty(prop)){
                        settings.masterdata.tabcolarr.push(prop);
                      }
                    }
                    otable.columns=arraySortByArray(otable.columns,"field",settings.masterdata.tabcolarr)
                  }                    
                }else if(settings.masterdata.tabcolarr){
                    /* -------- tabcolarr ----------- */
                    for (var i=0;i<otable.columns.length;i++) {
                      if (settings.masterdata.tabcolarr.indexOf(otable.columns[i]['field'])<0){
                          delete otable.columns[i];
                      }
                    }
                    otable.columns=arraySortByArray(otable.columns,"field",settings.masterdata.tabcolarr)                    
                }
                
                tabulatorAddControls();
                
                tableTab = new Tabulator(table, otable);
                tabulator_table=tableTab;
                
                tableTab.on("tableBuilt", function(){
                  if(!notabulator && settings.masterdata.tabcolumns){
                    var el=document.getElementById('js_close_columnlist');
                    if(el){
                      el.addEventListener('click', function(e) {
                        $(el_md).find('.js_columnlist').toggle();
                      });
                      const myForm = document.getElementById('columnlist_form');
                      if(myForm){
                          myForm.addEventListener('change', function(e) {
                              e.preventDefault();
                              if(e.target.tag='input'){
                                  console.log('checkbox clicked');  // Expected Value: 'Data'
                                  if(e.target.checked){
                                      tableTab.showColumn(e.target.name);
                                  }else{
                                      tableTab.hideColumn(e.target.name);
                                  }
                                  tableTab.redraw(true);
                              }
                          });
                      }    
                      listcolumns();
                    }
                  }

                  function listcolumns(){
                      $(columnlist_form).empty();
                      var htmlcheckbox='<div class="checkbox">'+
                                          '<label class=""><input type="checkbox" name="{{field}}">&nbsp;&nbsp;{{label}}</label>'+
                                      '</div>';

                      var tablecolumns=tableTab.getColumns();
                      for(var i=0;i<tablecolumns.length;i++){
                        if(tablecolumns[i].getDefinition().field){
                          var node=document.createElement("div");
                          var temp=htmlcheckbox.replace('{{label}}',tablecolumns[i].getDefinition().title).replace('{{field}}',tablecolumns[i].getDefinition().field);
                          var el_div=$(temp).appendTo(columnlist_form);
                          var el_check=$(el_div).find("input")[0];
                          if(tablecolumns[i].isVisible()){
                              el_check.checked=true;
                          }
                        }
                      }
                  }
                });
                
                tableTab.on("rowClick",function(e, row){
                            row_actual=row;
                            //console.log("Rowclick " + row.getPosition() +' ID='+row.getData().title + " Clicked");
                            var rowid=row.getData()[settings.key];
                            if(bselectable){
                            }else if(row._row.type=='row'){
                              if(!btabselectstandard){
                                $(table).find(".row_selected").removeClass("row_selected");
                                tableTab.deselectRow(rowid);
                                $(row.getElement()).addClass("row_selected");
                              }
                            }
                            if(bdelclicked){
                                //tableTab.deselectRow(rowid);
                            }else if(row._row.type=='row'){
                                dat=row.getData();
                                //row_actual.select();
                                /*
                                $(table).find(".row_selected").removeClass("row_selected");
                                if(bselectable){
                                }else{
                                    tableTab.deselectRow(rowid);
                                    $(row.getElement()).addClass("row_selected");
                                }
                                */
                                if(!bnoform){
                                    if(bwithdirty)el_dirty.src=path+'masterdata/pic/icon_saved.png';
                                    //display_record(row.getData());
                                    display_record(dat);
                                }else{
                                    if(settings.masterdata.dataLoad) {
                                        settings.masterdata.dataLoad(el_md,dat,settings);
                                    }
                                    //2024-07-27 cb(settings,'cbBeforeLoad',{"settings":settings,"el_md":el_md,"dat":dat})
                                }
                            }
                            bdelclicked=false;
                            
                            if(settings.masterdata.url_ping){
                                // ping
                                url=path+settings.masterdata.url_ping;
                                $.getJSON(url,function(oJson){
                                    //if(settings.masterdata.fninittimer)settings.masterdata.fninittimer();
                                    if(settings.masterdata.pagetimer)settings.masterdata.pagetimer.reset();
                                })
                                .fail(function(jqxhr, textStatus, error ) {
                                    var err = textStatus + ", " + error;
                                    console.log("Ping Failed: " + err );
                                });			
                            }                            
                        });
                tableTab.on("dataFiltered", function(filters, rows){                        
                            //console.log("dataFiltered");
                            if(settings.masterdata.pagetimer)settings.masterdata.pagetimer.reset();
                            //if(pagetimer)pagetimer.reset();
                            row_actual=0;
                            var selects="";
                            if(tableTab && GLOBALS_urlmode==0 && settings.masterdata.tabulatorfilter2url){
                              filter2url(tableTab.getHeaderFilters(),selects);
                            }
                            initForm(settings.masterdata.defaultvalues);
                });
                tableTab.on("dataProcessed", function(data){
                  if(tabulator_loaddata1st && tableTab && el_form){
                    if(getfromArray(GET,"bselect",0)){
                      row_actual = tableTab.getRows()[0];
                      if(row_actual){
                        $(row_actual.getElement()).addClass("row_selected");
                        display_record(row_actual.getData());
                      }
                    }
                    tabulator_loaddata1st=false;
                  }
                });  
                tableTab.on("dataLoadError", function(error){
                  console.log("dataLoadError.Error="+error);
                  k8form.message("probably you are offline","alert");
                  var params=$.extend(settings.masterdata.data_readfilter,tableTab.getHeaderFilters(),true)
                  if(settings.masterdata.cbConnectionfail){
                    var myoptions={tableTab:tableTab,url:settings.masterdata.url_readfilter,params:params};
                    settings.masterdata.cbConnectionfail(myoptions);
                  }else{
                    /*
                    console.log("cbConnectionfail");
                    var el=document.getElementsByClassName('navbar-brand')[0];
                    if(el){
                      if(el.style.color!=="red"){
                        var color_backup=el.style.color;
                        el.style.color="red";
                        var intervalID=setInterval(checkConnection,5000);

                        function checkConnection(){
                          console.log("checkConnection");
                          $.getJSON("masterdata/ProcessData.php", function(oJson) {
                            el.style.color=color_backup;
                            // reloaddata
                            tableTab.setData(settings.masterdata.url_readfilter,params);
                            clearInterval(intervalID);
                          })
                          .fail(function(jqxhr, textStatus, error ) {
                          });			
                        }  
                      }  
                    }else{
                      console.log("cbConnectionfail: no navbar-brand, no connection check");
                    }
                    */
                  }
                });
                
                //$(this).find('.resize-s').resizable({handles:"s"});
                if(settings.masterdata.bresize){
                  tableTab.on("tableBuilt", function(){
                    $(el_md).find('.resize-s').resizable({handles:"s",distance:1});
                  });
                }
            }

            function buildformfilter(el_filterform,el_clicked){
                var ff=[]; //[{"field":"year","type":"=","value":year},{"field":"effect","type":"&","value":effect}];
                var clause="";
                let dat_filter={};
                
                if(el_filterform){
                  if(settings.masterdata.filterobject){
                    if(settings.masterdata.filterobject.formcollection){
                      for(var field in settings.masterdata.filterobject.formcollection){
                        clause=buildformfilterfromfield(el_filterform,settings.masterdata.filterobject.formcollection[field],ff,clause);
                      }
                    }else{
                      var fields=settings.masterdata.filterobject.fields;
                      for(var i=0;i<fields.length;i++){
                        let field=fields[i];
                        clause=buildformfilterfromfield(el_filterform,field,ff,clause);
                      }

                    }
                  }
                  if(el_clicked){
                    dat_filter=form2obj(el_filterform);
                  }
                }
                let bfilter=!gbnull(clause)||ff.length>0;
                
                // default
                settings.masterdata.data_readfilter.clause=settings.masterdata.clause;
                settings.masterdata.data_readfilter.filters=getfromArray(settings.masterdata,"filters",[]);
                
                let filtermode=getfromArray(settings.masterdata.filterobject,'filtermode',1);
                if(filtermode==1){ // clause
                  settings.masterdata.data_readfilter.clause=gsclauseand(settings.masterdata.data_readfilter.clause,clause,!gbnull(clause));
                }else{
                  // array filters
                  ff.forEach(function(filter){
                    settings.masterdata.data_readfilter.filters.push(filter);
                  });
                }
                if(settings.masterdata.filters_masterdata){
                  settings.masterdata.filters_masterdata.forEach(function(filter){
                    settings.masterdata.data_readfilter.filters.push(filter);
                  });
                }
                
                if(settings.masterdata.filterobject){
                  settings.masterdata.disp_tabulator=(settings.masterdata.disprecdirect==1);
                }else{
                  settings.masterdata.disp_tabulator=true;
                }
                if(el_clicked){
                  settings.masterdata.disp_tabulator=true;
                }else{
                  if(settings.masterdata.disprecdirect==2 && bfilter)settings.masterdata.disp_tabulator=true;
                }
                cb(settings,'cbBeforeFilter',{"settings":settings,"el_md":el_md,"dat_filter":dat_filter,"el_clicked":el_clicked})
                return settings.masterdata.disp_tabulator;
            }
            
            function buildformfilterfromfield(el_filterform,field,ff,clause){
              if(field['operator']){
                var name=getfromArray(field,'name',getfromArray(field,'fieldname'));
                var filterfield=name;
                if(field['table']){
                  filterfield=getfromArray(field,'table')+'.'+filterfield
                }
                field.figure=getfromArray(field,'figure',0);
                if(field.figure==2){
                    var el=el_filterform.elements.namedItem(name+'from');
                    if(el){
                        if(el.value!=="undefined"){
                            let value=el.value;
                            let value_ignore=getfromArray(field,'value_ignore','')
                            if(value!=value_ignore){
                              ff.push({"field":filterfield,"type":">=","value":value});
                              clause=gsclauseand(clause,filterfield+'>='+gsstr2sql(value));
                            }
                        }
                    }else{
                        console.log(name+'from dont exist!');
                    }
                    var el=el_filterform.elements.namedItem(name+'to');
                    if(el){
                        if(el.value!=="undefined"){
                            let value=el.value;
                            let value_ignore=getfromArray(field,'value_ignore','')
                            if(value!=value_ignore){
                              ff.push({"field":filterfield,"type":"<=","value":value});
                              clause=gsclauseand(clause,filterfield+'<='+gsstr2sql(value));
                            }
                        }
                    }else{
                        console.log(name+'to dont exist!');
                    }
                }else{
                    var el=el_filterform.elements.namedItem(name);
                    if(el){
                        if(el.value!=="undefined"){
                            let value=el.value;
                            let value_ignore=getfromArray(field,'value_ignore','')
                            if(value!=value_ignore){
                              ff.push({"field":filterfield,"type":field['operator'],"value":value});
                              let operator=field['operator'];
                              if(operator=='like'){
                                clause=gsclauseand(clause,filterfield+' like '+gsstr2sql('%'+value+'%'));
                              }else{
                                clause=gsclauseand(clause,filterfield+operator+gsstr2sql(value));
                              }
                            }
                        }
                    }else{
                        console.log(name+' dont exist!');
                    }
                }
              }
              return clause;
            }
            
            function tabulatorAddControls(){
              if(settings.masterdata.edittype>0){

                  // ----------------- edit ----------------
                  let editcolumn={"headerSort":false,"download":false,"width":25, "hozAlign":"center",
                      "formatter":function(cell, formatterParams, onRendered){
                          var rightuser_update=false;
                          if(settings.rightcheck!==0){
                              rightuser_update=Number(getfromArray(cell.getData(),'rightuser_update',false));
                          }
                          var html="";
                          if(settings.rightcheck!=0){
                              if(rightuser_update){
                                  html+=settings.masterdata.icon_edit;
                              }else{
                                  html+=settings.masterdata.icon_display;
                              }
                          }
                          return html;
                      },
                      "cellClick":function(e, cell){
                          if((settings.rightcheck!=0 && getfromArray(cell.getData(),'rightuser_update',false)) || settings.rightcheck==0){
                              bdelclicked=true;
                              row_actual=cell.getRow();
                              console.log("Cellclick="+row_actual.getData().title);
                              //var rowid=row_actual.getData()[settings.key];
                              //not working tableTab.selectRow(rowid);

                              //var url=settings.masterdata.url_edit+'&keyvalue='+cell.getData()[settings.key];
                              if(settings.masterdata.url_edit){
                                  executeControl(cell.getData()[settings.key]);
                              }else{
                                  alert('please set url_edit!');
                              }
                          }
                      }
                  };

                  if(otable.columns){
                    if(settings.masterdata.tabulatoreditpos=="left" && bnoform){
                      otable.columns.unshift(editcolumn);
                    }
                    // ----------------- delete ----------------
                    otable.columns.unshift({"headerSort":false,"download":false,"width":25, "hozAlign":"center",
                        "formatter":function(cell, formatterParams, onRendered){ //plain text value
                            var rightuser_delete=true;
                            var rightuser_update=false;
                            if(settings.rightcheck!=0){
                                rightuser_update=Number(getfromArray(cell.getData(),'rightuser_update',false));
                                rightuser_delete=Number(getfromArray(cell.getData(),'rightuser_delete',false));
                            }
                            var html="";
                            if(settings.rightcheck!=0){
                                if(rightuser_update){
                                    if(rightuser_delete)html+=settings.masterdata.icon_delete;
                                }else{
                                    if(rightuser_delete){
                                      html+=settings.masterdata.icon_delete;
                                    }else{
                                      //html+='<img src="'+getfromArray(settings.masterdata,'root')+'masterdata/pic/icon_no_edit.png" alt="'+getl('Edit')+'" title="'+getl('no edit')+'">';
                                      html+=settings.masterdata.icon_block;
                                    }  
                                }
                            }else{
                              if(rightuser_delete)html+=settings.masterdata.icon_delete;
                            }
                            return html;
                        },  
                        "cellClick":function(e, cell){
                            //console.log('event.delete');
                            if((settings.rightcheck!=0 && Number(getfromArray(cell.getData(),'rightuser_delete',false))) || settings.rightcheck==0){
                                var bdel=false;
                                url=path+settings.masterdata.url_del;
                                if(settings.masterdata.cbBeforeDelete) {
                                    bdel=cb(settings,'cbBeforeDelete',{"settings":settings,"el_md":el_md,"dat":cell.getData()})
                                    //bdel=settings.masterdata.cbBeforeDelete({"el_md":el_md,"dat":cell.getData(),"settings":settings});
                                }else{
                                  bdel=confirm(getl('Delete')+'?');
                                }                                
                                if(bdel){
                                    bdelclicked=true;
                                    o={};
                                    o[keyfield]=cell.getData()[keyfield];
                                    // dat is added for table with more than 1 key field
                                    // all arrays are deleted
                                    o['dat']=cell.getData();
                                    for(var prop in o['dat']){
                                      if(Array.isArray(o['dat'][prop])){
                                        delete(o['dat'][prop]);
                                      }
                                    }
                                    url=path+settings.masterdata.url_del;
                                    $.getJSON(url,o, function(oJson) {
                                        //if(settings.masterdata.fninittimer)settings.masterdata.fninittimer();
                                        if(settings.masterdata.pagetimer)settings.masterdata.pagetimer.reset();

                                        if(oJson.bok){
                                            var datdel=cell.getData();
                                            cell.getRow().delete();
                                            row_actual=0;
                                            if(settings.masterdata.dataAfterDelete) {
                                                settings.masterdata.dataAfterDelete();
                                            }
                                            cb(settings,'cbAfterDelete',{"settings":settings,"el_md":el_md,"dat":datdel});
                                            if(!bnoform)newRecord(el_md,el_form);
                                        }else{
                                            message(oJson.error,'alert');
                                        }
                                    })
                                    .fail(function(jqxhr, textStatus, error ) {
                                        var err = textStatus + ", " + error;
                                        //console.log( "Request Failed: " + err );
                                    });			
                                }
                            }
                        }
                    });
                  }
                  if(settings.masterdata.tabulatoreditpos=="right" && bnoform){
                    // ----------------- edit, right ----------------
                    otable.columns.push(editcolumn);
                  }
              }
            }
              
            if(menulefthtml || settings.masterdata.dataMenuleft || settings.masterdata.cbMenuleft){
                //$(el_md).on("click",".js_menuleft",function(e){
                var el_menumainleft=$(el_md).find(".js_MenuMainLeft")[0];
                $(el_md).find(".js_MenuMainLeft").on("click",function(e){
                    var el=e.target;
                    
                    if(!el.classList.contains('dropdown-toggle')){
                      //$(el).parents('.dropdown-menu').removeClass('show');
                      $(el_menumainleft).find('.show').removeClass('show');
                    }
                    
                    // sorry, will be changed in future
                    if(tableTab){
                        selected=tableTab.getSelectedRows();
                        if(!btabselectstandard){
                          if(row_actual && !bselectable)selected.push(row_actual);
                        }
                    }
                    /*
                    selected=tableTab.getSelectedRows();
                    if(!btabselectstandard){
                      if(row_actual && !bselectable)selected.push(row_actual);
                    } 
                    */
                    if(el.classList.contains('js_export_csv')){
                        //console.log("csv");
                        tabulator_export="csv";
                        if(GLOBALS_decimal_point==","){
                          tableTab.download(tabulator_export, settings.title+".csv",{"delimiter":";",bom:true});
                        }else{
                          tableTab.download(tabulator_export, settings.title+".csv",{bom:true});
                        }
                    }else if(el.classList.contains('js_export_xlsx')){
                        tabulator_export="xlsx";
                        tableTab.download(tabulator_export, settings.title+".xlsx", {decimal:GLOBALS_decimal_point,sheetName:settings.title});
                    }else if(el.classList.contains('js_export_pdf')){
                       
                        var columnStyles={};
                        var headStyles={};
                        /*
                        columnStyles:{
                                0: {halign:'left'},
                                1: {halign:'right'},
                        }
                        */
                        var j=0;
                        for(var i=0;i<otable.columns.length;i++){
                          if(otable.columns[i]){
                            var visible=getfromArray(otable.columns[i],"visible",true);
                            var download=getfromArray(otable.columns[i],"download",true);
                            if(visible && download){
                              var align=getfromArray(otable.columns[i],"hozAlign","left");
                              if(isset(otable.columns[i],'width')){
                                columnStyles[j]={"halign":align,"columnWidth":ground(Number(otable.columns[i]['width'])*0.7,2)};
                              }else{
                                columnStyles[j]={"halign":align};
                              }
                              headStyles[j]={"halign":align};
                              j++
                            }
                          }
                        }
                        tabulator_export="pdf";
                        tableTab.download(tabulator_export, settings.title+".pdf", {
                            orientation:"landscape", //set page orientation to portrait
                            title:settings.title,    //add title to report
                            autoTable:{             //advanced table styling
                              /*margin: {top:100,left:20,right:20},*/
                              headStyles:headStyles,
                              columnStyles:columnStyles
                            }
                        });
                    }else if(el.classList.contains('js_datareadlimit')){
                        var datareadlimit=getfromArray(settings.masterdata,'datareadlimit',50);
                        datareadlimit = prompt("Please enter record read limit (0 for all)", datareadlimit);
                        if(datareadlimit==null){
                          //nothing
                        }else{
                          settings.masterdata.datareadlimit=datareadlimit;
                          settings.masterdata.data_readfilter.mytable_offset=0;
                          settings.masterdata.data_readfilter.mytable_limit=datareadlimit;
                          tableTab.setData(url,settings.masterdata.data_readfilter);
                        }
                    }else if(el.classList.contains('js_choosecolumns')){
                      $(el_md).find('.js_columnlist').toggle();

                    }else if(el.classList.contains('js_saveconfiguration')){
                      //settings.masterdata.tabcolumns
                      delete(settings.masterdata.tabcolumns);
                      settings.masterdata.tabcolumns={};
                      for(var i=0;i<tableTab.getColumns().length;i++){
                        if(tableTab.getColumns()[i].isVisible() && tableTab.getColumns()[i].getDefinition().field){
                          var field=tableTab.getColumns()[i].getDefinition().field;
                          settings.masterdata.tabcolumns[field]={};
                          //if(tableTab.getColumns()[i].getDefinition().width){
                            settings.masterdata.tabcolumns[field]["width"]=tableTab.getColumns()[i].getWidth();
                          //}
                        }
                      }
                      if(!gbnull(userID) && !gbnull(datadefID)){
                        if(isset(dat_user)){
                          if(gbnull(dat_user.settings))dat_user.settings={};
                          if(!isset(dat_user,'settings','datadefinitions'))dat_user['settings']['datadefinitions']={};
                          if(!isset(dat_user,'settings','datadefinitions',datadefID))dat_user['settings']['datadefinitions'][datadefID]={};
                          if(!isset(dat_user,'settings','datadefinitions',datadefID,"masterdata"))dat_user['settings']['datadefinitions'][datadefID]['masterdata']={};
                          dat_user.settings.datadefinitions[datadefID]['masterdata']['tabcolumns']=settings.masterdata.tabcolumns;

                          let el_resizable=$(el_md).find('.js_resizer')[0];
                          if(el_resizable){
                            dat_user.settings.datadefinitions[datadefID].masterdata.resizer_height=el_resizable.offsetHeight;
                          }
                          
                          var record={"userID":userID,"settings":JSON.stringify(dat_user.settings)};
                          $.ajax(
                            {url:path+getfromArray(settings.masterdata,"url_saveuser","masterdata/ProcessData.php?datadefID=k8login&process_action=Save"),
                            data:record,
                            type:"POST",
                            success:function(ret){
                              //console.log(ret);
                            }
                          })
                          .fail(function(jqxhr, textStatus, error ) {
                              var err = textStatus + ", " + error;
                              console.log( "Request Failed: " + err );
                          });			
                        }
                      }else{
                        if(!gbnull(datadefID))console.log("js_saveconfiguration, datadefID not set");
                      }
                      
                    }else if(el.classList.contains('js_resetconfiguration')){
                      delete(settings.masterdata.tabcolumns);
                      otable.columns=JSON.parse(JSON.stringify(settings.masterdata.tabulator_columnsbackup));
                      tabulatorAddControls();
                      tableTab.setColumns(otable.columns);
                      if(isset(dat_user)){
                        if(gbnull(dat_user.settings))dat_user.settings={};
                        if(!isset(dat_user,'settings','datadefinitions'))dat_user['settings']['datadefinitions']={};
                        if(!isset(dat_user,'settings','datadefinitions',datadefID))dat_user['settings']['datadefinitions'][datadefID]={};
                        if(!isset(dat_user,'settings','datadefinitions',datadefID,"masterdata"))dat_user['settings']['datadefinitions'][datadefID]['masterdata']={};
                        dat_user.settings.datadefinitions[datadefID]['masterdata']['tabcolumns']={};
                        // 2024-08-25
                        dat_user.settings.datadefinitions[datadefID]={};
                        var record={"userID":userID,"settings":JSON.stringify(dat_user.settings)};
                        $.ajax(
                          {url:path+"masterdata/ProcessData.php?datadefID=k8login&process_action=Save&update_session=1",
                          data:record,
                          type:"POST",
                          success:function(ret){
                            console.log(ret);
                          }
                        })
                        .fail(function(jqxhr, textStatus, error ) {
                            var err = textStatus + ", " + error;
                            console.log( "Request Failed: " + err );
                        });			
                      }
                      
                    }else if(el.classList.contains('js_multiselect')){
                      var el_multistatus=document.getElementById('js_multistatus');
                      bselectable=!bselectable;
                      el_multistatus.innerHTML=(bselectable ? 'off' : 'on');
                      setSelectmode(bselectable);
                    }else{
                      if(settings.masterdata.dataMenuleft)settings.masterdata.dataMenuleft(el_md,e,row_actual,this);
                      if(settings.masterdata.cbMenuleft){
                        var $disabledFields = $(el_form).find('[disabled]');
                        $disabledFields.prop('disabled', false);
                        var dattemp=$(el_form).serializeJSON({checkboxUncheckedValue: "0"});
                        $disabledFields.prop('disabled', true);
                        var dat_tabulator={};
                        if(row_actual)dat_tabulator=row_actual.getData();
                        var obj={"el_md":el_md,"el_form":el_form,"e":e,"row_actual":row_actual,"selected":selected,"display_record":display_record,"settings":settings,"this":this,"dat":dat_tabulator,"dat_form":dattemp,"isDirty":isDirty(),setDirty:setDirty,tableTab:tableTab};
                        //settings.masterdata.cbMenuleft(obj);
                        cb(settings,'cbMenuleft',obj);
                        if(isset(obj.row_actual))row_actual=obj.row_actual;
                      }
                    }
                });
            }

            /* -----------------------------------------------   Form   ------------------------------------------- */
            if(!bnoform){
                if(settings.masterdata.formmode==2){
                    // removed
                }else if(settings.masterdata.formmode==3){
                    if(settings.k8form){
                      if(isset(settings.masterdata,"form_selector")){
                        settings.k8form.el_form=el_form;
                      }else{
                        var myID="";
                        if(el_md.id)myID="#"+el_md.id+' ';
                        if(settings.masterdata.edittype==3)myID="#overlay_content ";
                        //if(settings.masterdata.edittype==3)myID=".k8-overlay_content ";
                        settings.k8form.selector=myID+settings.k8form.selector;
                      }
                      settings.k8form.templatetype=getfromArray(settings.k8form,'templatetype','masterform');
                      k8form.createform(settings.k8form);
                      k8form.adddatalists(settings.k8form);
                      //k8form.onChangeDatalist(settings.k8form);
                      k8form.createoptions(settings.k8form);
                    }else{
                      console.log("no k8form definition!");
                    }
                }else if(isset(settings,"html","masterdata","main") ){
                    $(el_form).append(settings.html.masterdata.main);
                    /*
                    $(el_form).submit(function(e){
                        e.preventDefault();
                        $(el_form).find('input[type="submit"],button[type="submit"]').attr("disabled",true);
                        var binit=settings.masterdata.init_after_save;
                        if(settings.masterdata.auto_save)binit=false;
                        saveRecord(binit);
                        //saveRecord();
                    });
                    */
                }else{
                    console.log("formmode not correctly");
                }

                if(settings.masterdata.formmode==1 || settings.masterdata.formmode==3){
                  el_form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    $(el_form).find('input[type="submit"],button[type="submit"]').attr("disabled",true);
                    var binit=settings.masterdata.init_after_save;
                    if(settings.masterdata.auto_save)binit=false;
                    saveRecord(binit);
                  });                
                }
                $(el_form).find('button[type=button]').on('click',function(e){
                    e.preventDefault();
                    if($(e.target).hasClass('js_cancel')){
                        console.log("cancel");
                        cancel();
                    }
                });
                
                if(bwithdirty){
                    var el=$(el_form).find('.js_dirty')[0];
                    if(el){
                        var el_dirty = document.createElement("IMG");
                        el_dirty.src=path+'masterdata/pic/icon_saved.png';
                        el.append(el_dirty);
                    }else{
                        bwithdirty=false;
                    }
                }

                /* this is NOT ALLOWED!!!
                if(blanguages)el_form.innerHTML=ReplacePlaceholder(el_form.innerHTML);
                */
                
                // disabled
                $(el_form).find('select:disabled,input:disabled,textarea:disabled').attr("aria-disabled",true);

                $(el_form).on("click",".js_rec_new",function(){
                  // variables: dat
                    console.log("event .js_rec_new");
                    if(!$(this).hasClass('js_disabled')){
                        if(getfromArray(settings.masterdata,'auto_save',0)){
                            saveRecord(false);
                        }
                        var el_rec_container;
                        var container_position=typeof this.dataset.container_position=="undefined" ? 0 : this.dataset.container_position;
                        var rec_object=typeof this.dataset.rec_object=="undefined" ? "" : this.dataset.rec_object;
                        
                        if(container_position==0){
                            el_rec_container=$(this).parents('.js_rec_container')[0];
                        }else{
                            if(container_position<0){
                                el_rec_container=$(this).prev('.js_rec_container[data-rec_object="'+rec_object+'"]')[0];
                            }else{
                                el_rec_container=$(this).next('.js_rec_container[data-rec_object="'+rec_object+'"]')[0];
                            }
                        }
                        if(el_rec_container){
                          var object=el_rec_container.dataset.rec_object;
                          var indexarray=[object];
                          var namestr=object;
                          var prop="-1";
                          var datsub={};
                          if(isset(settings.masterdata,'defaultvaluesobject',object))datsub=settings.masterdata.defaultvaluesobject[object];
                          var el_rec_record=$(el_rec_container).parents('.js_rec_record')[0];
                          if(el_rec_record){
                            indexarray=getIndexarray(el_rec_record).concat(indexarray);
                            namestr=getNamestrfromindexarray(indexarray);
                            // defaultvalues
                            // getObjectValuefromIndexArray(dat,indexarray);
                          }
                          // el_rec_container,before_rec_index,namestr,prop,dat
                          addhtmlrecord(el_rec_container,undefined,namestr,prop,datsub,true);
                        }else{
                            console.log(rec_object+' container not found!');
                        }
                    }
                });
                
                $(el_form).on("click",".js_rec_before",function(){
                    if(!$(this).hasClass('js_disabled')){
                        if(getfromArray(settings.masterdata,'auto_save',0)){
                            saveRecord(false);
                        }
                        var el_rec_container;
                        var container_position=typeof this.dataset.container_position=="undefined" ? 0 : this.dataset.container_position;
                        var rec_object=typeof this.dataset.rec_object=="undefined" ? "" : this.dataset.rec_object;
                        
                        if(container_position==0){
                            el_rec_container=$(this).parents('.js_rec_container')[0];
                        }else{
                            if(container_position<0){
                                el_rec_container=$(this).prev('.js_rec_container[data-rec_object="'+rec_object+'"]')[0];
                            }else{
                                el_rec_container=$(this).next('.js_rec_container[data-rec_object="'+rec_object+'"]')[0];
                            }
                        }
                        if(el_rec_container){
                            el_rec_record=$(this).parents('.js_rec_record')[0];
                            var before_rec_index=el_rec_record.dataset.rec_index;
                            if(getfromArray(settings.masterdata,"add_empty_rec",false))addhtmlrecord(el_rec_container,before_rec_index);
                        }else{
                            console.log(rec_object+' container not found!');
                        }
                    }
                });
                
                $(el_form).on("click",".js_rec_delete",function(e){
                    if(!$(this).hasClass('js_disabled')){
                        if(confirm(getl('Delete')+'?')){
                            var el_rec_container=$(this).parents('.js_rec_container')[0];
                            $(this).parents('.js_rec_record')[0].remove();
                            setDirty(true);
                            if(settings.masterdata.ondelete){
                                settings.masterdata.ondelete(el_md,el_rec_container);
                            }
                        }
                    }
                });
                
                if(bwithdirty){
                  $(el_form).on("input","textarea",function(e){
                    el_dirty.src=path+"masterdata/pic/icon_dirty.png";
                  });
                }
                $(el_form).on("change","input,textarea,select",function(e){
                    var name=getSubName('name',this.name);
                    var namestr=getSubName('namestr',this.name);
                    if(this.type=="checkbox"){
                      // no format
                    }else{
                      gFormatinputfordisplay(this,this.value);
                    }
                    if(bwithdirty)el_dirty.src=path+"masterdata/pic/icon_dirty.png";
                    
                    // datalist
                    /*
                    if(k8form.datalists){
                      if(k8form.datalists[name]){
                        var datalist=k8form.datalists[name];
                    */
                    if(settings.k8form.datalists){
                      if(settings.k8form.datalists[name]){
                        var datalist=settings.k8form.datalists[name];
                        var index_datalist=getArrayIndexfromValue(datalist.data,datalist.datalistcolumn,this.value);
                        var dat_datalist={};
                        if(index_datalist!==-1){
                          if(datalist.el_key)datalist.el_key.value=datalist.data[index_datalist][datalist.key];
                          dat_datalist=datalist.data[index_datalist];
                        }else{
                          if(datalist.el_key)datalist.el_key.value=0;
                          if(datalist.onlyoptions)datalist.el_datalistfield.value='';
                        }

                        var el_inputgroup=$(this).parents('.input-group')[0];
                        if(!el_inputgroup)el_inputgroup=this;
                        if(el_inputgroup.dataset.fieldlist){
                          var fields=el_inputgroup.dataset.fieldlist.split(',');
                          var o={};
                          for(var i=0;i<fields.length;i++){
                            if(fields[i].indexOf('=')>-1){
                                var map=fields[i].split('=');
                                o[map[0]]=getfromArray(dat_datalist,map[1]);
                            }else{
                                o[fields[i]]=getfromArray(dat_datalist,fields[i]);
                            }
                          }
                          obj2form(o,el_form,true);
                        }
                      }
                    }                    
                    if(settings.masterdata.dataChange) {
                        settings.masterdata.dataChange(el_md,this);
                    }
                    let dat={};
                    if(getfromArray(settings.masterdata,'object_mode',0)==1){
                        //o=DeleteEmptyStructure($(el_form).serializeJSON());
                        var $disabledFields = $(el_form).find('[disabled]');
                        $disabledFields.prop('disabled', false);
                        dat=$(el_form).serializeJSON({checkboxUncheckedValue: "0"});
                        $disabledFields.prop('disabled', true);
                        DeleteEmptyStructure(o);
                    }else{
                      dat=form2obj(el_form);
                    }
                    cb(settings,'cbChange',{"settings":settings,"el_md":el_md,"el_form":el_form,"el":this,"namestr":namestr,"name":name,"dat":dat,"this":this});
                });
            }

            if(settings.masterdata.upload.enabled && !settings.masterdata.upload.singleimage){
              if(!isset(settings.masterdata.upload,'settings'))settings.masterdata.upload.settings={};
              settings.masterdata.upload.settings.selector=getfromArray(settings.masterdata.upload.settings,"selector",".pic_ph");
              let el_imagecontainer=el_md.querySelector(settings.masterdata.upload.settings.selector);
              if(!el_imagecontainer){
                $(el_md).find('.maindata').append('<div class="'+settings.masterdata.upload.settings.selector.substr(1)+'"></div>');
              }
            }
        
            if(settings.masterdata.dataCreateStructure) {
                settings.masterdata.dataCreateStructure(el_md,o,settings);
            }
            cb(settings,'cbCreateStructure',{"settings":settings,"el_md":el_md,"el_form":el_form,"dat":o,"tableTab":tableTab});
            if(!bnoform){
                if(settings.masterdata.notabulator){
                    // load or init
                    if(settings.data && settings.data.length>0){
                        dat=settings.data[0];
                        display_record(dat);
                    }else if(getfromArray(Array_GET(),'k8datparent',0) && window.opener){
                        dat=window.opener.k8datparent;
                        display_record(dat);
                    }else{
                        var keyvalue=getfromArray(settings.masterdata,'keyvalue',0);
                        if(gbnull(keyvalue)){
                            newRecord(el_md,el_form);
                        }else{
                            dat={};
                            var url=path+settings.masterdata.url_load;
                            dat.keyvalue=keyvalue;
                            $.getJSON(url,dat, function(oJson) {
                                //if(settings.masterdata.fninittimer)settings.masterdata.fninittimer();
                                if(settings.masterdata.pagetimer)settings.masterdata.pagetimer.reset();
                                if(oJson.bok){
                                    dat=oJson.dat;
                                    display_record(dat);
                                }else{
                                    console.log('record.'+settings.key+'='+keyvalue+', load.error='+oJson.error);
                                }
                            })
                            .fail(function(jqxhr, textStatus, error ) {
                                var err = url+", Request Failed, "+ textStatus + ", " + error;
                                console.log(err);
                            });			
                        }
                    }                
                }
            }

            /*
            if(settings.masterdata.bresize){
              tableTab.on("tableBuilt", function(){
                $(el_md).find('.resize-s').resizable({handles:"s",distance:10});
              });
            }
            */
            
            if(!settings.masterdata.notabulator && !settings.masterdata.bnoform){
              if(getfromArray(Array_GET(),"bselect") && table.children.length>0){
                row_actual = table.getRow(1);
                if(!btabselectstandard)$(row_actual.getElement()).addClass("row_selected");
                //if(bwithdirty)el_dirty.src=path+'masterdata/pic/icon_saved.png';
                display_record(row.getData());
              }else{
                //initForm(settings.masterdata.defaultvalues);
                newRecord(el_md,el_form);
              }
            }
        }else{
          console.error('selector found: '+this.length+' times');
        }
         
        /* ----------- functions -----------  */
        function cb(settings,cbfunction,options){
          var ret;
          if(settings.masterdata[cbfunction]) {
            if(Array.isArray(settings.masterdata[cbfunction])){
              for(var i=0;i<settings.masterdata[cbfunction].length;i++){
                ret=settings.masterdata[cbfunction][i](options);
              }
            }else{
              ret=settings.masterdata[cbfunction](options);
            }
          }
          return ret;
        }
        
        function newRecordExt(dat){
          row_actual=0;	// delete tabulator record pointer 
          $(table).find(".row_selected").removeClass("row_selected");
          initForm(dat);
        }
        
        function newRecord(el_md,el_form){
            dat=settings.masterdata.defaultvalues;
            if(settings.masterdata.dataNewbefore) {
                settings.masterdata.dataNewbefore({"dat":dat});
            }
            cb(settings,'cbBeforeNew',{"settings":settings,"el_md":el_md,"el_form":el_form,"dat":dat,setDirty:setDirty});
            if(settings.keys){
              for(var i=0;i<settings.keys.length;i++){
                let name=settings.keys[i];
                let el=el_form.elements.namedItem(name);
                if(el)el.disabled=false;
              }
            }
            initForm(dat);
            if(settings.masterdata.dataNew) {
                settings.masterdata.dataNew(el_md,dat);
            }
            cb(settings,'cbAfterNew',{"settings":settings,"el_md":el_md,"el_form":el_form,"dat":dat,setDirty:setDirty});
            if(settings.masterdata.focusnew) $(el_form).find('input:not([type=hidden]):enabled,select:enabled,textarea:enabled').eq(0).focus();
        }
        
        function executeControl(keyvalue){
            settings.masterdata.window_mode=settings.masterdata.edittype;
            switch(settings.masterdata.edittype){
                case 0: // nothing
                    break;
                case 2: // innerhtml 
                case 3: // opverlay
                    // masterdata
                    let new_settings={};
                    let searchparams=new URLSearchParams(settings.masterdata.url_edit); 
                    let datadefID_edit=searchparams.get('datadefID');
                    if(datadefID_edit==settings.datadefID){
                      //new_settings=JSON.parse(JSON.stringify(settings));
                      new_settings=settings;
                    }else{
                      new_settings=window['settings'+datadefID_edit];
                      if(new_settings){
                        new_settings.masterdata.edittype=settings.masterdata.edittype;
                        new_settings.masterdata.window_mode=settings.masterdata.edittype;
                        new_settings.masterdata.edit_selector=settings.masterdata.edit_selector;
                        new_settings.masterdata.form_selector=settings.masterdata.form_selector;
                      }
                    }
                    if(new_settings){
                      new_settings.masterdata.notabulator=true;
                      new_settings.masterdata.bnoform=false;
                      new_settings.masterdata.htag="h2";
                      new_settings.name=getl('New / Edit');
                      createOverlay(el_md,new_settings,keyvalue);
                    }else{
                      console.error('settings not defined');
                    }
                    break;
                case 4: // new tab
                    if(settings.masterdata.url_edit){
                        var url=path+settings.masterdata.url_edit+'&returnflag=2&returnopener=1&sourcedatadefalias='+getfromArray(settings,'datadefalias')+'&sourcedatadefID='+getfromArray(settings,'datadefID')+'&sourceelement='+settings.sourceelement+'&keyvalue='+keyvalue;
                        //console.log('executeControl.url='+url);
                        var w=window.open(url,"Edit");
                        w.focus();
                    }else{
                        alert('please set url_edit!');
                    }
                    break;
                case 5: // new window
                    if(settings.masterdata.url_edit){
                        var url=path+settings.masterdata.url_edit+'&returnflag=2&returnopener=1&sourcedatadefalias='+getfromArray(settings,'datadefalias')+'&sourcedatadefID='+settings.datadefID+'&sourceelement='+settings.sourceelement+'&keyvalue='+keyvalue;
                        //console.log('executeControl.url='+url);
                        var parameter="width="+window.innerWidth.toString()+",height="+window.innerHeight.toString()+",resizable=yes,scrollbars=yes";
                        parameter="top="+(window.screenY).toString()+",left="+(window.screenX).toString()+","+parameter;
                        var w = window.open(url,'Edit', parameter);
                        w.focus();
                    }
                    break;
                //case 6: // own line, same template
                //case 7: // own line, plugin
                case 8: // like jsonform
                    break;
                case 9: // link in this window
                    url=path+settings.masterdata.url_edit+'&keyvalue='+keyvalue+'&returnflag=2';
                    window.location.href=url;
                    break;
                default:
                    console.log('edittype='+settings.masterdata.edittype+' not supported!');
            }
        }

        function createFormOverlay(el_list,settings,keyvalue){
          //overlay
          var width=Math.round(window.innerWidth*0.9);
          if(width>1170)width=1170;
          var html='<div id="k8-overlay">' +
                      '<div style="width: '+width+'px">' +
                          '<div style="text-align: right; padding-right: 6px"><a style="cursor:pointer;" id="btnOverlay">&times;</a></div>'+
                          '<div style="padding: 0 20px 20px 20px" id="overlay_content">'+
                              '<div class="masterdata">' +
                          '</div>'+
                      '</div>'+
                  '</div>';
          $(el_list).append(html);
          var el_md=document.getElementById('k8-overlay');
          $(el_md).find('#btnOverlay').on('click',function(e){
              e.preventDefault();
              $("#k8-overlay").remove();
          });
          selector='#k8-overlay .masterdata';
          //formular erstellen
          if(settings.masterdata.formmode==3){
              var k8form=Object.create(k8);
              settings.k8form.selector=selector;
              k8form.createform(settings.k8form);
          }else if(isset(settings,"html","masterdata","main") ){
              $(selector).append(settings.html.masterdata.main);
          }else{
              console.log("formmode not correctly");
          }
          //events bearbeiten
        }
          
        function createOverlay(el_list,settings,keyvalue){
            // window_mode 2:overlay, 3:innerHTML, 7 not supported
            //keyvalue==0 ->New
            var selector='';
            var selmain='*';
            //if(settings.masterdata.window_mode==2){
            if(settings.masterdata.edittype==2){
                //innerhtml
                selector=getfromArray(settings.masterdata,'form_selector',getfromArray(settings.masterdata,'edit_selector','#edit'));
            }else if(settings.masterdata.edittype==3){
                //overlay
                var width=Math.round(window.innerWidth*0.9);
                var height=Math.round(window.innerHeight*0.9);
                if(width>1170)width=1170;
                var html='<div id="k8-overlay">' +
                            '<div style="width: '+width+'px;max-height: '+height+'px;overflow-y:auto">' +
                                '<div style="text-align: right; padding-right: 6px"><a style="cursor:pointer;" id="btnOverlay">&times;</a></div>'+
                                '<div style="padding: 0 20px 20px 20px" id="overlay_content">'+
                                    '<div class="masterdata">' +
                                '</div>'+
                            '</div>'+
                        '</div>';
                $(el_list).append(html);
                var el_md=document.getElementById('k8-overlay');
                $(el_md).find('#btnOverlay').on('click',function(e){
                    e.preventDefault();
                    $("#k8-overlay").remove();
                });
                selector='.masterdata';
                selmain=el_md;
            //}else if(settings.masterdata.window_mode==3){
            }else{
                //console.log(settings.masterdata.window_mode+' not valid!');
                console.log(settings.masterdata.edittype+' not valid!');
                return
            }
            // element, data, keyvalue, filters, clause
            var element='masterdata'; //!!!
            switch(element){
                case 'masterdata':
                    settings.masterdata.notabulator=true;
                    settings.masterdata.bnoform=false;
                    settings.return={'origin':'tabulator'};
                    if(gbnull(keyvalue)){
                        settings.masterdata.keyvalue=0;
                        settings.return.tableTab=tableTab;
                    }else{
                        settings.masterdata.keyvalue=keyvalue;
                        settings.return.row=row_actual;
                    }
                    let el_selmain=$(selmain).find(selector)[0];
                    let el_masterdata=$(el_selmain).masterdata(settings);
                    //$(el_selmain).slideDown("slow");

                    /* 
                    //Daten laden
                    var k8form=Object.create(k8);
                    var myID="";
                    settings.k8form.selector="#k8-overlay .masterdata";
                    k8form.createform(settings.k8form);
                    // Daten speichern, zurückgeben und Tabulator aktualisieren
                    */
                    break;
                case 'catalog':
                    //htmlout
                    $(el_md).find(selector).catalog(settings);
                    break;
                default:
                    console.log('element='+element+' not valid!');
            }
        }

        function cancel(){
            if(settings.masterdata.btnCancel){
                settings.masterdata.btnCancel(el_md,{},settings.return);
                return;
            }
            if(settings.masterdata.cbbtnCancel){
                //settings.masterdata.cbbtnCancel({"el_md":el_md,"return":settings.return});
                cb(settings,'cbbtnCancel',{"settings":settings,"el_md":el_md,"return":settings.return});
                return;
            }
            if(settings.masterdata.dataCancel){
                settings.masterdata.dataCancel(el_md,{});
            }
            /*
            if(settings.masterdata.cbCancel){
                settings.masterdata.cbCancel({"settings":settings,"el_md":el_md});
            }
            */
            cb(settings,'cbCancel',{"settings":settings,"el_md":el_md});

            if(returnflag){
                if(returnopener==1 && window.opener){ // window_mode 4 / 5
                    //close edit tab and 
                    window.close();
                    window.opener.focus();
                }else{            // window_mode 1
                    window.history.back();
                }
            }
            switch(settings.masterdata.window_mode){
            case 0:
              if(settings.masterdata.notabulator){
                if(typeof datform!=='undefined'){
                  display_record(dat_form);
                }else{
                  display_record(dat);
                }
               }else{
                if(row_actual){
                    // new rowclick
                    dat=row_actual.getData();
                    if(!bnoform){
                        if(bwithdirty)el_dirty.src=path+'masterdata/pic/icon_saved.png';
                        //display_record(row.getData());
                        display_record(dat);
                    }else if(settings.masterdata.dataLoad) {
                        settings.masterdata.dataLoad(el_md,dat,settings);
                    }else if(settings.masterdata.cbBeforeLoad) {
                      cb(settings,'cbBeforeLoad',{"settings":settings,"el_md":el_md,"dat":dat});
                    }
                }else{
                    //initForm(settings.masterdata.defaultvalues);
                    newRecord(el_md,el_form);
                  }
                }
                break;
            case 1: // catalog current record
                var el_rec_lfd=$(el_md).parents('.js_rec_record')[0];
                var keyvalue=el_rec_lfd.getAttribute('data-keyvalue');
                if(gbnull(keyvalue)){
                  // erase the record
                  $(el_rec_lfd).remove();
                }else{
                  // display old record
                  //$(el_rec_lfd).replaceWith(settings.return.js_rec_record);
                  el_rec_lfd.innerHTML=settings.return.recordhtml;
                }
                settings.return.controlDisabled(false);
                break;
            case 2: // innerhtml
                var myselector=settings.masterdata.form_selector;
                if(getfromArray(settings.return,'origin','catalog')=='catalog'){
                  myselector=settings.masterdata.edit_selector;
                }
                if(settings.return.inittemplate){
                    $(myselector).html(settings.return.inittemplate);
                }else if(myselector==".js_rec_record_current"){
                    // Catalog
                    if(settings.return.replaceRecord) {
                        settings.return.replaceRecord(o,settings.return.selector);
                    }else if(settings.return.insertRecord){
                        settings.return.insertRecord(o,'','first');
                    }
                }else{
                    $(myselector).empty();
                }
                if(settings.return.controlDisabled)settings.return.controlDisabled(false);
                break;
            case 3: // overlay
                $('#k8-overlay').remove();
                if(settings.return.controlDisabled)settings.return.controlDisabled(false);
                break;
            case 7: // in line
            case 8: // like masterdata json
                if(settings.return.replaceRecord) {
                    settings.return.replaceRecord(o,settings.return.selector);
                }
                // delete line by new
                break;
            case 9: // history back
                window.history.back();
            }
        }

        function saveRecord(binit){
            binit=typeof binit!=='undefined' ? binit:true; 
            binit=false
            o={};
            if(settings.masterdata.edittype==-1)settings.masterdata.window_mode=settings.masterdata.edittype;

            if(settings.masterdata.dataPrepareSave) {
                settings.masterdata.dataPrepareSave(el_md);
            }
            cb(settings,'cbPrepareSave',{"settings":settings,"el_md":el_md,"el_form":el_form});

            //if(true){
            if(getfromArray(settings.masterdata,'object_mode',0)==1){
                //o=DeleteEmptyStructure($(el_form).serializeJSON());
                var $disabledFields = $(el_form).find('[disabled]');
                $disabledFields.prop('disabled', false);
                o=$(el_form).serializeJSON({checkboxUncheckedValue: "0"});
                o=encode_obj(o);
                console.log(o);
                $disabledFields.prop('disabled', true);
                DeleteEmptyStructure(o);
            }else{
              o=form2obj(el_form);
            }
            
            if(settings.masterdata.btnSave){
                settings.masterdata.btnSave(el_md,o,settings.return);
                return;
            }
            
            var bnew=gbnull(getfromArray(o,settings.key));
            var cancel=false;
            if(settings.masterdata.dataBeforeSave) {
              cancel=settings.masterdata.dataBeforeSave(el_md,o);
            }
            cancel=cb(settings,'cbBeforeSave',{"settings":settings,"el_md":el_md,"el_form":el_form,"dat":o});
            if(!cancel){
                //$.getJSON(settings.masterdata.url_save,o, function(oJson) {
                $.ajax({url:path+settings.masterdata.url_save,
                  data:o,
                  type:"POST",
                  success:function(ret){
                    //if(settings.masterdata.fninittimer)settings.masterdata.fninittimer();
                    if(settings.masterdata.pagetimer)settings.masterdata.pagetimer.reset();
                    $(el_form).find('input[type="submit"],button[type="submit"]').attr("disabled",false);
                    var oJson = JSON.parse(ret);
                    if(oJson.bok){
                        var changed2edit=false;
                        var mymode=(getfromArray(GET,'k8transform',0) || (returnflag && settings.masterdata.upload.enabled) || (settings.masterdata.window_mode!=0 && settings.masterdata.window_mode!=8 && settings.masterdata.upload.enabled)); // new, stay after save
                        if(mymode){
                            if(gbnull(el_form.elements.namedItem(settings.key).value)){
                              alert(getl("to return: save again!"))
                              changed2edit=true;
                            };
                        }
                        if(!notabulator && binit){
                            //initForm(settings.masterdata.defaultvalues);
                            newRecord(el_md,el_form);
                        }else{
                            if(settings.masterdata.window_mode!==-1){
                              el_form.elements.namedItem(settings.key).value=oJson.bok;
                            }
                        }
                        message("Saved","saved");
                        if(bwithdirty)el_dirty.src=path+"masterdata/pic/icon_saved.png";

                        if(settings.masterdata.dataAfterSave) {
                            settings.masterdata.dataAfterSave(el_md,o,bnew);
                        }
                        console.log(oJson.dat);
                        cb(settings,'cbAfterSave',{settings,settings,"this":othis,"el_md":el_md,"el_form":el_form,"dat":oJson.dat,"bnew":bnew})
                        if(!notabulator || returnflag || settings.return){
                            // load object because of rights new and add new record to tabulator
                            //o[keyfield]=oJson.bok;
                            //$.getJSON(path+settings.masterdata.url_load,{'keyvalue':o[keyfield]}, function(oJson) {
                                //if(oJson.bok){
                                    o=oJson.dat;
                                    if(changed2edit){
                                        
                                        if(settings.masterdata.upload.enabled && !bnoform){
                                            ProcessImage(o[settings.key],o['rightuser_update'],o);
                                        }
                                    }else{
                                        if(returnflag){
                                            if(returnopener==1 && window.opener){
                                                //close edit tab and 
                                                window.close();
                                                window.opener.focus();
                                                window.opener.InsertRecord(o,returnflag,{"sourceelement":settings.sourceelement,"datadefalias":getfromArray(settings,'sourcedatadefalias'),"datadefID":settings.sourcedatadefID});
                                            }else{
                                                sessionStorage.setItem('keyvalue',o[keyfield]);
                                                window.history.back();
                                            }
                                        }
                                        switch(settings.masterdata.window_mode){
                                          // 0 look to 8
                                          case 1: // catalog in line
                                            var reload=getfromArray(settings.masterdata,'editreload',false);
                                            if(reload){
                                              location.reload();
                                            }else if(settings.return.replaceRecord) {
                                                settings.return.replaceRecord(o,settings.return.selector);
                                            }else{
                                                console.log('settings.return.replaceRecord not set')
                                            }
                                            break;
                                          case 2:
                                            // innerhtml
                                            if(getfromArray(settings.return,'origin','catalog')=='catalog'){
                                                var reload=getfromArray(settings.masterdata,'editreload',false);
                                                if(reload){
                                                  location.reload();
                                                }else{
                                                  if(settings.masterdata.edit_selector){
                                                      if(settings.return.inittemplate){
                                                          $(settings.masterdata.edit_selector).html(settings.return.inittemplate);
                                                      }else if(settings.masterdata.edit_selector==".js_rec_record_current"){
                                                        // nothing
                                                      }else{
                                                        var el=$(settings.masterdata.edit_selector)[0];
                                                        if(el)$(el).empty();
                                                      }
                                                  }
                                                  if(settings.return.replaceRecord) {
                                                      settings.return.replaceRecord(o,settings.return.selector);
                                                  }else if(settings.return.insertRecord){
                                                      settings.return.insertRecord(o,'','first');
                                                  }
                                                }
                                            }else{
                                                if(settings.masterdata.form_selector){
                                                    if(settings.return.inittemplate){
                                                        $(settings.masterdata.form_selector).html(settings.return.inittemplate);
                                                    }else if(settings.masterdata.form_selector==".js_rec_record_current"){
                                                      // nothing
                                                    }else{
                                                      var el=$(settings.masterdata.form_selector)[0];
                                                      if(el)$(el).empty();
                                                    }
                                                }
                                                if(isset(settings,'return','row')){
                                                  settings.return.row.update(o);
                                                }else{
                                                  settings.return.tableTab.addRow(o, true);
                                                }
                                            }
                                            break;
                                        case 3:
                                            // overlay
                                            $('#k8-overlay').remove();
                                            if(getfromArray(settings.return,'origin','catalog')=='catalog'){
                                                if(settings.return.replaceRecord) {
                                                    settings.return.replaceRecord(o,settings.return.selector);
                                                }else if(settings.return.insertRecord){
                                                    settings.return.insertRecord(o,'','first');
                                                }else{
                                                    console.log('after Save: return.replaceRecord and return.insertRecord not set!')
                                                }
                                                if(settings.return.controlDisabled)settings.return.controlDisabled(false);
                                            }else{
                                                if(isset(settings,'return','row')){
                                                    settings.return.row.update(o);
                                                    
                                                }else if(isset(settings,'return','tableTab')){
                                                    settings.return.tableTab.addRow(o, true);
                                                }else{
                                                    console.log('after Save: return.row and return.tableTab not set!')
                                                }
                                            }
                                            break;
                                        /*case 4:
                                            // new tab
                                        case 5:
                                            // new popup window
                                            if(window.opener && binit){
                                                //close edit tab and 
                                                window.close();
                                                window.opener.focus();
                                                window.opener.InsertRecord(o,returnflag)
                                            }
                                            break;
                                        */
                                        case 6: 
                                            // lineedit, look catalog
                                            break;
                                        case 7: catalog
                                            break;
                                        case 0:
                                        case 8:
                                            if(typeof(row_actual)==='object'){
                                                if(!notabulator){
                                                    row_actual.update(o);
                                                    if(row_actual)row_actual.reformat();
                                                    display_record(o);
                                                }
                                            }else if(!notabulator){
                                                tableTab.addRow(o, true)
                                                .then(function(row){
                                                    row_actual=row;
                                                    display_record(o);
                                                    if(!btabselectstandard){
                                                      $(table).find(".row_selected").removeClass("row_selected");
                                                      $(row.getElement()).addClass("row_selected");
                                                    }
                                                });
                                            }else if(!bnoform){
                                                obj2form(o,el_form);
                                            }
                                            break;
                                        case 9:
                                            window.history.back();
                                            break;
                                        }
                                    }
                                //}
                                if(binit)row_actual=0;				
                            //});
                        }
                    }else{
                        message(oJson.error,'alert');
                    }
                }
              })
              .fail(function(jqxhr, textStatus, error ) {
                  var err = textStatus + ", " + error;
                  //console.log( "Request Failed: " + err );
                  //message(err,'alert',10000);
                  $(el_form).find('input[type="submit"],button[type="submit"]').attr("disabled",false);
                  k8form.message("probably you are offline","alert");
                  if(GLOBALS_serviceworker){
                    if(settings.masterdata.cbConnectionfail){
                      settings.masterdata.cbConnectionfail({saveRecord:saveRecord});
                    }
                  }
              });			
          }else{
              $(el_form).find('input[type="submit"],button[type="submit"]').attr("disabled",false);
          }
        }

        function display_record(dat){
            if(settings.rightcheck!=0){
                //var readonly=!Number(getfromArray(dat,'rightuser_update',true));
                var disabled=!Number(getfromArray(dat,'rightuser_update',false));
                if(!disabled) disableForm(disabled);
            }
            $(el_form).find('.js_hint').hide();
            if(settings.masterdata.dataLoad) {
                settings.masterdata.dataLoad(el_md,dat,settings);
            }
            cb(settings,'cbBeforeLoad',{"settings":settings,"el_md":el_md,"el_form":el_form,"dat":dat,setDirty:setDirty})
            if(getfromArray(settings.masterdata,'object_mode',0)==1){
               // js_rec_records leeren entfernen
               $(el_form).find('.js_rec_records').empty();
               //$('.js_rec_container').data('rec_indexmax',"-1");
                var container=el_form.querySelectorAll('.js_rec_container');
                for(var i=0;i<container.length;i++){
                    container[i].dataset.rec_indexmax="-1";
                }

                gObject2FormBuild(el_form,0,dat);
                if(settings.masterdata.newContainer){
                    var containers=$(el_form).find('.js_rec_container')
                    for(var i=0;i<containers.length;i++) {
                        settings.masterdata.newContainer(containers[i]);
                    }
                }
                conditional_output(el_form);
            }else{
                obj2form(dat,el_form)
            }
            if(settings.keys){
              for(var i=0;i<settings.keys.length;i++){
                let name=settings.keys[i];
                let el=el_form.elements.namedItem(name);
                if(el)el.disabled=true;
              }
            }
            if(settings.rightcheck!=0){
                //var readonly=!Number(getfromArray(dat,'rightuser_update',true));
                var disabled=!Number(getfromArray(dat,'rightuser_update',true));
                if(disabled){
                    //console.log("form disabled");
                    disableForm(disabled);
                }else{
                    //console.log("form not disabled");
                }
            }
            cb(settings,'cbAfterLoad',{"settings":settings,"el_md":el_md,"el_form":el_form,"dat":dat,setDirty:setDirty})

            /* -----------  add upload ------------- */
            if(settings.masterdata.upload.enabled && !bnoform){
                //var img_settings={"js_rec_container":{main:'<div class="k8-images">   <div class="js_rec_container rec_container k8-padding-6" data-rec_object="k8references" data-rec_indexmax="-1">     <div style="display: flex;">       <div>         <h3>Images</h3>       </div>       <div style="flex: 1 1 30%;text-align: right; padding-top: 10px;">         <button type="button" class="btn btn-primary js_DeleteSelected">Delete</button>       </div>     </div>         <div id="picutes">       <form action="masterdata/ProcessData.php?process_action=Save&datadefID=8" name="dropzone" class="dropzone k8-margin-bottom-normal">         <input type="hidden" name="basetype" value="">         <input type="hidden" name="baseID" value="">         <input type="hidden" name="type" value="image">       </form>     </div>          <div class="row js_rec_records">      </div>   </div> </div>'}};
                //img_settings.js_rec_noinput={main:'<div class="k8-images"><div class="js_rec_container rec_container k8-padding-6" data-rec_object="k8references" data-rec_indexmax="-1">     <div style="display: flex;"><div><h3>Images</h3></div>       <div style="flex: 1 1 30%;text-align: right; padding-top: 10px;"></div>     </div>         <div id="picutes">       After saving the record, you can add images here.</div><div class="row js_rec_records"></div>   </div> </div>'};
                //img_settings.js_rec_record={main:'<div class="js_rec_record col-sm-4" data-rec_index="index_main"  style="position: relative">   <div class="k8-checkbox"><input type="checkbox" class="js_selected"></div>   <div class="k8-box-square k8-margin-bottom-normal">       <div class="k8-box-content">         <img class="k8-image-[image_orientation]" src="[image_file]">       </div>   </div> </div>'};
                //img_settings.masterdata={url_del:'masterdata/ProcessData.php?process_action=Del&datadefID=8'};
                //img_settings['masterdata']["url_readfilter"]='masterdata/ProcessData.php?datadefID=8&process_action=ReadFilter';
                //img_settings.masterdata.data_readfilter={};
                //img_settings['key']='ID'

                ProcessImage(dat[settings.key],dat['rightuser_update'],dat);
            }
            if(settings.masterdata.focusnew) $(el_form).find('input:not([type=hidden]):enabled,select:enabled,textarea:enabled').eq(0).focus();

        }

        function ProcessImage(baseID,rightuser_update,dat){
            dat=typeof dat!=='undefined' ? dat:[];

            
            img_settings.baseID=baseID;
            img_settings.dat=dat;
            //img_settings.data=dat['image_array'];
            img_settings.data=dat['imagearray'];
            img_settings.row=row_actual;
            img_settings.loaddata=true;
            img_settings.parent_rightuser_update=Number(rightuser_update);
            
            var el_picture=k8.displayImage(img_settings);
            /*
            var image_count=0;
            if(dat.image_array){
                image_count=dat.image_array.length;
            }

            var basetype=settings.table;
            var clause="basetype='"+basetype+"' and baseID="+baseID+" and type='image'";

            //'masterdata/ProcessData.php?process_action=Save&datadefID=8
            if(settings.masterdata.upload.singleimage){
                //uplaod_1_dropzone
                var html_db='';
                html_db=html_db+'  <div id="pictures">';
                html_db=html_db+'    <form action="'+path+settings.masterdata.url_save+'" class="dropzone">';
                html_db=html_db+'      <input type="hidden" name="basetype" value="'+basetype+'">';
                html_db=html_db+'      <input type="hidden" name="baseID" value="'+baseID+'">';
                html_db=html_db+'      <input type="hidden" name="type" value="image">';
                html_db=html_db+'    </form>';
                html_db=html_db+'  </div>';
                if(baseID==0){
                    // upload_1_blank
                    var html='<div style="height: 140px; border: 1px solid #bbb">'+
                            '<p class="text-center" style="padding: 10px; position: relative; top: 40px">please register first and upload a picture later</p>'+
                            '</div>';
                    $(el_md).find('.pic_ph').html(html);
                }else if(image_count==0){
                    // dropzone
                    $(el_md).find('.pic_ph').html(html_db);
                    $(el_md).find(".dropzone").dropzone({
                        init: function() {
                            var $this = this;
                            $("button#clear-dropzone").click(function() {
                                $this.removeAllFiles(true);
                            });
                        },
                        paramName: "file",
                        maxFilesize: 5,
                        maxFiles : 5,
                        autoProcessQueue : true
                    });
                }else{
                    // display image
                    var html='<div class="js_rec_container" data-rec_object="k8references" data-rec_indexmax="-1">'+
                      '<div class="js_rec_record" data-keyvalue="[image_ID]"  style="position: relative">'+
                        '<div class="k8-checkbox"><input type="checkbox" class="js_img_delete"></div>'+
                          '<div class="k8-box-square k8-margin-bottom-normal">'+
                            '<div class="k8-box-content">'+
                              '<img class="k8-image-[image_orientation]" src="[image_file]">'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                      '</div>';
                    var html=ReplacePlaceholder(html,dat);
                    $(el_md).find('.pic_ph').html(html);

                    // ----------- delete
                    $(el_md).on("click",".js_img_delete",function(){
                        if(!$(this).hasClass('js_disabled')){
                            if(confirm('delete?')){
                                var el_rec_record=$(this).parents('.js_rec_record')[0];
                                var index=el_rec_record.dataset.rec_index;
                                var keyvalue=el_rec_record.dataset.keyvalue;
                                var o={}
                                o['ID']=keyvalue;
                                $.getJSON('masterdata/ProcessData.php?datadefID=8&process_action=Del',o, function(oJson) {
                                    if(oJson.bok){
                                      $(el_md).find('.pic_ph').html(html_db);
                                      $(".dropzone").dropzone({
                                          init: function() {
                                              var $this = this;
                                              $("button#clear-dropzone").click(function() {
                                                  $this.removeAllFiles(true);
                                              });
                                          },
                                          paramName: "file",
                                          maxFilesize: 5,
                                          maxFiles : 5,
                                          autoProcessQueue : true
                                      });
                                        // put in dropbox
                                    }else{
                                        console.log('error by save: '+oJson.error);
                                    }
                                });
                            }
                        }
                    });
                }
            }else{

                if($(el_md).find('.k8-images').length>0){
                    $(el_md).find('.k8-images')[0].remove();
                }
                if(gbnull(baseID)){
                    $(el_md).find('.maindata').append(img_settings['js_rec_noinput']['main']);
                }else{
                    if(!rightuser_update && image_count==0){
                        // no upload and no picture to display
                    }else{
                        if($(el_md).find('.k8-images').length==0){
                            $(el_md).find('.maindata').append(img_settings['js_rec_container']['main']);
                            $(el_md).find(".dropzone").dropzone({
                                init: function() {
                                    var $this = this;
                                    $("button#clear-dropzone").click(function() {
                                        $this.removeAllFiles(true);
                                    });
                                },
                                paramName: "file",
                                maxFilesize: 5,
                                maxFiles : 5,
                                autoProcessQueue : true
                            });
                        }
                        displayImageArea('#resultarea',img_settings,basetype,baseID,clause,rightuser_update);
                    }
                }
            }
            */
        }

        /*
        function displayImageArea(selector,settings,basetype,baseID,clause,rightuser_update){
            //filter
            //loadJson
            //Schleife

            var data=[];
            var el_image=$(el_md).find('.k8-images')[0];
            var el_rec_container=$(el_image).find('.js_rec_container')[0];
            var el_records=$(el_image).find('.js_rec_records')[0];

            // ----------------- dropzone
            var el_dropzone_form=$(el_image).find('.dropzone')[0];
            if(rightuser_update){
              //el_dropzone_form..setAttribute("action", url_save)
              el_dropzone_form.elements.namedItem('basetype').value=basetype;
              el_dropzone_form.elements.namedItem('baseID').value=baseID;
            }else{
              $(el_dropzone_form).hide();
            }

            // ----------------- delete button
            var el_btndelete=$(el_rec_container).find('.js_DeleteSelected');
            if(rightuser_update){
                $(el_btndelete).on('click',function(){
                  var el_checked=$(el_rec_container).find('input:checked');
                  for(var n=0;n<el_checked.length;n++){
                    var el_record=$(el_checked[n]).parents('.js_rec_record')[0];
                    var o={};
                    o['ID']=el_record.dataset.keyvalue;
                    $.getJSON(path+settings.masterdata.url_del,o, function(oJson) {
                        //if(settings.masterdata.fninittimer)settings.masterdata.fninittimer();
                        if(settings.masterdata.pagetimer)settings.masterdata.pagetimer.reset();
                        if(oJson.bok){
                            var el_record=$(el_rec_container).find('.js_rec_record[data-keyvalue="'+oJson.bok+'"]')[0];
                            el_record.remove();
                        }else{
                            console.log('error by delete: '+oJson.error);
                        }
                    });
                  }
                });
            }else{
                $(el_btndelete).prop("disabled", true);
            }

            // ----------------------- load data
            var url=path+settings['masterdata']["url_readfilter"]+'&clause='+clause;
            $.getJSON(url,function(oJson) {
                //if(settings.masterdata.fninittimer)settings.masterdata.fninittimer();
                if(settings.masterdata.pagetimer)settings.masterdata.pagetimer.reset();
                data=oJson;
                for(var i=0;i<oJson.length;i++){
                    //var line=ReplacePlaceholder(settings['js_rec_record']['main'],{"index_ARRAY_NAME":i},false);
                    var line=ReplacePlaceholder(settings['js_rec_record']['main'],oJson[i],settings.masterdata.placeholder_mode,path);
                    //placeholder

                    var el_line=$(el_records).append(line);
                    var el_rec_record=$(el_records).children().last()[0];

                    el_rec_record.dataset['keyvalue']=oJson[i][settings['key']];
                    el_rec_record.dataset['rec_index']=i;

                }
                el_rec_container.dataset.rec_indexmax=i;

                // disable checkbox
                if(!rightuser_update){
                    $(el_rec_container).find(':checkbox').hide();
                }
                if(sessionStorage.getItem("keyvalue")){
                    console.log('keyvaule='+sessionStorage.getItem("keyvalue"));
                }
            })
            .fail(function(jqxhr, textStatus, error ) {
                var err = textStatus + ", " + error;
                console.log( "Request Failed: " + err );
            });
        }
        */

        function disableFormControls(disabled){
            if(disabled){
                $(el_form).find('.js_rec_new, .js_rec_delete, .js_rec_control').addClass('js_disabled');
            }else{
                $(el_form).find('.js_rec_new, .js_rec_delete, .js_rec_control').removeClass('js_disabled');
            }
            /*
            if(disabled){
                $(el_form).off("click", ".js_rec_new");
                $(el_form).off("click", ".js_rec_delete");
            }else{
                $(el_form).on("click",".js_rec_new",function(){
                    var el_rec_container=$(this).parents('.js_rec_container')[0];
                    addhtmlrecord(el_rec_container);
                });
                $(el_form).on("click",".js_rec_delete",function(){
                    if(confirm('delete?')){
                        $(this).parents('.js_rec_record')[0].remove();
                        // call function
                        if(!gbnull(getfromArray(settings.masterdata.ondelete))){
                            settings.masterdata.ondelete(el_form);
                        }
                    }
                });

            }
            */
        }

        function gObject2FormBuild(form,el_object,obj,namestr){
            namestr=typeof namestr !== 'undefined' ? namestr : '';
            //console.log("namestr=" + namestr);
            if(gbnull(namestr)){
            }
            var el_form;
            if(typeof form=='string'){
                el_form = document.forms[form];
            }else if(typeof form=='object'){
                el_form=form;
            }else{

            }
            if(el_form){
                if(gbnull(obj)){
                }else{
                    var bnewrecord=false;
                    for(var prop in obj){
                        var name='';
                        if(gbnull(namestr)){
                            name=prop;
                        }else if(isNumeric(prop)){
                            name=namestr+'['+prop+']';
                        }else{
                            //name=namestr+prop;
                            name=namestr+'['+prop+']';
                        }

                        if(typeof(obj[prop])=='object' && obj[prop]!==null){
                            var el_objectsub;
                            var object;
                            var bsub=true;
                            if(isNumeric(prop)){
                                object=getobjectfromstr(namestr);
                                if(el_object){
                                    bnewrecord=true;
                                    el_objectsub=addhtmlrecord(el_object,undefined,namestr,prop,obj[prop],true);
                                }else{
                                }
                            }else{
                                // array-name
                                object=prop;
                                if(typeof(el_object)=='object'){
                                    el_objectsub=$(el_object).find("div[data-rec_object='"+object+"']")[0];
                                    //console.log(" -> " + object); 
                                }else{
                                    el_objectsub=$(el_form).find("div[data-rec_object='"+object+"']")[0];
                                    //console.log("form -> " + object); 
                                }
                                if(Object.keys(obj[prop]).length==0){
                                    // empty record
                                    if(getfromArray(settings.masterdata,'add_empty_rec')){                                        
                                        addhtmlrecord(el_objectsub,undefined,namestr,prop,obj[prop]);
                                    }
                                    bsub=false;
                                }
                            }
                            if(bsub)gObject2FormBuild(el_form,el_objectsub,obj[prop],name);
                        }else if(typeof(obj[prop])=='function'){ 
                            
                        }else if (obj.hasOwnProperty(prop)) { 
                            //console.log("prop: " + prop + " = " + obj[prop]);
                            //console.log(name + " -> " + obj[prop]);
                            el=el_form.elements.namedItem(name);
                            if(el!=undefined){
                                if(el.length){
                                    var type=el[el.length-1].type;
                                    /*
                                    if(el.tagName=='SELECT'){
                                        // multiselect
                                        varadd_empty_rec value=obj[prop];
                                        if(gbnull(value)){
                                            $(el).val("");
                                        }else{
                                            $(el).val(obj[prop]);
                                        }
                                    }else if(type=="checkbox"){
                                    */
                                    if(type=="checkbox"){
                                        el=el[el.length-1];
                                        if(Number(obj[prop])){
                                            el.checked=true;
                                        }else{
                                            el.checked=false;
                                        }
                                    }else if(type=="radio"){
                                        $(el_form).find("input[name='"+name+"'][value='"+obj[prop]+"']").prop('checked', true);
                                    }else{
                                        //console.log('fill out form, new type='+type);
                                        $(el).val(obj[prop]);
                                    }
                                }else{
                                    if(el.disabled){
                                        el.disabled=false;
                                        //el.value=obj[prop];
                                        gFormatinputfordisplay(el,obj[prop]);
                                        el.disabled=true;
                                    }else{
                                        //el.value=obj[prop];
                                        //$(el).val(obj[prop]);
                                        gFormatinputfordisplay(el,obj[prop]);
                                    }
                                }
                            }else{
                                //console.log('element: '+name+ " don't exist!"); 
                            }
                        }else{
                            //console.log(name + " no OwnProperty");
                        }
                    }
                    // add empty record
                    // defaultvalues??
                    if(bnewrecord && getfromArray(settings.masterdata,'add_empty_rec')){
                        addhtmlrecord(el_object,undefined,namestr,-1,{});
                    }
                }
            }
        }

        function addhtmlrecord(el_rec_container,before_rec_index,namestr,index,dat_p,bfocus){
            bfocus=typeof bfocus==='undefined'?false:bfocus;

            // el_rec_container, container of the object
            // before_rec_index, pointer for the position, if empty, appended at the end
            // namestr example, areas
            // index: index of the array element
            // dat_p data of the specific array
            // bfocus: true sets the focus to the 1st record
          
            if(!el_rec_container){
              return;
            }
          
            var indexmax=[];
            //var nest=Number(el_rec_container.dataset.rec_nest);
            var object=el_rec_container.dataset.rec_object;
            if(gbnull(object)){
              console.log('rec_object not set!');
              return undefined;
            }
            var index_obj={};
            var bnew=(index==-1);
            
            //indexmax[nest]=Number(el_rec_container.dataset.rec_indexmax);
            //indexmax[nest]++;
            //el_rec_container.dataset.rec_indexmax=indexmax[nest];

            // add record in the actual container
            index_obj['index_'+object]=Number(el_rec_container.dataset.rec_indexmax);
            index_obj['index_'+object]++;
            el_rec_container.dataset.rec_indexmax=index_obj['index_'+object];

            // getting parent record
            var el_rec_record_lfd=$(el_rec_container).parents('.js_rec_record')[0];

            while(el_rec_record_lfd){
                //indexmax[i]=Number(el_rec_record_lfd.dataset.rec_index);
                el_rec_container_lfd=$(el_rec_record_lfd).parents('.js_rec_container')[0];
                if(el_rec_container_lfd){
                    var object_lfd=el_rec_container_lfd.dataset.rec_object;
                    index_obj['index_'+object_lfd]=Number(el_rec_record_lfd.dataset.rec_index);
                    el_rec_record_lfd=$(el_rec_record_lfd).parents('.js_rec_record')[0];
                }
            }

            var line="";
            if(gbnull(settings['js_rec_record'][object])){
                console.log('js_rec_record.'+object+' is empty!');
            }else{
                //line=ReplacePlaceholder(settings['js_rec_record'][object],index_obj,0,path);    //settings.masterdata.placeholder_mode
                line=settings['js_rec_record'][object];
                line=ReplacePlaceholder(line,{},settings.masterdata.placeholder_mode,path);    //replace controls
                line=ReplacePlaceholder(line,index_obj,0,path);    //replace index_items
            }

            var el_records=$(el_rec_container).find('.js_rec_records')[0];
            if(typeof before_rec_index !== 'undefined'){
                el_rec_before=$(el_rec_container).find('.js_rec_record[data-rec_index="'+before_rec_index+'"]')[0];
                if(el_rec_before){
                    $(line).insertBefore(el_rec_before);
                }else{
                    console.log(el_rec_before+' not found!');
                }
            }else if($(el_records).children().length>0){
                $(el_records).children().last().after(line);
            }else{
                $(el_records).append(line);
            }
            
            var el_rec_record=$(el_records).children().last()[0];
            var indexarray=getIndexarray(el_rec_record);
            indexarray.pop();
            //console.log(indexarray);
            //console.log(namestr);
            
            if(bnew){
              index=el_rec_record.dataset.rec_index;
              // defaultvalues
              if(isset(settings.masterdata,'defaultvaluesobject',object)){
                  if(!dat_p)dat_p=settings.masterdata.defaultvaluesobject[object];
                  var elements=$(el_rec_record).find("input,select,textarea");
                  for(var i=0;i<elements.length;i++){
                      var name=getSubName('columnname',elements[i].name)
                      if(isset(settings.masterdata.defaultvaluesobject,object,name)){
                          elements[i].value=settings.masterdata.defaultvaluesobject[object][name];
                      }
                  }
                  var datsub=getObjectValuefromIndexArray(dat,indexarray);
                  if(!datsub){
                    //console.log(dat);
                    createfromindexarray(dat,indexarray);
                    dat[object][index]=settings.masterdata['defaultvaluesobject'][object];
                  }else{
                    datsub[index]=settings.masterdata['defaultvaluesobject'][object];
                  }
              }else{
                  // ??
              }
              if(bfocus){
                var el=$(el_rec_record).find('input:not(:disabled):not([type=hidden]):first,select:not(:disabled):first,textarea:not(:disabled):first')[0];
                el.focus();
              }
            }
              
            if(settings.masterdata.newRecord) {
                settings.masterdata.newRecord(el_rec_record,dat);
            }
            cb(settings,'cbnewRecord',{settings:settings,el_md:el_md,el_rec_record:el_rec_record,namestr:namestr,index:index,dat:dat,dat_p:dat_p,bnew:bnew})
            if(settings.masterdata.newContainer){
                var containers=$(el_rec_record).find('.js_rec_container')
                for(var i=0;i<containers.length;i++) {
                    settings.masterdata.newContainer(containers[i],o);
                }
            }
            
            conditional_output(el_rec_record,getIndexarray(el_rec_record));

            // focus in last field?
            var add_empty_rec=getfromArray(settings.masterdata,'add_empty_rec',false);
            /*
            if(add_empty_rec){
              $(el_rec_record).on('focus','input:not(:disabled):last,select:not(:disabled):last',function(){
                  console.log('check last');
                  var el_records=$(this).parents('.js_rec_records')[0];
                  var el=$(el_records).find('input:not(:disabled),select:not(:disabled)').last()[0];
                  if(el==this){
                      //console.log('last');
                      var el=$(el_rec_record).find('input:not(:disabled):not([type=hidden]),select:not(:disabled)').first()[0];
                      if(el){
                          if(!gbnull(el.value)){
                            //el_rec_container,before_rec_index,namestr,index,dat_p
                            addhtmlrecord(el_rec_container,undefined,namestr,-1,{},true);
                          }
                          if(getfromArray(settings.masterdata,'auto_save',0)){
                              saveRecord(false);
                          }
                      }
                  }
              });
            }
            */
           
            if(add_empty_rec){
              var el_last=$(el_rec_record).find('input:not(:disabled):last,select:not(:disabled):last').last()[0];
              $(el_last).on('blur',function(){
                console.log('check last line');
                var el_records=$(this).parents('.js_rec_records')[0];
                var el=$(el_records).find('input:not(:disabled),select:not(:disabled)').last()[0];
                if(el==this){
                  //el_rec_container,before_rec_index,namestr,index,dat_p,focus
                  addhtmlrecord(el_rec_container,undefined,namestr,-1,{},true);
                  if(getfromArray(settings.masterdata,'auto_save',0)){
                      saveRecord(false);
                  }
                }
              });
            }
            return el_rec_record;
        }

        function message(text,myclass,delay){
          delay=typeof delay==='undefined'?4000:delay;
          if(settings.masterdata.message_position==4){
            var k8message=Object.create(k8);
            k8message.message(text,myclass,delay);
          }else{
            //var el=el_md.getElementsByClassName('footline')[0].getElementsByTagName('div')[0];
            var el=el_md.getElementsByClassName('js_message')[0];
            if(settings.masterdata.message_position==3){
                el=$(el_md).find('.k8-browser-bottom')
                $(el).show();
                var el_child=$(el).children()[0];
                el_child.innerHTML=text;
                el_child.classList.remove('alert');
                el_child.classList.remove('saved');
                el_child.classList.add(myclass);
            }else{
                el.innerHTML=text;
                el.classList.remove('alert');
                el.classList.remove('saved');
                el.classList.add(myclass);
            }
            $(el).show();
            if(delay>0){
                setTimeout(function(){
                    $(el).fadeOut("slow");
                }, delay);
            }
          }
        }

        function initForm(defaultvalues){
            defaultvalues=typeof defaultvalues !== 'undefined' ? defaultvalues : {};
            if(typeof(el_form)!=='undefined'){
                if(bwithdirty && el_dirty)el_dirty.src=path+'masterdata/pic/icon_saved.png';
                
                if(getfromArray(settings.masterdata,'object_mode',0)==1 || settings.masterdata.formmode==1){
                    obj2form(defaultvalues,el_form);
                    conditional_output(el_form);
                }else{
                    obj2form(defaultvalues,el_form);
                }

                if(settings.rightcheck!=0){
                    disableForm(!Number(settings.masterdata.rightuser_create));
                }
                $(el_form).find('.js_rec_records').empty();
                var containers=$(el_form).find('.js_rec_container');
                for(var i=0;i<containers.length;i++){
                    // set record counter -1
                    containers[i].dataset.rec_indexmax=-1;
                    if(getfromArray(settings.masterdata,'add_empty_rec',0)==1){
                      var object=containers[i].dataset.rec_object;
                      addhtmlrecord(containers[i],undefined,object,-1);
                    }
                }
                if(settings.masterdata.upload.enabled && !bnoform){
                    ProcessImage(0,false);
                }
            }
        }
        
        function update(o){
            /*
            var trows=tableTab.getRows();
            var bin=false;
            var result=tableTab.getRow(o[settings.key]);
            */
           var result=false;
            if(row_actual){
                result=(row_actual.getData()[settings.key]==o[settings.key]);
            }
            if(result){
                console.log('update: '+o[settings.key]);
                row_actual.update(o).then(function(row){
                    if(!bnoform)display_record(o);
                });
            }else{
                tableTab.addRow(o, true);
            }

            /*
            if(tableTab.options.index!="undefined"){
                var result=tableTab.updateRow(o[settings.key],o);
                if(trows.length>0){
                  for(var i=0;i<trows.length;i++){
                    if(trows[i].getData()[settings_list.key]==o[settings_list.key]){
                      //trows[i].update(o);
                      tableTab.updateRow(i,o);
                      bin=true;
                      break;
                    }
                  }
                }
                if(!bin){
                  tableTab.addRow(o, true);
                }
                */
            //}else{
            //}
        }

        function getRow(){
            return row_actual;
        }

        function gettableTab(){
            return tableTab;
        }

        function disableForm(disabled){
            // all fields
            for(var i=0;i<el_form.length;i++){
              /*
              if(el_form.elements[i].id=="tinymce"){
              }else{
              if(!el_form.elements[i].getAttribute("aria-disabled"))el_form.elements[i].disabled = disabled;
              }
              */
              if(!el_form.elements[i].getAttribute("aria-disabled"))el_form.elements[i].disabled = disabled;
            }

            // all button
            disableFormControls(disabled);
        }
        function changes(o){
            settings=$.extend(true,settings,o);
        }
        //});
        
        function conditional_output(el,level){
            // public variables: dat
            level=typeof level !== 'undefined' ? level : [];
            /*
            var data=[];
            data[i]={};
            if(row_actual){
                data[i]=row_actual.getData();
            }else{
                data[i]=o;
            }
            dat=data[i];
            */
           
            /*
            for(var j=0;j<level.length-1;j++){
              switch(j){
                case 0:
                  i1=level
              }
            }
            */
            
            el_conditions=$(el).find('*[data-v_if]');
            for(var j=0;j<el_conditions.length;j++){
                var str=el_conditions[j].dataset.v_if;
                var mode=el_conditions[j].dataset.v_mode;
                mode=typeof mode !== 'undefined' ? mode : "empty";

                //console.log("str=" + str);
                try{
                  if(!eval(str)){
                    switch(mode){
                        case 'hide':
                            $(el_conditions[j]).hide();
                            break;
                        case 'hidechildren':
                            $(el_conditions[j]).children().hide();
                            break;
                        case 'remove':
                            $(el_conditions[j]).remove();
                            break;
                        case 'empty':
                            $(el_conditions[j]).empty();
                            break;
                    }
                  }
                }
                catch(e){
                  console.log('error by expression: '+str);
                }
            }
        }        
        
        function insertRecord(dat){
            tableTab.addRow(dat,true)
            .then(function(row){
                row_actual=row;
                if(!bnoform)display_record(o);
                if(!btabselectstandard){
                  $(table).find(".row_selected").removeClass("row_selected");
                  $(row.getElement()).addClass("row_selected");
                }
            });
        }

        function setDirty(dirty){
          dirty= typeof dirty !== 'undefined' ? dirty : true;
          if(bwithdirty){
            el_dirty.src=path+"masterdata/pic/icon_dirty.png";
          }else{
            el_dirty.src=path+"masterdata/pic/icon_saved.png";
          }
        }

        function isDirty(){
          var is_dirty=false;
          if(el_dirty){
            is_dirty=(el_dirty.src.indexOf('dirty')>-1);
          }
          return (is_dirty);
        }

        function setElementValue(element,value){
          var el=el_form.elements.namedItem(element);
          if(el){
            gFormatinputfordisplay(el,value);
            setDirty();
          }
        }

        this.test=function(){
            console.log('this.test');
        }
        return {"el_md":el_md,"el_form":el_form,"update":update,"gettableTab":gettableTab,"tableTab":tableTab,"changes":changes,"getRow":getRow,"message":message,"insertRecord":insertRecord,"gObject2FormBuild":gObject2FormBuild,"setDirty":setDirty,"setElementValue":setElementValue,"newRecordExt":newRecordExt,"row_actual":row_actual};
    };

    $.fn.searchbox = function( options ) {
        var width=Math.round(window.innerWidth*0.9);
        if(width>1170)width=1170;
        var notabulator=false;
        var datadefID;
        var blanguages=true;  
        var k8form=Object.create(k8);
        var mydefault={
            "width": width,
            "tabulator":
              {
                  filterMode:"remote",
                  ajaxURL:options.masterdata.url_readfilter,
                  ajaxParams:options.masterdata.data_readfilter,
          
                  headerFilterPlaceholder:"",
                  height:205, 
                  layout:"fitColumns"
              }
            };
        if(options.hasOwnProperty('datadefID')){
            datadefID=options.datadefID;
            mydefault=$.extend(true,mydefault,{
                masterdata:{
                    "url_readfilter": "masterdata\/ProcessData.php",
                    "data_readfilter": {
                        "datadefID": datadefID,
                        "process_action": "ReadFilter"
                    }
                }
            });
        }
        var settings = $.extend(true,mydefault,options);
        settings.title=(isset(settings,"title")?settings.title:getl(getfromArray(settings,"name")));

        /*
        var settings = $.extend(true,
        {
            "width": width
        }, options );
        */

        var url='';
        var path=GLOBALS_hostpath+'../'.repeat(settings.masterdata.script_depth);

        if(settings.masterdata.clause){
            settings.masterdata.data_readfilter.clause=settings.masterdata.clause;
        }
        if(settings.masterdata.filters){
            settings.masterdata.data_readfilter.filters=settings.masterdata.filters;
        }
        if(isset(settings.masterdata,'datareadlimit')){
            settings.masterdata.data_readfilter.mytable_offset=0;
            settings.masterdata.data_readfilter.mytable_limit=settings.masterdata.datareadlimit;
        }

        return this.each(function(){
          //$(this).addClass('searchbox');
          var selector='k8-overlay';
          if(document.getElementById('k8-overlay'))selector='k8-overlay1';
          var overlay=document.getElementById(selector);
          if(!overlay){
            //html erstellen
            var html='<div id="'+selector+'" class="masterdata">' +
                        '<div style="width: '+settings.width+'px">' +
                            '<div style="text-align: right; padding-right: 6px"><a style="cursor:pointer;" id="btnOverlay">&times;</a></div>'+
                            '<div style="padding: 0 20px 20px 20px" id="overlay_content">'+
                                '<div class="headline">' +
                                '<div>'+'<h3>Searchbox</h3></div>'+
                                '</div>'+
                                '<div class="searchdata">'+
                                    '<div class="tabulator"></div>'+
                                '</div>'+
                                '<div class="footline">'+
                                    '<div></div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
            $(this).append(html);
            //var el_md=this;
            var el_md=document.getElementById(selector);
            $(el_md).off();
            var table=el_md.getElementsByClassName('tabulator')[0];

            $(el_md).find('#btnOverlay').on('click',function(e){
                e.preventDefault();
                $("#"+selector).remove();
            });
            
            // ------------------------------------------ Masterdata -------------------------------------------
            $(el_md).find('.headline').find('div').eq(0).html('<h3>'+getl(settings.title)+'</h3>');
        
            //tabulator setzen
            // ------------------------------------------ Tabulator -------------------------------------------
            var row_actual=0;
            var bdelclicked=false;
            var keyfield=settings['key'];
            
            var otable=settings.tabulator;
            /*
            var otable=$.extend(
                {
                    rowClick:function(e, row){ //trigger an alert message when the row is clicked
                        var obj={};
                        obj.data=row.getData();
                        obj.js_return=settings.js_return;
                        obj.js_return.displaycolumn=settings.displaycolumn;
                        obj.js_return.key=settings.key;
                        //$(el_md).empty();
                        $("#"+selector).remove();
                        if(typeof settings.js_return.function_name === 'function') {
                            settings.js_return.function_name(obj);
                        }else{
                            var fn=window[settings.js_return.function_name];
                            if(typeof fn === 'function') {
                              fn(obj);
                            }else{
                              console.log(func_name+' is not a function!');
                            }
                        }
                    }
                },
                settings.tabulator
            );
            */

            //-------------------------------- Define Table Columns
            //otable.columns=settings.tabulator.columns;
            
            /* -------- tabcolarr ----------- */
            if(settings.masterdata.tabcolarr){
                for (var i=0;i<otable.columns.length;i++) {
                  if (settings.masterdata.tabcolarr.indexOf(otable.columns[i]['field'])<0){
                      delete otable.columns[i];
                  }
                }                
            }
            
            /* -------- language support ----------- */
            if(blanguages){
              for (var property in otable.columns) {
                if (otable.columns.hasOwnProperty(property)) {
                  if(otable.columns[property].hasOwnProperty('title')){
                      //console.log(otable.columns[property]['title']);
                      otable.columns[property]['title']=getl(otable.columns[property]['title']);
                  }
                }
              }                
            }
            
            tableTab = new Tabulator(table, otable);
            tabulator_table=tableTab;

            tableTab.on("tableBuilt", function(){
              if(!notabulator && settings.masterdata.tabcolumns){
                document.getElementById('js_close_columnlist').addEventListener('click', function(e) {
                  $(el_md).find('.js_columnlist').toggle();
                });
                const myForm = document.getElementById('columnlist_form');
                if(myForm){
                    myForm.addEventListener('change', function(e) {
                        e.preventDefault();
                        if(e.target.tag='input'){
                            console.log('checkbox clicked');  // Expected Value: 'Data'
                            if(e.target.checked){
                                tableTab.showColumn(e.target.name);
                            }else{
                                tableTab.hideColumn(e.target.name);
                            }
                            tableTab.redraw(true);
                        }
                    });
                }    
                listcolumns();
              }

              function listcolumns(){
                  $(columnlist_form).empty();
                  var htmlcheckbox='<div class="checkbox">'+
                                      '<label class=""><input type="checkbox" name="{{field}}">{{label}}</label>'+
                                  '</div>';

                  var tablecolumns=tableTab.getColumns();
                  for(var i=0;i<tablecolumns.length;i++){
                    if(tablecolumns[i].getDefinition().field){
                      var node=document.createElement("div");
                      var temp=htmlcheckbox.replace('{{label}}',tablecolumns[i].getDefinition().title).replace('{{field}}',tablecolumns[i].getDefinition().field);
                      var el_div=$(temp).appendTo(columnlist_form);
                      var el_check=$(el_div).find("input")[0];
                      if(tablecolumns[i].isVisible()){
                          el_check.checked=true;
                      }
                    }
                  }
              }
            });

            tableTab.on("rowClick",function(e, row){
              var obj={};
              obj.data=row.getData();
              obj.js_return=settings.js_return;
              obj.js_return.displaycolumn=settings.displaycolumn;
              obj.js_return.key=settings.key;
              //$(el_md).empty();
              $("#"+selector).remove();
              if(typeof settings.js_return.function_name === 'function') {
                  settings.js_return.function_name(obj);
              }else{
                  var fn=window[settings.js_return.function_name];
                  if(typeof fn === 'function') {
                    fn(obj);
                  }else{
                    console.log(func_name+' is not a function!');
                  }
              }
            });

            tableTab.on("dataLoadError", function(error){
              console.log("dataLoadError.Error="+error);
              k8form.message("probably you are offline","alert");
              var params=$.extend(settings.masterdata.data_readfilter,tableTab.getHeaderFilters(),true)
              if(settings.masterdata.cbConnectionfail){
                var myoptions={tableTab:tableTab,url:settings.masterdata.url_readfilter,params:params};
                settings.masterdata.cbConnectionfail(myoptions);
              }else{
                console.log("cbConnectionfail");
                var el=document.getElementsByClassName('navbar-brand')[0];
                if(el){
                  if(el.style.color!=="red"){
                    var color_backup=el.style.color;
                    el.style.color="red";
                    var intervalID=setInterval(checkConnection,5000);

                    function checkConnection(){
                      console.log("checkConnection");
                      $.getJSON("masterdata/ProcessData.php", function(oJson) {
                        el.style.color=color_backup;
                        // reloaddata
                        tableTab.setData(settings.masterdata.url_readfilter,params);
                        clearInterval(intervalID);
                      })
                      .fail(function(jqxhr, textStatus, error ) {
                      });			
                    }  
                  }  
                }else{
                  console.log("cbConnectionfail: no navbar-brand, no connection check");
                }
              }
            });

            //-------------------------------- tabledata
            /*
            var filters=[];
            if(settings.masterdata.filters){
                filters=settings.masterdata.filters;
            }
            if(settings.tabulator.initialHeaderFilter){
                filters=filters.concat(settings.tabulator.initialHeaderFilter);
            }
            if(filters.length>0){
                settings.masterdata.data_readfilter=$.extend(settings.masterdata.data_readfilter,{"filters":filters},true);
            }
            
            tableTab.setData(path+settings.masterdata.url_readfilter,settings.masterdata.data_readfilter);
            */
          };
        });
      };
//}( jQuery ));


    $.fn.catalog=function(options,datain){
        // GET
        var datadefID;
        var level_nested=0;
        var data=[];
        var mydefault={
          masterdata:{
            disprecdirect:1, /* 0=No, 1=Yes, 2=by URL+Filterform */
            selector:'',
            htmlout:'catalog',
            loaddata: true,
            rightcheck:false,
            rightuser_create:true,
            paginationsize:0,
            pagination:'internal',
            paginationscale:["2","5","10"],
            paginationalways: false,
            paginationcontainer:'<div class="js_rec_pagination"></div>',
            /*paginationtemplate:'<div class="row"><div class="k8-padding-top-normal k8-padding-bottom-normal col-xs-3 js_pag_recordcount"></div><div class="k8-padding-top-bottom-small col-xs-6 js_pag_buttons text-center"></div><div class="k8-padding-top-bottom-small col-xs-3 js_pag_pagerows text-right"></div></div>',*/
            paginationtemplateOLD:'<div class="row"><div class="k8-padding-top-normal k8-padding-bottom-normal col-3 js_pag_recordcount"></div><div class="k8-padding-top-bottom-small col-6 js_pag_buttons text-center"></div><div class="k8-padding-top-bottom-small col-3 js_pag_pagerows text-end"></div></div>',
            paginationtemplatebtnOLD:'<a href="#" class="btn btn-light k8-margin-side-6"></a>',
            paginationtemplateXXX:'<div class="row mt-3"><div class="col-sm-3 js_pag_recordcount" style="padding-top: 13px;"></div><div class="k8-padding-top-bottom-small col-sm-6"><nav aria-label="page navigation"><ul class="pagination justify-content-center js_pag_buttons"></ul></nav></div><div class="k8-padding-top-bottom-small col-sm-3 js_pag_pagerows text-end"></div></div>',
            paginationtemplate:'<div class="row mt-0 mb-3"><div class="col-sm-3 js_pag_recordcount" style="padding-top: 13px;"></div><div class="k8-padding-top-bottom-small col-sm-6"><nav aria-label="page navigation"><ul class="mb-0 pagination justify-content-center js_pag_buttons"></ul></nav></div><div class="k8-padding-top-bottom-small col-sm-3 js_pag_pagerows text-end"></div></div>',
            paginationtemplatebtn:'<li class="page-item"><a class="page-link" href="#"></a></li>',
            edittype:0,
            bwithform:false,
            placeholder_mode:2,
            defaultvalues:[],
            lineeditsubmit:'<button type="submit" class="js_rec_save btn btn-primary" aria-label="Left Align"><i class="bi-check-lg"></i></button>',
            nodata:'<div class="d-flex align-items-center justify-content-center k8-border mb-3" style="height:300px"><div><p><strong>NO RESULTS</strong></p></div></div>',
            htag:"h1",
            control_mode:0  /* 0:jQuery, 1:eventlistener
            /*nodata:'<h1>System message</h1><div style="min-height: 300px">your request has no result!</div>'*/
          },
          html:{
            catalog:{
              /*
              container:'<div class="k8-example-catalog"> <div class="js_rec_container rec_container catalog" data-rec_indexmax="-1"> <div class="row js_rec_head js_catalog" id="searcharea"> <div class="col-sm-4 mt-3"> <h1>#ls#Item Catalog#</h1> </div> <div class="col-sm-8 mt-3"> <form id="filterform" method="GET"> <input type="hidden" name="datadefID"> <input type="hidden" name="page"> <div class="input-group mt-1" id="searchlineb5"> <input type="text" class="form-control" placeholder="Search" id="search" name="search" value=""/> <div class="input-group-btn"> <button type="submit" class="js_rec_search btn btn-primary"><i class="bi-search"></i></button> {{control_new}} </div> </div> </form> </div> </div> <div class="js_rec_head js_member" style="display: none"> <div class="k8-flex-row"> <div class="k8-flex-100"> <h2>In Preparation</h2> </div> <div class="k8-flex-100 text-end"> <button type="button" class="js_rec_new btn btn-primary">#ls#New#</button> </div> </div> </div> <hr> <div class="js_rec_records rec_records"></div> </div> </div>',
              record:'<div class="js_rec_record rec_record" data-keyvalue="{{keyvalue}}" data-rec_index="{{index}}"><div class="row"> <div class="col-sm-4"> <div class="k8-box-square"> <div class="k8-box-content"> <img class="k8-image-{{image_orientation}}" src="{{image_file}}"> </div> </div> </div> <div class="col-sm-8"> <div class="k8-padding-side-small"> <div class="k8-link-main"> {{control_edit}} <!--<a href="index.php?page=detail&datadefID=k8components&keyvalue={{componentID}}">{{text1}}</a>--> <a class="js_detaillink" href="">{{text1}}</a> {{control_delete}} </div> <div class="k8-content"> <p>{{datecreated}} von {{username}}</p> <p>{{textdimensions}}</p> <p><strong>{{price}} EUR/{{salesunit}}</strong></p> </div></div> </div> </div> <hr> </div>'
              "blank":"<p>blank page</p>"
              */
            }
          },
          tabulator:{
            columns:[]
          }
        };
        if(options.hasOwnProperty('datadefID')){
            datadefID=options.datadefID;
            mydefault=$.extend(true,mydefault,{
                masterdata:{
                    "url_new":  "index.php?page=form&page_mode=2&datadefID="+datadefID,
                    "url_edit": "index.php?page=form&page_mode=2&process_action=Edit&datadefID="+datadefID,
                    "url_getR": "masterdata\/ProcessData.php?process_action=getRecords&datadefID="+datadefID,
                    "url_init": "masterdata\/ProcessData.php?process_action=Init&datadefID="+datadefID,
                    "url_load": "masterdata\/ProcessData.php?process_action=Load&datadefID="+datadefID,
                    "url_save": "masterdata\/ProcessData.php?process_action=Save&datadefID="+datadefID,
                    "url_del":  "masterdata\/ProcessData.php?&process_action=Del&datadefID="+datadefID,
                    "url_readfilter": "masterdata\/ProcessData.php",
                    "data_readfilter": {
                        "datadefID": datadefID,
                        "process_action": "ReadFilter"
                    }
                }
            });
        }
        var settings = $.extend(true,mydefault,options );
        settings.data=getfromArray(settings,'data',[]);
        settings.title=(isset(settings,"title")?settings.title:getl(getfromArray(settings,"name",getfromArray(settings,"datadefID"))));
        var headtitlecolumn=getfromArray(GET,"headtitlecolumn");
        if(!gbnull(headtitlecolumn)){
          settings.masterdata.data_readfilter['headtitlecolumn']=headtitlecolumn;
          //settings.masterdata.data_readfilter['table']=getfromArray(GET,"table");
          settings.masterdata.url_save+="&headtitlecolumn="+headtitlecolumn;
          settings.masterdata.url_new+="&headtitlecolumn="+headtitlecolumn;
          settings.masterdata.url_edit+="&headtitlecolumn="+headtitlecolumn;
        }
        if(settings.masterdata.tabcolumns){
          settings.tabulator['movableColumns']=true;
          settings.tabulator['columnMoved']=function(column, columns){listcolumns();};
        }
        if(isset(settings.masterdata,'search_internal')){
          if(settings.masterdata.search_internal)settings.masterdata.pagination='internal';
        }
        var k8cat=Object.create(k8);

        // create childfieldnames
        var childfieldnames={};
        settings.childcollection={};
        if(settings.childs){
            for(i=0;i<settings.childs.length;i++){
                var child=settings.childs[i];
                childfieldnamesAdd(child);
            }
        }
        function childloop(childs){
            for(i=0;i<childs.length;i++){
                var child=childs[i];
                childfieldnamesAdd(child);
            }
        }
        function childfieldnamesAdd(child){
            childfieldnames[child.fieldname]={};
            childfieldnames[child.fieldname].key=child.key;
            settings.childcollection[child.fieldname]=child;
            if(child.childs){
                childloop(child.childs);
            }
        }
        settings.childfieldnames=childfieldnames;

        //return this.each(function(){
        //this.each(function(){
        var edittype=Number(settings.masterdata.edittype);
        if(settings.masterdata.listedit || settings.masterdata.lineedit){
            edittype=6;
        }else if(settings.masterdata.newtabedit){
            edittype=4;
        }
        var url='';
        var path=GLOBALS_hostpath+'../'.repeat(settings.masterdata.script_depth);

        var el_pagination;
        var pageno=1;
        var mytable_offset=0;
        var mytable_limit=getfromArray(Array_GET(),'mytable_limit',settings.masterdata.paginationsize);
        var k8_recordcount;
        var el_list;
        var error='';
        var plugin=this;
        var $plugin=$(this);
        var object=settings.masterdata.htmlout;
        var berror=false;

        if(this.length==1){
            // create listbox
            el_list=this[0];
            $(el_list).off();

            if(typeof datain!=='undefined'){
                data=datain.slice();
            }else if(typeof settings.data!=='undefined'){
                data=settings.data.slice();
            }
            $plugin.data("data",data);
            //k8_recordcount=data;
            k8_recordcount=data.lenght;

            // history
            if(!isset(settings,'html')){
                settings.html={};
                settings.html[object]={};
                if(isset(settings,'js_rec_container',object)){
                    settings.html[object]['container']=settings['js_rec_container'][object];
                }
                if(isset(settings,'js_rec_record',object)){
                    settings.html[object]['record']=settings['js_rec_record'][object];
                }
                if(isset(settings,'js_rec_nodata',object)){
                    settings.html[object]['nodata']=settings['js_rec_nodata'][object];
                }
            }            

            //if(!isset(settings,'js_rec_container',object)){
            if(!isset(settings,'html',object,'container')){
                console.error('container invalid: '+object);
                berror=true;
            }
            //if(!isset(settings,'js_rec_record',object)){
            if(!isset(settings,'html',object,'record')){
                console.error('record invalid: '+object);
                berror=true;
            }
            if(berror)return;

            var html='';
            //html=ReplacePlaceholder(settings['js_rec_container'][object],{},settings.masterdata.placeholder_mode,path);
            html=ReplacePlaceholder(settings.html[object]['container'],{},settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns,settings);
            el_list.innerHTML=html;
            conditional_output(el_list);
            var el_title=el_list.querySelector('.js_title');
            if(el_title)el_title.innerHTML='<'+settings.masterdata.htag+'>'+settings.title+'</'+settings.masterdata.htag+'>'

            if(settings.rightcheck!=0 && !Number(settings.masterdata.rightuser_create)){
                $(el_list).find('.js_rec_new,.js_rec_newsearch').hide();
            }else{
                let el_rec_new=$(el_list).find('.js_rec_new')[0];
                if(el_rec_new){
                  el_rec_new.addEventListener('click',function(e){
                    Event_js_rec_new(e);
                  });
                }
            }

            // build in search here
            var bblank=false;
            if(settings.masterdata.cbcatAfterContainer){
              //settings.masterdata.cbcatAfterContainer({"el_list":el_list,"settings":settings,"loaddata":loaddata});
              cb(settings,'cbcatAfterContainer',{"settings":settings,"el_list":el_list,"buildformfilter":buildformfilter,"loaddata":loaddata});
              if(isset(settings,"return","bblank"))bblank=settings.return.bblank;
            }else{
              // no Container, no filterform?
              if(data.length==0)buildformfilter();
              //if(!settings.data)buildformfilter();
            }
            
            var el_records=$(el_list).find('.js_rec_records')[0];
            if(!el_records){
                console.error('container has no class: js_rec_records');
                return;
            }
            if(bblank){
              if(settings.html[object].blank){
                $(el_records).append(settings.html[object].blank);
                conditional_output(el_records);
              }
            }else{
              if(settings.masterdata.edittype==6 || settings.masterdata.edittype==7 || settings.masterdata.bwithform){
                  $(el_records).replaceWith('<form class="form-horizonal js_list_form" method="get" action="masterdata/ProcessData.php" name="lineedit">'+el_records.outerHTML+'</form>');
                  var el_records=$(el_list).find('.js_rec_records')[0];
              }

              var el_container=$(el_list).find('.js_rec_container')[0];
              if(!el_container){
                  console.log('container has no class: js_rec_container');
                  return;
              }
              if(settings.masterdata.paginationsize>0){
                  var el=$(el_container).find('.js_rec_pagination')[0];
                  if(!el){
                      var el_foot=$(el_container).find('.js_rec_foot')[0];
                      if(el_foot){
                          if(getfromArray(settings.masterdata,'paginationprepend',true)){
                              $(el_foot).prepend(settings.masterdata.paginationcontainer);
                          }else{
                              $(el_foot).append(settings.masterdata.paginationcontainer);
                          }
                      }else{
                          $(el_container).append('<div class="js_rec_foot">'+settings.masterdata.paginationcontainer+'</div>');
                      }
                  }
              }
              if(settings.masterdata.heartbeat){
                  setInterval(function(){
                      $.getJSON('masterdata/ProcessData.php');
                      //if(settings.masterdata.fninittimer)settings.masterdata.fninittimer();
                  }, settings.masterdata.heartbeat);
              }
              var el_form=$(el_list).find('form[name="lineedit"]')[0];

              // ----------------------- load data
              if(data.length>0){
                  displaydata(el_records,data,object);
              }else if(settings.masterdata.loaddata) {
                  loaddata();
              }else{
                  displaydata(el_records,data,object);
              }

            }
            /* ---------- controls ------------ */
            if(settings.masterdata.edittype==6 || settings.masterdata.edittype==7 || settings.masterdata.edittype==11){
                $(el_form).on("change","input,textarea,select",function(){
                    var name=getSubName('name',this.name);
                    var namestr=getSubName('namestr',this.name);
                    gFormatinputfordisplay(this,this.value);
                    //if(bwithdirty)el_dirty.src=path+"masterdata/pic/icon_dirty.png";
                    if(settings.masterdata.dataChange) {
                        settings.masterdata.dataChange(el_md,this);
                    }
                    /*
                    if(settings.masterdata.cbcatChange) {
                        settings.masterdata.cbcatChange({"el_list":el_list,"el":this});
                    }
                    */
                    cb(settings,'cbcatChange',{"settings":settings,"el_list":el_list,"el":this});
                });
            }
            
            if(true){
                $(el_list).on("click",".js_image_click",function(){
                    var el_record=$(this).parents('.js_rec_record')[0];
                    if(el_record){
                        el_target=$(el_record).find('img')[0];
                        el_target.src=this.src;
                        if(el_target.classList.contains('k8-image-landscape') || el_target.classList.contains('k8-image-potrait')){
                          $(el_target).removeClass('k8-image-landscape')
                          $(el_target).removeClass('k8-image-potrait');
                          if(this.classList.contains('k8-image-landscape')){
                              $(el_target).addClass('k8-image-landscape')
                          }else{
                              $(el_target).addClass('k8-image-portrait')
                          }
                        }
                    }else{
                        console.log('js_image_click, no js_rec_recrd defined!');
                    }
                });
            }

            /*
            $(el_list).on("click",".js_rec_new_search",function(){
                if(!$(this).hasClass('js_disabled')){
                    var el_rec_container=$(this).parents('.js_rec_container')[0];
                    var indexmax=el_rec_container.dataset.rec_indexmax;
                    indexmax++;
                    el_rec_container.dataset.rec_indexmax=indexmax;
                    var index_obj={};
                    index_obj['index']=indexmax;
                    index_obj['keyvalue']=0;
                    var line=ReplacePlaceholder(settings['js_rec_record'][object],index_obj,settings.masterdata.placeholder_mode,path);
                    $(el_records).append(line);

                    el_rec_record=$(el_list).find('.js_rec_record[data-rec_index="'+indexmax+'"]')[0];
                    $(el_rec_record).find('.js_rec_delete').hide();
                    $(el_rec_record).find('.js_rec_edit').hide();
                    $(el_rec_record).find('.js_rec_cancel').show();
                    $(el_rec_record).find('.js_rec_save').show();
                    $(el_rec_record).find('.js_rec_save').prop("disabled",false);
                }
            });
            */

            //console.log("main object="+object);
            
            
            if(settings.masterdata.control_mode==0){
              $(el_list).on("click",".js_rec_edit",function(e){
                Event_js_rec_edit(e);
              });
              $(el_list).on("click",".js_rec_delete",function(e){
                Event_js_rec_delete(e);
              });
              $(el_list).on("click",".js_rec_new",function(e){
                Event_js_rec_new(e);
              });

              if(settings.masterdata.edittype==6 || settings.masterdata.edittype==7 || settings.masterdata.edittype==11){
                $(el_form).submit(function( e ) {
                    e.preventDefault();
                    var el=$(e.target).find('input,select,textarea').first()[0];
                    var el_record=$(el).parents('.js_rec_record')[0];
                    saverecord(el_record);
                });
                $(el_list).on("click",".js_rec_cancel",function(e){
                  Event_js_rec_cancel(e);
                });

                /*
                $(el_list).on("click",".js_rec_cancel",function(){
                    if(edittype==10 || edittype==11){
                        var el_rec_record=$(this).parents('.js_rec_record')[0];
                        var el_form=$(this).parents('form')[0];
                        var el_rec_recmain=$(el_list).find(this).parents('.js_rec_record').last()[0];
                        var index_main=el_rec_recmain.dataset.rec_index;
                        var index=el_rec_record.dataset.rec_index;
                        var dat_main=data[index_main];
                        var indexes={};
                        var indexarray=[];
                        var el_rec_lfd=el_rec_record;
                        do{
                            var el_rec_contlfd=$(el_rec_lfd).parents('.js_rec_container')[0];
                            var indexlfd=Number(el_rec_lfd.dataset.rec_index);
                            var arrayname=el_rec_contlfd.dataset.rec_object;
                            indexes[arrayname]=indexlfd;
                            if(!gbnull(arrayname)){
                              indexarray.unshift(indexlfd);
                              indexarray.unshift(arrayname);
                            }else{
                              indexarray.unshift(indexlfd);
                            }
                            el_rec_lfd=$(el_rec_contlfd).parents('.js_rec_record')[0];
                        }while(typeof(el_rec_lfd)!=="undefined")
                        if(edittype==11){
                          if(index==-1){
                            el_rec_record.remove();
                          }else{
                            var el_rec_containers=$(this).parents('.js_rec_container')[0];
                            var objtemp=el_rec_containers.dataset.rec_object;
                            var template=settings.html[objtemp].record;

                            var dat_sub=getObjectValuefromIndexArray(data,indexarray);
                            var line=ReplacePlaceholder(template,dat_sub,settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns);
                            el_rec_record=replaceElWith(el_rec_record,line);
                            el_rec_record.dataset.rec_index=indexarray[indexarray.length-1];
                            var key=getfromArray(settings.childcollection[objtemp],'key');
                            el_rec_record.dataset.keyvalue=dat_sub[key];
                          }
                          if(settings.masterdata.dataCancel || settings.masterdata.cbcatCancel){
                              if(settings.masterdata.dataCancel)settings.masterdata.dataCancel(el_form,dat,indexes);
                              //if(settings.masterdata.cbcatCancel)settings.masterdata.cbcatCancel({"el_form":el_form,"dat":dat,"indexes":indexes});
                              cb(settings,'cbcatCancel',{"settings":settings,"el_list":el_list,"el_form":el_form,"dat":dat,"indexes":indexes});
                          }else{
                              //console.log('masterdata.dataCancel and masterdata.cbcatCancel not defined');
                          }
                        }else{
                          if(settings.masterdata.dataCancel || settings.masterdata.cbcatCancel){
                              if(settings.masterdata.dataCancel)settings.masterdata.dataCancel(el_form,dat_main,indexes);
                              //if(settings.masterdata.cbcatCancel)settings.masterdata.cbcatCancel({"el_form":el_form,"dat":dat_datmain,"indexes":indexes});
                              cb(settings,'cbcatCancel',{"settings":settings,"el_list":el_list,"el_form":el_form,"dat":dat_datmain,"indexes":indexes});
                          }else{
                              //console.log('masterdata.dataCancel and masterdata.cbcatCancel not defined');
                          }
                        }  
                    }else{
                        var el_rec_record=$(this).parents('.js_rec_record')[0];
                        var el_rec_records=$(this).parents('.js_rec_records')[0];
                        var keyvalue=el_rec_record.dataset.keyvalue;
                        if(isNaN(keyvalue))keyvalue=0;
                        var rec_index=Number(el_rec_record.dataset.rec_index);
                        if(rec_index==-1){
                            el_rec_record.remove();
                        }else{
                            var index=el_rec_record.dataset.rec_index;
                            var dat=getData()[index];
                            dat['keyvalue']=keyvalue;
                            dat['index']=index;
                            var template='record';
                            if(settings.masterdata.edittype==6){
                              if(settings.html[object]['recdisp']){
                                template='recdisp';
                                var line=ReplacePlaceholder(settings.html[object][template],dat,settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns);
                                $(el_rec_record).replaceWith(line)[0];
                                el_rec_record=$(el_rec_records).find('.js_rec_record[data-keyvalue="'+keyvalue+'"]')[0];
                              }else{
                                input2display(el_rec_record,dat);
                              }
                            }else{
                              template='record';
                              var line=ReplacePlaceholder(settings.html[object][template],dat,settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns);
                              el_rec_record=replaceElWith(el_rec_record,line);
                            }
                            $(el_rec_record).find('.js_rec_delete').show();
                            $(el_rec_record).find('.js_rec_edit').show();
                            $(el_rec_record).find('.js_rec_cancel').hide();
                            //$(el_rec_record).find('.js_rec_save').hide();
                            //$(el_rec_record).find('.js_rec_save').prop("disabled",true);
                            $(el_rec_record).find('.js_rec_save').remove();

                            if(settings.masterdata.dataLoad) {
                                settings.masterdata.dataLoad(el_rec_record,dat,template);
                            }
                            cb(settings,'cbcatCancel',{"settings":settings,"el_list":el_list,"el_rec_record":el_rec_record,"dat":dat,"template":template});
                        }
                        if(edittype==6 || edittype==7)controlDisabled(false);
                    }
                });
                */
              }
            
              
            }
            
            
            
            function Event_js_rec_new(e){
                var el_this=e.target;
                
                console.log("js_rec_new");
                if(!$(el_this).hasClass('js_disabled')){
                    if(edittype==1 || edittype==6 || edittype==7){
                        controlDisabled(true);
                    }
                    var el_rec_contmain=$(el_list).find(el_this).parents(settings.masterdata.selector+' .js_rec_container').last()[0];
                    var el_rec_container=$(el_this).parents('.js_rec_container')[0];
                    settings.masterdata.window_mode=edittype;
                    switch(edittype){
                        case 0: // nothing / no buttons / link in this window
                            break;
                        case 1: // current record call masterdata form
                            // insert top or bottom?

                            let new_settings={};
                            let searchparams=new URLSearchParams(settings.masterdata.url_edit); 
                            let datadefID_edit=searchparams.get('datadefID');
                            if(datadefID==-1||datadefID_edit==settings.datadefID){
                              //new_settings=JSON.parse(JSON.stringify(settings));
                              new_settings=settings;
                            }else{
                              new_settings=window['settings'+datadefID_edit];
                              if(new_settings){
                                new_settings.masterdata.edittype=settings.masterdata.edittype;
                                new_settings.masterdata.window_mode=settings.masterdata.edittype;
                              }else{
                                console.error('datadefID '+datadefID_edit+' is not loaded!');
                                return;
                              }
                            }
                    
                            var keyvalue=0;
                            var indexmax=el_rec_container.dataset.rec_indexmax;
                            indexmax++;
                            el_rec_container.dataset.rec_indexmax=indexmax;
                            var index_obj={};
                            if(new_settings.masterdata.defaultvalues){
                                index_obj=new_settings.masterdata.defaultvalues;
                            }
                            index_obj['index']=indexmax;
                            index_obj['keyvalue']=0;
                            var line=ReplacePlaceholder(new_settings.html[object].record,index_obj,2,path,k8formatter,new_settings.tabulator.columns);
                            
                            //$(el_records).append(line);
                            //var el_rec_record=$(el_records).find('.js_rec_record').last()[0];
                            
                            $(el_records).prepend(line);
                            var el_rec_record=$(el_records).find('.js_rec_record').first()[0];
                            conditional_output(el_rec_record);

                            new_settings.masterdata.keyvalue=keyvalue;
                            new_settings.masterdata.notabulator=true;
                            new_settings.return={};
                            new_settings.return.replaceRecord=replaceRecord;
                            new_settings.return.selector='.js_rec_record[data-keyvalue="'+keyvalue+'"]';
                            new_settings.return.controlDisabled=controlDisabled;
                            
                            var el=$(el_rec_record).find('.js_inlineform')[0];
                            if(el){
                              $(el).empty();
                              $(el).append('<div class="masterdata"></div>');
                              el=$(el_rec_record).find('.masterdata')[0];
                              masterdata=$(el).masterdata(new_settings);
                            }else{
                              console.log("missing .js_inlineform");
                            }
                            break;
                            
                        case 2: // innerhtml opverlay
                            createOverlay(0);
                            break;
                        case 3: // overlay innerhtml
                            createOverlay(0);
                            break;
                        case 4: // new tab
                        case 5: // new window
                            var parameter="";
                            if(settings.masterdata.window_mode=edittype==5){
                                parameter="width="+window.innerWidth.toString()+",height="+window.innerHeight.toString()+",resizable=yes,scrollbars=yes";
                            }
                            if(settings.masterdata.url_new){
                                //var url='index.php?page=form&datadefID='+settings.datadefID+'&page_mode=2&keyvalue='+cell.getData()[settings.key];
                                //var url=path+settings.masterdata.url_new+'&returnflag=3&returnopener=1&keyvalue=0';
                                var url=path+settings.masterdata.url_new+'&returnflag=3&returnopener=1&sourcedatadefalias='+getfromArray(settings,'datadefalias')+'&sourcedatadefID='+settings.datadefID+'&sourceelement='+settings.sourceelement+'&keyvalue=0';
                                // set index for return
                                var w=window.open(url,"Edit",parameter);
                                w.focus();
                                //window.location.assign(url);
                            }else{
                                alert('please set url_new!');
                            }
                            break;
                        case 6: // own line
                            addrecord(el_rec_container);
                            break;
                        case 7: // this line new template
                            // insert top or bottom?
                            var indexmax=el_rec_container.dataset.rec_indexmax;
                            indexmax++;
                            el_rec_container.dataset.rec_indexmax=indexmax;
                            var dat_p={};
                            if(settings.masterdata.defaultvalues){
                                dat_p=settings.masterdata.defaultvalues;
                            }
                            //dat_p['index']=indexmax;
                            dat_p['index']=-1;
                            dat_p['keyvalue']=0;
                            dat_p['rightuser_update']="1";
                            
                            //var line=ReplacePlaceholder('<div class="js_rec_record rec_record" data-keyvalue="{{keyvalue}}" data-rec_index="{{index}}"></div>',dat_p,2,path,k8formatter,settings.tabulator.columns);
                            var line=ReplacePlaceholder(settings.html[object].record,dat_p,2,path,k8formatter,settings.tabulator.columns,settings);
                            
                            //$(el_records).append(line);
                            //var el_rec_record=$(el_records).find('.js_rec_record').last()[0];
                            
                            $(el_records).prepend(line);
                            var el_rec_record=$(el_records).find('.js_rec_record').first()[0];
                            conditional_output(el_rec_record);
                            
                            settings.masterdata.keyvalue=dat_p['keyvalue'];
                            settings.masterdata.notabulator=true;
                            
                            settings.html[object]['recinput']=getfromArray(settings.html[object],'recinput','<div class="js_rec_record rec_record" data-keyvalue="{{keyvalue}}" data-rec_index="{{index}}">{{js_dataform}}<hr></div>');
                            if(isset(settings.html,object,'recinput')){
                              var placeholder="{{js_dataform}}";
                              var html;
                              if(settings.html[object]['recinput'].indexOf(placeholder)){
                                var k8form=Object.create(k8);
                                if(settings.k8form){
                                  //var ok8form=Object.assign(settings.k8form,{});
                                  var ok8form=JSON.parse(JSON.stringify(settings.k8form));
                                  delete(ok8form.selector);
                                  html=k8form.createform(ok8form);
                                  html=ReplacePlaceholder(settings.html[object]['recinput'],{"js_dataform":html},settings.masterdata.placeholder_mode,undefined,undefined,settings);
                                }
                              }else{
                                html=replaceline(el_rec_record,settings.html[object]['recinput'],dat_p,dat_p['index'],dat_p['keyvalue']);
                              }
                              replaceline(el_rec_record,html,dat_p,dat_p['index'],dat_p['keyvalue']);
                            }else{
                              console.log("settings.html."+object+'.recinput not set!');
                            }
                            break;
                        case 8: // master data form
                            break;
                        case 9: // link in this window
                            url=path+settings.masterdata.url_edit+'&returnflag=3&keyvalue=0';
                            window.location.href=url;
                            break;
                        case 10: // call back function
                            var el_rec_records=$(el_rec_container).find('.js_rec_records').first()[0];
                            var objtemp=el_rec_container.dataset.rec_object;
                            if(settings.masterdata.dataNew || settings.masterdata.cbcatNew){
                                var el_rec_recmain=$(el_list).find(el_this).parents('.js_rec_record').last()[0];
                                var indexes={};
                                var indexarray=[];
                                indexarray.unshift(objtemp);
                                var dat={};
                                if(el_rec_recmain){
                                    var index=el_rec_recmain.dataset.rec_index;
                                    dat=data[index];
                                    
                                    var el_rec_lfd=$(el_rec_container).parents('.js_rec_record')[0];
                                    var level=0;
                                    do{
                                        var el_rec_contlfd=$(el_rec_lfd).parents('.js_rec_container')[0];
                                        var indexlfd=el_rec_lfd.dataset.rec_index;
                                        var arrayname=el_rec_contlfd.dataset.rec_object;
                                        indexes[arrayname]=indexlfd;
                                        el_rec_lfd=$(el_rec_contlfd).parents('.js_rec_record')[0];
                                        if(!gbnull(arrayname)){
                                          indexarray.unshift(indexlfd);
                                          indexarray.unshift(arrayname);
                                        }
                                        level++
                                    }while(typeof(el_rec_lfd)!=="undefined")
                                }
                                if(settings.masterdata.dataNew)settings.masterdata.dataNew(el_rec_container,dat,indexes);
                                //if(settings.masterdata.cbcatNew){settings.masterdata.cbcatNew({"el_rec_container":el_rec_container,"object":objtemp,"el_rec_records":el_rec_records,"dat":dat,"indexes":indexes,"indexarray":indexarray});
                                cb(settings,'cbcatNew',{"settings":settings,"el_list":el_list,"el_rec_container":el_rec_container,"object":objtemp,"el_rec_records":el_rec_records,"dat":dat,"indexes":indexes,"indexarray":indexarray});
                            }
                            break;
                        case 11: // object
                            //addrecord(el_rec_container)
                            var el_rec_records=$(el_rec_container).find('.js_rec_records').first()[0];
                            var objtemp=el_rec_container.dataset.rec_object;
                            
                            var el_rec_recmain=$(el_list).find(el_this).parents('.js_rec_record').last()[0];
                            var indexes={};
                            var indexarray=[];
                            indexarray.unshift(objtemp);
                            var dat={};
                            if(el_rec_recmain){
                                var index=el_rec_recmain.dataset.rec_index;
                                dat=data[index];

                                var el_rec_lfd=$(el_rec_container).parents('.js_rec_record')[0];
                                var level=0;
                                do{
                                    var el_rec_contlfd=$(el_rec_lfd).parents('.js_rec_container')[0];
                                    var indexlfd=el_rec_lfd.dataset.rec_index;
                                    var arrayname=el_rec_contlfd.dataset.rec_object;
                                    indexes[arrayname]=indexlfd;
                                    el_rec_lfd=$(el_rec_contlfd).parents('.js_rec_record')[0];
                                    if(!gbnull(arrayname)){
                                      indexarray.unshift(indexlfd);
                                      indexarray.unshift(arrayname);
                                    }else{
                                      indexarray.unshift(indexlfd);
                                    }
                                    level++
                                }while(typeof(el_rec_lfd)!=="undefined")
                            }
                            var template="recedit";
                            var default_values={};
                            var line=ReplacePlaceholder(settings.html[objtemp][template],default_values,2,undefined,k8formatter,settings.tabulator.columns,settings);
                            var el_rec_record=$(line).appendTo(el_rec_records)[0];
                            el_rec_record.dataset.rec_index=-1;
                            
                            if(el_rec_record){
                                $(el_rec_record).find('input:visible,select:visible,textarea:visible').first().focus();
                                $(el_rec_record).find('.js_rec_delete').hide();
                                $(el_rec_record).find('.js_rec_edit').hide();
                                $(el_rec_record).find('.js_rec_cancel').show();
                                //$(el_rec_record).find('.js_rec_save').show();
                                //$(el_rec_record).find('.js_rec_save').prop("disabled",false);
                                var el_marker=$(el_rec_record).find('.js_contain_submit')[0];
                                if(!el_marker){
                                    el_marker=$(el_rec_record).find('.recordmarker')[0];
                                }
                                if(el_marker){
                                    $(el_marker).append(settings.masterdata.lineeditsubmit);
                                }

                            }else{
                                console.log('el_rec_record not found!');
                            }
                            
                            if(settings.masterdata.dataNew)settings.masterdata.dataNew(el_rec_container,dat,indexes);
                            if(settings.masterdata.cbcatNew)settings.masterdata.cbcatNew({"el_rec_container":el_rec_container,"object":objtemp,"el_rec_records":el_rec_records,"dat":dat,"indexes":indexes,"indexarray":indexarray});
                                          
                            break;
                        default:
                            console.log('type not defined');
                    }
                }
            }
           
            function Event_js_rec_edit(e){
                let el_this=e.target;
                
                console.log("event .js_rec_edit");
                if(!$(el_this).hasClass('js_disabled')){
                    if(edittype==1 || edittype==6 || edittype==7 || edittype==8)controlDisabled(true);
                    var el_rec_contmain=$(el_list).find(el_this).parents(settings.masterdata.selector+' .js_rec_container').last()[0];
                    var el_rec_recmain=$(el_list).find(el_this).parents(settings.masterdata.selector+' .js_rec_record').last()[0];
                    var index=el_rec_recmain.dataset.rec_index;
                    var el_rec_container=$(el_this).parents('.js_rec_container')[0];
                    var el_rec_record=$(el_this).parents('.js_rec_record')[0];
                    var keyvalue=el_rec_record.dataset.keyvalue; //data[index][settings.key]
                    settings.masterdata.window_mode=edittype;
                    switch(edittype){
                        case 0: // deprecated link in this window
                            url=path+settings.masterdata.url_edit+'&keyvalue='+keyvalue+'&returnflag=2';
                            window.location.href=url;
                            break;
                        case 1: // innerhtml, current record or 2 with "js_rec_record_current"
                            let new_settings={};
                            let searchparams=new URLSearchParams(settings.masterdata.url_edit); 
                            let datadefID_edit=searchparams.get('datadefID');
                            if(datadefID==-1||datadefID_edit==settings.datadefID){
                              //new_settings=JSON.parse(JSON.stringify(settings));
                              new_settings=settings;
                            }else{
                              new_settings=window['settings'+datadefID_edit];
                              if(new_settings){
                                new_settings.masterdata.edittype=settings.masterdata.edittype;
                                new_settings.masterdata.window_mode=settings.masterdata.edittype;
                              }else{
                                console.error('datadefID '+datadefID_edit+' is not loaded!');
                                return;
                              }
                            }
                          
                            new_settings.masterdata.keyvalue=keyvalue;
                            new_settings.masterdata.notabulator=true;
                            new_settings.masterdata.htag="h2";
                            new_settings.name=getl('New / Edit');
                            new_settings.return={};
                            new_settings.return.replaceRecord=replaceRecord;
                            new_settings.return.selector='.js_rec_record[data-keyvalue="'+keyvalue+'"]';
                            new_settings.return.js_rec_record=el_rec_record;
                            new_settings.return.recordhtml=el_rec_record.innerHTML;
                            new_settings.return.controlDisabled=controlDisabled;

                            var el=$(el_rec_record).find('.js_inlineform')[0];
                            if(el){
                              $(el).empty();
                              $(el).append('<div class="masterdata"></div>');
                              el=$(el_rec_record).find('.masterdata')[0];
                              masterdata=$(el).masterdata(new_settings);
                            }else{
                              console.log("missing .js_inlineform");
                            }
                            break;
                        case 2: // innerhtml
                        case 3: // overlay innerhtml
                            createOverlay(keyvalue);
                            break;
                        case 4: // new tab
                            if(settings.masterdata.url_edit){
                                //var url='index.php?page=form&datadefID='+settings.datadefID+'&page_mode=2&keyvalue='+cell.getData()[settings.key];
                                var url=path+settings.masterdata.url_edit+'&returnflag=3&returnopener=1&sourcedatadefalias='+getfromArray(settings,'datadefalias')+'&sourcedatadefID='+settings.datadefID+'&sourceelement='+settings.sourceelement+'&keyvalue='+keyvalue;
                                // set index for return
                                var w=window.open(url,"Edit");
                                w.focus();
                                //window.location.assign(url);
                            }else{
                                alert('please set url_edit!');
                            }
                            break;
                        case 5: // new window
                            if(settings.masterdata.url_edit){
                                var url=path+settings.masterdata.url_edit+'&returnflag=3&returnopener=1&sourcedatadefalias='+getfromArray(settings,'datadefalias',settings.datadefID)+'&sourceelement='+settings.sourceelement+'&keyvalue='+keyvalue;
                                var parameter="width="+window.innerWidth.toString()+",height="+window.innerHeight.toString()+",resizable=yes,scrollbars=yes";
                                parameter="top="+(window.screenY).toString()+",left="+(window.screenX).toString()+","+parameter;
                                var w = window.open(url,'Edit', parameter);
                                w.focus();
                            }
                            break;
                        case 6: // own line, same template
                            var dat=getData()[index];
                            dat['index']=index;
                            dat['keyvalue']=keyvalue;
                            
                            replaceline(el_rec_record,settings.html[object]['record'],dat,index,keyvalue);
                              
                            /*  
                            var line=ReplacePlaceholder(settings.html[object]['record'],dat,settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns);
                            //$(el_rec_record).replaceWith(line);
                            //el_rec_record=$(el_list).find('.js_rec_record[data-rec_index="'+index+'"]')[0];
                            el_rec_record=replaceElWith(el_rec_record,line);
                            
                            if(el_rec_record){
                                el_rec_record.dataset.rec_index=index;
                                el_rec_record.dataset.keyvalue=keyvalue;
                                obj2form(dat,$(el_list).find('form')[0]);
                                
                                $(el_rec_record).find('input:visible,select:visible,textarea:visible').first().focus();
                                $(el_rec_record).find('.js_rec_delete').hide();
                                $(el_rec_record).find('.js_rec_edit').hide();
                                $(el_rec_record).find('.js_rec_cancel').show();
                                //$(el_rec_record).find('.js_rec_save').show();
                                //$(el_rec_record).find('.js_rec_save').prop("disabled",false);
                                var el_marker=$(el_rec_record).find('.js_contain_submit')[0];
                                if(!el_marker){
                                    el_marker=$(el_rec_record).find('.recordmarker')[0];
                                }
                                if(el_marker){
                                    $(el_marker).append(settings.masterdata.lineeditsubmit);
                                }
                                
                                if(settings.masterdata.dataLoad) {
                                    settings.masterdata.dataLoad(el_rec_record,dat,'record');
                                }
                            }else{
                                console.log('.js_rec_record[data-rec_index="'+index+'"] not found');
                            }
                            */                                      
                            break;
                        case 7: // own line, plugin
                            var dat=getData()[index];
                            dat['index']=index;
                            dat['keyvalue']=keyvalue;
                            
                            settings.html[object]['recinput']=getfromArray(settings.html[object],'recinput','<div class="js_rec_record rec_record" data-keyvalue="{{keyvalue}}" data-rec_index="{{index}}">{{js_dataform}}<hr></div>');
                            if(isset(settings.html,object,'recinput')){
                              var placeholder="{{js_dataform}}";
                              var html;
                              if(settings.html[object]['recinput'].indexOf(placeholder)){
                                var k8form=Object.create(k8);
                                if(settings.k8form){
                                  //var ok8form=Object.assign(settings.k8form,{});
                                  var ok8form=JSON.parse(JSON.stringify(settings.k8form));
                                  delete(ok8form.selector);
                                  html=k8form.createform(ok8form);
                                  html=ReplacePlaceholder(settings.html[object]['recinput'],{"js_dataform":html},settings.masterdata.placeholder_mode,undefined,undefined,settings);
                                }
                              }else{
                                html=replaceline(el_rec_record,settings.html[object]['recinput'],dat,index,keyvalue);
                              }
                              replaceline(el_rec_record,html,dat,index,keyvalue);
                            }else{
                              console.log("settings.html."+object+'.recinput not set!');
                            }
                            break;
                        case 8: // masterdata
                            break;
                        case 9: // link in this window
                            url=path+settings.masterdata.url_edit+'&returnflag=3&keyvalue='+keyvalue;
                            window.location.href=url;
                            break;
                        case 10: // call back function
                            if(settings.masterdata.dataEdit || settings.masterdata.cbcatEdit){
                                //var dat=getData()[index];
                                var dat_p=data[index];
                                var indexes={};
                                var el_rec_lfd=el_rec_record;
                                do{
                                    var el_rec_contlfd=$(el_rec_lfd).parents('.js_rec_container')[0];
                                    var indexlfd=Number(el_rec_lfd.dataset.rec_index);
                                    var arrayname=el_rec_contlfd.dataset.rec_object;
                                    indexes[arrayname]=indexlfd;
                                    el_rec_lfd=$(el_rec_contlfd).parents('.js_rec_record')[0];
                                }while(typeof(el_rec_lfd)!=="undefined")
                                //dat_p['index']=index;
                                //dat_p['keyvalue']=keyvalue;
                                if(settings.masterdata.dataEdit)settings.masterdata.dataEdit(el_rec_container,el_rec_record,dat_p,indexes);
                                //if(settings.masterdata.cbcatEdit)settings.masterdata.cbcatEdit({"el_rec_container":el_rec_container,"el_rec_record":el_rec_record,"dat":dat_p,"indexes":indexes});
                                cb(settings,'cbcatEdit',{"settings":settings,"el_list":el_list,"el_rec_container":el_rec_container,"el_rec_record":el_rec_record,"dat":dat_p,"indexes":indexes});
                            }
                            break
                        case 11: // object
                            var objtemp=el_rec_container.dataset.rec_object;
                            var dat=data[index];
                            if(gbnull(objtemp)){
                              //1st level
                            }else{
                              var indexes={};
                              var indexarray=[];
                              var el_rec_lfd=el_rec_record;
                              do{
                                  var el_rec_contlfd=$(el_rec_lfd).parents('.js_rec_container')[0];
                                  var indexlfd=Number(el_rec_lfd.dataset.rec_index);
                                  var arrayname=el_rec_contlfd.dataset.rec_object;
                                  indexes[arrayname]=indexlfd;
                                  if(!gbnull(arrayname)){
                                    indexarray.unshift(indexlfd);
                                    indexarray.unshift(arrayname);
                                  }else{
                                    indexarray.unshift(indexlfd);
                                  }
                                  el_rec_lfd=$(el_rec_contlfd).parents('.js_rec_record')[0];
                              }while(typeof(el_rec_lfd)!=="undefined");
                              console.log(indexarray);
                              // replace line
                              var indexsub=Number(el_rec_record.dataset.rec_index);
                              var html="";
                              if(isset(settings.html,objtemp,'recedit')){
                                html=settings.html[objtemp].recedit;
                                var datsub=getObjectValuefromIndexArray(data,indexarray);
                                var el_edit_container=$(el_rec_record).find('.js_edit_container')[0];
                                if(el_edit_container){
                                  var line=ReplacePlaceholder(html,datsub,settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns,settings);
                                  el_edit_container.innerHTML=line;
                                  var el_marker=$(el_rec_record).find('.js_contain_submit')[0];
                                  if(!el_marker){
                                      el_marker=$(el_rec_record).find('.recordmarker')[0];
                                  }
                                  if(el_marker){
                                      $(el_marker).append(settings.masterdata.lineeditsubmit);
                                  }
                                  var el_form=$(el_list).find('.js_list_form')[0];
                                  if(el_form){
                                    obj2form(datsub,el_form);
                                  }else{
                                    console.log('replaceline .js_list_form not set!');
                                  }
                                  // something more !!!
                                }else{
                                  replaceline(el_rec_record,html,datsub,indexsub,keyvalue);
                                }
                              }else{
                                console.log('settings.html.'+objtemp+'.recedit not set');
                              }
                            }                            
                            if(settings.masterdata.dataEdit || settings.masterdata.cbcatEdit){
                                if(settings.masterdata.dataEdit)settings.masterdata.dataEdit(el_rec_container,el_rec_record,dat,indexes);
                                //if(settings.masterdata.cbcatEdit)settings.masterdata.cbcatEdit({"el_rec_container":el_rec_container,"el_rec_record":el_rec_record,"dat":dat,"indexes":indexes});
                                cb(settings,'cbcatEdit',{"settings":settings,"el_list":el_list,"el_rec_container":el_rec_container,"el_rec_record":el_rec_record,"dat":dat,"indexes":indexes});
                            }
                            break
                        default:
                            console.log('type not defined');
                    }
                }
            //});
            }

            function Event_js_rec_delete(e){
                let el_this=e.target;
              
                if(!$(el_this).hasClass('js_disabled')){
                    e.stopPropagation();
                    if(confirm(getl('Delete?'))){
                        var el_rec_containers=$(el_list).find(el_this).parents(settings.masterdata.selector+' .js_rec_container');
                        var el_rec_record=$(el_this).parents('.js_rec_record')[0];
                        var index=el_rec_record.dataset.rec_index;
                  
                        if(edittype==10){
                            //if(settings.masterdata.dataDelete)settings.masterdata.dataDelete(el_rec_record,dat,indexes);
                              //if(settings.masterdata.cbcatDelete)settings.masterdata.cbcatDelete({"el_rec_record":el_rec_record,"dat":dat,"indexes":indexes});
                            if(settings.masterdata.cbcatEdit){
                              var dat=getData()[index];
                              cb(settings,'cbcatDelete',{"settings":settings,"el_list":el_list,"el_rec_record":el_rec_record,"dat":dat,"index":index,"indexes":indexes,"data":data});
                            }else if(settings.masterdata.dataDeldata){
                              var el_rec_record=$(el_this).parents('.js_rec_record')[0];
                              settings.masterdata.dataDeldata(el_rec_record,data);
                            }else if(settings.masterdata.dataDelete || settings.masterdata.cbcatDelete){
                                var el_rec_record=$(el_this).parents('.js_rec_record')[0];
                                var el_rec_recmain=$(el_list).find(el_this).parents('.js_rec_record').last()[0];
                                var index=el_rec_recmain.dataset.rec_index;
                                var dat=data[index];
                                var indexes={};
                                var el_rec_lfd=el_rec_record;
                                do{
                                    var el_rec_contlfd=$(el_rec_lfd).parents('.js_rec_container')[0];
                                    var indexlfd=Number(el_rec_lfd.dataset.rec_index);
                                    var arrayname=el_rec_contlfd.dataset.rec_object;
                                    indexes[arrayname]=indexlfd;
                                    el_rec_lfd=$(el_rec_contlfd).parents('.js_rec_record')[0];
                                }while(typeof(el_rec_lfd)!=="undefined")
                                if(settings.masterdata.dataDelete)settings.masterdata.dataDelete(el_rec_record,dat,indexes);
                                //if(settings.masterdata.cbcatDelete)settings.masterdata.cbcatDelete({"el_rec_record":el_rec_record,"dat":dat,"indexes":indexes});
                                cb(settings,'cbcatDelete',{"settings":settings,"el_list":el_list,"el_rec_record":el_rec_record,"dat":dat,"indexes":indexes});
                            }else{
                                console.log('masterdata.dataDelete and masterdata.cbcatDelete not defined');
                            }
                        }else if(el_rec_containers.length==1){
                            deleteRecord(el_rec_record);
                        }else{
                           var indexes=getIndexesfrom(el_rec_record);
                           console.log(indexes);
                        }
                    }
                }
            }

            function Event_js_rec_cancel(e){
                  let el_this=e.target;

                  if(edittype==10 || edittype==11){
                      var el_rec_record=$(el_this).parents('.js_rec_record')[0];
                      var el_form=$(el_this).parents('form')[0];
                      var el_rec_recmain=$(el_list).find(el_this).parents('.js_rec_record').last()[0];
                      var index_main=el_rec_recmain.dataset.rec_index;
                      var index=el_rec_record.dataset.rec_index;
                      var dat_main=data[index_main];
                      var indexes={};
                      var indexarray=[];
                      var el_rec_lfd=el_rec_record;
                      do{
                          var el_rec_contlfd=$(el_rec_lfd).parents('.js_rec_container')[0];
                          var indexlfd=Number(el_rec_lfd.dataset.rec_index);
                          var arrayname=el_rec_contlfd.dataset.rec_object;
                          indexes[arrayname]=indexlfd;
                          if(!gbnull(arrayname)){
                            indexarray.unshift(indexlfd);
                            indexarray.unshift(arrayname);
                          }else{
                            indexarray.unshift(indexlfd);
                          }
                          el_rec_lfd=$(el_rec_contlfd).parents('.js_rec_record')[0];
                      }while(typeof(el_rec_lfd)!=="undefined")
                      if(edittype==11){
                        if(index==-1){
                          el_rec_record.remove();
                        }else{
                          var el_rec_containers=$(el_this).parents('.js_rec_container')[0];
                          var objtemp=el_rec_containers.dataset.rec_object;
                          var template=settings.html[objtemp].record;

                          var dat_sub=getObjectValuefromIndexArray(data,indexarray);
                          var line=ReplacePlaceholder(template,dat_sub,settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns,settings);
                          el_rec_record=replaceElWith(el_rec_record,line);
                          el_rec_record.dataset.rec_index=indexarray[indexarray.length-1];
                          var key=getfromArray(settings.childcollection[objtemp],'key');
                          el_rec_record.dataset.keyvalue=dat_sub[key];
                        }
                        if(settings.masterdata.dataCancel || settings.masterdata.cbcatCancel){
                            if(settings.masterdata.dataCancel)settings.masterdata.dataCancel(el_form,dat,indexes);
                            //if(settings.masterdata.cbcatCancel)settings.masterdata.cbcatCancel({"el_form":el_form,"dat":dat,"indexes":indexes});
                            cb(settings,'cbcatCancel',{"settings":settings,"el_list":el_list,"el_form":el_form,"dat":dat,"indexes":indexes});
                        }else{
                            //console.log('masterdata.dataCancel and masterdata.cbcatCancel not defined');
                        }
                      }else{
                        if(settings.masterdata.dataCancel || settings.masterdata.cbcatCancel){
                            if(settings.masterdata.dataCancel)settings.masterdata.dataCancel(el_form,dat_main,indexes);
                            //if(settings.masterdata.cbcatCancel)settings.masterdata.cbcatCancel({"el_form":el_form,"dat":dat_datmain,"indexes":indexes});
                            cb(settings,'cbcatCancel',{"settings":settings,"el_list":el_list,"el_form":el_form,"dat":dat_datmain,"indexes":indexes});
                        }else{
                            //console.log('masterdata.dataCancel and masterdata.cbcatCancel not defined');
                        }
                      }  
                  }else{
                      var el_rec_record=$(el_this).parents('.js_rec_record')[0];
                      var el_rec_records=$(el_this).parents('.js_rec_records')[0];
                      var keyvalue=el_rec_record.dataset.keyvalue;
                      if(isNaN(keyvalue))keyvalue=0;
                      var rec_index=Number(el_rec_record.dataset.rec_index);
                      if(rec_index==-1){
                          el_rec_record.remove();
                      }else{
                          var index=el_rec_record.dataset.rec_index;
                          var dat=getData()[index];
                          dat['keyvalue']=keyvalue;
                          dat['index']=index;
                          var template='record';
                          if(settings.masterdata.edittype==6){
                            if(settings.html[object]['recdisp']){
                              template='recdisp';
                              var line=ReplacePlaceholder(settings.html[object][template],dat,settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns,settings);
                              $(el_rec_record).replaceWith(line)[0];
                              el_rec_record=$(el_rec_records).find('.js_rec_record[data-keyvalue="'+keyvalue+'"]')[0];
                              conditional_output(el_rec_record,dat);
                            }else{
                              input2display(el_rec_record,dat);
                            }
                          }else{
                            template='record';
                            var line=ReplacePlaceholder(settings.html[object][template],dat,settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns,settings);
                            el_rec_record=replaceElWith(el_rec_record,line);
                          }
                          $(el_rec_record).find('.js_rec_delete').show();
                          $(el_rec_record).find('.js_rec_edit').show();
                          $(el_rec_record).find('.js_rec_cancel').hide();
                          //$(el_rec_record).find('.js_rec_save').hide();
                          //$(el_rec_record).find('.js_rec_save').prop("disabled",true);
                          $(el_rec_record).find('.js_rec_save').remove();

                          if(settings.masterdata.dataLoad) {
                              settings.masterdata.dataLoad(el_rec_record,dat,template);
                          }
                          cb(settings,'cbcatCancel',{"settings":settings,"el_list":el_list,"el_rec_record":el_rec_record,"dat":dat,"template":template});
                      }
                      if(edittype==6 || edittype==7)controlDisabled(false);
                  }
              }
            
            $(el_list).on("click",".js_rec_test",function(){
                if(!$(this).hasClass('js_disabled')){
                  var el_rec_record=$(this).parents('.js_rec_record')[0];
                  var indexes=getIndexesfrom(el_rec_record);
                  console.log(indexes);
                  /*
                  if(indexes.length>0){
                    var onew=[];
                    onew[indexes.length-1]=data;
                    for(var i=indexes.length-2;i>=0;i--){
                      console.log(indexes[i]);
                      onew[i]=onew[i+1][indexes[i]];
                    }
                    console.log('found:');
                    console.log(onew[0]);
                    delete(onew[0]);
                    console.log(data);
                  }
                  */
                  objdelete(data,indexes,indexes.length-1);
                  console.log(data);
                  
                  function objdelete(obj,indexes,i){
                    if(i>1){
                      i--;
                      objdelete(obj[indexes[i]],indexes,i);
                    }else{
                      delete obj[indexes[i+1]];
                    }
                  }
                  function objedit(obj,indexes,i){
                    if(i>1){
                      i--;
                      objedit(obj[indexes[i]],indexes,i);
                    }else{
                      console.log(obj[indexes[i+1]]);
                      
                      var index=el_rec_recmain.dataset.rec_index;
                      var keyvalue=el_rec_record.dataset.keyvalue; 
                      var record="";
                      var dat=obj[indexes[i+1]];
                      var dat=getData()[index];
                      dat['index']=index;
                      dat['keyvalue']=keyvalue;
                      
                      replaceline(el_rec_record,settings.html[object][record],dat,index,keyvalue);

                    }
                  }
                }
            });
            
            function replaceline(el_rec_record,html,dat,index,keyvalue){
              // js_list_form
              var line=ReplacePlaceholder(html,dat,settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns,settings);
              el_rec_record=replaceElWith(el_rec_record,line);
              //$(el_rec_record).replaceWith(line);
              
              conditional_output(el_rec_record,dat);

              if(el_rec_record){
                  el_rec_record.dataset.rec_index=index;
                  el_rec_record.dataset.keyvalue=keyvalue;
                  var el_form=$(el_list).find('.js_list_form')[0];
                  if(el_form){
                    obj2form(dat,$(el_list).find('.js_list_form')[0]);
                  }else{
                    console.log('replaceline .js_list_form not set!');
                  }
                  $(el_rec_record).find('input:visible,select:visible,textarea:visible').first().focus();
                  $(el_rec_record).find('.js_rec_delete').hide();
                  $(el_rec_record).find('.js_rec_edit').hide();
                  $(el_rec_record).find('.js_rec_cancel').show();
                  //$(el_rec_record).find('.js_rec_save').show();
                  //$(el_rec_record).find('.js_rec_save').prop("disabled",false);
                  var el_marker=$(el_rec_record).find('.js_contain_submit')[0];
                  if(!el_marker){
                      el_marker=$(el_rec_record).find('.recordmarker')[0];
                  }
                  if(el_marker){
                      $(el_marker).append(settings.masterdata.lineeditsubmit);
                  }

                  if(settings.masterdata.dataLoad) {
                      settings.masterdata.dataLoad(el_rec_record,dat,'record');
                  }
                  /*
                  if(settings.masterdata.cbcatLoad) {
                      settings.masterdata.cbcatLoad({"settings":settings,"el_rec_record":el_rec_record,"dat":dat,'record':'record'});
                  }
                  */
                  cb(settings,'cbcatLoad',{"settings":settings,"el_list":el_list,"el_rec_record":el_rec_record,"dat":dat,'record':'record'});
              }else{
                  console.log('.js_rec_record[data-rec_index="'+index+'"] not found');
              }
            }
            
            function reachbottom(){
                var scrollable=document.documentElement.scrollHeight-window.innerHeight;
                var scrolled=window.scrollY;
                if(scrolled=scrollable){
                    window.removeEventListener('scroll',reachbottom);
                    alert('You ve reached the bottom');
                    // offset lesen nachladen
                }
            }
            
            function controlDisabled(disabled){
                if(disabled){
                    $(el_list).find('.js_rec_delete, .js_rec_new, .js_rec_edit').addClass('js_disabled');
                    $(el_list).find('.js_rec_delete, .js_rec_new, .js_rec_edit').attr('disabled',true);
                }else{
                    //$(el_form).find('.js_rec_new, .js_rec_edit').removeClass('js_disabled');
                    $(el_list).find('.js_rec_delete, .js_rec_new, .js_rec_edit').removeClass('js_disabled');
                    $(el_list).find('.js_rec_delete, .js_rec_new, .js_rec_edit').attr('disabled',false);
                }
            }

            function disableFormControls(disabled){
                if(disabled){
                    $(el_form).find('.js_rec_new, .js_rec_delete, .js_rec_control').addClass('js_disabled');
                }else{
                    $(el_form).find('.js_rec_new, .js_rec_delete, .js_rec_control').removeClass('js_disabled');
                }
            }            
            
            function createOverlay(keyvalue){
                //keyvalue==0 ->New
                var selector='';
                if(settings.masterdata.window_mode==3){
                    //overlay
                    var width=Math.round(window.innerWidth*0.9);
                    if(width>1170)width=1170;
                    var html='<div id="k8-overlay">' +
                                '<div style="width: '+width+'px">' +
                                    '<div style="text-align: right; padding-right: 6px"><a style="cursor:pointer;" id="btnOverlay">&times;</a></div>'+
                                    '<div style="padding: 0 20px 20px 20px" id="overlay_content">'+
                                        '<div class="masterdata">' +
                                    '</div>'+
                                '</div>'+
                            '</div>';
                    $(el_list).append(html);
                    var el_md=document.getElementById('k8-overlay');
                    $(el_md).find('#btnOverlay').on('click',function(e){
                        e.preventDefault();
                        $("#k8-overlay").remove();
                    });
                    selector='#k8-overlay .masterdata';
                }else if(settings.masterdata.window_mode==2){
                    //innerhtml
                    //template in line
                    selector=settings.masterdata.edit_selector;
                /*
                }else if(settings.masterdata.window_mode==7){
                    // nothing
                    var el_rec_record;
                    if(gbnull(keyvalue)){
                        // prepend empty record
                        // data[] vorsehen
                        //var line=ReplacePlaceholder(settings['js_rec_record'][object],index_obj,settings.masterdata.placeholder_mode,path)                    
                        var line=ReplacePlaceholder(settings.html[object]['record'],index_obj,settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns)                    
                        $(el_rec_records).prepend(line);
                        el_rec_record=$(el_md).find('.js_rec_record[data-keyvalue="[keyvalue]"')[0];
                    }else{
                        el_rec_record=$(el_md).find('.js_rec_record[data-keyvalue="'+keyvalue+'"]')[0];
                    }
                    $(el_rec_record).empty();
                    $(el_rec_record).append('<div class="masterdata"></div>');
                    selector=".masterdata";
                */
                }else{
                    console.log(settings.masterdata.window_mode+' not valid!');
                    return
                }
                // element, data, keyvalue, filters, clause
                controlDisabled(true);
                var element='masterdata'; //!!!
                switch(element){
                    case 'masterdata':
                        let new_settings={};
                        let searchparams=new URLSearchParams(settings.masterdata.url_edit); 
                        let datadefID_edit=searchparams.get('datadefID');
                        if(datadefID==-1||datadefID_edit==settings.datadefID){
                          //new_settings=JSON.parse(JSON.stringify(settings));
                          new_settings=settings;
                        }else{
                          new_settings=window['settings'+datadefID_edit];
                          if(new_settings){
                            new_settings.masterdata.edittype=settings.masterdata.edittype;
                            new_settings.masterdata.window_mode=settings.masterdata.edittype;
                            new_settings.masterdata.edit_selector=settings.masterdata.edit_selector;
                          }else{
                            console.error('datadefID '+datadefID_edit+' is not loaded!');
                            return;
                          }
                        }
                        new_settings.masterdata.notabulator=true;
                        new_settings.masterdata.keyvalue=keyvalue;
                        new_settings.masterdata.htag="h2";
                        new_settings.name=getl('New / Edit');
                        new_settings.return={};
                        new_settings.return.controlDisabled=controlDisabled;
                        if(gbnull(keyvalue)){
                            // insertRecord when New
                            new_settings.return.insertRecord=insertRecord;
                        }else{
                            new_settings.return.replaceRecord=replaceRecord;
                            new_settings.return.selector='.js_rec_record[data-keyvalue="'+keyvalue+'"]';
                        }
                        //$(selector).masterdata(new_settings);
                        let el_selmain=$(selector)[0];
                        let masterdata_sub=$(el_selmain).masterdata(new_settings);
                        if(el_selmain.style.display="none")$(el_selmain).slideDown("slow");

                        break;
                    case 'catalog':
                        //htmlout
                        $(el_md).find(selector).catalog(settings);
                        break;
                    default:
                        console.log('element='+element+' not valid!');
                }
            }
            
            function buildformfilter(el_filterform,el_clicked){
                var ff=[]; //[{"field":"year","type":"=","value":year},{"field":"effect","type":"&","value":effect}];
                var clause="";
                let dat_filter={};
                
                if(el_filterform){
                  if(settings.masterdata.filterobject){
                    if(settings.masterdata.filterobject.formcollection){
                      for(var field in settings.masterdata.filterobject.formcollection){
                        clause=buildformfilterfromfield(el_filterform,settings.masterdata.filterobject.formcollection[field],ff,clause);
                      }
                    }else{
                      var fields=settings.masterdata.filterobject.fields;
                      for(var i=0;i<fields.length;i++){
                        let field=fields[i];
                        clause=buildformfilterfromfield(el_filterform,field,ff,clause);
                      }

                    }
                  }
                  if(el_clicked){
                    dat_filter=form2obj(el_filterform);
                  }
                }
                let bfilter=!gbnull(clause)||ff.length>0;
                
                // default
                settings.masterdata.data_readfilter.clause=settings.masterdata.clause;
                settings.masterdata.data_readfilter.filters=getfromArray(settings.masterdata,"filters",[]);
                if(settings.masterdata.filters_catalog)settings.masterdata.data_readfilter.filters.push(settings.masterdata.filters_catalog);
                if(settings.masterdata.keyvalue)settings.masterdata.data_readfilter.filters.push({"field":settings.key,"type":"=","value":settings.masterdata.keyvalue});
                if(settings.masterdata.displayvalue)settings.masterdata.data_readfilter.filters.push({"field":settings.displaycolumn,"type":"=","value":settings.masterdata.displayvalue});
              
                let filtermode=getfromArray(settings.masterdata.filterobject,'filtermode',1);
                if(filtermode==1){ // clause
                  settings.masterdata.data_readfilter.clause=gsclauseand(settings.masterdata.data_readfilter.clause,clause,!gbnull(clause));
                }else{
                  // array filters
                  ff.forEach(function(filter){
                    settings.masterdata.data_readfilter.filters.push(filter);
                  });
                }
                
                settings.masterdata.disp_tabulator=(settings.masterdata.disprecdirect==1);
                if(el_clicked){
                  settings.masterdata.disp_tabulator=true;
                }else{
                  if(settings.masterdata.disprecdirect==2 && bfilter)settings.masterdata.disp_tabulator=true;
                }
                //cb(settings,'cbBeforeFilter',{"settings":settings,"el_md":el_md,"dat_filter":dat_filter,"el_clicked":el_clicked})
                cb(settings,'cbcatBeforeFilter',{"settings":settings,"el_list":el_list,"dat_filter":dat_filter,"el_clicked":el_clicked})
                return settings.masterdata.disp_tabulator;
            }
            
            function buildformfilterfromfield(el_filterform,field,ff,clause){
              if(field['operator']){
                var name=getfromArray(field,'name',getfromArray(field,'fieldname'));
                var filterfield=name;
                if(field['table']){
                  filterfield=getfromArray(field,'table')+'.'+filterfield
                }
                field.figure=getfromArray(field,'figure',0);
                if(field.figure==2){
                    var el=el_filterform.elements.namedItem(name+'from');
                    if(el){
                        if(el.value!=="undefined"){
                            let value=el.value;
                            let value_ignore=getfromArray(field,'value_ignore','')
                            if(value!=value_ignore){
                              ff.push({"field":filterfield,"type":">=","value":value});
                              clause=gsclauseand(clause,filterfield+'>='+gsstr2sql(value));
                            }
                        }
                    }else{
                        console.log(name+'from dont exist!');
                    }
                    var el=el_filterform.elements.namedItem(name+'to');
                    if(el){
                        if(el.value!=="undefined"){
                            let value=el.value;
                            let value_ignore=getfromArray(field,'value_ignore','')
                            if(value!=value_ignore){
                              ff.push({"field":filterfield,"type":"<=","value":value});
                              clause=gsclauseand(clause,filterfield+'<='+gsstr2sql(value));
                            }
                        }
                    }else{
                        console.log(name+'to dont exist!');
                    }
                }else{
                    var el=el_filterform.elements.namedItem(name);
                    if(el){
                        if(el.value!=="undefined"){
                            let value=el.value;
                            let value_ignore=getfromArray(field,'value_ignore','')
                            if(value!=value_ignore){
                              ff.push({"field":filterfield,"type":field['operator'],"value":value});
                              let operator=field['operator'];
                              if(operator=='like'){
                                clause=gsclauseand(clause,filterfield+' like '+gsstr2sql('%'+value+'%'));
                              }else{
                                clause=gsclauseand(clause,filterfield+operator+gsstr2sql(value));
                              }
                            }
                        }
                    }else{
                        console.log(name+' dont exist!');
                    }
                }
              }
              return clause;
            }

            function buildfilter(dat_filter,field,ff,clause){
              if(field['operator']){
                var name=getfromArray(field,'name',getfromArray(field,'fieldname'));
                var filterfield=name;
                if(field['table']){
                  filterfield=getfromArray(field,'table')+'.'+filterfield
                }
                field.figure=getfromArray(field,'figure',0);
                if(field.figure==2){
                  if(dat_filter[name+'from']){
                    let value=dat_filter[name+'from'];
                    if(!gbnull(value)){
                      ff.push({"field":filterfield,"type":">=","value":value});
                      clause=gsclauseand(clause,filterfield+'>='+gsstr2sql(value));
                    }
                  }
                  if(dat_filter[name+'from']){
                    let value=dat_filter[name+'from'];
                    if(!gbnull(value)){
                      ff.push({"field":filterfield,"type":"<=","value":value});
                      clause=gsclauseand(clause,filterfield+'<='+gsstr2sql(value));
                    }
                  }
                }else{
                  if(dat_filter[name+'from']){
                    let value=dat_filter[name+'from'];
                    if(!gbnull(value)){
                      ff.push({"field":filterfield,"type":field['operator'],"value":value});
                      let operator=field['operator'];
                      if(operator=='like'){
                        clause=gsclauseand(clause,filterfield+' like '+gsstr2sql('%'+value+'%'));
                      }else{
                        clause=gsclauseand(clause,filterfield+operator+gsstr2sql(value));
                      }
                    }
                  }
                }
              }
              return clause;
            }
              
            function loaddata(ppageno,pmytable_limit){
                if(isset(settings,'masterdata','url_readfilter') && isset(settings,'masterdata','data_readfilter')){
                    url=path+settings.masterdata.url_readfilter;
                    //var clause=getfromArray(settings.masterdata,'clause');
                    //url=gsclauseand(url,'clause='+clause,!gbnull(clause),'&');
                    
                    var params=settings.masterdata.data_readfilter;
                    /*
                    params.filters=[];
                    params.clause=getfromArray(settings.masterdata,'clause');
                    if(isset(settings,'masterdata','filters')){
                        params.filters=settings.masterdata.filters;
                    }
                    */
                    
                    if(settings.masterdata.paginationsize>0){
                        if(settings.masterdata.pagination=='internal'){
                            mytable_limit=settings.masterdata.paginationsize;
                            if(typeof pmytable_limit!=='undefined') mytable_limit=pmytable_limit;
                            if(typeof ppageno!=='undefined'){
                                pageno=ppageno;
                                mytable_offset=(pageno-1)*mytable_limit;
                            }
                            params.mytable_offset=mytable_offset;
                            params.mytable_limit=mytable_limit;
                        }else{
                            pageno=getfromArray(Array_GET(),'pageno',1);
                            params.mytable_limit=getfromArray(Array_GET(),'mytable_limit',settings.masterdata.paginationsize);
                            var t=(getfromArray(Array_GET(),'pageno',1)-1)*params.mytable_limit;
                            //params.mytable_offset=getfromArray(Array_GET(),'mytable_offset',0);
                            params.mytable_offset=t;
                        }
                    }else if(settings.masterdata.sql_limit){
                        params.mytable_offset=0;
                        params.mytable_limit=settings.masterdata.sql_limit;
                    }
                    $.getJSON(url,params,function(oJson) {
                        data=oJson.slice();
                        $plugin.data("data",data);
                        console.log( "loaddata.data.length: " + data.length);
                        displaydata(el_records,data,object);
                    })
                    .fail(function(jqxhr, textStatus, error ) {
                        var err = textStatus + ", " + error;
                        console.log( "data load, Request Failed: " + err );
                    });
                }else{
                    console.log('settings.masterdata.url_readfilters not set');
                }
            }

            function displaydata(el_records,data,object){
                level_nested++;
                var el_rec_container=$(el_records).parents('.js_rec_container')[0];
                if(data.length>0){
                  if(settings.html[object]){
                    var template='record';
                    if(settings.html[object]['recdisp'])template='recdisp';
                    for(var i=0;i<data.length;i++){
                        data[i]['index']=i;
                        data[i]['keyvalue']=data[i][settings.key];
                        if(settings.displayvalue)data[i]['displayvalue']=data[i][settings.displayvalue];
                        let linkcolumn=getfromArray(settings,'displaycolumn',getfromArray(settings,'headtitlecolumn'));
                        let displayvalue=getfromArray(data[i],linkcolumn);
                        if(settings.datadefID!==-1 && !gbnull(displayvalue) && GLOBALS_urlmode==1){
                          data[i]['masterdata_url_detail']=settings.datadefID+'/'+data[i][linkcolumn];
                        }else{
                          data[i]['masterdata_url_detail']=settings.masterdata.url_detail+'&keyvalue='+data[i][settings.key];
                          if(settings.datadefID==-1)data[i]['masterdata_url_detail']+="&headtitlecolumn="+settings.headtitlecolumn+"&headdescriptioncolumn="+settings.headdescriptioncolumn;
                        }
                        var line=ReplacePlaceholder(settings.html[object][template],data[i],settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns,settings);
                        $(el_records).append(line);
                        var el_record=$(el_records).children().last()[0];
                        var el_rec_container_parent=$(el_rec_container).parents('.js_rec_container')[0];
                        var objectsub="";
                        if(el_rec_container_parent)objectsub=object;
                        displaydat(el_record,data[i],i,template,objectsub);
                        el_rec_container.dataset.rec_indexmax=i;
                        //el_subcontainer=$(el_record).find('.js_rec_container')[0];
                        //if(el_subcontainer)gObject2htmlBuild(object,el_record,data[i]);
                        
                        var subcontainers=$(el_record).find('.js_rec_container');
                        for(var j=0;j<subcontainers.length;j++){
                          var objectsub=subcontainers[j].getAttribute("data-rec_object") ;
                          if(isset(data[i],objectsub)){
                            var el_subrecords=$(subcontainers[j]).find('.js_rec_records')[0];
                            displaydata(el_subrecords,data[i][objectsub],objectsub);
                            //console.log(data[i][objectsub]);
                          }
                        }
                    }
                  }else{
                    console.log("settings.html."+object+" not defined!");
                  }
                }else{
                    //if(isset(settings,'js_rec_nodata',object)){
                    //    var line=ReplacePlaceholder(settings['js_rec_nodata'][object],{},settings.masterdata.placeholder_mode,path);
                    var el_rec_records;
                    if(isset(settings,'html',object,'nodata')){
                        var line=ReplacePlaceholder(settings.html[object]['nodata'],{},settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns,settings);
                        //$(el_records).append(line);
                        el_rec_records=$(line).appendTo(el_records)[0];
                    }else{
                        //$(el_records).append(settings.masterdata.nodata);
                        el_rec_records=$(settings.masterdata.nodata).appendTo(el_records)[0];
                    }
                    conditional_output(el_rec_records);
                }
                if(settings.masterdata.paginationsize>0){
                    if(data.length>0){
                        k8_recordcount=Number(getfromArray(data[0],'k8_recordcount',0));
                    }
                    el_pagination=$(el_container).find(".js_rec_pagination")[0];
                    setPagination(el_pagination,k8_recordcount,settings.masterdata.pagination);
                }
                if(settings.masterdata.dataAfterLoadAll) {
                    settings.masterdata.dataAfterLoadAll(el_list,data);
                }
                /*
                if(settings.masterdata.cbcatAfterLoadAll) {
                    settings.masterdata.cbcatAfterLoadAll({"el_list":el_list,"data":data});
                }
                */
                cb(settings,'cbcatAfterLoadAll',{"settings":settings,"el_list":el_list,"data":data});
                //console.log( "loaddata.end.data.length: " + data.length);
                level_nested--;

            }

            function displaydat(el_rec_record,dat,index,template,object){
                var el_edit_container=$(el_rec_record).find(settings.masterdata.selector+' .js_edit_container')[0];
                if(el_edit_container){
                  if(isset(settings.html,object,'display')){
                    var html=ReplacePlaceholder(settings.html[object].display,dat,settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns,settings);
                    el_edit_container.innerHTML=html;
                  }else{
                    console.log('settings.html.'+object+'.display not set!');
                  }
                }
                
                //-----------  conditional output  -------------
                conditional_output(el_rec_record,dat);

                //-----------  data-loop-object  -------------
                el_loops=$(el_rec_record).find('*[data-loop_object]');
                for(var j=0;j<el_loops.length;j++){
                    var subsarr=el_loops[j].dataset.loop_object;
                    if(dat[subsarr]){
                        var loop_html=el_loops[j].dataset.loop_html;
                        var itm = el_loops[j].children[0];
                        var el_new;
                        for(var n=0;n<dat[subsarr].length;n++){
                            if(loop_html){
                                var line=ReplacePlaceholder(settings.html[object][loop_html],dat[subsarr][n],2,path,k8formatter,settings.tabulator.columns,settings);
                                //$(el_loops).append(line);
                                el_new=$(line).appendTo(el_loops)[0];
                            }else{
                                var cln = itm.cloneNode(true);
                                cln.innerHTML=ReplacePlaceholder(cln.innerHTML,dat[subsarr][n],3,path,k8formatter,settings.tabulator.columns,settings);
                                el_new=el_loops[j].appendChild(cln);
                            }
                            el_new.dataset['keyvalue']=dat[subsarr][n][settings['key']];
                            el_new.dataset['rec_index']=index;
                            if(edittype==0){
                                $(el_rec_record).find('.js_rec_delete').hide();
                                $(el_rec_record).find('.js_rec_edit').hide();
                            }else if(settings.rightcheck){
                                if(!Number(dat['rightuser_delete']))$(el_new).find('.js_rec_delete').hide();
                                if(!Number(dat['rightuser_update'])){
                                    $(el_new).find('.js_rec_edit').hide();
                                }
                            }
                            
                            //-----------  conditional output  -------------
                            conditional_output(el_new,dat[subsarr][n]);
                            
                        }
                        if(itm)itm.remove();
                        
                        // src for images
                        el_srcs=$(el_rec_record).find('*[data-src]');
                        for(var n=0;n<el_srcs.length;n++){
                            el_srcs[n].src=el_srcs[n].dataset.src;
                        }                            
                        
                    }
                    //console.log("str=" + str);
                }

                if(gbnull(object) || !isset(settings,'childcollection',object)){
                  el_rec_record.dataset['keyvalue']=dat[settings['key']];
                }else{
                  var child=getfromArray(settings.childcollection,object,{});
                  var key=getfromArray(child,"key");
                  if(!gbnull(key))el_rec_record.dataset['keyvalue']=getfromArray(dat,key);
                }
                el_rec_record.dataset['rec_index']=index;
                
                if(settings.masterdata.edittype==6){
                    if(template=='record')input2display(el_rec_record,dat);
                }
                $(el_rec_record).find('.js_rec_delete').show();
                $(el_rec_record).find('.js_rec_edit').show();
                $(el_rec_record).find('.js_rec_cancel').hide();
                
                if(edittype==0){
                    $(el_rec_record).find('.js_rec_delete').hide();
                    $(el_rec_record).find('.js_rec_edit').hide();
                }else if(settings.rightcheck){
                    if(!Number(dat['rightuser_delete']))$(el_rec_record).find('.js_rec_delete').hide();
                    if(!Number(dat['rightuser_update'])){
                        $(el_rec_record).find('.js_rec_edit').hide();
                    }
                }
                
                if(settings.masterdata.dataLoad) {
                    settings.masterdata.dataLoad(el_rec_record,dat,template);
                }
                /*
                if(settings.masterdata.cbcatLoad) {
                    settings.masterdata.cbcatLoad({"settings":settings,"el_rec_record":el_rec_record,"dat":dat,"template":template});
                }
                */
                if(settings.masterdata.control_mode==1){
                  let el_rec_edit=$(el_rec_record).find('.js_rec_edit')[0];
                  if(el_rec_edit){
                    el_rec_edit.addEventListener('click',function(e){
                      Event_js_rec_edit(e);
                    });
                  }
                  let el_rec_delete=$(el_rec_record).find('.js_rec_delete')[0];
                  if(el_rec_delete){
                    el_rec_delete.addEventListener('click',function(e){
                      Event_js_rec_delete(e);
                    });
                  }
                  let el_rec_cancel=$(el_rec_record).find('.js_rec_cancel')[0];
                  if(el_rec_cancel){
                    el_rec_cancel.addEventListener('click',function(e){
                      Event_js_rec_cancel(e);
                    });
                  }
                }
                cb(settings,'cbcatLoad',{"settings":settings,"el_list":el_list,"el_rec_record":el_rec_record,"dat":dat,"template":template});
            }

            function gObject2htmlBuild(area,el_object,obj,namestr){
                namestr=typeof namestr !== 'undefined' ? namestr : '';
                //console.log("namestr=" + namestr);
                if(gbnull(namestr)){
                }
                if(gbnull(obj)){
                }else{
                    var bnewrecord=false;
                    for(var prop in obj){
                        var name='';
                        if(gbnull(namestr)){
                            name=prop;
                        }else if(isNumeric(prop)){
                            name=namestr+'['+prop+']';
                        }else{
                            //name=namestr+prop;
                            name=namestr+'['+prop+']';
                        }

                        if(typeof(obj[prop])=='object' && obj[prop]!==null){
                            var el_objectsub;
                            var arrayname;
                            var bsub=true;
                            if(isNumeric(prop)){
                                arrayname=getobjectfromstrCatalog(namestr);
                                if(el_object){
                                    bnewrecord=true;
                                    var key=settings.key;
                                    var key_preset='';
                                    if(settings.childfieldnames[arrayname]){
                                        key=settings.childfieldnames[arrayname].key;
                                        key_preset=arrayname;
                                    }
                                    el_objectsub=addhtmlrecord(area,el_object,undefined,obj[prop],key_preset,key);
                                }else{
                                }
                            }else{
                                // array-name
                                arrayname=prop;
                                if(typeof(el_object)=='object'){
                                    el_objectsub=$(el_object).find("div[data-rec_object='"+arrayname+"']")[0];
                                    //console.log(" -> " + arrayname); 
                                }else{
                                    el_objectsub=$(el_form).find("div[data-rec_object='"+arrayname+"']")[0];
                                    //console.log("form -> " + arrayname); 
                                }
                                if(Object.keys(obj[prop]).length==0){
                                    bsub=false;
                                }
                            }
                            if(bsub)gObject2htmlBuild(area,el_objectsub,obj[prop],name);
                        //}else if(typeof(obj[prop])=='function'){ 
                        //}else if (obj.hasOwnProperty(prop)) { 
                        //}else{
                            //console.log(name + " no OwnProperty");
                        }
                    }
                }
            }

            function addhtmlrecord(area,el_rec_container,before_rec_index,dat,key_preset,key){
                // arrayname=hauptcontainer?
                
                var indexmax=[];
                var arrayname=el_rec_container.dataset.rec_object;
                //var dat={};
                dat=typeof dat !== 'undefined' ? dat :{};

                // add record in the actual container
                dat['index_'+arrayname]=Number(el_rec_container.dataset.rec_indexmax);
                dat['index_'+arrayname]++;
                el_rec_container.dataset.rec_indexmax=dat['index_'+arrayname];

                /*
                // getting parent record
                var el_rec_record_lfd=$(el_rec_container).parents('.js_rec_record')[0];

                while(el_rec_record_lfd){
                    //indexmax[i]=Number(el_rec_record_lfd.dataset.rec_index);
                    el_rec_container_lfd=$(el_rec_record_lfd).parents('.js_rec_container')[0];
                    if(el_rec_container_lfd){
                        var object_lfd=el_rec_container_lfd.dataset.rec_object;
                        dat['index_'+object_lfd]=Number(el_rec_record_lfd.dataset.rec_index);
                        el_rec_record_lfd=$(el_rec_record_lfd).parents('.js_rec_record')[0];
                    }
                }
                */
               
                var line="";
                var template;
                //if(gbnull(settings['js_rec_record'][arrayname])){
                if(gbnull(settings['html'][area][arrayname])){
                    if(gbnull(settings['html'][area]['record'])){
                        console.log('js_rec_record.'+arrayname+' is empty!');
                    }else{
                        // for recursive
                        template=settings['html'][area]['record'];
                    }
                }else{
                    template=settings['html'][area][arrayname];
                }
                if(gbnull(template)){
                    console.log('js_rec_record.'+arrayname+' no template!');
                }else{
                    line=ReplacePlaceholder(template,dat,settings.masterdata.placeholder_mode,path,undefined,undefined,settings);    //settings.masterdata.placeholder_mode
                }

                var el_records=$(el_rec_container).find('.js_rec_records')[0];
                if(typeof before_rec_index !== 'undefined'){
                    el_rec_before=$(el_rec_container).find('.js_rec_record[data-rec_index="'+before_rec_index+'"]')[0];
                    if(el_rec_before){
                        $(line).insertBefore(el_rec_before);
                    }else{
                        console.log(el_rec_before+' not found!');
                    }
                }else if($(el_records).children().length>0){
                    $(el_records).children().last().after(line);
                }else{
                    $(el_records).append(line);
                }

                // el_rec_record  bei before !!!!!!!!!
                var el_rec_record=$(el_records).children().last()[0];
                el_rec_record.dataset['rec_index']=dat['index_'+arrayname];
                if(gbnull(key_preset)){
                    el_rec_record.dataset['keyvalue']=dat[key];
                }else{
                    el_rec_record.dataset['keyvalue']=key_preset+'_'+dat[key];
                }
                
                // ---------------------- controls -----------------------
                $(el_rec_record).find('.js_rec_delete').show();
                $(el_rec_record).find('.js_rec_edit').show();
                $(el_rec_record).find('.js_rec_cancel').hide();
                
                if(settings.rightcheck){
                    if(!Number(dat['rightuser_delete']))$(el_rec_record).find('.js_rec_delete').hide();
                    if(!Number(dat['rightuser_update'])){
                        $(el_rec_record).find('.js_rec_edit').hide();
                    }
                }
                
                if(settings.masterdata.newRecord) {
                    settings.masterdata.newRecord(el_rec_record,dat);
                }
                /*
                if(settings.masterdata.cbnewRecord) {
                    settings.masterdata.cbnewRecord({el_rec_record:el_rec_record,dat:dat});
                }
                */
                cb(settings,'cbnewRecord',{"settings":settings,"el_list":el_list,el_rec_record:el_rec_record,dat:dat});
                conditional_output(el_rec_record,dat);

                return el_rec_record;
            }

            function replaceRecord(dat,selector){
                if(settings.displayvalue)dat['displayvalue']=dat[settings.displayvalue];
                let linkcolumn=getfromArray(settings,'displaycolumn',getfromArray(settings,'headtitlecolumn'));
                let displayvalue=getfromArray(dat,linkcolumn);
                if(settings.datadefID!==-1 && !gbnull(displayvalue) && GLOBALS_urlmode==1){
                  dat['masterdata_url_detail']=settings.datadefID+'/'+dat[linkcolumn];
                }else{
                  dat['masterdata_url_detail']=settings.masterdata.url_detail+'&keyvalue='+dat[settings.key];
                  if(settings.datadefID==-1)dat['masterdata_url_detail']+="&headtitlecolumn="+settings.headtitlecolumn+"&headdescriptioncolumn="+settings.headdescriptioncolumn;
                }
              
                var el_record=$(el_records).find(selector)[0];
                var index=el_record.dataset.rec_index;
                //var line=ReplacePlaceholder(settings['js_rec_record'][object],dat,settings.masterdata.placeholder_mode,path);
                var line=ReplacePlaceholder(settings.html[object]['record'],dat,settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns,settings);
                $(el_records).find(selector).replaceWith(line);
                
                var el_line=$(el_records).find('.js_rec_record[data-keyvalue="[keyvalue]"]')[0];
                if(el_line){
                    displaydat(el_line,dat,index);
                    data[index]=dat;
                }else{
                    var el_line=$(el_records).find('.js_rec_record[data-keyvalue="{{keyvalue}}"]')[0];
                    if(el_line){
                        displaydat(el_line,dat,index);
                        data[index]=dat;
                    }else{
                        console.log('replace record not identified!');
                    }
                }
                controlDisabled(false);
            }
            
            function insertRecord(dat,selector,method){
                if(settings.displayvalue)dat['displayvalue']=dat[settings.displayvalue];
                let linkcolumn=getfromArray(settings,'displaycolumn',getfromArray(settings,'headtitlecolumn'));
                let displayvalue=getfromArray(dat,linkcolumn);
                if(settings.datadefID!==-1 && !gbnull(displayvalue) && GLOBALS_urlmode==1){
                  dat['masterdata_url_detail']=settings.datadefID+'/'+dat[linkcolumn];
                }else{
                  dat['masterdata_url_detail']=settings.masterdata.url_detail+'&keyvalue='+dat[settings.key];
                  if(settings.datadefID==-1)dat['masterdata_url_detail']+="&headtitlecolumn="+settings.headtitlecolumn+"&headdescriptioncolumn="+settings.headdescriptioncolumn;
                }
                
                selector=typeof selector!=='undefined' ? selector:'';        
                method=typeof method!=='undefined' ? method:"last";        
                var el_reference;
                var template='record';
                if(settings.html[object]['recdisp'])template='recdisp';

                //var line=ReplacePlaceholder(settings['js_rec_record'][object],dat,settings.masterdata.placeholder_mode,path);
                var line=ReplacePlaceholder(settings.html[object][template],dat,settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns);
                if(!gbnull(selector)){
                    el_reference=$(el_records).find(selector)[0];
                    if(!el_reference){
                        console.log('reference='+selector+' not found');
                        return false;
                    }
                }else if(method!="first" && method!="last"){
                    console.log('insertRecord: pls specify selector');
                    return false;
                }
                if(method=="first"){
                    el_line=$(el_records).prepend(line)[0];
                }else if(method=="before"){
                    $(el_records).find(selector).before(line);
                }else if(method=="after"){
                    $(el_records).find(selector).after(line);
                }else if(method=="last"){
                    el_line=$(el_records).append(line)[0];
                }else{
                    console.log('method '+method+'not valid!');
                    return false;
                }
                var el_rec_record;
                if(settings.masterdata.placeholder_mode==2){
                    el_rec_record=$(el_records).find('.js_rec_record[data-keyvalue="{{keyvalue}}"]')[0];
                }else{
                    el_rec_record=$(el_records).find('.js_rec_record[data-keyvalue="[keyvalue]"]')[0];
                }
                if(el_rec_record){
                    var index=Number(el_container.dataset.rec_indexmax)+1;
                    el_container.dataset.rec_indexmax=index;
                    data[index]=dat;
                    displaydat(el_rec_record,dat,index,template);
                }else{
                    console.log('insertRecord, record not inserted!');
                    return false
                }
                controlDisabled(false);

                if(settings.masterdata.dataAfterinsert) {
                    settings.masterdata.dataAfterInsert(el_rec_record,dat);
                }
                /*
                if(settings.masterdata.cbcatAfterinsert) {
                    settings.masterdata.cbcatAfterInsert({"el_rec_record":el_rec_record,"dat":o});
                }
                */
                cb(settings,'cbcatAfterInsert',{"settings":settings,"el_list":el_list,"el_rec_record":el_rec_record,"dat":dat});
            }

            function deleteRecord(el_record,selector){
                if(!el_record){
                    if(typeof selector!=='undefined'){
                        el_record=$(el_list).find(selector)[0];
                    }else{
                        console.log('deleteRecord.selector='+selector+' not declared!');
                    }
                }
                if(el_record){
                    if(isset(settings.masterdata,'url_del')){
                        var index=el_record.dataset.rec_index;
                        var keyvalue=el_record.dataset.keyvalue;
                        var o={}
                        o[settings.key]=keyvalue;
                        $.getJSON(path+settings.masterdata.url_del,o, function(oJson) {
                            if(oJson.bok){
                                el_record.remove();
                                if(settings.masterdata.ondelete){
                                    settings.masterdata.ondelete(el_record,data[index]);
                                }
                                delete data[index];
                            }else{
                                console.log('error by delete: '+oJson.error);
                                //message('error by delete: '+oJson.error,'alert',undefined,settings.masterdata.message_position);
                                k8cat.message('error by delete: '+oJson.error,'alert');
                            }
                        });
                    }else{
                        console.log('url_del not defined!');
                        el_record.remove();
                        if(settings.masterdata.ondelete){
                            settings.masterdata.ondelete(el_record,data[index]);
                        }
                        delete data[index];
                    }
                }else{
                    console.log('no record!, selector='+selector);
                }
            }
            
            function setPagination(el_parent,$recordcount, mode){ //pagination
                /*
                 * @type @var;mydefault|String|getfromArray.arr|@var;mytable_offset
                var $offset=getfromArray(Array_GET(),'mytable_offset',0);
                var $limit=getfromArray(Array_GET(),'mytable_limit',settings.masterdata.paginationsize); //rows/page
                if(mode=='internal'){
                    $offset=mytable_offset;
                    $limit=mytable_limit;
                }*/
              
                // pageno
              
                var $offset=mytable_offset;
                var $limit=mytable_limit;
                
                var $pagedispmin=0;
                var $pagedispmax=0;
                var $maxchoice=5;
                
                if(($recordcount>$limit && $limit>0) || settings.masterdata.paginationalways || settings.masterdata.pagination=='internal'){
                    $(el_parent).empty();
                    var el_pag=$(settings.masterdata.paginationtemplate).appendTo(el_parent); 
                    var $_GET=Array_GET();
                    
                    // show 5 pages, actual should be in the middle
                    //$output+='Records: '+$recordcount+', '+getl("pages")+': ';
                    var pagemax=Math.round($recordcount/$limit+0.49);
                    pageno = Math.max(1,Math.min(pagemax,pageno));
                    
                    //var $page=parseInt($offset/$limit)+1;
                    var querystring=array2str($_GET);
                    var $url=window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1);
                    if(GLOBALS_urlmode==1){
                      $url=GLOBALS_hostpath+GLOBALS_indexfile;
                      $_GET['page']='catalog';
                      $_GET['datadefID']=settings.datadefID;
                    }
                    var $delimiter='?'; //iif(gbnull($_SERVER['QUERY_STRING']),'?','&');
                    if(!gbnull(window.location.search)){
                        $delimiter='&';
                    }
                    if(pageno-parseInt($maxchoice/2)>0){
                        //echo 'page: '+pageno+' page+maxchoice: '+(pageno+$maxchoice)+' $pagedispmax: '+$pagedispmax+' pagemax: '+pagemax+'<br>';
                        if((pageno+parseInt($maxchoice/2))<pagemax){
                            $pagedispmin=pageno-parseInt($maxchoice/2);
                        }else{
                            if(pageno-parseInt($maxchoice/2)+1>=1){
                                $pagedispmin=pageno-parseInt($maxchoice/2)+1;
                            }else{
                                $pagedispmin=1;
                            }
                        }
                    }else{
                        $pagedispmin=1;
                    }
                    if(($pagedispmin+$maxchoice-1)>pagemax){
                        $pagedispmax=pagemax;
                    }else{
                        $pagedispmax=$pagedispmin+$maxchoice-1;
                    }
                    //echo 'pageno: '+pageno+' $pagedispmin: '+$pagedispmin+' $pagedispmax: '+$pagedispmax+' pagemax: '+pagemax+'<br>';

                    // ---------------- recordno
                    var el=$(el_pag).find('.js_pag_recordcount')[0];
                    if(el) $('<span>'+getl('Records')+': '+$recordcount+'</span>').appendTo(el)[0];

                    var el_pagination=$(el_pag).find('.js_pag_buttons')[0];
                    if(el_pagination){
                        
                        // ---------------- < Prev
                        el=$(settings.masterdata.paginationtemplatebtn).appendTo(el_pagination).find('a')[0];
                        el.innerHTML=getl('Prev');
                        var pageprev=pageno-1;
                        if(pageno<=1)pageprev=1;
                        if(mode=='internal'){
                            el.dataset.pageno=pageprev;
                        }else{
                            $_GET['pageno']=pageprev;
                            el.href=$url+'?'+array2str($_GET);
                        }
                        if(pageno<=1){
                            el.disabled=true;
                            el.classList.add("disabled");
                            el.parentNode.classList.add("disabled");
                        }

                        // ------------- generate page numbers
                        for($n=$pagedispmin;$n<=$pagedispmax;$n++){
                            $mytable_offset=($n-1)*$limit;
                            //var el=$(settings.masterdata.paginationtemplatebtn).appendTo($(el_pag).find('.js_pag_buttons')[0])[0];
                            var el=$(settings.masterdata.paginationtemplatebtn).appendTo(el_pagination).find('a')[0];
                            el.innerHTML=$n;
                            if(mode=='internal'){
                                el.dataset.pageno=$n;
                            }else{
                                $_GET['pageno']=$n;
                                el.href=$url+'?'+array2str($_GET);
                            }
                            if($n==pageno){
                                el.disabled=true;
                                //el.classList.add("disabled");
                                el.classList.add("active");
                                el.parentNode.classList.add("active");
                            }
                        }

                        // ------------- > next
                        var el=$(settings.masterdata.paginationtemplatebtn).appendTo(el_pagination).find('a')[0];
                        el.innerHTML=getl('Next');
                        var pagenext=pageno+1;
                        if(pageno>=pagemax)pagenext=pagemax;
                        if(mode=='internal'){
                            el.dataset.pageno=pagenext;
                        }else{
                            $_GET['pageno']=pagenext;
                            el.href=$url+'?'+array2str($_GET);
                        }
                        if(pageno>=pagemax){
                            el.disabled=true;
                            el.classList.add("disabled");
                            el.parentNode.classList.add("disabled");
                        }

                        if(settings.masterdata.pagination=="internal"){
                            $(el_list).find('.js_rec_pagination .js_pag_buttons a').on('click',function(e){
                                e.preventDefault();
                                console.log('pagination');
                                $(el_records).empty();
                                $(el_pagination).empty();
                                loaddata(this.dataset.pageno);
                            });
                        }
                    }

                    // -------------- paginationsize
                    var el=$(el_pag).find('.js_pag_pagerows')[0];
                    if(el){
                        el.classList.add('dropdown');
                        var value_selected=$limit.toString();
                        var obj={
                            "class_ul":"dropdown-menu dropdown-menu-right text-end",
                            "class_li":"text-end",
                            "pretext":getl("Count")+": ",
                            "value_selected":value_selected,
                            "items":[]
                        };
                        var paginationscale=settings.masterdata.paginationscale;
                        for(var i=0;i<paginationscale.length;i++){
                            obj.items[i]={"value":paginationscale[i],"label":paginationscale[i],"href":$url+'?'+array2str($.extend($_GET,{"mytable_limit":paginationscale[i],"pageno":pageno}))};
                        }
                        obj['el_dd']=el;
                        displayDropdownel(obj);
                        
                        //var k8dd=Object.create(k8);
                        //k8dd.createbsmenu(obj);
                        
                        if(settings.masterdata.pagination=="internal"){
                            $(el).find('ul').on("click","a",function(e){
                                e.preventDefault();
                                console.log('paginationsize: '+pageno+' / '+this.dataset.value);
                                $(el_records).empty();
                                $(el_pagination).empty();
                                loaddata(pageno,this.dataset.value);
                            });
                            /*
                            obj['onClick']=function(){
                                    $(el_ul).on("click","a",function(e){
                                        e.preventDefault();
                                        console.log('paginationsize: '+pageno+' / '+this.dataset.value);
                                        $(el_records).empty();
                                        $(el_pagination).empty();
                                        loaddata(pageno,this.dataset.value);
                                    });
                                };
                            */
                        }                    
                    }                    
                }else{
                    console.log("recordcount="+$recordcount);
                }
                return;
            }
            
            // deprecated not used any more
            function TableNavigation($recordcount, mode){ //pagination
                // $gdatareadlimitpage;
                // mytable_limit

                $gdatareadlimitpage=settings.masterdata.paginationsize;
                $ajxfunction='';
                $maxchoice=5;
                if(mode=='internal'){
                    $offset=mytable_offset;
                    $limit=mytable_limit;
                }else{
                    $offset=getfromArray(Array_GET(),'mytable_offset',0);
                    $limit=getfromArray(Array_GET(),'mytable_limit',$gdatareadlimitpage); //rows/page
                }
                
                $output='<div>';
                $pagedispmin=0;
                $pagedispmax=0;
                // pages start count: 1
                // offset start count: 0
                // 
                // with $_GET
                //echo $_SERVER['QUERY_STRING']+'offset: '+$offset+' $limit: '+$limit+' $recordcount: '+$recordcount+' $gdatareadlimitpage: '+$gdatareadlimitpage+'<br>';

                if($recordcount>$limit && $limit>0){
                    // show 5 pages, actual should be in the middle
                    $output+=getl('Records')+': '+$recordcount+', '+getl("pages")+': ';
                    $pagemax=Math.round($recordcount/$limit+0.49);
                    $page=parseInt($offset/$limit)+1;
                    $url=window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1);
                    $delimiter='?'; //iif(gbnull($_SERVER['QUERY_STRING']),'?','&');
                    if($page-parseInt($maxchoice/2)>0){
                        //echo 'page: '+$page+' page+maxchoice: '+($page+$maxchoice)+' $pagedispmax: '+$pagedispmax+' $pagemax: '+$pagemax+'<br>';
                        if(($page+parseInt($maxchoice/2))<$pagemax){
                            $pagedispmin=$page-parseInt($maxchoice/2);
                        }else{
                            if($page-parseInt($maxchoice/2)+1>=1){
                                $pagedispmin=$page-parseInt($maxchoice/2)+1;
                            }else{
                                $pagedispmin=1;
                            }
                        }
                    }else{
                        $pagedispmin=1;
                    }
                    if(($pagedispmin+$maxchoice-1)>$pagemax){
                        $pagedispmax=$pagemax;
                    }else{
                        $pagedispmax=$pagedispmin+$maxchoice-1;
                    }
                    //echo '$page: '+$page+' $pagedispmin: '+$pagedispmin+' $pagedispmax: '+$pagedispmax+' $pagemax: '+$pagemax+'<br>';


                    // <
                    if($pagedispmin>1){
                        $mytable_offset=($pagedispmin-2)*$limit;
                        //echo getParameter('add',$_SERVER['QUERY_STRING'],'mytable_offset='+$mytable_offset)+'<br>';
                        if(mode=='internal'){
                            $output+='<a data-offset="'+$mytable_offset+'" href="#">'+htmlspecialchars('<')+'</a> ';
                        }else if(gbnull($ajxfunction)){
                            $urldisp=$url+$delimiter+$.param($.extend(Array_GET(),{'mytable_offset':$mytable_offset}));
                            $output+='<a href="'+$urldisp+'">'+htmlspecialchars('<')+'</a> ';
                        }else{
                            $temp=str_replace(')',iif(instr($ajxfunction,'()')>=0,'',',')+gsstr2sql('&mytable_offset='+$mytable_offset)+')',$ajxfunction);
                            $output+='<a style="text-decoration: underline; cursor: pointer;" onclick="'+$temp+'">'+htmlspecialchars('<')+'</a> ';
                        }
                    }else{
                        //$output+=htmlspecialchars('< ');
                    }

                    // generate page numbers
                    for($n=$pagedispmin;$n<=$pagedispmax;$n++){
                        if($n==$page){
                            $output+=$page+' ';
                        }else{
                            $mytable_offset=($n-1)*$limit;
                            if(mode=='internal'){
                                $output+='<a data-offset="'+$mytable_offset+'" href="#">'+$n+'</a> ';
                            }else if(gbnull($ajxfunction)){
                                $urldisp=$url+$delimiter+$.param($.extend(Array_GET(),{'mytable_offset':$mytable_offset}));
                                $output+='<a href="'+$urldisp+'">'+$n+'</a> ';
                            }else{
                                //$temp=str_replace(')',gsstr2sql('&mytable_offset='+$mytable_offset)+')',$ajxfunction);
                                $temp=str_replace(')',iif(instr($ajxfunction,'()')>=0,'',',')+gsstr2sql('&mytable_offset='+$mytable_offset)+')',$ajxfunction);
                                $output+='<a style="text-decoration: underline; cursor: pointer;" onclick="'+$temp+'">'+$n+'</a> ';
                            }
                        }
                    }

                    // >
                    if($pagedispmax<$pagemax){
                        $mytable_offset=($pagedispmax)*$limit;
                        if(gbnull($ajxfunction)){
                            $urldisp=$url+$delimiter+getParameter('add',$_SERVER['QUERY_STRING'],'mytable_offset='+$mytable_offset);
                            $output+='<a href="'+$urldisp+'">'+htmlspecialchars('>')+'</a> ';
                        }else{
                            $temp=str_replace(')',iif(instr($ajxfunction,'()')>=0,'',',')+gsstr2sql('&mytable_offset='+$mytable_offset)+')',$ajxfunction);
                            $output+='<a style="text-decoration: underline; cursor: pointer;" onclick="'+$temp+'">'+htmlspecialchars('>')+'</a> ';
                        }
                    }else{
                        //$output+=htmlspecialchars('> ');
                    }

                    if(mode="internal"){
                    }else{
                        $output+='<form style="float: left;" method="GET" name="navigationbar" id="navigationbar">';
                        //$output+='<input type="hidden" name="mytable_offset" value="'+$offset+'">';
                        //if($page>1){
                        if(1){
                            $output+='<input type="hidden" name="mytable_limit" value="'+$limit+'">';
                        }else{
                            $output+='<select name="mytable_limit" onchange="document+forms[\'navigationbar\']+submit()">'+
                                    '<option value="10"'+iif($limit==10,' selected','')+'>10</option>'+
                                    '<option value="25"'+iif($limit==25,' selected','')+'>25</option>'+
                                    '<option value="50"'+iif($limit==50,' selected','')+'>50</option>'+
                                    '<option value="100"'+iif($limit==100,' selected','')+'>100</option>'+
                                    '</select>';
                        }
                        $output+='</form>';
                    }
                    
                }
                return $output;
            }
            
        }else{
            console.log('selector undefined');
        }

        function addrecord(el_rec_container){
            var index_obj={};
            if(settings.masterdata.defaultvalues){
                index_obj=settings.masterdata.defaultvalues;
            }
            index_obj['index']=-1;
            index_obj['keyvalue']=0;
            //var line=ReplacePlaceholder(settings['js_rec_record'][object],index_obj,settings.masterdata.placeholder_mode,path);
            var line=ReplacePlaceholder(settings.html[object]['record'],index_obj,settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns,settings);
            var el_records=$(el_rec_container).find('.js_rec_records')[0];
            var el_record=$(line).appendTo(el_records)[0];
            //$(el_records).append(line);
            //el_record=$(el_records).find('.js_rec_record').last()[0];
            //el_record=replaceElWith(el_record,line);
            el_record.dataset.rec_index=-1;
            
            // default values
            if(isset(settings,'masterdata','defaultvalues')){
                el_form=$(el_records).parents('form')[0];
                if(Array.isArray(settings.masterdata.defaultvalues)){
                    if(settings.masterdata.defaultvalues.length>0){
                        for(var i=0;i<settings.masterdata.defaultvalues.length;i++){
                            var name=settings.masterdata.defaultvalues[i]['name'];
                            if(el_form.elements.namedItem(name)){
                                el_form.elements.namedItem(name).value=settings.masterdata.defaultvalues[i]['value'];
                            }
                        }
                    }
                    
                }else{
                    obj2form(settings.masterdata.defaultvalues,el_form);
                }
            }
            
            conditional_output(el_record,getfromArray(settings.masterdata,'defaultvalues',{}));

            // loop !!!!!

            //el_record=$(el_list).find('.js_rec_record[data-rec_index="'+indexmax+'"]')[0];
            if(el_record){
                $(el_record).find('input:visible,select:visible,textarea:visible').first().focus();
                $(el_record).find('.js_rec_delete').hide();
                $(el_record).find('.js_rec_edit').hide();
                $(el_record).find('.js_rec_cancel').show();
                //$(el_record).find('.js_rec_save').show();
                //$(el_record).find('.js_rec_save').prop("disabled",false);
                var el_marker=$(el_record).find('.js_contain_submit')[0];
                if(!el_marker){
                    el_marker=$(el_record).find('.recordmarker')[0];
                }
                if(el_marker){
                    $(el_marker).append(settings.masterdata.lineeditsubmit);
                }
                
            }else{
                console.log('el_record not found!');
            }
            return el_record;
        }
        
        function data2form(dat){
            var el_form=$(el_list).find('form')[0];
            for(var i=0;i<el_form.elements.length;i++){
                //var columnname=getSubName('columnname',el_form.elements[i].name);
                var columnname=el_form.elements[i].name;
                if(isset(dat,columnname))el_form.elements[i].value=getfromArray(dat,columnname);
            }
        }
        
        function saverecord(el_rec_record){
            // data
            
            var index=Number(el_rec_record.dataset.rec_index);
            var keyvalue=el_rec_record.dataset.keyvalue;
            
            var el_rec_recmain=$(el_rec_record).parents('.js_rec_record').last()[0];
            if(el_rec_recmain){
              index=Number(el_rec_recmain.dataset.rec_index);
            }
            var el_form=$(el_rec_record).parents('form')[0];
            var el_rec_container=$(el_rec_record).parents('.js_rec_container')[0];
            var object=el_rec_container.dataset.rec_object;
            var index_sub=Number(el_rec_record.dataset.rec_index);
            
            //if(data[index])dat=data[index];
            var dat=form2obj(el_form);
            dat['keyvalue=']=keyvalue;
            if(settings.masterdata.dataBeforeSave) {
                settings.masterdata.dataBeforeSave(el_rec_record,dat);
            }
            /*
            if(settings.masterdata.cbcatBeforeSave) {
                settings.masterdata.cbcatBeforeSave({"el_rec_record":el_rec_record,"dat":dat});
            }
          */
            cb(settings,'cbcatBeforeSave',{"settings":settings,"el_list":el_list,"el_rec_record":el_rec_record,"dat":dat});
            var indexes={};
            var indexarray=[];
            var url_save=path+getfromArray(settings.masterdata,'url_save');
            if(!gbnull(object)){
              var child=getfromArray(settings.childcollection,object,{});
              var child_masterdata=getfromArray(child,'masterdata',{});
              url_save=path+getfromArray(child_masterdata,'url_save');
              var el_rec_lfd=el_rec_record;
              do{
                  var el_rec_contlfd=$(el_rec_lfd).parents('.js_rec_container')[0];
                  var indexlfd=Number(el_rec_lfd.dataset.rec_index);
                  var arrayname=el_rec_contlfd.dataset.rec_object;
                  indexes[arrayname]=indexlfd;
                  if(!gbnull(arrayname)){
                    indexarray.unshift(indexlfd);
                    indexarray.unshift(arrayname);
                  }else{
                    indexarray.unshift(indexlfd);
                  }
                  el_rec_lfd=$(el_rec_contlfd).parents('.js_rec_record')[0];
              }while(typeof(el_rec_lfd)!=="undefined");
              console.log(indexarray);
            }
            
            if(gbnull(url_save)){
                console.log(object+", url_save not set!");
                if(gbnull(object)){
                  _saverecord(el_rec_record,false,dat,false)
                }else{
                  var objsub=getObjectValuefromIndexArray(data,indexarray);
                  //objsub[index_sub]=dat;                          
                  _saverecord(el_rec_record,false,dat,object,index,indexarray);
                }
            }else{              
                if(settings.displaycolumn)console.log("saverecord="+dat[settings.displaycolumn]);
                $.getJSON(url_save,dat, function(oJson) {
                    if(oJson.bok){
                      if(gbnull(object)){
                        if(gbnull(dat[settings.key])){
                          keyvalue=oJson.bok;
                          dat[settings.key]=oJson.bok;
                          el_rec_record.dataset.keyvalue=keyvalue;
                          dat=oJson.dat;
                        }
                        dat['keyvalue']=dat[settings.key];
                        _saverecord(el_rec_record,true,dat,"",index);
                      }else{
                        dat=oJson.dat;
                        dat['keyvalue']=dat[settings.key];
                        /*
                        var objsub=getObjectValuefromIndexArray(data,indexarray);
                        objsub[index_sub]=dat;                          
                        var el_edit_container=$(el_rec_record).find('.js_edit_container')[0];
                        if(el_edit_container){
                          // replace edit container
                          
                        }else{
                          _saverecord(el_rec_record,true,dat,object,index,indexarray);
                        }
                        */
                        _saverecord(el_rec_record,true,dat,object,index,indexarray);
                      }
                    }else{
                        console.log('error by save: '+oJson.error);
                        k8cat.message(oJson.error,'alert');
                    }
                })
                .fail(function(jqxhr, textStatus, error ) {
                    var err = textStatus + ", " + error;
                    console.log("saverecord.Request Failed: " + err );
                });
            }
        }

        function _saverecord(el_rec_record,bsaved,dat,object,index_main,indexarray){
            var index=index_main;
            var index_sub=0;
            var keyvalue=0;
            if(bsaved)k8cat.message(getl("saved"),'saved');
            var el_rec_container=$(el_rec_record).parents('.js_rec_container')[0];
            var bnew=false;
            if(gbnull(object)){
              if(index==-1){
                  index=Number(el_rec_container.dataset.rec_indexmax)+1;
                  bnew=true;
                  el_rec_container.dataset.rec_indexmax=index;
              }
              if(isset(settings,'key'))keyvalue=getfromArray(dat,settings.key);
              data[index]=dat;
              if($plugin.data("data")){
                  $plugin.data("data")[index]=dat;
              }
              dat['index']=index;
            }else{
              //var index_sub=indexarray[indexarray.length - 1];
              index_sub=indexarray.pop();
              if(index_sub==-1){
                  index_sub=Number(el_rec_container.dataset.rec_indexmax)+1;
                  bnew=true;
                  el_rec_container.dataset.rec_indexmax=index_sub;
              }
              // update data
              var objsub=getObjectValuefromIndexArray(data,indexarray);
              objsub[index_sub]=Object.assign(objsub[index_sub],dat);
              
              var key=settings.childcollection[object].key;
              keyvalue=dat[key];
            }
            var template='record';
            if(settings.masterdata.edittype==6){
              let temp=object;
              if(gbnull(object))temp=settings.masterdata.htmlout;
              //if(settings.html[object]['recdisp']){
              if(isset(settings.html,temp,'recdisp')){
                  template='recdisp';
                  var line=ReplacePlaceholder(settings.html[temp][template],dat,settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns,settings);
                  el_rec_record=replaceElWith(el_rec_record,line);
                  conditional_output(el_rec_record,dat);
              }else{
                  input2display(el_rec_record,dat);
                  conditional_output(el_rec_record,dat);
              }
            }else if(settings.masterdata.edittype==11){
              var el_edit_container=$(el_rec_record).find('.js_edit_container')[0];
              if(el_edit_container){
                var temp=settings.html[object].display;
                var line=ReplacePlaceholder(temp,objsub[index_sub],settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns,settings);
                el_edit_container.innerHTML=line;
              }else{
                // later
              }
            }else{
              template='record';
              var line=ReplacePlaceholder(settings.html[object][template],dat,settings.masterdata.placeholder_mode,path,k8formatter,settings.tabulator.columns,settings);
              el_rec_record=replaceElWith(el_rec_record,line);
              conditional_output(el_rec_record,dat);
            }
            //if(bnew || settings.html[object]['recdisp']){
            if(gbnull(object)){
                el_rec_record.dataset.rec_index=index;
                el_rec_record.dataset.keyvalue=keyvalue;
            }else{
                el_rec_record.dataset.rec_index=index_sub;
                el_rec_record.dataset.keyvalue=keyvalue;
            }

            
            $(el_rec_record).find('.js_rec_delete').show();
            $(el_rec_record).find('.js_rec_edit').show();
            $(el_rec_record).find('.js_rec_cancel').hide();
            //$(el_rec_record).find('.js_rec_save').hide();
            //$(el_rec_record).find('.js_rec_save').prop("disabled",true);
            $(el_rec_record).find('.js_rec_save').remove();
            if(edittype==1 || edittype==6 || edittype==7)controlDisabled(false);

            if(settings.masterdata.dataLoad) {
                settings.masterdata.dataLoad(el_rec_record,dat,template);
            }
            /*
            if(settings.masterdata.cbcatLoad) {
                settings.masterdata.cbcatLoad({"settings":settings,"el_rec_record":el_rec_record,"dat":dat,"template":template});
            }
            */
            cb(settings,'cbcatLoad',{"settings":settings,"el_list":el_list,"el_rec_record":el_rec_record,"dat":dat,"template":template});
        }
        
        //window.addEventListener('scroll',reachbottom);
        function cb(settings,cbfunction,options){
          var ret;
          if(settings.masterdata[cbfunction]) {
            if(Array.isArray(settings.masterdata[cbfunction])){
              for(var i=0;i<settings.masterdata[cbfunction].length;i++){
                ret=settings.masterdata[cbfunction][i](options);
              }
            }else{
              ret=settings.masterdata[cbfunction](options);
            }
          }
          return ret;
        }
        
        function conditional_output(el,dat){
            el_conditions=$(el).find('*[data-v_if]');
            for(var j=0;j<el_conditions.length;j++){
              var str=el_conditions[j].dataset.v_if;
              var mode=el_conditions[j].dataset.v_mode;
              mode=typeof mode !== 'undefined' ? mode : "empty";

              //console.log("str=" + str);
              try{
                if(!eval(str)){
                    switch(mode){
                        case 'hide':
                            $(el_conditions[j]).hide();
                            break;
                        case 'hidechildren':
                            $(el_conditions[j]).children().hide();
                            break;
                        case 'remove':
                            $(el_conditions[j]).remove();
                            break;
                        case 'empty':
                            $(el_conditions[j]).empty();
                            break;
                    }
                }
              }
              catch(e){
                // error
                console.log('error by expression: '+str);
              }
            }
          /*  
          el_conditions=$(el).find('*[data-v_if]');
          for(var i=0;i<el_conditions.length;i++){
            var str=el_conditions[i].dataset.v_if;
            //console.log("str=" + str);
            try{
              if(!eval(str)){
                //$(el_conditions[i]).hide();
                //el_conditions[i].remove();
                $(el_conditions[i]).empty();
              }
            }
            catch(e){
              // error
              console.log('error by expression: '+str);
            }
          }
           */
        }   

        function input2display(el_record,dat){
            var fields=$(el_record).find('input,select,textarea');
            for(var n=0;n<fields.length;n++){
                if(fields[n].type=="hidden"){
                    //$(fields[n]).replaceWith("");
                    $(fields[n]).remove();
                }else if(fields[n].tagName=="SELECT"){
                    // selected
                    var value=getfromArray(dat,fields[n].name);
                    var text="";
                    var options=fields[n].options;
                    for(var i=0;i<options.length;i++){
                        if(options[i].value==value){
                            text=options[i].text;
                            break;
                        }
                    }
                    var html='<div class="k8-label-table">'+text+'</div>';
                    $(fields[n]).replaceWith(html);
                }else{
                    //var columnname=getSubName('columnname',fields[n].name);
                    var columnname=fields[n].name;
                    var value=getfromArray(dat,columnname);
                    if(typeof k8formatter !=='undefined' && isset(settings,"tabulator","columns")){
                        var index=getArrayIndexfromValue(settings.tabulator.columns,'field',columnname);
                        if(index>-1){
                            if(isset(settings.tabulator.columns[index])){
                                value=k8formatter.format(settings.tabulator.columns[index],value);
                            }   
                        }
                    }

                    var html='<div class="k8-label-table">'+value+'</div>';
                    $(fields[n]).replaceWith(html);
                }
            }
            //var fields=$(el_record).find('.k8-field-icon');
            var fields=$(el_record).find('.js_rec_control');
            for(var n=0;n<fields.length;n++){
                $(fields[n]).css("display","none");
            }   
            /*
            var fields=$(el_record).find('.glyphicon');
            for(var n=0;n<fields.length;n++){
                $(fields[n]).css("display","none");
            }
            */
        }
            
        function getData(){
            return $plugin.data("data");
        }
        
        function getRecord(e){
          var el_rec_record=$(e.target).parents('.js_rec_record')[0];
          var index=Number(el_rec_record.dataset.rec_index);
          return $plugin.data("data")[index];
        }
        return{"listedit":el_list,"addrecord":addrecord,"input2display":input2display,"data2form":data2form,"saverecord":saverecord,"replaceRecord":replaceRecord,"insertRecord":insertRecord,"deleteRecord":deleteRecord,"getData":getData,"data":getData,"getRecord":getRecord};
    };
}(jQuery ));


(function ($) {
    $.fn.tabulatoredit = function( options ) {
        // deprecated
        // settings['js_rec_record'][object]
        
        var settings = $.extend({
        }, options );

        return this.each(function(){
            // create listbox
            var el_list=this;
            // ------------------------------------------ Tabulator -------------------------------------------
            var row_actual=0;
            var bdelclicked=false;
            var keyfield=settings['key'];
            var otable=settings.tabulator;
            otable=$.extend({
                rowClick:function(e, row){ //trigger an alert message when the row is clicked
                    if(!bdelclicked){
                        //console.log("Row " + row.getPosition() +' ID='+row.getData().ID + " Clicked");
                    }
                    bdelclicked=false;
                }
            },
            {
                height:205, 
                layout:"fitColumns"
            });

            //-------------------------------- Define Table Columns
            //custom formatter definition
            var printIcon = function(cell, formatterParams, onRendered){ //plain text value
                var rightuser_delete=true;
                var rightuser_update=false;
                if(settings.rightcheck!=0){
                    rightuser_update=Number(getfromArray(cell.getData(),'rightuser_update',false));
                    rightuser_delete=Number(getfromArray(cell.getData(),'rightuser_delete',false));
                }
                var html="";
                if(rightuser_delete)html+='<img src="'+getfromArray(settings.masterdata,'root')+'masterdata/pic/icon_delete.png" alt="delete" title="delete">  ';
                if(settings.rightcheck!=0){
                    if(rightuser_update){
                        //html+='<img src="'+getfromArray(settings.masterdata,'root')+'masterdata/pic/icon_edit.png" alt="edit" title="edit">';
                    }else{
                        html+='<img src="'+getfromArray(settings.masterdata,'root')+'masterdata/pic/icon_no_edit.png" alt="edit" title="edit">';
                    }
                }
                return html;
            };
            //otable.columns=settings.tabulator.columns;
            for(var i=0;i<otable.columns.length;i++){
                if(!otable.columns[i].hasOwnProperty('editor')){
                    otable.columns[i]['editor']=true;
                }
            }
            otable.columns.unshift({"headerSort":false,"download":false,"formatter":printIcon, "width":50, "hozAlign":"center", 
                "cellClick":function(e, cell){
                    //console.log('event.delete');
                    if((settings.rightcheck!=0 && Number(getfromArray(cell.getData(),'rightuser_update',false))) || settings.rightcheck==0){
                        if(confirm(getl('Delete really?'))){
                            bdelclicked=true;
                            var o={};
                            o[keyfield]=cell.getData()[keyfield];
                            $.getJSON(path+settings.masterdata.url_del,o, function(oJson) {
                                if(oJson.bok){
                                    cell.getRow().delete();
                                    row_actual=0;
                                    initForm();
                                }else{
                                    // !!!!!!!!!! el_form.getElementById('res').innerHTML=oJson.error;
                                }
                            })
                            .fail(function(jqxhr, textStatus, error ) {
                                var err = textStatus + ", " + error;
                                    //console.log( "Request Failed: " + err );
                            });			
                        }
                    }
                }
            });

            //create Tabulator on DOM element with id "example-table"
            var tableTab = new Tabulator(el_list, otable);

            //-------------------------------- tabledata
            tableTab.setData(path+settings.masterdata.url_readfilter,settings.masterdata.data_readfilter);
            //$(this).find('.resize-s').resizable({handles:"s"});
            
            
        });
    };
}(jQuery ));