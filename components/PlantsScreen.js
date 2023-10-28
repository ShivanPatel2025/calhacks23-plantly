import React, { useState } from 'react';
import { View, Text, Button, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  card: {
    padding: 20,
    borderRadius: 10,
    width: '90%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    margin: 5,
    borderColor: '#B5DCAB',
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#B5DCAB',
    textAlign: 'center',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  icon: {
    width: 80,
    height: 80,
    margin: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedIcon: {
    borderColor: '#B5DCAB',
  },
});


function PlantsScreen({ navigation }) {
  const [commonName, setCommonName] = useState('');
  const [nickname, setNickname] = useState('');
  const [daysOld, setDaysOld] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const iconPaths = [
    require('../assets/plant-1.png'),
    require('../assets/plant-2.png'),
    require('../assets/plant-3.png'),
    require('../assets/plant-4.png'),
    require('../assets/plant-5.png'),
    require('../assets/plant-6.png'),
    require('../assets/plant-7.png'),
    require('../assets/plant-8.png'),
    require('../assets/plant-9.png'),
  ];
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Add Your Plant!</Text>
        <TextInput
          style={styles.input}
          placeholder="Common Name"
          value={commonName}
          onChangeText={setCommonName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nickname/Display Name"
          value={nickname}
          onChangeText={setNickname}
        />
        <TextInput
          style={styles.input}
          placeholder="Days Old"
          value={daysOld}
          onChangeText={setDaysOld}
          keyboardType="numeric"
        />
        <View style={styles.iconGrid}>
          {iconPaths.map((path, index) => (
            <TouchableOpacity key={index} onPress={() => setSelectedIcon(path)}>
              <Image source={path}
                style={[
                  styles.icon, 
                  selectedIcon === path && styles.selectedIcon
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Submit"
            onPress={() => {
              console.log("Submitted:", { commonName, nickname, daysOld, selectedIcon });
            }}
            color="#B5DCAB"
          />
        </View>
      </View>
    </View>
  );
}

export default PlantsScreen;