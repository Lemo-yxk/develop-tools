import React, {Component} from "react";
import './jsonToStruct.scss'
import {InputData, jsonInputForTargetLanguage, quicktype} from 'quicktype-core'
import MonacoEditor from 'react-monaco-editor';
import {MenuItem, Paper, Select, TextField} from "@material-ui/core";
import Resize from "../../../event/Resize";

export default class JsonToStruct extends Component {

    state = {
        code: null,
        jsonString: "",
        language: "go",
        jsonName: "Empty",
        width: 0,
        height: 0
    }
    private jsonToStruct = React.createRef<HTMLDivElement>();

    editorDidMount(editor: any, monaco: any) {
        editor.focus();
    }

    onChange = (newValue: any, e: any) => {
        this.setState({jsonString: newValue}, () => this.format())
    }

    onResize(a: any, b: any, c: HTMLDivElement, d: any) {
        this.setState({width: c.offsetWidth})
    }

    componentDidMount() {
        this.setState({width: this.jsonToStruct.current!.offsetWidth, height: this.jsonToStruct.current!.offsetHeight})
        Resize.listen("JsonToStruct", () => {
            this.jsonToStruct.current && this.onWindowResize()
        })
    }


    onWindowResize() {
        this.setState({width: this.jsonToStruct.current!.offsetWidth, height: this.jsonToStruct.current!.offsetHeight})
    }

    componentWillUnmount() {
        Resize.remove("JsonToStruct")
    }

    render() {

        return (
            <div className={"jsonToStruct"} ref={this.jsonToStruct}>

                <Paper className={"left"}>
                    <MonacoEditor
                        width={this.state.width * 0.4}
                        height={this.state.height}
                        language="json"
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
                                horizontalScrollbarSize: 6,
                                verticalScrollbarSize: 6
                            },
                            minimap: {
                                enabled: false
                            },
                        }}
                        onChange={this.onChange}
                        editorDidMount={this.editorDidMount}
                    />
                </Paper>

                <Paper className={"right"}>
                    <div className={"monacoEditor"}>
                        <MonacoEditor
                            width={this.state.width * 0.595}
                            height={this.state.height}
                            language={this.state.language}
                            theme="vs-light"
                            value={this.state.code}
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
                                    horizontalScrollbarSize: 6,
                                    verticalScrollbarSize: 6
                                },
                                minimap: {
                                    enabled: false
                                },
                            }}
                            // onChange={this.onChange}
                            // editorDidMount={this.editorDidMount}
                        />
                    </div>

                    <div className={"option"}>

                        <TextField
                            id="standard-basic"
                            label={" "}
                            size={"small"}
                            value={this.state.jsonName}
                            onChange={(e) => this.setState({jsonName: e.target.value}, () => this.format())}
                            className={"name"}
                        />

                        <Select
                            value={this.state.language}
                            className={"select"}
                            onChange={(e: any) => this.setState({language: e.target.value}, () => this.format())}
                        >
                            <MenuItem value={"go"}>Golang</MenuItem>
                            <MenuItem value={"typescript"}>TypeScript</MenuItem>
                            <MenuItem value={"javascript"}>JavaScript</MenuItem>
                            <MenuItem value={"python"}>Python</MenuItem>
                            <MenuItem value={"java"}>Java</MenuItem>
                            <MenuItem value={"rust"}>Rust</MenuItem>
                            <MenuItem value={"csharp"}>C#</MenuItem>
                        </Select>


                    </div>
                </Paper>
            </div>
        )
    }

    async format() {
        this.quickTypeJSON(
            this.state.language,
            this.state.jsonName,
            this.state.jsonString
        )
            .then(res => this.setState({code: res.lines.join("\n")}))
            .catch(e => {
            })

    }


    async quickTypeJSON(targetLanguage: any, typeName: any, jsonString: any) {

        const jsonInput = jsonInputForTargetLanguage(targetLanguage);

        // We could add multiple samples for the same desired
        // type, or many sources for other types. Here we're
        // just making one type from one piece of sample JSON.
        await jsonInput.addSource({
            name: typeName,
            samples: [jsonString],
        });

        const inputData = new InputData();
        inputData.addInput(jsonInput);

        return await quicktype(
            {
                "inferMaps": true,
                "inferEnums": true,
                "inferUuids": true,
                "inferDateTimes": true,
                "inferIntegerStrings": true,
                "inferBooleanStrings": true,
                "combineClasses": true,
                "ignoreJsonRefs": true,
                "allPropertiesOptional": false,
                "rendererOptions": {
                    "just-types": 'true',
                    "nice-property-names": 'false',
                    "explicit-unions": 'false',
                    "runtime-typecheck": 'false',
                    "acronym-style": "lowerCase",
                    "converters": "all-objects"
                },
                "fixedTopLevels": false,
                inputData,
                lang: targetLanguage,
            }
        );
    }
}
