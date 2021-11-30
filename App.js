import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import { Header, Input, Button, Icon, ListItem } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';


export default function App() {

  const [product, setProduct] = useState('')
  const [amount, setAmount] = useState('')
  const [shoppings, setShoppings] = useState([])

  const db = SQLite.openDatabase('shoppingsdb.db'); 

  useEffect(()=> {
    db .transaction(tx  => {
      tx.executeSql('create table if not exists shopping (id integer primary key not null, product text, amount text);');
    }, null, updateList);
  }, []);

  
  const saveShopping = () => {
    db.transaction(tx => {
        tx.executeSql('insert into shopping (product, amount) values (?, ?);', [product, amount]);    
      }, null, updateList
    )

    setProduct('')
    setAmount('')
  }

  
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shopping;', [], (_, { rows }) =>
        setShoppings(rows._array)
      ); 
    });    
  }

  
  const deleteShopping = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from shopping where id = ?;`, [id]);
      }, null, updateList
    )    
  }


    return (
      <View style={styles.container}>

        <Header
          centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }}
        />
        <Input
            placeholder='Product'
            label='PRODUCT' 
            onChangeText={product => setProduct(product)}
            value={product}          
        />
        <Input
            placeholder='Amount' 
            label='AMOUNT'
            onChangeText={amount => setAmount(amount)}
            value={amount}          
        />
        
              
          <Button raised icon={
            <Icon
              name="save"
              size={20}
              color="white"
              marginRight={5}
            />}
            buttonStyle={{width: 150, padding:10}}
            onPress={saveShopping} 
            title="SAVE"
          />

        
        <View style={{width:'90%'}}>

          <FlatList
            keyExtractor={item => item.id.toString()}
            data={shoppings}
            renderItem={({item}) => 
              
              <ListItem bottomDivider>
                <ListItem.Content>
                  <ListItem.Title> {item.product} </ListItem.Title>
                  <ListItem.Subtitle> {item.amount} </ListItem.Subtitle>
                </ListItem.Content>
                <Icon
                  color='red'
                  name='delete'
                  type='material'
                  onPress={() => deleteShopping(item.id)}

                />
              </ListItem>}     
          />   
        
        </View>

        <StatusBar style="auto" />
      </View>
    ); 
        
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    
  },
  
  text: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  
});