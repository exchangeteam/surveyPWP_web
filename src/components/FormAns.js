import React, { Component } from 'react';
import { Button, Icon, Form, Input, message} from 'antd'
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom'
import './FormAns.css'
import 'antd/dist/antd.css'
import axios from 'axios'
import api from './api';

const iconSvg = ()=>(
    <svg t="1555416819884" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1629" width="80" height="80"><defs></defs><path d="M512 512m-490 0a490 490 0 1 0 980 0 490 490 0 1 0-980 0Z" fill="#FFAF10" p-id="1630"></path><path d="M709.212 683.51c0-4.412 3.588-8 8-8h230.086V246.424H299.086v20.054a5.174 5.174 0 0 1-5.168 5.168H76.702v465.502c35.888 69.248 87.804 128.846 150.852 173.872h481.66V683.51h-0.002z" fill="#EEF6FF" p-id="1631"></path><path d="M76.702 271.646v465.502a490.338 490.338 0 0 0 39.686 63.944V271.646H76.702z" fill="#D9EAFC" p-id="1632"></path><path d="M926.27 138.022H299.086v110.402h648.212V159.05c0-11.566-9.462-21.028-21.028-21.028z" fill="#293D7C" p-id="1633"></path><path d="M896.83 204.822H846.36c-8.286 0-15-6.714-15-15s6.714-15 15-15h50.47c8.286 0 15 6.714 15 15s-6.714 15-15 15z" fill="#AEC1ED" p-id="1634"></path><path d="M874.018 408.606a9.428 9.428 0 0 1-9.402 9.402H159.384a9.43 9.43 0 0 1-9.402-9.402v-94.032a9.434 9.434 0 0 1 9.402-9.402h705.23a9.432 9.432 0 0 1 9.402 9.402v94.032h0.002z" fill="#FFFFFF" p-id="1635"></path><path d="M189.668 408.606v-94.032a9.434 9.434 0 0 1 9.402-9.402H159.384a9.434 9.434 0 0 0-9.402 9.402v94.032a9.43 9.43 0 0 0 9.402 9.402h39.686a9.43 9.43 0 0 1-9.402-9.402z" fill="#EEF6FF" p-id="1636"></path><path d="M864.616 305.172h-128.174v112.836h128.174a9.428 9.428 0 0 0 9.402-9.402v-94.032a9.432 9.432 0 0 0-9.402-9.402z" fill="#FF9518" p-id="1637"></path><path d="M1024 992c0 5.5-4.5 10-10 10H717.212c-5.5 0-10-4.5-10-10V683.51c0-5.5 4.5-10 10-10H1014c5.5 0 10 4.5 10 10V992z" fill="#52BBEF" p-id="1638"></path><path d="M746.898 992V683.51c0-5.5 4.5-10 10-10h-39.686c-5.5 0-10 4.5-10 10V992c0 5.5 4.5 10 10 10h39.686c-5.5 0-10-4.5-10-10zM946.482 769.456h-161.75c-8.286 0-15-6.714-15-15s6.714-15 15-15h161.75c8.286 0 15 6.714 15 15a15 15 0 0 1-15 15zM946.482 822.05h-161.75c-8.286 0-15-6.714-15-15s6.714-15 15-15h161.75c8.286 0 15 6.714 15 15s-6.714 15-15 15zM946.482 874.648h-161.75c-8.286 0-15-6.714-15-15s6.714-15 15-15h161.75c8.286 0 15 6.714 15 15s-6.714 15-15 15zM865.932 927.242h-81.2c-8.286 0-15-6.714-15-15s6.714-15 15-15h81.2c8.286 0 15 6.714 15 15s-6.716 15-15 15z" fill="#1E99D6" p-id="1639"></path><path d="M296.646 558.216c0 5.5-4.5 10-10 10h-86.47c-5.5 0-10-4.5-10-10v-86.47c0-5.5 4.5-10 10-10h86.47c5.5 0 10 4.5 10 10v86.47zM650.932 506.004h-307.02c-8.286 0-15-6.714-15-15s6.714-15 15-15h307.02c8.286 0 15 6.714 15 15s-6.716 15-15 15zM552.914 553.964H343.912c-8.286 0-15-6.714-15-15s6.714-15 15-15h209.002c8.286 0 15 6.714 15 15s-6.714 15-15 15z" fill="#52BBEF" p-id="1640"></path><path d="M296.646 693.222c0 5.5-4.5 10-10 10h-86.47c-5.5 0-10-4.5-10-10v-86.472c0-5.5 4.5-10 10-10h86.47c5.5 0 10 4.5 10 10v86.472zM650.932 641.008h-307.02c-8.286 0-15-6.714-15-15s6.714-15 15-15h307.02c8.286 0 15 6.714 15 15s-6.716 15-15 15zM552.914 688.968H343.912c-8.286 0-15-6.714-15-15s6.714-15 15-15h209.002c8.286 0 15 6.714 15 15s-6.714 15-15 15z" fill="#02AF8E" p-id="1641"></path><path d="M296.646 828.226c0 5.5-4.5 10-10 10h-86.47c-5.5 0-10-4.5-10-10v-86.47c0-5.5 4.5-10 10-10h86.47c5.5 0 10 4.5 10 10v86.47z" fill="#FF9518" p-id="1642"></path><path d="M229.862 558.216v-86.47c0-5.5 4.5-10 10-10h-39.686c-5.5 0-10 4.5-10 10v86.47c0 5.5 4.5 10 10 10h39.686c-5.5 0-10-4.5-10-10z" fill="#1E99D6" p-id="1643"></path><path d="M229.862 693.222v-86.472c0-5.5 4.5-10 10-10h-39.686c-5.5 0-10 4.5-10 10v86.472c0 5.5 4.5 10 10 10h39.686c-5.5 0-10-4.5-10-10z" fill="#0F9390" p-id="1644"></path><path d="M229.862 828.226v-86.47c0-5.5 4.5-10 10-10h-39.686c-5.5 0-10 4.5-10 10v86.47c0 5.5 4.5 10 10 10h39.686c-5.5 0-10-4.5-10-10z" fill="#EF8318" p-id="1645"></path><path d="M650.932 776.012h-307.02c-8.286 0-15-6.714-15-15s6.714-15 15-15h307.02a15 15 0 0 1 0 30zM552.914 823.972H343.912a14.998 14.998 0 0 1-15-15 15 15 0 0 1 15-15h209.002a15 15 0 0 1 15 15c0 8.286-6.714 15-15 15z" fill="#FF9518" p-id="1646"></path><path d="M778.22 525.54m-51.94 0a51.94 51.94 0 1 0 103.88 0 51.94 51.94 0 1 0-103.88 0Z" fill="#91E0E8" p-id="1647"></path><path d="M781.174 562.26c-20.282-20.284-20.282-53.17 0-73.456a51.816 51.816 0 0 1 16.884-11.28c-18.818-7.768-41.276-4.014-56.57 11.28-20.282 20.286-20.282 53.172 0 73.456 15.294 15.292 37.752 19.048 56.57 11.28a51.786 51.786 0 0 1-16.884-11.28z" fill="#5DC1D8" p-id="1648"></path><path d="M874.294 600.4l-39.352-39.354c16.176-25.838 13.056-60.394-9.394-82.85-12.642-12.64-29.452-19.604-47.332-19.604s-34.69 6.962-47.336 19.606c-26.096 26.102-26.096 68.568 0.002 94.668 12.642 12.642 29.454 19.606 47.334 19.606 12.768 0 24.978-3.566 35.526-10.2l39.338 39.338a14.952 14.952 0 0 0 10.608 4.394 15 15 0 0 0 10.606-25.604z m-122.198-48.746c-14.402-14.404-14.402-37.84-0.002-52.242 6.978-6.976 16.256-10.818 26.122-10.818s19.144 3.842 26.12 10.816c14.402 14.404 14.402 37.84 0 52.242-6.976 6.978-16.252 10.82-26.12 10.82s-19.144-3.842-26.12-10.818z" fill="#1A2B63" p-id="1649"></path><path d="M0 266.478a7.188 7.188 0 0 0 7.168 7.168h286.75a7.188 7.188 0 0 0 7.168-7.168v-192.12a7.19 7.19 0 0 0-7.168-7.168H7.168A7.19 7.19 0 0 0 0 74.358v192.12z" fill="#91E0E8" p-id="1650"></path><path d="M39.686 266.478v-192.12a7.19 7.19 0 0 1 7.168-7.168H7.168A7.19 7.19 0 0 0 0 74.358v192.122a7.188 7.188 0 0 0 7.168 7.168h39.686a7.192 7.192 0 0 1-7.168-7.17z" fill="#5DC1D8" p-id="1651"></path><path d="M68.766 179.442c2.542-3.012 6.698-3.012 9.24 0l37.27 44.218c2.542 3.012 6.698 3.012 9.24 0L194.864 140.2c2.542-3.012 6.698-3.012 9.24 0l96.982 115.058v11.22a7.188 7.188 0 0 1-7.168 7.168H7.168A7.188 7.188 0 0 1 0 266.478v-5.46l68.766-81.576z" fill="#37C47A" p-id="1652"></path><path d="M260.68 104.78m-21.506 0a21.506 21.506 0 1 0 43.012 0 21.506 21.506 0 1 0-43.012 0Z" fill="#FFFFFF" p-id="1653"></path></svg>
)
const showMessage = (mode,msg) =>{
    if (mode === "error")
      message.error(msg)
    else if (mode === "success")
      message.success(msg)
    else message.warning(msg)
  }

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class FormAns extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    goHome=()=>{
        console.log("go home")
        this.props.history.push('/')
    }
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    handleSubmit = (e) => {
        let that = this
        e.preventDefault();
        this.props.form.validateFields(['userName','questionnaireId'],{first:true},(err, values) => {
          if (!err) {
            // console.log('Received values of form: ', values);
            axios.get(api.root+api.prefix+"questionnaires/"+values["questionnaireId"]+"/").then(res =>{
                console.log(res)
                let location = api.root.substring(0,api.root.length-1)+res.data["@controls"]["self"]["href"]
                if (res.status === 200)
                    that.props.history.push({ pathname: '/answer', state: { location: location, userName:values["userName"] } });
            },err=>{
                    showMessage("error","Questionnaire doesn't exist!")
            })
          }
        });
      }
    handleGetAnswer=(e)=>{
        let that = this
        e.preventDefault()
        this.props.form.validateFields(['userName','questionnaireId'],{first:true},(err, values) => {
            if(!err){
                console.log('Received values of form: ', values);
                axios.get(api.root+api.prefix+"questionnaires/"+values["questionnaireId"]).then(res=>{
                    console.log(res)
                    if (res.status===200){
                        axios.get(api.root+api.prefix+"questionnaires/"+values["questionnaireId"]+"/answers/"+values["userName"]).then(res=>{
                            console.log(res)
                            if(res.data.items.length!==0)
                                that.props.history.push({ pathname: '/myAnswers', state: { userName:values["userName"],questionnaireId:values["questionnaireId"] } });
                            else showMessage("error","Questionnaire is not answered by USER "+values["userName"]+"!")
                        },
                        err=>{
                            console.log(err)
                            showMessage("error","User doesn't exist!")
                        })
                    } else showMessage("error","Questionnaire doesn't exist!")
                },
                err=>{showMessage("error","Questionnaire doesn't exist!")})
                
            }
        })
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, } = this.props.form;
         // Only show error after a field is touched.
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const questionnaireIdError = isFieldTouched('questionnaireId') && getFieldError('questionnaireId');
        return (
            <div className="form">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Item> 
                        <div className='icon' onClick={this.goHome}>
                            <Icon component={iconSvg} ></Icon>
                        </div>
                    </Form.Item>
                    <Form.Item
                        validateStatus={userNameError ? 'error' : ''}
                        help={userNameError || ''}
                    >
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        )}
                    </Form.Item>
                    <Form.Item
                        validateStatus={questionnaireIdError ? 'error' : ''}
                        help={questionnaireIdError || ''}
                    >
                        {getFieldDecorator('questionnaireId', {
                            rules: [{ required: true, message: 'Please input questionnaire id!' }],
                        })(
                            <Input prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Questionnaire code" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <div className="buttons">
                            <Button onClick={this.handleGetAnswer} className="formButton" disabled={hasErrors(getFieldsError())}>My answers</Button>
                            <Button type="primary" htmlType="submit" className="formButton" disabled={hasErrors(getFieldsError())}>Go !</Button>
                        </div>
                        <div>
                            Or <a onClick={this.props.setMode} >Create one.</a>
                        </div>
                        
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const CustomizedFormAns = Form.create({})(FormAns)

export default withRouter(CustomizedFormAns);
