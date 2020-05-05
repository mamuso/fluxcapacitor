import styled from "styled-components";
import theme from "~/components/Theme";

export const CaptureContainer = styled.li`
  border: 1px solid ${theme.colors["border-primary"]};
  border-radius: ${theme.radius};
  list-style: none;
  overflow: hidden;
`;

export const CaptureContentContainer = styled.div`
  border-bottom: 1px solid ${theme.colors["border-primary"]};
  font-size: ${theme.fontSizes[0]};
  display: grid;
  grid-template-columns: auto 40px;
  line-height: ${theme.lineHeights.heading};
  padding: 12px;
`;

export const CaptureCount = styled.div`
  color: ${theme.colors["bg-tertiary"]};
  font-size: ${theme.fontSizes[0]};
  text-align: right;
`;

export const CaptureIcon = styled.span`
  color: ${theme.colors["bg-tertiary"]};
  display: inline-block;
  margin-right: 4px;
  vertical-align: middle;
`;
export const CaptureImageContainer = styled.div`
  background-color: ${theme.colors["bg-primary"]};
  height: 0;
  max-width: 100%;
  padding-bottom: 65%;
  & img {
    max-width: 100%;
  }
`;
