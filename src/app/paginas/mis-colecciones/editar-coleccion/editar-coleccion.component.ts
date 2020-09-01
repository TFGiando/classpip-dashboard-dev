import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { ResponseContentType, Http, Response } from '@angular/http';
import { AgregarCromoDialogComponent } from '../agregar-cromo-dialog/agregar-cromo-dialog.component';
import { EditarCromoDialogComponent } from '../editar-cromo-dialog/editar-cromo-dialog.component' ;
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';

// Clases
import { Cromo, Coleccion } from '../../../clases/index';


// Servicios
import { SesionService, PeticionesAPIService } from '../../../servicios/index';

import * as URL from '../../../URLs/urls';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-editar-coleccion',
  templateUrl: './editar-coleccion.component.html',
  styleUrls: ['./editar-coleccion.component.scss']
})
export class EditarColeccionComponent implements OnInit {

  coleccion: Coleccion;
  cromosColeccion: Cromo[];

  cromo: Cromo;
  imagenCromo: string;
  imagenesCromosDelante: string[] = [];
  imagenesCromosDetras: string[] = [];

  nombreColeccion: string;
  // imagen coleccion
  imagenColeccion: string;
  nombreImagenColeccion: string;
  file: File;

  // tslint:disable-next-line:ban-types
  imagenCambiada: Boolean = false;

  // PARA DIÁLOGO DE CONFIRMACIÓN
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Confirma que quieres eliminar el equipo llamado: ';

  // tslint:disable-next-line:ban-types
  cambios: Boolean = false;
  // tslint:disable-next-line:ban-types
  voltear: Boolean = false;
  // tslint:disable-next-line:ban-types
  mostrarTextoGuardar: Boolean = false;

  interval;


  constructor(
              public dialog: MatDialog,
              private location: Location,
              private http: Http,
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService
  ) { }

  ngOnInit() {
    this.coleccion = this.sesion.DameColeccion();
    this.nombreColeccion = this.coleccion.Nombre;
    this.cromosColeccion = this.sesion.DameCromos();
    // Me traigo la imagen de la colección y las imagenes de cada cromo
    this.TraeImagenColeccion(this.coleccion);
    // Cargo el imagen de la coleccion
    // this.GET_Imagen();
  }

  // Se hace un PUT de la coleccion seleccionada para editar
  EditarColeccion() {
    console.log('Entro a editar');
    // Borramos la imagen anterior
    if (this.coleccion.ImagenColeccion !== undefined) {
      this.peticionesAPI.BorrarImagenColeccion (this.coleccion.ImagenColeccion).subscribe();
    }
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaColeccion(new Coleccion(this.nombreColeccion, this.nombreImagenColeccion), this.coleccion.profesorId, this.coleccion.id)
    .subscribe((res) => {
      if (res != null) {
        console.log('Voy a editar la coleccion con id ' + this.coleccion.id);
        this.coleccion = res;

        if (this.imagenCambiada === true) {
          // HACEMOS EL POST DE LA NUEVA IMAGEN EN LA BASE DE DATOS
          const formData: FormData = new FormData();
          formData.append(this.nombreImagenColeccion, this.file);
          this.peticionesAPI.PonImagenColeccion (formData)
          .subscribe(() => console.log('Imagen cargada'));
        }

      } else {
        console.log('fallo editando');
      }
    });
    this.cambios = false;

  }

