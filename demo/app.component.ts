import {Component, ViewChild} from "@angular/core";
import {TournamentBracket} from "./tournament.bracket";
import {TournamentService} from "./tournament.service";
@Component({
    selector: 'my-app',
    template: `
        <button (click)="toggleEdit()">Edit</button>
        <tournament-bracket [bracket]="tournament.mainBracket"
                    [teams]="tournament.teams"></tournament-bracket>
    `
})
export class AppComponent {
    edit: boolean;

    @ViewChild(TournamentBracket) bracket : TournamentBracket;

    tournament = { // sample data
        mainBracket: {
            bestOf: [3, 3, 3, 5],
            matchUps: [
                {a: 1, b: 2}, {a: 3, b: 4},
                {a: null, b: null}, {a: null, b: null},
                {a: null, b: null}, {a: null, b: null},
                {a: null, b: null}, {a: null, b: null}
            ],
            results: [
                [ // round of 16
                    [null, null], [null, null], [null, null], [null, null],
                    [null, null], [null, null], [null, null], [null, null]
                ],
                [ // round of 8
                    [null, null], [null, null], [null, null], [null, null]
                ],
                [[null, null], [null, null]],
                [[null, null]]
            ]
        },
        teams:
            [{_id: 1, name: 'team1'}, {_id: 2, name: 'team2'}, {_id: 3, name: 'team3'}, {_id: 4, name: 'team4'},
                {_id: 5, name: 'team5'}, {_id: 6, name: 'team6'}, {_id: 7, name: 'team7'}, {_id: 8, name: 'team8'},
                {_id: 9, name: 'team9'}, {_id: 10, name: 'team10'}, {_id: 11, name: 'team11'}, {_id: 12, name: 'team12'},
                {_id: 13, name: 'team13'}, {_id: 14, name: 'team14'}, {_id: 15, name: 'team15'}, {_id: 16, name: 'team16'}
            ]
    }
    teamArray = {}
    constructor(private service: TournamentService){
        this.edit = false;
    }

    generateBracket (maxTeams){
        // this.service.generateBrackets(maxTeams);
    }

    toggleEdit(){
        this.edit = !this.edit;
        this.bracket.toggleEditMode();
    }

}