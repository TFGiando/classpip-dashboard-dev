import { Component, OnInit } from '@angular/core';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Location } from '@angular/common';
import { Pregunta, Profesor } from 'src/app/clases';
import Swal from 'sweetalert2';
import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';

@Component({
  selector: 'app-mis-preguntas',
  templateUrl: './mis-preguntas.component.html',
  styleUrls: ['./mis-preguntas.component.scss']
})
export class MisPreguntasComponent implements OnInit {


  misPreguntas: Pregunta[];
  dataSource;
  profesor: Profesor;
  displayedColumns: string[] = ['titulo', 'pregunta', 'tematica', 'edit', ' '];

  mensaje = 'Confirmar que quieres eliminar la pregunta: ';

  constructor(  private sesion: SesionService,
                private peticionesAPI: PeticionesAPIService,
                public dialog: MatDialog,
                private location: Location) { }

  ngOnInit() {
    this.profesor = this.sesion.DameProfesor();
    this.DameTodasMisPreguntas();
  }

  //Cogemos todas las preguntas del profesor para rellenar la tabla
  DameTodasMisPreguntas() {
    this.peticionesAPI.DameTodasMisPreguntas(this.profesor.id)
    .subscribe( res => {
      if (res[0] !== undefined) {
        this.misPreguntas = res;
        this.dataSource = new MatTableDataSource(this.misPreguntas);
      } else {
        Swal.fire('Alerta', 'Aun no tienes ninguna pregunta', 'warning');
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  AbrirDialogoConfirmacionEliminarPregunta(pregunta: Pregunta): void {
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        pregunta: pregunta.Pregunta,
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.EliminarPregunta(pregunta);
        Swal.fire('Eliminado', 'Pregunta: ' + pregunta.Pregunta + ' eliminada correctamente', 'success');
      }
    });
  }

  EliminarPregunta(pregunta: Pregunta) {
    this.peticionesAPI.BorrarPregunta(pregunta.id)
    .subscribe (() => {
      this.misPreguntas = this.misPreguntas.filter (a => a.id !== pregunta.id);
      this.dataSource = new MatTableDataSource(this.misPreguntas);
    });
  }
}
