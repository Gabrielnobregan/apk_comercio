import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function CadastrosScreen() {
  const [produtos, setProdutos] = useState<string[]>([]);
  const [empresas, setEmpresas] = useState<string[]>([]);
  const [novoProduto, setNovoProduto] = useState('');
  const [novaEmpresa, setNovaEmpresa] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const produtosData = await AsyncStorage.getItem('produtos');
      const empresasData = await AsyncStorage.getItem('empresas');
      if (produtosData) setProdutos(JSON.parse(produtosData));
      if (empresasData) setEmpresas(JSON.parse(empresasData));
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('produtos', JSON.stringify(produtos));
  }, [produtos]);

  useEffect(() => {
    AsyncStorage.setItem('empresas', JSON.stringify(empresas));
  }, [empresas]);

  const adicionarProduto = () => {
    if (novoProduto.trim()) {
      if (!produtos.includes(novoProduto.trim())) {
        setProdutos([...produtos, novoProduto.trim()]);
        setNovoProduto('');
      } else {
        Alert.alert('Erro', 'Produto já cadastrado.');
      }
    }
  };

  const adicionarEmpresa = () => {
    if (novaEmpresa.trim()) {
      if (!empresas.includes(novaEmpresa.trim())) {
        setEmpresas([...empresas, novaEmpresa.trim()]);
        setNovaEmpresa('');
      } else {
        Alert.alert('Erro', 'Empresa já cadastrada.');
      }
    }
  };

  const removerProduto = (produto: string) => {
    setProdutos(produtos.filter((p: string) => p !== produto));
  };

  const removerEmpresa = (empresa: string) => {
    setEmpresas(empresas.filter((e: string) => e !== empresa));
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Cadastros</ThemedText>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Produtos</ThemedText>
        <TextInput
          placeholder="Novo Produto"
          value={novoProduto}
          onChangeText={setNovoProduto}
          style={styles.input}
        />
        <TouchableOpacity onPress={adicionarProduto} style={styles.button}>
          <ThemedText style={styles.buttonText}>Adicionar Produto</ThemedText>
        </TouchableOpacity>
        <FlatList
          data={produtos}
          renderItem={({ item }: { item: string }) => (
            <ThemedView style={styles.item}>
              <ThemedText>{item}</ThemedText>
              <TouchableOpacity onPress={() => removerProduto(item)} style={styles.removeButton}>
                <ThemedText style={styles.removeText}>Remover</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
          keyExtractor={(item: string) => item}
          style={styles.list}
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Empresas</ThemedText>
        <TextInput
          placeholder="Nova Empresa"
          value={novaEmpresa}
          onChangeText={setNovaEmpresa}
          style={styles.input}
        />
        <TouchableOpacity onPress={adicionarEmpresa} style={styles.button}>
          <ThemedText style={styles.buttonText}>Adicionar Empresa</ThemedText>
        </TouchableOpacity>
        <FlatList
          data={empresas}
          renderItem={({ item }: { item: string }) => (
            <ThemedView style={styles.item}>
              <ThemedText>{item}</ThemedText>
              <TouchableOpacity onPress={() => removerEmpresa(item)} style={styles.removeButton}>
                <ThemedText style={styles.removeText}>Remover</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
          keyExtractor={(item: string) => item}
          style={styles.list}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
  button: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  list: {
    maxHeight: 200,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 4,
    borderRadius: 4,
  },
  removeText: {
    color: 'white',
    fontSize: 12,
  },
});