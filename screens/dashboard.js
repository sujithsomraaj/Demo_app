import React, { Component } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Keyboard, BackHandler, Alert } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import AsyncStorage from '@react-native-community/async-storage'
import CardView from 'react-native-cardview'
import Spinner from 'react-native-spinkit'
import { Actions } from 'react-native-router-flux'
import axios from 'axios'
import 'ethers/dist/shims'
import { ethers } from 'ethers'
export default class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            recipient: '',
            amount: '',
            loading: false,
            buttonState: false,
            transferring: false,
            balance: ''
        }
    }

    componentDidMount() {
        const provider = ethers.getDefaultProvider("homestead");
        let address = this.props.publicKey;
        provider.getBalance(address).then((balance) => {
        // balance is a BigNumber (in wei); format is as a sting (in ether)
            var  etherString = ethers.utils.formatEther(balance);
            this.setState({balance:etherString});
        })
    }

    UNSAFE_componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
	}

	UNSAFE_componentWillUnMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
	}

	handleBackButton = () => {
		if (Actions.currentScene == 'dashboard') {
			Alert.alert('Quit','Close the application?', [{
				text: 'OK',
				onPress: () =>	BackHandler.exitApp()
			}], {
				cancelable: true
			})
			return true
		}
	}

    handleToUser = name => {
        console.log(name)
        this.setState({ recipient: name })
    }

    handleAmount = amount => {
        this.setState({ amount: amount })
    }

    handleTransaction = () => {
        if( !this.state.recipient || !this.state.amount || this.state.recipient.length <= 41 ) {
            alert("Enter Valid Details");
        } else {
            Keyboard.dismiss()
            this.setState({ transferring: true, buttonState: true }, () => {
                const recipient = this.state.recipient.toString()
                const gasPrice = '0.000002'
                const gasLimit = 25000
                console.log(recipient)
                const provider = ethers.getDefaultProvider("homestead");
                let privateKey = this.props.privateKey;
                let wallet = new ethers.Wallet(privateKey, provider);
                let sendEth = this.state.amount
                let transaction = {
                    gasPrice: ethers.utils.parseEther(gasPrice),
                    gasLimit: gasLimit,
                    to: recipient,
                    value: ethers.utils.parseEther(sendEth)
                };     
                // Send the transaction
                console.log(transaction)
                let sendTransactionPromise = wallet.sendTransaction(transaction);
                
                sendTransactionPromise
                .then(tx => {
                    Actions.success();
                    this.setState({
                        recipient: '',
                        amount: '', 
                        transferring: false,
                        buttonState: false
                    });
                    console.log (tx);
                })
                .catch(err => {
                    const error = err.toString().slice(7)
                    if(error === 'insufficient funds (version=4.0.39)') {
                        this.setState({
                            recipient: '',
                            amount: '', 
                            transferring: false,
                            buttonState: false
                        })
                        alert('Insufficient funds')
                    } else {
                        console.log(err)
                        Actions.failure()
                        this.setState({
                            recipient: '',
                            amount: '', 
                            transferring: false,
                            buttonState: false
                        })
                    }
                });
            });
        }
    }

    removeLoginInfo = async() => {
        try {
            await AsyncStorage.setItem('loggedIn', 'false')
            await AsyncStorage.multiRemove(['privateKey', 'publicKey'])
            console.log('Logged out')
        } catch (error) {
            console.log(error)
        }
    }

    handleLogout = () => {
        const logout = {
            name:"logout"
        }
        this.setState({ loading: true }, () => {
            axios.post('https://salty-temple-12472.herokuapp.com/users/logout', logout)
            .then(responseJson => {
				this.setState({ loading: false })
				if(responseJson.data.success === true) {
					this.removeLoginInfo()
					Actions.replace('home')
				} else {
					alert('Can\'t logout. Try again')
                }     
            })
            .catch(error => {
                this.setState({ loading: false })
                console.error(error)
            });
        })
    }   

    render() {
        const { screenLoader, navbar, titleView, title, buttonView, button, buttonText, container, card, inputBox, cardTtitle, publicKey, formLabel1, formLabel2, transferButton, balanceLabel, balanceSymbol, loader} = styles
        const { loading: isLoading } = this.state
        
        return (

            isLoading ?
            
            <View style = {screenLoader}>
			    <ActivityIndicator size="large" color="#007acc"/> 
			</View>

            :

            <>
                <View style = {navbar}>
                    <View style = {titleView}>
                        <Text style = {title}>Your Wallet</Text> 
                    </View>
                    <View style = {buttonView}>
                        <TouchableOpacity style = {button} onPress = {this.handleLogout}>
                            <Text style = {buttonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style = {container}>
                    <CardView
                        cardElevation={5}
                        cardMaxElevation={7}
                        cornerRadius={5}>
                        <View style = {card}>
                            <Text style = {cardTtitle}>| Account</Text>
                            <Text style ={publicKey} >{this.props.publicKey}</Text>
                            <Text style = {formLabel1}>To:</Text>
                            <TextInput style = {inputBox} name="recipient" value = {this.state.recipient} placeholder = "Recipient's name"  autoCapitalize = 'none'  onChangeText = {text => this.handleToUser(text)}/>
                            <Text style = {formLabel2}>Amount:</Text>
                            <TextInput style = {inputBox} keyboardType = 'numeric' name="amount" value = {this.state.amount} placeholder = "Enter amount"  autoCapitalize = 'none' onChangeText = {text => this.handleAmount(text)}/>
                        </View>
                        <View style = {{flexDirection: 'row', marginTop: hp(3.5)}}>
                            <View>
								<TouchableOpacity style = {transferButton} onPress = {this.handleTransaction} disabled = {this.state.buttonState}>
									{ 
										this.state.transferring ?
										
										<View style = {loader} >
											<Spinner isVisible={true} size={wp(8.5)} type='Wave' color='white'/>
										</View> 
										
										: 
										
										<Text style = {buttonText}>Send</Text>
									}
                                </TouchableOpacity>
                            </View>
                            <View style = {{ marginTop: hp(4.5) }}>
                                <Text style = {balanceLabel}>Balance</Text>
                                <Text style = {balanceSymbol}><Text style = {{color: 'grey'}}>ETH </Text>{this.state.balance.substring(0,5)}</Text>
                            </View>
                        </View>
                    </CardView>
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    screenLoader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
        transform: [{ scale: wp('0.4') }]
    },
    navbar: {
        flexDirection: 'row',
        backgroundColor:'white',
        marginTop: hp(0)
    },
    titleView: {
        flex: 2,
        justifyContent: 'flex-start'
    },
    title: {
        fontSize: hp(3.5),
        fontWeight: 'bold',
        color: '#28376c',
        margin: hp(2.5),
        marginTop: hp(6)
    },
    buttonView: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: 'flex-end'
    },
    button: {
        marginTop: hp(5.3),
        width: wp('25%'),
        backgroundColor: '#2e4394',
		padding: 12,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25
	},
	cardTtitle: {
		fontSize: hp(2.3),
		fontWeight: 'bold',
		color: '#e17c00'
    },
    publicKey: {
        color: '#e17c00',
        marginVertical: hp(1)
    },
	formLabel1: {
		fontSize: hp(2.2),
		marginTop: hp(1.5)
	},
	formLabel2: {
		fontSize: hp(2.2),
		marginTop: hp(2.5)
	},
    transferButton: {
        marginTop: hp(4.3),
        marginLeft: hp(3.5),
        width: wp(30),
        backgroundColor: '#0fb65e',
		padding: hp(1.5),
        borderRadius: 25,
    },
    buttonText: {
        fontSize: hp(2.2),
        textAlign: 'center',
        color: 'white'
    },
    container : {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'white'
    },
    card: {
        paddingHorizontal: wp('1%'),
        marginHorizontal: wp('6.3%'),
        marginVertical: hp('2.5%'),
        height: hp('23.5%'),
    },
    inputBox: {
		height: hp(5),
		borderColor: '#000',
		borderWidth: 1,
        borderRadius: 20,
        paddingLeft: wp(5),
		marginTop: hp(1.5)
    },
    balanceLabel: {
        alignSelf: 'flex-end',
        marginLeft: wp(38),
        fontSize: hp(2.3),
        color:'grey'
    },
    balanceSymbol: {
        alignSelf: 'flex-end',
        marginBottom: hp(2.5),
        fontSize: hp(2)
    },
	loader: {
		flex:1,
		alignItems: 'center',
        justifyContent: 'center',
        padding: hp(1.5)
	}
})