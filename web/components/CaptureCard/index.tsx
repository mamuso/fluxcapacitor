import React from "react";
import { CaptureContainer, CaptureImageContainer } from "./style";

interface Props {
  capture: any;
}

export default function Layout(props: Props) {
  return (
    <CaptureContainer key={props.capture.id}>
      <CaptureImageContainer>
        <img src={props.capture.urlmin} />
      </CaptureImageContainer>
      {props.capture.page.slug}
    </CaptureContainer>
  );
}
