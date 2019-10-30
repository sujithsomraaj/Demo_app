/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,{ Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import KeyboardView from './components/KeyboardView';

const axios = require('axios');

class Register extends Component{
	constructor(props){
    	super(props);
    	this.state={
      		username: '',
      		password: '',
	  		confirmPassword: ''
		}
  	}

	handleUsername = name => {
      this.setState({username:name});
    }

	handlePassword = password => {
      this.setState({password: password});
    }

	handleConfirmPassword = confirmPassword => {
      this.setState({confirmPassword: confirmPassword});
    }
  
	handleSubmit = () => {
      const details = {
        email: this.state.username,
        password: this.state.password,
        confirmationPassword: this.state.confirmPassword,
        publicKey:'xyz',
        privateKey:'zz',
        oss:'privae'
      }
      axios.post('http://localhost:5000/users/register', details)
      .then(response=>{
        alert(response.data.success);
      })
	}
	
	render(){
		const { container, title, subtitle, inputBox, button, footer } = styles
        return( 
			<KeyboardView>
				{() => (
					<View style={container}>
						<Text style={title}>Nodeberry Incorporation</Text>
						<Text style={subtitle}>Laundromat Demo</Text>
						<Text style={{textAlign:'center'}}>{this.state.username}</Text>
						<TextInput name="username" type="email" style={inputBox} placeholder="Enter your Email" value={this.state.value} onChangeText={text=>this.handleUsername(text)}/>
						<TextInput name="password" style={inputBox} placeholder="Enter your Password" value={this.state.value} onChangeText={text=>this.handlePassword(text)}/>
						<TextInput name="confirmPassword" style={inputBox} placeholder="Enter Confirmation Password" value={this.state.value} onChangeText={text=>this.handleConfirmPassword(text)}/>
						<TouchableOpacity style={button} onPress={this.handleSubmit}><Text style={{textAlign:'center',color:'white'}}>Register</Text></TouchableOpacity>
						<Text style={footer}>Powered by Nodebery Inc.,</Text>
					</View>
				)}
        	</KeyboardView>   
        );
    }
}

const styles = StyleSheet.create({
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
	footer: {
		textAlign: 'center',
		marginTop: 100
	}
})

export default Register;
