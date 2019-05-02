import React, {Component} from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import Answer from './components/Answer'
import MyAnswers from './components/MyAnswers'
// import {Router,Route} from 'react-router';
import App from './App';
import Home from './Home';
import Questionnaire from './components/Questionnaire'

// const Home = () => (
//   <div>
//     <h2>首页</h2>
//   </div>
// )
// const About = () => (
//   <div>
//     <h2>关于</h2>
//   </div>
// )
class RouterView extends Component {
  render() {
    return (
      <BrowserRouter>
          <Route exact path="/" component={Home}/>
          <Route path="/app" component={App}/>
          <Route path="/questionnaire" component={Questionnaire} />
          <Route path="/answer" component={Answer}/>
          <Route path="/myAnswers" component={MyAnswers}/>
          
          
      </BrowserRouter>
    )
  }
}

export default RouterView