import React, {useState, useEffect} from 'react'
import * as tf from '@tensorflow/tfjs'
import './LawnMowerAI.css'
import Block from './Block/Block'
import NeuralNetwork from './nn'
import copyGrids from './copyGrids'


// take a new path,
// make the Grids not copy off grid




const TOTAL = 20;
// let START_NODE_COL= 3;
// let START_NODE_ROW= 4;
let mowerPos_Row = Array(TOTAL).fill(1);
let mowerPos_Col = Array(TOTAL).fill(0);
let topFitness = 0;
let count = 0;
const x = 15;
const y = 10;
//add number of times mowed over to the grid
// make it so you can't place a wall on the mower

//Mowers are the individual ais
let Mowers = []

let savedMowers =[]


// Grids will be for keeping all the grids the ais are working on

let Grids = []


export default function LawnMowerAI() {
const [grid, setGrid] = useState(getInitialGrid(x,y))// chage the intial state so it is from the Grids var
const [mouseIsPressed, setMouseIsPressed] = useState(false)
let inputs = Array(6)

useEffect(() => {
  Grids = Array(TOTAL).fill(getInitialGrid(x,y))

    // Grids[0]= grid.slice()
    // // for (let i = 0; i < TOTAL; i++) {
    // //   Grids[i]=Grids[0]
    // // }
    // console.log('Grids',Grids);
}, [])

function setup() {
  count +=1
  tf.setBackend('cpu');
//  const f = Grids[0].slice()
  Grids = copyGrids(grid, TOTAL)
  console.log('Grids', Grids)
  for (let i = 0; i < TOTAL; i++) {
//    Grids[i] = f
    mowerPos_Row[i] = mowerPos_Row[0]
    mowerPos_Col[i] = mowerPos_Col[0]
    Mowers[i] = new NeuralNetwork(6,20,4);
  }
  Grids[1][0][0].isStart =true;

  //setInterval(()=>moveUp(0), 3000)
}

function calculateInputs(gridNumber){
    inputs[0] = (y - mowerPos_Row[0])/y
    inputs[1] = (x - mowerPos_Col[0])/x
    inputs[2] = distanceTowallRight(gridNumber)
    inputs[3] = distanceTowallLeft(gridNumber)
    inputs[4] = distanceTowallUp(gridNumber)
    inputs[5] = distanceTowallDown(gridNumber)
}

//this part has to go inside a function as this is controlled by state currently
//
let brain = 0
// if(brain) {
//     brain = brain.copy()
// }else {
//     let brain = new NeuralNetwork(6, 20, 4)
//     let output = brain.predict(inputs)
//     console.log('output', output)
// }


console.log('Grids', Grids)
console.log('row, col',mowerPos_Row,mowerPos_Col);

function distanceTowallRight(gridNumber){

for(let i = mowerPos_Col[gridNumber]; i<x; i++){
    console.log('mowerPos_Col', mowerPos_Col)
    console.log('Grids', Grids) //Grids is not initialized
    if(Grids[gridNumber][mowerPos_Row[gridNumber]][i].isWall){
        return (i - mowerPos_Col[gridNumber]-1)/(x-mowerPos_Col[gridNumber]-1);
    }
}
return 1;
}

function distanceTowallLeft(gridNumber){

for(let i = mowerPos_Col[gridNumber]; i >= 0; i--){
    if(Grids[gridNumber][mowerPos_Row[gridNumber]][i].isWall){
        return (mowerPos_Col[gridNumber]-i-1)/(mowerPos_Col[gridNumber]);
    }
}
return 1;
}

function distanceTowallUp(gridNumber){

for(let i = mowerPos_Row[gridNumber]; i >= 0; i--){
    if(Grids[gridNumber][i][mowerPos_Col[gridNumber]].isWall){
        return (mowerPos_Row[gridNumber]-i-1)/(mowerPos_Row[gridNumber]);
    }
}

return 1;
}

function distanceTowallDown(gridNumber){
//     for(let i = START_NODE_ROW; i<y; i++){
//     if(grid[i][START_NODE_COL].isWall){
//         return (i - START_NODE_ROW-1)/(y-START_NODE_ROW-1);
//     }
// }
for(let i = mowerPos_Row[gridNumber]; i<y; i++){
    if(Grids[gridNumber][i][mowerPos_Col[gridNumber]].isWall){
        return (i - mowerPos_Row[gridNumber]-1)/(y-mowerPos_Row[gridNumber]-1);
    }
}
return 1;
}



function moveRight(gridNumber) {

  if (mowerPos_Col[gridNumber]+1 === x) return;
  if (Grids[gridNumber][mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]+1].isWall) return;
  const newGrid = Grids[gridNumber].slice() //problem here possibly
  const prevStartNode = Grids[gridNumber][mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]]
  const newPrevStartNode = {...prevStartNode, isStart:false, isMowed: true}
  newGrid[mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]] = newPrevStartNode
  mowerPos_Col[gridNumber] +=1
  const newStartNode = Grids[gridNumber][mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]]
  const newnewStartNode = {...newStartNode, isStart: true}
  console.log(newnewStartNode);
  console.log(newGrid);
  //newGrid[mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]] = newnewStartNode
  //Grids[gridNumber] = newGrid
  console.log('Grids', Grids)
  console.log('grid', grid);
