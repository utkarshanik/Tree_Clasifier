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
  loading: boolean = false; // 🔁 Add this flag

  predictionKey = 'A83Ti7WvL76vmyFAXrIOOqQOw5KyyQvOHmEAabxEbI0VxMFKJxA3JQQJ99BEACYeBjFXJ3w3AAAIACOGNGTp';
  endpoint = 'https://mscustomevisionai-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/71171d66-bbc3-49cf-8bca-3acbdf8e30c5/classify/iterations/TreeClassifier/image';

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

    this.loading = true; // 🔁 Start loading

    const headers = new HttpHeaders({
      'Prediction-Key': this.predictionKey,
      'Content-Type': 'application/octet-stream'
    });

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as ArrayBuffer;

      this.http.post<any>(this.endpoint, imageData, { headers })
        .subscribe({
          next: (response) => {
            this.predictions = response.predictions;
            this.loading = false; // ✅ Stop loading
          },
          error: (error) => {
            console.error('Prediction error:', error);
            this.loading = false; // ✅ Stop loading on error
          }
        });
    };

    reader.readAsArrayBuffer(this.selectedImage);
  }
}
