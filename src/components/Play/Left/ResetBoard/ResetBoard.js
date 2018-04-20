import React, { Component } from 'react';

class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: new Date(props.startTime),
            timeElapsed: new Date(Date.now() - props.startTime)
        }
    }
    componentDidMount() {
        this.interval = setInterval(this.updateTime.bind(this), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    updateTime() {
        this.setState({
            timeElapsed: new Date(Date.now() - this.state.startTime.valueOf())
        });
    }
    render() {
        return (
            <button>
                {this.state.timeElapsed.toLocaleString()}
            </button>
        )
    }
}

export default function ResetBoard({ dimension, resetBoard, handleDimensionChange, onKeyDown, updateBoard, gameid, startTime }) {
    if (gameid) return (
        <div className="buttons">
            <button>{}</button>
            <Counter startTime={startTime} />
        </div>
    )
    else return (
        <div className="buttons" >
            <button onClick={resetBoard} >RESET BOARD</button>
            <input
                type='number'
                min={3}
                max={9}
                value={dimension}
                onChange={handleDimensionChange}
                onKeyDown={onKeyDown}
            />
            <button onClick={updateBoard} >UPDATE BOARD</button>
        </div>
    )
}