  // Busca la imagen que tiene el nombre del cromo.Imagen y lo carga en imagenCromo
  TraeImagenesCromos() {

      // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.cromosColeccion.length; i++) {

      this.cromo = this.cromosColeccion[i];
      this.imagenesCromosDelante[i] = URL.ImagenesCromo + this.cromo.ImagenDelante;
      this.imagenesCromosDetras[i] = URL.ImagenesCromo + this.cromo.ImagenDetras;

    }
  }

  // AL CLICAR EN AGREGAR LOGO NOS ACTIVARÁ LA FUNCIÓN MOSTRAR DE ABAJO
  ActivarInput() {
    console.log('Activar input');
    document.getElementById('input').click();
  }


   // Seleccionamos una foto y guarda el nombre de la foto en la variable logo
  Mostrar($event) {
    this.file = $event.target.files[0];

    console.log('fichero ' + this.file.name);
    this.nombreImagenColeccion = this.file.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      console.log('ya');
      this.cambios = true;
      this.imagenCambiada = true;
      this.imagenColeccion = reader.result.toString();
    };
  }





  // SI QUEREMOS AÑADIR CROMOS MANUALMENTE LO HAREMOS EN UN DIALOGO
  AbrirDialogoAgregarCromoColeccion(): void {
    const dialogRef = this.dialog.open(AgregarCromoDialogComponent, {
      width: '900px',
      maxHeight: '600px',
      // Le pasamos solo los id del grupo y profesor ya que es lo único que hace falta para vincular los alumnos
      data: {
        coleccion: this.coleccion,
      }
    });

     // RECUPERAREMOS LA NUEVA LISTA DE LOS CROMO Y VOLVEREMOS A BUSCAR LOS CROMOS QUE TIENE LA COLECCION
    dialogRef.afterClosed().subscribe(cromosAgregados => {
      console.log ('volvemos de agregar cromos ' + cromosAgregados.length);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0 ; i < cromosAgregados.length; i++) {
        this.cromosColeccion.push (cromosAgregados[i]);
      }
      this.TraeImagenColeccion(this.coleccion);
      this.TraeImagenesCromos();

     });
  }

  // TAMBIEN EDITAREMOS EL CROMO EN UN DIALOGO
  AbrirDialogoEditarCromo(cromo: Cromo): void {

    const dialogRef = this.dialog.open ( EditarCromoDialogComponent , {
      width: '900px',
      maxHeight: '600px',
      data: {
        cr : cromo,
        coleccion: this.coleccion,
      }
    });

    // tslint:disable-next-line:no-shadowed-variable
    dialogRef.afterClosed().subscribe( cromo => {
      // console.log ('volvemos de editar cromos ' + cromosEditados.length);
      // tslint:disable-next-line:prefer-for-of
      this.cromosColeccion = this.cromosColeccion.filter(c => c.id !== cromo.id);
      this.cromosColeccion.push (cromo);
      // this.cromosColeccion = this.sesion.DameCromos();
      // this.coleccion = this.sesion.DameColeccion();
      this.TraeImagenColeccion(this.coleccion);
      this.TraeImagenesCromos();

    });
  }

  // Guardo cromo en sesión, porque lo necesitará el componente de editar cromo
  GuardarCromo(cromo: Cromo) {
    console.log('voy a enviar');
    this.sesion.TomaCromo(cromo);


  }

  // Si queremos borrar un cromo, antes nos saldrá un aviso para confirmar la acción como medida de seguridad. Esto se
  // hará mediante un diálogo al cual pasaremos el mensaje y el nombre del equipo
  AbrirDialogoConfirmacionBorrarCromo(cromo: Cromo): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: cromo.Nombre,
      }
    });

    // Antes de cerrar recogeremos el resultado del diálogo: Borrar (true) o cancelar (false). Si confirmamos, borraremos
    // el punto (función BorrarPunto) y mostraremos un swal con el mensaje de que se ha eliminado correctamente.
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.BorrarCromo(cromo);
        Swal.fire('Eliminado', cromo.Nombre + ' eliminado correctamente', 'success');

      }
    });
  }

  // Utilizamos esta función para eliminar un cromo de la base de datos y actualiza la lista de cromos
  BorrarCromo(cromo: Cromo) {
    const posicion = this.cromosColeccion.indexOf (cromo);
    console.log ('voy a borrar el cromo ' + cromo.id +  ' de la posición ' + posicion);

    this.peticionesAPI.BorrarCromo (cromo.id).subscribe( () => {
        const nueva = this.cromosColeccion.slice(0, posicion).concat(this.cromosColeccion.slice(posicion + 1, this.cromosColeccion.length))
        this.cromosColeccion = nueva;
        console.log ('ya esta borrado');
        console.log (this.cromosColeccion);
      }
    );
    console.log (this.cromosColeccion);
    this.peticionesAPI.BorrarImagenCromo(cromo.ImagenDelante).subscribe( () => {
        // tslint:disable-next-line:max-line-length
        const nueva = this.imagenesCromosDelante.slice(0, posicion).concat(this.imagenesCromosDelante.slice(posicion + 1, this.imagenesCromosDelante.length));
        this.imagenesCromosDelante = nueva;
      }
    );
    if (cromo.ImagenDetras !== undefined) {
      this.peticionesAPI.BorrarImagenCromo(cromo.ImagenDelante).subscribe( () => {
        // tslint:disable-next-line:max-line-length
        const nueva = this.imagenesCromosDetras.slice(0, posicion).concat(this.imagenesCromosDetras.slice(posicion + 1, this.imagenesCromosDetras.length));
        this.imagenesCromosDelante = nueva;
      }
      );
    }



  }


  // Le pasamos la coleccion y buscamos la imagen que tiene y las imagenes de sus cromos
 TraeImagenColeccion(coleccion: Coleccion) {

  console.log('entro a buscar cromos y foto');
  console.log(coleccion.ImagenColeccion);
  // Si la coleccion tiene una foto (recordemos que la foto no es obligatoria)
  if (coleccion.ImagenColeccion !== undefined) {

    this.imagenColeccion = URL.ImagenesColeccion + coleccion.ImagenColeccion ;

    // Sino la imagenColeccion será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
  } else {
    this.imagenColeccion = undefined;
  }


  // Una vez tenemos el logo del equipo seleccionado, buscamos sus alumnos
  console.log('voy a mostrar los cromos de la coleccion ' + coleccion.id);

  // Ordena los cromos por nombre. Asi si tengo algun cromo repetido, salen juntos
  this.cromosColeccion.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
  this.TraeImagenesCromos();

  }
  goBack() {
    if (this.cambios) {
      const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
        height: '150px',
        data: {
          mensaje: 'Dale a Aceptar si no quieres que se hagan los cambios en el nombre o en la imagen de la colección'
        }
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.location.back();
        }
      });
    } else {
      this.location.back();
    }
  }
  Voltear() {
    this.voltear = !this.voltear;
  }

  GuardarColeccion() {
    this.mostrarTextoGuardar = true;
    // delete this.familiaElegida.id;
    // delete this.familiaElegida.profesorId;

    // creamos un objeto con los datos de la colección tal y como se necesitan
    // para generar el JSON
    const coleccion = {
      Nombre:  this.coleccion.Nombre,
      ImagenColeccion: this.coleccion.ImagenColeccion,
      DosCaras: this.coleccion.DosCaras,
      cromos: []
    };
    this.cromosColeccion.forEach (cromo => {
      const c = {
        nombreCromo: cromo.Nombre,
        nombreImagenCromoDelante: cromo.ImagenDelante,
        nombreImagenCromoDetras: cromo.ImagenDetras,
        nivelCromo: cromo.Nivel,
        probabilidadCromo: cromo.Probabilidad,
      };
      coleccion.cromos.push(c);
    });

    console.log ('asi queda la colección');
    console.log (coleccion);




    const theJSON = JSON.stringify(coleccion);
    console.log ('asi queda el JSON');
    console.log (theJSON);

    const uri = "data:application/json;charset=UTF-8," + encodeURIComponent(theJSON);

    // Este es un nuevo caso en el que tenemos que obtener de la vista html un elemento
    // que está protegido por un *ngIf. El sistema primero intenta obtener el elemento y puede
    // encontrar que el elemento aún no existe. Para invertir el orden ponemos un temporizador,
    // con lo que primero creará el elemento y luego lo obtendrá. Un tiempo 0 es suficiente.

    this.interval = setInterval(() => {
      const a = document.getElementById('generarJSON');
      a.setAttribute ('href', uri);
      a.setAttribute ('download', this.coleccion.Nombre);
      a.innerHTML = "Botón derecho y selecciona 'deja el enlace como...'";
      clearInterval(this.interval);
    }, 0);





  }
}
