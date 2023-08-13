import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';

const height: number = Dimensions.get('window').height;
const width: number = Dimensions.get('window').width;
function currencyFormat(num: number) {
  return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

const CheckoutButton = (props: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.price}>
        <Text style={styles.text}>Total</Text>
        <Text style={styles.text}>{currencyFormat(props?.total) || ''}</Text>
      </View>
      <TouchableOpacity
        disabled={props?.total < 1}
        onPress={() => props.feedBack()}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          ...styles.buttonCheckout,
          backgroundColor: props?.total > 1 ? '#3A4144' : '#CFCFCF',
        }}>
        <Text style={styles.textWhite}>Chekcout</Text>
      </TouchableOpacity>
      {props?.total > 1 && (
        <TouchableOpacity
          onPress={() => props?.reset()}
          style={styles.buttonReset}>
          <Text style={styles.text}>Reset</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CheckoutButton;

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: 'center',
    minHeight: height * 0.1,
    backgroundColor: 'white',
  },
  text: {
    fontWeight: '900',
  },
  textWhite: {
    fontWeight: '900',
    color: 'white',
  },
  price: {
    flexDirection: 'row',
    height: height * 0.05,
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonCheckout: {
    borderRadius: 16,
    backgroundColor: '#3A4144',
    height: height * 0.05,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonReset: {
    borderRadius: 16,
    borderColor: '#3A4144',
    borderWidth: 2,
    height: height * 0.05,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
});
