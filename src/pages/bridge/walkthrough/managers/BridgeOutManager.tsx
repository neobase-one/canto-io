import { formatUnits } from "ethers/lib/utils";
import { chain, convertFee, ibcFee, memo } from "global/config/cosmosConstants";
import { CantoMainnet } from "global/config/networks";
import { switchNetwork } from "global/utils/walletConnect/addCantoToWallet";
import {
  BridgeOutNetworkInfo,
  BridgeOutNetworks,
  BridgeOutNetworkData,
} from "pages/bridge/config/bridgeOutNetworks";
import {
  BaseToken,
  BridgeTransactionType,
  UserConvertToken,
  UserNativeTokens,
} from "pages/bridge/config/interfaces";
import { SelectedTokens } from "pages/bridge/stores/tokenStore";
import { BridgeTransactionStatus } from "pages/bridge/stores/transactionStore";
import { performBridgeCosmosTxAndSetStatus } from "pages/bridge/utils/bridgeCosmosTxUtils";
import { txConvertERC20 } from "pages/bridge/utils/convertCoin/convertTransactions";
import { txIBCTransfer } from "pages/bridge/utils/IBC/IBCTransfer";
import { convertStringToBigNumber } from "pages/bridge/utils/stringToBigNumber";
import BarIndicator from "../components/barIndicator";
import AmountPage from "../pages/amount";
import { CompletePage } from "../pages/complete";
import { ConfirmTransactionPage } from "../pages/confirmTxPage";
import SelectBridgeOutNetwork from "../pages/selectBridgeOutNetwork";
import SelectTokenPage from "../pages/selectToken";
import SwitchNetworkPage from "../pages/switchNetwork";
import { BridgeOutStep } from "../walkthroughTracker";

