import React, {Component} from "react";
import "./ball.scss";
import {Add} from "@material-ui/icons";
import {Fab} from "@material-ui/core";
import Draggable, {DraggableData, DraggableEvent} from "react-draggable";
import Event from "../../event/Event";
import Resize from "../../event/Resize";

export default class Ball extends Component {

    handleStart = (e: any, data: any) => {

    }

    handleDrag = (e: any, data: any) => {

    }

    handleStop = (e: DraggableEvent, data: DraggableData) => {
        if (Math.abs(data.x - this.state.x) <= 3 && Math.abs(data.y - this.state.y) <= 3) {
            this.onClick()
        }
        this.setState({x: data.x, y: data.y}, () => this.rollBack(data.x, data.y))
    }

    rollBack = (x: number, y: number) => {
        let targetX = 0
        let targetY = 0
        if (x >= this.state.maxWidth / 2) targetX = this.state.maxWidth
        if (y >= this.state.maxHeight / 2) targetY = this.state.maxHeight

        let needMoveX = Math.abs(x - targetX)
        let needMoveY = Math.abs(y - targetY)

        let hmx = 0
        let hmy = 0
        let times = 0
        let speed = 10
        let accelerate = 2

        let fn = () => {
            times += accelerate
            if (hmx < needMoveX) {
                hmx += speed + times
                if (hmx >= needMoveX) hmx = needMoveX
            }

            if (hmy < needMoveY) {
                hmy += speed + times
                if (hmy >= needMoveY) hmy = needMoveY
            }

            this.setState({x: targetX === 0 ? x - hmx : x + hmx, y: targetY === 0 ? y - hmy : y + hmy})
            if (hmx >= needMoveX && hmy >= needMoveY) {
                return
            }

            requestAnimationFrame(fn)
        }

        requestAnimationFrame(fn)
    }

    resetBall() {

        // left top
        if (this.state.x === 0 && this.state.y === 0) {
            this.setState({x: 0, y: 0})
        }
        // left bottom
        if (this.state.x === 0 && this.state.y !== 0) {
            this.setState({x: 0, y: this.state.maxHeight})
        }
        // right top
        if (this.state.x !== 0 && this.state.y === 0) {
            this.setState({x: this.state.maxWidth, y: 0})
        }
        // right bottom
        if (this.state.x !== 0 && this.state.y !== 0) {
            this.setState({x: this.state.maxWidth, y: this.state.maxHeight})
        }
    }

    onClick = () => {
        console.log("hello click")
        Event.emit("openMenu")
    }

    state = {
        x: window.innerWidth - 40,
        y: window.innerHeight - 40,
        maxHeight: window.innerHeight - 40,
        maxWidth: window.innerWidth - 40
    }

    componentDidMount() {
        Resize.listen("Ball", () => {
            this.setState({maxHeight: window.innerHeight - 40, maxWidth: window.innerWidth - 40}, () => this.resetBall())
        })
    }

    componentWillUnmount() {
        Resize.remove("Ball")
    }


    render() {
        return (
            <Draggable
                onStart={this.handleStart}
                onStop={this.handleStop}
                onDrag={this.handleDrag}
                bounds={{top: 0, left: 0, right: this.state.maxWidth, bottom: this.state.maxHeight}}
                defaultPosition={{x: this.state.maxWidth, y: this.state.maxHeight}}
                position={{x: this.state.x, y: this.state.y}}
            >
                <Fab style={{position: 'absolute', zIndex: 9999}} size="small" color="secondary" aria-label="add">
                    <Add/>
                </Fab>
            </Draggable>
        );
    }
}
