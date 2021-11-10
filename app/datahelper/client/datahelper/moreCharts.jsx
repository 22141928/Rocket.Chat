import React, { Component } from "react";
import * as echarts from "echarts";
import 'echarts-gl';

class MoreCharts extends Component {

  componentDidMount(){
    this.load3DChart();
    this.loadHeapChart();
  }

  load3DChart(){
    let chartDom = document.getElementById('3dChart');
    let myChart = echarts.init(chartDom);
    let option;
    // prettier-ignore
    var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
      '7a', '8a', '9a', '10a', '11a',
      '12p', '1p', '2p', '3p', '4p', '5p',
      '6p', '7p', '8p', '9p', '10p', '11p'];
// prettier-ignore
    var days = ['Saturday', 'Friday', 'Thursday',
      'Wednesday', 'Tuesday', 'Monday', 'Sunday'];
    var dates = ['2020-09','2020-10','2020-11','2020-12','2021-01','2021-02','2021-03','2021-04'];
    let numbers = [1,2,3,4,5,6,7,8,9,10];
    let arr = [];
    for(let i = 0;i<3;i++){
      for(let j = 0;j<4;j++){
        let tmp = Math.floor(Math.random()*3);
        arr.push([dates[i],numbers[j],tmp])
      }
      for(let j = 4;j<10;j++){
        let tmp = Math.floor(Math.random()*6);
        tmp = Math.random()>0.5?tmp:Math.floor(tmp/2);
        arr.push([dates[i],numbers[j],tmp])
      }
    }
    for(let i = 3;i<8;i++){
      for(let j = 0;j<7;j++){
        let tmp = Math.floor(Math.random()*3);
        arr.push([dates[i],numbers[j],tmp])
      }
      for(let j = 7;j<10;j++){
        let tmp = Math.floor(Math.random()*4.2);
        tmp = Math.random()>0.5?tmp:Math.floor(tmp/2);
        arr.push([dates[i],numbers[j],tmp])
      }
    }
// prettier-ignore
    let data = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [1, 2, 2], [1, 4, 4], [2, 3, 1], [2, 4, 1], [3, 5, 3], [3, 6, 4], [4, 3, 2], [4, 5, 4], [4, 7, 2], [5, 2, 3], [5, 3, 1], [5, 4, 2], [5, 6, 1], [6, 3, 1], [6, 4, 2], [6, 5, 1], [7, 3, 1], [7, 2, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]];
    option = {
      title: {
        top: 10,
        left: 'center',
        text: '3D分布图'
      },
      tooltip: {},
      visualMap: {
        max: 10,
        inRange: {
          color: [
            '#313695',
            '#4575b4',
            '#74add1',
            '#abd9e9',
            '#e0f3f8',
            '#ffffbf',
            '#fee090',
            '#fdae61',
            '#f46d43',
            '#d73027',
            '#a50026'
          ]
        }
      },
      xAxis3D: {
        type: 'category',
        data: dates,
        name:'日期'
      },
      yAxis3D: {
        type: 'category',
        data: numbers,
        name:'参与人员数量'
      },
      zAxis3D: {
        type: 'value',
        name:'备忘录数量'
      },
      grid3D: {
        boxWidth: 400,
        boxDepth: 150,
        light: {
          main: {
            intensity: 1.2
          },
          ambient: {
            intensity: 0.3
          }
        }
      },
      series: [
        {
          type: 'bar3D',
          data: arr,
          shading: 'color',
          label: {
            show: false,
            fontSize: 14,
            borderWidth: 1
          },
          itemStyle: {
            opacity: 0.4
          },
          emphasis: {
            label: {
              fontSize: 14,
              color: '#900'
            },
            itemStyle: {
              color: '#900'
            }
          }
        }
      ]
    };
    myChart.setOption(option);
  }

  loadHeapChart(){
    let chartDom = document.getElementById('heapChart');
    let myChart = echarts.init(chartDom);
    let option = {
      title: {
        top: 10,
        left: 'center',
        text: '备忘录时间分布'
      },
      tooltip: {},
      visualMap: {
        min: 0,
        max: 10,
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 30
      },
      calendar: {
        top: 70,
        left: 30,
        right: 30,
        cellSize: ['auto', 16],
        range: ['2019-09-01', '2020-04-30'],
        itemStyle: {
          borderWidth: 0.5
        },
        yearLabel: { show: true }
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: this.getVirtulData('2019')
      }
    };;
    myChart.setOption(option);
  }

  getVirtulData(year) {
    year = year || '2017';
    var date = +echarts.number.parseDate(year + '-09-01');
    var mid = +echarts.number.parseDate(year + '-12-01');
    var end = +echarts.number.parseDate(+year + 1 + '-05-01');
    var dayTime = 3600 * 24 * 1000;
    var data = [];
    for (var time = date; time < mid; time += dayTime) {
      let tmp = Math.floor(Math.random()*6);
      tmp = Math.random()>0.5?tmp:Math.floor(tmp/2);
      data.push([
        echarts.format.formatTime('yyyy-MM-dd', time),
        tmp
      ]);
    }
    for (var time = mid; time < end; time += dayTime) {
      let tmp = Math.floor(Math.random()*3.3);
      data.push([
        echarts.format.formatTime('yyyy-MM-dd', time),
        tmp
      ]);
    }
    return data;
  }

  render() {
    return (
      <div style={{overflow:'auto'}}>
        <div style={{width:'98%',height:'200px'}} id={'heapChart'}/>
        <div style={{width:'99%',height:'300px'}} id={'3dChart'}/>
      </div>
    );
  }
}

export default MoreCharts;
