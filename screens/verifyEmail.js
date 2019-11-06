import React, { Component } from 'react'
import { View, Alert, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet,Image } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Actions } from 'react-native-router-flux'
import AsyncStorage from '@react-native-community/async-storage';

const logo = require('../assets/verify.png');


export default class verifyEmail extends Component {

    constructor(){
        super()
        this.state = {
			key: '',
			loading: false
        }
	}
	
	storeVerificationStatus = async() => {
		try {
			await AsyncStorage.setItem('active','true')
		} catch (error) {
			console.log(error)
		}
	}

    handleKey = key => {
        this.setState({key: key})
    }

    handleSubmit = () => {
		if(!this.state.key){
			alert('Enter key to verify');
		}
		else{
		this.setState({ loading: true }, () => {
			fetch('https://salty-temple-12472.herokuapp.com/users/verify', {
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
				this.setState({ loading: false })
				if(responseJson.success === "Success") {
					this.storeVerificationStatus()
					Alert.alert('Success', 'Registration successful', [{
						text: 'OK',
						onPress: () => Actions.home()
					}])
				} else if(responseJson.success === 'No user Found.') {
					alert('Invalid token')
				} else {
					alert('Registration failed. Try again')
				}
			})
			.catch(error => {
				console.error(error)
			})
		})        
    }
	}
    render() {
		const { loader, container, title, subtitle, inputBox, button, buttonText, image } = styles
		const { loading: isLoading } = this.state
        return (
			isLoading ? 
			
			<View style = {loader}>
				<ActivityIndicator size="large" color="#007acc"/> 
			</View>
			
			:
			
			<View style = {container}>
				<Image source = {logo} style = {image} />            
                <Text style = {title}>Verify your identity</Text>
                <Text style = {subtitle}>Enter the key received in your mail to continue</Text>
                <TextInput style = {inputBox} name="key" placeholder = "Your key here"  autoCapitalize = 'none'  onChangeText = {text => this.handleKey(text)} value = {this.state.value} />
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
		justifyContent: 'center',
		backgroundColor:'white',
		paddingHorizontal: wp('10%')
	},
	title: {
		color: '#0eab4d',
		textAlign: 'center',
		fontSize: hp(3),
		fontWeight: 'bold',
		marginVertical: hp(1.3)
	},
	subtitle: {
		textAlign: 'center',
		fontSize: hp(1.9),
		marginVertical: hp(1.3)
	},
	inputBox: {
		height: hp(5),
		width: wp(80),
		borderColor: '#000',
		borderWidth: 1,
		borderRadius: 20,
		textAlign: 'center',
		marginVertical: hp(2.5)
	},
	button: {
		width: wp(25),
		backgroundColor: '#2e4394',
		padding: 12,
		borderRadius: 25
	}, 
	buttonText: {
		textAlign: 'center',
		color: 'white',
		fontSize: hp(2)
	},
	image: {
		height: hp(14),
		width: wp(26),
		alignSelf: 'center'
    }
})



  