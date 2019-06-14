import React from 'react';
import './ResultsContainer.css';

class ResultsContainer extends React.Component {
    render() {
            let container;
            if (this.props.data === "no result") {
                container =
                    <div className = "TextContainer">
                        <code>Cannot determine emotions</code>
                    </div>;
            } else {
                container =
                <div>
                    <div className = "TextContainer">
                        <b>Anger</b> : {this.props.data.angry}
                    </div>
                    <div className = "TextContainer">
                        <b>Fear</b> : {this.props.data.fear}
                    </div>
                    <div className = "TextContainer">
                        <b>Happy</b> : {this.props.data.happy}
                    </div>
                    <div className = "TextContainer">
                        <b>Neutral</b> : {this.props.data.neutral}
                    </div>
                    <div className = "TextContainer">
                        <b>Sad</b> : {this.props.data.sad}
                    </div>
                </div>;
            }
            return(
                <div className = "ResultsContainer">
                    {container}
                </div>
            )
        }
}

export default ResultsContainer;
