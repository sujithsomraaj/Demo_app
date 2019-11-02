/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import KeyboardView from './components/KeyboardView';
import { Actions } from 'react-native-router-flux';
class Login extends Component {
  constructor(props) {
  super(props);
  this.state={
    username:'',
    password:''
  }
}

handleUsername = name => {
    this.setState({username: name});
}

handlePassword = password => {
    this.setState({password: password});
}
  
handleSubmit = () => {
	console.log('Button hit')
	const details = {
		email: this.state.username,
    	password: this.state.password
	}
	fetch('http://192.168.43.68:5000/users/login', {
		method: 'POST',
		headers: {
		  'Accept': 'application/json, text/plain, */*',
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({
	   
		  email:  this.state.username,
	   
		  password:this.state.password
	   
		})
	   
	  }).then((response) => response.json())
			.then((responseJson) => {
			console.log(responseJson)
			responseJson.success === "true" ? alert('Login successful') : null ;
			console.log('Dashboard')
	   
			}).catch((error) => {
			  console.error(error);
			});
	   
	   
		}

render() {
	const { container, title, subtitle, inputBox, button, footerText } = styles
    return (
		<KeyboardView>
			{() => (
				<View style = {container}>
					<Text style = {title}>Nodeberry Incorporation</Text>
					<Text style = {subtitle}>Laundromat Demo</Text>
					<TextInput style = {inputBox} placeholder = "Enter your Email" value = {this.state.value} onChangeText = {text => this.handleUsername(text)} />
					<TextInput secureTextEntry = {true} style = {inputBox} placeholder = "Enter your Password" value = {this.state.value} onChangeText = {text => this.handlePassword(text)} />
					<TouchableOpacity style = {button} onPress = {this.handleSubmit}>
						<Text style={{textAlign:'center',color:'white'}}>Login</Text>
					</TouchableOpacity>
					<Text style={footerText}>Powered by Nodeberry Inc.,</Text>
				</View>
			)}
		</KeyboardView>   
    );
}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 250,
		paddingLeft: 30,
		paddingRight:30
	},
	title: {
		fontFamily: 'arial',
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#2e4394'
	},
	subtitle: {
		fontFamily: 'arial',
		marginTop: 15,
		fontSize: 15,
		fontWeight: '100',
		textAlign: 'center'
	},
	inputBox: {
		height: 40,
		borderColor: '#000',
		borderWidth: 1,
		borderRadius: 20,
		textAlign: 'center',
		marginTop:30
	},
	button: {
		marginTop: 20,
		backgroundColor: '#2e4394',
		padding: 12,
		borderRadius: 25
	},
	footerText: {
		textAlign: 'center',
		marginTop: 200
	}
})

export default Login;
