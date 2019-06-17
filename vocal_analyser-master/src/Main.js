import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import ResultsContainer from "./ResultsContainer";
import IBMSpeechToTextContainer from "./IBMSpeechToTextContainer";

class Main extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <ul className="header">
            <li><NavLink exact to="/">Vokaturi Results</NavLink></li>
            <li><NavLink to="/SecondPage">IBM Tone Analyser</NavLink></li>
          </ul>
          <div className="content">
            <Route exact path="/" render={(routeProps) => (<ResultsContainer {...routeProps} data={this.props.dataMain}/>)}/>
            <Route path="/IBMSpeechToTextContainer" component={IBMSpeechToTextContainer}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default Main;
