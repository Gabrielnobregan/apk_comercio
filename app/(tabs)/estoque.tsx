import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Image, Modal, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

interface ItemEstoque {
  id: string;
  nome: string;
  empresaResponsavel: string;
  dataCompra: string;
  dataRecebimento: string;
  quantidadeVeio: number;
  quantidadePedida: number;
  imagem?: string;
  notasFiscais: string[];
}

export default function EstoqueScreen() {
  const [estoque, setEstoque] = useState<ItemEstoque[]>([
    { id: '1', nome: 'Produto A', empresaResponsavel: 'Empresa X', dataCompra: '2023-10-01', dataRecebimento: '2023-10-05', quantidadeVeio: 10, quantidadePedida: 8, imagem: undefined, notasFiscais: [] },
    { id: '2', nome: 'Produto B', empresaResponsavel: 'Empresa Y', dataCompra: '2023-10-05', dataRecebimento: '2023-10-10', quantidadeVeio: 5, quantidadePedida: 5, imagem: undefined, notasFiscais: [] },
  ]);
  const [produtosCadastrados, setProdutosCadastrados] = useState<string[]>([]);
  const [empresasCadastradas, setEmpresasCadastradas] = useState<string[]>([]);
  const [sugestoesProdutos, setSugestoesProdutos] = useState<string[]>([]);
  const [sugestoesEmpresas, setSugestoesEmpresas] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemEstoque | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingItem, setViewingItem] = useState<ItemEstoque | null>(null);
  const [showDatePickerCompra, setShowDatePickerCompra] = useState(false);
  const [showDatePickerRecebimento, setShowDatePickerRecebimento] = useState(false);
  const [tempDateCompra, setTempDateCompra] = useState(new Date());
  const [tempDateRecebimento, setTempDateRecebimento] = useState(new Date());
  const [form, setForm] = useState({
    nome: '',
    empresaResponsavel: '',
    dataCompra: '',
    dataRecebimento: '',
    quantidadeVeio: '',
    quantidadePedida: '',
    imagem: '',
    notasFiscais: [] as string[],
  });

  useEffect(() => {
    const loadCadastros = async () => {
      const produtosData = await AsyncStorage.getItem('produtos');
      const empresasData = await AsyncStorage.getItem('empresas');
      if (produtosData) setProdutosCadastrados(JSON.parse(produtosData));
      if (empresasData) setEmpresasCadastradas(JSON.parse(empresasData));
    };
    loadCadastros();
  }, []);

  const openModal = (item?: ItemEstoque) => {
    if (item) {
      setEditingItem(item);
      setForm({
        nome: item.nome,
        empresaResponsavel: item.empresaResponsavel,
        dataCompra: item.dataCompra,
        dataRecebimento: item.dataRecebimento,
        quantidadeVeio: item.quantidadeVeio.toString(),
        quantidadePedida: item.quantidadePedida.toString(),
        imagem: item.imagem || '',
        notasFiscais: item.notasFiscais,
      });
      setTempDateCompra(new Date(item.dataCompra));
      setTempDateRecebimento(new Date(item.dataRecebimento));
    } else {
      setEditingItem(null);
      setForm({
        nome: '',
        empresaResponsavel: '',
        dataCompra: '',
        dataRecebimento: '',
        quantidadeVeio: '',
        quantidadePedida: '',
        imagem: '',
        notasFiscais: [],
      });
      setTempDateCompra(new Date());
      setTempDateRecebimento(new Date());
    }
    setModalVisible(true);
  };

  const openViewModal = (item: ItemEstoque) => {
    setViewingItem(item);
    setViewModalVisible(true);
  };

  const saveItem = () => {
    const newItem: ItemEstoque = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      nome: form.nome,
      empresaResponsavel: form.empresaResponsavel,
      dataCompra: form.dataCompra,
      dataRecebimento: form.dataRecebimento,
      quantidadeVeio: parseInt(form.quantidadeVeio) || 0,
      quantidadePedida: parseInt(form.quantidadePedida) || 0,
      imagem: form.imagem || undefined,
      notasFiscais: form.notasFiscais,
    };

    if (editingItem) {
      setEstoque(estoque.map(item => item.id === editingItem.id ? newItem : item));
    } else {
      setEstoque([...estoque, newItem]);
    }
    setModalVisible(false);
  };

  const onChangeDateCompra = (event: any, selectedDate?: Date) => {
    setShowDatePickerCompra(Platform.OS === 'ios');
    if (selectedDate) {
      setTempDateCompra(selectedDate);
      setForm({ ...form, dataCompra: selectedDate.toISOString().split('T')[0] });
    }
  };

  const onChangeDateRecebimento = (event: any, selectedDate?: Date) => {
    setShowDatePickerRecebimento(Platform.OS === 'ios');
    if (selectedDate) {
      setTempDateRecebimento(selectedDate);
      setForm({ ...form, dataRecebimento: selectedDate.toISOString().split('T')[0] });
    }
  };

  const filtrarProdutos = (texto: string) => {
    if (texto.length > 0) {
      const filtrados = produtosCadastrados.filter(p => p.toLowerCase().startsWith(texto.toLowerCase()));
      setSugestoesProdutos(filtrados);
    } else {
      setSugestoesProdutos([]);
    }
  };

  const filtrarEmpresas = (texto: string) => {
    if (texto.length > 0) {
      const filtrados = empresasCadastradas.filter(e => e.toLowerCase().startsWith(texto.toLowerCase()));
      setSugestoesEmpresas(filtrados);
    } else {
      setSugestoesEmpresas([]);
    }
  };

  const selecionarProduto = (produto: string) => {
    setForm({ ...form, nome: produto });
    setSugestoesProdutos([]);
  };

  const selecionarEmpresa = (empresa: string) => {
    setForm({ ...form, empresaResponsavel: empresa });
    setSugestoesEmpresas([]);
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permissão necessária', 'Permissão para acessar a galeria é necessária.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        const fileName = uri.split('/').pop() || 'image.jpg';
        const newUri = `${FileSystem.documentDirectory}images/${fileName}`; // eslint-disable-line import/namespace
        await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}images/`, { intermediates: true }); // eslint-disable-line import/namespace
        await FileSystem.copyAsync({ from: uri, to: newUri });
        setForm({ ...form, imagem: newUri });
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });
      if ((result as any).type === 'success') {
        const uri = (result as any).uri;
        const fileName = uri.split('/').pop();
        const newUri = `${(FileSystem as any).documentDirectory}notas-fiscais/${fileName}`;
        await FileSystem.makeDirectoryAsync(`${(FileSystem as any).documentDirectory}notas-fiscais/`, { intermediates: true });
        await FileSystem.copyAsync({ from: uri, to: newUri });
        setForm({ ...form, notasFiscais: [...form.notasFiscais, newUri] });
      }
    } catch (err) {
      console.error('Erro ao selecionar documento:', err);
    }
  };

  const removeDocument = (uri: string) => {
    setForm({ ...form, notasFiscais: form.notasFiscais.filter(doc => doc !== uri) });
  };

  const deleteItem = (id: string) => {
    Alert.alert('Confirmar', 'Deseja excluir este item?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: () => setEstoque(estoque.filter(item => item.id !== id)) },
    ]);
  };

  const renderItem = ({ item }: { item: ItemEstoque }) => (
    <ThemedView style={styles.itemContainer}>
      <TouchableOpacity onPress={() => openViewModal(item)} style={styles.itemContent} accessibilityLabel={`Ver detalhes de ${item.nome}`}>
        <ThemedView style={styles.imageContainer}>
          {item.imagem ? (
            <Image source={{ uri: item.imagem }} style={styles.image} />
          ) : (
            <ThemedView style={styles.imagePlaceholder}>
              <IconSymbol size={24} name="photo" color="#ccc" />
            </ThemedView>
          )}
        </ThemedView>
        <ThemedView style={styles.itemText}>
          <ThemedText type="subtitle">{item.nome}</ThemedText>
          <ThemedText>Empresa: {item.empresaResponsavel}</ThemedText>
          <ThemedText>Quantidade: {item.quantidadeVeio}</ThemedText>
        </ThemedView>
        <TouchableOpacity onPress={() => openModal(item)} style={styles.editIcon}>
          <IconSymbol size={20} name="pencil" color="#007AFF" />
        </TouchableOpacity>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteIcon} accessibilityLabel="Excluir produto">
        <IconSymbol size={20} name="trash.fill" color="#FF3B30" />
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Estoque</ThemedText>
      {estoque.length === 0 ? (
        <ThemedText style={styles.empty}>Nenhum produto em estoque.</ThemedText>
      ) : (
        <FlatList
          data={estoque}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
      <TouchableOpacity onPress={() => openModal()} style={styles.addButton} accessibilityLabel="Adicionar produto">
        <ThemedText style={styles.addText}>+ Adicionar Produto</ThemedText>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <ThemedView style={styles.modalContainer}>
          <ThemedText type="title">Editar Produto</ThemedText>
          <TextInput placeholder="Nome do Produto" value={form.nome} onChangeText={(text) => { setForm({ ...form, nome: text }); filtrarProdutos(text); }} style={styles.input} />
          {sugestoesProdutos.length > 0 && (
            <FlatList
              data={sugestoesProdutos}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selecionarProduto(item)} style={styles.suggestion}>
                  <ThemedText>{item}</ThemedText>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              style={styles.suggestionsList}
            />
          )}
          <TextInput placeholder="Empresa Responsável" value={form.empresaResponsavel} onChangeText={(text) => { setForm({ ...form, empresaResponsavel: text }); filtrarEmpresas(text); }} style={styles.input} />
          {sugestoesEmpresas.length > 0 && (
            <FlatList
              data={sugestoesEmpresas}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selecionarEmpresa(item)} style={styles.suggestion}>
                  <ThemedText>{item}</ThemedText>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              style={styles.suggestionsList}
            />
          )}
          <TouchableOpacity onPress={() => setShowDatePickerCompra(true)} style={styles.input}>
            <ThemedText>Data de Compra: {form.dataCompra || 'Selecionar'}</ThemedText>
          </TouchableOpacity>
          {showDatePickerCompra && (
            <DateTimePicker
              value={tempDateCompra}
              mode="date"
              display="default"
              onChange={onChangeDateCompra}
            />
          )}
          <TouchableOpacity onPress={() => setShowDatePickerRecebimento(true)} style={styles.input}>
            <ThemedText>Data de Recebimento: {form.dataRecebimento || 'Selecionar'}</ThemedText>
          </TouchableOpacity>
          {showDatePickerRecebimento && (
            <DateTimePicker
              value={tempDateRecebimento}
              mode="date"
              display="default"
              onChange={onChangeDateRecebimento}
            />
          )}
          <TextInput placeholder="Quantidade que Veio" value={form.quantidadeVeio} onChangeText={(text) => setForm({ ...form, quantidadeVeio: text })} keyboardType="numeric" style={styles.input} />
          <TextInput placeholder="Quantidade Pedida" value={form.quantidadePedida} onChangeText={(text) => setForm({ ...form, quantidadePedida: text })} keyboardType="numeric" style={styles.input} />
          <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
            <ThemedText>Selecionar Imagem</ThemedText>
          </TouchableOpacity>
          {form.imagem && <Image source={{ uri: form.imagem }} style={styles.previewImage} />}
          <TouchableOpacity onPress={pickDocument} style={styles.imageButton}>
            <ThemedText>Adicionar Nota Fiscal</ThemedText>
          </TouchableOpacity>
          {form.notasFiscais.map((uri, index) => (
            <ThemedView key={index} style={styles.documentItem}>
              <ThemedText>{uri.split('/').pop()}</ThemedText>
              <TouchableOpacity onPress={() => removeDocument(uri)} style={styles.removeButton}>
                <ThemedText style={styles.removeText}>Remover</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          ))}
          <Button title="Salvar" onPress={saveItem} />
          <Button title="Cancelar" onPress={() => setModalVisible(false)} />
        </ThemedView>
      </Modal>

      <Modal visible={viewModalVisible} animationType="slide">
        <ThemedView style={styles.modalContainer}>
          <ThemedText type="title">Detalhes do Produto</ThemedText>
          {viewingItem && (
            <>
              <ThemedText>Nome: {viewingItem.nome}</ThemedText>
              <ThemedText>Empresa Responsável: {viewingItem.empresaResponsavel}</ThemedText>
              <ThemedText>Data de Compra: {viewingItem.dataCompra}</ThemedText>
              <ThemedText>Data de Recebimento: {viewingItem.dataRecebimento}</ThemedText>
              <ThemedText>Quantidade que Veio: {viewingItem.quantidadeVeio}</ThemedText>
              <ThemedText>Quantidade Pedida: {viewingItem.quantidadePedida}</ThemedText>
              {viewingItem.imagem && (
                <Image source={{ uri: viewingItem.imagem }} style={styles.detailImage} />
              )}
              <ThemedText>Notas Fiscais:</ThemedText>
              {viewingItem.notasFiscais.length > 0 ? (
                viewingItem.notasFiscais.map((nota, index) => (
                  <ThemedText key={index}>{nota}</ThemedText>
                ))
              ) : (
                <ThemedText>Nenhuma nota fiscal anexada.</ThemedText>
              )}
            </>
          )}
          <Button title="Fechar" onPress={() => setViewModalVisible(false)} />
        </ThemedView>
      </Modal>
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
  empty: {
    textAlign: 'center',
    marginTop: 50,
  },
  list: {
    paddingBottom: 80,
  },
  itemContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    marginLeft: 8,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    marginLeft: 8,
  },
  deleteIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 50,
  },
  addText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 4,
    borderRadius: 4,
  },
  imageButton: {
    backgroundColor: '#ddd',
    padding: 8,
    marginVertical: 4,
    borderRadius: 4,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginVertical: 8,
  },
  documentItem: {
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
  suggestionsList: {
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginVertical: 4,
  },
  suggestion: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailImage: {
    width: 200,
    height: 200,
    marginVertical: 16,
    alignSelf: 'center',
  },
});
