import { useAccount } from "wagmi";
import { HeaderBar } from "./components/HeaderBar";
import { MintContract } from "./components/MintContract";

export function App() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen w-full">
      <div className="sticky top-0 z-10">
        <HeaderBar />
      </div>
      <div className="p-4 m-auto">
        <div className="prose">
          <p className="py-2 text-xl font-bold">
            This website is a tool to mint NFTs using Sound Protocol's
            MerkleDropMinter contract.
          </p>
          <p className="py-2">
            If your wallet supports changing RPC endpoints, consider using{" "}
            <a
              className="text-secondary underline"
              href="https://docs.flashbots.net/flashbots-protect/rpc/quick-start#how-to-use-flashbots-protect-rpc-in-metamask"
            >
              Flashbots Protect
            </a>{" "}
            to submit your transaction to searchers. They will attempt to
            include it for 25 blocks (5 minutes), but not if it fails. This
            allows you to submit a transaction <i>before</i> the mint opens,
            effectively frontrunning the mint window.
          </p>
          <p className="py-2">
            Without this, your early transaction will probably be included
            despite failing, so you will need to wait to submit until you are
            certain that the mint will be open in the next block.
          </p>
        </div>
        {isConnected && (
          <div className="flex">
          <MintContract
            {...{
              editionAddress: "0xBfb33f1e522F9c02633F16BACF3f4F24dc4B8755",
              editionId: 473,
            }}
          />
          <MintContract
            {...{
              editionAddress: "0xBF6Cb74f15655865542668512B55668c35d7fc94",
              editionId: 361,
            }}
          />
          </div>
        )}
      </div>
    </div>
  );
}
