import { Component, OnInit, ViewChild} from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput, FullCalendarComponent} from '@fullcalendar/angular';
import { Guid } from "guid-typescript";
import { ToDoListService } from 'src/app/Services/to-do-list.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToDos } from 'src/app/Models/ToDos';





@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoListComponent implements OnInit {


  toDosList: EventInput[]=[];
  
 
    calendarVisible = true;
   calendarOptions: CalendarOptions = {

       headerToolbar: {
         left: 'prev,next',
         center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
       },
       initialView: 'dayGridMonth',
       selectable: true,
     }

   
  

  constructor(private todolistService: ToDoListService,private messageService: MessageService,private confirmationService: ConfirmationService)
   { 
    
  }

  ngOnInit(): void {
      this.getEvent();
    setTimeout(() => {
      this.calendarOptions = {
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
          },
        initialView: 'dayGridMonth',
        selectable: true,
        select: this.dateSelect.bind(this),
        eventClick:this.eventClick.bind(this),
        events: this.toDosList
      };
    }, 2000);
    
}
  
  

  dateSelect(element: DateSelectArg) {
    const title = prompt('Lütfen bir başlık giriniz.');
  
    if(title==null){
      return;
    }
    if (title.length>0) {

      let id=Guid.create().toString();
      let start=element.start;
      let end=element.end;
      this.todolistService.Add({id,title,start,end} as ToDos)
      .subscribe(sonuc=>{
        if(sonuc.message=='Ok'){
          this.getEvent();
          setTimeout(() => {
            this.calendarOptions = {
              headerToolbar: {
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },  
              initialView: 'dayGridMonth',
              selectable: true,
              select: this.dateSelect.bind(this),
              eventClick:this.eventClick.bind(this),
              events: this.toDosList
            };
          }, 3000);
          this.showSuccess('Kayıt İşlemi Gerçekleştirildi.');
        }else{
          this.showError('Beklenmedik Bir Hata Oluştu.');
        }
      })
      
    }else return;
  }

  
  eventClick(element: EventClickArg) {
    let id=element.event.id;
    this.confirmationService.confirm({
      message:`Yapılacak '${element.event.title}' adlı başlığı silmeyi onaylıyor musunuz?`,
      header: 'Silme Onay Ekranı',
      icon: 'pi pi-exclamation-triangle',
      key:'todosList',
      accept: ()=>{
        this.todolistService.Delete(id).subscribe(sonuc=>{
          if(sonuc.message='Ok'){
            this.getEvent();
            setTimeout(() => {
              this.calendarOptions = {
                headerToolbar: {
                  left: 'prev,next',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  },
                initialView: 'dayGridMonth',
                selectable: true,
                select: this.dateSelect.bind(this),
                eventClick:this.eventClick.bind(this),
                events: this.toDosList
              };
            }, 2000);
            this.showSuccess('Kayıt Silme İşlemi Gerçekleştirildi.');
          }else{
            this.showError('Beklenmedik Bir Hata Oluştu.');
          }
        })
      },
      reject:()=>{

      }
    });
  }



  getEvent(){
    this.todolistService.Get()
    .subscribe(sonuc=>{
      this.toDosList=sonuc;
      console.log(this.toDosList);
    })
      
  };

 
  
 




  showSuccess(messageDetail: string) {
    this.messageService.add({severity:'success', summary: 'Başarılı ', detail:`${messageDetail}`});
  }
  showError(messageDetail: string) {
    this.messageService.add({severity:'error', summary: 'Hata', detail:`${messageDetail}`});
  }
}



