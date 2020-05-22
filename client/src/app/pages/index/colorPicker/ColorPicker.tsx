import React, {Component} from "react";
import './colorPicker.scss'
import WebSocket from "../../../ws/WebSocket";
import {Button, Paper, TextField} from "@material-ui/core";
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
        color: "#ffffff",
        selectedColor: "",
        history: [] as string[],
        image: ""
    }


    convert(color: string) {
        if (color.length < 7) return [255, 255, 255]
        return [
            parseInt(`0x${color.slice(1, 3)}`),
            parseInt(`0x${color.slice(3, 5)}`),
            parseInt(`0x${color.slice(5, 7)}`)
        ]
    }

    toRGB(colorArray: number[]) {
        return `rgb(${colorArray.join(",")})`
    }

    toRGBa(colorArray: number[], transparent: number) {
        return `rgb(${colorArray.concat(transparent).join(",")})`
    }

    render() {
        return (
            <div className={"colorPicker"}>

                <div className={"colorContent"} style={{
                    backgroundColor: this.toRGBa(this.convert(this.state.color), 0.3),
                    transition: `background-color 1s`
                }}>

                    <div className={"colorShow"}>
                        <Paper className={"showImage"}>
                            <div className={"image"} style={{backgroundImage: `url(${this.state.image})`}}/>
                            <div className={"pointer"}/>
                        </Paper>
                        <Paper className={"showColor"} style={{backgroundColor: this.state.color}}/>
                    </div>

                    <div className={"colorWord"}>
                        <TextField
                            id="standard-basic"
                            onChange={() => {
                            }}
                            placeholder={"control to picker"}
                            value={this.state.selectedColor}
                        />
                    </div>

                    <div className={"history"}>
                        {this.state.history.map(e => <Paper key={Math.random()} onClick={() => this.setState({selectedColor: e})} style={{backgroundColor: e}}/>)}
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
            this.setState({isStart: false, color: '#ffffff'})
            Axios.get("/colorPicker/colorPicker/stopHook").then()
        }

    }
}