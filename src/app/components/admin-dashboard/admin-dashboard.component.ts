import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
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
        <h3>{{ editingProductId ? 'Edit Product' : 'Add New Product' }}</h3>
        <form (ngSubmit)="submitForm()">
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
          <button type="submit">{{ editingProductId ? 'Save Product' : 'Create Product' }}</button>
          <button type="button" *ngIf="editingProductId" class="cancel-btn" (click)="cancelEdit()">Cancel</button>
        </form>
        <p *ngIf="message" [ngClass]="{'success': !isError, 'error': isError}">{{message}}</p>
      </div>

      <div class="products-list">
        <h3>Current Products</h3>
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Price</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let p of products">
              <td>{{p.id}}</td><td>{{p.name}}</td><td>R{{p.price}}</td>
              <td class="actions">
                <button (click)="editProduct(p)" class="icon-btn">✏️</button>
                <button (click)="deleteProduct(p.id)" class="icon-btn delete">🗑️</button>
              </td>
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
    .cancel-btn { background: #dc3545; margin-top: 10px; }
    .actions { display: flex; gap: 5px; }
    .icon-btn { padding: 5px; background: transparent; border: none; cursor: pointer; font-size: 1.2em; width: auto; }
    .icon-btn:hover { background: #eee; border-radius: 4px; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  products: any[] = [];
  newProduct = { name: '', description: '', price: null as any, imageUrl: '' };
  message = '';
  isError = false;
  editingProductId: number | null = null;

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() { 
    this.loadProducts(); 
    this.route.queryParams.subscribe(params => {
      if (params['edit']) {
        const id = +params['edit'];
        setTimeout(() => {
          const p = this.products.find(prod => prod.id === id);
          if (p) this.editProduct(p);
        }, 500); // Wait for products to load
      }
    });
  }

  loadProducts() {
    this.api.getProducts().subscribe(res => this.products = res);
  }

  submitForm() {
    if (this.editingProductId) {
      this.api.updateProduct(this.editingProductId, this.newProduct).subscribe({
        next: (res) => {
          this.message = 'Product updated successfully!';
          this.isError = false;
          this.cancelEdit();
          this.loadProducts();
        },
        error: (err) => {
          this.message = 'Insufficient product information.';
          this.isError = true;
        }
      });
    } else {
      this.api.addProduct(this.newProduct).subscribe({
        next: (res) => {
          this.message = 'Product added successfully!';
          this.isError = false;
          this.newProduct = { name: '', description: '', price: null as any, imageUrl: '' };
          this.loadProducts();
        },
        error: (err) => {
          this.message = 'Insufficient product information.';
          this.isError = true;
        }
      });
    }
  }

  editProduct(product: any) {
    this.editingProductId = product.id;
    this.newProduct = { ...product };
    this.message = '';
  }

  cancelEdit() {
    this.editingProductId = null;
    this.newProduct = { name: '', description: '', price: null as any, imageUrl: '' };
    this.message = '';
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.api.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: () => {
          this.message = 'Error deleting product.';
          this.isError = true;
        }
      });
    }
  }
}
