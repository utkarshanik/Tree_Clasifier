import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [CommonModule,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone:true
})
export class AppComponent {
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  predictions: any[] = [];

  predictionKey = 'A83Ti7WvL76vmyFAXrIOOqQOw5KyyQvOHmEAabxEbI0VxMFKJxA3JQQJ99BEACYeBjFXJ3w3AAAIACOGNGTp';
  endpoint = 'https://mscustomevisionai-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/71171d66-bbc3-49cf-8bca-3acbdf8e30c5/classify/iterations/TreeClassifier/image';
  projectId = '71171d66-bbc3-49cf-8bca-3acbdf8e30c5';
  publishedName = 'TreeClassifier';

  constructor(private http: HttpClient) {}

  onImageChange(event: any) {
    const file = event.target.files[0];
    this.selectedImage = file;

    const reader = new FileReader();
    reader.onload = e => this.imagePreview = reader.result;
    reader.readAsDataURL(file);

    this.predictions = [];
  }

  predict() {
    if (!this.selectedImage) return;
  
    const headers = new HttpHeaders({
      'Prediction-Key': this.predictionKey,
      'Content-Type': 'application/octet-stream'
    });
  
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as ArrayBuffer;
  
      this.http.post<any>(this.endpoint, imageData, { headers })
        .subscribe(
          response => this.predictions = response.predictions,
          error => console.error('Prediction error:', error)
        );
    };
  
    reader.readAsArrayBuffer(this.selectedImage);
  }
  

}
