import React from "react";
import { LayoutContainer, InnerLayoutContainer } from "./style";
import GlobalStyles from "~/components/GlobalStyles";

interface Props {
  children: React.ReactNode;
}

export default function Layout(props: Props) {
  const { children } = props;
  return (
    <LayoutContainer>
      <GlobalStyles.ResetStyles />
      <InnerLayoutContainer role="main">{children}</InnerLayoutContainer>
    </LayoutContainer>
  );
}
