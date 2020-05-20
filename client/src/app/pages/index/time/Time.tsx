import React, {Component} from "react";
import './time.scss'
import DayJS from 'dayjs'
import {TextField} from "@material-ui/core";

export default class Time extends Component {

    state = {
        now: DayJS(),
        timestamp: DayJS().unix(),
        date: DayJS().format("YYYY-MM-DD HH:mm:ss"),
    }

    timer: NodeJS.Timeout = {} as NodeJS.Timeout

    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({now: DayJS()})
        }, 1000)

        console.log(DayJS("2020-05-16 21:04:00").unix())
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render() {
        return (
            <div className={"time"}>
                <div className={"box"}>
                    <div className={'now'}>
                        {this.state.now.format("YYYY-MM-DD HH:mm:ss")}
                    </div>

                    <div className={"timestamp"}>
                        <TextField
                            id="standard-basic"
                            onChange={(e) => this.setState({timestamp: e.target.value})}
                            label={"timestamp"}
                            value={this.state.timestamp}
                            className={"timestampLeft"}
                        />
                        <TextField
                            id="standard-basic"
                            label={" "}
                            value={DayJS(this.state.timestamp * 1000).format("YYYY-MM-DD HH:mm:ss")}
                            className={"timestampRight"}
                        />
                    </div>

                    <div className={"date"}>
                        <TextField
                            id="standard-basic"
                            onChange={(e) => this.setState({date: e.target.value})}
                            label={"date"}
                            value={this.state.date}
                            className={"dateLeft"}
                        />
                        <TextField
                            id="standard-basic"
                            label={" "}
                            value={DayJS(this.state.date).unix()}
                            className={"dateRight"}
                        />
                    </div>
                </div>

            </div>
        )
    }
}