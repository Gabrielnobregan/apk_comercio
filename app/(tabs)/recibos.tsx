import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function RecibosScreen() {
  return (
    <ThemedView style={styles.container} accessibilityLabel="Tela de Recibos">
      <ThemedText type="title" style={styles.title}>Recibos</ThemedText>
      <ThemedText>Esta é a tela de Recibos. Aqui você pode visualizar seus recibos.</ThemedText>
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