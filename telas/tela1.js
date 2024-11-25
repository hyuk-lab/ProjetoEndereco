import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

export default function ListarUsuarios({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const listarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://26.215.35.92:3000/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os usuários!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listarUsuarios();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Usuários</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.cpf.toString()}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Text style={styles.text}><Text style={styles.bold}>CPF:</Text> {item.cpf}</Text>
              <Text style={styles.text}><Text style={styles.bold}>Nome:</Text> {item.nome}</Text>
              <Text style={styles.text}><Text style={styles.bold}>Idade:</Text> {item.idade}</Text>
              <Text style={styles.text}><Text style={styles.bold}>CEP:</Text> {item.cep}</Text>
              <Text style={styles.text}><Text style={styles.bold}>Endereço:</Text> {item.endereco}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum usuário encontrado!</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#be3100',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#ffe6b4',
  },
  userItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
});
