import styled from "@emotion/styled";
import { OutlinedButton, PrimaryButton, Text } from "global/packages/src";
import { TokenWallet } from "pages/bridge/components/TokenSelect";
import { BaseToken } from "pages/bridge/config/interfaces";
import BaseStyled from "./layout";

interface SelectTokenProps {
  bridgeType: "IN" | "OUT";
  tokenBalance: string;
  tokenList: BaseToken[];
  activeToken: BaseToken;
  onSelect: (token: BaseToken) => void;
  canContinue: boolean;
  onPrev: () => void;
  onNext: () => void;
  canGoBack: boolean;
}
const SelectTokenPage = (props: SelectTokenProps) => {
  return (
    <Styled>
      <header>
        <Text type="title" size="title2">
          Bridge {props.bridgeType == "IN" ? "in" : "out"} Token
        </Text>
        <div>
          <Text type="text" size="title3" bold>
            Select the token you&#39;d like to bridge{" "}
            {props.bridgeType == "IN" ? "in" : "out"}
          </Text>
          <Text type="text" size="text3">
            please make sure the token you select has a balance
          </Text>
        </div>
      </header>
      <section>
        <div className="wallet">
          <TokenWallet
            tokens={props.tokenList}
            activeToken={props.activeToken}
            onSelect={(token) => props.onSelect(token ?? props.activeToken)}
            balance={props.tokenBalance}
          />
        </div>
      </section>
      <footer>
        <div className="row">
          <OutlinedButton onClick={props.onPrev} disabled={!props.canGoBack}>
            Prev
          </OutlinedButton>
          <PrimaryButton
            onClick={props.onNext}
            disabled={!props.canContinue}
            weight="bold"
          >
            Next
          </PrimaryButton>
        </div>
      </footer>
    </Styled>
  );
};

const Styled = styled(BaseStyled)`
  padding: 2rem;
  justify-content: center;

  .wallet {
    width: 20rem;
    & > div {
      border: 1px solid #333;
      border-radius: 4px;
    }
  }
`;

export default SelectTokenPage;
