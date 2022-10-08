import { PieceType, TeamType, Piece } from "../components/Chessboard/Chessboard"

export default class Referee {

    tileIsOccupied(x:number, y:number, boardState:Piece[]): boolean {
       // console.log("🚀 ~ file: Referee.ts ~ line 6 ~ Referee ~ tileIsOccupied ~ boardState", boardState)
        
const piece= boardState.find((p)=>p.x===x&&p.y===y)

        console.log("checking if tile is occupied...")
        if(piece){return true}
        else return false
    }

    isValidMove(px:number, py:number, x:number, y:number, type:PieceType, team: TeamType, boardState:Piece[] ) {
        console.log("Referee is checking the move...")
        console.log("previous location", px, py)
        console.log("current location", x, y)
        console.log("type", type)
        console.log("team", team)
        
        if (type === PieceType.PAWN) {
            const specialRow= (team===TeamType.OUR? 1: 6)
            const pawnDirection = (team===TeamType.OUR ? 1:-1)
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
            return false
        }


    

        return false
    }
}