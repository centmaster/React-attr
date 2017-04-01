import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {render,ReactDOM} from 'react-dom'
import request from 'superagent';
import { Table, Input, Popconfirm ,Icon} from 'antd';
import {Modal,Button} from 'antd';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;



var Main=React.createClass({
    getInitialState:function () {
        return{
            onlineStatus:"default-offline",
            endTime:20170101,
            setPrize:[],
            inputValue:'000000',
            show:[0,'block','none','none','none','none','block'],
            haveGet:false,
            customInfo:[]
            // xiaomiId:666,
            // winPrize:miui,
            // winStatus:yes,
            // chanceCount:0

        };
    },

    changeValue:function (value) {
        this.setState({inputValue:value})
    },


    changePage:function (i) {
        var arr=this.state.show;
        arr[i]=='block'?arr[i]='none':arr[i]='block';
        //arr[j]=='block'?arr[j]='none':arr[j]='blcok';
        this.setState({
          show:arr

        })
        // this.state.show[j]=='block'?this.state.show[j]='none':this.state.show[j]='block';
        // this.state.show[i]=='block'?this.state.show[i]='none':this.state.show[i]='block';
        //console.log(i);

    },

    searchActiveId:function () {//输入日期，拉数据
        var inputValue=this.state.inputValue;
        var that=this;
        request
            .get('http://10.232.32.48:8082/flowActivity/findActivity.do?activityId='+inputValue)
            .end(function (err, res) {
                if(res.body.status=='fail'){
                 console.log('can not find data');
                    that.setState({
                        show:[0,'block','block','block','blcok','block','none']
                    })
                }else{
                    var save=res.body.prize;
                    save.map(function (value, index) {
                        value.key=index+1;
                    })
                    console.log(save);
                   //console.log(res.body.text.prize);
                   that.setState({
                       setPrize:res.body.prize,
                       onlineStatus:res.body.onlineState,
                       endTime:res.body.endDate,
                       customInfo:[res.body.user.address,res.body.user.status,res.body.user.rewardType,res.body.user.xiaomiId,res.body.user.chanceCount]
                       // chanceCount:res.body.user.chanceCount,
                       // winStatus:res.body.user.status,
                       // winPrize:res.body.user.rewardType,
                       // xiaomiId:res.body.user.xiaomiId,
                       //address:res.body.user.address
                   })
                    console.log(res.body.user);
                    if(!res.body.user.hasOwnProperty("xiaomiId")){
                        console.log("yes,do")
                       that.setState({
                           show:[0,'block','block','block','block','block','none']
                       })

                    }
                }

            })

            // this.changePage(1);
            // this.changePage(2);

    },

    searchNewId:function (Value) {
        var that=this;
        request
            .get('http://10.232.32.48:8082/flowActivity/findActivity.do?activityId='+Value)
            .end(function (err, res) {
                if(res.text==undefined){
                    console.log('can not find data');
                }else{

                    //console.log(res.body.text.prize);
                    var save=res.body.prize;
                    save.map(function (value, index) {
                        value.key=index;
                    })
                    that.setState({
                        setPrize:save,
                        onlineStatus:res.body.onlineState,
                        endTime:res.body.endDate
                    })
                }

            })

    },

    customId:function () {
        var inputValue=this.state.inputValue;
        var api="localhost:4000/"
        var that=this;
        request
            .get('http://localhost:4000/custom')
            .query({begindate:inputValue})
            .end(function (err, res) {
                if(res.text==undefined){
                    console.log("can not find this person");
                }else{
                    console.log(res.body[0]);
                    that.setState({
                        xiaomiID:res.body[0].id,
                        chance:res.body[0].chance,
                        haveGet:res.body[0].haveGet
                    })
                }
            })
        // this.changePage(1);
        // this.changePage(2);
        // this.changePage(3);
        // this.changePage(4);
    },

    createActivity:function (arr) {
      var activityId=arr[0];
      var endTime=arr[1];
      var that=this;
      request
          .get('http://10.232.32.48:8082/flowActivity/createActivity.do?activityId='+activityId+'&'+'endTime='+endTime)
           .end(function (err, res) {
            console.log("successfully create activity!");
            //this.searchActiveId();
            // this.setState({
            //     refresh:"forre"
            // })
        })
    },

    createNewItem:function (name,number,rate) {
        var inputValue=this.state.inputValue;
        var that=this;
        request
            .get('http://10.232.32.48:8082/flowActivity/addOrUpdatePrize.do?activityId='+inputValue+'&prizeName='+name+'&prizeNum='+number+'&prizeRate='+rate)
            .end(function (err, res) {
                console.log("successfully create item");
                //that.searchActiveId();
                // location.reload()
                 var prize = that.state.setPrize
                 var key=prize.length+1;
                 prize.push({prizeName:name,number:number,rate:rate,key:key})
                console.log(prize);
                 that.setState({setPrize:prize})
            })
    },

    updateOne:function (index,key,value) {
        var inputValue=this.state.inputValue;
        var prizeName=this.state.setPrize[index].prizeName;
        var prizeNum=this.state.setPrize[index].number;
        var prizeRate=this.state.setPrize[index].rate;
        var arr=[prizeName,prizeNum,prizeRate];
        var that=this;
        console.log(key,value);
        if(key=='name'){
            arr[0]=value;
        }else if(key=='number'){
            arr[1]=value;
        }else if(key='rate'){
            arr[2]=value;
        }
        request
            .get('http://10.232.32.48:8082/flowActivity/addOrUpdatePrize.do?activityId='+inputValue+'&prizeName='+arr[0]+'&prizeNum='+arr[1]+'&prizeRate='+arr[2])
            .end(function (err, res) {
                console.log("successfully create  one item");

            })
    },

    deleteItem:function (index) {
        var inputValue=this.state.inputValue;
        var prizeName=this.state.setPrize[index].prizeName;
        var that=this;
        request
            .get('http://10.232.32.48:8082/flowActivity/delPrize.do?activityId='+inputValue+'&prizeName='+prizeName)
            .end(function (err, res) {
                console.log("successfully delete  one item");
                // that.searchActiveId();
                var prize=that.state.setPrize;
                prize.splice(index,1);
                that.setState({setPrize:prize

                });

            })
    },

    createCustomId:function (id) {
        var that=this;
        var inputValue=this.state.inputValue;
        console.log(id);
          request
              .get('http://10.232.32.48:8082/flowActivity/addChance.do?activityId='+inputValue+'&xiaomiId='+id+'&chanceCount=10')
                .end(function (err, res) {
            console.log("successfully create custom id");
                var arr=that.state.customInfo;
                arr[3]=id;
                  that.setState({customInfo:arr,
                      show:[0,'block','blcok','block','block','none','block']
                  });
        })
    },

    addChance:function (num) {
            var that=this;
            var activityId=this.state.inputValue;
            var xiaomiId=this.state.customInfo[3];
            var chanceCount=""+num;
            request
                .get('http://10.232.32.48:8082/flowActivity/addChance.do?activityId='+activityId+'&xiaomiId='+xiaomiId+'&chanceCount='+chanceCount)
                .end(function (err, res) {
            console.log("successfully add chance");
            var changeArr=that.state.customInfo;
            changeArr[4]=num;
            that.setState({
                customInfo:changeArr
            })
        })
    },

    showCustomInfo:function () {
      this.setState({
          show:[0,'block','none','none','none','none','block']
      })
    },

    delInfo:function () {
        var activityId=this.state.inputValue;
        var xiaomiId=this.state.customInfo[3];
        var that=this;
        request
            .get('http://10.232.32.48:8082/flowActivity/delRecord.do?activityId='+activityId+'&xiaomiId='+xiaomiId)
            .end(function (err, res) {
                    console.log("yes delete record");
                var changeArr=that.state.customInfo;
                changeArr[1]=null;
                changeArr[2]=null;
                that.setState({
                    customInfo:changeArr
                })

            })
    },

    delCustom:function () {
        var that=this;
        var activityId=this.state.inputValue;
        var xiaomiId=this.state.customInfo[3];
        request
            .get('http://10.232.32.48:8082/flowActivity/delUser.do?activityId='+activityId+'&xiaomiId='+xiaomiId)
            .end(function (err, res) {
                console.log("yes delete custom");
                var changeArr=that.state.customInfo;
                changeArr[3]=undefined;
                that.setState({
                    customInfo:changeArr,
                    show:[0,'block','block','block','block','block','none']
                })
            })
    },


    render:function () {

        return(
            <div className="MainContainer">

                <div className="activeId" style={{display:this.state.show[1]}}>
                    <First  changePage={this.changePage} changeValue={this.changeValue} searchId={this.searchActiveId} searchId2={this.searchNewId} createActivity={this.createActivity}/>

                </div>

                    <div>
                        <Second
                            show2={this.state.show[2]}
                            changePage={this.changePage}
                            data={[this.state.onlineStatus,this.state.endTime]}

                        />
                        <Fourth show4={this.state.show[4]} changePage={this.changePage} xiaomiId={this.state.xiaomiID} chance={this.state.chance} haveGet={this.state.haveGet} begindata={this.state.begindate}
                                createCustomId={this.createCustomId}   customInfo={this.state.customInfo} addChance={this.addChance} showInput={this.state.show[5]} showInfo={this.state.show[6]}
                                showCustomInfo={this.showCustomInfo} delInfo={this.delInfo} delCustom={this.delCustom}/>
                    </div>

                <br/>
                <br/>
                <hr/>
                <br/>
                <br/>

                    <div>
                        <Third show3={this.state.show[3]} changePage={this.changePage} prize={this.state.setPrize} createNewItem={this.createNewItem} id="thirdPage" updateOne={this.updateOne}
                        deleteItem={this.deleteItem} />
                    </div>


            </div>

        )
    }
})



