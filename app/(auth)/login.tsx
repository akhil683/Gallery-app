import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import { Alert, View, AppState, TouchableOpacity, TextInput, Text } from 'react-native';
import { useAuth } from '~/providers/AuthProvider';
import { supabase } from '~/utils/supabase';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  if (user) return <Redirect href={"/(tabs)"} />

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View className='p-5 flex min-h-screen justify-center items-center gap-3'>
      <Text className='text-white text-4xl mb-4'>Sign in to Your Account</Text>
      <TextInput
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="email@address.com"
        autoCapitalize={'none'}
        className='border w-full text-lg border-gray-600 p-4 rounded-2xl placeholder:text-gray-600 placeholder:bg-gray-200'
      />
      <TextInput
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
        placeholder="Password"
        autoCapitalize='none'
        className='border w-full text-lg border-gray-600 p-4 rounded-2xl placeholder:text-gray-600 placeholder:bg-gray-200'
      />

      <TouchableOpacity
        disabled={loading}
        onPress={() => signInWithEmail()}
        className='bg-orange-600 w-full p-4 rounded-2xl'
      >
        <Text className='text-white text-lg bg-orange-600 text-center'>
          Sign In
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={loading}
        onPress={() => signUpWithEmail()}
        className='bg-orange-600 p-4 w-full rounded-2xl'
      >
        <Text className='text-white text-lg bg-orange-600 text-center'>
          Register
        </Text>
      </TouchableOpacity>
    </View>
  )
}

