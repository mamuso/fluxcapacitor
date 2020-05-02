import React from "react";
import { CaptureGridContainer } from "./style";

interface Props {
  children: React.ReactNode;
}

export default function CaptureGrid(props: Props) {
  const { children } = props;
  return <CaptureGridContainer>{children}</CaptureGridContainer>;
}
