import { useState } from "react";
import {
  allBridgeOutNetworks,
  BridgeOutNetworkInfo,
} from "../config/gravityBridgeTokens";
import { UserNativeTokens } from "../config/interfaces";
import { useTokenStore } from "../stores/tokenStore";
import { getBridgeOutButtonText } from "../utils/reactiveButtonText";
import { convertStringToBigNumber } from "../utils/stringToBigNumber";

interface BridgeOutProps {
  amount: string;
  setAmount: (amount: string) => void;
  bridgeOutNetwork: BridgeOutNetworkInfo;
  userCosmosAddress: string;
  setUserCosmosAddress: (address: string) => void;
  bridgeButtonText: string;
  bridgeDisabled: boolean;
}
export function useCustomCantoToCosmosInfo(
  selectedNativeToken: UserNativeTokens
): BridgeOutProps {
  const tokenStore = useTokenStore();
  const bridgeOutNetwork = allBridgeOutNetworks[tokenStore.bridgeOutNetwork];
  const [amount, setAmount] = useState<string>("");
  const [userCosmosAddress, setUserCosmosAddress] = useState("");

  const [bridgeButtonText, bridgeDisabled] = getBridgeOutButtonText(
    convertStringToBigNumber(amount, selectedNativeToken.decimals),
    selectedNativeToken,
    selectedNativeToken.nativeBalance,
    bridgeOutNetwork.checkAddress(userCosmosAddress)
  );
  return {
    amount,
    setAmount,
    bridgeOutNetwork,
    userCosmosAddress,
    setUserCosmosAddress,
    bridgeButtonText,
    bridgeDisabled,
  };
}
