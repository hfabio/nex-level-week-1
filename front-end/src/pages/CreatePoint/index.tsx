import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import Dropzone from '../../components/Dropzone';

import { FiArrowLeft } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import './styles.css';

import api from '../../services/api';
import axios from 'axios';

interface Item {
  id: number;
  title: string;
  image: string;
  selected: boolean;
}

interface IBGEUf {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECity {
  id: number;
  nome: string;
};

interface Response {
  status: string;
}

const CreatePoint = () => {
  const history = useHistory();

  const [latitude, setLatitude] = useState<number>(-27.2092052);
  const [longitude, setLongitude] = useState<number>(-49.6401092);

  const [items, setItems] = useState<Item[]>([]);

  const [ufs, setUfs] = useState<IBGEUf[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);

  const [selectedUf, setSelectedUf] = useState<string>('0');
  const [selectedCity, setSelectedCity] = useState<string>('0');
  const [selectedFile, setSelectedFile] = useState<File>();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setLatitude(latitude);
      setLongitude(longitude);

      console.table('latitude', latitude, -12.2538368);
      console.table('longitude', longitude, -38.9084997);
    });
  }, []);

  useEffect(() => {
    api.get<Item[]>('/items')
      .then(response => {
        setItems(response.data.map(item => ({ ...item, selected: false })));
        console.log(response);
      })
  }, []);

  useEffect(() => {
    axios.get<IBGEUf[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => {
        setUfs(response.data);
      })
  }, []);

  const getCities = (event: ChangeEvent<HTMLSelectElement>) => {
    if (Number(event.target.value) !== 0) {
      const UF = ufs.find(uf => Number(uf.id) === Number(event.target.value));
      if (UF) {
        setSelectedUf(UF.sigla);
        axios.get<IBGECity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF.sigla}/municipios?orderBy=nome`)
          .then(response => {
            setCities(response.data);
          });
      }
    } else {
      setSelectedUf('0');
      setCities([]);
    }
  }

  const handleSelectCity = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  }

  const handleMapClick = (event: LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;
    setLatitude(lat);
    setLongitude(lng);
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  const handleItemClick = (id: number) => {
    const new_items = items.map(item => item.id === id ? ({ ...item, selected: !item.selected }) : item);
    setItems(new_items);
  }

  const validationHandler = (name: string, email: string, whatsapp: string, uf: string, city: string, latitude: string, longitude: string, items: number[], image?: File) => {
    const errors = {
      'name': 'Por favor, insira o nome do estabelecimento',
      'email': 'Por favor, insira um e-mail para contato',
      'email_invalid': 'Por favor, insira um e-mail válido para contato',
      'whatsapp': 'Por favor, insira um número de whatsapp para contato',
      'whatsapp_invalid': 'Por favor, insira um número de whatsapp válido para contato',
      'uf': 'Por favor, insira o estado onde se localiza o estabelecimento',
      'city': 'Por favor, insira a cidade onde se localiza o estabelecimento',
      'latitude': 'Por favor, selecione um ponto no mapa que indique o local do estabelecimento',
      'longitude': 'Por favor, selecione um ponto no mapa que indique o local do estabelecimento',
      'items': 'Por favor, selecione ao menos um tipo de coleta para este estabelecimento',
      'image': 'Por favor, insira uma imagem para este estabelecimento',
    }
    if (!name || name.length < 3) {
      return errors['name'];
    }
    if (!email || email.length === 0) {
      return errors['email'];
    }
    if (email.length < 10 || !email.includes('@') || !email.includes('.')) {
      return errors['email_invalid'];
    }
    if (!whatsapp || whatsapp.length === 0) {
      return errors['whatsapp'];
    }
    if (!Number(whatsapp) || String(Number('92318806')).length < 8) {
      return errors['whatsapp_invalid'];
    }
    if (!latitude || latitude.length < 2) {
      return errors['latitude'];
    }
    if (!longitude || longitude.length < 2) {
      return errors['longitude'];
    }
    if (!uf || uf.length < 2) {
      return errors['uf'];
    }
    if (!city || city.length < 4) {
      return errors['city'];
    }
    if (!items || items.length < 1) {
      return errors['items'];
    }
    if (!image) {
      return errors['image'];
    }
    return false;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const selected_items = items.filter(item => item.selected).map(item => item.id);

    // const data = {
    //   name,
    //   email,
    //   whatsapp,
    //   uf,
    //   city,
    //   latitude,
    //   longitude,
    //   image: selectedFile,
    //   items: selected_items
    // }
    const data = new FormData();
    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', selected_items.join(','));

    if (selectedFile) {
      data.append('image', selectedFile);
    }

    const validation = validationHandler(name, email, whatsapp, uf, city, String(latitude), String(longitude), selected_items, selectedFile);
    if (validation) {
      alert(validation);
      return;
    }

    const response = await api.post<Response>('/points', data);
    console.log(response);
    if (response.data.status === 'created') {
      alert('Ponto de coleta criado');
      history.push('/');
    } else {
      alert('Houve um erro ao criar o ponto de coleta')
    }
    console.log('submission', data);

  }


  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> ponto de coleta</h1>

        <Dropzone onFileUpload={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">

            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>

          </div>

        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={[latitude, longitude]} zoom={15} onclick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[latitude, longitude]} />
          </Map>

          <div className="field-group">

            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf" onChange={getCities}>
                <option value="0">Selecione uma UF</option>
                {ufs.length > 0 && ufs.map(uf => <option value={uf.id} key={uf.id}>{uf.nome}</option>)}
              </select>
            </div>

            <div className="field">
              <label htmlFor="cidade">Cidade</label>
              <select name="cidade" id="cidade" value={selectedCity} onChange={handleSelectCity}>
                <option value="0">Selecione uma cidade</option>
                {cities.length > 0 && cities.map(city => <option value={city.nome} key={city.id}>{city.nome}</option>)}
              </select>
            </div>

          </div>

        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.length > 0 && items.map((item, index) => (
              <li key={index}
                className={`${item.selected ? 'selected' : ''}`}
                onClick={() => handleItemClick(item.id)}>
                <img src={item.image} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  )
}

export default CreatePoint;
