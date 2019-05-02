import React, {Component} from 'react'
import axios from 'axios'
import './Questionnaire.css'
import 'antd/dist/antd.css'
import { Button, Modal, Form, Input, Icon, message,notification, Card} from 'antd';
import api from './api'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

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
const ModalForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const {
        visible, onCancel, onCreate, form, question
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title={question ? question.title : "Edit a answer"}
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
						<p style={{fontSize:"12px",color:"rgba(0,0,0,0.4)"}}>{question ? (question.description? ("Description"+question.description): "No description") : ""}</p>
            <Form.Item label="New answer">
              {getFieldDecorator('answer', {
                rules: [{ required: true, message: 'Please input the answer!' }],
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
class MyAnswers extends Component {
  constructor(props, context) {
    super(props, context);
    this.state={
			items:[],
			qList:[],
			visible:false
    }
  }
	handleDelete=(index)=>{
		index = JSON.stringify(index)
		console.log("delete "+ this.state.items+ index)
		if(this.state.items){
			let a = this.state.items[index]
			console.log(a)
			var url = a["@controls"]["self"]["href"]
			url = api.root+url.substring(1,url.lastIndexOf("/answers")) +"/questions/"+a.question_id+"/answers/"+a.id+"/"
			console.log(url)
			axios.delete(url).then(res=>{
				console.log("delete response: ",res)
			},
			err=>{
				showMessage("error","failed to delete")
			}).then(()=>{
					this.updateLists()
				}
			)
		}else{
			showMessage("error","This answer is not in state list")
		}
	}
	handleEdit=(index)=>{
		this.setState({
			visible:true,
			editIdx:index
		})
	}
	handleCancel = () => {
		this.setState({ visible: false,editIdx:null});

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
			// edit a answer
			if (that.state.editIdx!=null){
				let i = that.state.editIdx
				var answer = that.state.items[i]
				var url = answer["@controls"]["self"]["href"]
				url = api.root+url.substring(1,url.lastIndexOf("/answers")) +"/questions/"+answer.question_id+"/answers/"+answer.id+"/"
				console.log(url)
				axios.put(url,{content:values["answer"],userName:that.props.location.state["userName"]}).then(res=>{
					console.log(res)
					that.updateLists()
				})
			}
    });
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
	}
	updateLists=()=>{
		let that = this 
		var list = []
		if (this.props.location.state["userName"]){
			var state = this.props.location.state
			axios.get(api.root+api.prefix+"questionnaires/"+state["questionnaireId"]+"/answers/"+state["userName"]).then(res=>{
				// console.log(res.data.items)
				// sort answer items
				var items = res.data.items.sort((a,b)=>{
					return a["question_id"] - b["question_id"]
				})
				this.setState({
					items:items
				})
			},
			err=>{
				console.log(err)
				that.setState({
					items:[],
					qList:[]
				})
			}).then(()=>{
				that.state.items.forEach((a,index)=>{
					let url = a["@controls"]["self"]["href"]
					url = api.root+url.substring(1,url.lastIndexOf("answers/"))+"questions/"+a.question_id+"/"
					// console.log(url)
					axios.get(url).then(res=>{
						// console.log(res.data)
						list[index] = {
							id:res.data.id,
							title:res.data.title,
							description:res.data.description,
							questionnaire_id:res.data.questionnaire_id
						}
						// console.log(list)
						that.setState({
							qList:list
						})
					})
				})
			})
			
		}
	}
	componentWillMount=()=>{
		this.updateLists()
		// let that = this 
		// var list = []
		// if (this.props.location.state["userName"]){
		// 	var state = this.props.location.state
		// 	axios.get(api.root+api.prefix+"questionnaires/"+state["questionnaireId"]+"/answers/"+state["userName"]).then(res=>{
		// 		this.setState({
		// 			items:res.data.items
		// 		})
		// 	},err=>{
		// 		console.log(err)
		// 		that.setState({
		// 			items:[],
		// 			qList:[]
		// 		})
		// 	}).then(()=>{
		// 		this.state.items.forEach((a,index)=>{
		// 			let url = a["@controls"]["self"]["href"]
		// 			url = api.root+url.substring(1,url.lastIndexOf("answers/"))+"questions/"+a.question_id+"/"
		// 			// console.log(url)
		// 			axios.get(url).then(res=>{
		// 				// console.log(res.data)
		// 				list.push({
		// 					id:res.data.id,
		// 					title:res.data.title,
		// 					description:res.data.description,
		// 					questionnaire_id:res.data.questionnaire_id
		// 				})
		// 				// console.log(list)
		// 				this.setState({
		// 					qList:list
		// 				})
		// 			})
		// 		})
		// 	})		
		// }
		
	}
	render() {
		let that = this
		const answerCards = []
		var items = this.state.items
		var list = this.state.qList
		if (!this.state.questionnaireInfo){
			axios.get(api.root+api.prefix+"questionnaires/"+this.props.location.state.questionnaireId+"/").then(res=>{
				// Object.assign(questionnaireInfo,res.data)
				// console.log(questionnaireInfo)
				this.setState({
					questionnaireInfo:res.data
				})
			})
		}
		items.forEach((a,index)=>{
			// console.log(list[index],index)
			if (list[index])
				answerCards.push(
					<Card type="inner"
						title={list[index].title}
						hoverable="true"
						style={{marginTop:"10px",minHeight:"120px"}}
						key={a.id}
						extra={<div>
							<Icon onClick={that.handleDelete.bind(this,index)} type="delete" style={{ paddingRight: "0.8em" }} />
							<Icon onClick={that.handleEdit.bind(this,index)} type="edit"/>

						</div>}
					>
						<p style={{fontSize:"12px",color:"rgba(0,0,0,0.4)",lineHeight:"1.4"}}>
							{list[index].description ? ("Description: " + list[index].description ) : "no description"}
							<br/>Question id: { list[index].id || "none"}
						</p>
						<p>Answer content: {a["content"]}</p>
					</Card>
				);
		})
		return (
				
					<div className="container">
						<Card title="My answers" className='card' headStyle={{ fontsize: "30px", fontweight: 500 }}
						>
							<h3>{this.state.questionnaireInfo ? this.state.questionnaireInfo.title : ""}</h3>
							<p>Questionnaire id: {this.state.questionnaireInfo ? this.state.questionnaireInfo.id : ""}
								<br /> {this.state.questionnaireInfo ? (this.state.questionnaireInfo.description ? "Description: " + this.state.questionnaireInfo.description : "no description") : ""}
							</p>

							
							{answerCards.length === 0 ? "No answers" : answerCards}
							
							<ModalForm
								question={this.state.editQuestion}
								wrappedComponentRef={this.saveFormRef}
								visible={this.state.visible}
								onCancel={this.handleCancel}
								onCreate={this.handleCreate}
							/>
							<div className="cardBottom">
								<Button onClick={this.props.history.goBack}> Go back </Button>
							</div>
						</Card>
					</div>
				
			)
		
	}
}

export default MyAnswers