//if(gridNumber===0) setGrid(Grids[gridNumber]);
}

function moveLeft(gridNumber) {

    if (mowerPos_Col[gridNumber] === 0) return;
    if (Grids[gridNumber][mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]-1].isWall) return;
    const newGrid = Grids[gridNumber].slice()
    const prevStartNode = Grids[gridNumber][mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]]
    const newPrevStartNode = {...prevStartNode, isStart:false, isMowed: true}
    newGrid[mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]] = newPrevStartNode
    mowerPos_Col[gridNumber] -=1
    const newStartNode = Grids[gridNumber][mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]]
    const newnewStartNode = {...newStartNode, isStart: true}
    newGrid[mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]] = newnewStartNode
    Grids[gridNumber] = newGrid

    if(gridNumber===0) setGrid(Grids[gridNumber]);
}

function moveUp(gridNumber) {

    if (mowerPos_Row[gridNumber] === 0) return;
    if (Grids[gridNumber][mowerPos_Row[gridNumber]-1][mowerPos_Col[gridNumber]].isWall) return;
    const newGrid = Grids[gridNumber].slice()
    const prevStartNode = Grids[gridNumber][mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]]
    const newPrevStartNode = {...prevStartNode, isStart:false, isMowed: true}
    newGrid[mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]] = newPrevStartNode
    mowerPos_Row[gridNumber] -=1
    const newStartNode = Grids[gridNumber][mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]]
    const newnewStartNode = {...newStartNode, isStart: true}
    newGrid[mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]] = newnewStartNode
    Grids[gridNumber] = newGrid

    if(gridNumber===0) setGrid(Grids[gridNumber]);
}

function moveDown(gridNumber) {

    if (mowerPos_Row[gridNumber] +1 === y) return;
    if (Grids[gridNumber][mowerPos_Row[gridNumber]+1][mowerPos_Col[gridNumber]].isWall) return;
    const newGrid = Grids[gridNumber].slice()
    const prevStartNode = Grids[gridNumber][mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]]
    const newPrevStartNode = {...prevStartNode, isStart:false, isMowed: true}
    newGrid[mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]] = newPrevStartNode
    mowerPos_Row[gridNumber] +=1
    const newStartNode = Grids[gridNumber][mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]]
    const newnewStartNode = {...newStartNode, isStart: true}
    newGrid[mowerPos_Row[gridNumber]][mowerPos_Col[gridNumber]] = newnewStartNode
    Grids[gridNumber] = newGrid

    if(gridNumber===0) setGrid(Grids[gridNumber]);

}



function handleMouseDown(row, col) {
    setMouseIsPressed(true)
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);

}

