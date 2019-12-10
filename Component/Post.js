import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TextInput,TouchableOpacity } from 'react-native';
import { Header, Input, Button, Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob'

import * as firebase from 'firebase';
import 'firebase/storage';



  // Initialize Firebase

var options = {
  title: 'Select Avatar',
  customButtons: [
    {name: 'fb', title: 'Choose Photo from Facebook'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};


const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;


export default class Uploaded extends Component {
    constructor(){
        super()
        this.state = {
          images: [],
          selected:0
        }
      }




     uploadImages = () => {
       let promises = [];
       console.log('<======== Urls =========> ');

       for (let i = 0; i < this.state.images.length; i++) {
         promises.push(this.uploadSingleImage(this.state.images[i].image_uri, this.state.images[i].fileName))
       }
       Promise.all(promises)
       .then(results => {
           console.log("res========>",results)
         if(results.length){
            fetch('api', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                title:this.state.title,
                description:this.state.description,
                image1: results[0],
                image2: results[1],
                image3: results[2],
                category_id: 1
              })
            })
              .then((response) => response.json())
              .then((response) => {
              console.log("Images response============>",response)
              })
              .catch((err) => {
                  console.log(err)
              })
       })
       .catch(error => {
         console.log('images upload error: ', error);
       })
      }
    
    uploadSingleImage = (uri, fileName, mime = 'application/octet-stream') => {
      return new Promise((resolve, reject) => {
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
        let uploadBlob = null
    
        const imageRef = firebase.storage().ref('images').child(fileName);
        fs.readFile(uploadUri, 'base64')
          .then((data) => {
            return Blob.build(data, { type: `${mime};BASE64` })
          })
          .then((blob) => {
            uploadBlob = blob
            return imageRef.put(blob)
          })
           .then(() => {
           uploadBlob.close()
             return imageRef.getDownloadURL()
         })
          .then((url) => {
            resolve(url)
          })
          .catch((error) => {
            reject(error)
        })
      })
    }
    
    getImage = () => {
    
        ImagePicker.showImagePicker(options, (response) => {
        
    
          if (response.didCancel) {
            console.log('User cancelled image picker');
          }
          else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          }
          else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          }
          else {
            let source = { uri: response.uri };
            //    this.setState({image_uri: response.uri})
              //  this.setState({file:response.fileName})
              console.log("response==========>",response.fileName  ,"uri",response.uri)
            this.setState({ images: this.state.images.concat({
              path: response.path,
              image_uri: response.uri,
              fileName: response.fileName,
              }),
              selected: this.state.selected + 1
            })
          }
        });
      }
  render()
  {  
    return (
        <View style={styles.container}>
            <ScrollView>

            <Header
                placement="left"
                leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: 'CAMPUSGRUv', style: { color: '#fff' } }}
                rightComponent={{ icon: 'home', color: '#fff' }}
                />
            <View style={{ flexDirection: "row" }}>
                <Input style={{ width: '60%' }}
                    placeholder='Post Category'
                    rightIcon={<Image source={require('../Asset/left-arrow.png')} style={{ width: 15, height: 15, marginRight: 10 }} />}
                    />
            </View>

            <View style={{ backgroundColor: '#F4F4F4' }}>
                <View>
                    <Text style={{ color: "#C3C3C3", fontWeight: 'bold', marginTop: '4%', marginLeft: '5%', fontSize: 18 }}>POST IMAGE(add up to 3)</Text>

                </View>
                <View   style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={this.getImage}> 
                  {this.state.selected < 1 ?
                  <Image source={require('../Asset/Capture.jpg')} style={{ width: 90, height: 90, marginTop: '3%', marginLeft: '8%' }} />
                  :
                  <Image source={{ uri: this.state.images[0].image_uri }} style={{ width: 90, height: 90, marginTop: '3%', marginLeft: '8%' }} />
                  }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.getImage}>
                  {this.state.selected < 2 ?
                  <Image source={require('../Asset/Capture.jpg')} style={{ width: 90, height: 90, marginTop: '3%', marginLeft: '8%' }} />
                  :
                  <Image source={{ uri: this.state.images[1].image_uri }} style={{ width: 90, height: 90, marginTop: '3%', marginLeft: '8%' }} />
                  }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.getImage}>
                  {this.state.selected < 3 ?
                  <Image source={require('../Asset/Capture.jpg')} style={{ width: 90, height: 90, marginTop: '3%', marginLeft: '8%' }} />
                  :
                  <Image source={{ uri: this.state.images[2].image_uri }} style={{ width: 90, height: 90, marginTop: '3%', marginLeft: '8%' }} />
                  }
                  </TouchableOpacity>
                </View>

                <View>
                    <Text style={{ color: "#C3C3C3", fontWeight: 'bold', marginTop: '4%', marginLeft: '3%', fontSize: 18 }}>Post Title</Text>
                    <TextInput
                        underlineColorAndroid='transparent'
                        style={{ marginLeft: '2.5%', marginTop: '2%', textAlign: 'center', height: 50, borderWidth: 2, borderColor: '#FEFEFE', borderRadius: 10, backgroundColor: "#FEFEFE", width: '95%' }} />
                </View>


                <View>
                    <Text style={{ color: "#C3C3C3", fontWeight: 'bold', marginTop: '4%', marginLeft: '3%', fontSize: 18 }}>POST DESCRIPTION (option)</Text>
                    <TextInput underlineColorAndroid='transparent'
                        style={{ padding: 80, marginTop: '2%', textAlign: 'center', height: 50, borderWidth: 2, borderColor: '#FEFEFE', borderRadius: 10, backgroundColor: "#FEFEFE", width: '95%', marginLeft: 10 }} />
                </View>
            </View>

           
                  <Button containerStyle={{ width: 150, alignSelf: 'center', marginTop: 5 }}
                title="Post"
                type="solid"
                onPress={this.uploadImages}/>
</ScrollView>
        </View>
    )
}
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    slideContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    slide1: {
        backgroundColor: "rgba(20,20,200,0.3)"
    },
    slide2: {
        backgroundColor: "rgba(20,200,20,0.3)"
    },
    slide3: {
        backgroundColor: "rgba(200,20,20,0.3)"
    },
});
