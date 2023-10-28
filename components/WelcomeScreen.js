import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity, StyleSheet,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 40,
    fontWeight: "600",
    width: 332,
    textAlign: "center",
    marginBottom: 70,
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    width: 332,
    textAlign: "center",
    marginBottom: 70,
  },
  input: {
    width: 332,
    height: 60,
    backgroundColor: "#B5DCAB",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    padding: 10,
  },
  loginButton: {
    backgroundColor: "#B5DCAB",
    borderRadius: 15,
    width: 332,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "black",
    fontSize: 30,
    fontWeight: "600",
  },
});

function WelcomeScreen({ navigation }) {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Welcome to Plantly!</Text>
      <TextInput
        style={styles.input}
        placeholder="User/Email"
        value={userEmail}
        onChangeText={(text) => setUserEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true} // For hiding the password
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => {
          fetch("http://192.168.1.44:3000/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: userEmail, password }),
          })
            .then((response) => response.json())
            .then((data) => {
              // Store the token in a secure manner (e.g., AsyncStorage) for future requests.
              // You can navigate to the home screen here.
            })
            .catch((error) => {
              console.error(error);
              // Handle login errors here.
            });
        }}
      >
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>
      <Text style={styles.text}>New to Plantly? Create Account</Text>

      {/* Create Account button with navigation to SignupScreen */}
      <Button title="Create Account" onPress={() => navigation.navigate("Signup")} />
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}

export default WelcomeScreen;