import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
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
        <div class="card" *ngFor="let p of products">
          <div class="image-placeholder">
            <img *ngIf="p.imageUrl" [src]="p.imageUrl" alt="Product Image">
            <span *ngIf="!p.imageUrl">Image Placeholder</span>
          </div>
          <div class="card-content">
            <h3>{{p.name}}</h3>
            <p>{{p.description}}</p>
            <p class="price">R{{p.price}}</p>
          </div>
          <div class="card-footer">
            <button *ngIf="!auth.isAdmin()" class="buy-btn" (click)="openBuyModal(p)">Buy Now</button>
            <div class="admin-controls" *ngIf="auth.isAdmin()">
              <button class="edit-btn" (click)="editProduct(p.id)">Edit Product</button>
              <button class="delete-btn" (click)="deleteProduct(p.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Fake Payment Modal -->
      <div class="modal" *ngIf="selectedProduct">
        <div class="modal-content">
          <h3>Secure Checkout for {{selectedProduct.name}}</h3>
          <p>Total: R{{selectedProduct.price}}</p>
          
          <div class="payment-form">
            <div class="form-group">
              <label>Card number</label>
              <div class="input-with-icons">
                <input type="text" [ngModel]="cardNumber" (ngModelChange)="onCardNumberChange($event)" (keypress)="allowOnlyNumbers($event)" (focus)="autofillPaymentDetails()" placeholder="1234 1234 1234 1234" maxlength="19" required>
                <div class="card-icons">
                  <span class="icon visa">VISA</span>
                  <span class="icon mc">MC</span>
                  <span class="icon amex">AMEX</span>
                </div>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group half">
                <label>Expiration date</label>
                <input type="text" [ngModel]="expiryDate" (ngModelChange)="onExpiryChange($event)" (keypress)="allowOnlyNumbers($event)" (focus)="autofillPaymentDetails()" placeholder="MM / YY" maxlength="7" required>
              </div>
              <div class="form-group half">
                <label>Security code</label>
                <div class="input-with-icons">
                  <input type="text" [ngModel]="cvc" (ngModelChange)="onCvcChange($event)" (keypress)="allowOnlyNumbers($event)" (focus)="autofillPaymentDetails()" placeholder="CVC" maxlength="3" required>
                  <span class="icon cvc-icon">💳</span>
                </div>
              </div>
            </div>
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
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; align-items: stretch; }
    .card { background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; flex-direction: column; height: 100%; box-sizing: border-box; }
    .image-placeholder { height: 200px; width: 100%; border-radius: 8px; overflow: hidden; background: #eee; display: flex; justify-content: center; align-items: center; margin-bottom: 15px; }
    .image-placeholder img { width: 100%; height: 100%; object-fit: cover; }
    .card-content { flex: 1; }
    .card-content h3 { margin-top: 0; }
    .card-footer { margin-top: auto; padding-top: 15px; }
    .price { font-weight: bold; font-size: 1.2em; color: #003b5c; margin: 10px 0; }
    button { background: #28a745; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer; width: 100%;}
    
    /* Modal Styles */
    .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; }
    .modal-content { background: white; padding: 30px; border-radius: 8px; width: 450px; max-width: 90%; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; color: #333; font-size: 0.9em; }
    .form-group input { width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
    .form-row { display: flex; gap: 15px; }
    .half { flex: 1; }
    .input-with-icons { position: relative; }
    .card-icons { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); display: flex; gap: 4px; }
    .cvc-icon { position: absolute; right: 10px; top: 8px; font-size: 1.2em; }
    .icon { font-weight: bold; font-size: 0.8em; padding: 2px 5px; border-radius: 3px; color: white; }
    .visa { background: #1a1f71; } .mc { background: #eb001b; } .amex { background: #2e77bc; }
    
    /* Modal Actions Layout and Button Colors */
    .modal-actions { display: flex; flex-direction: row; gap: 10px; margin-top: 20px; }
    .modal-actions button { flex: 1; }
    .modal-actions .cancel { background: #dc3545; }
    .modal-actions .confirm { background: #003b5c; }
    
    .success { color: green; margin-top: 10px; font-weight: bold; }
    .error { color: red; margin-top: 10px; font-weight: bold; }

    .admin-controls { display: flex; gap: 10px; }
    .edit-btn { background: #003b5c; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer; flex: 1; }
    .delete-btn { background: #dc3545; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer; flex: 1; }
  `]
})
export class StorefrontComponent implements OnInit {
  products: any[] = [];
  selectedProduct: any = null;
  cardNumber: string = '';
  expiryDate: string = '';
  cvc: string = '';
  message: string = '';
  isError: boolean = false;

  constructor(private api: ApiService, public auth: AuthService, private router: Router) {}
  
  ngOnInit() {
    this.api.getProducts().subscribe(res => this.products = res);
  }

  autofillPaymentDetails() {
    const savedCard = localStorage.getItem('saved_cardNumber');
    const savedExpiry = localStorage.getItem('saved_expiryDate');
    const savedCvc = localStorage.getItem('saved_cvc');
    
    if (savedCard && !this.cardNumber) this.cardNumber = savedCard;
    if (savedExpiry && !this.expiryDate) this.expiryDate = savedExpiry;
    if (savedCvc && !this.cvc) this.cvc = savedCvc;
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only numbers (0-9)
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  onCardNumberChange(value: string) {
    setTimeout(() => {
      let v = value.replace(/\D/g, '').substring(0, 16);
      this.cardNumber = v.match(/.{1,4}/g)?.join(' ') || '';
    });
  }

  onExpiryChange(value: string) {
    setTimeout(() => {
      let v = value.replace(/\D/g, '').substring(0, 4);
      if (v.length >= 3) {
        this.expiryDate = `${v.substring(0, 2)} / ${v.substring(2)}`;
      } else {
        this.expiryDate = v;
      }
    });
  }

  onCvcChange(value: string) {
    setTimeout(() => {
      this.cvc = value.replace(/\D/g, '').substring(0, 3);
    });
  }

  openBuyModal(product: any) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.selectedProduct = product;
    this.cardNumber = '';
    this.expiryDate = '';
    this.cvc = '';
    this.message = '';
  }

  confirmBuy() {
    if (!this.cardNumber || !this.expiryDate || !this.cvc) {
      this.message = 'Please fill out all payment details.';
      this.isError = true;
      return;
    }

    if (this.cardNumber.length !== 19) {
      this.message = 'Card number must be exactly 16 digits.';
      this.isError = true;
      return;
    }

    if (this.expiryDate.length !== 7) {
      this.message = 'Expiration date must be 4 digits (MMYY).';
      this.isError = true;
      return;
    }

    if (this.cvc.length !== 3) {
      this.message = 'Security code must be exactly 3 digits.';
      this.isError = true;
      return;
    }

    // Save for autofill later
    localStorage.setItem('saved_cardNumber', this.cardNumber);
    localStorage.setItem('saved_expiryDate', this.expiryDate);
    localStorage.setItem('saved_cvc', this.cvc);

    const bankingDetails = `${this.cardNumber} | ${this.expiryDate} | ${this.cvc}`;

    this.api.buyProduct({ productId: this.selectedProduct.id, bankingDetails }).subscribe({
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

  editProduct(id: number) {
    this.router.navigate(['/admin'], { queryParams: { edit: id } });
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.api.deleteProduct(id).subscribe({
        next: () => this.ngOnInit(),
        error: (err) => alert('Error deleting product')
      });
    }
  }
}
