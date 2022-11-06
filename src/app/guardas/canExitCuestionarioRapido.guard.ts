import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { JuegoDeCuestionarioRapidoComponent } from '../paginas/mis-juegos-rapidos/juego-de-cuestionario-rapido/juego-de-cuestionario-rapido.component';

// Esta es la guarda para impedir que se abandone una página a menos que se confirme
@Injectable()
export class DeactivateGuardCuestionarioRapido {
    // tslint:disable-next-line:ban-types
    component: Object;
    route: ActivatedRouteSnapshot;
   constructor() {
   }

   canDeactivate( component: JuegoDeCuestionarioRapidoComponent): Observable <boolean> {
        return component.canExit();
  }
}


