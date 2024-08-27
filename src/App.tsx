import { Alert, Button, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const App = () => {
  const [turn, setTurn] = React.useState(0);
  const [grid, setGrid] = React.useState([
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ]);
  const [gameOver, setGameOver] = React.useState(false);
  const [winner, setWinner] = React.useState('');
  const [currRC, setCurr] = React.useState([-1, -1]);
  const [selectedBlocks, setSelectedBlocks] = React.useState<Set<string>>(new Set());

  useEffect(() => {
    const checkWinner = () => {
      if (currRC[0] == -1 || currRC[1] == -1) {
        return;
      }
      let finalWon = false;

      const addBlocks = (blocks:any) => {
        let selBlocks = new Set(selectedBlocks);
        blocks.forEach(block=> selBlocks.add(block.join(','))); // Convert to string
        setSelectedBlocks(selBlocks);
      };

      // row check
      let won = true;
      for (let c = 0; c < 3; c++) {
        if (turn != grid[currRC[0]][c]) {
          won = false; break;
        }
      }
      if (won) {
        finalWon = true;
        setWinner(turn ? 'X' : 'O');
        addBlocks([[currRC[0], 0], [currRC[0], 1], [currRC[0], 2]]);
      }

      // column check
      won = true;
      for (let r = 0; r < 3; r++) {
        if (turn != grid[r][currRC[1]]) {
          won = false; break;
        }
      }
      if (won) {
        finalWon = true;
        setWinner(turn ? 'X' : 'O');
        addBlocks([[0, currRC[1]], [1, currRC[1]], [2, currRC[1]]]);
      }

      // diagonal 1 check
      won = true;
      for (let r = 0; r < 3; r++) {
        if (turn != grid[r][r]) {
          won = false; break;
        }
      }
      if (won) {
        finalWon = true;
        setWinner(turn ? 'X' : 'O');
        addBlocks([[0, 0], [1, 1], [2, 2]]);
      }

      // diagonal 2 check
      won = true;
      for (let r = 0; r < 3; r++) {
        if (turn != grid[2 - r][r]) {
          won = false; break;
        }
      }
      if (won) {
        finalWon = true;
        setWinner(turn ? 'X' : 'O');
        addBlocks([[2, 0], [1, 1], [0, 2]]);
      }
      if (finalWon) {
        setGameOver(true);
        showToast(turn ? 'X won!' : 'O won!', 'Congo!');
      }
    };
    checkWinner();
    if (currRC[0] != -1 && currRC[1] != -1) {
      setTurn(turn === 0 ? 1 : 0);
    }
  }, [grid]);

  const winnerText = () => {
    if (gameOver) {
      return winner === 'X' ? 'X won!' : 'O won!';
    } else {
      return 'GAME IS ON';
    }
  };

  const pressedBlock = (row: number, col: number) => {
    if (gameOver) {
      resetGame();
      return;
    }
    if (grid[row][col] != -1) {
      showToast('Already taken', 'Play fair');
      return;
    }
    let newGrid = [...grid];
    newGrid[row][col] = turn;
    setCurr([row, col]);
    setGrid(newGrid);
  };

  const showToast = (message1: string, message2: string) => {
    Toast.show({
      type: 'success',
      text1: message1,
      text2: message2,
      position: 'top',
      visibilityTime: 2000
    });
  };

  const resetGame = () => {
    setGrid([
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1],
    ]);
    setSelectedBlocks(new Set());
    setCurr([-1, -1]);
    setTurn(0);
    setWinner('');
    setGameOver(false);
  };

  return (
    <>
      <View style={{flex: 1, alignItems: 'center', gap: 20, backgroundColor: '#D1E9F6' }}>
        <Text style={{ color: '#1A4870', fontWeight: 'bold', fontSize: 24 }}>Tic-Tac-Toe</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>It's</Text>
          <Image source={turn ? require('../public/x.png') : require('../public/o.png')} style={{ width: 50, height: 50 }} />
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>'s turn</Text>
        </View>

        <View style={styles.grid}>
          {[0, 1, 2].map(row => (
            <View style={styles.row} key={`row-${row}`}>
              {[0, 1, 2].map(col => (
                <View
                  key={`box-${row}-${col}`}
                  style={[
                    styles.box,
                    { backgroundColor: selectedBlocks.has(`${row},${col}`) ? '#b7e1cd' : '#D1E9F6' },
                  ]}
                >
                  <Pressable onPress={() => pressedBlock(row, col)} style={styles.pressable}>
                    {grid[row][col] != -1 && (
                      <Image
                        source={grid[row][col] === 0 ? require('../public/o.png') : require('../public/x.png')}
                        style={{ width: 50, height: 50 }}
                      />
                    )}
                  </Pressable>
                </View>
              ))}
            </View>
          ))}
        </View>

        <Text style={{ color: '#1A4870', fontWeight: 'bold', fontSize: 20 }}>{winnerText()}</Text>
        <TouchableOpacity onPress={resetGame}>
          <View style={{ backgroundColor: "#EF5A6F", padding: 10, borderRadius: 5, marginTop: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: "whitesmoke" }}>Reset</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Toast />
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  grid: {
    width: 270,
    height: 270,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  box: {
    width: 90,
    height: 90,
    borderWidth: 1,
    borderColor: 'grey',
  },
  pressable: {
    width: 90,
    height: 90,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
