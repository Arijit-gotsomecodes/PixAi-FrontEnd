import { View, Text, FlatList, Image, Dimensions, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import GlobalApi from '../../services/GlobalApi';
import Colors from '../../constants/Colors';
import { useUser } from '@clerk/clerk-expo';

export default function Collection() {
    const [pageSize, setPageSize] = useState(5);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [aiImageList, setAiImageList] = useState([]);
    const [metaData, setMetaData] = useState(null);
    
    const router = useRouter();
    const { user } = useUser();
    const ColumnWidth = Dimensions.get('screen').width * 0.86 / 2;

    useEffect(() => {
        if (user) GetAllAiImages(5, true);
    }, [user]);

    const GetAllAiImages = async (size, isRefresh = false) => {
        if (!user || (metaData?.total <= aiImageList.length && !isRefresh)) return;

        if (isRefresh) {
            setRefreshing(true);
            setAiImageList([]); 
        } else {
            setLoading(true);
        }

        const result = await GlobalApi.GetUsersAiImages(size, user?.primaryEmailAddress?.emailAddress);
        const resultData = result.data.data;

        setMetaData(result.data.meta.pagination);
        setAiImageList(prev => [...prev, ...resultData]);

        setLoading(false);
        setRefreshing(false);
    };

    const RenderFooter = () => {
        return loading ? <ActivityIndicator size="large" color={Colors.PINK} style={{ marginVertical: 10 }} /> : null;
    };

    const onImageClickHandle = (item) => {
        router.push({
            pathname: 'viewAiImage',
            params: { imageUrl: item.imageUrl, prompt: 'Hidden' }
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 15 }}>
            <Text style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: '#E91E63',
                marginTop: 35,
                textAlign: 'center'
            }}>
                My Collection
            </Text>

            <FlatList
                data={aiImageList}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={() => GetAllAiImages(pageSize + 5)}
                onEndReachedThreshold={0.7}
                ListFooterComponent={RenderFooter}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => GetAllAiImages(5, true)}
                        colors={[Colors.PINK]}
                    />
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => onImageClickHandle(item)}
                        activeOpacity={0.8}
                        style={{ margin: 8, borderRadius: 15, overflow: 'hidden' }}>
                        <Image
                            source={{ uri: item?.imageUrl.replace('/upload', '/upload/c_limit,h_400,w_400') }}
                            style={{
                                width: ColumnWidth,
                                height: 250,
                                borderRadius: 15,
                                backgroundColor: '#f8f8f8'
                            }}
                        />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
