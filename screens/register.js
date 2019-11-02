/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,{ Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import KeyboardView from '../components/KeyboardView';
import { Actions } from 'react-native-router-flux';
import Toast, {DURATION} from 'react-native-easy-toast'

const axios = require('axios');

class Register extends Component{
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

	handleUsername = name => {
      this.setState({email:name});
    }

	handlePassword = password => {
      this.setState({password: password});
    }

	handleConfirmPassword = confirmPassword => {
      this.setState({confirmPassword: confirmPassword});
    }
  
	handleSubmit = () => {
		this.setState({ loading: true }, () => {
			fetch('http://salty-temple-12472.herokuapp.com/users/register', {
			method: 'POST',
			headers: {
			  'Accept': 'application/json,text/plain, */*',
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password,
			   	confirmationPassword: this.state.confirmPassword,
				publicKey:'xyz',
				privateKey:'zz',
				oss:'privae'
			})
		})
		.then(response => response.json())
		.then(responseJson => {
			console.log(responseJson)
			this.setState({ loading: false })
			if(responseJson.success === "true") {
				Actions.verifyEmail()
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
		});
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
			
			<>
			<KeyboardView>
			{() => (
				<View style={container}>
				{ this.state.toastVisible ? this.refs.toast.show('Already registered! Please login to continue', 400, () => {Actions.pop()}) : null }
					<Text style={title}>Nodeberry Incorporation</Text>
					<Text style={subtitle}>Laundromat Demo</Text>
					<Text style={{textAlign:'center'}}>{this.state.email}</Text>
					<TextInput name="email" type="email" style={inputBox} placeholder="Enter your Email" value={this.state.value} onChangeText={text=>this.handleUsername(text)}/>
					<TextInput name="password" style={inputBox} placeholder="Enter your Password" value={this.state.value} onChangeText={text=>this.handlePassword(text)}/>
					<TextInput name="confirmPassword" style={inputBox} placeholder="Enter Confirmation Password" value={this.state.value} onChangeText={text=>this.handleConfirmPassword(text)}/>
					<TouchableOpacity style={button} onPress={this.handleSubmit}><Text style={{textAlign:'center',color:'white'}}>Register</Text></TouchableOpacity>
					<Text style={footerText}>Powered by Nodebery Inc.,</Text>
					</View>
			)}
			</KeyboardView>   
			<Toast ref="toast" position='top' style = {{backgroundColor: '#ffb417', width: 300}} textStyle={{color: 'black'}}/>
			</>
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
		marginVertical: 200,
		paddingLeft: 30,
		paddingRight: 30
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
		marginTop: 30
	},
	button: {
		marginTop: 20,
		backgroundColor: '#2e4394',
		padding: 12,
		borderRadius: 25
	},
	footerText: {
		textAlign: 'center',
		marginTop: 100
	}
})

export default Register;
