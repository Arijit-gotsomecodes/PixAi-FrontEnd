import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import GlobalApi from '../../services/GlobalApi'
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function AiFeaturedModel() {

    const [aiModelList, setAiModelList] = useState([]);
    useEffect(() => {
        GetAiModelFeaturedList();
    },[])

    const router = useRouter();

    const GetAiModelFeaturedList = async() =>{
        const result = await GlobalApi.GetFeaturedCategoryList();
        // console.log(result.data.data);
        setAiModelList(result.data.data)
    }
    const OnClickAiModel = (item) =>{ 
        router.push({
            pathname: 'FormInput',
            params: item
        })
    }   

  return (
    <View style={{
        marginTop: 20,
    }}>
      <Text style={{
        fontSize:22,
        fontWeight:'bold',
      }}>Featured</Text>

      <FlatList
        data={aiModelList}
        numColumns={4}
        style={{
            marginTop:5,
        }}
        renderItem={({item,index})=>(
            <TouchableOpacity onPress={()=>OnClickAiModel(item)} style={{
                flex:1,
                alignItems:'center',
            }}>
                <View style={{
                    padding: 10,
                    borderRadius: 8,
                    backgroundColor: '#fff8f9',
                    borderRadius: 10,
                    marginTop:10

                }}>
                    <Image source={{uri:item?.icon?.url}}
                    style={{
                        width: 35,
                        height: 35
                    }}
                    />
                </View>
                <Text style={{
                    fontSize: 12,
                    textAlign: 'center',
                    color: Colors.PRIMARY,
                    marginTop: 5,
                }}>{item?.name}</Text>

            </TouchableOpacity>
        )}
      />

    </View>
  )
}