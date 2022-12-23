import {
  useAccount,
  useContract,
  useContractReads,
  useContractWrite,
  useFeeData,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import { abi as editionABI } from "../abis/SoundEditionV1_1";
import { abi as minterABI } from "../abis/MerkleDropMinter";
import { BigNumber, BigNumberish, ethers } from "ethers";
import { NFTMetadata } from "./NFTMetadata";
import { getProof } from "lanyard";
import { useMemo, useState } from "react";

export type MintContractProps = {
  editionAddress: `0x${string}`;
  editionId: BigNumberish;
};

type MintInfo = {
  merkleRootHash: `0x${string}`;
  startTime: number;
  endTime: number;
  price: BigNumber;
  totalMinted: number;
  maxMintable: number;
  maxMintablePerAccount: number;
  mintPaused: boolean;
};

// Sound Merkle Drop Minter contract address
const merkleDropMinterAddress = "0xeae422887230c0ffb91fd8f708f5fdd354c92f2f";

export function MintContract(props: MintContractProps) {
  const { address } = useAccount();
  const editionContract = {
    address: props.editionAddress,
    abi: editionABI,
  };

  const minterContract = {
    address: merkleDropMinterAddress,
    abi: minterABI,
  };
  const minter = useContract({ ...minterContract });

  // Stores info about this mint
  const [mintInfo, setMintInfo] = useState<MintInfo | undefined>(undefined);
  // Stores the merkleproof retrieved from landyard
  const [merkleProof, setMerkleProof] = useState<`0x${string}`[] | undefined>(
    undefined
  );

  const signer = useSigner();

  const {
    data: mintData,
    error,
    isSuccess,
  } = useContractReads({
    contracts: [
      {
        ...editionContract,
        functionName: "totalMinted",
      },
      {
        ...editionContract,
        functionName: "editionInfo",
      },
      {
        ...minterContract,
        functionName: "mintInfo",
        args: [props.editionAddress, BigNumber.from(props.editionId)],
      },
    ],
    onError(error) {
      console.error("Error Fetching mint data", error);
    },
    watch: true,
  });

  // update state for mintinfo
  useMemo(() => {
    setMintInfo(mintData?.[2]);
  }, [mintData]);

  // update state for merkle proof
  useMemo(() => {
    if (address && mintInfo) {
      getProof({
        merkleRoot: mintInfo.merkleRootHash,
        unhashedLeaf: address.toLowerCase(),
      }).then((res) => {
        setMerkleProof(res ? (res.proof as `0x${string}`[]) : undefined);
      });
    } else {
      setMerkleProof(undefined);
    }
  }, [mintInfo, address]);

  const fees = useFeeData({
    watch: true,
  });

  const { config: preparedWrite, error: preparedWriteError } =
    usePrepareContractWrite({
      ...minterContract,
      functionName: "mint",
      args: [
        props.editionAddress, // edition address
        BigNumber.from(props.editionId), // edition id
        1, // amount to mint
        merkleProof!, // merkle proof
        "0x0000000000000000000000000000000000000000", // affiliate address
      ],
      overrides: {
        value: mintInfo?.price,
        gasLimit: BigNumber.from(140000),
        // TODO: May need to be higher for multimint
        // informed by https://dune.com/0xdrewf/sound-merkledropmint-analysis
        maxFeePerGas: fees?.data?.gasPrice!,
        maxPriorityFeePerGas: fees?.data?.maxPriorityFeePerGas!,
      },
      chainId: 1,
    });
  const { write } = useContractWrite(preparedWrite);

  return (
    <div className="p-4 flex-1 md:w-3/4">
      <div className="card lg:card-side bg-base-300 w-full shadow-xl">
        <NFTMetadata address={props.editionAddress} />
        <div className="card-body p-4 mx-auto w-full">
          {isSuccess ? (
            <>
              <h2 className="text-xl font-bold">Mint Info</h2>
              <div className="p-4 m-auto w-max text-center">
                {merkleProof ? (
                  <h3 className="text-sm">Your address is in the allowlist</h3>
                ) : (
                  <h3 className="text-sm">
                    Couldn't prove address is in allowlist
                  </h3>
                )}
              </div>
              <div className="p-4 flex w-full card-actions justify-end">
                <div className="grow my-auto pr-2">
                  <h3 className="text-lg font-bold">{`${mintData?.[0]}/${mintData?.[1]?.editionMaxMintable} Minted`}</h3>
                  <progress
                    className="progress w-full"
                    value={mintData?.[0]?.toString()}
                    max={mintData?.[1]?.toString()}
                  />
                </div>
                <button className="btn btn-primary w-fit" onClick={() => write!() }>
                  Mint
                </button>
              </div>
            </>
          ) : (
            <p>Error in loading contract data</p>
          )}
        </div>
      </div>
    </div>
  );
}
