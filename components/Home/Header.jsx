import { View, Text, Image } from "react-native";
import React, { useContext } from "react";
import Colors from "./../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { UserDetailContext } from "../../context/UserDetailContext";
import { BlurView } from "expo-blur";

export default function Header() {
  const { user } = useUser();
  const { userDetail } = useContext(UserDetailContext);

  return (
    <View
      style={{
        marginTop: 30,
        borderRadius: 30,
        overflow: "hidden", // Ensures BlurView does not exceed border radius
      }}
    >
      <BlurView
        intensity={50}
        tint="light"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 15,
          borderRadius: 30, // Needed to match the outer container
        }}
      >
        <Text
          style={{ fontSize: 30, color: Colors.PRIMARY, fontWeight: "900" }}
        >
          Pix<Text style={{ fontStyle: "italic", color: "#f535aa" }}>Ai</Text>
        </Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              borderWidth: 3,
              borderRadius: 99,
              paddingHorizontal: 5,
              borderColor: "#f535aa",
              backgroundColor: "#ffe9ec",
            }}
          >
            <Image
              source={require("./../../assets/icons/coin.png")}
              style={{ width: 27, height: 27 }}
            />
            <Text style={{ color: "#f535aa", fontSize: 18, fontWeight: "800" }}>
              {userDetail?.credits}
            </Text>
          </View>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 99,
              borderWidth: 3,
              borderColor: "#f535aa",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={{ uri: user?.imageUrl }}
              style={{ width: 38, height: 38, borderRadius: 99 }}
            />
          </View>
        </View>
      </BlurView>
    </View>
  );
}