class First extends React.Component {
    state = {
        loading: false,
        visible: true,
        begindate:"20170101",
        enddate:"20170101"

    }

    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 1000);
    }
    handleCancel = () => {
        this.setState({ visible: false });
        this.props.changePage(4);
    }


    handleCancelx = () => {
        this.setState({ visible: false });

    }
    changePage = () =>{

            this.props.changePage(2);
            this.props.changePage(3);
            this.props.changePage(4);
            this.props.searchId();


        this.setState({ visible: false });
    }

    changeValue = (e) =>{
        this.props.changeValue(e.target.value);
    }

    createActivity = () =>{
        var arr=[];
        //console.log(this.state.begindate);
        arr.push(this.state.begindate);
        arr.push(this.state.enddate);
        this.props.createActivity(arr);
        this.props.changePage(2);
        this.props.changePage(3);
        this.props.changePage(4);

        this.setState({
            loading:true
        });
        setTimeout(() => {
            this.props.searchId2(this.state.begindate);
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);

    }

    updateid = (e) =>{
        this.setState({begindate:e.target.value});
    }




    render() {
        var that=this;
        function onChange(value, dateString) {

            that.setState({enddate:dateString});
        }

        return (
            <div>
                <Modal
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancelx}
                    footer={[]}
                    confirmLoading={this.state.loading}
                >

                    <Tabs defaultActiveKey="1" onChange={this.changeTabnum}>
                        <TabPane tab="查询活动" key="1"><Input onChange={this.changeValue}  placeholder="输入活动id"/>

                            <Button type="primary" size="large" onClick={()=>this.changePage()}>查询活动</Button></TabPane>
                        <TabPane tab="创建活动" key="2">
                            <div>
                               <ul>
                                   <li><span>下线时间:</span><DatePicker
                                       showTime
                                       format="YYYY-MM-DD HH:mm:ss"
                                       placeholder="Select Time"
                                       onChange={onChange}
                                       onOk={[]}
                                   /></li>
                                   <li><span >活 动 ID :</span><Input style={{width:155,height:25}} onChange={this.updateid}/></li>
                               </ul>
                            </div>
                            <Button type="primary" size="large" onClick={(e)=>this.createActivity()}>创建活动</Button>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        );
    }
}




