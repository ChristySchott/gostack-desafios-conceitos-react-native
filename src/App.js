import React, { useState, useEffect } from "react";
import api from './services/api'

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories')
      .then(response =>
        setRepositories(response.data))
  }, [])

  async function handleAddRepository() {
    const response = await api.post('repositories', {
      id: '1',
      title: 'Chris 2',
      url: 'Oi',
      techs: [
        'oi',
        'tudo?'
      ]
    })

    const repository = response.data;

    setRepositories([...repositories, repository])
  }

  async function handleDeleteRepository(id) {
    await api.delete(`repositories/${id}`)

    setRepositories(repositories.filter(repository => repository.id !== id))
  }

  async function handleLikeRepository(id, title, url, techs) {
    await api.post(`repositories/${id}/like`, {
      id,
      title,
      url,
      techs
    })

    const updatedRepositories = repositories.map(repository => {
      if (repository.id === id) {
        repository.likes += 1
      }
      return repository
    })

    setRepositories(updatedRepositories)
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repository }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>


              <View style={styles.techsContainer}>
                {repository.techs.map(category => (
                  <Text key={category} style={styles.tech}>
                    {category}
                  </Text>
                ))}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes} curtidas
            </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id, repository.title, repository.url, repository.techs)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonLike}>Curtir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleDeleteRepository(repository.id)}
              >
                <Text style={styles.buttonRemove}>Remover</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity
          style={styles.buttonAdd}
          onPress={handleAddRepository}>
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonAdd: {
    marginTop: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonLike: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
  buttonRemove: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#e81c1c",
    padding: 15,
  },
});
