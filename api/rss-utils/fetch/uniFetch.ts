// homemode fork of @sushiswap/sushi-data, forked to query uniswap subgraph
import uniData from 'uni-data';

// functions
import { uniswapFetchPairID } from '../mainUtils';

// types
import { SushiBlock } from '../mainUtils';

// eslint-disable-next-line import/no-anonymous-default-export
export default async(blocks: number[], address: string): Promise<number[]> => {

  const pairID = await uniswapFetchPairID(address);

  // returns an array of SushiBlocks for each block specified
  const tokenPrices:SushiBlock[] = await uniData
    .timeseries({blocks: blocks, target: uniData.exchange.pair}, {pair_address: pairID});

  // create array of soley price data
  const parsedPrices = tokenPrices.map( (sushiBlock: SushiBlock) => {
    switch (sushiBlock.data.token1.symbol.toLowerCase()) {
      case 'weth':
        return sushiBlock.data.token1Price;
      default:
        return sushiBlock.data.token0Price;
    }
  })

  return parsedPrices
}