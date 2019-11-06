/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,{ Component } from 'react'
import { View, Text, Image,TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert, Keyboard } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import KeyboardView from '../components/KeyboardView'
import { Actions } from 'react-native-router-flux'
import Toast, {DURATION} from 'react-native-easy-toast'
import 'ethers/dist/shims'
import { ethers } from 'ethers'
import AsyncStorage from '@react-native-community/async-storage'

const logo = require('../assets/login.png');
export default class Register extends Component{
	constructor(props){
    	super(props);
    	this.state={
      		email: '',
      		password: '',
			confirmPassword: '',
			loading: false,
			toastVisible: false
		}
	}

	componentDidMount () {
		this.getRegisterInfo()
	}
	  
	handleUsername = name => {
      this.setState({email:name})
    }

	handlePassword = password => {
      this.setState({password: password})
    }

	handleConfirmPassword = confirmPassword => {
      this.setState({confirmPassword: confirmPassword})
	}

	getRegisterInfo = async() => {
		try {
			const active = await AsyncStorage.getItem('active')
			console.log(active)
			if(active === 'false') {
				Actions.verifyEmail()
			} else if(active === null) {
				return
			}
		} catch(error) {
			console.log(error)
		}
	}

	storeRegisterInfo = async(active) => {
		try {
			await AsyncStorage.setItem('active', active)
		} catch (error) {
			console.log(err)
		}
	}
  
	handleSubmit = () => {
		Keyboard.dismiss()
		if( !this.state.email || !this.state.password || !this.state.confirmPassword || this.state.password !== this.state.confirmPassword ) {
			alert('Enter valid details')
		} else {
			this.setState({ loading: true }, () => {
				const randomWallet = ethers.Wallet.createRandom();
				fetch('https://salty-temple-12472.herokuapp.com/users/register', {
				method: 'POST',
				headers: {
				  'Accept': 'application/json,text/plain, */*',
				  'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: this.state.email,
					password: this.state.password,
					confirmationPassword: this.state.confirmPassword,
					privateKey:randomWallet.privateKey,
					publicKey:randomWallet.address,
					oss:'test'
				})
				})
				.then(response => response.json())
				.then(responseJson => {
					this.setState({ loading: false })
					if(responseJson.success === "true") {
						console.log(responseJson)
						this.storeRegisterInfo('false')
						Actions.replace('verifyEmail')
					} else if(responseJson.success === "Email is already in use") {
						this.setState({
							email: '',
							toastVisible: true
						})
					}
				})
				.catch((error) => {
					this.setState({ loading: false })
					console.error(error);
				})
			})
		}  
	}
	
	render() {
		const { loader, container, title, subtitle, inputBox, button, footerText,image } = styles
		const { loading: isLoading } = this.state
        return (
			isLoading ? 
			
			<View style = {loader}>
				<ActivityIndicator size="large" color="#007acc"/> 
			</View>
			
			:
			
			<>
				<KeyboardView>
					{() => (
						<View style = {container}>
							{ this.state.toastVisible ? this.refs.toast.show('Already registered! Please login to continue', 400, () => {Actions.pop()}) : null }
							<Text style={title}>Laundromat Demo</Text>
							<Text style={subtitle}>Create Your Wallet</Text>
							<TextInput autoCapitalize = 'none' keyboardType = 'email-address' name="email" type="email" style={inputBox} placeholder="Enter your Email" value={this.state.value} onChangeText={text=>this.handleUsername(text)} />
							<TextInput autoCapitalize = 'none' name="password" secureTextEntry = {true} style={inputBox} placeholder="Enter your Password" value={this.state.value} onChangeText={text=>this.handlePassword(text)}  />
							<TextInput autoCapitalize = 'none' name="confirmPassword" secureTextEntry = {true} style={inputBox} placeholder="Enter Confirmation Password" value={this.state.value} onChangeText={text=>this.handleConfirmPassword(text)} />
							<TouchableOpacity style={button} onPress={this.handleSubmit}>
								{
									isLoading ? <Text style={{textAlign:'center',color:'white',fontSize:hp(2)}}>Please Wait</Text> : <Text style={{textAlign:'center',color:'white',fontSize:hp(2)}}>Register</Text>
								}
							</TouchableOpacity>
							<Text style={footerText}>Powered by Nodeberry Inc.,</Text>
						</View>
					)}
				</KeyboardView>   
				<Toast ref="toast" position='top' positionValue={15} style = {{backgroundColor: '#ffb417', width: 300}} textStyle={{color: 'black'}}/>
			</>
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
		justifyContent: 'center',
		paddingHorizontal: wp('10%'),
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
	}
})

