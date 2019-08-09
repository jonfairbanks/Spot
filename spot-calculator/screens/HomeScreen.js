import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions, AsyncStorage } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
const SpotAPI = require ('../controllers/spot');

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['', 'Total Weight', 'Spot Price', 'Total Holdings'],
      tableTitle: ['Silver', 'Gold', 'Platinum', 'Palladium'],
      tableData: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ],
      portfolioBalance: null,
      portfolioBalanceLastUpdate: 'Never',
      silver: null,
      silverWeight: null,
      gold: null,
      goldWeight: null,
      platinum: null,
      platinumWeight: null,
      palladium: null,
      palladiumWeight: null
    }
  }

  getLatestPrices() {
    SpotAPI.getPrices()
      .then(response => {
        const prices = response.prices
        this.setState({silver: prices.silver, gold: prices.gold, platinum: prices.platinum, palladium: prices.palladium})
        this.setTableSpotPrices();
        this.setPortfolioBalance();
      });
  }

  getPortfolioWeightsFromStorage() {
    AsyncStorage.getItem("silver").then((value) => {
      this.setState({silver: value});
    }).done();
    AsyncStorage.getItem("gold").then((value) => {
      this.setState({gold: value});
    }).done();
    AsyncStorage.getItem("platinum").then((value) => {
      this.setState({platinum: value});
    }).done();
    AsyncStorage.getItem("palladium").then((value) => {
      this.setState({palladium: value});
    }).done();
  }

  setPortfolioBalance() {
    this.setState({
      portfolioBalance: '$' + this.formatMoney(this.state.silver * 300) + ' USD',
      portfolioBalanceLastUpdate: Date.now()
    });
  }

  setTableSpotPrices() {
    this.setState({
      tableData: [
        [ this.state.silverWeight + ' oz', '$' + this.formatMoney(this.state.silver), '$' + this.formatMoney(this.state.silver * this.state.silverWeight)],
        ['', '$' + this.formatMoney(this.state.gold), ''],
        ['', '$' + this.formatMoney(this.state.platinum), ''],
        ['', '$' + this.formatMoney(this.state.palladium), '']
      ]
    })
  };

  formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log('Money formatting error: ' + e)
    }
  };

  componentWillMount() {
    this.getLatestPrices();
    //this.getPortfolioWeightsFromStorage();
    
  };

  componentDidMount(){
    //setTimeout(() => { this.getLatestPrices(); }, 3000);
    
    
  }

  render() {
    const state = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <DevelopmentModeNotice />
          <View style={styles.totalContainer}>
            <TouchableOpacity onPress={() => handleTotalPress(this)} style={styles.touchLink}>
              <Text style={styles.totalDollarAmt}>
                {this.state.portfolioBalance}
              </Text>
              <Text style={styles.totalBanner}>
                Current Portfolio Balance
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
                datasets: [{
                  data: [
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000
                  ]
                }]
              }}
              width={Dimensions.get('window').width} // from react-native
              height={220}
              yAxisLabel={'$'}
              chartConfig={{
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#fb8c00',
                backgroundGradientTo: '#ffa726',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>

          <View style={styles.tableContainer}>
            <Table>
              <Row data={state.tableHead} flexArr={[1, 1, 1, 1]} style={styles.head} textStyle={styles.text}/>
              <TableWrapper style={styles.wrapper}>
                <Col data={state.tableTitle} style={styles.title} heightArr={[35,35]} textStyle={styles.text}/>
                <Rows data={state.tableData} flexArr={[1, 1, 1]} style={styles.row} textStyle={styles.text}/>
              </TableWrapper>
            </Table>
          </View>

          <View style={styles.footerContainer}>
            <TouchableOpacity onPress={handleSitePress} style={styles.touchLink}>
              <Text style={styles.footerLinkText}>
                Spot
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <TouchableOpacity onPress={() => handleUpdatePress(this)} style={styles.touchLink}>
              <Text style={styles.footerLinkText}>
                Last Update: {this.state.portfolioBalanceLastUpdate}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled
      </Text>
    );
  }
}

function handleTotalPress(context) {
  context.props.navigation.navigate('Portfolio');
}

function handleUpdatePress(context) {
  context.getLatestPrices();
}

function handleSitePress() {
  WebBrowser.openBrowserAsync(
    'https://github.com/Fairbanks-io/Spot'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 10,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center'
  },
  contentContainer: {
    paddingTop: 30,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  totalContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  totalBanner: {
    paddingVertical: 5,
    color: 'grey',
    fontSize: 12,
    textAlign: 'center'
  },
  totalDollarAmt: {
    fontSize: 25
  },
  tableContainer: { 
    flex: 1, 
    padding: 16, 
    paddingTop: 30, 
    backgroundColor: '#fff' 
  },
  head: {  
    height: 40,  
    backgroundColor: '#f1f8ff'
  },
  wrapper: { 
    flexDirection: 'row' 
  },
  title: { 
    flex: 1, 
    backgroundColor: '#f6f8fa'
  },
  row: {  
    height: 35  
  },
  text: { 
    textAlign: 'center' 
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
    paddingVertical: 5,
  },
});
