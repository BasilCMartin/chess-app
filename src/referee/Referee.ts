import { NumericLiteral } from "typescript"
import { PieceType, TeamType, Piece, Position, samePosition } from "../Constants"

export default class Referee {

    tileIsEmptyOrOccupiedByOpponent(position:Position, boardState:Piece[], team:TeamType) {
return !this.tileIsOccupied(position, boardState) || this.tileIsOccupiedByOpponent(position,boardState,team)
    }

    tileIsOccupied(position:Position, boardState:Piece[]): boolean {
       // console.log("🚀 ~ file: Referee.ts ~ line 6 ~ Referee ~ tileIsOccupied ~ boardState", boardState)
        
const piece= boardState.find((p)=> samePosition(p.position, position))

        console.log("checking if tile is occupied...")
        if(piece){return true}
        else return false
    }

    tileIsOccupiedByOpponent(position:Position,boardState:Piece[], team:TeamType): boolean {

const piece = boardState.find((p)=> samePosition(p.position, position) && p.team !==team)

        if (piece) {
            return true
        }
        else {
            return false
        }
    }

    isEnPassantMove(initialPosition: Position, desiredPosition:Position, type:PieceType, team: TeamType, boardState:Piece[] ) {
        const pawnDirection = team === TeamType.OUR ? 1: -1

if (type === PieceType.PAWN) {
     if ((desiredPosition.x-initialPosition.x === -1 || desiredPosition.x-initialPosition.x ===1) && desiredPosition.y-initialPosition.y === pawnDirection) {
        const piece = boardState.find(p=> p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pawnDirection && p.enPassant)
        if (piece) {
            return true
        }
        
        
    }
}

return false
    }

    isValidMove(initialPosition: Position, desiredPosition:Position, type:PieceType, team: TeamType, boardState:Piece[] ) {
        // console.log("Referee is checking the move...")
        // console.log("previous location", px, py)
        // console.log("current location", x, y)
        // console.log("type", type)
        // console.log("team", team)
        
        if (type === PieceType.PAWN) {
            const specialRow= (team===TeamType.OUR? 1: 6)
            const pawnDirection = (team===TeamType.OUR ? 1:-1)

            // MOVEMENT LOGIC
            if (initialPosition.x === desiredPosition.x && initialPosition.y ===specialRow && desiredPosition.y -initialPosition.y === 2*pawnDirection) {
                if (!this.tileIsOccupied(desiredPosition, boardState) && !this.tileIsOccupied({x:desiredPosition.x, y:desiredPosition.y-pawnDirection}, boardState)) {
                    return true
                }
            }
            else if (initialPosition.x === desiredPosition.x && desiredPosition.y-initialPosition.y ===pawnDirection) {
                if (!this.tileIsOccupied(desiredPosition,boardState)) {
                    return true
                }
            }

            // ATTACK LOGIC
            else if (desiredPosition.x-initialPosition.x === -1 && desiredPosition.y-initialPosition.y === pawnDirection) {
                // left corner
                console.log("left")
                if (this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
                    return true
                }
            }
            else if (desiredPosition.x-initialPosition.x ===1 && desiredPosition.y-initialPosition.y === pawnDirection) {
                //right corner
                console.log("right")
                if (this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
                   return true
                }
            }
        } else if (type === PieceType.KNIGHT) {
           for (let i = -1; i < 2; i +=2) {
            for (let j = -1; j< 2; j+=2) {
                if (desiredPosition.y - initialPosition.y === 2*i) {
                    if (desiredPosition.x - initialPosition.x ===j) {
                        if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition,boardState,team)) {
                            return true
                        }
                    }
                }
                if (desiredPosition.x - initialPosition.x === 2*i) {
                    if (desiredPosition.y - initialPosition.y === j) {
                        if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition,boardState,team)) {
                            return true
                        }
                    }
                }
            }
            }
        }


    

        return false
    }
}