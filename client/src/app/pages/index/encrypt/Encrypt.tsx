import React, {Component} from "react";
import {Button, Paper} from "@material-ui/core";
import './encrypt.scss'
import Axios from "axios";

export default class Encrypt extends Component {


    state = {
        left: "",
        right: ""
    }

    render() {
        return (
            <div className={"encrypt"}>

                <Paper elevation={5} className={"left"}>
                    <textarea
                        spellCheck={false}
                        placeholder={"input"}
                        value={this.state.left}
                        onChange={(e) => this.setState({left: e.target.value})}
                    />
                </Paper>

                <div className={"middle"}>
                    <Button variant="contained" color="default" onClick={() => this.md5()}>
                        MD5加密
                    </Button>
                    <Button variant="contained" color="default" onClick={() => this.sha1()}>
                        SHA1加密
                    </Button>
                    <Button variant="contained" color="default" onClick={() => this.sha256()}>
                        SHA256加密
                    </Button>
                    <Button variant="contained" color="default" onClick={() => this.sha512()}>
                        SHA512加密
                    </Button>
                    <Button variant="contained" color="default" onClick={() => this.base64Encode()}>
                        BASE64编码
                    </Button>
                    <Button variant="contained" color="default" onClick={() => this.base64Decode()}>
                        BASE64解码
                    </Button>
                </div>

                <Paper elevation={5} className={"right"}>
                    <textarea
                        spellCheck={false}
                        value={this.state.right}
                        placeholder={"output"}
                        onChange={() => {
                        }}
                    />
                </Paper>
            </div>
        )
    }

    private async md5() {
        let response = await Axios.get("/encrypt/encrypt/md5", {params: {data: this.state.left}})
        this.setState({right: response.data.msg})
    }

    private async sha1() {
        let response = await Axios.get("/encrypt/encrypt/sha1", {params: {data: this.state.left}})
        this.setState({right: response.data.msg})
    }


    private async sha256() {
        let response = await Axios.get("/encrypt/encrypt/sha256", {params: {data: this.state.left}})
        this.setState({right: response.data.msg})
    }


    private async sha512() {
        let response = await Axios.get("/encrypt/encrypt/sha512", {params: {data: this.state.left}})
        this.setState({right: response.data.msg})
    }

    private async base64Encode() {
        let response = await Axios.get("/encrypt/encrypt/base64Encode", {params: {data: this.state.left}})
        this.setState({right: response.data.msg})
    }

    private async base64Decode() {
        let response = await Axios.get("/encrypt/encrypt/base64Decode", {params: {data: this.state.left}})
        this.setState({right: response.data.msg})
    }
}