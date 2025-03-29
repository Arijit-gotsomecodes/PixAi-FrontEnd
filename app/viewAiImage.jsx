import { View, Text, Image, TouchableOpacity, ToastAndroid,Platform, Alert,Share } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Colors from "../constants/Colors";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

export default function viewAiImage() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const [status,requestPermission] = MediaLibrary.usePermissions();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "View AI Image",
      headerBackTitle: "Go Back",
      headerTintColor: "#f535aa",
    });
  }, []);

  const downloadImage = async () => {
    //Permission
    try{  
      console.log("Status",status)
      if (!status?.granted) {
        const PermissionResp = await requestPermission();
        
        if (!PermissionResp?.granted) {
          if (Platform.OS === 'android') {
            ToastAndroid.show('Permission Not Granted', ToastAndroid.SHORT);
          } else {
            Alert.alert('Permission Denied', 'Please enable permissions in settings to continue.');
          }
          return;
        }
      }
      //Download Image
      const fileUri = FileSystem.documentDirectory+Date.now()+"_PixAi.png";
      const {uri} = await FileSystem.downloadAsync(params?.imageUrl,fileUri);
      //Save Image
      const asset = await MediaLibrary.createAssetAsync(uri)
      if (asset) {
        if (Platform.OS === 'android') {
          ToastAndroid.show('Image Downloaded Successfully', ToastAndroid.SHORT);
        } else {
          Alert.alert('Success', 'Image Downloaded Successfully');
        }
      }
      else{
        if (Platform.OS === 'android') {
          ToastAndroid.show('Image Download Failed', ToastAndroid.SHORT);
        } else {
          Alert.alert('Failed', 'Image Download Failed');
        }
      }

    }catch(e){

    }
  }

  const shareImage = async () => {
    try {
      if (!params?.imageUrl) {
        if (Platform.OS === "android") {
          ToastAndroid.show("No image to share", ToastAndroid.SHORT);
        } else {
          Alert.alert("Error", "No image available to share.");
        }
        return;
      }
  
      // Download image to a temporary location
      const fileUri = FileSystem.cacheDirectory + Date.now() + "_PixAi.png";
      const { uri } = await FileSystem.downloadAsync(params.imageUrl, fileUri);
  
      // Share the image
      await Share.share({
        url: uri, // For iOS
        message: `Check out this AI-generated image created by PixAI!`, // For Android
      });
  
    } catch (error) {
      console.error("Error sharing image:", error);
      if (Platform.OS === "android") {
        ToastAndroid.show("Failed to share image", ToastAndroid.SHORT);
      } else {
        Alert.alert("Error", "Failed to share image.");
      }
    }
  };

  return (
    <View
      style={{
        padding: 20,
        backgroundColor: '#fff', 
        height: '100%',
      }}
    >
      <Image
        source={{ uri: params?.imageUrl }}
        style={{
          width: '100%',
          height: 400,
          borderRadius: 15,
          borderWidth: 2,
          borderColor: '#f535aa', 
        }}
      />

      <Text style={{ marginVertical: 5, fontSize: 16, color: '#f535aa' }}> 
        PROMPT: {params?.prompt}
      </Text>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
          marginTop: 50,
        }}
      >
        <TouchableOpacity
          onPress={downloadImage}
          style={{
            padding: 15,
            backgroundColor: '#f535aa', 
            borderRadius: 10,
            width: '50%',
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontSize: 18 }}> 
            Download
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={shareImage}
          style={{
            padding: 15,
            backgroundColor: '#ffe4e1', 
            borderRadius: 10,
            width: '50%',
          }}
        >
          <Text style={{ color: '#f535aa', textAlign: 'center', fontSize: 18 }}> 
            Share
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={{ marginVertical: 5, fontSize: 15, color: '#f535aa' }}>
        NOTE: Image is only Available for 30 mins
      </Text>
    </View>
  );
}