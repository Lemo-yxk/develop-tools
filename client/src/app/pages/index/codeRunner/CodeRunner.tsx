import React, {Component} from "react";
import './codeRunner.scss'
import MonacoEditor from 'react-monaco-editor';
import Resize from "../../../event/Resize";
import * as monacoEditor from "monaco-editor";
import {MenuItem, Select} from "@material-ui/core";
import Axios from "axios";
import Qs from 'querystring'
import WebSocket from "../../../ws/WebSocket";

import {Terminal} from "xterm";
import {FitAddon} from 'xterm-addon-fit';

import "xterm/css/xterm.css";

const terminal = new Terminal({
    theme: {
        background: 'white',
        foreground: 'black',
        selection: 'rgba(30,30,30,0.5)',
    },
    fontFamily: `Menlo, Monaco, "Courier New", monospace`,
    fontSize: 14
});

const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);

export default class CodeRunner extends Component {

    state = {
        code: null,
        language: "go",
        width: 0,
        height: 0,
        outputHeight: 300,
        visibility: "visible" as any,
        output: ""
    }

    private codeRunner = React.createRef<HTMLDivElement>();

    private edit = React.createRef<MonacoEditor>();


    editorDidMount = (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: any) => {

        editor.addAction(
            {
                id: "RunCode",
                label: "RunCode",
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_R],
                contextMenuGroupId: "9_cutcopypaste",
                run: editor => {
                    this.runCode()
                }
            }
        );

        editor.addAction(
            {
                id: "StopRun",
                label: "StopRun",
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_T],
                contextMenuGroupId: "9_cutcopypaste",
                run: editor => {
                    this.stopCode()
                }
            }
        );

        editor.addAction(
            {
                id: "Output",
                label: "Output",
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_O],
                contextMenuGroupId: "9_cutcopypaste",
                run: editor => this.showOutput()
            }
        );

        editor.focus();
    }


    showOutput() {
        this.setState({
            outputHeight: this.state.outputHeight === 0 ? 300 : 0,
            visibility: this.state.outputHeight === 0 ? 'visible' : 'hidden'
        })
        fitAddon.fit()
    }

    onChange = (newValue: any, e: any) => {
        this.setState({code: newValue})
    }

    componentDidMount() {
        this.setState({width: this.codeRunner.current!.offsetWidth, height: this.codeRunner.current!.offsetHeight})
        Resize.listen("CodeRunner", () => {
            this.codeRunner.current && this.onWindowResize()
        })

        WebSocket.listen("/Server/System/runner", (e: any, data: any) => this.runResult(data))

        terminal.open(document.querySelector(".output") as any)

        terminal.onResize((cols, rows) => {
            fitAddon.fit()
        })

        fitAddon.fit()
    }


    onWindowResize() {
        this.setState({width: this.codeRunner.current!.offsetWidth, height: this.codeRunner.current!.offsetHeight})
    }

    componentWillUnmount() {
        Resize.remove("JsonToStruct")
        WebSocket.remove("/Server/System/runner")
    }

    render() {

        return (
            <div className={"codeRunner"} ref={this.codeRunner}>
                <MonacoEditor
                    ref={this.edit}
                    width={this.state.width}
                    height={this.state.height - this.state.outputHeight}
                    language={this.state.language}
                    theme="vs-light"
                    // value={this.state.code}
                    options={{
                        inDiffEditor: false,
                        wordWrap: 'on',
                        wordWrapColumn: 80,
                        fontSize: 14,
                        selectOnLineNumbers: false,
                        // lineNumbers: "off",
                        lineNumbersMinChars: 4,
                        overviewRulerLanes: 0,
                        overviewRulerBorder: false,
                        lineDecorationsWidth: 0,
                        renderIndentGuides: false,
                        contextmenu: true,
                        // formatOnType: true,
                        formatOnPaste: true,
                        scrollbar: {
                            arrowSize: 0,
                            // horizontal: 'hidden',
                            // vertical: 'hidden',
                            horizontalScrollbarSize: 10,
                            verticalScrollbarSize: 10
                        },
                        minimap: {
                            enabled: true
                        },
                    }}
                    onChange={this.onChange}
                    editorDidMount={this.editorDidMount}
                />
                <div className={"output"} style={{height: this.state.outputHeight, visibility: this.state.visibility}}/>
                <Select
                    value={this.state.language}
                    className={"select"}
                    onChange={(e: any) => this.setState({language: e.target.value})}
                >
                    <MenuItem value={"go"}>Golang</MenuItem>
                    <MenuItem value={"typescript"}>TypeScript</MenuItem>
                    <MenuItem value={"javascript"}>JavaScript</MenuItem>
                    <MenuItem value={"python"}>Python</MenuItem>
                    <MenuItem value={"java"}>Java</MenuItem>
                    <MenuItem value={"rust"}>Rust</MenuItem>
                    <MenuItem value={"csharp"}>C#</MenuItem>
                    <MenuItem value={"shell"}>Shell</MenuItem>
                    <MenuItem value={"php"}>PHP</MenuItem>
                </Select>

            </div>
        )
    }

    runCode() {
        terminal.write('\r')
        terminal.clear()
        Axios.post("/code/code/run", Qs.stringify({language: this.state.language, code: this.state.code}))
    }

    runResult(data: any) {
        // this.setState({output: data})
        for (let i = 0; i < data.length; i++) {
            if (data[i] === '\n') {
                terminal.write('\r' + data[i])
            } else {
                terminal.write(data[i])
            }
        }

    }

    stopCode() {
        Axios.post("/code/code/stop")
    }
}
