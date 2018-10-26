// Main portal of user signing in 
// Major funtions: login, signUp, loginAnonymous

'use strict'
import React, {Component} from "react"
import {Alert, Image, Modal, Linking,Platform, Text, View, StyleSheet, TextInput, AsyncStorage, TouchableOpacity} from "react-native"
import Spinner from 'react-native-loading-spinner-overlay'
import SignUp from "./signup"
import DeviceInfo from 'react-native-device-info'

export default class Login extends Component {
    render() {
        return (
            <View style={styles.container}>
            <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible} // indicate modal (sign up) visible
            onShow ={this.closeModal}
            
            ><SignUp closeModal={() => this.setState({modalVisible: false})}  onclose={this.resetState}/></Modal>
                
                <Spinner visible={this.state.visible} textContent={"Authenticating..."}/>
                <View style={styles.content}>
                    <Image style={styles.logo} source={require('../img/logo.png')} />
                    <View style={styles.inputContainer}>
                        <View style={styles.inputContent}>
                            <Image style={styles.inputImage} source={require('../img/email.png')} />
                            <TextInput style={this._invalidInputOnStyle()}
                            placeholder="Email" 
                            keyboardType="email-address"
                            onChangeText={(email)=>this.setState({email})}
                            value={this.state.email}
                            autoCapitalize={"none"}
                            autoCorrect={false}
                            blurOnSubmit={true}></TextInput>
                        </View>
                        <View style={styles.underline}></View>

                        <View style={styles.inputContent}>
                            <Image style={styles.inputImage} source={require('../img/password.png')} />
                            <TextInput secureTextEntry={true} style={this._invalidInputOnStyle()}
                                placeholder="Password"
                                onChangeText={(password)=>this.setState({password})}
                                value={this.state.password}
                                autoCapitalize={"none"}
                                autoCorrect={false}
                                blurOnSubmit={true}></TextInput>
                        </View>
                        <View style={styles.underline}></View>
                    </View>                                            
                    
                    <View style={styles.invalidInfo}> 
                        <Text>{this._textInfo()}</Text> 
                    </View>

                    <TouchableOpacity onPress={this._login} style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>log in</Text>
                    </TouchableOpacity>

                    <View style={styles.textButtonContainer}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('FPassword')}>
                            <Text style={styles.textButton}>Forgot password?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({modalVisible: true})} >
                            <Text style={styles.textButton}>Don't have an account?</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.seperateLine}> ------------ or ----------- </Text> 
                    <TouchableOpacity >
                        <Image style={styles.thirdPartyLogin} source={require('../img/google.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <Image style={styles.thirdPartyLogin} source={require('../img/facebook.png')} /> 
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this._loginAno}>
                        <Text style={styles.textButton}>log in anonymously</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    constructor(props) {
        super(props)
        this.state = {email: "", password: "", loading: false, modalVisible: false}
    }
    
    // Redirect the view after sign up
    // if signed in => MainView
    // else => LoginView
    resetState = () => {
        this.props.navigation.navigate('AuthLoading')
    }
    
    // Methods for retrieve password
    // Add a listener to get the event that the app was opened by a external link
    componentDidMount() { 
        if (Platform.OS === 'android') {
          Linking.getInitialURL().then(url => {
            this.setState({})
          });
        } else {
            Linking.addEventListener('url', this._emailVerify); // open by external link
        }
        this.setState({deviceID: DeviceInfo.getUniqueID()}) // use deviceID as uid for anonymous user
    }
    
    // Remove the listener (iOS) when this page is closed 
    componentWillUnmount() { 
        Linking.removeEventListener('url', this._emailVerify);

    }

    // Pass the email and salt to forget password page to verify 
    // if the user is authrised to reset the password
    _emailVerify = (event) => {
        const { navigate } = this.props.navigation
        
        // String modification to get the email and salt
        var email = event.url.split('/')[3]
        var index = event.url.indexOf('/', 29)
        var salt = event.url.substring(index+1)
        navigate ('FPassword', {email: email, salt: salt})
    }

    // Dynamically change styles when user input invalid informaion
    _invalidInputOnStyle = function() {
        if(this.state.invalid) {
            return styles.inputInvalid
        } else {
            return styles.input
        }
    }

    // Show the text info of invalid input
    _textInfo = function() {
        if(this.state.invalid) {
            return (
                <Text>{this.state.invalid}</Text>
            )
        }
    }

    // Method supports user login anonymously
    // Use deviceID as uid store in database, to be able to retrieve historu
    // If the user is not in the database, some basic info is required in Gather view
    _loginAno = async () => {
       
        fetch("https://deco3801-coolcoolcool.uqcloud.net/API/anonymousLogin.php", {
            method: 'POST', 
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: this.state.deviceID,
                password: "a",
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.login===true) {
                console.log(responseJson)
                // set uid and check wether the user is signed up 
                this._checkSetAno(responseJson)
                setTimeout(function(){Alert.alert('Be aware', "Login anonymously probably cannot track your donation history!")}, 500)
            } else {
                // Handle failed login
                this.setState(previousState => {
                    return {invalid: "Server Error"}
                    })
            }
        })
        .catch((error) => console.error(error))
    }

    // An auxiliary to set the uid&uToken to asyncStroage
    // navigate different views based on user existence in database
    _checkSetAno = async(responseJson) => {
        if (responseJson.email && responseJson.uid) {
            await AsyncStorage.setItem('uToken', responseJson.email)
            await AsyncStorage.setItem('uid', responseJson.uid)
            if(responseJson.exist == true) { // user exist
                this.props.navigation.navigate("AuthLoading")
            } else { // not exist
                this.props.navigation.navigate("Gather")
            }
        }
    }

    // Set the user token into AsyncStorage
    _loginAsync = async(key, email) => {
        await AsyncStorage.setItem(key, email)
        this.props.navigation.navigate('Main')
    }

    // Sometimes it goes wrong when key is invalid
    // So it the value need to be checked existence
    _checkSet = (key, value) => {
        if(value) {
            this._loginAsync(key, value)
        } else {
            console.log('not set, stringify failed:', key, value)
        }
    }

    // Main method for signing in
    _login = () => {
        // username and password cannot be null
        if(this.state.email==='' || this.state.password==='') {
            this.setState(previousState => {
                return { invalid: "Username or password cannot be empty!"};
            })
        } else {
            this.setState({visible: !this.state.visible}) // Spinner
            fetch("https://deco3801-coolcoolcool.uqcloud.net/API/login.php", {
                method: 'POST', 
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                })
            })
    
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({visible: !this.state.visible})
                if(responseJson.login===true) {
                    // 2 useful info of users added into Storage
                    this._checkSet('uToken', responseJson.email)
                    this._checkSet('uid', responseJson.uid)
                } else {
                    // Handle failed login
                    this.setState(previousState => {
                        console.log(responseJson, false)
                        return {invalid: "Username or password invalid"}
                        
                      })
                }
            })
            .catch((error) => console.error(error))
        }

    }
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        backgroundColor: "#5898E3" 
    },

    content: {
        flex: 1,
        alignItems: "center", 
        justifyContent : "center", 
        padding: 30,
    }, 
    
    logo: {
        width: 115,
        height: 50, 
        marginBottom: 30,
    }, 
    
    inputContainer: {
        flex: 0,
        alignSelf: "stretch",
    },

    inputContent: { 
        flexDirection: "row",
    },

    inputImage: { 
        width: 30,
        height: 30,
        marginRight: 20, 
    },

    input: {
        fontSize: 15, 
        height: 30,
        flex: 1,
        alignSelf: "stretch",
    },
    inputInvalid: { 
        fontSize: 15, 
        height: 30,
        flex: 1,
        alignSelf: "stretch",
    },
    underline: { 
        height: 1,
        backgroundColor:"white", 
        marginTop: 10,
        marginBottom: 10, 
    },

    invalidInfo: {
        height:20
    },

    buttonContainer: {
        alignSelf: "stretch",
        padding: 20,
        marginBottom: 10, 
        borderRadius: 5, 
        backgroundColor: "#2a85ed", 
        borderWidth: 2,
    },

    buttonText: { 
        textAlign: "center", 
        fontSize: 15, 
        fontWeight: "bold", 
        color: "white",
    },

    textButtonContainer: { 
        flex: 0,
        flexDirection: "row",
        alignSelf: "stretch", 
        justifyContent: "space-between", 
        marginTop: 10,
    },

    textButton: {
        color: "white", 
        textDecorationLine:'underline', 
        marginBottom: 20,
    },

    seperateLine: { 
        margin:20,
        color: "#404040",
    },

    thirdPartyLogin: { 
        width: 209, 
        height: 34, 
        marginBottom: 20
    },
    
})
