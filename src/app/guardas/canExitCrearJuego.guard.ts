import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { JuegoComponent } from '../paginas/juego/juego.component';

// Esta es la guarda para impedir que se abandone una página a menos que se confirme
@Injectable()
export class DeactivateGuardCrearJuego {
    // tslint:disable-next-line:ban-types
    component: Object;
    route: ActivatedRouteSnapshot;
   constructor() {
   }

   canDeactivate( component: JuegoComponent): Observable <boolean> {
        return component.canExit();
  }
}


