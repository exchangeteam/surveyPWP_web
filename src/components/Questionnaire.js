import React, {Component} from 'react'
import {notification, Card} from 'antd'
import axios from 'axios'
import './Questionnaire.css'
import { Button, Modal, Form, Input, Radio} from 'antd';


const openNotificationWithIcon = (type) => {
  notification[type]({
    message: 'Error,',
    description: 'there is an error in navigation, please go back!',
  });
};
const popoutForm = Form.create({name:"modal_form"})(
  class extends Component{
    render(){
      const {
        visible, onCancel, onCreate, form,
      } = this.props;
      const { getFieldDecorator } = form;

      return(
        <Modal
              visible={visible}
              title="Add a question"
              okText="Create"
              onCancel={onCancel}
              onOk={onCreate}
            >
              <Form>
                <Form.Item>
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: 'Please input the title of the question!'}],
                  })(
                    <Input />
                  )}
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
      questions:[]
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
  
  render() {
    
    const questionCards = []
    for (let q of this.state.questions) 
      questionCards.push(
        <Card type="inner" title={q.title} key={q.id}>
          <p>Description: {q.description}</p>
          <p></p>
        </Card>
      )
    return (
      <div>
        <Card title={this.state.title} className='card' loading={this.state.loading} headStyle={{fontsize: "30px",fontweight: 500}}>
          <p>{this.state.description ? ("Description:" + this.state.description ): "no description"}</p>
          <p>Questionnaire id:  {this.state.id}</p>
          <p className="question_title">Questions:</p>
          {questionCards}
          <div className="button_add">
            <Button>Add a question</Button>
          </div>
        </Card>
      </div>
    )
  }
}

export default Questionnaire