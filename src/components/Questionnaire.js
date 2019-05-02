import React, {Component} from 'react'
import axios from 'axios'
import './Questionnaire.css'
import 'antd/dist/antd.css'
import { Button, Modal, Form, Input, Icon, message, Typography,notification, Card, List} from 'antd';
import api from './api'

const { Text } = Typography;
const { TextArea } = Input;
const openNotificationWithIcon = (type,msg,desc) => {
  notification[type]({
    message: msg||'Error,',
    description: desc||'there is an error in navigation, please go back!',
  });
};
const showMessage = (mode,msg) =>{
  if (mode === "error")
    message.error(msg)
  else if (mode === "success")
    message.success(msg)
  else message.warning(msg)
}
const ModalForm = Form.create({name:"modal_form"})(
  class extends Component{
    render(){
      const {
        visible, onCancel, onCreate, form, title
      } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title={title||"Add a question"}
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form>
            <Form.Item label="Title">
              {getFieldDecorator('title', {
                 rules: [{ required: true,message: 'Please input your title!' },{max:32,message:"Your title is too long."}],
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
      visible:false,
      modal_title:"Add a question",
      answers:[]
    }
  }
  updateQuestionnaire = (location) =>{
    let that = this
    axios.get(location).then(res => {
      console.log(res.data)
      that.setState({
          title:res.data.title,
          id:res.data.id,
          description:res.data.description
      })
    })
  }
  updateQuestions = (location) =>{
    let that = this
    axios.get(location).then(res => {
      console.log(res.data)
      that.setState({
        listLen:res.data.items.length, 
        questions:res.data.items
      })
    })
  }
  updateAnswers=()=>{
    let answers = this.state.answers
    answers.forEach((q,index)=>{
      if (q && q.length!==0)
        axios.get(api.prefix.substr(0,api.prefix.length-2)+q[0]["@controls"]["self"]["href"]).then(res=>{
          console.log(res)

        })
    })
  }
  showModal = () => {
    this.setState({ visible: true, create:null });
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
      let data = {"title":values["title"],"description":values["description"]}
      if (this.state.create){
        axios.put(this.state.targetLocation, data).then(res=>{
          
          let url = res.request.responseURL
          console.log(url)
          // url = url.substring(0,url.lastIndexOf("questions/"))
          // console.log(url)
          if (this.state.create === "editquestionnaire"){
            this.updateQuestionnaire(url)
          } 
          else this.updateQuestions(url.substring(0,url.lastIndexOf("questions/")+10))
          
        })
      }else{
        axios.post(that.props.location.state["location"]+"questions/",data).then(res=>{
          console.log(res)
          // let url = res.request.responseURL         
          // this.updateQuestions(url)
          axios.get(res.request.responseURL).then(res =>{
            console.log("update questions")
            that.setState({
              questions:res.data.items
            })
          })    
        })
      }
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
  handleDelete(location,deleteType,e){
    e.persist()
    // e.stopPropagation();
    
    let that = this
    console.log("delete: "+ location)
    axios.delete(location).then(res=>{
      console.log("Delete res",res)
      if(deleteType === "question"){
        let url = String(res.request.responseURL)
        url = url.substring(0,url.lastIndexOf("questions/")+10)//a good way for string slice
        console.log(url)
        axios.get(url).then(res =>{
          that.setState({
            questions:res.data.items
          })
        }) 
      }else if (deleteType==="answer"){
        let url = location.substring(0,location.lastIndexOf("answers/")+8)
        console.log(url)  
        axios.get(url).then(res=>{
          console.log(res)
          let answers = that.state.answers
          let qIdx= url.substring(url.lastIndexOf("questions/")+10,url.lastIndexOf("/answers"))
          console.log(qIdx)
          answers[qIdx] = res.data.items
          that.setState({answers:answers})
        })
      }
    }).then(() => {
      if (deleteType === "questionnaire")
        this.props.history.push("/")
      else
        showMessage("success", deleteType+" is deleted!")
    })

  }
  handleEdit(location,editType,e){
    e.stopPropagation();
    console.log("edit"+ location)
    this.setState({
      create:"edit"+editType,
      targetLocation:location,
      visible:true,
      modal_title:"Edit a "+editType,
      
    })
  }
  seeAnswers(url,index){
    let that = this
    var answers = this.state.answers
    if (that.state.answers[index]){
      answers[index] = null
      that.setState({answers:answers})
      console.log(that.state)
    }else {
      axios.get(url+"answers/").then(res=>{
        console.log(res)
        if(res.data.items.length>0){
          var answers = that.state.answers
          answers[index]= res.data.items
          that.setState({
            answers: answers
          })
        }else showMessage("w","No answers here")
        
        
      })
    }
  }
  render() {
    let that = this
    var questionnaireURL = this.props.location.state["location"]
    const questionCards = []
    const quesitons = this.state.questions
    console.log(quesitons)
    if (quesitons.length !== 0)
      quesitons.forEach((q,index)=>{
        var url = api.root.substring(0,api.root.length-1) + q["@controls"]["self"]["href"]
        var answer_card = <List
                itemLayout="horizontal"
                size="small"
                dataSource={that.state.answers[index] || ["No answer here."]}
                style={{"display": that.state.answers[index] ? 'block' : 'none'}}
                renderItem={item => (
                  <List.Item extra={<Icon value={index} onClick={(e)=>that.handleDelete(url+"answers/"+item.id+"/","answer",e)} type="close" style={{ paddingRight: "0.8em" }} />}>
                    <List.Item.Meta
                      description={<div><Text strong>{item.userName}</Text> <Text type="secondary">Answer id: {item.id}</Text><br/>{item.content}</div>}
                    />
                  </List.Item>
                )}
              />
        questionCards.push(
          <Card type="inner" 
            size="small"
            hoverable="True"
            onClick={this.seeAnswers.bind(this,url,index)}
            title={q.title} 
            key={q.id} 
            style={{marginTop:"10px",minHeight:"80px"}}
            extra={<div>
                    <Icon onClick={(e)=>this.handleDelete(url,"question",e)} type="delete" style={{paddingRight:"0.8em"}}/>
                    <Icon onClick={(e)=>this.handleEdit(url,"quesiton",e)} type="edit" />
                  </div>}
          >
            <p>{q.description ? ("Description:" + q.description ): "no description"}</p>
            <Card type="inner" size="small" style={{"display": that.state.answers[index] ? 'block' : 'none'}}>
              {answer_card}
            </Card>
          </Card>
            
        )
      })
    
    return (
      <div className="container">
        <Card title={this.state.title} className='card' headStyle={{fontsize: "40px",fontweight: 500}} 
          extra = {<div>
                    <Icon onClick={this.handleDelete.bind(this,questionnaireURL,"questionnaire")} type="delete" style={{paddingRight:"0.8em"}}/>
                    <Icon onClick={this.handleEdit.bind(this,questionnaireURL,"questionnaire")} type="edit" />
                  </div>} 
        >
          <p className="questionnaire_info">{this.state.description ? ("Description:" + this.state.description ): "no description"}
          <br/>Questionnaire id:  {this.state.id}
          <br/>Questions:</p>
          <div className="q_cards">
          {questionCards}
          </div>
          <div className="buttons_">
            <Button onClick={this.showModal} className="button">Add a question</Button>
            <Button type="primary" className="button" onClick={this.props.history.goBack}>Complete !</Button>
            <ModalForm
              title = {this.state.modal_title}
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