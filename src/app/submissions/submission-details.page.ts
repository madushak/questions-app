import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import {ActivatedRoute} from "@angular/router";
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-submission-details',
  templateUrl: 'submission-details.page.html',
  styleUrls: ['submission-details.page.scss']
})
export class SubmissionDetailsPage {
  data: any[] = [];
  api: string;

  /**
   * Constructor of the component
   * 
   * @param http Angular http client module
   * @param toastController Toast message module
   * @param route Information provider about current page's route (URL parameters etc)
   */
  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe( params => {
      this.load(params.submission_id);
    });

    this.api = environment.api;
  }

  /**
   * Gets answers of a submission
   * 
   * @param submission_id Submission id
   */
  load(submission_id: string){
    this.http.get(`${environment.api}/get.php?submission_id=${submission_id}`).subscribe(data => {
      this.data = data as any[];
    }, async error => {
      console.log(error);
      (await this.toastController.create({
        message: 'Error connecting to server',
        duration: 2000
      })).present();
    })
  }
}
