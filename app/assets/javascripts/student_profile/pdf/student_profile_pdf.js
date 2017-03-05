(function() {
  window.shared || (window.shared = {});

  function lpadMonth(month) {
    if(month < 10) {
      return "0" + month;
    }
    else {
      return month;
    }
  }

  function initializeDataArray(dataArray) {
    var outputArray = new Object;

    var presentDate = new Date();
    var presentYear = presentDate.getFullYear();
    var presentMonth = presentDate.getMonth() + 1;

    var iterationYear = presentMonth < 8 ? presentYear - 2 : presentYear - 1;
    var iterationMonth = 8;

    var index = 0;

    while(!(iterationYear == presentYear && iterationMonth > presentMonth)) {
      outputArray[""+iterationYear + lpadMonth(iterationMonth)] = 0;

      if(iterationMonth < 12) {
        iterationMonth++;
      }
      else {
        iterationMonth = 1;
        iterationYear++;
      }

      index++;
    }

    for (i=0; i < dataArray.length; i++) {
      addDate(outputArray, dataArray[i].occurred_at);
    }

    return flattenArray(outputArray);
  }

  function monthLabel(month) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    return months[month - 1];
  }

  function generateXAxisSettings() {
    var monthLabels = [];
    var yearLabels = [];
    var yearTickPositions = [];

    var presentDate = new Date();
    var presentYear = presentDate.getFullYear();
    var presentMonth = presentDate.getMonth() + 1;

    var iterationYear = presentMonth < 8 ? presentYear - 2 : presentYear - 1
    var iterationMonth = 8;

    var index = 0;

    while(!(iterationYear == presentYear && iterationMonth > presentMonth)) {
      monthLabels[index] = monthLabel(iterationMonth);
      yearLabels[index] = iterationYear;
      
      if(iterationMonth < 12) {
        iterationMonth++;
      }
      else {
        iterationMonth = 1;
        iterationYear++;
        yearTickPositions.push(index+1);
      }

      index++;

    }

    return {
      'monthLabels' : monthLabels,
      'yearLabels' : yearLabels,
      'yearTickPositions' : yearTickPositions
    };
  }

  function addDate(monthlyTotalArray, dateString) {
    var eventDate = new Date(dateString);
    var month = eventDate.getMonth() + 1;
    var year = eventDate.getFullYear();

    monthlyTotalArray["" + year + lpadMonth(month)]++;
  }

  function flattenArray(arrayObject) {
    var flattenedArray = [];
    for (var key in arrayObject) {
      flattenedArray.push(arrayObject[key]);
    }
    return flattenedArray;
  }

  function generateGraph(containerSelector, yAxisLabel, xAxisSettings, dataSeries){
    
    var stacking ="";

    if(dataSeries.length > 1) {
      stacking = "normal";
    }

    $(containerSelector).highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      credits: false,
      exporting: {
        enabled: false
      },
      plotOptions: {
        column: {
          stacking: stacking,
          dataLabels: {
            enabled: true,
            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
            formatter: function(){
              var val = this.y;
              if (val < 1) {
                  return '';
              }
              return val;
            },
          }
        }
      },
      xAxis: [
        {
          categories: xAxisSettings.monthLabels
        },
        {
          offset: 35,
          linkedTo: 0,
          categories: xAxisSettings.yearLabels,
          tickPositions: xAxisSettings.yearTickPositions,
          tickmarkPlacement: "on"
        }
      ],
      yAxis: {
        title: {
          text: yAxisLabel
        },
        stackLabels: {
          enabled: true,
          style: {
              fontWeight: 'bold',
              color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
          },
          formatter: function(){
              var val = this.total;
              if (val < 1) {
                  return '';
              }
              return val;
          },
        },
        min: 0,
        max: 20,
      },
      series: dataSeries
    });

  }

  window.shared.StudentProfilePdf = {
    load: function() {
      var attendanceData = $('#serialized-data').data('attendance-data');

      var xAxisSettings = generateXAxisSettings();

      var attendanceDataSeries = [
        {
          name: "Tardies",
          showInLegend: true,
          color: "#0072b2",
          data: initializeDataArray(attendanceData.tardies)
        },
        {
          name: "Absences",
          showInLegend: true,
          color: "#e69f00",
          data: initializeDataArray(attendanceData.absences)
        }
      ];

      var disciplineDataSeries = [
        {
          name: "Discipline Incidents",
          showInLegend: true,
          color: "#0072b2",
          data: initializeDataArray(attendanceData.discipline_incidents)
        }
      ];

      generateGraph("#attendance_container", "Number of Absences / Tardies", xAxisSettings, attendanceDataSeries);

      generateGraph("#discipline_incident_container", "Number of Discipline Incidents", xAxisSettings, disciplineDataSeries);
    }
  };
})();