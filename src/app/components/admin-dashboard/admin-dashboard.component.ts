import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="dashboard">
      <h2>Admin Dashboard: Manage Store</h2>
      
      <div class="card add-product-card">
        <h3>Add New Product</h3>
        <form (ngSubmit)="addProduct()">
          <div class="form-group">
            <label>Name:</label>
            <input type="text" [(ngModel)]="newProduct.name" name="name" required>
          </div>
          <div class="form-group">
            <label>Description (sanitized for XSS):</label>
            <textarea [(ngModel)]="newProduct.description" name="description"></textarea>
          </div>
          <div class="form-group">
            <label>Price:</label>
            <input type="number" [(ngModel)]="newProduct.price" name="price" required min="1">
          </div>
          <div class="form-group">
            <label>Image URL:</label>
            <input type="text" [(ngModel)]="newProduct.imageUrl" name="imageUrl">
          </div>
          <button type="submit">Create Product</button>
        </form>
        <p *ngIf="message" [ngClass]="{'success': !isError, 'error': isError}">{{message}}</p>
      </div>

      <div class="products-list">
        <h3>Current Products</h3>
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Price</th></tr></thead>
          <tbody>
            <tr *ngFor="let p of products">
              <td>{{p.id}}</td><td>{{p.name}}</td><td>R{{p.price}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { display: flex; gap: 20px; flex-wrap: wrap; }
    .card { background: #f9f9f9; padding: 20px; border-radius: 8px; flex: 1; min-width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .products-list { flex: 2; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; }
    input, textarea { width: 100%; padding: 8px; box-sizing: border-box; }
    button { background: #003b5c; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; width: 100%;}
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
    th { background-color: #003b5c; color: white; }
    .success { color: green; font-weight: bold; }
    .error { color: red; font-weight: bold; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  products: any[] = [];
  newProduct = { name: '', description: '', price: null, imageUrl: '' };
  message = '';
  isError = false;

  constructor(private api: ApiService) {}

  ngOnInit() { this.loadProducts(); }

  loadProducts() {
    this.api.getProducts().subscribe(res => this.products = res);
  }

  addProduct() {
    this.api.addProduct(this.newProduct).subscribe({
      next: (res) => {
        this.message = 'Product added successfully!';
        this.isError = false;
        this.newProduct = { name: '', description: '', price: null, imageUrl: '' };
        this.loadProducts();
      },
      error: (err) => {
        this.message = 'Error adding product (Check permissions/inputs).';
        this.isError = true;
      }
    });
  }
}
