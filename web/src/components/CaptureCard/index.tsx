import React from "react";
import Link from "next/link";
import feather from "feather-icons";
import * as pluralize from "pluralize";
import {
  CaptureContainer,
  CaptureContentContainer,
  CaptureIcon,
  CaptureCount,
  CaptureImageContainer,
} from "./style";

interface Props {
  capture: any;
}

export default function Layout(props: Props) {
  return (
    <CaptureContainer key={props.capture.id}>
      <Link href="/page/[slug]" as={`/page/${props.capture.page.slug}`}>
        <a>
          <CaptureImageContainer>
            <img src={props.capture.urlmin} />
          </CaptureImageContainer>
          <CaptureContentContainer>
            <strong>{props.capture.page.slug}</strong>
            <CaptureCount
              title={`${props.capture.page.reportcount} ${pluralize(
                "capture",
                props.capture.page.reportcount
              )}`}
            >
              <CaptureIcon
                dangerouslySetInnerHTML={{
                  __html: feather.icons.camera.toSvg({
                    width: 16,
                    height: 16,
                  }),
                }}
              />
              {props.capture.page.reportcount}
            </CaptureCount>
          </CaptureContentContainer>
        </a>
      </Link>
    </CaptureContainer>
  );
}
