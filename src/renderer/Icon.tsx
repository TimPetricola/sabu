import React from "react";

const ICONS = {
  upload: (
    <>
      <path
        d="m21 6.5h-3l-2.5-5h-5l-2.5 3h-4l-3.5 5.5 3.5 4.5h16l2.5-3.5z"
        fill="#fff"
      />
      <path d="m22.5 11h-3l-1.5 1h-12l-2-2h-3.5l3.5 4.5h16z" fill="#cce7ff" />
      <g fill="none">
        <path
          d="m11.5 11.5v12"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m7.5 15.5 4-4 4 4"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m17.5 14.5h2.5l2.5-3.5-1.5-4.5h-3l-2.5-5h-5l-2.5 3h-4l-3.5 5.5 3.5 4.5h1.5"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m14.5 6.5h3.5"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path d="m0 0h24v24h-24z" />
      </g>
    </>
  ),
  hourglass: (
    <>
      <path d="m18.5 2.5-2.5-2h-8.5l-3 2v5l7 5 7-5z" fill="#fff" />
      <path d="m4.5 21.5 3 2h8.5l2.5-2v-4l-7-5-7 5z" fill="#fff" />
      <path d="m16 4.5h-4.5v8l7-5v-5l-.7.5z" fill="#cce7ff" />
      <path d="m11.5 12.5 7 5v4l-2.5 2h-4.5z" fill="#cce7ff" />
      <g fill="none">
        <path
          d="m7.5 4.5-3-2 3-2h8.5l2.5 2-2.5 2z"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m18.5 2.5v5l-7 5-7-5v-5"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m18.5 21.5v-4l-7-5-7 5v4l3 2h8.5z"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m14 7.5-2.5 2-2.5-2"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m16 21-4.5-1.5-4.5 1.5"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m11.5 15.5v1"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m11.5 18.5v1"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path d="m0 0h24v24h-24z" />
      </g>
    </>
  ),
  download: (
    <>
      <path d="m21.5 18-10 5.5-10-5.5v-11l10-5.5 10 5.5z" fill="#fff" />
      <path d="m19.5 16.5-8 4.5-8-4.5-2 1.5 10 5.5 10-5.5z" fill="#cce7ff" />
      <g fill="none">
        <path
          d="m15.5 13.5-4 4-4-4"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m11.5 17.5v-10"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m21.5 18-10 5.5-10-5.5v-11l10-5.5 10 5.5z"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path d="m0 0h24v24h-24z" />
      </g>
    </>
  ),
  done: (
    <>
      <path d="m21.5 18-10 5.5-10-5.5v-11l10-5.5 10 5.5z" fill="#fff" />
      <path
        d="m19.4 16.7-7.9 4.3-7.9-4.3-2.1 1.3 10 5.5 10-5.5z"
        fill="#cce7ff"
      />
      <g fill="none">
        <path
          d="m21.5 18-10 5.5-10-5.5v-11l10-5.5 10 5.5z"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m6 12.5 4.5 4 6.5-8"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path d="m0 0h24v24h-24z" />
      </g>
    </>
  ),
  robot: (
    <>
      <path d="m16 10.5 4-4-4-4h-9l-4 4 4 4z" fill="#fff" />
      <path d="m15.5 23.5h-8l-1.5-7.5 2.5-2.5h6l2.5 2.5z" fill="#fff" />
      <path d="m7.1 21.5.4 2h8l.4-2z" fill="#cce7ff" />
      <path d="m3 6.5 4 4h9l4-4h-2l-2.5 2.5h-8l-2.5-2.5z" fill="#cce7ff" />
      <path d="m10.5 7-1.5 1-1.5-1v-1.5l1.5-1 1.5 1z" fill="#cce7ff" />
      <path d="m12.5 7 1.5 1 1.5-1v-1.5l-1.5-1-1.5 1z" fill="#cce7ff" />
      <g fill="none">
        <path
          d="m16 10.5 4-4-4-4h-9l-4 4 4 4z"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m10.5 7-1.5 1-1.5-1v-1.5l1.5-1 1.5 1z"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m12.5 7 1.5 1 1.5-1v-1.5l-1.5-1-1.5 1z"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m11.5.5v2"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m15.5 23.5h-8l-1.5-7.5 2.5-2.5h6l2.5 2.5z"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m11.5 10.5v3"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m7.1 21.5h8.8"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m2.5 16 .5 3 3.4-1"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m.5 12.5v1.5l2 2 2-2v-1.5"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m20.5 16-.5 3-3.4-1.1"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path
          d="m22.5 12.5v1.5l-2 2-2-2v-1.5"
          stroke="#1078ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />
        <path d="m0 0h24v24h-24z" />
      </g>
    </>
  )
};

type Props = {
  icon: keyof typeof ICONS;
};

export default ({ icon }: Props) => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
  >
    {ICONS[icon]}
  </svg>
);
