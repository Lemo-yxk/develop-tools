import React, {Component} from "react";
import './colorPicker.scss'
import WebSocket from "../../../ws/WebSocket";
import {Button, TextField} from "@material-ui/core";
import DevelopmentList from "../development/List";
import Event from "../../../event/Event";
import Axios from "axios";

export default class ColorPicker extends Component {


    componentDidMount() {
        WebSocket.emit("/Electron/System/command", "(require('./colorPicker')).ResizeWindow()")
        WebSocket.listen("/Server/System/hook", (e: any, data: any) => this.hook(data))
    }

    componentWillUnmount() {
        Axios.get("/colorPicker/colorPicker/stopHook").then()
        WebSocket.emit("/Electron/System/command", "require('./colorPicker').ResetWindow()")
        WebSocket.remove("/Server/System/hook")
    }

    state = {
        isStart: false,
        color: "",
        selectedColor: "",
        history: [] as string[],
        image: ""
    }

    render() {
        return (
            <div className={"colorPicker"}>

                <div className={"colorContent"}>

                    <div className={"colorShow"}>
                        <div className={"showImage"}>
                            <div className={"image"} style={{backgroundImage: `url(${this.state.image})`}}/>
                            <div className={"pointer"}/>
                        </div>
                        <div className={"showColor"} style={{backgroundColor: this.state.color}}/>
                    </div>

                    <TextField
                        id="standard-basic"
                        onChange={() => {
                        }}
                        placeholder={"control to picker"}
                        value={this.state.selectedColor}
                        className={"colorWord"}
                    />

                    <div className={"history"}>
                        {this.state.history.map(e => <div key={Math.random()} onClick={() => this.setState({selectedColor: e})} style={{backgroundColor: e}}/>)}
                    </div>

                    <div className={"buttonBox"}>
                        <Button size={"small"} variant="contained" color="default" onClick={() => this.start()}>
                            {this.state.isStart ? '停止' : '开始'}
                        </Button>

                        <Button size={'small'} variant="contained" color="default" onClick={() => this.back()}>
                            返回
                        </Button>
                    </div>


                </div>

            </div>
        )
    }

    back = async () => {
        Event.emit("changePath", DevelopmentList[0].Children[0].Path)
    };


    hook(data: any) {
        // 9 mouseMove
        // 5 keyUp
        if (data.id === 9) {
            this.mouseMove(data)
        }

        if (data.id === 5) {
            this.keyUp(data)
        }

    }

    mouseMove(data: any) {
        this.setState({color: '#' + data.color, image: "data:image/bmp;base64," + data.image})
    }

    keyUp(data: any) {
        if (data.keyCode === 29) {
            if (this.state.history.length > 5) this.state.history.pop()
            this.state.history.unshift(this.state.color)
            this.setState({selectedColor: this.state.color, history: this.state.history})
        }
    }

    start() {
        if (!this.state.isStart) {
            this.setState({isStart: true})
            Axios.get("/colorPicker/colorPicker/startHook").then()
        } else {
            this.setState({isStart: false})
            Axios.get("/colorPicker/colorPicker/stopHook").then()
        }

    }
}