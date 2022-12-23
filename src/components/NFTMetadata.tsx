import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { useContractReads } from "wagmi";
import { abi as editionABI } from "../abis/SoundEditionV1_1";

const convertURL = (urlString: string) => {
  const url = new URL(urlString);
  if (url.protocol === "ipfs:") {
    return `https://ipfs.io/ipfs/${url.pathname.substring(2)}`;
  } else if (url.protocol === "ipns:") {
    return `https://ipfs.io/ipns/${url.pathname.substring(2)}`;
  } else if (url.protocol === "ar:") {
    return `https://arweave.net/${url.pathname.substring(2)}`;
  } else {
    return urlString;
  }
}


const getMetadata = async (urlString: string | undefined) => {
  if (!urlString) {
    return;
  }

  let metadataURL = convertURL(urlString);
  const metadata = await (await fetch(metadataURL)).json();
  return metadata;
};

export type NFTMetadataProps = {
  address: `0x${string}`; // contract address
};

export function NFTMetadata(props: NFTMetadataProps) {
  const [metadata, setMetadata] = useState<any>();
  
  const { data, error, isSuccess } = useContractReads({
    contracts: [
      {
        address: props.address,
        abi: editionABI,
        functionName: "contractURI",
      },
      {
        address: props.address,
        abi: editionABI,
        functionName: "tokenURI",
        args: [BigNumber.from(1)],
      },
    ],
    onError(error) {
      console.error("Error", error);
    },
    onSettled() {
      console.log("loaded nft metadata")
    }
    });
    
  useEffect(() => {
    try {
      getMetadata(data?.[1] as any).then((value) => {
        setMetadata(value)
      });
    }
    catch (error){
      console.error("Error", error);
    }
  }, [data?.[1]]);

  return (
    <>
      {isSuccess && metadata && (
        <div className="flex-col p-4">
          <h2 className="card-title text-2xl font-black pb-4 m-auto w-full min-w-min max-w-max">{metadata.title.trim()}</h2>
          <figure>
            <img src={convertURL(metadata.image)} width={250} height={250} />
          </figure>
        </div>
      )}
    </>
  )

}
