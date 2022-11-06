import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearCuestionarioComponent } from '../paginas/crear-cuestionario/crear-cuestionario.component';

// Esta es la guarda para impedir que se abandone una página a menos que se confirme
@Injectable()
export class DeactivateGuardCrearCuestionario {
    // tslint:disable-next-line:ban-types
    component: Object;
       constructor() {
   }

   canDeactivate( component: CrearCuestionarioComponent): Observable <boolean> {
        return component.canExit();
  }
}