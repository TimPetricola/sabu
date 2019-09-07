import React from "react";

const ICONS = {
  upload: (
    <g>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
    </g>
  ),
  download: (
    <g>
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </g>
  ),
  done: (
    <g>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
    </g>
  ),
  spinner: (
    <g className="spinner-icon">
      <circle
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        cx="12"
        cy="12"
        r="10"
      ></circle>
    </g>
  )
};

type Props = {
  icon: keyof typeof ICONS;
  className: string;
};

export default ({ icon, className }: Props) => (
  <svg
    className={["icon", className].join(" ")}
    fill="currentColor"
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
  >
    {ICONS[icon]}
  </svg>
);
