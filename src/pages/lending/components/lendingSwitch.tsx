import styled from "@emotion/styled";
import { Text } from "global/packages/src";
import Popup from "reactjs-popup";
import { ToolTipL } from "./Styled";
import { ToolTip } from "./Tooltip";
const Wrapper = styled.label`
  /* The switch - the box around the slider */
  position: relative;
  display: flex;
  margin: 0 auto;
  width: 52px;
  height: 28px;

  /* Hide default HTML checkbox */
  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .slider {
      background-color: var(--primary-color);
      &:before {
        background-color: black;
        border-radius: 50%;
        bottom: 3px;
      }

      &:hover {
        background-color: #06fc9ad7;
      }
      &:active {
        background-color: #053723;
      }
    }

    &:focus + .slider {
      box-shadow: 0 0 1px var(--primary-color);
    }

    &:checked + .slider:before {
      -webkit-transform: translateX(24px);
      -ms-transform: translateX(24px);
      transform: translateX(24px);
    }
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: black;

    &:hover {
      background-color: #13c27c3c;
    }
    &:active {
      background-color: #0e47304f;
    }
    border: 1px solid var(--primary-color);

    border-radius: 4px;
    -webkit-transition: 0.2s;
    transition: 0.2s;
    &:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 3px;
      background-color: var(--primary-color);
      -webkit-transition: 0.2s;
      transition: 0.2s;
      border-radius: 50%;
    }
  }
`;
interface Props {
  onChange: () => void;
  checked: boolean;
  disabled: boolean;
}

const DisabledWrapper = styled(Wrapper)`
  input {
    &:checked + .slider {
      background-color: #333;
      &:before {
        background-color: black;
      }

      &:hover {
        background-color: #0f4c34;
      }
      &:active {
        background-color: #053723;
      }
    }

    &:focus + .slider {
      box-shadow: 0 0 1px #333;
    }
  }

  /* The slider */
  .slider {
    background-color: black;

    &:hover {
      background-color: #737373;
    }
    &:active {
      background-color: #909090;
    }
    border: 1px solid #333;
    &:before {
      background-color: #333;
    }
  }
`;

const LendingSwitch = (props: Props) => {
  if (props.disabled) {
    return (
      <Popup
        trigger={
          <DisabledWrapper className="switch" data-for="foo">
            <input type="checkbox" checked={props.checked} />

            <span className="slider"></span>
          </DisabledWrapper>
        }
        position="bottom center"
        on={["hover", "focus"]}
        arrow={true}
        arrowStyle={{
          color: "rgba(217, 217, 217, 0.25)",
          backdropFilter: "blur(35px)",
        }}
      >
        <ToolTipL>
          <Text type="text" size="text4">
            this asset cannot
            <br /> be collateralised
          </Text>
        </ToolTipL>
      </Popup>
    );
  }
  return (
    <Wrapper
      className="switch"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <input
        type="checkbox"
        checked={props.checked}
        onChange={() => {
          props.onChange();
        }}
      />
      <span className="slider"></span>
    </Wrapper>
  );
};

export default LendingSwitch;
