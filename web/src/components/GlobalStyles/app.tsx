import { createGlobalStyle } from "styled-components";
import theme from "~/components/Theme";

const AppStyles = createGlobalStyle`
html {
  background: ${theme.colors["bg-primary"]};
}

`;

export default AppStyles;
