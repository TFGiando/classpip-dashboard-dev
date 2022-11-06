import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearEscenarioComponent } from '../paginas/crear-escenario/crear-escenario.component';

// Esta es la guarda para impedir que se abandone una página a menos que se confirme
@Injectable()
export class DeactivateGuardCrearEscenario {
    // tslint:disable-next-line:ban-types
    component: Object;
   constructor() {
   }

   canDeactivate( component: CrearEscenarioComponent): Observable <boolean> {
        return component.canExit();
  }
}


