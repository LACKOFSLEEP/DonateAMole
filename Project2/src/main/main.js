// The main view of the app
// Prefetch and cache user's donation histories

import React, {Component} from "react"
import {Text, Image, View, StyleSheet, AsyncStorage, TouchableOpacity} from "react-native"
import MyHeader from "../component/header"

export default class MainView extends Component {
    static navigationOptions = {
        drawerLable: "Home"
    }
    constructor(props) {
        super(props)
        this.state = {uToken: '', uid: ''}
    }

    // Test method...need to delete
    logout = () => {
        AsyncStorage.removeItem('uToken')
        this.props.navigation.navigate('AuthLoading')
    }
    // check login state
    async componentDidMount() {
        this._loginConfirm()
    }
    // Set user token and username to state
    _loginConfirm = async() => {
        try {
            uToken = await AsyncStorage.getItem('uToken')
            uid = await AsyncStorage.getItem('uid')
            this.setState({uToken: uToken, uid: uid})
            
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        return(
            <View style={styles.container}>
                <MyHeader drawerOpen={() => this.props.navigation.openDrawer()}/>
                <View style={styles.content}>
                    <Text style={styles.title}>Donate a Mole</Text>
                    <Text style={styles.text}>Every donation counts.</Text>
                    <Text style={styles.text}>Start making a difference now.</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('History')} style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>start a new donation</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.doctorContainer}>
                        <Image style={styles.image} source={require('../img/doctor.png')} />
                        
                        <View style={styles.findDoctor}>
                            <Text style={styles.doctorText}>Have suspicious skin pigmentation?</Text>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Support')} style={styles.buttonContainer2}>
                                <Text style={styles.buttonText}>Find Doctors Nearby</Text>
                            </TouchableOpacity>
                        </View>
                    
                    </View>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        flex: 1, 
        alignItems: "center",
        justifyContent : "center",
        padding: 30,
    },

    title: {
        fontSize:  40,
        color: "#2a85ed",
        marginBottom: 20,
        // margin: 30,
    },

    text: {
        fontSize:  20,
        

    },

    buttonContainer: {
        alignSelf: "stretch",
        padding: 20,
        marginTop: 20,
        borderRadius: 5,
        backgroundColor: "#2a85ed",

    },
    buttonText: {
        textAlign: "center",
        fontSize: 15,
        fontWeight: "bold",
        color: "white",
    },

    doctorContainer: {
        marginTop: 20,
        padding: 20, 
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#F2F2F2"
    },

    image: {
        marginRight: 20,
        padding: 20,
        width: 100, 
        height: 100,
    },

    findDoctor: {
        flex: 1, 
        alignItems: "center",
    },

    doctorText: {
        fontSize: 15,
    },

    buttonContainer2: {
        alignSelf: "stretch",
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: "green",
    }
})
