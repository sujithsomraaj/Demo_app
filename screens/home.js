/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,{ Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';

class Home extends Component{

	constructor() {
		super()
		this.state = {
			loading: false
		}
	}

	componentDidMount() {
		this.getLoginInfo()
	}
	
	getLoginInfo = async() => {
		try {
			const isLogged = await AsyncStorage.getItem('loggedIn')
			console.log(isLogged)
			if(isLogged === 'true') {
				console.log('Logged in')
				this.setState({ loading: true }, () => {
					setTimeout(() => {Actions.replace('dashboard')}, 500)
				})
			}
		} catch (error) {
			console.log(error)
		}
	}

	render() {
	const { loader, container, title, subtitle, button, buttonText, footer } = styles
	const goToRegister = () => {
        Actions.register()
    }
    const goToLogin = () => {
        Actions.login()
    }
	
	return (
		this.state.loading ? 
		<View style = {loader}>
			<ActivityIndicator size="large" color="#007acc"/> 
		</View>
		:
        <View style={container}>
			<Text style={title}>Nodeberry Incorporation</Text>
			<Text style={subtitle}>Laundromat Demo</Text>
			<TouchableOpacity style={button} onPress={goToRegister}>
				<Text style={buttonText}>Register</Text>
			</TouchableOpacity>
			<TouchableOpacity style={button} onPress={goToLogin}>
				<Text style={buttonText}>Login</Text>
			</TouchableOpacity>
			<Text style={footer}>Powered by Nodebery Inc.,</Text>
        </View>   
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
		paddingHorizontal: 30
	},
	title: {
		color: '#2e4394',
		fontFamily: 'arial',
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	subtitle: {
		fontFamily: 'arial',
		marginVertical: 15,
		fontSize: 15,
		fontWeight: '100',
		textAlign: 'center'
	},
	button: {
		marginVertical: 10,
		backgroundColor: '#2e4394',
		padding: 12,
		borderRadius: 25
	},
	buttonText: {
		textAlign: 'center',
		color: 'white'
	},
	footer: {
		textAlign: 'center',
		alignItems: 'flex-end',
		marginTop: 300
	}
})

export default Home;
