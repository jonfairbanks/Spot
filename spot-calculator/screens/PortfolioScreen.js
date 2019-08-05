import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

function getSpotPrice() {
  return fetch('http://fairbanks.io:7001/api/v1/spots/?metal=silver&per_page=1')
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.spotPrice;
    })
    .catch((error) => {
      console.error(error);
    });
}

export default function PortfolioScreen() {
  return (
    <ScrollView style={styles.container}>
      {/**
       * Go ahead and delete ExpoLinksView and replace it with your content;
       * we just wanted to provide you with some helpful links.
       */}
      <ExpoLinksView />
    </ScrollView>
  );
}

PortfolioScreen.navigationOptions = {
  title: 'Portfolio',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
