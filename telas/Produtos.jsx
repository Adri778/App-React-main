  import React, { useEffect, useState } from 'react';
  import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
  import { WebView } from 'react-native-webview';
  import { listarProdutos } from '../servicos/produtoServico';
  import { URL_CADASTRO } from '../servicos/api';

  export default function Produtos({ navigation }) {
    const [produtos, setProdutos] = useState([]);
    const [showWebView, setShowWebView] = useState(false);
    const [loadingWeb, setLoadingWeb] = useState(true);

    const carregarProdutos = () => {
      listarProdutos()
        .then(setProdutos)
        .catch((err) => console.log("Erro ao buscar produtos:", err));
    };

    useEffect(() => {
      carregarProdutos();
    }, []);

    const fecharCadastro = () => {
      setShowWebView(false);
      carregarProdutos();
    };

    // Se o usuário clicou no "+", renderiza a WebView ocupando a tela inteira
    if (showWebView) {
      return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
          <View style={[styles.header, { paddingTop: 55 }]}>
            <TouchableOpacity onPress={fecharCadastro}>
              <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>✕ Fechar</Text>
            </TouchableOpacity>
            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Cadastrar Produto</Text>
            <View style={{ width: 60 }} />
          </View>

          {loadingWeb && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2E8B4A" />
              <Text style={{ marginTop: 10, color: '#666' }}>Carregando formulário...</Text>
            </View>
          )}

          <WebView 
            source={{ uri: URL_CADASTRO }} 
            style={{ flex: 1 }}
            onLoadStart={() => setLoadingWeb(true)}
            onLoadEnd={() => setLoadingWeb(false)}
            scalesPageToFit={false}
            bounces={false}
          />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#F0F7F2' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: '#FFF', fontSize: 15 }}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Produtos</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {produtos.length === 0 && (
            <Text style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>
              Nenhum produto cadastrado.
            </Text>
          )}
          {produtos.map(item => {
            const temEstoque = item.quantidade != null;
            const baixo = temEstoque && item.estoqueMinimo != null && item.quantidade <= item.estoqueMinimo;
            return (
              <View key={item.id} style={styles.cardProduto}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }} numberOfLines={1}>{item.nome}</Text>
                <Text style={{ color: '#666', marginTop: 3 }}>
                  R$ {item.preco != null ? item.preco.toFixed(2) : '--'}
                  {temEstoque ? `  ·  Estoque: ${item.quantidade}` : ''}
                </Text>
                {baixo && (
                  <Text style={{ color: '#E53935', marginTop: 4 }}>⚠ Estoque baixo</Text>
                )}
              </View>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          onPress={() => setShowWebView(true)}
          style={styles.fab}
        >
          <Text style={{ color: '#FFF', fontSize: 30 }}>+</Text>
        </TouchableOpacity>

      </View>
    );
  }

  // Estilos organizados para manter o código limpo
  const styles = StyleSheet.create({
    header: {
      backgroundColor: '#2E8B4A', 
      paddingTop: 55, 
      padding: 20, 
      flexDirection: 'row', 
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    cardProduto: {
      backgroundColor: '#FFF', 
      borderRadius: 12, 
      padding: 16, 
      marginBottom: 10,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2
    },
    fab: {
      position: 'absolute', 
      right: 24, 
      bottom: 32, 
      width: 56, 
      height: 56, 
      borderRadius: 28, 
      backgroundColor: '#2E8B4A', 
      alignItems: 'center', 
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5
    },
    loadingContainer: {
      position: 'absolute',
      top: 115, // Desconta o tamanho do header para o loading não cobrir o botão fechar
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFF',
      zIndex: 10
    }
  });