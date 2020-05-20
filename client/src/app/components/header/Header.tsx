import React, {Component} from "react";
import {Face} from "@material-ui/icons";
import {Chip, Paper} from "@material-ui/core";
import './header.scss'

export default class Header extends Component {

    state = {
        chips: [] as any[]
    }

    componentDidMount() {
        // let t = setInterval(() => {
        //
        //     let key = Math.random().toString(16).slice(2)
        //
        //     this.state.chips.push({
        //         key: key,
        //         value: <Chip
        //             key={key}
        //             icon={<Face/>}
        //             label={`Clickable deletable ${key}`}
        //             color={"secondary"}
        //             size={"small"}
        //             onClick={() => this.onClick(key)}
        //             onDelete={() => this.onDelete(key)}
        //         />
        //     })
        //
        //     if (this.state.chips.length >= 20) clearInterval(t)
        //
        //     this.setState({chips: this.state.chips})
        // }, 500)
    }

    onClick = (key: string) => {
        console.log(key)
    }

    onDelete = (key: string) => {
        let index = this.state.chips.findIndex(e => e.key === key)
        this.state.chips.splice(index, 1)
        this.setState({chips: this.state.chips})
    }

    render() {
        if (this.state.chips.length === 0) return null
        return (
            <Paper className={"header"}>
                {this.state.chips.map(e => e.value)}
            </Paper>
        );
    }
}
