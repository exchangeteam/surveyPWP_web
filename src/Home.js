import React, { Component } from 'react';
import { Button, Icon, Form, Input, message, Card  } from 'antd'
import axios from 'axios'
import api from './components/api'
import "./App.css"


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
            list:[]
        }
    }
    toApp=()=>{
        this.props.history.push('/app')
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
                >
                    <h4>{item.title}</h4>
                    {item.description ? "Description: "+item.description : "No description provided"}
                </Card>
            )
        }
        return (
            <div className ="home">  
                <h1>Survey PWP</h1>
                <div className="header">
                    <h3>Recent questionnaires</h3>
                </div>
                <div className="card">
                    {questionnaireCards || "no questionnaire yet"}
                </div>
                <Button type="primary" onClick={this.toApp}>
                    Create my questionnaire
                </Button>
            </div>
        );
    }
}

export default Home;
