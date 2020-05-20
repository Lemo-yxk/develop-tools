import React, {Component} from "react";
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import {createBrowserHistory, History, Location, UnregisterCallback} from "history";
import "./App.scss";
import Index from "./pages/index/Index";
import Login from "./pages/login/Login";
import WebSocket from "./ws/WebSocket";
import Event from "./event/Event";
import Ready from "./components/ready/Ready";

export default class App extends Component {


    state = {visible: false};

    unListen!: UnregisterCallback;

    change(location: Location<History.PoorMansUnknown>) {

    }

    constructor(props: any) {
        super(props);
        WebSocket.start();
    }

    componentDidMount() {

        Event.listen("ready", (status) => this.setState({visible: status}));

        const history = createBrowserHistory();
        // Get the current location.
        const location = history.location;

        this.change(location);

        // Listen for changes to the current location.
        this.unListen = history.listen((location, action) => {
            // location is an object like window.location
            this.change(location);
        });
    }

    componentWillUnmount() {
        WebSocket.close();
        Event.remove("ready");
        this.unListen();
    }

    render() {
        if (!this.state.visible) return <Ready/>;
        return <HashRouter>
            <Switch>
                <Route path="/index" component={Index}/>
                <Route path="/login" component={Login} exact/>
                <Redirect from="**" to="/index"/>
            </Switch>
        </HashRouter>
    }
}
