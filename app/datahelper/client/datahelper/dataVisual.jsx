import React, { Component } from "react";
import * as echarts from 'echarts';
import {Button, Modal} from 'antd';
import 'antd/dist/antd.less';
import MoreCharts from "./moreCharts";


class DataVisual extends Component {

  constructor(props){
    super(props);
    this.state = {
      visual: false
    }
  }

  componentDidMount(){
    this.loadPie();
    this.loadBar();
  }



  loadPie(){
    let chartDom = document.getElementById('pie');
    let myChart = echarts.init(chartDom);
    let option;

    option = {
      title: {
        text: '备忘录来源分布'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '20%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['30%', '80%'],
          top: '28%',
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              fontSize: '14',
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 26, name: '按用户生成的备忘录' },
            { value: 12, name: '按日期生成的备忘录' }
          ]
        }
      ]
    };
    myChart.setOption(option);
  }

  loadBar(){
    let chartDom = document.getElementById('bar');
    let myChart = echarts.init(chartDom);
    let option;

    option = {
      title: {
        text: '备忘录Top5人员'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        name:'备忘录数量'
      },
      yAxis: {
        type: 'category',
        data: [ '李炳辰', 'Johnny', '山旁之树', '菠萝油条虾', '张趔趄' ]
      },
      series: [
        {
          type: 'bar',
          data: [ 3, 4, 4, 5, 8 ]
        }
      ]
    };
    myChart.setOption(option);
  }

  onClick = ()=>{
    this.setState({
      visual:true
    })
  }

  handleOk = ()=>{
    this.setState({
      visual:false
    })
  }

  render() {
    return (
      <div>
        <div style={{width:'100%',height:'150px'}} id={'pie'}/>
        <div style={{width:'100%',height:'200px'}} id={'bar'}/>
        <br/>
        <Button onClick={this.onClick}>查看更多</Button>
        <Modal
          visible={this.state.visual}
          width={800}
          onOk={this.handleOk}
          onCancel = {this.handleOk}
          title="数据可视化"
          style={{top:20,overflow:'auto'}}
        >
          <MoreCharts/>
        </Modal>
      </div>
    );
  }
}

export default DataVisual;
