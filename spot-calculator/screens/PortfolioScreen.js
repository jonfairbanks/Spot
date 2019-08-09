import React from 'react';
import { ActivityIndicator, Text, TextInput, ScrollView, View, TouchableOpacity, StyleSheet, AsyncStorage, Button, RefreshControl } from 'react-native';
import { MonoText } from '../components/StyledText';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import * as WebBrowser from 'expo-web-browser';

const SpotAPI = require ('../controllers/spot');

export default class PortfolioScreen extends React.Component {
  constructor(props){
    super(props);
    this._willFocusSubscription = props.navigation.addListener('willFocus', payload =>
      this._onRefresh()
    );
    this.state ={
      refreshing: false,
      isLoading: true,
      silver: '',
      silverWeight: '',
      gold: '',
      goldWeight: '',
      platinum: '',
      platinumWeight: '',
      palladium: '',
      palladiumWeight: '',
      text: ''
    }
  }

  getPortfolioWeightsFromStorage() {
    AsyncStorage.getItem("silverWeight").then((value) => {
      this.setState({silverWeight: value});
    }).done();

    AsyncStorage.getItem("goldWeight").then((value) => {
      this.setState({goldWeight: value});
    }).done();

    AsyncStorage.getItem("platinumWeight").then((value) => {
      this.setState({platinumWeight: value});
    }).done();

    AsyncStorage.getItem("palladiumWeight").then((value) => {
      this.setState({palladiumWeight: value});
    }).done();
  }

  clearAsyncStorage = async() => {
    AsyncStorage.clear();
    this.getPortfolioWeightsFromStorage();
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    SpotAPI.getPrices()
    .then(response => {
      const prices = response.prices
      this.setState({
        isLoading: false,
        silver: prices.silver,
        gold: prices.gold, 
        platinum: prices.platinum, 
        palladium: prices.palladium
      })
    });
    this.setState({refreshing: false});
  }

  componentWillMount() {
    this._onRefresh();
    this.getPortfolioWeightsFromStorage();
  }

  render(){
    if(this.state.isLoading){
      return(
        <View style={styles.container}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={styles.container}>
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>
              Silver Spot Price: ${SpotAPI.formatMoney(this.state.silver)} USD/OZ
            </MonoText>
            <MonoText style={styles.codeHighlightText}>
              Gold Spot Price: ${SpotAPI.formatMoney(this.state.gold)} USD/OZ
            </MonoText>
            <MonoText style={styles.codeHighlightText}>
              Platinum Spot Price: ${SpotAPI.formatMoney(this.state.platinum)} USD/OZ
            </MonoText>
            <MonoText style={styles.codeHighlightText}>
              Palladium Spot Price: ${SpotAPI.formatMoney(this.state.palladium)} USD/OZ
            </MonoText>
          </View>

          <View style={{ padding: 10 }}>
            <Text style={{ padding: 1, fontSize: 15 }}>
              Current Silver Weight: {this.state.silverWeight ? this.state.silverWeight + ' OZ' : '-'}
            </Text>
            <TextInput
              style={{ height: 40 }}
              placeholder="Set Silver weight in OZ"
              onChangeText={input => AsyncStorage.setItem("silverWeight", input) && this.setState({silverWeight: input})}
            />
            <Text style={{ padding: 1, fontSize: 15 }}>
              Current Gold Weight: {this.state.goldWeight ? this.state.goldWeight + ' OZ' : '-'}
            </Text>
            <TextInput
              style={{ height: 40 }}
              placeholder="Set Gold weight in OZ"
              onChangeText={input => AsyncStorage.setItem("goldWeight", input) && this.setState({goldWeight: input})}
            />
            <Text style={{ padding: 1, fontSize: 15 }}>
              Current Platinum Weight: {this.state.platinumWeight ? this.state.platinumWeight + ' OZ' : '-'}
            </Text>
            <TextInput
              style={{ height: 40 }}
              placeholder="Set Platinum weight in OZ"
              onChangeText={input => AsyncStorage.setItem("platinumWeight", input) && this.setState({platinumWeight: input})}
            />
            <Text style={{ padding: 1, fontSize: 15 }}>
              Current Palladium Weight: {this.state.palladiumWeight ? this.state.palladiumWeight + ' OZ' : '-'}
            </Text>
            <TextInput
              style={{ height: 40 }}
              placeholder="Set Palladium weight in OZ"
              onChangeText={input => AsyncStorage.setItem("palladiumWeight", input) && this.setState({palladiumWeight: input})}
            />
          </View>

          <Button
            color="#841584"
            onPress={() => this.clearAsyncStorage()}
            title="Reset My Portfolio"
          />

          
          <View style={styles.footerContainer}>
            <TouchableOpacity onPress={handleSitePress} style={styles.touchLink}>
              <Text style={styles.footerLinkText}>
                Spot
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <ActionButton buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item buttonColor='#3498db' title="Create Notifications" onPress={() => {}}>
              <Icon name="md-notifications" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#1abc9c' title="Add Stock" onPress={() => {}}>
              <Icon name="logo-usd" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
      </View>

    );
  }
}

PortfolioScreen.navigationOptions = {
  title: 'Portfolio',
};

function handleSitePress() {
  WebBrowser.openBrowserAsync(
    'https://github.com/Fairbanks-io/Spot'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  navigationFilename: {
    marginTop: 5,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  footerContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  footerLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  touchLink: {
    paddingVertical: 15,
  },
});
