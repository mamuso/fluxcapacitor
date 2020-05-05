import React from "react";
import { LogoContainer } from "./style";
import Link from "next/link";

export default function Logo() {
  return (
    <LogoContainer>
      <Link href="/">
        <a>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            fill="none"
            viewBox="0 0 60 60"
          >
            <mask
              id="a"
              width="60"
              height="60"
              x="0"
              y="0"
              maskUnits="userSpaceOnUse"
            >
              <path fill="#fff" d="M0 0h60v60H0z" />
            </mask>
            <g mask="url(#a)">
              <path
                stroke="#E17E4F"
                stroke-linecap="round"
                stroke-width="4"
                d="M-47 30h57"
              />
              <path
                stroke="#F6CD7B"
                stroke-linecap="round"
                stroke-width="4"
                d="M53 39h57M19 30h15M-1 21h22"
              />
              <path
                stroke="#E17E4F"
                stroke-linecap="round"
                stroke-width="4"
                d="M32 39h3M57 21h14"
              />
              <path
                stroke="#B0D5DC"
                stroke-linecap="round"
                stroke-width="4"
                d="M31 21h7M45 30h7M40 50h27M-17 10h27M5 39h19"
              />
              <path
                stroke="#E17E4F"
                stroke-linecap="round"
                stroke-width="4"
                d="M8 50h13M36 10h27"
              />
            </g>
          </svg>
        </a>
      </Link>
    </LogoContainer>
  );
}
