import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-import-excel',
  imports: [NavbarComponent],
  templateUrl: './import-excel.component.html',
  styleUrl: './import-excel.component.css'
})
export class ImportExcelComponent {
  url: string = 'http://localhost:51535';
  selectedFile: File | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  onFileSelected(event: Event) {
    debugger
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onUpload() {
    debugger
    if (!this.selectedFile) return;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.http.post(`${this.url}/api/ImportExcel/upload`, formData).subscribe(
      (response: any) => {
        debugger
        console.log('Upload successful', response);
        const fileInput = document.getElementById('importfile') as HTMLInputElement;
        fileInput.value = '';
      },
      (error) => {
        console.error('Upload failed', error);
      }
    );
  }
}
