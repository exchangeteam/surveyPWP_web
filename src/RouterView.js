import React, {Component} from 'react'
import {BrowserRouter, Route, Link, Switch} from 'react-router-dom'
// import {Router,Route} from 'react-router';
import App from './App';
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
          <Route exact path="/" component={App}></Route>
          <Route path="/questionnaire" component={Questionnaire} />
          
          
      </BrowserRouter>
    )
  }
}

export default RouterView