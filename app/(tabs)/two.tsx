import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '~/providers/AuthProvider';
import { supabase } from '~/utils/supabase';

export default function Home() {
  const { user } = useAuth()
  return (
    <View className='min-h-screen flex justify-center items-center bg-black'>
      <View>
        <Text className='text-white mb-4'>{user?.email}</Text>
        <TouchableOpacity className='py-3 rounded-2xl bg-white px-6' onPress={() => supabase.auth.signOut()}>
          <Text>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
