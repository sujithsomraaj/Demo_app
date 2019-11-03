import React, { Component } from 'react'
import { View, Alert, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux'

export default class verifyEmail extends Component {

    constructor(){
        super()
        this.state = {
			key: '',
			loading: false
        }
    }

    handleKey = key => {
        this.setState({key: key})
    }

    handleSubmit = () => {
		this.setState({ loading: true }, () => {
			fetch('http://salty-temple-12472.herokuapp.com/users/verify', {
				method: 'POST',
				headers: {
					'Accept': 'application/json,text/plain, */*',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					token: this.state.key.trim(),
				})     
			})
			.then(response => response.json())
			.then(responseJson => {
				console.log(responseJson);
				this.setState({ loading: false })
				responseJson.success === "Success" ? Actions.home() : alert('Invalid token') 
			})
			.catch(error => {
				console.error(error)
			})
		})        
    }

    render() {
		const { loader, container, title, subtitle, inputBox, button, buttonText } = styles
		const { loading: isLoading } = this.state
        return (
			isLoading ? 
			
			<View style = {loader}>
				<ActivityIndicator size="large" color="#007acc"/> 
			</View>
			
			:
			
			<View style = {container}>
                <Text style = {title}>Verify your identity</Text>
                <Text style = {subtitle}>Enter the key received in your mail to continue</Text>
                <TextInput style = {inputBox} placeholder = "Your key here" onChangeText = {text => this.handleKey(text)} value = {this.state.key} />
                <TouchableOpacity style = {button} onPress = {this.handleSubmit}>
					<Text style = {buttonText}>Login</Text>
				</TouchableOpacity>
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
		width: 100,
		marginTop: 20,
		backgroundColor: '#2e4394',
		padding: 12,
		borderRadius: 25
	}, 
	buttonText: {
		textAlign: 'center',
		color: 'white'
	}
})



  