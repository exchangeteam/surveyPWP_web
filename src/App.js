import React, { Component } from 'react';
import './App.css';
import FormAns from './components/FormAns'
import FormQuestionnaire from './components/FormQuestionnaire'


class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      mode: 'answer'
    }
  }
  setMode(mode){
    console.log("set"+mode)
    this.setState({mode})
  }

  render() {
    if(this.state.mode === "answer")
      return (
        <div className="App">
          <FormAns setMode={this.setMode("create")} ></FormAns>
        </div>
      );
      return (
        <div className="App">
          <FormQuestionnaire setMode={this.setMode("answer")}></FormQuestionnaire>
        </div>
      )
  }
}

export default App;
