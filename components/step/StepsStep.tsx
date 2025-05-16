import useFoodFormStore from '@/store/foodFormStore';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';


const StepsStep = () => {
  const { steps, addStep, updateStep, removeStep } = useFoodFormStore();
  
  return (
    <div>
      <p className='text-myGreen mb-4'>Étapes de préparation*</Text>
      
      {steps.map((step, index) => (
        <div key={index} className='mb-4'>
          <div className='flex-row items-center mb-1'>
            <p className='text-myGreen font-bold'>Étape {step.stepNumber}</Text>
            {steps.length > 1 && (
              <TouchableOpacity
                className='bg-myRed p-2 rounded-lg ml-auto'
                onPress={() => removeStep(index)}
              >
                <p className='text-beige'>Supprimer</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <TextInput
            placeholder="Description de l'étape"
            value={step.instruction}
            onChangeText={(text) => updateStep(index, text)}
            className='bg-white p-3 rounded-lg border border-myGreen'
            placeholderTextColor="#4A6741"
            multiline
            numberOfLines={4}
            style={{ textAlignVertical: 'top' }}
          />
        </View>
      ))}
      
      <TouchableOpacity
        className='bg-myGreen p-2 rounded-lg mb-4'
        onPress={addStep}
      >
        <p className='text-beige text-center'>Ajouter une étape</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StepsStep;