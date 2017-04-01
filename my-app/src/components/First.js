/**
 * Created by centmaster on 2017/3/31.
 */



import {render,ReactDOM} from 'react-dom'
import request from 'superagent';
import { Table, Input, Popconfirm ,Icon} from 'antd';
import {Modal,Button} from 'antd';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import React, { Component } from 'react';
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


export default First;