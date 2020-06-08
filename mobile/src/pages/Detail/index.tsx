import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Alert, Linking } from 'react-native';
import * as MailComposer from 'expo-mail-composer';

import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';

import { Feather as Icon, FontAwesome } from '@expo/vector-icons'

import api from '../../services/api';
// import { Container } from './styles';

interface RouteParams {
  point_id: number;
}

interface Item {
  id: number;
  title: string;
  image: string;
  selected: boolean;
}

interface Point {
  id: number;
  image: string;
  image_url: string;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
  whatsapp: string;
  email: string;
  items: {
    title: string;
  }[];
}
const Detail: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const [point, setPoint] = useState<Point>();

  useEffect(() => {
    api.get<Point>(`/points/${routeParams.point_id}`)
      .then(response => {
        setPoint(response.data);
      })
  }, []);

  const handleNavigateBack = () => {
    navigation.goBack();
  }

  const handleWhatsapp = () => {
    if (point) {
      Linking.openURL(`whatsapp://send?phone=55${point.whatsapp}&text=Olá ${point.name}, estou entrando em contato por ter interesse em descartar resíduos devidamente`);
      // Alert.alert('Ligando', `Ligando para o whatsapp ${point.whatsapp}`)
    }
  }
  const handleEmail = async () => {
    if (point) {
      MailComposer.composeAsync({
        subject: 'Interesse em descartar resíduos devidamente',
        recipients: [point.email],
      })
    }
  }

  if (!point) {
    return <View />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container} >

        <TouchableOpacity onPress={handleNavigateBack}>
          <Text>
            <Icon name="arrow-left" size={24} color="#34cb79" />
          </Text>
        </TouchableOpacity>


        <Image style={styles.pointImage} source={{ uri: point.image_url }} />

        <Text style={styles.pointName}>{point.name}</Text>
        <Text style={styles.pointItems}>{point.items.map(item => item.title).join(', ')}</Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{point.city}, {point.uf}</Text>
        </View>
      </View>

      <View style={styles.footer}>

        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={handleEmail}>
          <Icon name="mail" size={20} color="#FFF" />
          <Text style={styles.buttonText}>e-mail</Text>
        </RectButton>

      </View>
    </SafeAreaView>
  );
}

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingBottom: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});