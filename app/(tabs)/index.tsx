import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

const API_KEY = '5AFoGEF5xLcFMBihb9TPZVS4tZeBzqfU3xzyhy2e'; // Replace with your actual API key

const App = () => {
  const [asteroidId, setAsteroidId] = useState('');
  const [asteroidData, setAsteroidData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch specific asteroid by ID
  const fetchAsteroidById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/${asteroidId}?api_key=${API_KEY}`);
      setAsteroidData(response.data);
    } catch (error) {
      Alert.alert('Error', 'Asteroid not found. Please try a valid Asteroid ID.');
    }
    setLoading(false);
  };

  // Fetch a random asteroid
  const fetchRandomAsteroid = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${API_KEY}`);
      const randomAsteroid = response.data.near_earth_objects[Math.floor(Math.random() * response.data.near_earth_objects.length)];
      const randomAsteroidId = randomAsteroid.id;
      const asteroidResponse = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/${randomAsteroidId}?api_key=${API_KEY}`);
      setAsteroidData(asteroidResponse.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch random asteroid. Please try again.');
    }
    setLoading(false);
  };

  const renderAsteroidData = () => {
    if (!asteroidData) return null;

    return (
      <ScrollView style={styles.resultContainer}>
        <Text style={styles.resultText}>Name: {asteroidData.name}</Text>
        <Text style={styles.resultText}>NASA JPL URL: {asteroidData.nasa_jpl_url}</Text>
        <Text style={styles.resultText}>
          Potentially Hazardous: {asteroidData.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.resultText}>Absolute Magnitude: {asteroidData.absolute_magnitude_h}</Text>

        <Text style={styles.subHeading}>Estimated Diameter (in km):</Text>
        <Text style={styles.resultText}>Min: {asteroidData.estimated_diameter.kilometers.estimated_diameter_min}</Text>
        <Text style={styles.resultText}>Max: {asteroidData.estimated_diameter.kilometers.estimated_diameter_max}</Text>

        <Text style={styles.subHeading}>Close Approach Data:</Text>
        {asteroidData.close_approach_data.map((approach, index) => (
          <View key={index} style={styles.approachContainer}>
            <Text style={styles.resultText}>Date: {approach.close_approach_date}</Text>
            <Text style={styles.resultText}>Relative Velocity (km/h): {approach.relative_velocity.kilometers_per_hour}</Text>
            <Text style={styles.resultText}>Miss Distance (km): {approach.miss_distance.kilometers}</Text>
            <Text style={styles.resultText}>Orbiting Body: {approach.orbiting_body}</Text>
          </View>
        ))}

        <Text style={styles.subHeading}>Orbital Data:</Text>
        <Text style={styles.resultText}>Orbit ID: {asteroidData.orbital_data.orbit_id}</Text>
        <Text style={styles.resultText}>Orbit Determination Date: {asteroidData.orbital_data.orbit_determination_date}</Text>
        <Text style={styles.resultText}>First Observation Date: {asteroidData.orbital_data.first_observation_date}</Text>
        <Text style={styles.resultText}>Last Observation Date: {asteroidData.orbital_data.last_observation_date}</Text>
        <Text style={styles.resultText}>Orbital Period (days): {asteroidData.orbital_data.orbital_period}</Text>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NASA Asteroid Info</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Search Here"
        value={asteroidId}
        onChangeText={setAsteroidId}
      />
      
      <Button
        title="Submit"
        onPress={fetchAsteroidById}
        disabled={!asteroidId.trim()}
      />
      
      <Button
        title="Random Asteroid"
        onPress={fetchRandomAsteroid}
        style={styles.button}
      />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {renderAsteroidData()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  resultText: {
    fontSize: 16,
    marginVertical: 5,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  approachContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default App;
