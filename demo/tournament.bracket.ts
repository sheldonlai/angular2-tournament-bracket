import {Component, Input, OnInit} from "@angular/core";
/**
 * Created by SHELDON on 5/30/2016.
 */


@Component({
    selector: 'tournament-bracket',
    template: `
<div id="container">
    <div id="tournament-bracket" 
        [ngStyle]="{'width': getBracketWidth(), 'height' : getBracketHeight()}" 
        *ngIf="isBracketNull()">
        <div  *ngFor="let round of getBracketResults(); let roundIndex = index; let last = last; let first = first;">
            <div class="round">
                <div class="team-header" > {{getRoundText(roundIndex)}} 
                    <span *ngIf="bracket.bestOf != null">(Best of {{bracket.bestOf[roundIndex]}})</span>
                </div>
                <div class="match" *ngFor="let matchScore of round; let matchIndex = index" 
                    [ngStyle]="{'margin-top': getMarginOffset(roundIndex, matchIndex)}">
                    <div class="team-block">
                        <span class="team"
                            *ngIf="!(first && teams != null && edit)"
                            [ngClass]="{win : (matchScore[0] > matchScore[1]), lose: (matchScore[0] < matchScore[1])}">
                                {{teamMap[roundIndex][matchIndex][0].team}}
                        </span>
                         <span class="team"
                            *ngIf="(first && teams != null && edit)"
                            [ngClass]="{win : (matchScore[0] > matchScore[1]), lose: (matchScore[0] < matchScore[1])}">
                                <select  [(ngModel)]="bracket.matchUps[matchIndex].a">
                                    <option value="null"> </option>
                                    <option *ngFor="let team of teams" [hidden]="isTeamDisplayed(team)" [value]="team._id">{{team.name}}</option>
                                </select>
                        </span>
                        <span class="score" *ngIf="!isScoreEditable(teamMap[roundIndex][matchIndex])">
                            {{getTeamScore(0,matchScore)}}
                        </span>
                        <span class="score" *ngIf="isScoreEditable(teamMap[roundIndex][matchIndex])">
                            <input type="number" class="score-input" [(ngModel)]="matchScore[0]" 
                            (change)="createTeamNameMap()" min="0" max="{{getMaxScoreForRound(roundIndex)}}" />
                        </span>
                    </div>
                    <div class="team-block">
                        <span class="team"
                            *ngIf="!(first && teams != null && edit)"
                            [ngClass]="{win : (matchScore[1] > matchScore[0]), lose: (matchScore[1] < matchScore[0])}">
                            {{teamMap[roundIndex][matchIndex][1].team}}
                        </span>
                        <span class="team"
                            *ngIf="(first && teams != null && edit)"
                            [ngClass]="{win : (matchScore[0] > matchScore[1]), lose: (matchScore[0] < matchScore[1])}">
                                <select [(ngModel)]="bracket.matchUps[matchIndex].b">
                                    <option value="null"> </option>
                                    <option *ngFor="let team of teams" [hidden]="isTeamDisplayed(team)" [value]="team._id">{{team.name}}</option>
                                </select>
                        </span>
                        <span class="score" *ngIf="!isScoreEditable(teamMap[roundIndex][matchIndex])">
                            {{getTeamScore(1, matchScore)}}
                        </span>
                        <span class="score" *ngIf="isScoreEditable(teamMap[roundIndex][matchIndex])">
                            <input type="number" class="score-input" [(ngModel)]="matchScore[1]" 
                            (change)="createTeamNameMap()" min="0" max="{{getMaxScoreForRound(roundIndex)}}"/> 
                        </span>
                    </div>
                </div>
            </div>
            <div class="separator" *ngIf="!last" >
                <div *ngFor="let matchScore of round; let matchIndex = index" >
                    <div [ngStyle]="{'height': getSeparatorBlockHeight(roundIndex, matchIndex, 0)}" class="separator-block" 
                    [ngClass]="{upwards: isLineUpwards(matchIndex, 0)}"></div>
                    <div [ngStyle]="{'height': getSeparatorBlockHeight(roundIndex, matchIndex, 1)}" class="separator-block" 
                    [ngClass]="{downwards: isLineDownwards(matchIndex, 1), horizontal: isLineUpwardHorizontal(matchIndex, 1)}"></div>
                </div>
            </div>
            <div class="separator" *ngIf="!last">
                <div *ngFor="let matchScore of round; let matchIndex = index" >
                    <div [ngStyle]="{'height': getSeparatorBlockHeight(roundIndex, matchIndex , 0)}" class="separator-block"
                        [ngClass]="{horizontal : isLineHorizontal(matchIndex, 0)}"></div>
                    <div [ngStyle]="{'height': getSeparatorBlockHeight(roundIndex, matchIndex, 1)}" class="separator-block"></div>
                </div>
            </div>
        </div>
    </div>
</div>
`,
    styleUrls: ['demo/bracket.css'],
})
export class TournamentBracket {


    @Input() bracket;
    @Input() teams;
    bracketSize;
    teamMap;
    edit:boolean = false;

    constructor() {
    }

    isBracketNull(){
        if (this.bracket != null){
            this.createTeamNameMap();
            return true;
        }
        return false;
    }


