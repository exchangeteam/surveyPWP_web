import React, {Component} from 'react'
import {notification, Card} from 'antd'
import axios from 'axios'
import './Questionnaire.css'
import 'antd/dist/antd.css'
import { Button, Modal, Form, Input, Icon} from 'antd';
import api from './api'

const { TextArea } = Input;
const openNotificationWithIcon = (type) => {
  notification[type]({
    message: 'Error,',
    description: 'there is an error in navigation, please go back!',
  });
};

const ModalForm = Form.create({name:"modal_form"})(
  class extends Component{
    render(){
      const {
        visible, onCancel, onCreate, form,
      } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title="Add a question"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form>
            <Form.Item label="Title">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: 'Please input the title of the question!' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="Description">
              {getFieldDecorator('description')(<TextArea rows='3' />)}
            </Form.Item>
          </Form>
        </Modal>
      )
    }
  }
)
class Questionnaire extends Component {
  constructor(props, context) {
    super(props, context);
    this.state={
      listLen:0,
      questions:[],
      visible:false
    }
  }
  updateQuestions = (location) =>{
    let that = this
    axios.get(location+"questions/").then(res => {
      console.log(res.data)
      that.setState({
        listLen:res.data.items.length, 
        questions:res.data.items
      })
    })
  }
  showModal = () => {
    this.setState({ visible: true });
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
      this.setState({ visible: false });
      axios.post(that.props.location.state["location"]+"questions/",{"title":values["title"],"description":values["description"]}).then(res=>{
        console.log(res)
        axios.get(res.request.responseURL).then(res =>{
          console.log("update questions")
          that.setState({
            questions:res.data.items
          })
        })    
      })
    });
  }
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  componentDidMount(){
    let that = this;
    if (this.props.location.state["location"]){
      let location = this.props.location.state["location"]
      console.log("good"+location)
      axios.get(location).then(res=>{
        console.log(res.data)
        that.setState({
          id:res.data.id,
          title:res.data.title,
          description:res.data.description
        })
      }).then(()=>{
        axios.get(location+"questions/").then(res => {
          console.log(res.data)
          that.setState({
            listLen:res.data.items.length, 
            questions:res.data.items
          })
        })
      })
    }else 
      openNotificationWithIcon('error')
  }
  componentWillUpdate(){
    // this.updateQuestions(this.props.location.state["location"])
    console.log("update")
    // axios.get(this.props.location.state["location"]+"questions/").then(res => {
    //   this.setState({
    //     listLen:res.data.items.length, 
    //     questions:res.data.items
    //   })
    // })
  }
  handleDelete(location){
    console.log("delete"+ location)
    axios.delete(location,{headers:{"Accept":"application/vnd.mason+json"}}).then(res=>{
      console.log(res)
    })
  }
  handleEdit(location){
    console.log("edit"+ location)
  }
  render() {
    var questionnaireURL = this.props.location.state["location"]
    const questionCards = []
    for (let q of this.state.questions) {
      var url = api.root.substring(0,api.root.length-1) + q["@controls"]["self"]["href"]
      questionCards.push(
        <Card type="inner" 
          title={q.title} 
          key={q.id} 
          extra={<div>
                  <Icon onClick={this.handleDelete.bind(this,url)} type="delete" style={{paddingRight:"0.8em"}}/>
                  <Icon onClick={this.handleEdit.bind(this,url)} type="edit" />
                </div>}
        >
          <p>{q.description ? ("Description:" + q.description ): "no description"}</p>
          <p></p>
        </Card>
      )}
    return (
      <div>
        <Card title={this.state.title} className='card' headStyle={{fontsize: "30px",fontweight: 500}}
          extra = {<div>
                    <Icon onClick={this.handleDelete.bind(this,questionnaireURL)} type="delete" style={{paddingRight:"0.8em"}}/>
                    <Icon onClick={this.handleEdit.bind(this,questionnaireURL)} type="edit" />
                  </div>} 
        >
          <p>{this.state.description ? ("Description:" + this.state.description ): "no description"}</p>
          <p>Questionnaire id:  {this.state.id}</p>
          <p className="question_title">Questions:</p>
          {questionCards}
          <div className="button_add">
            <Button type="primary" onClick={this.showModal}>Add a question</Button>
            <ModalForm
              wrappedComponentRef={this.saveFormRef}
              visible={this.state.visible}
              onCancel={this.handleCancel}
              onCreate={this.handleCreate}
            />
          </div>
        </Card>
      </div>
    )
  }
}

export default Questionnaire