import React, {Component} from 'react';
import 'antd/dist/antd.less';
import {Form,Input,Button,Mentions,List,Space,Tabs,Select,DatePicker,Tooltip,Modal,Spin,Tag, Empty} from 'antd';
import { Meteor } from "meteor/meteor";
import DataVisual from "./dataVisual";

const { Search } = Input;
const { Option } = Mentions;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
var http = require('http')


class DataHelper extends Component {
  constructor(props){
    super(props);
    this.state = {
      summarys: [],
      chat: [],
      summary_result: '',
      chat_from_date: [],
      summary_result_date: '',
      mp1: new Map(),
      mp2: new Map(),
      findByUsr: [],
      user:[],
      summarys_from_key:[],
      summarys_from_user:[],
      summarys_from_date:[],
      summaryInRoom:'test',
      memoFromUsr:{},
      memoFromDate:{},
      visual: false,
      usernameOnMemo:'',
      roomId:window.location.pathname.substr(7,17),
      visualByDate:false,
      keySearch:false,
      userSearch:false,
      dateSearch:false,
      userMemo:false,
      dateMemo:false
    }
  }
  componentDidMount() {
    console.log('componentDidMount',this.props.rid);
    var req = http.request(`http://localhost:2000/findChatsByRoom?roomId=${this.props.rid}`,response=>{
      var result = '';
      response.on('data',data=>{
        result += data;
      })
      response.on('end',()=>{
        JSON.parse(result);
        // console.log('this is chats:',result);
        var mp1 = new Map();
        var mp2 = new Map();
        for(let item of JSON.parse(result)){
          // console.log('this is item:',item);
          if(item["u"] && (item["msg"]!==""||item["attachments"])){
            let usr = item["u"];
            let username = item["u"]["username"];
            if (!mp1.has(username)){
              mp1.set(username,usr);
            }
            if (!mp2.has(username)){
              mp2.set(username,[])
            }
            let url = '';
            if(item["attachments"]&&item["attachments"].length){
              url = item["attachments"][0].audio_url;
            }
            mp2.get(username).push({msg:item["msg"], date:new Date(item["ts"]), url:url});
          }
        }
        this.setState({
          mp1,
          mp2
        })
        // console.log('this is mp2:',mp2);
      })
    })
    req.end();
  };

