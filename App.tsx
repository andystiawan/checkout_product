/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {product} from './src/network/service';
import ListProduct from './src/view/ListProduct';
import Headers from './src/component/Headers';
import CheckoutButton from './src/component/CheckoutButton';

const uniqueItemsId = (items: any) =>
  [...new Set(items.map((item: any) => item.id))].map(id =>
    items.find((item: any) => item.id === id),
  );
function currencyFormat(num: number) {
  return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const initialState = {
    skip: 0,
    limit: 10,
    total: 0,
    product: [],
    sum: 0,
    loading: false,
    checkout: false,
  };
  const [state, setstate] = useState(initialState);
  const [isModalVisible, setModalVisible] = useState(true);
  const fetchData = async () => {
    setstate(p => ({...p, loading: true}));
    const res = await product(10, 0);
    setstate(p => ({
      ...p,
      skip: res.skip,
      limit: res.limit,
      total: res.total,
      product: res.products,
      sum: 0,
      checkout: false,
    }));
    setTimeout(() => {
      setstate(p => ({...p, loading: false}));
    }, 500);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const more = async (limit: number, skip: number) => {
    setstate(p => ({...p, loading: true}));
    const res = await product(limit, skip);
    const data = [...state.product, ...res?.products];
    setstate((p: any) => ({
      ...p,
      skip: res.skip,
      limit: res.limit,
      total: res.total,
      product: uniqueItemsId(data),
      loading: false,
      checkout: false,
    }));
  };
  const calculateTotal = (items: any) => {
    let total = 0;
    for (const item of items) {
      total += item.subtotal;
    }
    return total;
  };
  const calculated = (e: any) => {
    let dataProduct: any = [...state.product];

    if (e.type === '+') {
      const qty = e.product?.quantity ? e.product?.quantity + 1 : 1;
      const result = {
        ...e.product,
        quantity: qty,
        subtotal: e.product?.price * qty,
      };
      dataProduct[e.index] = result;
    } else if (e.type === '-') {
      const qty = e.product?.quantity ? e.product?.quantity - 1 : 0;
      const result = {
        ...e.product,
        quantity: qty,
        subtotal: e.product?.price * qty,
      };
      dataProduct[e.index] = result;
    } else {
      const qty = e.value;
      const cekQty = qty >= e.product?.stock ? e.product?.stock : qty;
      const result = {
        ...e.product,
        quantity: Number(cekQty) || 0,
        subtotal: e.product?.price * Number(cekQty) || 0,
      };
      dataProduct[e.index] = result;
    }

    const findSubtotal = dataProduct.filter((x: any) => x?.subtotal);
    const cektotal = calculateTotal(findSubtotal);
    setstate(p => ({
      ...p,
      product: dataProduct,
      sum: cektotal,
      checkout: false,
    }));
  };

  const feedbackCheckout = () => {
    setstate(p => ({
      ...p,
      checkout: !state.checkout,
    }));
    setModalVisible(!isModalVisible);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{flex: 0}}>
        <Headers sumProduct={state.limit} />
      </View>
      {!state.loading ? (
        <View style={{flex: 1}}>
          <ListProduct
            checkout={e => calculated(e)}
            dataFilter={(e: any[]) =>
              setstate((p: any) => ({...p, product: e}))
            }
            data={state}
            more={(limit, skip) => more(limit, skip)}
            stateFirst={state}
          />
          <CheckoutButton
            total={state.sum}
            reset={() => fetchData()}
            feedBack={() => feedbackCheckout()}
          />
        </View>
      ) : (
        <Loading />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(!isModalVisible)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={{
                ...styles.successText,
                fontSize: 24,
                fontWeight: '900',
                color: '#262627',
              }}>
              Success!
            </Text>
            <Text style={styles.successText}>
              You have successfully purchased{' '}
              {state.product.filter((x: any) => x?.subtotal).length} products
              with a total of {currencyFormat(state.sum)}.
            </Text>
            <Text style={styles.instructionsText}>
              Click close to buy another modems.
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(!isModalVisible)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Loading() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        top: '-5%',
      }}>
      <Image
        source={require('./src/assets/mobile_black.png')}
        style={{
          width: '20%',
          height: '20%',
          resizeMode: 'contain',
          margin: 15,
        }}
      />
      <Text style={{fontWeight: '900'}}>Loading Product Data</Text>
      <Text style={{fontWeight: '500'}}>Please wait...</Text>
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  successText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 1,
  },
  instructionsText: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#3A4144',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 48,
    width: 279,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
