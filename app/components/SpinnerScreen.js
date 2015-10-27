import React from 'react'

import Spinner from './Spinner'

export default ({children}) => (
  <div className='centered-screen'>
    <Spinner />
    {
      children
        ? <div className='spinner-screen__caption'>
            {children}
          </div>
        : ''
    }

  </div>
)
