// A utility to render each photo in the same view
// Naivigated by the history view

import React, {Component} from "react"
import {Alert, Text, Image, View, StyleSheet, TextInput, ScrollView, AsyncStorage, TouchableOpacity} from "react-native"
import MyHeader from "../component/header"
import upload from "../function/upload"
import AlbumHeader from "./albumHeader"
import Spinner from 'react-native-loading-spinner-overlay'

export default class MyAlbum extends Component {

    constructor(props) {
        super(props)
        this.onChanged = this.onChanged.bind(this)
        this.state = {visible: false}
    }

    // first created, set the state by the props passed in
    componentWillMount() {
        this.setState({key: this.props.navigation.state.params.key, value: this.props.navigation.state.params.value})

    }

    // if there's any changes, fetch the data of the album again to render
    onChanged = async() => {
        this.setState({visible: true})
        uid = await AsyncStorage.getItem('uid')
        fetch("https://deco3801-coolcoolcool.uqcloud.net/API/getAlbum.php", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uid: uid,
                name: this.state.value[0]
            })
        })
        .then((response) => response.json()
        )
        .then((responseJson) => {
            this.setState({value: responseJson})
            this.setState({visible: false})
        })   
    }

    render() {
        // Get all data passed by navigation
        name = this.state.value[0]
        imgs = this.state.value[1]
        ids = this.state.value[2]
        var i
        var images = []
        for(i=0;i<imgs.length;i++) {
            if(ids[i] != null) {
                images.push(
                    <Photo key={i} uri={imgs[i]} pid={ids[i]} onChanged={this.onChanged}/>             
                )
            }
        }
        return(
            
            <View style={{flex:1}}>
                <Spinner visible={this.state.visible} textContent={"Processing"}/>
                <AlbumHeader name={name} 
                back={() => this.props.navigation.navigate('Root', {onChanged: true})}
                add={() => this.props.navigation.navigate('OnDonate', {entry: name})}/>
                <ScrollView style={{flex:1}}>
                    {images}
                </ScrollView>
            </View>
        )
        
    }
}

// a class for photo, every phote is generated in clicking the album image
class Photo extends Component {

    constructor(props) {
        super(props)
        this.state = {uri: null, pid: null, delete: false}
    }

    // first created, set the state 
    componentWillMount() {
        this.setState({uri: this.props.uri, pid: this.props.pid}) 
    }

    // long press on the phote to delete, send pid to API to delete the tuple in database
    sendDelete(pid) {
        fetch("https://deco3801-coolcoolcool.uqcloud.net/API/delete.php", {
                method: 'POST', 
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: pid
                })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.delete == true) {
                console.log(responseJson)
                Alert.alert("Successfully deleted")
                this.props.onChanged()
            }
        })
    }

    // confirm for delition
    delete() {
        Alert.alert(
            "Confirm Delete",
            "Are you sure to continue?",
            [
                {text: "Cancel", style: 'cancel'},
                {text: "Confirm", onPress: () => this.sendDelete(this.state.pid)},
            ],
            {cancelable: false}
        )
    }

    render() {
        return(
            <View style={styles.frame}>
                <TouchableOpacity onLongPress={() => this.delete()}>
                    <Image source={{uri:this.props.uri}}
                    style={{width: 160, height: 160}} />  
                </TouchableOpacity>
                <Text>This is a discription</Text>    
            </View> 
        ) 
    }
    
}
 
const styles = StyleSheet.create({
    frame: {
        flex: 1,
        flexDirection: 'row',
    }
})