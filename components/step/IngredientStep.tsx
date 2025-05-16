import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Dropdown } from 'react-native-element-dropdown';
import useFoodFormStore from '@/store/foodFormStore';

const IngredientsStep = () => {
  const { 
    ingredients, 
    addIngredient, 
    updateIngredient, 
    removeIngredient 
  } = useFoodFormStore();
  
  const allIngredients = useQuery(api.ingredients.getIngredients) || [];
  
  return (
    <div>
      <p className='text-myGreen mb-4'>Ingrédients*</Text>
      
      {ingredients.map((ingredient, index) => {
        const selectedIngredient = allIngredients.find(
          (ing) => ing._id === ingredient.ingredientId
        );
        
        return (
          <div key={index} className='mb-4'>
            <div className='flex-row items-center gap-x-2'>
              <div className='flex-1'>
                <Dropdown
                  data={allIngredients.map((ing) => ({ 
                    label: ing.name, 
                    value: ing._id 
                  }))}
                  placeholder="Sélectionnez un ingrédient"
                  value={ingredient.ingredientId}
                  onChange={(item) => {
                    updateIngredient(
                      index, 
                      item.value as Id<'ingredients'>, 
                      ingredient.quantity
                    );
                  }}
                  labelField="label"
                  valueField="value"
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 8,
                    padding: 10,
                    borderColor: '#4A6741',
                    borderWidth: 1,
                  }}
                  placeholderStyle={{ color: '#4A6741' }}
                  selectedTextStyle={{ color: 'black' }}
                />
              </View>
              
              <div className='flex-1 flex-row items-center gap-x-2'>
                <TextInput
                  placeholder="Quantité"
                  value={ingredient.quantity}
                  onChangeText={(text) => {
                    updateIngredient(
                      index, 
                      ingredient.ingredientId, 
                      text
                    );
                  }}
                  className='bg-white p-3 rounded-lg border border-myGreen flex-1'
                  placeholderTextColor="#4A6741"
                />
                
                <p className='text-myGreen w-10'>
                  {selectedIngredient ? selectedIngredient.unit : ''}
                </Text>
                
                {ingredients.length > 1 && (
                  <TouchableOpacity
                    className='bg-myRed p-2 rounded-lg'
                    onPress={() => removeIngredient(index)}
                  >
                    <p className='text-beige text-center'>x</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        );
      })}
      
      <TouchableOpacity
        className='bg-myGreen p-2 rounded-lg mb-4'
        onPress={addIngredient}
      >
        <p className='text-beige text-center'>Ajouter un ingrédient</Text>
      </TouchableOpacity>
    </View>
  );
};

export default IngredientsStep;