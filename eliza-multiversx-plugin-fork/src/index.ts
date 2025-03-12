import type { Plugin } from "@elizaos/core";
import transfer from "./actions/transfer";
import createToken from "./actions/createToken";
import swap from "./actions/swap";
import createLiquidityPool from "./actions/createLiquidityPool";

export const multiversxPlugin: Plugin = {
    name: "multiversx",
    description: "MultiversX Plugin for Eliza",
    actions: [transfer, createToken, swap, createLiquidityPool],
    evaluators: [],
    providers: [],
};

export default multiversxPlugin;
