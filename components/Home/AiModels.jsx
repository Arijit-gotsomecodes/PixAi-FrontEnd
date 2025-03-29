import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import GlobalApi from "../../services/GlobalApi";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";

export default function AiModels({ type }) {
  const [aiModelsList, setAiModelsList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    GetAiModels();
  }, []);

  const GetAiModels = async () => {
    const result = await GlobalApi.GetAiModels(type);
    setAiModelsList(result?.data.data || []);
  };

  const OnClickModel = (item) => {
    router.push({
      pathname: "FormInput",
      params: item,
    });
  };

  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        {type?.toUpperCase()}
      </Text>

      <FlatList
        data={aiModelsList}
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => OnClickModel(item)}
            style={{ marginRight: 15, position: "relative" }}
          >
            {/* AI Model Image */}
            <Image
              source={{ uri: item?.banner?.url }}
              style={{ width: 140, height: 180, borderRadius: 15 }}
            />

            {/* Blur effect for better text visibility */}
            <BlurView
              intensity={40}
              tint="dark"
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: 30,
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: 16,
                  textAlign: "center",
                  paddingHorizontal: 5,
                }}
              >
                {item.name}
              </Text>
            </BlurView>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
