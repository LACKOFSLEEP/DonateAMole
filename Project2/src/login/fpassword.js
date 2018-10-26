// Method for resetting password
// The handler for rendering different views on different states of server response
// The way how this funtion works:
// if the props, which is given by the navigation, contains the email of sent by the server, it proves
// the user has requested to reset the password. The view will be resetting the password in this situation.


'use strict'
import React, {Component} from "react"
import {Image, Text, View, StyleSheet, TextInput, TouchableOpacity} from "react-native"
import Spinner from 'react-native-loading-spinner-overlay'

export default class FPassword extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.visible} textContent={"Sending..."}/>
                <View style={styles.content}>
                    <Image style={styles.logo} source={require('../img/logo.png')} />                          
                    {this._reset()}
                    <TouchableOpacity onPress={this._login} style={styles.textButtonContainer}>
                        <Text style={styles.textButton} onPress={() => this.props.navigation.navigate('Login')}> >> Back to log in </Text>
                    </TouchableOpacity>             
                </View>
            </View>
        )
    }
    
    constructor(props) {
        super(props)
        this.state = {email: '', reset: false, salt:''} // salt: user cannot use the same email to reset the password many times!
    }

    // Show the text info of invalid input
    _textInfo = function() {
        if(this.state.invalid) {
            return (
                this.state.invalid
            )
        }
    }

    // The handler of varified users to reset their passwords
    // Salt needs to be confirmed
    // Which is gotten from login.js
    _reset = function() {
        try{
            // A TypeError will occur if no param has been passed
            if(this.props.navigation.state.params.email) {
                if(this.props.navigation.state.params.salt != this.state.salt) {
                    alert("Invalid Link") // this email has been used
                } else {
                    return (
                        <View style={styles.dynamicContent}>
                            <Text style={styles.emailAddress}>
                                {this.props.navigation.state.params.email}
                            </Text> 

                            <View style={styles.inputContainer}> 
                                <View style={styles.inputContent}>
                                    <Image style={styles.inputImage} source={require('../img/password.png')} />
                                    <TextInput secureTextEntry={true}
                                        placeholder="Input your New Password"
                                        onChangeText={(password)=>this.setState({password})}
                                        value={this.state.password}
                                        autoCapitalize={"none"}
                                        autoCorrect={false}>
                                    </TextInput>
                                </View>
                                <View style={styles.underline}></View>

                                <View style={styles.inputContent}>
                                    <Image style={styles.inputImage} source={require('../img/password.png')} />
                                    <TextInput secureTextEntry={true}
                                        placeholder="Confirm Password"
                                        onChangeText={(cpassword)=>this.setState({cpassword})}
                                        value={this.state.cpassword}
                                        autoCapitalize={"none"}
                                        autoCorrect={false}>
                                    </TextInput>
                                </View>
                                <View style={styles.underline}></View>
                            </View>
                            
                            <TouchableOpacity onPress={this._doubleCheck} style={styles.buttonContainer}>
                                <Text style={styles.buttonText}>submit</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }   
            } 
        }catch(TypeError){
            return (
            // Render for users who get in this page first time
            <View style={styles.dynamicContent}>
                <View style={styles.inputContainer}>
                    <View style={styles.inputContent}>
                        <Image style={styles.inputImage} source={require('../img/email.png')} />
                        <TextInput 
                            style={styles.input}
                            placeholder="Email Address" 
                            keyboardType="email-address"
                            onChangeText={(email)=>this.setState({email})}
                            value={this.state.email}
                            autoCapitalize={"none"}
                            autoCorrect={false}
                            blurOnSubmit={true}>
                        </TextInput> 
                    </View> 
                    <View style={styles.underline}></View> 
                </View>              
                <View style={styles.invalidInfo}>
                    <Text>{this._textInfo()}</Text> 
                </View>

                <TouchableOpacity onPress={this._fpassword} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>send email</Text> 
                </TouchableOpacity>
            </View>        
        )}
    }

    // Check indenticiality of 2 inputs
    _doubleCheck = () => {
        if(this.state.password===this.state.cpassword) {
            this._sendReset()
        }
        else {
            alert("Password does not match")
        }
    }

    // Send reset password request to server, requires user email varify
    _sendReset = () => {
        fetch("https://deco3801-coolcoolcool.uqcloud.net/API/resetpassword.php", {
                method: 'POST', 
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: this.props.navigation.state.params.email,
                    password: this.state.password,
                    salt: this.props.navigation.state.params.salt
                })
        })
        .then((response) => response.json())
        .then(responseJson => {
            if(responseJson.update===true) {
                this.props.navigation.navigate('Login') // back to login view
            } else {
                alert("Server Error!")
            }
        })
    }

    // Varify the email address needs to retrieve password
    _fpassword = () => {
        let pattern = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/ // Regex for email
        if(this.state.email==='') {
            this.setState(previousState => {
                return { invalid: "Email cannot be empty!"}
            })
        } else if(!pattern.test(this.state.email)) {
            this.setState(previousState => {
                return { invalid: "Invalid email address!"}
            })
        } else {
            this.setState({visible: !this.state.visible})
            fetch("https://deco3801-coolcoolcool.uqcloud.net/API/forgetpassword.php", {
                method: 'POST', 
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: this.state.email,
                })
            })
            .then((response) => response.json())
            .then(responseJson => {
                this.setState({visible: !this.state.visible})
                if(responseJson.email===true) {
                    // Email verified
                    this.setState({reset: !this.state.reset, salt: responseJson.salt})
                } else {
                    this.setState(previousState => {
                        return { invalid: "Email Address does not exist!"}
                    })
                }
            })
        }
        
    }
}


const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        backgroundColor: "#5898E3", 
    },

    content: { 
        flex: 1,
        alignItems: "center", 
        justifyContent : "center", 
        padding: 30,
    }, 
    
    logo: {
        width: 115, 
        height:50, 
        marginBottom: 30, 
    },

    dynamicContent: {  
        justifyContent : "center", 
        alignSelf: "stretch",
    },

    emailAddress: { 
        marginBottom: 20,
    },

    inputContainer: { 
        flex: 0,
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
    }, 
    
    inputInvalid: {
        fontSize: 15,
        height: 30,
        flex: 1,
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
        margin:10,
    },

    textButton: {
        color: "white", 
        textDecorationLine:'underline', 
    }, 
})