  dateFormat(fmt, date) {
    let ret;
    const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
    };
    return fmt;
  }


  onChange(value) {
    console.log('Change:', value);
  }

  onSelect(option) {
    console.log('select', option);
  }

  onClick = item =>{
    console.log('click', item);
    let FileSaver = require('filesaver.js-npm');
    var s = 'startTime: '+item.startTime+'\n\n'+'endTime: '+item.endTime+'\n\n'+'members: '+item.members+'\n\n'+'content: '+item.content;
    let blob = new Blob([s], {type: "text/plain;charset=gbk"});
    FileSaver.saveAs(blob, "memo.txt");
  }

  onSearchByKey = value =>{
    if(value != ''){
      var req = http.request(`http://localhost:2000/findSummaryByKey?roomId=${this.props.rid}&key=${value}`,response=>{
        var result = '';
        response.on('data',data=>{
          result += data;
        })
        response.on('end',()=>{
          console.log('search by key!!!:',result);
          this.setState({
            summarys_from_key:JSON.parse(result)
          })
        })
      })
      req.end();
    }
    // var result = ['市场非理性才能套利','市场无固定规则','有深度学习在股票市场做得好'];
    this.setState({
      keySearch:true
    })
  }
  onSearchByUser = value =>{
    if(value!=''){
      this.setState({
        userSearch:true
      })
      var req = http.request(`http://localhost:2000/findSummaryByUser?roomId=${this.props.rid}&username=${value}`,response=>{
        var result = '';
        response.on('data',data=>{
          result += data;
        })
        response.on('end',()=>{
          console.log('search by user!!!:',result);
          this.setState({
            summarys_from_user:JSON.parse(result)
          })
        })
      })
      req.end();
    }
  }
  onSearchPerson(){
    // console.log('this.state.chat:',this.state.chat)
  }

  callback(key) {
    //console.log(key);
  }

  onChangePerson = value=>{
    console.log(`selected ${value}`,this);
    var res = this.state.mp2.get(value);
    this.setState({
      user:[value],
      findByUsr:res,
      userMemo:true
    })
    console.log('res from user:',res);
  }

  onSelectPerson = value=>{
    console.log(`selected ${value}`);
    // this.setState({
    // 	chat:chat
    // })
    // console.log('after select:',this.state.chat);
  }

  onMomoByUser = val => {
    this.setState({
      visual: true
    })
    var source = this.state.findByUsr.map(item=>item.msg).join(' ');
    console.log('this is source:',source);

    fetch(`http://10.177.35.74:5000/summary/${source}`)
      .then(data=>data.text())
      .then((data)=>this.setState({
        memoFromUsr:{
          startTime: dateFormat("YYYY-mm-dd", this.state.findByUsr[0].date),
          endTime:dateFormat("YYYY-mm-dd", this.state.findByUsr[this.state.findByUsr.length-1].date),
          members:this.state.user,
          content:data
        }
      }))
      .catch(error=>console.log('error:',error))
  }

  onMomoByDate = val => {
    this.setState({
      visualByDate: true
    })
    let users = new Set(this.state.chat_from_date.map(item=>item.u.username));
    let source = this.state.chat_from_date.map(item=>item.msg).join(' ');

    fetch(`http://10.177.35.74:5000/summary/${source}`)
      .then(data=>data.text())
      .then((data)=>this.setState({
        memoFromDate:{
          startTime: dateFormat("YYYY-mm-dd", new Date(this.state.chat_from_date[0].ts)),
          endTime:dateFormat("YYYY-mm-dd", new Date(this.state.chat_from_date[this.state.chat_from_date.length-1].ts)),
          members:[...users],
          content: data
        }
      }))
      .catch(error=>console.log('error:',error))
  }

  handleOk = () =>{
    this.setState({
      visual: false
    })
    var object = {
      _id: Math.random().toString(36).substr(2),
      txt: this.state.memoFromUsr,
      origin: "user",
      rid: this.props.rid,
      username: this.state.user,
      ts:new Date()
    }
    var objstr = JSON.stringify(object)
    console.log('this is objstr:',objstr);
    var req = http.request(`http://localhost:2000/insertSummary?txt=${objstr}`,(res) => {
      console.log("res after insert");
    })
    req.end();
  }

  handleCancel = () =>{
    this.setState({
      visual: false
    })
  }

  handleOkByDate = () =>{
    this.setState({
      visualByDate: false
    })
    var object = {
      _id: Math.random().toString(36).substr(2),
      txt: this.state.memoFromDate,
      origin: "date",
      rid: this.props.rid,
      ts:new Date()
    }
    var objstr = JSON.stringify(object)
    var req = http.request(`http://localhost:2000/insertSummary?txt=${objstr}`,(res) => {
      console.log("res after insert");
    })
    req.end();
  }

  handleCancelByDate = () =>{
    this.setState({
      visualByDate: false
    })
  }

  onDateChange = value =>{
    console.log('selected:',value);
    console.log('rid:',this.props.rid);
    this.setState({
      dateMemo:true
    })
    fetch(`http://localhost:2000/findChatsByDate?roomId=${this.props.rid}&starttime=${new Date(value[0]["_d"])}&endtime=${new Date(value[1]["_d"])}`)
      .then(data=>data.json())
      .then(data=>{
        console.log('this is data of date:',data);
        this.setState({
          chat_from_date:data
        })
      })
  }

  onDateOk = value =>{
    /*this.setState({
      chat_from_date
    })*/
  }

  onDateChangeFindSummary = value =>{
    console.log('selected:',value);
    this.setState({
      dateSearch:true
    })
    fetch(`http://localhost:2000/findSummarysByDate?roomId=${this.props.rid}&starttime=${new Date(value[0]["_d"])}&endtime=${new Date(value[1]["_d"])}`)
      .then(data=>data.json())
      .then(data=>{
        console.log('this is data of date:',data);
        this.setState({
          summarys_from_date:data
        })
      })
  }

  onKeyChange = () =>{
    if(this.state.keySearch){
      this.setState({
        keySearch:false,
        summarys_from_key:[]
      })
    }
  }

  onUserChange = () =>{
    if(this.state.userSearch){
      this.setState({
        userSearch:false,
        summarys_from_user:[]
      })
    }
  }

  render() {
    return (
      <div>
        {/*<Space direction="vertical">*/}
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab={"文本摘要"} key={1}>
            {
              this.state.summaryInRoom.length?
                <div>
                  <Button>更新聊天室摘要</Button>
                </div>
                :
                <div>
                  <br/>
                  <Button>生成聊天室摘要</Button>
                </div>
            }
          </TabPane>
          <TabPane tab="检索" key={2}>
            <Tabs defaultActiveKey="2" onChange={this.callback}>
              <TabPane tab={"消息检索"} key={1}>
              </TabPane>
              <TabPane tab={"备忘录检索"} key={2}>
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                  <TabPane tab={"按关键词查找"} key={1}>
                    <Space direction="vertical">
                      <Search placeholder="关键词查找" allowClear onSearch={this.onSearchByKey} style={{ width: 200 }} onChange={this.onKeyChange}/>
                      {
                        this.state.keySearch && (this.state.summarys_from_key.length?<List
                          itemLayout="vertical"
                          bordered
                          dataSource={this.state.summarys_from_key}
                          style={{maxHeight:380,overflow:'auto'}}
                          renderItem={item => (
                            <List.Item
                              // actions={[<Button onClick={()=>this.onClick(item.txt)}>导出</Button>]}

                            >
                              <List.Item.Meta
                                title={item.txt.startTime+'至'+item.txt.endTime}
                                description={item.txt.members.map(item=><Tag>{item}</Tag>)}
                              />
                              <div>{item.txt.content}</div>
                            </List.Item>
                          )}
                        />:<Empty />)
                      }
                    </Space>
                  </TabPane>
                  <TabPane tab={"按用户查找"} key={2}>
                    <Space direction="vertical">
                      <Search placeholder="按用户查找" allowClear onSearch={this.onSearchByUser} style={{ width: 200}} onChange={this.onUserChange}/>
                      {
                        this.state.userSearch && (this.state.summarys_from_user.length?<List
                          itemLayout="vertical"
                          bordered
                          dataSource={this.state.summarys_from_user}
                          style={{maxHeight:380,overflow:'auto'}}
                          renderItem={item => (
                            <List.Item>
                              <List.Item.Meta
                                title={item.txt.startTime+'至'+item.txt.endTime}
                                description={item.txt.members.map(item=><Tag>{item}</Tag>)}
                              />
                              <div>{item.txt.content}</div>
                            </List.Item>
                          )}
                        />:<Empty />)
                      }
                    </Space>
                  </TabPane>
                  <TabPane tab={"按日期查找"} key={3}>
                    <Space direction="vertical">
                      <RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        onChange={this.onDateChangeFindSummary}
                        onOk={this.onDateOk}
                      />
                      {
                        this.state.dateSearch && (this.state.summarys_from_date.length?<List
                          itemLayout="vertical"
                          bordered
                          dataSource={this.state.summarys_from_date}
                          style={{maxHeight:380,overflow:'auto'}}
                          renderItem={item => (
                            <List.Item>
                              <List.Item.Meta
                                title={item.txt.startTime+'至'+item.txt.endTime}
                                description={item.txt.members&&item.txt.members.length?item.txt.members.map(item=><Tag>{item}</Tag>):<div></div>}
                              />
                              <div>{item.txt.content}</div>
                            </List.Item>
                          )}
                        />:<Empty />)}
                    </Space>
                  </TabPane>
                </Tabs>
              </TabPane>
            </Tabs>
          </TabPane>
          <TabPane tab="备忘录" key={3}>
            <Tabs defaultActiveKey="1" onChange={this.callback}>
              <TabPane tab="按用户备忘" key="1">
                <Space direction="vertical">
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange={this.onChangePerson}
                    onSearch={this.onSearchPerson}
                    onSelect={this.onSelectPerson}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {
                      [...this.state.mp1.keys()].map(item=><Option value={item}>{item}</Option>)
                    }
                  </Select>
                  {
                    this.state.userMemo && (this.state.findByUsr.length?
                        <Space direction="vertical">
                          <List
                            bordered
                            dataSource={this.state.findByUsr}
                            style={{maxHeight:350,overflow:'auto'}}
                            renderItem={item => (
                              <List.Item>
                                <List.Item.Meta style={{width:'380px'}}
                                                title={dateFormat("YYYY-mm-dd HH:MM", item.date)}
                                                description={item.msg.length?item.msg:<audio src={item.url} controls>no support</audio>}
                                  // description={item.msg}
                                />
                              </List.Item>
                            )}/>
                          <Button onClick={this.onMomoByUser}>生成备忘录</Button>
                        </Space>:<Empty />
                    )
                  }

                  <Modal
                    title="备忘录" visible={this.state.visual} onOk={this.handleOk} onCancel={this.handleCancel}
                  >
                    {Object.keys(this.state.memoFromUsr).length ? <div>
                      <p><strong>开始日期： </strong>{this.state.memoFromUsr.startTime}</p>
                      <p><strong>结束日期： </strong>{this.state.memoFromUsr.endTime}</p>
                      <p><strong>参与人员： </strong>{this.state.memoFromUsr.members.map(item=><Tag>{item}</Tag>)}</p>
                      <p><strong>主要内容： </strong>{this.state.memoFromUsr.content}</p>
                      <br/>
                      <Button onClick={()=>this.onClick(this.state.memoFromUsr)}>备忘录导出</Button>
                    </div> : <Spin/>
                    }
                  </Modal>
                </Space>
              </TabPane>
              <TabPane tab={"按日期备忘"} key={2}>
                <Space direction="vertical">
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    onChange={this.onDateChange}
                    onOk={this.onDateOk}
                  />
                  {
                    this.state.dateMemo && (this.state.chat_from_date.length?
                      <Space direction="vertical">
                        <List
                          bordered
                          dataSource={this.state.chat_from_date}
                          style={{maxHeight:350,overflow:'auto'}}
                          renderItem={item => (
                            <List.Item>
                              <List.Item.Meta style={{width:'380px'}}
                                              title={item.u.username}
                                              description={item.msg.length?item.msg:item["attachments"]&&<audio src={item["attachments"][0].audio_url} controls>no support</audio>}
                                //   description={item.msg}
                              />
                            </List.Item>
                          )}
                        />
                        <Button onClick={this.onMomoByDate}>生成备忘录</Button>
                      </Space>
                      :
                      <Empty />)
                  }
                  <Modal
                    title="备忘录" visible={this.state.visualByDate} onOk={this.handleOkByDate} onCancel={this.handleCancelByDate}
                  >
                    {Object.keys(this.state.memoFromDate).length ? <div>
                      <p><strong>开始日期： </strong>{this.state.memoFromDate.startTime}</p>
                      <p><strong>结束日期： </strong>{this.state.memoFromDate.endTime}</p>
                      <p><strong>参与人员： </strong>{this.state.memoFromDate.members.map(item=><Tag>{item}</Tag>)}</p>
                      <p><strong>主要内容： </strong>{this.state.memoFromDate.content}</p>
                      <br/>
                      <Button onClick={()=>this.onClick(this.state.memoFromDate)}>备忘录导出</Button>
                    </div> : <Spin/>
                    }
                  </Modal>
                </Space>
              </TabPane>
            </Tabs>
          </TabPane>
          <TabPane tab="数据可视化" key={4}>
            <DataVisual/>
          </TabPane>
        </Tabs>

      </div>
    );
  }
};
export default DataHelper;
