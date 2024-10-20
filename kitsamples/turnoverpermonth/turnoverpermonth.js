"use strict";
// settingsinvoice
// settingsturnoverpermonth


SetArrayAll(settingsinvoice.tabulator.columns,"headerFilter",false);

settingsturnoverpermonth.chartjs_def={
  selector:"#html1",
  reversedata:true,
  chartjs:{
  
    type: 'bar',
    data: {
        responsive: true,
        datasets:[
          { 
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
      parsing: {
        xAxisKey: 'x',
        yAxisKey: 'y'
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
        tooltip: {
          callbacks: {
            label: function(context) {
              console.log(context);
              let value=context.dataset.data[context.dataIndex]['y'];
              let oformatter=settingsturnoverpermonth.tabulator.columns;
              var index=getArrayIndexfromValue(oformatter,'field',"y");
              if(index>-1){
                  if(isset(oformatter[index])){
                      value=k8formatter.format(oformatter[index],value);
                  }   
              }
              return ' '+value;
            },
            afterLabel: function(tooltipItem, data) {
              //return data['labels'][tooltipItem[0]['index']];
              return 'click for details';
            }
          }
        },
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
          console.log(e.chart.data.datasets[datasetIndex].data[index]);
          let dat=e.chart.data.datasets[datasetIndex].data[index];
          let el_overlay=exk8.createOverlay()[0];
          settingsinvoice.masterdata.clause='year(docdate)='+dat.year+' and month(docdate)='+dat.month;
          settingsinvoice.masterdata.bnoform=true;
          masterdata=$(exk8.el_content).masterdata(settingsinvoice);
        }
      }
    }
  },
  callbacks:{
    dataAdd:function(options){
      // x = month like 202205
      // y = turnover
      let data_obj=options.data_obj;
      let chartjs=options.settings.chartjs_def.chartjs;
      var today=new Date();
      var year=today.getFullYear()-1;
      var month=today.getMonth()+1;
      var data=[];
      for(var i=0;i<12;i++){
        let index=getArrayIndexfromValue(data_obj,"x",(year*100+month).toString());
        if(index>=0){
          data_obj[index]['x']=year.toString()+'-'+('0'+month.toString()).slice(-2);
          data.push(data_obj[index]);
          //data.push({x:year.toString()+'-'+('0'+month.toString()).slice(-2),y:0});
        }else{
          data.push({x:year.toString()+'-'+('0'+month.toString()).slice(-2),y:0});
        }
        if(month>=12){
          month=1;
          year++;
        }else{
          month++
        }
      }
      chartjs.data.datasets[0].data=data;
    }
  }
};