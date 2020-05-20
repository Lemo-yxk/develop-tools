import React, {Component} from "react";
import {Rnd} from "react-rnd";
import "./keyTree.scss";
import {Treebeard} from "react-treebeard-ts";
import DataTree from "./Tree";
import {Description, PlayArrow} from "@material-ui/icons";
import {Paper} from "@material-ui/core";
import Event from "../../event/Event";
import Tools from "../../tools/Tools";

export default class KeyTree extends Component {
    state = {
        dataTree: [] as any[],
    };

    selectedNode: any = null;
    shouldRefresh = false;

    updateTree() {
        this.setState({dataTree: DataTree.dataTree});
    }

    componentDidMount() {
        Event.listen("deleteKey", (key: string, fn: any) => this.deleteKey(key, fn));
        Event.listen("insertKey", (key: string, isActive: boolean, fn: any) => this.insertKey(key, isActive, fn));
        Event.listen("activeKey", (key: string, isActive: boolean) => this.activeKey(key, isActive));
    }

    activeKey(key: string, isActive: boolean) {
        var node = DataTree.search(DataTree.dataTree, key);

        if (!node) return;
        this.selectedNode.active = false;

        this.selectedNode = node;
        this.selectedNode.active = isActive;
        if (isActive) {
            let temp = node;
            while (1) {
                if (!temp.parent) break;
                temp.parent.toggled = true;
                temp.parent.active = false;
                temp = temp.parent;
            }
        }
        this.updateTree();
    }

    deleteKey(key: string, fn: any) {
        DataTree.deleteKey(key);
        fn && fn();
        this.updateTree();
    }

    insertKey(key: string, isActive: boolean, fn: any) {
        DataTree.addKey(key, this.shouldRefresh, isActive);
        fn && fn();
        this.updateTree();
    }

    readDone() {
        Tools.Message.Info("数据加载成功");
        if (this.shouldRefresh) {
            var notRead = DataTree.checkRead(DataTree.dataTree);
            for (let i = 0; i < notRead.length; i++) {
                DataTree.deleteKey(notRead[i].name);
            }
        }
        this.shouldRefresh = false;
        Tools.Loading.Hide();
    }

    componentWillUnmount() {
        Event.remove("deleteKey");
        Event.remove("insertKey");
        Event.remove("activeKey");
        DataTree.clear();
    }

    reset() {
        DataTree.clear();
        this.selectedNode = null;
        this.shouldRefresh = false;
        this.setState({dataTree: []});
    }

    decorators = {
        Loading: (props: any) => {
            return <div style={props.style}>loading...</div>;
        },
        Toggle: (node: any) => {
            if (node.toggled)
                return (
                    <PlayArrow
                        style={{color: "#222222", transform: "rotate(90deg)", position: "relative", top: "-1px"}}
                    />
                );
            return <PlayArrow style={{color: "#222222"}}/>;
        },
        Header: (node: any) => {
            if (!node.isKey) return <div>{node.i}</div>;

            return (
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Description style={{width: 15}}/>
                    <div>{node.i}</div>
                </div>
            );
        },
        Container: (props: any) => {
            let style: any = {
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                color: "black",
                height: "18px",
            };
            if (props.node.active && (!props.node.children || props.node.children.length === 0)) {
                style.background = `rgb(222, 222, 222)`;
            }

            if (props.node.children && props.node.children.length > 0) {
                return (
                    <div onClick={props.onClick} style={style}>
                        {props.decorators.Toggle(props.node)}
                        {props.decorators.Header(props.node)}
                    </div>
                );
            }

            return (
                <div onClick={props.onClick} style={style}>
                    {props.node.parent ? null : <div style={{width: 24}}/>}
                    {props.decorators.Header(props.node)}
                </div>
            );
        },
    };

    render() {
        return (
            <Rnd
                default={{height: "100%", width: "300px", x: 0, y: 0}}
                minWidth={250}
                maxWidth={500}
                bounds=".content"
                enableResizing={{right: true}}
                disableDragging={true}
                className="key-tree"
            >
                <Paper style={{width: "100%", height: "100%"}}>
                    <div className="data-tree">
                        {this.state.dataTree.length > 0 ? (
                            <Treebeard
                                data={this.state.dataTree}
                                onToggle={(node, toggled) => this.onToggle(node, toggled)}
                                style={this.style}
                                animations={false}
                                decorators={this.decorators}
                            />
                        ) : null}
                    </div>
                </Paper>
            </Rnd>
        );
    }

    style: any = {
        tree: {
            base: {
                fontSize: "12px",
                whiteSpace: "pre-wrap",
                backgroundColor: "#ffffff",
                height: "100%",
                padding: "5px",
            },
            node: {base: {color: "red"}, activeLink: {backgroundColor: "#bae7ff"}},
        },
    };

    onToggle(node: import("react-treebeard-ts").TreeNode, toggled: boolean): void {
        if (this.selectedNode) {
            this.selectedNode.active = false;
        }

        node.active = true;

        if (node.children && node.children.length > 0) {
            if (this.selectedNode) {
                this.selectedNode.active = true;
            }
            node.active = false;
            node.toggled = toggled;
        } else {
            this.onSelect(node.name);
            this.selectedNode = node;
        }

        this.updateTree();
    }

    async onSelect(key: string) {
        console.log(key);
    }
}
