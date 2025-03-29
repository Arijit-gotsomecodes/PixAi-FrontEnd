import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React from 'react';

export default function TextInput_({ userInputValue }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{
        backgroundColor: '#fff', // Light theme background
        // padding: 15,
        borderRadius: 10,
      }}>
        <Text style={{
          marginBottom: 10,
          color: '#f535aa', // Primary color for text
          fontSize: 18,
          fontWeight: 'bold',
        }}>
          Enter Your Prompt
        </Text>
        <TextInput
          placeholder='Imagine With Text....'
          numberOfLines={5}
          multiline={true}
          textAlignVertical='top'
          onChangeText={userInputValue}
          style={{
            padding: 15,
            backgroundColor: '#ffe4e1', // Light pink background for input
            borderRadius: 15,
            borderColor: '#f535aa', // Primary color for border
            borderWidth: 1,
            color: '#f535aa', // Primary color for text
            fontSize: 16,
            minHeight: 200,
          }}
          placeholderTextColor='#f535aa' // Primary color for placeholder text
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss} // Hide keyboard when done is pressed
        />
      </View>
    </TouchableWithoutFeedback>
  );
}