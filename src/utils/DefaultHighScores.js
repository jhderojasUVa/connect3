export const DefaultHighScores = () => {
  let scores = []
  for (let i = 0; i < 10; i++) {
    // 10 scores
    scores.push({
      name: 'AAA',
      score: 10000 - i * 1000,
    })
  }

  return scores
}
