/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,{ Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, BackHandler, Alert } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import AsyncStorage from '@react-native-community/async-storage'
import { Actions } from 'react-native-router-flux'

const logo = require('../assets/home.png');
export default class Home extends Component{

	constructor() {
		super()
		this.state = {
			loading: false
		}
	}

	UNSAFE_componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
	}

	UNSAFE_componentWillUnMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
	}

	handleBackButton = () => {
		if (Actions.currentScene == 'home') {
			Alert.alert('Quit','Close the application?', 
			[{
				text: 'OK',
				onPress: () =>	BackHandler.exitApp()
			}], {
				cancelable: true
			})
			return true
		}
	}
	
	handleLoginInfo = async() => {
		try {
				const isLogged = await AsyncStorage.getItem('loggedIn')
				if(isLogged === 'true') {
					const publicKey = await AsyncStorage.getItem('privateKey')
					const privateKey = await AsyncStorage.getItem('publicKey')
					console.log(privateKey)
					console.log(publicKey)
					console.log('Logged in')
					this.setState({ loading: true }, () => {
						setTimeout(() => {Actions.reset('dashboard',{privateKey, publicKey})}, 500)
					})
				} else if(isLogged === null || isLogged === 'false') {
					Actions.login()
				}
		} 
		catch (error) {
			console.log(error)
		}
	}

	render() {
		const { loader, container, title, subtitle, button, buttonText, footer, image } = styles		
		return (
			this.state.loading ? 

			<View style = {loader}>
				<ActivityIndicator size="large" color="#007acc"/> 
			</View>
			
			:
			
			<View style={container}>
				<Text style={title}>Nodeberry Incorporation</Text>
				<Text style={subtitle}>Laundromat Demo</Text>
				<Image source = {logo} style = {image} />            
				<TouchableOpacity style={button} onPress={() => Actions.register()}>
					<Text style={buttonText}>Register</Text>
				</TouchableOpacity>
				<TouchableOpacity style={button} onPress={this.handleLoginInfo}>
					<Text style={buttonText}>Login</Text>
				</TouchableOpacity>
				<Text style={footer}>Powered by Nodeberry Inc.,</Text>
			</View>   
		)
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
		justifyContent: 'center',
		paddingHorizontal: wp('10%'),
		backgroundColor: 'white'
	},
	title: {
		color: '#2e4394',
		fontFamily: 'arial',
		fontSize: hp(3),
		fontWeight: 'bold',
		textAlign: 'center'
	},
	subtitle: {
		fontFamily: 'arial',
		marginVertical: hp(1.8),
		fontSize: hp(2),
		fontWeight: '100',
		textAlign: 'center'
	},
	button: {
		marginVertical: hp(1.5),
		backgroundColor: '#2e4394',
		padding: 12,
		borderRadius: 25
	},
	buttonText: {
		textAlign: 'center',
		color: 'white'
	},
	footer: {
		position: 'absolute',
		alignSelf: 'center',
		bottom: hp(5)
	},
    image: {
		height: hp(14),
		width: wp(23),
		alignSelf: 'center',
		marginBottom: 25
    }
})