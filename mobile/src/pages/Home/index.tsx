import React, { useEffect, useState } from 'react';
import { View, ImageBackground, Image, Text, StyleSheet } from 'react-native';
import RNPickerSelect, { Item } from 'react-native-picker-select';

import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'

import axios from 'axios';
import api from '../../services/api';

import { Feather as Icon } from '@expo/vector-icons'
import logo from '../../assets/logo.png';
import homeBackground from '../../assets/home-background.png';

interface IBGEUf {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECity {
  id: number;
  nome: string;
};

const Home: React.FC = () => {
  const navigation = useNavigation();

  const [ufItems, setUfItems] = useState<Item[]>([]);
  const [cityItems, setCityItems] = useState<Item[]>([]);

  const [ufSelected, setUfSelected] = useState<string>('');
  const [citySelected, setCitySelected] = useState<string>('');

  const [ufs, setUfs] = useState<IBGEUf[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);


  useEffect(() => {
    axios.get<IBGEUf[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => {
        setUfs(response.data);
      })
  }, []);

  useEffect(() => {
    if (ufs.length > 0) {
      setUfItems(ufs.map(uf => ({ label: uf.nome, value: uf.sigla })));
    }
  }, [ufs])

  useEffect(() => {
    if (cities.length > 0) {
      setCityItems(cities.map(city => ({ label: city.nome, value: city.nome })));
    }
  }, [cities])

  const getCities = (value: string) => {
    if (value !== '') {
      const UF = ufs.find(uf => uf.sigla === value);
      if (UF) {
        setUfSelected(UF.sigla);
        axios.get<IBGECity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF.sigla}/municipios?orderBy=nome`)
          .then(response => {
            setCities(response.data);
          });
      }
    } else {
      setCities([]);
    }
  }



  const handleButton = () => navigation.navigate('Points', { uf: ufSelected, city: citySelected });

  const handleUfChange = (value: string) => {
    setUfSelected(prevState => (prevState !== value) ? value : prevState)
    getCities(value);
  }

  const handleCityChange = (value: string) => {
    setCitySelected(prevState => (prevState !== value) ? value : prevState)
  }

  return (
    <ImageBackground
      source={homeBackground}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>

        <Image source={logo} />

        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>

      </View>

      <View style={styles.footer}>

        <RNPickerSelect
          placeholder={{ label: 'Selecione um estado', value: '' }}
          items={ufItems}
          onValueChange={value => handleUfChange(value)}
          value={ufSelected}
          style={styles}
        />
        <RNPickerSelect
          placeholder={{ label: 'Selecione uma cidade', value: '' }}
          items={cityItems}
          onValueChange={value => handleCityChange(value)}
          value={citySelected}
          style={styles}
        />

        <RectButton
          style={styles.button}
          onPress={handleButton}
          enabled={citySelected !== ''}
        >
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>

      </View>

    </ImageBackground>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});
