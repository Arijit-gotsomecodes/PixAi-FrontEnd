import { View, FlatList } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Banner from "../../components/Home/Banner";
import AiFeaturedModel from "../../components/Home/AiFeaturedModel";
import AiModels from "../../components/Home/AiModels";
import AllUsersCreation from "../../components/Home/AllUsersCreation";

export default function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Sticky Header */}
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, marginBottom: 10 }}>
        <Header />
      </View>

      <FlatList
        data={[1]}
        style={{
          padding: 15,
          marginTop: 70, // Adjust to avoid overlap with the header
        }}
        nestedScrollEnabled={true}
        renderItem={({ item }) => (
          <View>
            {/* banner */}
            <Banner />
            {/* featured */}
            <AiFeaturedModel />
            {/* AI models (Avatar) */}
            <AiModels type={"avatar"} />
            {/* AI models (Style) */}
            <AiModels type={"style"} />
            {/* user Creation */}
            <AllUsersCreation />

            <View style={{ height: 90 }}></View>
          </View>
        )}
      />
    </View>
  );
}
