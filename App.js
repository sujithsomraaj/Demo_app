/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React,{ Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';
import Register from './register';
import Login from './login';
import Home from './home';

class App extends Component{
    render() {
        return (
        	<Router>
            <Scene key = "root">
              <Scene key = "home" component = {Home} hideNavBar title = "Home" initial = {true} />
              <Scene key = "register" component = {Register} title = "Register" initial = {false} />
              <Scene key = "login" component = {Login} title = "Login" initial = {false} />
            </Scene>
       		</Router>
        );
    }
}

export default App;
