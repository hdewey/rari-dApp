import { queuedRequest, uniswapFetchPairID } from '../../../src/utils/rssUtils';

// eslint-disable-next-line import/no-anonymous-default-export
export default async(blocks: number[], address: string): Promise<number[]> => {

  const pairID = await uniswapFetchPairID(address);

  // array of graphql queries
  const sets: string[] = await createQuery( pairID, blocks);

  const uniswapPrices: number[] = await queryUniswap(sets, blocks);
  
  return uniswapPrices
}

// This is going to look like shit. Fair warning...
const createQuery = async (pairID: string, blocks: number[]) => {

  // have to create massive queries to make batched requests to uniswap graphql

  let sets: string[] = await new Promise ( async (resolve) => {
    let segments: string[] = [];

    for (let i = 0; i < blocks.length; i++) {
    
      let block = blocks[i];

      segments.push(
        `set_${block}: pair(
          id: "${pairID}"
          block: {number: ${block}}
        ){
          token0Price
          token1Price
          token0 {
            symbol
          }
          token1 {
            symbol
          }
          reserve0
          reserve1
        }`
      );
    }
    resolve(segments as string[])
  });

  // wrap graphql query in {}
  return sets.map( (set) => {
    return `{ ${set} }`;
  });
}

const queryUniswap = async (sets: string[], blocks: number[]) => {

  const points = await Promise.all(sets.map( async (set) => {
    
    const point = await queuedRequest('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', 'uniswap-post', 'NA', set)
    return point as any;

  }))

  // flatten array from 2d to 1d
  let p: any[] = [].concat.apply([], points);

  return p.map( (pricedBlock, index) => {
    const queriedBlock = pricedBlock.data[`set_${blocks[index]}`];

    // make sure the token's prices are returned (not ETH. some pools have eth as token0 and some as token1)
    switch (queriedBlock.token1.symbol.toLowerCase()) {
      case 'weth':
        return queriedBlock.token1Price;
      default:
        return queriedBlock.token0Price;
    }
  })
};