import React from "react";
import { LayoutContainer, InnerLayoutContainer } from "./style";
import GlobalStyles from "~/components/GlobalStyles";
import Header from "~/components/Header";

interface Props {
  children: React.ReactNode;
}

export default function Layout(props: Props) {
  const { children } = props;
  return (
    <LayoutContainer>
      <GlobalStyles.ResetStyles />
      <Header />
      <InnerLayoutContainer role="main">{children}</InnerLayoutContainer>
    </LayoutContainer>
  );
}