var Second=React.createClass({

    changePage2:function () {
      this.props.changePage(2);
      this.props.changePage(3);
     },


    render:function () {
        return (
        <div className="secondPage" style={{display:this.props.show2}}>
            <title>状态查看</title>
            <ul>
                <li><h3><span>上线状态</span> <span>{this.props.data[0]}</span></h3></li>
                <li><h3><span>结束时间</span> <span>{this.props.data[1]}</span></h3></li>

            </ul>

        </div>
        )
    }

})



class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: false,
    }
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
    }
    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }
    edit = () => {
        this.setState({ editable: true });
    }
    render() {
        const { value, editable } = this.state;
        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Input
                                value={value}
                                onChange={this.handleChange}
                                onPressEnter={this.check}
                            />
                            <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                            />
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {value || ' '}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                            />
                        </div>
                }
            </div>
        );
    }
}

var Third = React.createClass({
    getInitialState() {



        this.columns = [{
            title: 'prizeName',
            dataIndex: 'prizeName',
            width: '30%',
            key:'prizeName',
            render: (text, record, index) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(index, 'prizeName')}
                />
            ),
        }, {
            title: 'number',
            dataIndex: 'number',
            key:'number',
            render: (text, record, index) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(index, 'number')}
                />
            ),
        }, {
            title: 'rate',
            dataIndex: 'rate',
            key:'rate',
            render: (text, record, index) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(index, 'rate')}
                />
            ),
        }, {
            title: 'operation',
            dataIndex: 'operation',
            key:'operation',
            render: (text, record, index) => {
               // console.log(this.state.dataSource.length);
                return (
                    // this.state.dataSource.length > 1 ?
                    //     (//delete data
                            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(index)}>
                                <a href="#">Delete</a>
                            </Popconfirm>
                        // ) : null
                );
            },
        }];



        return {
            visible:false,
            name:'m',
            number:'10',
            rate:'0.1',
            dataSource:this.props.prize

        };
    },




    // componentDidMount:function () {
    //   this.setState({
    //       dataSource:this.props.prize
    //   })
    // },
    onCellChange(index, key){
        return (value) => {
            console.log(index+'###'+key+'$$$'+value);
            this.props.updateOne(index,key,value);
             // const dataSource = [...this.state.dataSource];
             // dataSource[index][key] = value;
             // this.setState({ dataSource });
        };
    },
    onDelete  (index)  {
        //console.log(index);

        // var presentPrize=this.props.prize;
        // presentPrize.splice(index,1);
        this.props.deleteItem(index);
        //console.log(this.props.prize);
        // const dataSource = [...this.state.dataSource];
        // dataSource.splice(index, 1);


    },
    handleAdd  ()  {
        // const { count, dataSource } = this.state;
        // const newData = {
        //     key: count,
        //     prizename: 'new',
        //     number: 100,
        //     rate: 1,
        // };
        // this.setState({
        //     dataSource: [...dataSource, newData],
        //     count: count + 1,
        // });
    },
    returnMain:function () {
        this.props.changePage(3);
        this.props.changePage(4);
    },
    showModal:function () {
        this.setState({
            visible:true
        })
    } ,

    setName:function (e) {
        this.setState({
            name:e.target.value
        })
    },

    setNumber:function (e) {
        this.setState({
            number:e.target.value
        })
    },

    setRate:function (e) {
        this.setState({
            rate:e.target.value
        })
    },

    createNewItem:function () {
      this.props.createNewItem(this.state.name,this.state.number,this.state.rate);
        setTimeout(() => {
            this.setState({
                visible: false
            })
        },100);
        console.log(this.props.prize);
        // var presentPrize=this.props.prize;
        // this.setState({ dataSource:this.props.prize });

    },

    render() {

        const columns = this.columns;
       // console.log(this.props.prize);
        return (
            <div   style={{display:this.props.show3}}>
                <h1 style={{}}>配置奖品</h1>
                <Table bordered dataSource={this.props.prize} columns={columns} />
                <Button type="primary" className="editable-add-btn" onClick={this.showModal}>Add</Button>


                <div>
                    <Modal title="Basic Modal" visible={this.state.visible}
                    footer={[]}
                    >
                        <span>奖品名称：</span><Input onChange={this.setName}/>
                        <span>奖品数量：</span><Input onChange={this.setNumber}/>
                        <span>奖品比例：</span><Input onChange={this.setRate}/>
                        <Button type="primary" onClick={this.createNewItem}>确定创建</Button>
                    </Modal>

                </div>
            </div>

        );
    }
})




