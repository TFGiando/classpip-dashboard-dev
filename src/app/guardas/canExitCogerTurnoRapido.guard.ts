import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { JuegoDeCogerTurnoRapidoComponent } from '../paginas/mis-juegos-rapidos/juego-de-coger-turno-rapido/juego-de-coger-turno-rapido.component';

// Esta es la guarda para impedir que se abandone una página a menos que se confirme
@Injectable()
export class DeactivateGuardCogerTurnoRapido {
    // tslint:disable-next-line:ban-types
    component: Object;
    route: ActivatedRouteSnapshot;
   constructor() {
   }

   canDeactivate( component: JuegoDeCogerTurnoRapidoComponent): Observable <boolean> {
        return component.canExit();
  }
}


