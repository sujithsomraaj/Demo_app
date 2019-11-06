

import React, { Component } from 'react'
import { View, Text,Image, TouchableOpacity, TextInput, ActivityIndicator, StyleSheet } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import AsyncStorage from '@react-native-community/async-storage'
import KeyboardView from '../components/KeyboardView'
import { Actions } from 'react-native-router-flux'

const logo = require('../assets/login.png');


export default class Login extends Component {

	constructor(props) {
		super(props);
		this.state={
			username:'',
			password:'',
			privateKey:'',
			publicKey:'',
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
		catch(error) {
			console.log(error)
		}
	}

	storeKeys = async(privateKey, publicKey) => {
		try {
			await AsyncStorage.multiSet([['privateKey', privateKey.toString()], ['publicKey', publicKey.toString()]])
		} catch(error) {
			console.log(error)
		}
	}
	
	handleSubmit = () => {
		if( !this.state.username || !this.state.password ) {
			alert('Enter all fields')
		} else {
			this.setState({ loading: true }, () => {
				fetch('https://salty-temple-12472.herokuapp.com/users/login', {
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
				.then(response => response.json())
				.then(responseJson => {
					console.log(responseJson.privateKey)
					console.log(responseJson.publicKey)
					this.setState({ loading: false , privateKey: responseJson.privateKey,publicKey: responseJson.publicKey})
					if(responseJson.success === 'true') {
						Actions.dashboard({privateKey:this.state.privateKey, publicKey:this.state.publicKey})
						this.storeLoginInfo()
						this.storeKeys(this.state.privateKey, this.state.publicKey)
					} else {
						alert(responseJson.error)
					}
				})
				.catch(error => {
					this.setState({ loading: false })
					alert(error)
				})
			})
		}
	}

	render() {
		const { loader, container, title, subtitle, inputBox, button, footerText, image } = styles
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
						<Text style = {title}>Laundromat Demo</Text>
						<Text style = {subtitle}>Login to Wallet</Text>
						<TextInput style = {inputBox} keyboardType = 'email-address' name="email" placeholder = "Enter your Email"  autoCapitalize = 'none' value = {this.state.value} onChangeText = {text => this.handleUsername(text)} />
						<TextInput secureTextEntry = {true} name="password" style = {inputBox} placeholder = "Enter your Password"  autoCapitalize = 'none' value = {this.state.value} onChangeText = {text => this.handlePassword(text)} />
						<TouchableOpacity style = {button} onPress = {this.handleSubmit}>
							<Text style={{textAlign:'center',color:'white',fontSize:17}}>Login</Text>
						</TouchableOpacity>
						<Text style={footerText}>Powered by Nodeberry Inc.,</Text>
					</View>
				)}
			</KeyboardView>   
		)
	}
}

const styles = StyleSheet.create({
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		transform: [{ scale: wp('0.4') }]
	},
	container: {
		flex: 1,
		paddingHorizontal: wp('10%'),
		justifyContent: 'center',
		backgroundColor: 'white'
	},
	title: {
		fontFamily: 'arial',
		fontSize: hp(3),
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#2e4394'
	},
	subtitle: {
		fontFamily: 'arial',
		marginTop: hp(1.7),
		fontSize: hp(2),
		fontWeight: '100',
		textAlign: 'center'
	},
	inputBox: {
		height: hp(5),
		borderColor: '#000',
		borderWidth: 1,
		borderRadius: 20,
		textAlign: 'center',
		marginVertical: hp(1.5)
	},
	button: {
		marginTop: hp(2),
		backgroundColor: '#2e4394',
		padding: 12,
		borderRadius: 25
	},
	footerText: {
		position: 'absolute',
		alignSelf: 'center',
		bottom: hp(5)
	},
	image: {
		height: hp(14),
		width: wp(23),
		marginVertical: hp(2.5),
		alignSelf: 'center'
    },
})