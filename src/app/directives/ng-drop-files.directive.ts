import { FileItemModel } from '../models/file-item.model';
import {
  Directive,
  EventEmitter,
  ElementRef,
  HostListener,
  Input,
  Output
} from '@angular/core';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos: FileItemModel[] = [];
  //Inicializando el event emitter
  @Output() mouseOver: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any) {
    //emitiendo eventos
    this.mouseOver.emit(true);
    this.preventOpenFile(event);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    //emitiendo eventos
    this.mouseOver.emit(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any) {

    const transferencia = this.getTransferencia(event);

    if (!transferencia) {
      return;
    }

    this.extractFile(transferencia.files);

    this.preventOpenFile(event);

    //emitiendo eventos
    this.mouseOver.emit(false);
  }

  private getTransferencia(event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private extractFile(archivosLista: FileList) {
    //console.log(archivoLista);

    // tslint:disable-next-line: forin
    for (const propiedad in Object.getOwnPropertyNames(archivosLista)) {
      const archivoTemporal = archivosLista[propiedad];
      if (this.fileCanUpload(archivoTemporal)) {
        const nuevoArchivo = new FileItemModel(archivoTemporal);
        this.archivos.push(nuevoArchivo);
      }
    }

    console.log('archivos', this.archivos);
  }

  //Validations
  private fileCanUpload(archivo: File): boolean {
    if (!this.fileWasUpload(archivo.name) && this.isImageFile(archivo.type)) {
      return true;
    } else {
      return false;
    }
  }


  private preventOpenFile(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  private fileWasUpload(fileName: string): boolean {

    for (const archivo of this.archivos) {
      if (archivo.nombreArchivo === fileName) {
        console.log('El archivo ' + fileName + ' ya fue cargado');
        return true;
      }
    }

    return false;
  }

  private isImageFile(fileType: string): boolean {

    return (fileType === '' || fileType === undefined) ? false : fileType.startsWith('image');
  }

}
