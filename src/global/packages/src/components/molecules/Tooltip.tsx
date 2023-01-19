import styled from "@emotion/styled";
import { ReactNode } from "react";
import Popup from "reactjs-popup";

interface Props {
  content: ReactNode;
  trigger: JSX.Element;
  position?: PopupPosition;
}

export declare type PopupPosition =
  | "top left"
  | "top center"
  | "top right"
  | "right top"
  | "right center"
  | "right bottom"
  | "bottom left"
  | "bottom center"
  | "bottom right"
  | "left top"
  | "left center"
  | "left bottom"
  | "center center";

const Tooltip = (props: Props) => {
  return (
    <Popup
      trigger={props.trigger}
      position={props.position ? props.position : "bottom center"}
      on={["hover", "focus"]}
      arrow={true}
      arrowStyle={{
        color: "rgba(217, 217, 217, 0.25)",
        backdropFilter: "blur(35px)",
      }}
    >
      <Styled>{props.content}</Styled>
    </Popup>
  );
};
const Styled = styled.div`
  background: rgba(217, 217, 217, 0.2);
  backdrop-filter: blur(35px);
  border-radius: 4px;
  padding: 8px 12px;
  color: white;
`;
export default Tooltip;
