import React, { Component } from 'react';
import { Button, Card , message, Modal, Form,Input } from 'antd'
import axios from 'axios'
import api from './components/api'
import "./App.css"

const showMessage = (mode,msg) =>{
    if (mode === "error")
      message.error(msg)
    else if (mode === "success")
      message.success(msg)
    else message.warning(msg)
  }
  const ModalForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
        render() {
            const {
                visible, onCancel, onCreate, form,
            } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="Enter your user name."
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <Form.Item label="userName">
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: 'Please enter the a user name!' }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    }
);
class Home extends Component { 
    componentWillMount=()=>{
        axios.get(api.root+api.prefix+"questionnaires/").then(res=>{
            console.log(res)
            this.setState({list:res.data.items})
        })
    }
    constructor(props) {
        super(props);
        this.state = {
            list:[],
            visible:false
        }
    }
    goHome=()=>{
        console.log("go home")
        this.props.history.push('/')
    }
    toApp=()=>{
        this.props.history.push('/app')
    }
    showModal = (idx) => {
        this.setState({ visible: true, targetIndex: idx });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }
    handleCreate = () => {
        let that = this
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            console.log('Received values of form: ', values);
            form.resetFields();
            that.setState({ visible: false });
            let url = api.root + api.prefix + "questionnaires/" + that.state.targetIndex+"/"
            axios.get(url).then(res => {
                console.log(res)
                let location = api.root.substring(0,api.root.length-1)+res.data["@controls"]["self"]["href"]
                if (res.status === 200)
                    that.props.history.push({ pathname: '/answer', state: { location: location, userName:values["userName"] } });
                else showMessage("error", "questionnaire dosen't exist")
          },
          err =>{
            showMessage("error", "questionnaire dosen't exist")
          })
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    render() {
        var questionnaireCards = []
        var list = this.state.list
        for (let item of list){
            questionnaireCards.push(
                <Card
                    hoverable="true"
                    style={{marginTop:"10px",minHeight:"60px"}}
                    key={item.id}
                    onClick={this.showModal.bind(this,item.id)}
                >
                    <h4>{item.title}</h4>
                    {item.description ? "Description: "+item.description : "No description provided"}
                </Card>
            )
        }
        return (
            <div className ="home">  
                <h1 onClick={this.goHome}>Survey PWP</h1>
                <div className="header">
                    <h3>Recent questionnaires</h3>
                </div>
                <div className="card">
                    {questionnaireCards || "no questionnaire yet"}
                </div>
                <Button type="primary" onClick={this.toApp}>
                    Create my questionnaire
                </Button>
                <ModalForm
                            wrappedComponentRef={this.saveFormRef}
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            onCreate={this.handleCreate}
                        />
            </div>
        );
    }
}

export default Home;
