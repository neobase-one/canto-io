import { useEffect } from "react";
import { useBridgeStore } from "./stores/gravityStore";
import styled from "@emotion/styled";
import { useEthers } from "@usedapp/core";
import { useNetworkInfo } from "global/stores/networkInfo";
import SwitchBridging from "./components/SwitchBridging";
import cantoIcon from "assets/icons/canto-evm.svg";
import ethIcon from "assets/icons/ETH.svg";
import { ReactiveButton } from "./components/ReactiveButton";
import { ConvertTransferBox } from "./components/convertTransferBox";
import { TokenWallet } from "./components/TokenSelect";
import {
  UserGravityBridgeTokens,
  EmptySelectedETHToken,
  EmptySelectedNativeToken,
  UserConvertToken,
  BaseToken,
} from "./config/interfaces";
import { SelectedTokens, TokenStore } from "./stores/tokenStore";
import { formatUnits } from "ethers/lib/utils";
import { GeneralTransferBox } from "./components/generalTransferBox";
import { addNetwork } from "global/utils/walletConnect/addCantoToWallet";
import FadeIn from "react-fade-in";
import { Text } from "global/packages/src";
import bridgeIcon from "assets/icons/canto-bridge.svg";
import { useTransactionChecklistStore } from "./stores/transactionChecklistStore";
import { useBridgeTransactionPageStore } from "./stores/transactionPageStore";
import { updateLastBridgeInTransactionStatus } from "./utils/checklistFunctions";
import { BridgeChecklistBox } from "./components/BridgeChecklistBox";
import { BridgeInChecklistFunctionTracker } from "./config/transactionChecklist";
import { useBridgeEthToCantoInfo } from "./hooks/customBridgeInInfo";
import { useCustomConvertInfo } from "./hooks/customConvertInfo";

