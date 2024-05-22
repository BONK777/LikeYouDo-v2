import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  newCategory: {name: string, description: string, image: string} = {name: "", description: "", image: ""}
  newSubcategory: {name: string, description: string, image: string} = {name: "", description: "", image: ""}
  categories: any[] | null = null;
  creatingModal: boolean = false;
  adminToken: string | null = null;
  triedLogin: boolean = false;
  regToken: string = "";
  categoryToEdit: any | null = null;
  subcategoryAdding: boolean = false;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    const adminToken = localStorage.getItem('admintoken');
    if (adminToken != null) {
      this.dataService.adminEnter(adminToken).subscribe((_) => {
        this.adminToken = adminToken;
        this.fetchCategories();
      }, (_) => this.triedLogin = true);
    }
  }

  loginAdmin() {
    console.log(this.regToken)
    this.dataService.adminEnter(this.regToken).subscribe((_) => {
      this.adminToken = this.regToken;
      localStorage.setItem('admintoken', this.regToken);
    }, (error) => console.log(error));
  }
  
  fetchCategories() {
    this.dataService.getCategories().subscribe((categories) => {
      console.log(categories);
      this.categories = categories;
    });
  }

  showSubcategories(category: any) {
    this.categoryToEdit = category
  }

  closeSubcategories() {
    this.categoryToEdit = null;
  }

  openCreatingModal() {
    this.creatingModal = true;
  }

  closeCreatingModal() {
    this.creatingModal = false;
  }

  createNewCategory() {
    if (this.adminToken) {
      this.dataService.createCategory({
        data: this.newCategory,
        token: this.adminToken
      }).subscribe((_) => {
        console.log('done')
        this.fetchCategories();
      }, (err) => console.log(err));
      this.closeCreatingModal();
    }
  }

  deleteCategory(categoryId: string) {
    if (this.adminToken) {
      this.dataService.deleteCategory(this.adminToken, categoryId).subscribe((_) => {
        this.fetchCategories();
      });
    }
  }

  toggleSubcategoryAdding() {
    this.subcategoryAdding = !this.subcategoryAdding;
  }

  createNewSubcategory() {
    if (this.adminToken) {
      this.dataService.createSubcategory({
        data: {
          name: this.newSubcategory.name,
          description: this.newSubcategory.description,
          image: this.newSubcategory.image,
          category: this.categoryToEdit.id
        },
        token: this.adminToken
      }).subscribe((_) => {
        this.fetchCategories();
        this.dataService.getSubcategories(this.categoryToEdit.id).subscribe((category) => {
          this.categoryToEdit = category;
        });
      }, (err) => console.log(err));
    }
  }

  deleteSubcategory(subcategoryId: string) {
    if (this.adminToken) {
      this.dataService.deleteSubcategory(this.adminToken, subcategoryId).subscribe((_) => {
        this.fetchCategories();
        this.dataService.getSubcategories(this.categoryToEdit.id).subscribe((category) => {
          this.categoryToEdit = category;
        });
      })
    }
  }
}
