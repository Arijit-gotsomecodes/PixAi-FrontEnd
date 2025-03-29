import { View, Text, Image, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import GlobalApi from '../../services/GlobalApi';
import { FlatList } from 'react-native';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function AllUsersCreation() {

    const [pageSize, setPageSize] = useState(6);
    const [loading, setLoading] = useState(false);
    const [aiImageList, setAiImageList] = useState([]);
    const router = useRouter()

    const ColumnWidth = Dimensions.get('screen').width*0.87/2
    useEffect(()=>{
        setAiImageList([])
        GetAllAiImages(pageSize)
    },[])

    const GetAllAiImages=async(size)=>{
        setLoading(true)
        // setAiImageList([])
        const result = await GlobalApi.GetAllAiImages(size);
        // console.log(result.data.data)
        const resultData = result.data.data;

        resultData?.forEach(element=>{
            setAiImageList(prev=>[...prev,element])
        })
        setLoading(false)
    }

    const RenderFoot=()=>{
        if(loading)
        {
            return <ActivityIndicator size={'large'} color={Colors.PINKDARK}/>
        }
        return null;
    }

    const onImageCLickHandle=(item)=>{
        router.push({
            pathname:'viewAiImage',
            params:{
                imageUrl:item?.imageUrl,
                prompt: 'Hidden'
            }
        })
    }

  return (
    <View style={{
        marginTop: 20,
    }}>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold'
      }}>User's Creations</Text>
      <FlatList 
        data = {aiImageList}
        numColumns={2}
        onEndReached={()=>GetAllAiImages(pageSize+5)}
        onEndReachedThreshold={0.7}
        ListFooterComponent={RenderFoot}
        renderItem={({item,index})=>(
            <TouchableOpacity 
            onPress={()=>onImageCLickHandle(item)}
            style={{
                margin:5,
            }}>
                <Image source={{uri:item?.imageUrl}} 
                style={{
                    width: ColumnWidth,
                    height: 200,
                    borderRadius: 10,
                }}
                />
            </TouchableOpacity>
        )}
      />
    </View>
  )
}