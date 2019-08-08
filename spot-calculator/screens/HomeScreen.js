import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions, AsyncStorage } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';

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
      portfolioBalance: ''
    }
  }

  getSilverPrice() {
    return fetch('http://fairbanks.io:7001/api/v1/spots/?metal=silver&per_page=1')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        silver: responseJson[0].spotPrice,
      });
      this.setTableSpotPrices();
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  getGoldPrice() {
    return fetch('http://fairbanks.io:7001/api/v1/spots/?metal=gold&per_page=1')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        gold: responseJson[0].spotPrice,
      });
      this.setTableSpotPrices();
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  getPlatinumPrice() {
    return fetch('http://fairbanks.io:7001/api/v1/spots/?metal=platinum&per_page=1')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        platinum: responseJson[0].spotPrice,
      });
      this.setTableSpotPrices();
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  getPalladiumPrice() {
    return fetch('http://fairbanks.io:7001/api/v1/spots/?metal=palladium&per_page=1')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        palladium: responseJson[0].spotPrice,
      });
      this.setTableSpotPrices();
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  getPortfolioBalance() {
    
  }

  setTableSpotPrices() {
    this.setState({
      tableData: [
        ['', '$' + this.formatMoney(this.state.silver), ''],
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
      console.log('Formatting error: ' + e)
    }
  };

  componentDidMount(){
    this.getSilverPrice();
    this.getGoldPrice();
    this.getPlatinumPrice();
    this.getPalladiumPrice();
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
                $1,798.50 USD
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
