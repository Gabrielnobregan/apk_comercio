import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function NovosPedidosScreen() {
  return (
    <ThemedView style={styles.container} accessibilityLabel="Tela de Novos Pedidos">
      <ThemedText type="title" style={styles.title}>Novos Pedidos</ThemedText>
      <ThemedText>Esta é a tela de Novos Pedidos. Aqui você pode criar novos pedidos.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
  },
});