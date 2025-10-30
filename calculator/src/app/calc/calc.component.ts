import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.css']
})
export class CalcComponent {
  public weight: number | null = null; 
  public height: number | null = null; 
  public result = 'Enter your weight and height and press calculate';

  public calc() {
    if (this.weight != null && this.height != null && this.height > 0) {
      const h = this.height / 100;        
      const bmi = this.weight / (h * h);  
      this.result = `BMI: ${bmi.toFixed(2)} (${this.category(bmi)})`;
    } else {
      this.result = 'Please enter weight and height (> 0).';
    }
  }

  private category(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obesity';
  }
}
