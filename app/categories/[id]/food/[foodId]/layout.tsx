import React from 'react'

const FoodLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='bg-beige'>{children}</div>
  )
}

export default FoodLayout