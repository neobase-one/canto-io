import styled from "@emotion/styled";
import { HighlightButton, Text } from "cantoui";
import FadeIn from "react-fade-in";
import { toast } from "react-toastify";
import arrow from "../../../assets/right.svg";
import CopyIcon from "../../../assets/copy.svg";
import { truncateNumber } from "global/utils/utils";

interface Props {
  connected: boolean;
  tokenSelector: React.ReactNode;
  networkName: string;
  button: React.ReactNode;
  max: string;
  amount: string;
  from: {
    name: string;
    address?: string;
    icon?: string;
  };
  to: {
    name: string;
    address?: string;
    icon?: string;
  };
  onSwitch: () => void;
  onChange: (s: string) => void;
  //if we need to send to specific address
  needAddressBox: boolean;
  onAddressChange?: (s: string) => void;
}
function copyAddress(value: string | undefined) {
  navigator.clipboard.writeText(value ?? "");
  toast("copied address", {
    autoClose: 300,
  });
}
export const GeneralTransferBox = (props: Props) => {
  return (
    <FadeIn>
      <TransferBoxStyled disabled={!props.connected}>
        <div className="overlay">
          <HighlightButton
            className="switch"
            id="network-switch"
            onClick={props.onSwitch}
          >
            {!props.connected
              ? "switch to " + props.networkName
              : "connected to " + props.networkName}
          </HighlightButton>
        </div>
        <div className="row">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {props.from.icon && <img src={props.from.icon ?? ""} height={26} />}
            <Text type="text" color="white" align="left">
              {props.from.name}
            </Text>
          </div>
          <img
            style={{
              flex: "0",
            }}
            src={arrow}
            alt="right arrow"
            height={40}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <img src={props.to.icon ?? ""} height={26} />
            <Text type="text" color="white" align="right">
              {props.to.name}
            </Text>
          </div>
        </div>
        <div className="row">
          <Text
            type="text"
            color="white"
            align="left"
            onClick={() => copyAddress(props.from.address)}
            style={{ cursor: "pointer" }}
          >
            {props.from.address
              ? props.from.address.slice(0, 4) +
                "..." +
                props.from.address.slice(-4)
              : "retrieving wallet"}
            <img
              src={CopyIcon}
              style={{
                height: "22px",
                position: "relative",
                top: "5px",
                left: "4px",
              }}
            />
          </Text>
          <Text
            type="text"
            color="white"
            align="right"
            onClick={() => copyAddress(props.to.address)}
            style={{ cursor: "pointer" }}
          >
            {props.to.address
              ? props.to.address.slice(0, 4) +
                "..." +
                props.to.address.slice(-4)
              : "retrieving wallet"}{" "}
            <img
              src={CopyIcon}
              style={{
                height: "22px",
                marginLeft: "-6px",
                position: "relative",
                top: "5px",
              }}
            />
          </Text>
        </div>
        <div className="amount">
          {props.tokenSelector}

          <div className="amount-input">
            <Text type="text" align="left" color="primary">
              amount :
            </Text>
            <input
              autoComplete="off"
              type="number"
              name="amount-bridge"
              id="amount-bridge"
              placeholder="0.00"
              value={props.amount}
              onChange={(e) => props.onChange(e.target.value)}
            />
            {Number(props.max) < 0 ? (
              ""
            ) : (
              <div
                role="button"
                tabIndex={0}
                className="max"
                style={{ cursor: "pointer" }}
                onClick={() => props.onChange(props.max)}
              >
                max: {truncateNumber(props.max)}
              </div>
            )}
          </div>
        </div>
        {props.needAddressBox && (
          <input
            placeholder="gravity address (gravity...)"
            type="text"
            name="address"
            id="address"
            onChange={(e) => {
              if (props.onAddressChange) {
                props.onAddressChange(e.target.value);
              }
            }}
          />
        )}
        <div className="row">{props.button}</div>
      </TransferBoxStyled>
    </FadeIn>
  );
};

interface StyeldProps {
  disabled?: boolean;
}
export const TransferBoxStyled = styled.div<StyeldProps>`
  background-color: black;
  border-radius: 18px;
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 3rem;
  border: ${(props) => (props.disabled ? " 2px solid #333" : "2px solid #333")};

  /* border: ${(props) =>
    props.disabled ? " 1px solid #333" : "1px solid var(--primary-color)"}; */
  position: relative;

  .row {
    display: flex;
    /* gap: 1rem; */

    justify-content: space-between;
    filter: ${(props) => (props.disabled ? "grayscale(100%)" : "none")};

    align-items: center;
    & > * {
      /* flex-grow: 1; */
      flex: 1;
      flex-basis: 0;
    }
  }

  button {
    border-radius: 4px;
  }
  .overlay {
    background-color: #222222d2;
    border-radius: 18px;

    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    position: absolute;
    display: ${(props) => (props.disabled ? "grid" : "none")};
    justify-content: center;
  }
  .max {
    position: absolute;
    right: 2.55rem;
    bottom: 0px;
    font-size: 13px;
  }
  .token {
    display: flex;
    gap: 1rem;
  }

  .switch {
    width: 400px;

    color: ${({ disabled }) => (disabled ? "var(--warning-color)" : "")};
    border: ${({ disabled }) =>
      disabled ? "1px solid var(--warning-color)" : ""};
    background-color: ${({ disabled }) => (disabled ? "#382e1f" : "")};
    &:hover {
      background-color: ${({ disabled }) => (disabled ? "#2a2218" : "")};
    }
  }

  .amount {
    filter: ${(props) => (props.disabled ? "grayscale(100%)" : "none")};

    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding: 1.4rem;
    border: 1px solid #333;
    background-color: #0c0c0c;

    .amount-input {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #333;
      padding: 1rem;
      gap: 1rem;
    }
  }

  input[type="number"] {
    background-color: transparent;
    border: none;
    outline: none;
    color: var(--primary-color);
    text-align: right;
    font-size: 22px;
    width: 100px;
    border-bottom: 1px solid transparent;
    &::placeholder {
      color: var(--primary-darker-color);
    }
    &:focus,
    &:hover {
      border-bottom: 1px solid var(--primary-color);
    }

    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    &[type="number"] {
      -moz-appearance: textfield;
    }
  }
  #address {
    background-color: transparent;
    color: var(--primary-color);
    border: none;
    border-bottom: 1px solid var(--just-grey-color);
    text-align: center;
    font-size: 18px;
    &:focus {
      outline: none;
      border-bottom: 1px solid var(--primary-color);
    }
  }
`;