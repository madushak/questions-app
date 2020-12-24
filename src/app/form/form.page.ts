import { Component } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-form',
  templateUrl: 'form.page.html',
  styleUrls: ['form.page.scss']
})
export class FormPage {
  questions: any[] = [];
  internet: boolean = true;
  file: File;

  /**
   * Constructor of the component
   * 
   * @param network Ionic native provider for device network status
   * @param toastController Toast message module
   * @param storage Ionic local storage module (used for persisting form data locally)
   * @param http Angular http client module
   */
  constructor(
    private network: Network,
    private toastController: ToastController,
    private storage: Storage,
    private http: HttpClient
  ) {
    // detect the network connectivity lost event.
    this.network.onDisconnect().subscribe(async () => {
      (await this.toastController.create({
        message: 'network was disconnected',
        duration: 2000
      })).present();

      this.internet = false;
    });

    // detect network connectivity restore event.
    this.network.onConnect().subscribe(() => {
      //wait for 2 seconds before sending data to make sure connection is stable
      setTimeout(async() => {
        (await this.toastController.create({
          message: 'Connected to a network',
          duration: 2000
        })).present();
  
        this.internet = true;
        // check if storage has items and try posting if unsent data exists in storage
        this.storage.get('data').then(item => {
          if(item){
            this.postData(item);
          }
        });
      }, 2000);
    });

    // add questions here
    this.questions.push({ title: "Question #1", question: "This is the question which needs answers from you right now?", answer: {} });
    this.questions.push({ title: "Question #2", question: "This is the question which needs answers from you right now?", answer: {} });
    this.questions.push({ title: "Question #3", question: "This is the question which needs answers from you right now?", answer: {} });
    //...
  }

  /**
   * Method to post data to the server
   * 
   * @param item questions/answers object to be serialized
   */
  async postData(item: any) {
    let formData = new FormData();
    formData.append('json', JSON.stringify(item)); // converts all the answers and photos to a json object
    
    (await this.toastController.create({
      message: 'Submitting data',
      duration: 2000
    })).present();

    // submits data to php server
    this.http.post(`${environment.api}/post.php`, formData).subscribe(async (data) => {
      // clear storage if data is successfully submitted
      this.storage.clear();
      (await this.toastController.create({
        message: 'Submission completed',
        duration: 2000
      })).present();
    }, async (error) => {
      // persist data to storage if an error response received from server (ex. server unavailable etc)
      console.log(error);
      (await this.toastController.create({
        message: 'Saved data locally',
        duration: 2000
      })).present();

      this.storage.set('data', this.questions);
    });
  }

  /**
   * Submit button click event handler
   * 
   */
  async submit() {
    this.storage.set('data', this.questions);
    if (this.internet) {
      // send data to server and remove from storage
      this.postData(this.questions);
      this.storage.clear();
    } else {
      (await this.toastController.create({
        message: 'Saved data locally',
        duration: 2000
      })).present();
    }
  }

  /**
   * Toggle question body. Closes other open questions before opening the clicked one.
   * 
   * @param question question object
   */
  async toggle(question){
    let current = question.visible;
    this.questions.map(a => a.visible = false);
    question.visible = !current;
  }

  /**
   * File selector event handler. Converts file data into base64 data string and add to answer context.
   * 
   * @param fileChangeEvent file change event object holds the photos selected from gallery
   * @param answer user's answers
   */
  async onFileChange(fileChangeEvent, answer: any) {
    answer.files = [];
    if(fileChangeEvent.target.files){
      for (var j = 0; j < fileChangeEvent.target.files.length && j < 4; j++) {
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
