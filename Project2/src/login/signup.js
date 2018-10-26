// Handle sign up event

import React, {Component} from "react"
import {Image,Text, View, StyleSheet, TextInput, TouchableOpacity} from "react-native"
import DatePicker from 'react-native-datepicker'
import { Dropdown } from 'react-native-material-dropdown'

export default class SignUp extends Component {

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Image style={styles.logo} source={require('../img/logo.png')} />   
                    <View style={styles.inputContainer}>
                        <View style={styles.inputContent}>
                            <Image style={styles.inputImage} source={require('../img/email.png')} />
                            <TextInput style={this._invalidInputOnStyle()} 
                                placeholder="Input your Email Address" 
                                keyboardType="email-address"
                                onChangeText={(email)=>this.setState({email})}
                                value={this.state.email}
                                autoCapitalize={"none"}
                                autoCorrect={false}
                                blurOnSubmit={true}>
                            </TextInput>
                        </View>

                        <View style={styles.underline}></View>  

                        <View style={styles.inputContent}>
                            <Image style={styles.inputImage} source={require('../img/password.png')} />
                            <TextInput secureTextEntry={true} style={this._invalidInputOnStyle()}
                                placeholder="Set a Password, Minimum 6 letters"
                                onChangeText={(password)=>this.setState({password})}
                                value={this.state.password}
                                autoCapitalize={"none"}
                                autoCorrect={false}
                                blurOnSubmit={true}>
                            </TextInput>
                        </View>
                        <View style={styles.underline}></View>    
                    </View>

                    <View style={styles.dateContainer}>
                        <Text>DOB:  </Text>
                        <DatePicker
                            style={{width: 200}}
                            date={this.state.date}
                            mode="date"
                            placeholder="select date"
                            format="YYYY-MM-DD"
                            minDate="1900-05-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                            // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => {this.setDate(date)}}
                        />
                    </View>

                    <View style={styles.DropdownSytle}>
                        <Dropdown
                            label='Race'
                            containerStyle={{width:230}}
                            data={[{
                                value: 'American Indian or Alaska Native',
                              }, {
                                value: 'Asian',
                              }, {
                                value: 'Africa American',
                              }, {
                                value: 'Pacific Islander',
                              }, {
                                value: 'White',
                              },]}
                            onChangeText={(text) => {this.setState({race: text})}}
                        />
                        <Dropdown
                            label='Gender'
                            containerStyle={{width:230}}
                            data={[{
                                value: 'M',
                              }, {
                                value: 'F',
                              },]}
                            onChangeText={(text) => {this.setState({gender: text})}}
                        />
                    </View>

                    <View style={styles.invalidInfo}> 
                        <Text>{this._textInfo()}</Text>
                    </View>

                    <TouchableOpacity onPress={this._register} style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>sign up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.props.onclose}>
                        <Text style={styles.textButton}>Already have a acount?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    constructor(props) {
        super(props)
        // initial today when first create this component
        var today = new Date()
        var year = today.getFullYear()
        var month = today.getMonth() + 1
        var day = today.getDate()
        this.state = {email: "", password: "", date: year + '-' + month + '-' + day}
        this.setDate = this.setDate.bind(this);
        console.log(this.state.date)
    }

    // change state date set to current date
    setDate = (date) => {
        this.setState({date: date})
        console.log(date)
    }

    // Dynamically change styles by different user input
    _invalidInputOnStyle = function() {
        if(this.state.invalid) {
            return styles.inputInvalid
        } else {
            return styles.input
        }
    }

    // Show the info of invalid user input
    _textInfo = function() {
        if(this.state.invalid) {
            return (
                <Text>{this.state.invalid}</Text>
            )
        }
    }

    // register check input validation
    _register = async() => {
        console.log(this.state.email=='')
        console.log(this.state.race)
        console.log(this.state.gender)
        let pattern = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/ // RE of email
        // user info cannot be null
        if(this.state.email==='' || this.state.password==='') {
            this.setState(previousState => {
                console.log(this.state.email=='')
                return { invalid: "Username or password cannot be empty!"}
            })
        } else if(this.state.password.length < 6) {
            this.setState(previousState => {
                return { invalid: "The length of password must over 6!"}
            })
        } else if(!pattern.test(this.state.email)) {
            this.setState(previousState => {
                return { invalid: "Invalid email address!"}
            })
        } else if(typeof(this.state.race) == "undefined") {
            this.setState(previousState => {
                return { invalid: "Please selete your race!"}
            })
        } else if(typeof(this.state.gender) == "undefined") {
            console.log(this.state.gender)
            this.setState(previousState => {
                return { invalid: "Please selete your gender!"}
            })
        } else {
            // valid input and send json to API to insert new user
            fetch("https://deco3801-coolcoolcool.uqcloud.net/API/signup.php", {
                method: 'POST', 
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                    dob: this.state.date,
                    race: this.state.race,
                    gender: this.state.gender,
                })
            })
    
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.signup===true) {
                    // react native is a piece of shit, set time out or crash
                    setTimeout(function(){alert("Sign Up Successfully")}, 500)
                    this.props.onclose()
                } else {
                    console.log(responseJson)
                    // Handle unsuccessful register
                    this.setState(previousState => {
                        return {invalid: "Username exists!"};
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
        width:115, 
        height:50, 
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

    underline:{ 
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
        marginBottom: 10,
        padding: 20,
        borderRadius: 5, 
        backgroundColor: "#2a85ed", 
        borderWidth: 2,
    }, 
    
    buttonText: {
        textAlign: "center", 
        fontSize: 15, 
        color: "white", 
        fontWeight: "bold",
    },

    textButton: {
        color: "white", 
        textDecorationLine:'underline', 
        marginBottom: 20, 
        marginTop: 10,
    }, 
    dateContainer: {
        paddingTop: 15,
        flexDirection: "row",
        alignItems: 'baseline'
    },
    DropdownSytle: {
        justifyContent: "space-between"
    },
})
