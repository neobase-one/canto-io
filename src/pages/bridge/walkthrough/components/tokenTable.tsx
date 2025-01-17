import styled from "@emotion/styled";
import { BigNumber } from "ethers";
import { Text } from "global/packages/src";
import close from "assets/icons/close.svg";
interface Props {
  tokens: {
    name: string;
    main: string;
    gBridge: string;
    canto: string;
  }[];
  onClose: () => void;
}
const TokenTable = ({ tokens, onClose }: Props) => {
  return (
    <Styled>
      <Text
        type="title"
        align="left"
        style={{
          marginBottom: "1rem",
        }}
      >
        Token Balances
      </Text>
      <div role="button" tabIndex={0} onClick={onClose}>
        <img
          src={close}
          style={{
            position: "absolute",
            top: "1.4rem",
            right: "1rem",
            width: "24px",
            cursor: "pointer",
          }}
        />
      </div>

      <div className="table">
        <Text type="text" size="title3">
          token
        </Text>
        <Text type="text" size="title3">
          ethereum
        </Text>
        <Text type="text" size="title3">
          bridge
        </Text>
        <Text type="text" size="title3">
          canto
        </Text>
        {tokens.map((token) => (
          <>
            <Text type="text" color="white" size="title3">
              {token.name}
            </Text>
            <Text type="text" color="white" size="title3">
              {token.main}
            </Text>
            <Text type="text" color="white" size="title3">
              {token.gBridge}
            </Text>
            <Text type="text" color="white" size="title3">
              {token.canto}
            </Text>
          </>
        ))}
      </div>
    </Styled>
  );
};

const Styled = styled.div`
  padding: 2rem;
  .table {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1rem;
    border: 1px solid #222;
    background-color: #111;
    border-radius: 4px;
    grid-gap: 0;
    & > * {
      border: 1px solid #1e1e1e;
      padding: 1rem;
    }
  }

  @media (max-width: 1000px) {
    width: 100%;
    p {
      font-size: 14px;
    }
  }
`;
export default TokenTable;
