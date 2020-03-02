import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { FileItemModel } from '../models/file-item.model';

@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private carpetaImagenes = 'img';
  constructor(private firestore: AngularFirestore) { }

  cargarImagenesFirebase(imagenes: FileItemModel[]) {

    const storageRef = firebase.storage().ref();
    for (const item of imagenes) {

      item.estaSubiendo = true;
      if (item.progreso >= 100) {
        continue;
      }

      const uploadTask: firebase.storage.UploadTask =
        storageRef.child(`${this.carpetaImagenes}/${item.nombreArchivo}`)
          .put(item.archivo);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) =>
          item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        (error) => console.error('Error al subir', error),
        () => {
          console.log('Imagen cargada correctamente');

          item.estaSubiendo = false;
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            item.url = downloadURL;
            this.guardarImagen({
              nombre: item.nombreArchivo,
              url: item.url
            });
          });
        });
    }
  }

  guardarImagen(imagen: { nombre: string, url: string }) {
    this.firestore.collection(`/${this.carpetaImagenes}`)
      .add(imagen);
  }

}
