import { NumericLiteral } from "typescript"
import { PieceType, TeamType, Piece } from "../Constants"

export default class Referee {

    tileIsOccupied(x:number, y:number, boardState:Piece[]): boolean {
       // console.log("🚀 ~ file: Referee.ts ~ line 6 ~ Referee ~ tileIsOccupied ~ boardState", boardState)
        
const piece= boardState.find((p)=>p.position.x===x&&p.position.y===y)

        console.log("checking if tile is occupied...")
        if(piece){return true}
        else return false
    }

    tileIsOccupiedByOpponent(x:number, y:number,boardState:Piece[], team:TeamType): boolean {

const piece = boardState.find((p)=> p.position.x===x && p.position.y === y && p.team !==team)

        if (piece) {
            return true
        }
        else {
            return false
        }
    }

    isEnPassantMove(px:number, py:number, x:number, y:number, type:PieceType, team: TeamType, boardState:Piece[] ) {
        const pawnDirection = team === TeamType.OUR ? 1: -1

if (type === PieceType.PAWN) {
     if ((x-px === -1 || x-px ===1) && y-py === pawnDirection) {
        const piece = boardState.find(p=> p.position.x === x && p.position.y === y - pawnDirection && p.enPassant)
        if (piece) {
            return true
        }
        
        
    }
}

return false
    }

    isValidMove(px:number, py:number, x:number, y:number, type:PieceType, team: TeamType, boardState:Piece[] ) {
        // console.log("Referee is checking the move...")
        // console.log("previous location", px, py)
        // console.log("current location", x, y)
        // console.log("type", type)
        // console.log("team", team)
        
        if (type === PieceType.PAWN) {
            const specialRow= (team===TeamType.OUR? 1: 6)
            const pawnDirection = (team===TeamType.OUR ? 1:-1)

            // MOVEMENT LOGIC
            if (px === x && py ===specialRow && y -py === 2*pawnDirection) {
                if (!this.tileIsOccupied(x, y, boardState) && !this.tileIsOccupied(x, y-pawnDirection, boardState)) {
                    return true
                }
            }
            else if (px === x && y-py ===pawnDirection) {
                if (!this.tileIsOccupied(x,y,boardState)) {
                    return true
                }
            }

            // ATTACK LOGIC
            else if (x-px === -1 && y-py === pawnDirection) {
                // left corner
                console.log("left")
                if (this.tileIsOccupiedByOpponent(x, y, boardState, team)) {
                    return true
                }
            }
            else if (x-px ===1 && y-py === pawnDirection) {
                //right corner
                console.log("right")
                if (this.tileIsOccupiedByOpponent(x, y, boardState, team)) {
                   return true
                }
            }
        }


    

        return false
    }
}