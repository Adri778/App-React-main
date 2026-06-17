import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './Splash';
import Inicio from './Inicio';
import Produtos from './Produtos';
import Estoque from './Estoque';

const Pilha = createNativeStackNavigator();

export default function Aplicativo() {
  return (
    <NavigationContainer>
      <Pilha.Navigator screenOptions={{ headerShown: false }} initialRouteName="Inicio">
        <Pilha.Screen name="Splash" component={Splash} />
        <Pilha.Screen name="Inicio" component={Inicio} />
        <Pilha.Screen name="Produtos" component={Produtos} />
        <Pilha.Screen name="Estoque" component={Estoque} />
      </Pilha.Navigator>
    </NavigationContainer>
  );
}
