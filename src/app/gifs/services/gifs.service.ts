import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {
  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = 'DcFKPPDAzex1YJEoX8g1G72czzRGpZpZ';
  private serviceUrl: string = 'http://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizedHistory(tag: string) {
    // Lo pasamos todo a minúscula.
    tag = tag.toLowerCase();

    // Borramos el tag anterior con esta lógica.
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    // Insertamos el tag nuevo al principo.
    this._tagsHistory.unshift(tag);

    // Que no se pueda ejecutar más de 10 búsquedas.
    this._tagsHistory = this.tagsHistory.splice(0, 10);

    // Guardamos los datos de búsqueda en el Local Storage.
    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem("history", JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage():void {
    if( !localStorage.getItem("history")) return;
    this._tagsHistory = JSON.parse(localStorage.getItem("history")!);

    // Nos deja el último gifs seleccionado al recargar la página.
    if(this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0])



  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizedHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', 10)
      .set('q', tag);

    // importar API en Angular de esta forma.
    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe((resp) => {
        this.gifList = resp.data;
      });
  }





}
