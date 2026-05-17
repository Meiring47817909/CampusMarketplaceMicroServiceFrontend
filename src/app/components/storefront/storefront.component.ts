import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-storefront',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="storefront">
      <h2>Welcome to NWU Campus Marketplace</h2>
      
      <div class="product-grid">
        <div class="product-card" *ngFor="let p of products">
          <img [src]="p.imageUrl || 'https://via.placeholder.com/150'" alt="{{p.name}}">
          <h3>{{p.name}}</h3>
          <p class="desc">{{p.description}}</p>
          <p class="price">R{{p.price}}</p>
          <button (click)="openBuyModal(p)">Buy Now</button>
        </div>
      </div>

      <!-- Fake Payment Modal -->
      <div class="modal" *ngIf="selectedProduct">
        <div class="modal-content">
          <h3>Secure Checkout for {{selectedProduct.name}}</h3>
          <p>Total: R{{selectedProduct.price}}</p>
          <div class="form-group">
            <label>Fake Banking Details (Saved Securely):</label>
            <input type="text" [(ngModel)]="bankingDetails" placeholder="Card number / Bank Account" required>
          </div>
          <div class="modal-actions">
            <button class="cancel" (click)="selectedProduct = null">Cancel</button>
            <button class="confirm" (click)="confirmBuy()">Confirm Payment</button>
          </div>
          <p *ngIf="message" [ngClass]="{'success': !isError, 'error': isError}">{{message}}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
    .product-card { background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
    .product-card img { max-width: 100%; border-radius: 4px; }
    .price { font-weight: bold; font-size: 1.2em; color: #003b5c; }
    button { background: #28a745; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer; width: 100%;}
    
    /* Modal Styles */
    .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; }
    .modal-content { background: white; padding: 30px; border-radius: 8px; width: 400px; max-width: 90%; }
    .form-group { margin-bottom: 15px; }
    .form-group input { width: 100%; padding: 10px; box-sizing: border-box; }
    .modal-actions { display: flex; gap: 10px; }
    .modal-actions .cancel { background: #dc3545; }
    .modal-actions .confirm { background: #003b5c; }
    .success { color: green; }
    .error { color: red; }
  `]
})
export class StorefrontComponent implements OnInit {
  products: any[] = [];
  selectedProduct: any = null;
  bankingDetails: string = '';
  message: string = '';
  isError: boolean = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getProducts().subscribe(res => this.products = res);
  }

  openBuyModal(product: any) {
    this.selectedProduct = product;
    this.bankingDetails = '';
    this.message = '';
  }

  confirmBuy() {
    if (!this.bankingDetails) {
      this.message = 'Please enter banking details.';
      this.isError = true;
      return;
    }

    this.api.buyProduct({ productId: this.selectedProduct.id, bankingDetails: this.bankingDetails }).subscribe({
      next: (res) => {
        this.message = 'Purchase successful! Database updated securely.';
        this.isError = false;
        setTimeout(() => this.selectedProduct = null, 2000);
      },
      error: (err) => {
        this.message = 'Purchase failed. You might need Student permissions.';
        this.isError = true;
      }
    });
  }
}
