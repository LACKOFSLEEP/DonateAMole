import React, {Component} from "react"
import {Text, View, StyleSheet,  AsyncStorage, TouchableOpacity, ActivityIndicator} from "react-native"

// A function for upload a single entry that represents a donation to database
export default upload = (uid, file, name, entry, location, size, description) => {
    var data = new FormData()
    console.log(file)
    console.log(name)
    console.log(entry)
    console.log(typeof(entry))
    console.log(location)
    console.log(size)
    console.log(description)

    data.append('entry', entry)
    data.append('uid', uid)
    data.append('location', location)
    data.append('size', size)
    data.append('description', description)
    data.append("img", {
        uri: file,
        name: name,
        type: 'multipart/form-data'
    })

    // send data to API
    fetch("https://deco3801-coolcoolcool.uqcloud.net/API/donate.php", {
        method: 'POST', 
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: data
    })
    .then((response) => response.json())
    .then((responseJson) => {
    console.log(responseJson.upload)
        if(responseJson.upload == true){
            console.log("upload is fucking true")
            return (true)
        } else {
            alert("Opps!")
            return (false)
        }
    })
    
}