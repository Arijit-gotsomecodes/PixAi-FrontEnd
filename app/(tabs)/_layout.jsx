import { View, Text } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useUser } from '@clerk/clerk-expo';
import { UserDetailContext } from '../../context/UserDetailContext';
import GlobalApi from '../../services/GlobalApi';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  const { user } = useUser();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  useEffect(() => {
    if (user) {
      verifyUser();
    }
  }, [user]);

  const verifyUser = async () => {
    const result = await GlobalApi.GetUserInfo(user?.primaryEmailAddress?.emailAddress);
    console.log(result.data.data);

    if (result.data.data.length !== 0) {
      setUserDetail(result.data.data[0]);
      return;
    }
    try {
      const data = {
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName
      };
      const result = await GlobalApi.CreateNewUser(data);
      console.log(result?.data.data);
      setUserDetail(result.data.data[0]);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ff4081',
        tabBarInactiveTintColor: '#ffb6c1',
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: { paddingBottom: 1, marginTop: 10 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Collection',
          tabBarIcon: ({ color }) => (
            <Ionicons name="folder-open" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-astronaut" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    height: 75,
    borderRadius: 40,
    borderTopWidth: 0,
    paddingVertical: 8,
    marginHorizontal: 15,
    bottom: 15, // Moved upwards

    shadowColor: 'black',
    shadowOffset: { width: 6, height: 10 }, // Increased left and bottom shadow
    shadowOpacity: 0.8, // Intensified shadow
    shadowRadius: 20,
    elevation: 15, // Higher elevation for a stronger shadow on Android
  },
});