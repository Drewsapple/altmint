import { useEffect, useState } from "react";
import { useBlockNumber, useProvider } from "wagmi";

const formatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

export const BlockInfo = () => {
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [timestamp, setTimestamp] = useState<number>(0);
  const provider = useProvider();

  useEffect(() => {
    if (provider && blockNumber) {
      provider
        .getBlock(blockNumber)
        .then((block) => {
          setTimestamp(block.timestamp);
        })
        .catch((err) => {
          console.error("Error fetching block", err);
        });
    }
  }, [provider, blockNumber]);

  return (
    <div className="flex">
      <div className="p-2 text-3xl my-auto">⛓️</div>
      <div className="p-2 my-auto w-min-content">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="mx-auto sm:mx-0">Block</div>
          <div className="mx-auto sm:mx-0 sm:pl-2">{`#${blockNumber}`}</div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="mx-auto sm:mx-0">Block Time</div>
          <div className="mx-auto sm:mx-0 sm:pl-2">{`${formatter.format(
            timestamp * 1000
          )}`}</div>
        </div>
      </div>
    </div>
  );
};
