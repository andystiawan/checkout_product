/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

type listProduct = {
  data: any;
  more: (limit: number, skip: number) => void;
  dataFilter: (data: any[]) => void;
  checkout: (data: any) => void;
  stateFirst: any;
};

type ItemType = {
  id: string;
};

function currencyFormat(num: number) {
  return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

const filter = [
  {value: 'highestPrice', label: 'Highest Price'},
  {value: 'lowestPrice', label: 'Lowest Price'},
  {value: 'name', label: 'Name'},
  {value: '', label: 'Default'},
];

const height: number = Dimensions.get('window').height;
const width: number = Dimensions.get('window').width;

function ListProduct({
  data,
  more,
  dataFilter,
  checkout,
  stateFirst,
}: listProduct) {
  const initialState = {
    selectedSort: '',
    openFilter: false,
    refresh: false,
  };
  const [state, setstate] = useState(initialState);

  useEffect(() => {
    setstate(p => ({
      ...p,
      openFilter: stateFirst.checkout ? false : false,
    }));
  }, [stateFirst.checkout]);

  const handleSortChange = (sortOption: string) => {
    let sortedProducts: any = [...data?.product];

    switch (sortOption) {
      case 'highestPrice':
        sortedProducts.sort((a: any, b: any) => b.price - a.price);
        break;
      case 'lowestPrice':
        sortedProducts.sort((a: any, b: any) => a.price - b.price);
        break;
      case 'name':
        sortedProducts.sort((a: any, b: any) => a.title.localeCompare(b.title));
        break;
      default:
        more(data.limit, 0);
        // No sorting or default sorting logic
        break;
    }

    setstate(p => ({
      ...p,
      selectedSort: sortOption,
      openFilter: !state.openFilter,
    }));
    if (sortOption !== '') {
      dataFilter(sortedProducts);
    }
  };

  const filterSelect = () => {
    return filter.find(item => item.value === state.selectedSort);
  };

  const moreItem = () => {
    const limit = data?.limit + 10;
    const skip = data?.skip + 10;
    more(limit, skip);
    setstate(p => ({
      ...p,
      product: null,
      selectedSort: '',
      openFilter: false,
    }));
  };

  const filterNonSelected = () => {
    return filter.filter(item => item.value !== state.selectedSort);
  };

  const listHeaderComponent = () => {
    return (
      <View style={{alignItems: 'center', marginVertical: 10}}>
        <View style={styles.contentHeader}>
          <Image
            source={require('../assets/sort.png')}
            style={{
              resizeMode: 'contain',
              width: '4%',
              marginHorizontal: 5,
            }}
          />
          <Text>Sort By:</Text>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
              paddingHorizontal: 5,
            }}>
            <TouchableOpacity
              onPress={() =>
                setstate(p => ({
                  ...p,
                  openFilter: !state.openFilter,
                }))
              }
              style={styles.sort}>
              <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>
                {filterSelect()?.label}
              </Text>
              <Image
                resizeMode="contain"
                style={{width: '10%', height: '100%'}}
                source={require('../assets/arrow_bottom.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const listFooterComponent = () => {
    return (
      <View style={styles.listContainer}>
        {data?.total !== data?.limit && (
          <TouchableOpacity onPress={moreItem} style={styles.btnFooter}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              More Item ...
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderItem: ListRenderItem<ItemType> = ({item, index}: any) => {
    return (
      <View style={styles.item}>
        <View style={{flex: 1}}>
          <Text style={styles.textTitle}>{item.title}</Text>
          <Text style={styles.textPrice}>
            {currencyFormat(item?.price || 0)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 0.8,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F6F6F6',
            borderRadius: 8,
            paddingHorizontal: 10,
            height: '95%',
          }}>
          <TouchableOpacity
            disabled={item?.quantity < 1}
            onPress={() => {
              checkout({product: item, type: '-', index});
              setstate(p => ({
                ...p,
                openFilter: false,
              }));
            }}
            style={{
              ...styles.minus,
              backgroundColor: item?.quantity > 0 ? '#3A4144' : '#CFCFCF',
            }}>
            <Text style={styles.minusText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={{flex: 1, textAlign: 'center'}}
            defaultValue="0"
            value={item?.quantity?.toString() || '0'}
            onChangeText={e => {
              checkout({product: item, type: '', index, value: e});
              setstate(p => ({
                ...p,
                openFilter: false,
              }));
            }}
            keyboardType="numeric"
            keyboardAppearance="default"
          />
          <TouchableOpacity
            disabled={item?.quantity >= item?.stock}
            onPress={() => {
              checkout({product: item, type: '+', index});
              setstate(p => ({
                ...p,
                openFilter: false,
              }));
            }}
            style={{
              ...styles.plus,
              backgroundColor:
                item?.stock <= item?.quantity ? '#CFCFCF' : '#3A4144',
            }}>
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        onRefresh={() => {
          more(data?.limit, 0);
          setstate(p => ({...p, refresh: true}));
          setTimeout(() => {
            setstate(p => ({
              ...p,
              refresh: false,
              selectedSort: '',
              openFilter: false,
            }));
          }, 500);
        }}
        refreshing={state.refresh}
        ListHeaderComponent={listHeaderComponent}
        data={data?.product || []}
        renderItem={renderItem}
        onScroll={() => setstate(p => ({...p, openFilter: false}))}
        keyExtractor={item => item?.id?.toString()}
        ListFooterComponent={listFooterComponent}
      />
      {state.openFilter && (
        <View style={styles.dropDown}>
          {filterNonSelected().map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleSortChange(item.value)}
                style={styles.labelFilter}>
                <Text style={{fontWeight: 'bold', margin: 5}}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default ListProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: width,
    position: 'relative',
  },
  listContainer: {
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'white',
  },
  dropDown: {
    position: 'absolute',
    zIndex: 15,
    backgroundColor: 'white',
    minHeight: 100,
    minWidth: 120,
    borderRadius: 16,
    top: '15%',
    right: '5%',
    padding: 5,
    borderWidth: 0.5,
    borderColor: '#D3D3D3',
  },
  sort: {
    minWidth: '40%',
    backgroundColor: '#F0F0F0',
    paddingVertical: 5,
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderRadius: 16,
    justifyContent: 'space-between',
  },
  contentHeader: {
    backgroundColor: 'white',
    height: height * 0.1,
    width: '90%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  labelFilter: {
    borderBottomWidth: 2,
    borderBottomColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    margin: 10,
    flexDirection: 'row',
  },
  textTitle: {fontWeight: '900', color: '#3A4144'},
  textPrice: {fontWeight: '700', color: '#7D8285'},
  btnFooter: {
    backgroundColor: 'red',
    height: height * 0.05,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  plus: {
    borderRadius: 4,
    backgroundColor: '#3A4144',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  plusText: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontSize: height * 0.045,
    margin: 0,
    padding: 0,
    lineHeight: height * 0.05,
  },
  minus: {
    borderRadius: 4,
    backgroundColor: '#CFCFCF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  minusText: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontSize: height * 0.045,
    margin: 0,
    padding: 0,
    lineHeight: height * 0.05,
  },
});
