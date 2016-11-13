/**
 * Created by SHELDON on 11/12/2016.
 */
import {Injectable} from "@angular/core";
/**
 * Created by SHELDON on 5/2/2016.
 */
@Injectable()

export class TournamentService {

    constructor() {
    }

    generateBrackets(maxTeams: number){
        let numOfGroups = this.findBestGroupDistribution(maxTeams);
        let numOfTeams: number = this.getLargerClosestPowerOfTwo(maxTeams);
        return  {
            matchUps: this.generateNotDeterminedMatchUps(numOfTeams),
            results: this.generateEmptyResults(numOfTeams)
        };
    }

    getLargerClosestPowerOfTwo(n : number){
        var powerOfTwo : number = 1;
        while (powerOfTwo < n){
            powerOfTwo *= 2;
        }
        return powerOfTwo;
    }

    generateEmptyResults(numOfTeams): any{
        let results = [];
        let iterator = 0;

        while (numOfTeams >= 2){
            results.push([]);
            for (let i = 0 ; i < numOfTeams / 2; i++){
                results[iterator].push([null, null]);
            }
            iterator++;
            numOfTeams /= 2;
        }
        return results;


    }

    findBestGroupDistribution(maxTeams: number){
        let possibleNumOfGroups: Array<any> = this.findPossibleGroupDistribution(maxTeams);
        for (let i = possibleNumOfGroups.length - 1; i > 0 ; i --){
            let teamsPerGroup = possibleNumOfGroups[i].averageTeamsPerGroup;
            if (Math.ceil(teamsPerGroup) == teamsPerGroup){
                return possibleNumOfGroups[i].numOfGroups;
            }
        }
    }

    findPossibleGroupDistribution(maxTeams: number) : Array<any>{
        let possibleGroupDistribution: Array<any> = [];
        let numOfGroups : number = 1;
        while ((maxTeams/numOfGroups) > 3 && numOfGroups < 27){
            possibleGroupDistribution.push(
                {
                    numOfGroups: numOfGroups,
                    averageTeamsPerGroup: (maxTeams/numOfGroups)
                }
            );
            numOfGroups++;
        }

        return possibleGroupDistribution;
    }

    generateNotDeterminedMatchUps(numOfTeams: number) {
        let matchUps = [];

        for (let i = 0; i < numOfTeams; i+= 2){
            matchUps.push({a: null , b: null});
        }
        return matchUps;
    }
}