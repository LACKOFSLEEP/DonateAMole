// This view is for anonymous user give some basic info 
// Users will be navigated here if a anonymous user is not in the database

import React, {Component} from "react"
import {Image,Text, View, StyleSheet, TextInput, TouchableOpacity, AsyncStorage} from "react-native"
import DatePicker from 'react-native-datepicker'
import { Dropdown } from 'react-native-material-dropdown'

// this is a class to gather info for anonymous user
// pretty much doing the same stuff as the signup
// please check the signup doc they are the same =))
export default class GatherInfo extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Image style={styles.logo} source={require('../img/logo.png')} /> 
                    <Text>Please provide some infomation to support the research.</Text>  

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

                    <TouchableOpacity onPress={this._confirm} style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                        <Text style={styles.textButton}>Back to login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    constructor(props) {
        super(props)
        // construct a data for today...
        var today = new Date()
        var year = today.getFullYear()
        var month = today.getMonth() + 1
        var day = today.getDate()
        this.state = {date: year + '-' + month + '-' + day}
    }

    // Update the date gathered from user
    setDate = (date) => {
        this.setState({date: date})
    }

    // Send info to server
    _confirm = async() => {
        uid = await AsyncStorage.getItem('uid')
        
        // check the input...
        if(typeof(this.state.race) == "undefined") {
            this.setState(previousState => {
                return { invalid: "Please selete your race!"}
        })} else if(typeof(this.state.gender) == "undefined") {
            this.setState(previousState => {
                return { invalid: "Please selete your gender!"}
        })} else {
            fetch("https://deco3801-coolcoolcool.uqcloud.net/API/anonymousUpdate.php", {
                method: 'POST', 
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    uid: uid,
                    dob: this.state.date,
                    race: this.state.race,
                    gender: this.state.gender,
                })
            })
    
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.update===true) {
                    setTimeout(function(){alert("Infomation update successfully")}, 800)
                    // redirect
                    this.props.navigation.navigate('AuthLoading')
                } else {
                    // Handle unsuccessful register
                    this.setState(previousState => {
                        return {invalid: "Server Error!"};
                      })
                }
            })
            .catch((error) => console.error(error))
        }

    }

    // Show messages the app did not get the required info
    _textInfo = function() {
        if(this.state.invalid) {
            return (
                <Text>{this.state.invalid}</Text>
            )
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