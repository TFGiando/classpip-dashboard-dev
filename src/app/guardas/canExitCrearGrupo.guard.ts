import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CrearGrupoComponent } from '../paginas/crear-grupo/crear-grupo.component';

// Esta es la guarda para impedir que se abandone una página a menos que se confirme
@Injectable()
export class DeactivateGuardCrearGrupo {
    // tslint:disable-next-line:ban-types
    component: Object;
    route: ActivatedRouteSnapshot;
   constructor() {
   }

   canDeactivate( component: CrearGrupoComponent): Observable <boolean> {
        return component.canExit();
  }
}


