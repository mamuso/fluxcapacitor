import React from "react";
import { LayoutContainer, InnerLayoutContainer } from "./style";

interface Props {
  children: React.ReactNode;
}

export default function Layout(props: Props) {
  const { children } = props;
  return (
    <LayoutContainer>
      <InnerLayoutContainer role="main">{children}</InnerLayoutContainer>
    </LayoutContainer>
  );
}
