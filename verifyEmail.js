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
        return (
            <View>
                <Text>Verify your identity</Text>
                <Text>Enter the key received in your mail to continue</Text>
                <TextInput placeholder = "Your key here" onChangeText = {text => this.handleKey(text)} value = {this.state.key} />
                <TouchableOpacity onPress = {this.handleSubmit}>
					<Text style={{textAlign:'center'}}>Login</Text>
				</TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({})



  