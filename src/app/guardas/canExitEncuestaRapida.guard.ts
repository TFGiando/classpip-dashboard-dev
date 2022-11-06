import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { JuegoDeEncuestaRapidaComponent } from '../paginas/mis-juegos-rapidos/juego-de-encuesta-rapida/juego-de-encuesta-rapida.component';

// Esta es la guarda para impedir que se abandone una página a menos que se confirme
@Injectable()
export class DeactivateGuardEncuestaRapida {
    // tslint:disable-next-line:ban-types
    component: Object;
    route: ActivatedRouteSnapshot;
   constructor() {
   }

   canDeactivate( component: JuegoDeEncuestaRapidaComponent ): Observable <boolean> {
        return component.canExit();
  }
}


