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
  setMode=()=>{
    if (this.state.mode === "answer")
      this.setState({mode:"create"})
    else
      this.setState({mode:"answer"})
  }

  render() {
    if(this.state.mode === "answer")
      return (
        <div className="App">
          <FormAns setMode={this.setMode} ></FormAns>
        </div>
      );
    return (
      <div className="App">
        <FormQuestionnaire setMode={this.setMode}></FormQuestionnaire>
      </div>
    );
  }
}

export default App;
