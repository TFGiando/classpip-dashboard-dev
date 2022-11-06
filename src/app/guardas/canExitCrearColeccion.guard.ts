import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearColeccionComponent } from '../paginas/crear-coleccion/crear-coleccion.component';

// Esta es la guarda para impedir que se abandone una página a menos que se confirme
@Injectable()
export class DeactivateGuardCrearColeccion {
    // tslint:disable-next-line:ban-types
    component: Object;
   constructor() {
   }

   canDeactivate( component: CrearColeccionComponent): Observable <boolean> {
        return component.canExit();
  }
}


