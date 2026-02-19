import confetti from "canvas-confetti";
import "./style.css";

//1.Pobieramy elementy z HTMLu.
const appElement = document.getElementById("app") as HTMLDivElement;
const boardElement = document.getElementById("board") as HTMLDivElement
const ROW_COUNT: number = 3
const COL_COUNT: number = 3
// 2. Definiujemy stan gry (pamięć). To jest nasza wirtualna plansza - 3 wiersze po 3 puste pola.
type Cell = "" | "X" | "0"
type TickTacToeBoard = [
    [Cell, Cell, Cell],
    [Cell, Cell, Cell],
    [Cell, Cell, Cell]
]
let boardState: TickTacToeBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]
let currentMove: 'X' | '0' = 'X' //zmienna, która będzie przechowywać aktualny ruch. Na początku jest to 'X', ale będzie się zmieniać na 'O' i z powrotem na 'X' po każdym ruchu.
let winner: Cell | "Draw" = "" //zmienna, która będzie przechowywać zwycięzcę. Na początku jest pusta, ale będzie się aktualizować, gdy ktoś wygra lub będzie remis.
function createCell(row: number, col: number, content: Cell = ""): HTMLButtonElement {
    const cell: HTMLButtonElement = document.createElement("button")
    cell.setAttribute("data-row", row.toString())
    cell.setAttribute("data-col", col.toString())
    cell.setAttribute("data-content", content)
    cell.classList.add("cell")
    cell.addEventListener("click", () => {
        if (winner) return //jeśli jest już zwycięzca, to nie pozwalamy na dalsze ruchy
        if (boardState[row][col] === "") { //sprawdzamy, czy pole jest puste, jeśli tak, to wykonujemy ruch
            boardState[row][col] = currentMove //aktualizujemy stan planszy
            currentMove = currentMove === 'X' ? '0' : 'X' //zmieniamy aktualny ruch na przeciwny
            winner = checkWinner() //sprawdzamy, czy ktoś wygrał po tym ruchu
            renderBoard() //ponownie renderujemy planszę, aby odzwierciedlić zmiany
        }
    })
    return cell
}
function renderBoard(): void {
    if (!appElement) throw new Error("Nie można znaleźć elementu #app")
    if (!boardElement) throw new Error("Nie można znaleźć elementu #board")
    boardElement.innerHTML = "  " //czyścimy planszę przed ponownym renderowaniem
    for (let row = 0; row < ROW_COUNT; row++) {
        for (let col = 0; col < COL_COUNT; col++) {
            boardElement.appendChild(createCell(row, col, boardState[row][col]))
        }
    }
    const oldMoveElement = document.getElementById("move-element") //usuwamy stary element z aktualnym ruchem, jeśli istnieje, aby nie było duplikatów
    if (oldMoveElement) {
        oldMoveElement.remove()
    }
    const moveElement = document.createElement("p")
    moveElement.id = "move-element"
    moveElement.textContent = `Current move: ${currentMove}`
    moveElement.classList.add("move-element")
    appElement.insertBefore(moveElement, document.getElementById("reset"))
}
type Coordinates = [number, number]
type Victory = [Coordinates, Coordinates, Coordinates]
const victories: Victory[] = [
    [[0, 0], [0, 1], [0, 2]], // wiersze
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]], // kolumny
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]], // przekątne
    [[0, 2], [1, 1], [2, 0]]
]
function checkWinner(): Cell | "Draw" {
    for (let victory of victories) {
        const cell1 = boardState[victory[0][0]][victory[0][1]]
        const cell2 = boardState[victory[1][0]][victory[1][1]]
        const cell3 = boardState[victory[2][0]][victory[2][1]]
        if (cell1 !== "" && cell1 === cell2 && cell2 === cell3) {
            celebrate() // jeśli ktoś wygrał, to wywołujemy funkcję celebrate, która odpala konfetti
            return cell1 // zwracamy symbol zwycięzcy ('X' lub 'O')
        }
    }
    let isDraw = true
    // Sprawdzamy wiersze
    for (let row = 0; row < ROW_COUNT; row++) {
        for (let col = 0; col < COL_COUNT; col++) {
            if (boardState[row][col] === "") {
                isDraw = false // jeśli znajdziemy puste pole, to nie jest remis
                break
            }
        }
        if (isDraw) return "Draw" // jeśli po sprawdzeniu wszystkich pól nie znaleźliśmy pustego, to jest remis
        return "" // jeśli nie ma zwycięzcy i nie ma remisu, to zwracamy pusty string
    }
}
    function init(): void {
        const resetButton = document.getElementById("reset") as HTMLButtonElement
        if (!resetButton) throw new Error("Nie można znaleźć elementu #reset")
        resetButton.addEventListener("click", () => {
            boardState = [
                ['', '', ''],
                ['', '', ''],
                ['', '', '']
            ]
            currentMove = 'X'
            renderBoard()
        })
        renderBoard()
    }
    init()
    function celebrate(): void {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        })
    }