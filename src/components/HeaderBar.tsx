import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BlockInfo } from "./BlockInfo";
import { GasInfo } from "./GasInfo";

export const HeaderBar = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 pt-2 w-full bg-primary text-zinc-100">
      <h1 className="text-2xl font-bold m-auto">AltMint</h1>
      <div className="lg:order-4 m-auto">
        <ConnectButton />
      </div>
    <div className="m-auto">
        <GasInfo />
    </div>
    <div className="m-auto">
        <BlockInfo />
    </div>
    </div>
  );
};
