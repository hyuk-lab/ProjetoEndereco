import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, Alert, Pressable, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import logo from '../CEP/assets/local.png';
import ListarUsuarios from '../CEP/telas/tela1.js';

const Stack = createStackNavigator();

function App({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');

  const buscarEndereco = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const data = response.data;
      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado');
      } else {
        setEndereco(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar CEP');
    }
  };

  const limparUsuario = () => {
    setNome('');
    setCep('');
    setEndereco('');
    setIdade('');
    setCpf('');
  };

  const handleSubmit = async () => {
    if (!cpf || !nome || !idade || !cep || !endereco) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    try {
      await axios.post('http://26.215.35.92:3000/users', {
        cpf,
        nome,
        idade,
        cep,
        endereco,
      });
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso');
      limparUsuario();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar usuário');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.div}>
        <Image source={logo} style={styles.lg} />
      </View>
      <Text style={styles.title}>Cadastro Completo</Text>

      <Text style={styles.text}>Nome: </Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />
      <Text style={styles.text}>CPF: </Text>
      <TextInput style={styles.input} value={cpf} onChangeText={setCpf} />
      <Text style={styles.text}>Idade: </Text>
      <TextInput
        style={styles.input}
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />
      <Text style={styles.text}>CEP: </Text>
      <TextInput
        style={styles.input}
        value={cep}
        onChangeText={(text) => {
          setCep(text);
          if (text.length === 8) {
            buscarEndereco(text);
          }
        }}
        keyboardType="numeric"
      />
      <Text style={styles.text}>Endereço: </Text>
      <TextInput style={styles.input} value={endereco} editable={false} />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.texto3}>Cadastrar</Text>
      </Pressable>

      <Pressable
        style={styles.button1}
        onPress={() => navigation.navigate('ListarUsuarios')}
      >
        <Text style={styles.texto2}>Listar Usuários</Text>
      </Pressable>
    </View>
  );
}

export default function Legal() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Cadastro">
        <Stack.Screen name="Cadastro" component={App} options={{title:"", headerStyle:{backgroundColor: '#be3100'}}}/>
        <Stack.Screen name="ListarUsuarios" component={ListarUsuarios} options={{title: ''}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#be3100',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#241714',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    textAlign: 'center',
    color: "white"
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: 'black',
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: 'black',
    marginTop: 10,
  },
  texto2: {
    color: 'white',
  },
  texto3: {
    color: 'white',
  },
  lg: {
    width: 100,
    height: 100,
  },
  div: {
    marginLeft: 130,
  },
  text: {
    color: '#ffe6b4',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
