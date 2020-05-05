import styled from "styled-components";
import theme from "~/components/Theme";

export const CaptureGridContainer = styled.ol`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-column-gap: 32px;
  grid-row-gap: 32px;
  margin: 0;
  padding-left: 64px;
  padding-right: 64px;
`;
