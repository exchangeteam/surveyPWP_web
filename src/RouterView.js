import React, {Component} from 'react'
import {HashRouter as Router, Route, Link, Switch} from 'react-router-dom'
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
      <Router>
        <Switch>
          <Route exact path="/" component={App}>
            {/* 当 url 为/时渲染 Dashboard */}
            {/* <IndexRoute component={Dashboard} /> */}
            
          </Route>
          <Route path="/questionnaire" component={Questionnaire} />
        </Switch>
      </Router>
    )
  }
}

export default RouterView