function handleMouseEnter(row, col) {
  if (!mouseIsPressed) return;
  const newGrid = getNewGridWithWallToggled(grid, row, col);
  setGrid(newGrid)
}

function handleMouseUp() {
     setMouseIsPressed(false)
}


//problem could be here
const getNewGridWithWallToggled = (grid, row, col) => {
  // make this so its each individual grid
  //gridNumber?
  //mousehandle down
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}


    return (
        <div>
            <button onClick = {() => moveRight(0)}>Move Right</button>
            <button onClick = {() => moveLeft(0)}>Move Left</button>
            <button onClick = {() => moveUp(0)}>Move Up</button>
            <button onClick = {() => moveDown(0)}>Move Down</button>

        <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const {row, col, isFinish, isStart, isWall, isMowed} = node;
                return (
                  <Block
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    isMowed={isMowed}
                    mouseIsPressed={mouseIsPressed}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                    onMouseUp={() => handleMouseUp()}
                    row={row}>
                    </Block>
                );
              })}
            </div>
          );
        })}
      </div>
      <button onClick = {() => setGrid(clearGrid(x,y))}>clear board</button>
        <button onClick = {() => setup()}>Start Training</button>
        <div>Training count: {count}</div>
      </div>

    )



function clearGrid(x,y) {
  const grids = [];
  for (let row = 0; row < y; row++) {
      const currentRow = [];
      for (let col = 0; col < x; col++) {
        currentRow.push(createBlock(col, row));
      }
      grids.push(currentRow);
    }
    return grids;
}

function move(outputs, gridnumber) {
  const i = outputs.indexOf(Math.max.apply(null, outputs))
  console.log('i', i)
  if(i ===0) moveRight(gridnumber);
  if(i ===1) moveLeft(gridnumber);
  if(i ===2) moveUp(gridnumber);
  if(i ===3) moveDown(gridnumber);
  //setGrid(Grids[0])
}

function nextGeneration() {
    console.log('next generation');
    calculateFitness();
    for (let i = 0; i < TOTAL; i++) {
      Mowers[i] = pickOne();
    }
    for (let i = 0; i < TOTAL; i++) {
      savedMowers[i].dispose();
    }
    savedMowers = [];
  }

function pickOne() {

  //fitness function goes here
  for (let i = 0; i < Grids.length; i++) {
      let fitness = calculateFitness(i);
      if (fitness>topFitness) {
          topFitness = fitness
      }
  }
  //get index of the topFitness mower
  let index = 0;
  let r = Math.random(1);
  while (r > 0) {
    r = r - savedMowers[index].fitness;
    index++;
  }
  index--;
  let Mower = savedMowers[index];
  let child = new NeuralNetwork(brain)
  child.mutate();
  return child;
}

function calculateFitness(gridNumber) {
    let unmowedBlocks = 0;
    let mowedBlocks = 0;
      for (let row = 0; row < y; row++) {
        for (let col = 0; col < x; col++) {
            if(Grids[gridNumber][row][col].isMowed){
                mowedBlocks += 1
            }
            else if(!(Grids[gridNumber][row][col].isWall)){
                unmowedBlocks+=1
            }

        }
      }
      let fitness = mowedBlocks/ (unmowedBlocks + mowedBlocks)
      console.log('fitness', fitness)
    return fitness;
        // for (let Mower of savedMowers) {
        // Mower.fitness = Mower.score / sum;
        // }
}


function mutate(brain) {
    brain.mutate(0.1);
  }

}



const createBlock = (col, row) => {
    //make it so its for each grids starting point
    return {
      col,
      row,
      isStart: row === mowerPos_Row[0] && col === mowerPos_Col[0],
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      isMowed:false
    };
};

function getInitialGrid(x, y) {
    const grids = [];
    for (let row = 0; row < y; row++) {
      const currentRow = [];
      for (let col = 0; col < x; col++) {
        currentRow.push(createBlock(col, row));
      }
      grids.push(currentRow);
    }
    return grids;
};



//what is the problem here???????????? figure it out parth your smart
