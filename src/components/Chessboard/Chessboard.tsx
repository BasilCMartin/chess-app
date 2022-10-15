import { useRef, useState } from "react"
import './Chessboard.css'
import Tile from '../Tile/Tile'
import Referee from "../../referee/Referee"
import { verticalAxis, horizontalAxis, Piece,PieceType,TeamType, initialBoardState, Position } from "../../Constants"

export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null)
    const [grabPosition, setGrabPosition] = useState<Position>({x:-1, y:-1})
    const [pieces, setPieces] = useState(initialBoardState)
    const chessboardRef = useRef<HTMLDivElement>(null)
    const referee = new Referee();

    function grabPiece(e: React.MouseEvent) {
        const element = e.target as HTMLElement
        const chessboard = chessboardRef.current
        if (element.classList.contains("chess-piece") && chessboard) {
            
            const grabX =Math.floor((e.clientX - chessboard.offsetLeft) / 100) //49-50 turn the pixel position of grid into usable coordinate([0,0] to [8,8] )
            const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)) // ^starting bottom left corner. -800 takes us from top to bottom, abs turns negative value to positive
            setGrabPosition({x:grabX, y:grabY})
            const x = e.clientX - 50
            const y = e.clientY - 50
            element.style.position = "absolute"
            element.style.left = `${x}px`
            element.style.top = `${y}px`

            setActivePiece(element)
        }
    }

    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current
        // const element =e.target as HTMLElement
        if (activePiece && chessboard) {
            const minX = chessboard.offsetLeft - 25
            const minY = chessboard.offsetTop - 25
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 75
            const x = e.clientX - 50
            const y = e.clientY - 50
            activePiece.style.position = "absolute"

            //prevents dragging piece outside board
            if (x < minX) {
                activePiece.style.left = `${minX}px`
            }
            else if (x > maxX) {
                activePiece.style.left = `${maxX}px`
            }
            else {
                activePiece.style.left = `${x}px`
            }

            if (y < minY) {
                activePiece.style.top = `${minY}px`
            }
            else if (y > maxY) {
                activePiece.style.top = `${maxY}px`
            }
            else {
                activePiece.style.top = `${y}px`
            }



        }
    }

    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current
        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100)
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));

            const currentPiece = pieces.find(p => p.position.x === grabPosition.x && p.position.y === grabPosition.y)
            const attackedPiece = pieces.find(p => p.position.x === x && p.position.y === y)

            if (currentPiece) {
                const validMove = referee.isValidMove(grabPosition.x, grabPosition.y, x, y, currentPiece.type, currentPiece.team, pieces)

                const isEnPassantMove = referee.isEnPassantMove(grabPosition.x, grabPosition.y, x, y, currentPiece.type, currentPiece.team, pieces)


                const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1
                if (isEnPassantMove) {
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if (piece.position.x === grabPosition.x && piece.position.y === grabPosition.y) {
                            piece.enPassant = false
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece)
                        } else if (!(piece.position.x === x && piece.position.y === y - pawnDirection)) {
                            if (piece.type = PieceType.PAWN) {
                                piece.enPassant = false
                            }
                            results.push(piece)
                        }
                        return results
                    }, [] as Piece[])
                    setPieces(updatedPieces)
                }
                else if (validMove) {
                    //UPDATES PIECE POSITION
                    //IF PIECE IS ATTACKED, REMOVES PIECE
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if (piece.position.x === grabPosition.x && piece.position.y === grabPosition.y) {
                            if (Math.abs(grabPosition.x - y) === 2 && piece.type === PieceType.PAWN) {
                                console.log("enpassant set true")
                                piece.enPassant = true
                            } else {
                                piece.enPassant = false
                            }
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece)
                        } else if (!(piece.position.x === x && piece.position.y === y)) {
                            if (piece.type === PieceType.PAWN) {
                                piece.enPassant = false
                            }
                            results.push(piece)
                        }
                        return results
                    }, [] as Piece[]);
                    setPieces(updatedPieces)



                } else {
                    // RESETS PIECE POSITION
                    activePiece.style.position = "relative"
                    activePiece.style.removeProperty("top")
                    activePiece.style.removeProperty("left")
                }

            }

            setActivePiece(null)
        }
    }




    let board = []
    for (let j = verticalAxis.length - 1; j >= 0; j--) {
        for (let i = 0; i < horizontalAxis.length; i++) {
            const number = j + i + 2;
            let image = ""
            pieces.forEach((p) => {
                if (p.position.x === i && p.position.y === j) {
                    image = p.image
                }
            })

            board.push(<Tile key={`${i},${j}`} image={image} number={number} />)
        }
    }


    return <div onMouseUp={(e) => dropPiece(e)}
        onMouseMove={(e) => movePiece(e)}
        onMouseDown={(e) => grabPiece(e)}
        id="chessboard"
        ref={chessboardRef}
    >
        {board}


    </div>
}