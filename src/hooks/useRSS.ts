import { useQuery } from "react-query";
import { ScoreBlock } from "utils/rssUtils";

export const letterScore = (totalScore: number | string) => {

  if (totalScore === "*") {
    return "*"
  } else {
    totalScore = totalScore as number
  }

  if (totalScore === 1 || totalScore === 0) {
    return "A";
  }

  if (totalScore === 2) {
    return "B";
  }

  if (totalScore === 3) {
    return "C";
  }

  if (totalScore === 4) {
    return "D";
  }

  if (totalScore === 5) {
    return "E";
  }

  if (totalScore === 6) {
    return "F";
  }

  if (totalScore === 7) {
    return "F";
  }

  else {
    return "UNSAFE"
  }
};

export const usePoolRSS = (poolId: string | number) => {
  const { data } = useQuery(
    poolId + " rss",
    () => {
      return fetch(
        // Since running the vercel functions requires a Vercel account and is super slow,
        // just fetch this data from the live site in development:
          "https://rari-rss.vercel.app/api/rss?poolID=" +
          poolId
      )
        .then((res) => res.json())
        .catch((e) => {
          console.log("Could not fetch RSS!");
          console.log(e);
        }) as Promise<RiskData>;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      // 1 day
      cacheTime: 8.64e7,
    }
  );

  return data;
};


export const assetScores = (rss: RiskData) => {
  const scores = rss.scores as ScoreBlock[];

  return scores.map( (score ) => {
    return ({
      symbol: score.score.symbol,
      score:  letterScore(score.score.overall)
    })
  })
}

type RiskData = {
  poolID: number | string,
  overallScore: number | string,
  multisigScore: { poolID: number | string, multisig: boolean }
  scores: ScoreBlock[]
  lastUpdated: string;
}
