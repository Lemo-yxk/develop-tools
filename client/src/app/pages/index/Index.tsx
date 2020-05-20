import React, {Component} from "react";
import "./index.scss";
import Ball from "../../components/ball/Ball";
import Modal from "../../components/modal/Modal";
import Message from "../../components/message/Message";
import {SnackbarProvider} from "notistack";
import Loading from "../../components/loading/Loading";
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import Header from "../../components/header/Header";
import {Paper} from "@material-ui/core";
import DevelopmentList from "./development/List";
import Menu from "../../components/menu/Menu";

class Index extends Component {


    render() {
        return (
            <div style={{width: '100%', height: '100%'}}>
                <Loading/>
                <SnackbarProvider maxSnack={3}><Message/></SnackbarProvider>
                <Modal/>
                <Menu/>
                <Ball/>

                <div className={"index"}>
                    <div className="top">
                        <Header/>
                    </div>
                    <Paper className="middle">
                        <HashRouter>
                            <Switch>
                                {DevelopmentList.map(group =>
                                    group.Children.map((e => <Route key={e.Name} path={e.Path} component={e.Component} exact/>))
                                )}
                                {/*<Redirect from="**" to={DevelopmentList[0].Children[0].Path}/>*/}
                            </Switch>
                        </HashRouter>
                    </Paper>
                </div>

            </div>
        );
    }
}

export default Index;
