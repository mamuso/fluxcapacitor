import styled from "styled-components";
import theme from "~/components/Theme";

export const HeaderContainer = styled.header`
  display: grid;
  grid-template-columns: 60px auto;
  grid-template-rows: 60px;
  margin: 0;
  border-bottom: 1px solid ${theme.colors["border-primary"]};
`;
