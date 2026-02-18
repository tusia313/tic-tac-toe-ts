import confetti from "canvas-confetti";
import "./style.css";

//1.Pobieramy elementy z HTMLu.
const appElement = document.getElementById("app") as HTMLDivElement;
const boardElement = document.getElementById("board") as HTMLDivElement
const ROW_COUNT: number = 3
const COL_COUNT: number = 3
// 2. Definiujemy stan gry (pamięć). To jest nasza wirtualna plansza - 3 wiersze po 3 puste pola.
let boardState: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]
let currentMove: 'X' | 'O' = 'X' //zmienna, która będzie przechowywać aktualny ruch. Na początku jest to 'X', ale będzie się zmieniać na 'O' i z powrotem na 'X' po każdym ruchu.
function createCell(row: number, col: number, content: string = ""): HTMLButtonElement {
    const cell: HTMLButtonElement = document.createElement("button")
    cell.setAttribute("data-row", row.toString())
    cell.setAttribute("data-col", col.toString())
    cell.setAttribute("data-content", content)
    cell.classList.add("cell")
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