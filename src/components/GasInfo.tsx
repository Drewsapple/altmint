import { formatEther } from "ethers/lib/utils.js";
import { useState } from "react";
import { useFeeData } from "wagmi";

export const GasInfo = () => {
  const { data } = useFeeData({ watch: true });
  //   const [baseFee, setBaseFee] = useState(data?.lastBaseFeePerGas);
  //   const [priorityFee, setPriorityFee] = useState(data?.maxPriorityFeePerGas);

  return (
    <div className="flex">
      <div className="p-2 text-3xl my-auto">⛽</div>
      <div className="p-2 my-auto w-min-content">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="mx-auto sm:mx-0" >Base Fee 🔥</div>
          <div className="mx-auto sm:mx-0 sm:pl-2">
            {`${data?.lastBaseFeePerGas?.div("1000000000")} gwei`}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="mx-auto sm:mx-0">Priority Fee 💰</div>
          <div className="mx-auto sm:mx-0 sm:pl-2">
            {`${data?.maxPriorityFeePerGas?.div("1000000000")} gwei`}
          </div>
        </div>
      </div>
    </div>
  );
};
