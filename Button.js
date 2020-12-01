import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'

export default function Button({ scheduleNotification, title }) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'blue',
        height: 40,
        width: '95%',
        borderRadius: 20,
        marginBottom: 20

      }}
      onPress={async () => {
        await scheduleNotification();
      }}
    >
      <Text style={{
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        textAlignVertical: 'center'
      }}>{title}</Text>
    </TouchableOpacity>
  )
}
