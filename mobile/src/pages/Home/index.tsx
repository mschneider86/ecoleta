import React, { useState, useEffect } from "react";
import {
  View,
  ImageBackground,
  Image,
  Text,
  KeyboardAvoidingView,
  TextInput,
  Platform,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import PickerSelect from "react-native-picker-select";
import axios from "axios";

import styles from "./styles";

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface Ufs {
  label: string;
  value: string;
}

interface Cities {
  label: string;
  value: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<Ufs[]>([]);
  const [cities, setCities] = useState<Cities[]>([]);
  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => {
          return {
            label: uf.sigla,
            value: uf.sigla,
          };
        });
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (uf === "0") {
      return;
    }
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => {
          return {
            label: city.nome,
            value: city.nome,
          };
        });

        setCities(cityNames);
      });
  }, [uf]);

  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate("Points", { uf, city });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/home-background.png")}
        imageStyle={styles.imageStyle}
        style={styles.container}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma
              eficiente.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TextInput
            style={styles.input}
            placeholder="Digite a UF"
            value={uf}
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
            onChangeText={setUf}
          />
          <TextInput
            style={styles.input}
            placeholder="Digite a Cidade"
            value={city}
            autoCorrect={false}
            onChangeText={setCity}
          />
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Home;
