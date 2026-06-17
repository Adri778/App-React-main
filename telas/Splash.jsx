import { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

export default function Splash({ navigation }) {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  useEffect(() => {
    if (!fontsLoaded) return;
    const timer = setTimeout(() => {
      navigation.replace('Inicio');
    }, 2500);
    return () => clearTimeout(timer);
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={estilos.container}>
      <Image source={require('../assets/splash-icon.png')} style={estilos.logo} />
      <Text style={estilos.nome}>Bom Preço</Text>
      <Text style={estilos.slogan}>Seu mercado na palma da mão</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E8B4A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  nome: {
    color: '#FFFFFF',
    fontSize: 36,
    fontFamily: 'Roboto_700Bold',
    letterSpacing: 1,
  },
  slogan: {
    color: '#C8F0D8',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    marginTop: 8,
  },
});