var Fourth=React.createClass({

    getInitialState:function(){
        return {
            chance:0,
            saveXiaomiInput:0
        }

    },

    createId:function () {

        //console.log(value)
        this.props.showCustomInfo();
        this.props.createCustomId(this.state.saveXiaomiInput);
    },

    addChance:function () {
             this.props.addChance(this.state.chance);

    },

    setChance:function (e) {
          this.setState({
              chance:e.target.value
          })
    },

    xiaomiInput:function (e) {
        this.setState({
            saveXiaomiInput:e.target.value
        })
    },

    render:function () {


        //[res.body.user.address,res.body.user.status,res.body.user.rewardType,res.body.user.xiaomiId,res.body.user.chanceCount]


        return(
            <div className="FourthPage" style={{display:this.props.show4}}>
                <h1>用户操作</h1>
                <br/>
                <div className="createID" style={{display:this.props.showInput}}>
                    <Input style={{width:200 }} onChange={this.xiaomiInput}/><Button type="primary" onClick={this.createId}>用户ID</Button>
                </div>
                <div className="showInfo" style={{display:this.props.showInfo}}>

                    <ul>
                        <li><Button disabled="disabled" style={{width:450}}>中奖人地址:{this.props.customInfo[0]||"尚未填写地址信息"}</Button></li>
                        <li><Button disabled="disabled" style={{width:300}}>小米用户ID：{this.props.customInfo[3]}</Button><Button style={{width:150}} type="primary" onClick={this.props.delCustom}>删除此小米用户</Button></li>
                        <li><Button disabled="disabled" style={{width:300}} >中奖状态：{this.props.customInfo[1]||"nothing"}&&&&中奖礼品：{this.props.customInfo[2]||"nothing"}</Button><Button style={{width:150}} type="primary"
                                                                                                                                                                onClick={this.props.delInfo}>删除中奖信息</Button></li>
                        <li><Input style={{width:300}}  type="text" onChange={this.setChance}/><Button style={{width:150}} type="primary" onClick={this.addChance}>抽奖剩余次数:{this.props.customInfo[4]}</Button></li>
                    </ul>

                </div>

            </div>
        )
    }
})







export default Main;