    getBracketResults(){
        if (this.bracket == null || this.bracket.results == null)
            return [];
        return this.bracket.results;
    }

    getTeamName(team:string, round:number, match:number):string {
        if (round == 1) {
            return this.bracket.matchUps[round][team];
        }

        return null;
    }

    createTeamNameMap() {
        let matchUp = this.bracket.matchUps;
        let results = this.bracket.results;
        let map = [];
        for (let i = 0; i < results.length; i++) {
            map.push([]);
            for (let j = 0; j < results[i].length; j++) {
                if (i == 0) {
                    map[i].push(
                        [
                            {team: this.getTeamNameById(matchUp[j].a), score: this.getResults(i, j, 0)},
                            {team: this.getTeamNameById(matchUp[j].b), score: this.getResults(i, j, 1)}
                        ]
                    )
                } else {
                    let winningTeam1 = this.getWinningTeamName(map[i - 1][j * 2], i - 1);
                    let winningTeam2 = this.getWinningTeamName(map[i - 1][j * 2 + 1], i - 1);
                    map[i].push(
                        [
                            {team: winningTeam1, score: this.getResults(i, j, 0)},
                            {team: winningTeam2, score: this.getResults(i, j, 1)},
                        ]
                    )
                }
            }
        }
        this.teamMap = map;
    }

    getResults(round, match, team) {
        let results = this.bracket.results;
        if (results[round][match][team] == null)
            return null;
        return results[round][match][team];
    }

    getWinningTeamName(match, roundIndex) {
        if (match[0].score == null || match[1].score == null || match[0].score == match[1].score) {
            return null;
        } else if (this.bracket.bestOf != null &&
            !((this.bracket.bestOf[roundIndex] / 2) < match[0].score ||
            (this.bracket.bestOf[roundIndex] / 2) < match[1].score)
        ) {
            return null;
        } else {
            return (match[0].score > match[1].score) ? match[0].team : match[1].team;
        }

    }

    setBracketSize(num:number) {
        var powerOfTwo:number = 1;
        let iterator = 0;
        while (powerOfTwo < num) {
            iterator++;
            powerOfTwo * 2;
        }
        this.bracketSize = iterator;
    }

    getMarginOffset(roundIndex, matchIndex) {
        if (roundIndex == 0)
            return '6px';
        let pxlOffset:number = ((Math.pow(2, roundIndex) - 1) * (26));
        if (matchIndex != 0) {
            pxlOffset *= 2;
            pxlOffset += 12 * roundIndex;
        }
        else {
            pxlOffset += 6 + (3 * (Math.pow(2, roundIndex) - 1));
        }


        let temp:string = pxlOffset + 'px';
        return temp;
    }

    getTeamScore(index, matchScore) {
        return matchScore[index];
    }

    getBracketWidth() {
        if (this.bracket == null)
            return 270 + 'px';
        return 170 * (this.bracket.results.length) + 100 + 'px';
    }

    getBracketHeight() {
        if (this.bracket == null)
            return 600 + 'px';
        let temp = 56 * Math.pow(2, this.bracket.results.length - 1) + 100 + 'px';
        return temp;
    }

    toggleEditMode() {
        this.edit = !this.edit;
        console.log(this.edit);
    }

    isScoreEditable(teamMap) {
        return this.edit && teamMap[0].team != null && teamMap[1].team != null;
    }

    getRoundText(roundIndex){
        let round = this.getRoundNumber(roundIndex);
        if (round > 4){
            return 'Round of ' + round;
        } else if (round == 4){
            return 'Semi-Final';
        } else {
            return 'Final';
        }

    }

    getRoundNumber(roundIndex) {
        return Math.pow(2, this.bracket.results.length - roundIndex);
    }

    getTeamNameById(team): string{
        if (this.teams == null || this.teams.length == 0){
            return;
        }
        let tempTeams = this.teams;
        tempTeams = tempTeams.filter(function(x){
            return x._id == team ;
        });
        if (tempTeams.length != 1){
            return;
        }
        return tempTeams[0].name;
    }

    getSeparatorBlockHeight(roundIndex, matchIndex, team) {
        if (matchIndex == 0 && team == 0) {
            return 26 + (Math.pow(2, roundIndex) - 1) * 29 + 'px';
        }
        return Math.pow(2, roundIndex) * 29 + 'px';
    }

    isLineDownwards(matchIndex, team) {
        return (matchIndex % 2 == 0) && team == 1;
    }

    isLineUpwardHorizontal(matchIndex, team) {
        return (matchIndex % 2 == 1) && team == 1;
    }

    isLineUpwards(matchIndex, team) {
        return (matchIndex % 2 == 1) && team == 0;
    }

    isLineHorizontal(matchIndex, team) {
        return (matchIndex % 2 == 1 ) && team == 0;
    }
    isTeamDisplayed(team){
        let teamId = team._id;
        let result = this.bracket.matchUps.find((matchUp)=>{
            return (matchUp.a == teamId || matchUp.b == teamId);
        });
        return result != null;
    }

    getMaxScoreForRound(roundIndex){
        if (this.bracket.bestOf != null && this.bracket.bestOf[roundIndex] != null){
            return this.bracket.bestOf[roundIndex];
        }
        return 99999;
    }

}
