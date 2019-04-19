import React, {Component} from 'react'
import {notification, Card} from 'antd'
import axios from 'axios'
import './Questionnaire.css'
import 'antd/dist/antd.css'
import { Button, Modal, Form, Input, Icon, message} from 'antd';
import api from './api'

const { TextArea } = Input;
const openNotificationWithIcon = (type,msg,desc) => {
  notification[type]({
    message: msg||'Error,',
    description: desc||'there is an error in navigation, please go back!',
  });
};
const showMessage = (mode,msg) =>{
  if (mode == "error")
    message.error(msg)
  else if (mode == "success")
    message.success(msg)
  else message.warning(msg)
}
// const ModalForm = Form.create({name:"modal_form"})(
//   class extends Component{
//     render(){
//       const {
//         visible, onCancel, onCreate, form, title
//       } = this.props;
//       const { getFieldDecorator } = form;

//       return (
//         <Modal
//           visible={visible}
//           title={title||"Add a question"}
//           okText="Create"
//           onCancel={onCancel}
//           onOk={onCreate}
//         >
//           <Form>
//             <Form.Item label="Title">
//               {getFieldDecorator('title', {
//                 rules: [{ required: true, message: ('Please input the title!') }],
//               })(
//                 <Input />
//               )}
//             </Form.Item>
//             <Form.Item label="Description">
//               {getFieldDecorator('description')(<TextArea rows='3' />)}
//             </Form.Item>
//           </Form>
//         </Modal>
//       )
//     }
//   }
// )
class Answer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state={
      listLen:0,
			questions:[],
			inputValues:{}
    }
  }
//   updateQuestionnaire = (location) =>{
//     let that = this
//     axios.get(location).then(res => {
//       console.log(res.data)
//       that.setState({
//           title:res.data.title,
//           id:res.data.id,
//           description:res.data.description
//       })
//     })
//   }
//   updateQuestions = (location) =>{
//     let that = this
//     axios.get(location).then(res => {
//       console.log(res.data)
//       that.setState({
//         listLen:res.data.items.length, 
//         questions:res.data.items
//       })
//     })
//   }
//   showModal = () => {
//     this.setState({ visible: true, create:null });
//   }

//   handleCancel = () => {
//     this.setState({ visible: false });
//   }
//   handleCreate = () => {
//     let that = this
//     const form = this.formRef.props.form;
//     form.validateFields((err, values) => {
//       if (err) {
//         return;
//       }
//       console.log('Received values of form: ', values);
//       form.resetFields();
//       this.setState({ visible: false });
//       let data = {"title":values["title"],"description":values["description"]}
//       if (this.state.create){
//         axios.put(this.state.targetLocation, data).then(res=>{
          
//           let url = res.request.responseURL
//           console.log(url)
//           // url = url.substring(0,url.lastIndexOf("questions/"))
//           // console.log(url)
//           if (this.state.create === "editquestionnaire"){
//             this.updateQuestionnaire(url)
//           } 
//           else this.updateQuestions(url.substring(0,url.lastIndexOf("questions/")+10))
          
//         })
//       }else{
//         axios.post(that.props.location.state["location"]+"questions/",data).then(res=>{
//           console.log(res)
//           // let url = res.request.responseURL         
//           // this.updateQuestions(url)
//           axios.get(res.request.responseURL).then(res =>{
//             console.log("update questions")
//             that.setState({
//               questions:res.data.items
//             })
//           })    
//         })
//       }
//     });
//   }
//   saveFormRef = (formRef) => {
//     this.formRef = formRef;
//   }
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
	handleChange = (e)=>{
		let values = this.state.inputValues
		values[e.target.id] = e.target.value// A good way to set state with variable keys and values
		this.setState({
			inputValues:values
		})
	}
	handleSubmit = ()=>{
		let url = this.props.location.state["location"]
		axios.get(url).then(res=>{
			if (res.status===200)
				this.uploadAnswers(url)
			else openNotificationWithIcon('error',"Couldn't reach to the questionnaire","")
		}).then(res=>{
      showMessage("success","Requests complete!")
      setTimeout(this.props.history.goBack.bind(this),1500);
		})
	}
	uploadAnswers = (location)=>{
		let that = this
		console.log(location)
		let values = this.state.inputValues
		Object.keys(values).map((key,idx)=>{
			let data = {
					userName:that.props.location.state["userName"],
					content:values[key]
				}
				axios.post(location+"questions/"+key+"/answers/",data).then(res=>{
					console.log("Answer to question "+key+" answered!",res)
				})
			}
		)
		
	}
//   handleDelete(location,deleteType){
//     let that = this
//     console.log("delete"+ location)
//     axios.delete(location).then(res=>{
//       if(deleteType === "question"){
//         console.log(res)
//         let url = String(res.request.responseURL)
//         url = url.substring(0,url.lastIndexOf("questions/")+10)//a good way for string slice
//         console.log(url)
//         axios.get(url).then(res =>{
//           that.setState({
//             questions:res.data.items
//           })
//         }) 
//       }  
//     }).then(() => {
//       if (deleteType == "questionnaire")
//         this.props.history.push("/")
//       else if (deleteType == "question")
//         showMessage("success", deleteType+" is deleted!")
//     })

//   }
//   handleEdit(location,editType){
//     console.log("edit"+ location)
//     this.setState({
//       create:"edit"+editType,
//       targetLocation:location,
//       visible:true,
//       modal_title:"Edit a "+editType,
      
//     })
//   }
  render() {
    // var questionnaireURL = this.props.location.state["location"]
    const questionCards = []
    for (let q of this.state.questions) {
    //   var url = api.root.substring(0,api.root.length-1) + q["@controls"]["self"]["href"]
      questionCards.push(
        <Card type="inner" 
          title={q.title} 
          key={q.id} 
        //   extra={<div>
        //           <Icon onClick={this.handleDelete.bind(this,url,"question")} type="delete" style={{paddingRight:"0.8em"}}/>
        //           <Icon onClick={this.handleEdit.bind(this,url,"quesiton")} type="edit" />
        //         </div>}
        >
          <p>{q.description ? ("Description:" + q.description ): "no description"}</p>
          <p></p>
					<TextArea autosize onChange={this.handleChange} id={q.id}/>
        </Card>
      )}
    return (
      <div className="container">
        <Card title={this.state.title} className='card' headStyle={{fontsize: "30px",fontweight: 500}}
        //   extra = {<div>
        //             <Icon onClick={this.handleDelete.bind(this,questionnaireURL,"questionnaire")} type="delete" style={{paddingRight:"0.8em"}}/>
        //             <Icon onClick={this.handleEdit.bind(this,questionnaireURL,"questionnaire")} type="edit" />
        //           </div>} 
        >
          <p>{this.state.description ? ("Description:" + this.state.description ): "no description"}</p>
          <p>Questionnaire id:  {this.state.id}</p>
          <p className="question_title">Questions:</p>
          {questionCards}
          <div className="buttons_">
            <Button type="primary" onClick={this.handleSubmit}>Submit</Button>
          </div>
        </Card>
      </div>
    )
  }
}

export default Answer