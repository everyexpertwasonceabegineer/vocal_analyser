import React from 'react';
import recognizeMic from 'watson-speech/speech-to-text/recognize-microphone';

export default class IBMSpeechToTextContainer extends React.Component {
  constructor(){
    super();
    this.state = {
      text: ""
    };
  }

  onClickButton(){
    fetch('http://127.0.0.1:5000/api/speech-to-text/token')
    .then((response) => {
      console.log(response);
      return response.text();
    }).then( (token) => {
      console.log(token);
      var stream = recognizeMic({
        access_token: token,
        objectMode: true, // send objects instead of text
        extractResults: true, // convert {results: [{alternatives:[...]}], result_index: 0} to {alternatives: [...], index: 0}
        format: false // optional - performs basic formatting on the results such as capitals an periods
      });

      stream.on('data',(data) => {
        this.setState({
          text: data.alternatives[0].transcript
        })
      });

      stream.on('error', function(err) {
        console.log(err);
      });

      //document.querySelector('#stop').onclick = stream.stop.bind(stream);

    }).catch(function(error) {
        console.log(error);
    });
  };

  render(){
    return(
      <div>
        <button onClick={this.onClickButton.bind(this)}>Listen To Microphone</button>
        {this.state.text}
      </div>
    )
  }
}
