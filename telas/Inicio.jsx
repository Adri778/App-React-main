import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { useFocusEffect } from '@react-navigation/native';
import BASE_URL from '../servicos/api';
import { listarProdutos } from '../servicos/produtoServico';

export default function Inicio({ navigation }) {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  const [resumo, setResumo] = useState({ produtos: '-', estoqueBaixo: '-' });

  useFocusEffect(
    useCallback(() => {
      fetch(`${BASE_URL}/resumo`)
        .then(r => (r.ok ? r.json() : Promise.reject()))
        .then(setResumo)
        .catch(() => {
          // Backend do site não expõe /resumo: deriva o resumo da lista de produtos.
          listarProdutos()
            .then(lista => setResumo({
              produtos: lista.length,
              estoqueBaixo: lista.filter(
                p => p.quantidade != null && p.estoqueMinimo != null && p.quantidade <= p.estoqueMinimo
              ).length,
            }))
            .catch(() => {});
        });
    }, [])
  );

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={estilos.scroll}>

      <View style={estilos.cabecalho}>
        <Image source={require('../assets/icon.png')} style={estilos.logo} />
        <View>
          <Text style={estilos.titulo}>Bom Preço</Text>
          <Text style={estilos.subtitulo}>Painel de Controle</Text>
        </View>
      </View>

      <View style={estilos.secao}>
        <Text style={estilos.secaoTitulo}>Resumo</Text>
        <View style={estilos.filhaResumo}>
          <View style={[estilos.cartaoResumo, { borderLeftColor: '#2E8B4A' }]}>
            <Text style={estilos.resumoNumero}>{resumo.produtos}</Text>
            <Text style={estilos.resumoLabel}>Produtos</Text>
          </View>
          <View style={[estilos.cartaoResumo, { borderLeftColor: '#E53935' }]}>
            <Text style={estilos.resumoNumero}>{resumo.estoqueBaixo}</Text>
            <Text style={estilos.resumoLabel}>Estoque Baixo</Text>
          </View>
        </View>
      </View>

      <View style={estilos.secao}>
        <Text style={estilos.secaoTitulo}>Menu</Text>
        <View style={estilos.grade}>

          <TouchableOpacity style={estilos.botao} onPress={() => navigation.navigate('Produtos')}>
            <Text style={estilos.botaoIcone}>📦</Text>
            <Text style={estilos.botaoTexto}>Produtos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.botao} onPress={() => navigation.navigate('Estoque')}>
            <Text style={estilos.botaoIcone}>🏷️</Text>
            <Text style={estilos.botaoTexto}>Estoque</Text>
          </TouchableOpacity>


</View>
      </View>

    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#F0F7F2',
  },
  cabecalho: {
    backgroundColor: '#2E8B4A',
    paddingTop: 55,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logo: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
    borderRadius: 24,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Roboto_700Bold',
  },
  subtitulo: {
    color: '#C8F0D8',
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
  },
  secao: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  secaoTitulo: {
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    color: '#1B5E35',
    marginBottom: 12,
  },
  filhaResumo: {
    flexDirection: 'row',
    gap: 10,
  },
  cartaoResumo: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    elevation: 2,
  },
  resumoNumero: {
    fontSize: 24,
    fontFamily: 'Roboto_700Bold',
    color: '#222',
  },
  resumoLabel: {
    fontSize: 11,
    fontFamily: 'Roboto_400Regular',
    color: '#777',
    marginTop: 2,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  botao: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    elevation: 2,
  },
  botaoIcone: {
    fontSize: 32,
    marginBottom: 8,
  },
  botaoTexto: {
    fontSize: 14,
    fontFamily: 'Roboto_700Bold',
    color: '#1B5E35',
  },
});
