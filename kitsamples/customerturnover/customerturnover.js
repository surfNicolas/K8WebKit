"use strict";
// default "selector"

settingsinvoice.masterdata.bnoform=true;
settingsinvoice.masterdata.edittype=0;
settingsinvoice.masterdata.headline='<h3>Invoices</h3>';
settingsinvoice.masterdata.footline='';
settingsinvoice.tabulator.ajaxFiltering=false;
settingsinvoice.tabulator.height=300;
SetArrayAll(settingsinvoice.tabulator.columns,'headerFilter',false);

settingscustomerturnover.chartjs_def={
  selector:"#turnoverchart",
  chartjs:{
    type: 'bar',
    data: {
        responsive: true,
        datasets: [
          { 
            axis:'y',
            data:[],
            backgroundColor: 'rgba(81, 186, 64, 0.2)',
            borderColor: 'rgba(81, 186, 64, 1)',
            borderWidth: 1          
          },
        ]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        indexAxis: 'y',
        parsing: {
          yAxisKey: 'partner',
          xAxisKey: 'amount'
        },
        scales: {
          'y': {
            ticks: {
              align:"center",
              crossAlign:"far",
              font: {
                size: 14
              }
            }
          }
        },
        plugins:{
          legend: {
             display: false
           }
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
            var partnernumber=e.chart.data.datasets[datasetIndex].data[index]['partnernumber'];
            setinvoices("partnernumber='"+partnernumber+"'");
          }
        }
      }
  }
};

var selector=getfromArray(settingscustomerturnover.masterdata,'selector','#html1');
document.querySelector(selector).innerHTML=settingscustomerturnover.html.turnover.layout;
//var myChart;
var today=new Date();
var year=today.getFullYear();
var k8form=Object.create(k8);
var filterform={
  "template":'<form class="js_filterform masterdata-form form-horizontal">{{innerHTML}} <div class="text-end"> <input type="submit" class="js_replacedata btn btn-primary" value="'+getl("Go")+'"> </div> </form>',
  "form":{
    "name":"filterform"
  },
  "selector":"#filterform",
  "labelclass":"form-label label-left col-md-4",
  "fieldwrapclass":"col-md-8",
  "method":"GET",
  "fields":[
    { 
      "name":"page",
      "type":"hidden"
    },
    {
      "figure":2,
      "name":"year",
      "label":getl("year"),
      "min":2000,
      "max":3000,
      "type":"number",
      "attributes":{
        "valuefrom":year-4,
        "valueto":year
      },
      "required":true
    }
  ]
};
k8form.createform(filterform);
var el_form=document.querySelector('.js_filterform');

/* submit for server */
$(el_form).on('submit',function(e){
  e.preventDefault();
  // url ändern
  var dat_form=form2obj(el_form);
  obj2url(dat_form)
  DisplayChart(el_form);
  setinvoices('1=2');
});
/*
*/

DisplayChart(el_form);
setinvoices('1=2');

function DisplayChart(el_form){
  var yearfrom=Number(el_form.elements.namedItem("yearfrom").value);
  var yearto=Number(el_form.elements.namedItem("yearto").value);
  if(gbnull(yearfrom)){
    settingscustomerturnover.masterdata.clause='1=2';
  }else{
    settingscustomerturnover.masterdata.clause='year(docdate)>='+yearfrom+' and year(docdate)<='+yearto;
  }
  
  var exk8=Object.create(k8);
  exk8.displayChartjs(settingscustomerturnover);
}  

function setinvoices(clause){
  settingsinvoice.masterdata.clause=clause;
  var masterdata2=$('#masterdata2').masterdata(settingsinvoice);
}