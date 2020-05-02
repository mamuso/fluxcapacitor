import styled from "styled-components";
import theme from "~/components/Theme";

export const CaptureContainer = styled.li`
  list-style: none;
`;
export const CaptureImageContainer = styled.div`
  max-width: 100%;
  height: 0;
  padding-bottom: 65%;
  background-color: ${theme.colors["bg-primary"]};
  border-radius: 6px;
  overflow: hidden;
  & img {
    max-width: 100%;
  }
`;
