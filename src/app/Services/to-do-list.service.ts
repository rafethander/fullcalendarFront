import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToDos } from '../Models/ToDos';
import { Observable, of } from 'rxjs';
import { GetResult } from '../Models/GetResult';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ToDoListService {

  constructor(private http: HttpClient,private messageService: MessageService) { }

  private url="http://localhost:53815/api/ToDos/";

  private httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
  }

  Add(Todo: ToDos): Observable<GetResult>{
    return this.http.post<ToDos>(`${this.url}Add`,Todo,this.httpOptions)
      .pipe(
        catchError(this.hataYakala<any>('ToDoAdd'))
      );
  }

  Get(): Observable<ToDos[]>{
    return this.http.get<ToDos[]>(`${this.url}Get`,this.httpOptions).pipe(catchError(this.hataYakala<any>('ToDoGet')));
  }

  Delete(id: string): Observable<GetResult>{
    return this.http.delete<string>(`${this.url}Delete/${id}`,this.httpOptions).pipe(catchError(this.hataYakala<any>('ToDoDelete')));
  }




  showError(messageDetail: string) {
    this.messageService.add({severity:'error', summary: 'Hata', detail:`${messageDetail}`});
  }

  /**
   * Http operasyonları hata verdiğinde çalışacak metot
   * @param operasyon - hata nerde oluştu? metodun ismi
   * @param sonuc - hata oluştuğunda dönülecek varsayılan değer (isteğe bağlı)
   */
  private hataYakala<T>(operasyon='operasyon', sonuc?: T)
  {
    

      return (hata: any):Observable<T>=>{this.showError("Beklenmedik Bir Servis Hatası Oluştu.");

      //todo: hatayı depolayacak uzak bir servise gönder
      console.error(`Beklenmedik servis hatası: ${JSON.stringify(hata)}`);
      

      //todo: kullanıcıya gösterebilmek  için hatayı uygun formata çevir
      //this.log(`${operasyon} metodunda hata: ${JSON.stringify(hata)}`);

      //Uygulamanın çalışmayı kesmeden devam edebilmesi için boş bir değer dönüyoruz.
      return of(sonuc as T);

    }

  }
}
