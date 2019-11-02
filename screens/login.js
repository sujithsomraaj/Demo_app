/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import KeyboardView from '../components/KeyboardView';
import { Actions } from 'react-native-router-flux';
class Login extends Component {

	constructor(props) {
		super(props);
		this.state={
			username:'',
			password:'',
			loading: false
		}
	}

	handleUsername = name => {
		this.setState({username: name});
	}

	handlePassword = password => {
		this.setState({password: password});
	}

	storeLoginInfo = async() => {
		try {
			await AsyncStorage.setItem('loggedIn', 'true') 
		}
		catch(error){
			console.log(error)
		}
	}
	
	handleSubmit = () => {
		this.setState({ loading: true }, () => {
			fetch('http://salty-temple-12472.herokuapp.com/users/login', {
				method: 'POST',
				headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				},
				body: JSON.stringify({
				email: this.state.username,	   
				password: this.state.password
				})
			})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson)
				this.storeLoginInfo()
				this.setState({ loading: false })
				responseJson.success === "true" ? Actions.replace('dashboard') : null ;	   
			})
			.catch((error) => {
				this.setState({ loading: false })
				console.error(error);
			})
		})   
	}

	render() {
		const { loader, container, title, subtitle, inputBox, button, footerText } = styles
		const { loading: isLoading } = this.state
		return (
			isLoading ? 
			
			<View style = {loader}>
			    <ActivityIndicator size="large" color="#007acc"/> 
			</View>
			
			:
			
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
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		transform: [{ scale: 1.5 }]
	},
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
