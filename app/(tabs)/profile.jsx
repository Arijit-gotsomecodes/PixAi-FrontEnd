import { View, Text, Image, FlatList, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

const Colors = {
  PRIMARY: '#E91E63',
  LIGHT_PRIMARY: '#F8BBD0',
  GRAY: '#757575',
  WHITE: '#FFFFFF',
};

export default function Profile() {
  const Menu = [
    { id: 1, name: 'Create AI Image', icon: 'add-circle', path: '/home' },
    { id: 5, name: 'My Collection', icon: 'bookmark', path: '/collection' },
    { id: 6, name: 'Buy More Credits', icon: 'diamond', path: 'url' },
    { id: 4, name: 'Logout', icon: 'exit', path: 'logout' }
  ];

  const { user } = useUser();
  const router = useRouter();
  const { signOut } = useAuth();

  const onPressMenu = (menu) => {
    if (menu.path === 'logout') {
      signOut();
      router.replace('/../login');
      return;
    } else if (menu?.path === 'url') {
      Linking.openURL('https://github.com/Arijit-gotsomecodes');  // Doscord Server Link
      return;
    }
    router.push(menu.path);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <View style={{
        flex: 1,
        padding: 20,
        backgroundColor: Colors.WHITE,
      }}>
        <Text style={{
          fontFamily: 'outfit-medium',
          fontSize: 30,
          color: Colors.PRIMARY,
          textAlign: 'center',
        }}>Profile</Text>

        <View style={{
          alignItems: 'center',
          marginVertical: 25,
        }}>
          <Image source={{ uri: user?.imageUrl }} style={{
            width: 90,
            height: 90,
            borderRadius: 99,
            borderWidth: 3,
            borderColor: Colors.PRIMARY,
          }} />

          <Text style={{
            fontFamily: 'outfit-bold',
            fontSize: 22,
            marginTop: 6,
            color: Colors.PRIMARY,
          }}>{user?.fullName}</Text>
          <Text style={{
            fontFamily: 'outfit',
            fontSize: 16,
            color: Colors.GRAY,
          }}>{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>

        <FlatList
          data={Menu}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onPressMenu(item)}
              key={item.id}
              style={{
                marginVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                backgroundColor: Colors.WHITE,
                padding: 15,
                borderRadius: 12,
                shadowColor: Colors.PRIMARY,
                shadowOpacity: 0.2,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 5,
                elevation: 5,
              }}>
              <Ionicons name={item?.icon} size={30} color={Colors.PRIMARY} style={{
                padding: 10,
                backgroundColor: Colors.LIGHT_PRIMARY,
                borderRadius: 10,
              }} />
              <Text style={{
                fontFamily: 'outfit',
                fontSize: 20,
                color: Colors.PRIMARY,
              }}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
