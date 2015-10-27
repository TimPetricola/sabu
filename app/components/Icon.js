import React from 'react'

const icons = {
  'upload': (
    <g>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
    </g>
  ),
  'download': (
    <g>
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </g>
  )
}

export default ({icon, className}) => (
  <svg
    className={className}
    fill='currentColor'
    viewBox='0 0 24 24'
    preserveAspectRatio='xMidYMid meet'
    fit
  >
    {icons[icon]}
  </svg>
)
