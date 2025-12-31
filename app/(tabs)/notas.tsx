import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function NotasScreen() {
  return (
    <ThemedView style={styles.container} accessibilityLabel="Tela de Notas">
      <ThemedText type="title" style={styles.title}>Notas</ThemedText>
      <ThemedText>Esta é a tela de Notas. Aqui você pode gerenciar suas notas fiscais.</ThemedText>
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