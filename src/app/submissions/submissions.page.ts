import { OnInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-submissions',
  templateUrl: 'submissions.page.html',
  styleUrls: ['submissions.page.scss']
})
export class SubmissionsPage implements OnInit {
  data: any[] = [];
  constructor(
    private http: HttpClient,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.load(null);
  }

  load(event){
    this.http.get("http://madushatest.atwebpages.com/get.php").subscribe(data => {
      this.data = data as any[];
      if(event)
        event.target.complete();
    }, async error => {
      if(event)
        event.target.complete();
      (await this.toastController.create({
        message: 'Error connecting to server',
        duration: 2000
      })).present();
    })
  }
}
