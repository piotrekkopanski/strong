// src/Pokemon.js
import React from 'react';
import { View, Text, Image } from 'react-native';
import { Link } from './routing';
const Pokemon = props => {
  const backButton = (
    <View>
      <Link to="/">
        <Text>Go Back</Text>
      </Link>
    </View>
  );
  if (!props.selectedPokemon) {
    return (
      <View>
        {backButton}
        <Text>No Pokemon selected</Text>
      </View>
    );
  }
  const {
    selectedPokemon: { name, number, type, photoUrl }
  } = props;
  return (
    <View>
      <View>
        {backButton}
        <View>
          <Text>{`#${number}`}</Text>
        </View>
        <View>
          <Text>{`Name: ${name}`}</Text>
        </View>
        <View>
          <Text>{`Type: ${type}`}</Text>
        </View>
        <View>
          <Image style={{ width: 50, height: 50 }} source={{ uri: photoUrl }} />
        </View>
      </View>
    </View>
  );
};
export default Pokemon;