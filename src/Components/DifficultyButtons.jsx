import React, {Component} from 'react'
import './Game.css'

class DifficultyButtons extends Component {

    render() {
        if (this.props.label===this.props.difficulty) {
            return (<button className="selected" onClick={this.props.onClick}>{this.props.label}</button>)            
        } else {
            return (<button className="notselected" onClick={this.props.onClick}>{this.props.label}</button>) 
        }
    }

}

export default DifficultyButtons