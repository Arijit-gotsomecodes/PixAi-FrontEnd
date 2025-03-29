import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import React, { useCallback, useEffect } from "react";
import Colors from "./../../constants/Colors";
import * as WebBrowser from 'expo-web-browser';
import { useSSO } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  useWarmUpBrowser();
  const router = useRouter();
  const { startSSOFlow } = useSSO();

  const handleLogin = useCallback(async (strategy) => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace("/home");
      } else {
        console.warn("Sign-in requires additional steps.");
      }
    } catch (err) {
      console.error("Login error:", JSON.stringify(err, null, 2));
    }
  }, [router]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("./../../assets/images/login.png")}
        style={styles.image}
      >
        {/* Blurred Overlay with Gradient */}
        <View style={styles.overlayWrapper}>
          <LinearGradient
            colors={["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)"]}
            locations={[0, 0.4, 1]}
            style={styles.gradientOverlay}
          />
          <BlurView intensity={50} tint="light" style={styles.blurOverlay}>
            {/* Content Inside the Blurred View */}
            <View style={styles.overlayContent}>
              <Text style={styles.brandTitle}>Welcome to <Text style={{fontWeight: 800}}>Pix<Text style={styles.italicText}>AI</Text></Text></Text>
              <Text style={styles.subtitle}>Create AI images like never before.</Text>

              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => handleLogin('oauth_google')} style={styles.iconButton}>
                  <Image source={require("./../../assets/icons/google.png")} style={styles.iconGoogle} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleLogin('oauth_discord')} style={styles.iconButton}>
                  <Image source={require("./../../assets/icons/discord.png")} style={styles.iconGitHub} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleLogin('oauth_facebook')} style={styles.iconButton}>
                  <Image source={require("./../../assets/icons/facebook.png")} style={styles.iconGitHub} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleLogin('oauth_apple')} style={styles.iconButton}>
                  <Image source={require("./../../assets/icons/apple.png")} style={styles.iconApple} />
                </TouchableOpacity>
              </View>

              <Text style={styles.footerText}>
                By <Text style={{ fontWeight: 'bold' }}>registering</Text> you agree to our Terms & Conditions.
              </Text>
            </View>
          </BlurView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DARK,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    overflow: "hidden", // Ensures blur & gradient stay within bounds
  },
  gradientOverlay: {
    position: "absolute",
    top: -30, // Extends above the white border for smooth blending
    left: 0,
    right: 0,
    height: 30, // Covers the entire transition area
    zIndex: 1, // Places it above the blur
  },
  blurOverlay: {
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent for better blending
    padding: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    width: "100%",
    zIndex: 2, // Ensures blur is visible over gradient
  },
  overlayContent: {
    alignItems: "center",
    width: "100%",
  },
  brandTitle: {
    fontSize: 35,
    fontWeight: "bold",
    color: "black",
  },
  italicText: {
    fontStyle: 'italic',
    color: '#f535aa',
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginVertical: 5,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 20,
  },
  iconButton: {
    backgroundColor: "white",
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  iconGoogle: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  iconGitHub: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  iconApple: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    bottom: 2,
  },
  footerText: {
    textAlign: "center",
    marginTop: 20,
    color: Colors.GRAY,
    fontSize: 13,
  },
});

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();