interface BridgeOutManagerProps {
  chainId: number;
  notEnoughCantoBalance: boolean;
  cantoAddress: string;
  currentStep: BridgeOutStep;
  canContinue: boolean;
  canGoBack: boolean;
  onPrev: () => void;
  onNext: () => void;
  currentConvertToken: UserConvertToken;
  convertTokens: UserConvertToken[];
  currentBridgeOutToken: UserNativeTokens;
  bridgeOutTokens: UserNativeTokens[];
  currentBridgeOutNetwork: BridgeOutNetworkInfo;
  bridgeOutNetworks: BridgeOutNetworkData;
  setBridgeOutNetwork: (network: BridgeOutNetworks) => void;
  setToken: (token: BaseToken, type: SelectedTokens) => void;
  amount: string;
  setAmount: (amount: string) => void;
  cosmosTxStatus: BridgeTransactionStatus | undefined;
  setCosmosTxStatus: (status: BridgeTransactionStatus | undefined) => void;
  restartWalkthrough: () => void;
  userCosmosSend: {
    address: string;
    setAddress: (s: string) => void;
  };
}
export const BridgeOutManager = (props: BridgeOutManagerProps) => {
  return (
    <>
      {(props.currentStep === BridgeOutStep.SWITCH_TO_CANTO ||
        props.currentStep === BridgeOutStep.SWITCH_TO_CANTO_2) && (
        <SwitchNetworkPage
          toChainId={CantoMainnet.chainId}
          fromChainId={props.chainId}
          onClick={() => switchNetwork(CantoMainnet.chainId)}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeOutStep.SELECT_CONVERT_TOKEN && (
        <SelectTokenPage
          bridgeType="OUT"
          tokenList={props.convertTokens}
          activeToken={props.currentConvertToken}
          tokenBalance="erc20Balance"
          onSelect={(token) => props.setToken(token, SelectedTokens.CONVERTOUT)}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeOutStep.SELECT_CONVERT_TOKEN_AMOUNT && (
        <AmountPage
          amount={props.amount}
          setAmount={props.setAmount}
          selectedToken={props.currentConvertToken}
          max={formatUnits(
            props.currentConvertToken.erc20Balance,
            props.currentConvertToken.decimals
          )}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}

      {props.currentStep === BridgeOutStep.CONVERT_COIN && (
        <ConfirmTransactionPage
          amount={props.amount}
          notEnoughCantoBalance={props.notEnoughCantoBalance}
          token={props.currentConvertToken}
          onTxConfirm={async () =>
            await performBridgeCosmosTxAndSetStatus(
              async () =>
                await txConvertERC20(
                  props.currentConvertToken.address,
                  convertStringToBigNumber(
                    props.amount,
                    props.currentConvertToken.decimals
                  ).toString(),
                  props.cantoAddress,
                  CantoMainnet.cosmosAPIEndpoint,
                  convertFee,
                  chain,
                  memo
                ),
              BridgeTransactionType.CONVERT_OUT,
              props.setCosmosTxStatus,
              props.currentConvertToken.name,
              props.amount,
              "canto evm",
              "canto bridge"
            )
          }
          txType={"Canto EVM -> Canto Bridge"}
          txShortDesc={`send ${props.amount} ${props.currentConvertToken.name}`}
          txStatus={props.cosmosTxStatus?.status}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}

      {props.currentStep === BridgeOutStep.SELECT_BRIDGE_OUT_NETWORK && (
        <SelectBridgeOutNetwork
          networks={props.bridgeOutNetworks}
          activeNetwork={props.currentBridgeOutNetwork}
          onSelect={(net) => props.setBridgeOutNetwork(net)}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
          userCosmosSend={props.userCosmosSend}
        />
      )}
      {props.currentStep === BridgeOutStep.SELECT_NATIVE_TOKEN && (
        <SelectTokenPage
          bridgeType="OUT"
          tokenList={props.bridgeOutTokens}
          activeToken={props.currentBridgeOutToken}
          tokenBalance="nativeBalance"
          onSelect={(token) => props.setToken(token, SelectedTokens.BRIDGEOUT)}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeOutStep.SELECT_NATIVE_TOKEN_AMOUNT && (
        <AmountPage
          amount={props.amount}
          setAmount={props.setAmount}
          selectedToken={props.currentBridgeOutToken}
          max={formatUnits(
            props.currentBridgeOutToken.nativeBalance,
            props.currentBridgeOutToken.decimals
          )}
          canContinue={props.canContinue}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
        />
      )}
      {props.currentStep === BridgeOutStep.SEND_TO_GRBIDGE && (
        <ConfirmTransactionPage
          amount={props.amount}
          notEnoughCantoBalance={props.notEnoughCantoBalance}
          token={props.currentBridgeOutToken}
          onTxConfirm={async () =>
            await performBridgeCosmosTxAndSetStatus(
              async () =>
                await txIBCTransfer(
                  props.userCosmosSend.address,
                  props.currentBridgeOutNetwork.channel,
                  convertStringToBigNumber(
                    props.amount,
                    props.currentBridgeOutToken.decimals
                  ).toString(),
                  props.currentBridgeOutToken.ibcDenom,
                  CantoMainnet.cosmosAPIEndpoint,
                  props.currentBridgeOutNetwork.endpoint,
                  props.currentBridgeOutNetwork.latestBlockEndpoint,
                  ibcFee,
                  chain,
                  memo,
                  props.currentBridgeOutNetwork.extraEndpoints
                ),
              BridgeTransactionType.BRIDGE_OUT,
              props.setCosmosTxStatus,
              props.currentBridgeOutToken.name,
              props.amount,
              "canto bridge",
              props.currentBridgeOutNetwork.name
            )
          }
          txType={"Canto Bridge -> " + props.currentBridgeOutNetwork.name}
          txShortDesc={`send ${props.amount} ${props.currentBridgeOutToken.name} to ${props.userCosmosSend.address}`}
          txStatus={props.cosmosTxStatus?.status}
          onNext={props.onNext}
          onPrev={props.onPrev}
          canGoBack={props.canGoBack}
          canContinue={props.canContinue}
        />
      )}
      {props.currentStep === BridgeOutStep.COMPLETE && (
        <CompletePage bridgeIn={false} restart={props.restartWalkthrough} />
      )}

      <BarIndicator
        stepAt={4}
        total={Object.keys(BridgeOutStep).length / 2}
        current={props.currentStep}
      />
    </>
  );
};
