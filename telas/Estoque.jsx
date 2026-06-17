import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { listarProdutos } from '../servicos/produtoServico';

export default function Estoque({ navigation }) {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    listarProdutos()
      .then(lista => setProdutos(
        [...lista].sort((a, b) => (a.quantidade ?? Infinity) - (b.quantidade ?? Infinity))
      ))
      .catch(() => {});
  }, []);

  const temBaixo = (p) => p.quantidade != null && p.estoqueMinimo != null && p.quantidade <= p.estoqueMinimo;
  const baixos = produtos.filter(temBaixo).length;

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F7F2' }}>

      <View style={{ backgroundColor: '#2E8B4A', paddingTop: 55, padding: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#FFF', fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Estoque</Text>
        <View style={{ width: 60 }} />
      </View>

      {baixos > 0 && (
        <View style={{ backgroundColor: '#FFF3E0', borderLeftWidth: 4, borderLeftColor: '#E53935', margin: 16, borderRadius: 8, padding: 12 }}>
          <Text style={{ color: '#B71C1C', fontWeight: 'bold', fontSize: 13 }}>
            ⚠ {baixos} produto{baixos > 1 ? 's' : ''} com estoque baixo
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {produtos.length === 0 && (
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>Nenhum produto encontrado.</Text>
        )}
        {produtos.map(item => {
          const baixo = temBaixo(item);
          const semEstoque = item.quantidade == null;
          return (
            <View key={item.id} style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderLeftWidth: baixo ? 4 : 0, borderLeftColor: '#E53935' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#222' }} numberOfLines={1}>{item.nome}</Text>
                {item.categoria ? <Text style={{ color: '#2E8B4A', fontSize: 12, marginTop: 3 }}>{item.categoria}</Text> : null}
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: baixo ? '#E53935' : '#2E8B4A' }}>{semEstoque ? '—' : item.quantidade}</Text>
                <Text style={{ fontSize: 11, color: '#999' }}>un.</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

    </View>
  );
}