interface BridgeInProps {
  userEthTokens: UserGravityBridgeTokens[];
  gravityAddress: string | undefined;
  userConvertCoinNativeTokens: UserConvertToken[];
  selectedTokens: TokenStore["selectedTokens"];
  setToken: (token: BaseToken, selectedFrom: SelectedTokens) => void;
}
const BridgeIn = (props: BridgeInProps) => {
  const networkInfo = useNetworkInfo();
  const { switchNetwork, activateBrowserWallet } = useEthers();
  const selectedETHToken = props.selectedTokens[SelectedTokens.ETHTOKEN];
  const selectedConvertToken = props.selectedTokens[SelectedTokens.CONVERTIN];
  const bridgeStore = useBridgeStore();

  const {
    amount: ethToGBridgeAmount,
    setAmount: setEthToGBridgeAmount,
    bridgeButtonText,
    bridgeDisabled,
    sendEthToGBridge,
    stateApprove,
    stateCosmos,
    resetApprove,
    resetCosmos,
  } = useBridgeEthToCantoInfo(
    selectedETHToken,
    props.setToken,
    props.gravityAddress
  );

  const {
    amount: convertAmount,
    setAmount: setConvertAmount,
    convertButtonText,
    convertDisabled,
  } = useCustomConvertInfo(true, selectedConvertToken);

  //store for transactionchecklist
  const transactionChecklistStore = useTransactionChecklistStore();
  const completedTransactions =
    useBridgeTransactionPageStore().transactions.completedBridgeTransactions;

  function updateLastTransaction() {
    const currentTx = transactionChecklistStore.getCurrentBridgeInTx();
    if (currentTx) {
      updateLastBridgeInTransactionStatus(
        (status, txHash) =>
          transactionChecklistStore.updateCurrentBridgeInStatus(status, txHash),
        currentTx,
        bridgeStore.transactionType,
        Number(networkInfo.chainId),
        bridgeDisabled,
        completedTransactions,
        convertDisabled
      );
    }
  }

  useEffect(() => {
    if (!transactionChecklistStore.getCurrentBridgeInTx()) {
      transactionChecklistStore.addBridgeInTx();
    }
    updateLastTransaction();
  }, [
    transactionChecklistStore.getCurrentBridgeInTx()?.currentStep,
    bridgeStore.transactionType,
    convertDisabled,
    bridgeDisabled,
    completedTransactions,
    networkInfo.chainId,
  ]);

  return (
    <FadeIn wrapperTag={BridgeStyled}>
      <div className="title">
        <BridgeChecklistBox
          trackerList={BridgeInChecklistFunctionTracker}
          totalTxs={transactionChecklistStore.bridgeIn.transactions.length}
          currentStep={
            transactionChecklistStore.getCurrentBridgeInTx()?.currentStep ?? 0
          }
          addTx={transactionChecklistStore.addBridgeInTx}
          removeTx={transactionChecklistStore.removeBridgeInTx}
        />
        <Text
          type="title"
          size="title2"
          color="primary"
          style={{
            fontFamily: "Silkscreen",
            lineHeight: "3rem",
          }}
        >
          send funds to canto
        </Text>

        <Text
          type="text"
          color="primary"
          style={{
            margin: "0 1rem",
            fontSize: "14px",
            lineHeight: "20.3px",
          }}
        >
          funds are transferred in two steps through our canto bridge. <br /> it
          takes several minutes. for more details{" "}
          <a
            role="button"
            tabIndex={0}
            onClick={() =>
              window.open(
                "https://docs.canto.io/user-guides/bridging-assets/ethereum",
                "_blank"
              )
            }
            style={{
              color: "var(--primary-color)",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            read here
          </a>
          .
        </Text>
      </div>
      <SwitchBridging
        left={{
          icon: ethIcon,
          name: "Ethereum",
        }}
        right={{
          icon: cantoIcon,
          name: "EVM",
        }}
      />

      {bridgeStore.transactionType == "Bridge" && (
        <GeneralTransferBox
          tokenSelector={
            <TokenWallet
              tokens={props.userEthTokens}
              balance={"balanceOf"}
              activeToken={selectedETHToken}
              onSelect={(value) => {
                props.setToken(
                  value ?? EmptySelectedETHToken,
                  SelectedTokens.ETHTOKEN
                );
                resetCosmos();
                resetApprove();
              }}
            />
          }
          needAddressBox={false}
          from={{
            address: networkInfo.account,
            name: "ethereum",
            icon: ethIcon,
          }}
          to={{
            address: networkInfo.cantoAddress,
            name: "canto (bridge)",
            icon: bridgeIcon,
          }}
          networkName="ethereum"
          onSwitch={() => {
            activateBrowserWallet();
            switchNetwork(1);
          }}
          connected={1 == Number(networkInfo.chainId)}
          onChange={(amount: string) => setEthToGBridgeAmount(amount)}
          max={formatUnits(
            selectedETHToken.balanceOf,
            selectedETHToken.decimals
          )}
          amount={ethToGBridgeAmount}
          button={
            <ReactiveButton
              destination={networkInfo.cantoAddress}
              account={networkInfo.account}
              gravityAddress={props.gravityAddress}
              onClick={() => sendEthToGBridge(ethToGBridgeAmount)}
              approveStatus={stateApprove}
              cosmosStatus={stateCosmos}
              buttonText={bridgeButtonText}
              buttonDisabled={bridgeDisabled}
            />
          }
        />
      )}

      {bridgeStore.transactionType == "Convert" && (
        <ConvertTransferBox
          tokenSelector={
            <TokenWallet
              tokens={props.userConvertCoinNativeTokens}
              balance="nativeBalance"
              activeToken={selectedConvertToken}
              onSelect={(value) => {
                props.setToken(
                  value ?? EmptySelectedNativeToken,
                  SelectedTokens.CONVERTIN
                );
                resetCosmos();
                resetApprove();
              }}
            />
          }
          activeToken={selectedConvertToken}
          cantoToEVM={true}
          cantoAddress={networkInfo.cantoAddress}
          ETHAddress={networkInfo.account ?? ""}
          chainId={Number(networkInfo.chainId)}
          amount={convertAmount}
          onChange={(amount: string) => setConvertAmount(amount)}
          onSwitch={() => {
            activateBrowserWallet();
            addNetwork();
          }}
          convertButtonText={convertButtonText}
          convertDisabled={convertDisabled}
        />
      )}
    </FadeIn>
  );
};

export const BridgeStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 60px 0;
  flex-grow: 1;
  width: 100%;
  position: relative;
  @media (max-width: 1000px) {
    br {
      display: none;
    }
  }
`;
export default BridgeIn;
