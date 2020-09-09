

export default function copyGrids(grid, numberOfCopys){
  let grids = Array(numberOfCopys).fill(grid.slice())
  return grids
}
