import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearFamiliasmemoramaComponent } from '../paginas/crear-familiasmemorama/crear-familiasmemorama.component';

// Esta es la guarda para impedir que se abandone una página a menos que se confirme
@Injectable()
export class DeactivateGuardCrearFamiliaMemorama {
    // tslint:disable-next-line:ban-types
    component: Object;
   constructor() {
   }

   canDeactivate( component: CrearFamiliasmemoramaComponent): Observable <boolean> {
        return component.canExit();
  }
}


