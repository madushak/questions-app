import { OnInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-submissions',
  templateUrl: 'submissions.page.html',
  styleUrls: ['submissions.page.scss']
})
export class SubmissionsPage implements OnInit {
  data: any[] = [];

  /**
   * Constructor of the component
   * 
   * @param http Angular http client module
   * @param toastController Toast message module
   */
  constructor(
    private http: HttpClient,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.load(null);
  }

  /**
   * Gets data from server and populates to `data` property.
   * 
   * @param event event object is sent when method is called with 'pull to refresh' feature.
   */
  load(event){
    this.http.get(`${environment.api}/get.php`).subscribe(data => {
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
