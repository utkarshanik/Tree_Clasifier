import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  predictions: any[] = [];
  loading: boolean = false; 

  // For image URL
  // predictionKey='A83Ti7WvL76vmyFAXrIOOqQOw5KyyQvOHmEAabxEbI0VxMFKJxA3JQQJ99BEACYeBjFXJ3w3AAAIACOGNGTp'
  // endpoint='https://mscustomevisionai-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/71171d66-bbc3-49cf-8bca-3acbdf8e30c5/classify/iterations/TreeClassifier/url';
  // content-type :application/json

  //Image file
  predictionKey = 'A83Ti7WvL76vmyFAXrIOOqQOw5KyyQvOHmEAabxEbI0VxMFKJxA3JQQJ99BEACYeBjFXJ3w3AAAIACOGNGTp';
  endpoint = 'https://mscustomevisionai-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/71171d66-bbc3-49cf-8bca-3acbdf8e30c5/classify/iterations/TreeClassifier/image';

  constructor(private http: HttpClient) {}

  onImageChange(event: any) //When File loads a event fires
  {
    console.log(event); // event has target object,as user can select multifle , we take the on file only => files[0]
    const file = event.target.files[0];
    this.selectedImage = file;

    //FileReader is a built-in async Web API , used to read the contents of files 
    const reader = new FileReader(); // Creted the instnce of FileReader()
    reader.onload = e => this.imagePreview = reader.result; //callback function when the file has finished loading and sets result[base 64] to the imagepreview..
    reader.readAsDataURL(file);//Reads file and converts it to a base64-encoded string (used for image previews)
    this.predictions = [];
  }

  predict() {
    if (!this.selectedImage) return;
    this.loading = true; 
    const headers = new HttpHeaders({
      'Prediction-Key': this.predictionKey,
      'Content-Type': 'application/octet-stream' // As the img is in binary format i.e we are giving actual img not url
    });
    
    const reader = new FileReader(); // reder gets current selected file
    reader.readAsArrayBuffer(this.selectedImage); // Parsing  image in binary Format
    reader.onload = () => {
      const imageData = reader.result as ArrayBuffer; // loads the reader result of "type ArrayBuffer......"

      this.http.post<any>(this.endpoint, imageData, { headers }) // Making Post req
        .subscribe({                                             // Subscibing to the response i.e getting it
          next: (response) => {
            this.predictions = response.predictions;           // Extracting it into prediction
            console.log(this.predictions);
            this.loading = false; 
          },
          error: (error) => { 
            console.error('Prediction error:', error);
            this.loading = false;
          }
        });
    };
  }
}
