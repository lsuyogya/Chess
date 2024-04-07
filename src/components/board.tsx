import { useState } from 'react';
import '../styles/board.scss';
// import 'useState' from 'react';

const rows = [1, 2, 3, 4, 5, 6, 7, 8];
const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const matrixThing: { [key: number]: string[] } = {};
rows.map((row) => {
  const rowcol: Array<string> = [];
  columns.map((col) => rowcol.push(`${col}${row}`));
  matrixThing[row] = rowcol;
});
const initialPawnPosition: string[] = [];
columns.map((col) => {
  initialPawnPosition.push(`${col}2`);
});
console.log(initialPawnPosition);

interface Cell {
  [cellName: string]: {
    currentPiece: {
      type: 'P' | 'R' | 'N' | 'B' | 'Q' | 'K';
      color: 'black' | 'white';
    } | null;
  };
}
const cellDictionary: Cell = {
  a1: { currentPiece: { type: 'R', color: 'white' } },
  b1: { currentPiece: { type: 'N', color: 'white' } },
  c1: { currentPiece: { type: 'B', color: 'white' } },
  d1: { currentPiece: { type: 'Q', color: 'white' } },
  e1: { currentPiece: { type: 'K', color: 'white' } },
  f1: { currentPiece: { type: 'B', color: 'white' } },
  g1: { currentPiece: { type: 'N', color: 'white' } },
  h1: { currentPiece: { type: 'R', color: 'white' } },
  a2: { currentPiece: { type: 'P', color: 'white' } },
  b2: { currentPiece: { type: 'P', color: 'white' } },
  c2: { currentPiece: { type: 'P', color: 'white' } },
  d2: { currentPiece: { type: 'P', color: 'white' } },
  e2: { currentPiece: { type: 'P', color: 'white' } },
  f2: { currentPiece: { type: 'P', color: 'white' } },
  g2: { currentPiece: { type: 'P', color: 'white' } },
  h2: { currentPiece: { type: 'P', color: 'white' } },
  a8: { currentPiece: { type: 'R', color: 'black' } },
  b8: { currentPiece: { type: 'N', color: 'black' } },
  c8: { currentPiece: { type: 'B', color: 'black' } },
  d8: { currentPiece: { type: 'Q', color: 'black' } },
  e8: { currentPiece: { type: 'K', color: 'black' } },
  f8: { currentPiece: { type: 'B', color: 'black' } },
  g8: { currentPiece: { type: 'N', color: 'black' } },
  h8: { currentPiece: { type: 'R', color: 'black' } },
  a7: { currentPiece: { type: 'P', color: 'black' } },
  b7: { currentPiece: { type: 'P', color: 'black' } },
  c7: { currentPiece: { type: 'P', color: 'black' } },
  d7: { currentPiece: { type: 'P', color: 'black' } },
  e7: { currentPiece: { type: 'P', color: 'black' } },
  f7: { currentPiece: { type: 'P', color: 'black' } },
  g7: { currentPiece: { type: 'P', color: 'black' } },
  h7: { currentPiece: { type: 'P', color: 'black' } },
};

const initializeCellState = (): Cell => {
  const stateDummy: Cell = {};
  columns.map((col): void => {
    rows.map((row): void => {
      if (!cellDictionary[`${col}${row}`])
        stateDummy[`${col}${row}`] = { currentPiece: null };
      else {
        stateDummy[`${col}${row}`] = cellDictionary[`${col}${row}`];
      }
    });
  });
  return stateDummy;
};

const Board = () => {
  const [cellState, setcellState] = useState<Cell>(initializeCellState());
  console.log('cellState', cellState);
  //   const cellStateKeys = Object.keys(cellState);
  //   console.log('split', cellStateKeys[0].split('')[0]);

  return (
    <section className="board">
      {rows.toReversed().map((row) => (
        <div
          className="row"
          data-rowno={row}>
          {getRowCellNames(cellState, row).map((cellName) => {
            return (
              <div
                className="square"
                data-position={cellName}
                style={{ color: cellState[cellName].currentPiece?.color }}>
                {cellState[cellName].currentPiece?.type}
              </div>
            );
          })}
          {/* {matrixThing[row].map((cell) => (
            <div
              className="square"
              data-position={cell}></div>
          ))} */}
        </div>
      ))}
    </section>
  );

  function getRowCellNames(cellDict: Cell, rowNo: number) {
    return Object.keys(cellDict).filter((cellName: string) => {
      if (cellName.split('')[1] === String(rowNo)) return cellName;
      //   console.log(cellName.split('')[0]);
    });
  }
};

function addAlphabet(char: string, offset: number) {
  const charCode = char.charCodeAt(0);
  const newCharCode = charCode + offset;

  // Check if the new char code is within the range of 'a' to 'h'
  if (newCharCode >= 'a'.charCodeAt(0) && newCharCode <= 'h'.charCodeAt(0)) {
    return String.fromCharCode(newCharCode);
  } else {
    return false; // Return false if the new character is out of bounds
  }
}

function pawnLineofSight(currentPosition: string, boardState: Cell) {
  const currentPiece = boardState[currentPosition].currentPiece;
  const possibleCells: string[] = [];
  if (currentPiece?.color === 'white') {
    //Check if there is piece above
    const split = currentPosition.split('');
    const cellAbove = split[0] + String(Number(split[1]) + 1);
    if (!boardState[cellAbove].currentPiece) {
      if (split[1] === '1') {
        const cellAbove2 = split[0] + String(Number(split[1]) + 2);
        if (!boardState[cellAbove2].currentPiece) {
          possibleCells.push(cellAbove, cellAbove2);
        } else {
          possibleCells.push(cellAbove);
        }
      }
    }
    let topLeftCell = null;
    if (addAlphabet(split[0], -1)) {
      topLeftCell = addAlphabet(split[0], -1) + String(Number(split[1]) + 1);
    }
  }
}
export default Board;
