/* eslint-disable react-native/no-inline-styles */
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const phone_img: any = require('../assets/mobile_white.png');

const height: number = Dimensions.get('window').height;
const width: number = Dimensions.get('window').width;

const Headers = (props: any) => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={phone_img} />
      <View style={{flex: 1}}>
        <Text style={styles.text}>Product List</Text>
        {props?.sumProduct && (
          <Text style={styles.text2}>{props.sumProduct} Products</Text>
        )}
      </View>
    </View>
  );
};

export default Headers;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D81A3C',
    flexDirection: 'row',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    width: width,
    height: height * 0.1,
    alignItems: 'center',
  },
  image: {
    width: '20%',
    height: '50%',
    flex: 0,
    objectFit: 'scale-down',
    resizeMode: 'center',
  },
  text: {
    fontWeight: '900',
    color: 'white',
  },
  text2: {
    fontWeight: '400',
    color: 'white',
  },
});
