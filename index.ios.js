/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
  TextInput,
} from 'react-native';

var ResponsiveImage = require('react-native-responsive-image');


class havadurumu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      quiredcity: null,
      cityname: null,
    };
  }
  fetchData(CityApi) {
    if(CityApi){
      fetch(CityApi)
        .then((response) => response.json())
        .then((responseCity) => {
          var lat= responseCity.results[0].geometry.location.lat;
          var lng= responseCity.results[0].geometry.location.lng;
          var Api_URL = 'https://api.darksky.net/forecast/292b223ebe05aa83602ed1cb55efb102/'+ lat +','+ lng +'';
          fetch(Api_URL)
            .then((response) => response.json())
            .then((responseWeather) => {
              this.setState({
                status: responseWeather,
              });
            })
            .done();
          this.setState({
            cityname: responseCity.results[0],
          });
        })
      .done();
    }
  }
  render() {
    if(this.state.cityname){
      var city = this.state.cityname;
      if(this.state.status){
        var weather = this.state.status;
        return this.renderData(weather, city);
      }else{
        return this.renderLoadingView();
      }
    }else{
      return this.renderDataEmpty();
    }
  }
  renderLoadingView() {
    return (
      <View style={styles.container}>
        <View style={styles.bgImageWrapper}>
          <ResponsiveImage source={require('./img/bg-app.jpg')} style={styles.backgroundImage}/>
        </View>
        <Text style={{fontSize:20, color:'white', backgroundColor:'transparent'}}>Hava Durumu Alınıyor...</Text>
      </View>
    );
  }
  componentDidMount(CityApi){
    if(CityApi){
        this.fetchData(CityApi);
    }else{
      this.fetchData();
    }
  }
  getCoordinate() {
    var inputcityname = this.state.inputcity;
    var CityApi = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ inputcityname +'&key=AIzaSyDAjv2G-7zF-JfuBUPHBxbI84fIEBtx0A8';
    this.componentDidMount(CityApi);
  }
  renderDataEmpty(weather,city) {
    return (
      <View style={styles.container}>
        <View style={styles.bgImageWrapper}>
          <ResponsiveImage source={require('./img/bg-app.jpg')} style={styles.backgroundImage}/>
        </View>
        <View style={styles.front}>
          <TextInput style={styles.input} onChangeText={(inputcity) => this.setState({inputcity})} value={this.state.inputcity}/>
          <TouchableHighlight onPress={this.getCoordinate.bind(this)} editable ={true} underlayColor='transparent'>
            <Text style={styles.sorgula}>Sorgula</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
  renderData(weather,city) {
    var weekday = new Array(7);
    weekday[0]=  "Pazar";
    weekday[1] = "Pazartesi";
    weekday[2] = "Salı";
    weekday[3] = "Çarşamba";
    weekday[4] = "Perşembe";
    weekday[5] = "Cuma";
    weekday[6] = "Cumartesi";

    var listofday= [];

    //ilk gün için
    var today = new Date();
    listofday.push({name: weekday[today.getDay()],temp:(weather.currently.temperature-32)/1.8});

    //diğer günler için
    for(var i = 1 ; i<=5;i++)
    {
      var today = new Date();
      today.setDate(today.getDate()+i);
      listofday.push({name: weekday[today.getDay()],temp:(weather.daily.data[i+1].temperatureMin-32)/1.8,icon:weather.daily.data[i+1].icon});
    }

    return (
      <View style={styles.container}>
        <View style={styles.bgImageWrapper}>
          <ResponsiveImage source={require('./img/bg-app.jpg')} style={styles.backgroundImage}/>
        </View>
        <View style={styles.front}>
          <Text style={[styles.celcius, {marginTop:-100}]}>Bugün</Text>
          <View style={styles.details}>
            <Image source={{uri: weather.currently.icon}} style={styles.icons} />
            <View style={styles.status}>
              <Text style={styles.celcius}>{Math.round(listofday[0].temp)} °</Text>
            </View>
          </View>
          <View style={styles.tomorrow}>
            <View style={styles.daily_item}>
              <Text style={styles.daily_celcius}>Yarın</Text>
              <Image source={{uri: listofday[1].icon}} style={styles.daily_icons} />
              <View style={styles.daily_status}>
                <Text style={styles.daily_celcius}>{Math.round(listofday[1].temp)} °</Text>
              </View>
            </View>
            <View style={styles.daily_item}>
              <Text style={styles.daily_celcius}>{listofday[2].name}</Text>
              <Image source={{uri: listofday[2].icon}} style={styles.daily_icons} />
              <View style={styles.daily_status}>
                <Text style={styles.daily_celcius}>{Math.round(listofday[2].temp)} °</Text>
              </View>
            </View>
            <View style={styles.daily_item}>
              <Text style={styles.daily_celcius}>{listofday[3].name}</Text>
              <Image source={{uri: listofday[3].icon}} style={styles.daily_icons} />
              <View style={styles.daily_status}>
                <Text style={styles.daily_celcius}>{Math.round(listofday[3].temp)} °</Text>
              </View>
            </View>
            <View style={[styles.daily_item,{borderRightWidth:0}]}>
              <Text style={styles.daily_celcius}>{listofday[4].name}</Text>
              <Image source={{uri: listofday[4].icon}} style={styles.daily_icons} />
              <View style={styles.daily_status}>
                <Text style={styles.daily_celcius}>{Math.round(listofday[4].temp)} °</Text>
              </View>
            </View>
          </View>
            <TextInput style={styles.input} onChangeText={(inputcity) => this.setState({inputcity})} value={this.state.inputcity}/>
            <TouchableHighlight onPress={this.getCoordinate.bind(this)} editable ={true} underlayColor='transparent'>
              <Text style={styles.sorgula}>Tekrar Sorgula</Text>
            </TouchableHighlight>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  tomorrow:{
    flex:2,
    flexDirection:'row',
    justifyContent:'center',
    marginLeft:-55
  },
  daily_icons:{
    justifyContent: 'center',
    resizeMode: "stretch",
    width:24,
    height:24,
  },
  daily_celcius: {
    color: 'white',
    fontSize:15,
  },
  daily_item:{
    justifyContent: 'center',
    width:100,
    height:50,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor:'transparent',
    paddingRight:10,
    paddingLeft:10,
    borderRightWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  details:{
    marginBottom:80,
    flexDirection:'row',
    flex:1,
    width:200,
  },
  status:{
    flexDirection:'column',
    flex:1,
    marginLeft:30,
    backgroundColor: 'transparent',
  },
  celcius: {
    color: 'white',
    fontSize:30,
    backgroundColor:'transparent',
    marginBottom:10,
  },
  bgImageWrapper: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0
  },
  icons: {
    justifyContent: 'flex-start',
    resizeMode: "stretch",
    width:64,
    height:64,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "stretch"
  },
  front:{
    flexDirection:'column',
    alignItems:'center',
    width:300,
  },
  input:{
    textAlign: 'center',
    color: 'white',
    height:40,
    borderWidth: 1,
    borderRadius:10,
    borderColor: 'white',
  },
  sorgula:{
    marginTop:20,
    textAlign: 'center',
    color: '#333333',
    borderWidth: 2,
    padding:10,
    color:'white',
    borderRadius:5,
    borderColor: 'white',
  }
});

AppRegistry.registerComponent('havadurumu', () => havadurumu);
