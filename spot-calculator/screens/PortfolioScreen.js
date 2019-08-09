import React from 'react';
import { ActivityIndicator, Text, TextInput, View, StyleSheet, AsyncStorage } from 'react-native';
import { MonoText } from '../components/StyledText';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

const SpotAPI = require ('../controllers/spot');

export default class PortfolioScreen extends React.Component {
  constructor(props){
    super(props);
    this.state ={ 
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

  componentWillMount(){
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
        <View>
          <Text style={styles.helpLinkText}>
            Current Silver Spot Price: 
          </Text>
        </View>
        <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
          <MonoText style={styles.codeHighlightText}>
            ${SpotAPI.formatMoney(this.state.silver)} USD/OZ
          </MonoText>
        </View>

        <View style={{ padding: 10 }}>
          <TextInput
            style={{ height: 40 }}
            placeholder="Set silver weight in Oz"
            onChangeText={input => this.setState({ silverWeight: input }) && AsyncStorage.setItem("silverWeight", this.state.silverWeight)}
          />
          <Text style={{ padding: 10, fontSize: 15 }}>
            Current Silver Weight (oz): {this.state.silverWeight}
          </Text>
        </View>

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
});
