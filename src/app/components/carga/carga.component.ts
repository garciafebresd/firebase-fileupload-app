import { Component, OnInit } from '@angular/core';
import { FileItemModel } from '../../models/file-item.model';
import { CargaImagenesService } from '../../services/carga-imagenes.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styles: []
})
export class CargaComponent implements OnInit {

  isOverElement = false;
  archivos: FileItemModel[] = [];

  constructor(public cargaService: CargaImagenesService) { }

  ngOnInit() {
  }

  cargarImagenes() {
    this.cargaService.cargarImagenesFirebase(this.archivos);
  }

  mouseOverElement(event) {
    this.isOverElement = event;
  }

  limpiarArchivos() {
    this.archivos = [];
  }
}
