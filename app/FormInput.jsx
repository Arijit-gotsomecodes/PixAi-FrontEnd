// 
//  DONST FORGET TO CHAGE UR CLUDINARY CLOUD NAME AND UPLOAD PRESET
// 
//
import { View, Text, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import Colors from './../constants/Colors'
import TextInput_ from './../components/FormInput/TextInput_'
import ImageUploadComponent from './../components/FormInput/ImageUploadComponent'
import GlobalApi from '../services/GlobalApi'
import { Cloudinary } from '@cloudinary/url-gen';
import { upload } from 'cloudinary-react-native'
import { UserDetailContext } from './../context/UserDetailContext'
import { Alert, Platform } from 'react-native';

export default function FormInput() {
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const [aiModel, setAiModel] = useState();
    const [userInput, setUserInput] = useState();
    const [userImage, setUserImage] = useState();
    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState();
    const router = useRouter();

    const { userDetail, setUserDetail } = useContext(UserDetailContext)

    useEffect(() => {
        // console.log("Params:", params);
        setAiModel(params)
        navigation.setOptions({
          headerShown: true,
          headerTitle: params?.name,
          headerStyle: { backgroundColor: "#f535aa" }, // Change header background color
          headerTintColor: "#ffffff", // Change text/icon color
          headerTitleStyle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
          headerBackTitle: "Go Back", // Set back button text
          headerBackTitleStyle: { color: "#ffcc00" }
      });
      
    }, [])


    const OnGenerate = async () => {
        // console.log("aiModel", aiModel)
        if (userDetail.credits <= 0) {
          if (Platform.OS === 'android') {
              ToastAndroid.show('You don’t have enough credits', ToastAndroid.LONG);
          } else {
              Alert.alert('Insufficient Credits', 'You don’t have enough credits');
          }
          return;
      }

        if (!aiModel?.userImageUpload || aiModel?.userImageUpload == 'false' || aiModel?.userImageUpload == false) {
            TextToImage();
        }
        else {
            ImageToAiImage()
        }



    }

    const TextToImage = async () => {
        setLoading(true)
        const data = {
            aiModelName: aiModel?.aiModelName,
            inputPrompt: userInput,
            defaultPrompt: aiModel?.defaultPrompt,
        }

        console.log("-----", data);

        try {
            const result = await GlobalApi.AIGenerateImage(data);
            const AIImage = result.data.result[0] ? result.data.result[0] : result.data.result;
            console.log("Image", AIImage);

            // To Update User Credits
            UpdateUserCredits();

            UploadImageAndSave(AIImage);

        }
        catch (e) {
            setLoading(false);
            console.log(e)
        }
    }

    const ImageToAiImage = async () => {
        setLoading(true)
        //Upload the Image to Cloudinary
        const cld = new Cloudinary({
            cloud: {
                cloudName: 'dvytn4u6i'
            },
            url: {
                secure: true
            }
        });

        const options = {
            upload_preset: 'uzasy1rr',
            unsigned: true,
        }

        await upload(cld, {
            file: userImage, options: options, callback: async (error, response) => {
                //.. handle response
                console.log(response?.url)
                //Generate AI Image
                const data = {
                    defaultPrompt: aiModel?.defaultPrompt,
                    userImageUrl: response?.url,
                    aiModelName: aiModel?.aiModelName
                }
                UpdateUserCredits();
                const result = await GlobalApi.AIGenerateImage(data);
                console.log("AI Image", result.data.result);
                const AIImage = result.data.result;
                router.push({
                    pathname: 'viewAiImage',
                    params: {
                        imageUrl: AIImage,
                        prompt: aiModel?.name
                    }
                })
                setLoading(false)
            }
        })


    }

    const UploadImageAndSave = async (AIImage) => {

        //Upload the Image to Clodinary Storage
        //Upload the Image to Cloudinary
        const cld = new Cloudinary({
            cloud: {
                cloudName: 'dvytn4u6i'
            },
            url: {
                secure: true
            }
        });

        const options = {
            upload_preset: 'uzasy1rr',
            unsigned: true,
        }

        await upload(cld, {
            file: AIImage, options: options, callback: async (error, response) => {
                //.. handle response
                console.log(response?.url)
                // Save generated image URL
                const SaveImageData = {
                    imageUrl: response?.url,
                    userEmail: userDetail?.userEmail
                }
                const SaveImageResult = await GlobalApi.AddAiImageRecord(SaveImageData);
                console.log(SaveImageResult.data.data);
                setLoading(false);
                router.replace({
                    pathname: 'viewAiImage',
                    params: {
                        imageUrl: AIImage,
                        prompt: userInput
                    }
                })
            }
        })
    }




    const UpdateUserCredits = async () => {
        // To Update User Credits
        const updatedResult = await GlobalApi.UpdateUserCredits(
            userDetail?.documentId,
            { credits: Number(userDetail?.credits) - 1 });

        setUserDetail(updatedResult?.data.data);
    }

    return (
      <View
      style={{
        padding: 20,
        backgroundColor: "#fff", // Light theme background
        height: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 35,
          fontWeight: "bold",
          color: "#f535aa", // Primary color for text
          marginTop: 15,
        }}
      >
        {aiModel?.name}
      </Text>
      <View>
        {/* Tex input */}
        {String(aiModel?.userImageUpload) !== "true"   ? (
          <TextInput_ userInputValue={(value) => setUserInput(value)} />
        ) : (
          <ImageUploadComponent
            uploadedImage={(value) => setUserImage(value)}
          />
        )}
        <Text
          style={{
            color: "#f535aa", // Primary color for note text
            marginVertical: 5,
          }}
        >
          NOTE: 1 Credit will be used to generate image
        </Text>

        <TouchableOpacity
          onPress={() => OnGenerate()}
          disabled={loading}
          style={{
            padding: 20,
            backgroundColor: "#f535aa", // Primary color for button
            borderRadius: 15,
            marginVertical: 15,
            width: "100%",
            marginVertical: 30,
          }}
        >
          {loading ? (
            <ActivityIndicator size={"large"} color={"#fff"} />
          ) : (
            <Text
              style={{
                textAlign: "center",
                color: "#fff", // Light theme text color for button
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              Generate
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>

    )
}