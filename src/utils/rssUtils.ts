// types for risk score fetching

export interface ScoreBlock {
  score: Score,
  assetInfo: {
    collateralFactor: number | null,
    tokenDown       : number | null,
    marketCap       : number | null,
  }
}

export interface Score {
  address   : string,
  symbol    : string,

  historical: number | string,
  volatility: number | string,
  crash     : number | string,
  liquidity : number | string,
  overall   : number | string
}