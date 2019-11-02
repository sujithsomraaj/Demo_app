import React, { Component } from 'react'
import { View, Alert, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'

export default class verifyEmail extends Component {

    constructor(){
        super()
        this.state = {
            key: ''
        }
    }

    handleKey = key => {
        this.setState({key: key})
    }

    handleSubmit = () => {
        fetch('http://192.168.43.68:5000/users/verify', {
            method: 'POST',
            headers: {
                'Accept': 'application/json,text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
             	token: this.state.key,
            })     
		})
		.then(response => response.json())
    	.then(responseJson => {
			console.log(responseJson);
			responseJson.success === "Success" ? Actions.home() : alert('Invalid token') ;
		})
		.catch(error => {
            console.error(error);
        });        
    }

    render() {
		const { container, title, subtitle, inputBox } = styles
        return (
            <View style = {container}>
                <Text style = {title}>Verify your identity</Text>
                <Text style = {subtitle}>Enter the key received in your mail to continue</Text>
                <TextInput style = {inputBox} placeholder = "Your key here" onChangeText = {text => this.handleKey(text)} value = {this.state.key} />
                <TouchableOpacity onPress = {this.handleSubmit}>
					<Text style={{textAlign:'center'}}>Login</Text>
				</TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		color: '#0eab4d',
		textAlign: 'center',
		fontSize: 20,
		fontWeight: 'bold',
		marginVertical: 10
	},
	subtitle: {
		fontSize: 15,
		marginVertical: 10
	},
	inputBox: {
		height: 40,
		width: 350,
		borderColor: '#000',
		borderWidth: 1,
		borderRadius: 20,
		textAlign: 'center',
		marginTop: 15
	},
	button: {
		marginTop: 20,
		backgroundColor: '#2e4394',
		padding: 12,
		borderRadius: 25
	}
})



  