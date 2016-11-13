

import {TournamentBracket} from "./tournament.bracket";
import {AppComponent} from "./app.component";
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {TournamentService} from "./tournament.service";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule
    ],
    declarations: [
        AppComponent,
        //widgets
        TournamentBracket,
    ],
    providers: [TournamentService],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }