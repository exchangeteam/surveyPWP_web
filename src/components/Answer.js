import React, {Component} from 'react'
import {notification, Card} from 'antd'
import axios from 'axios'
import './Questionnaire.css'
import 'antd/dist/antd.css'
import { Button, Input, message} from 'antd';
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
class Answer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state={
      listLen:0,
			questions:[],
			inputValues:{}
    }
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