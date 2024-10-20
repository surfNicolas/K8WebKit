settingsk8components.chartjs_def={
  selector:"#html1",
  reversedata:true,
  chartjs:{
    type: 'bar',
    data: {
        responsive: true,
        datasets:[
          {
            label: 'Price',
            data: [], /* is filled in displayGraph() or by dataAdd */
            parsing: {
              yAxisKey: 'price'
            },
            borderColor: 'rgba(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      parsing: {
        xAxisKey: 'componentnumber'
      },
      scales:{
        y:{ 
          beginAtZero: true
        }
      },
      plugins:{
        legend: {
          display: true
        },
        title: {
          display: true,
          text: 'Turnover in €'
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
          /* write in your action, example:
          var partnernumber=e.chart.data.datasets[datasetIndex].data[index]['partnernumber'];
          setinvoices("partnernumber='"+partnernumber+"'");
          */
        }
      }
    }
  }
};