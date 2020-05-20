import React, {Component} from "react";
import {Chip, Divider, Drawer} from "@material-ui/core";
import Event from "../../event/Event";
import DevelopmentList from "../../pages/index/development/List";
import "./menu.scss"
import {Develop} from "../../interface/modal";

export default class Menu extends Component<any, any> {


    state = {
        visible: false,
        selectedPath: localStorage.getItem("defaultPath") || DevelopmentList[0].Children[0].Path
    }

    componentDidMount() {
        this.onChangePath(this.state.selectedPath)
        Event.listen("openMenu", () => this.onOpen());
        Event.listen("changePath", (path) => this.onChangePath(path));
    }

    componentWillUnmount() {
        Event.remove("openMenu");
        Event.remove("changePath");
    }

    onClick(e: Develop) {
        this.onChangePath(e.Path)
        this.onClose()
    }

    onChangePath(path: string) {
        localStorage.setItem("defaultPath", path)
        window.location.hash = path
        this.setState({selectedPath: path})
    }

    render() {
        return (
            <Drawer
                anchor={"right"}
                open={this.state.visible}
                onClose={() => this.onClose()}
                title={`Menu`}
            >

                <div className={"menu"}>
                    {DevelopmentList.map(group =>
                        <React.Fragment key={group.Name}>
                            <div className={"groupWord"}>{group.Name}</div>
                            <div className={"menuGroup"} key={group.Name}>
                                {group.Children.map(e =>
                                    <div className={"menuList"} key={e.Name}>
                                        <Chip
                                            label={e.Name}
                                            onClick={() => this.onClick(e)}
                                            color={this.state.selectedPath === e.Path ? "secondary" : "primary"}
                                            variant="outlined"
                                            size={"small"}
                                        />
                                    </div>
                                )}
                            </div>
                            <Divider className={"groupDivider"}/>
                        </React.Fragment>
                    )}
                </div>

            </Drawer>
        )
    }

    private onClose() {
        this.setState({visible: false})
    }

    private onOpen() {
        this.setState({visible: true})
    }
}