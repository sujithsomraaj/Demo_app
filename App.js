/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React,{ Component } from 'react'
import { Router, Scene } from 'react-native-router-flux'
import Register from './screens/register'
import Login from './screens/login'
import Home from './screens/home'
import verifyEmail from './screens/verifyEmail'
import Dashboard from './screens/dashboard'
import SuccessScreen from './screens/successScreen'
import FailureScreen from './screens/failureScreen'

export default class App extends Component{
    render() {
        return (
        	<Router>
                <Scene key = "root">
                    <Scene key = "home" component = {Home} hideNavBar title = "Home" initial = {false} />
                    <Scene key = "register" component = {Register} title = "Register" initial = {false} />
                    <Scene key = "login" component = {Login} title = "Login" initial = {false} />
                    <Scene key = "verifyEmail" component = {verifyEmail} hideNavBar title = "Verify" initial = {false} />
                    <Scene key = "dashboard" component = {Dashboard} hideNavBar title = "Dashboard" initial = {false} />
                    <Scene key = "success" component = {SuccessScreen} hideNavBar title = "SuccessScreen" initial = {false} />
                    <Scene key = "failure" component = {FailureScreen} hideNavBar title = "FailureScreen" initial = {false} />
                </Scene>
       		</Router>
        )
    }
}
