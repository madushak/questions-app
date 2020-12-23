import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { Network } from '@ionic-native/network/ngx';
import { ActionSheetController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form',
  templateUrl: 'form.page.html',
  styleUrls: ['form.page.scss']
})
export class FormPage {
  questions: any[] = [];
  internet: boolean = false;
  file: File;

  constructor(
    public actionSheetController: ActionSheetController,
    private network: Network,
    private toastController: ToastController,
    private storage: Storage,
    private http: HttpClient
  ) {
    this.network.onDisconnect().subscribe(async () => {
      (await this.toastController.create({
        message: 'network was disconnected',
        duration: 2000
      })).present();

      this.internet = false;
    });

    this.network.onConnect().subscribe(() => {
      setTimeout(async() => {
        (await this.toastController.create({
          message: 'Connected to a network',
          duration: 2000
        })).present();
  
        this.internet = true;
        // check if storage has items and send
        this.storage.get('data').then(item => {
          if(item){
            this.postData(item);
          }
        });
      }, 2000);
    });

    this.questions.push({ title: "Question #1", question: "This is the question which needs answers from you right now?", answer: {} });
    this.questions.push({ title: "Question #2", question: "This is the question which needs answers from you right now?", answer: {} });
    this.questions.push({ title: "Question #3", question: "This is the question which needs answers from you right now?", answer: {} });

  }

  async postData(item: any) {
    let formData = new FormData();
    formData.append('json', JSON.stringify(item));
    
    (await this.toastController.create({
      message: 'Submitting data',
      duration: 5000
    })).present();

    this.http.post('https://webhook.site/929d160e-2f1c-40ac-9a23-925f7ec3fdac', formData).subscribe(async (data) => {
      this.storage.clear();
      (await this.toastController.create({
        message: 'Submission completed',
        duration: 2000
      })).present();
    }, async (error) => {
      (await this.toastController.create({
        message: 'Saved data locally',
        duration: 2000
      })).present();

      this.storage.set('data', this.questions);
    });
  }

  async submit() {
    this.storage.set('data', this.questions);
    if (this.internet) {
      //send data to network and remove from storage
      this.postData(this.questions);
      this.storage.clear();
    } else {
      (await this.toastController.create({
        message: 'Saved data locally',
        duration: 2000
      })).present();
    }
  }

  onFileChange(fileChangeEvent, answer: any) {
    answer.files = [];
    if(fileChangeEvent.target.files){
      for (var j = 0; j < fileChangeEvent.target.files.length; j++) {
        var reader = new FileReader();
        reader.onload = function(readerEvt) {
          let binaryString = readerEvt.target.result;
          answer.files.push(btoa(binaryString as string));
        };
        reader.readAsBinaryString(fileChangeEvent.target.files[j]);    
      }
    }
  }
}
