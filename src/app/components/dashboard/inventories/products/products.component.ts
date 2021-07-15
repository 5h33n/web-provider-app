import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-dialog-products',
    templateUrl: './dialog-products.component.html',
    styleUrls: ['../../../auth/register/business/business.component.css','./products.component.css'],
  })
  export class ProductsDialogComponent implements OnInit {
    productForm!: FormGroup;
    constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private productService: ProductService,
      private dialogRef: MatDialogRef<ProductsDialogComponent>
    ){}
    ngOnInit(): void {
      this.productForm = this.createProduct(null,null,null,null,null,null,null);
    }
    createProduct(name:string|null,description:string|null,price:number|null,photo:string|null,stock:number|null,unit:string|null,tags:string[]|null){
      return this.formBuilder.group({
        name: [name, [Validators.required]],
        description: [description, [Validators.required]],
        price: [price, [Validators.required]],
        photo: [photo, [Validators.required]],
        stock:[stock,[Validators.required]],
        unit:[unit,[Validators.required]],
        tags:[tags,[Validators.required]]
      });
    }
    close(){
      this.dialogRef.close();
    }
    save(){
      if(true){
        const productObj = {
          idStore: this.authService.getCurrentBusiness(),
          name:this.productForm.value.name,
          description:this.productForm.value.description,
          price:Number(this.productForm.value.price),
          stock:Number(this.productForm.value.stock),
          unit:this.productForm.value.unit,
          state:"1",
          score:0.0,
          location: {
            type:"Point",
            coordinates: [-99.1589182,19.4073757]
          },
          tags:["alitas","pollo"]
        }
        console.log(productObj)
        this.productService.addProduct(productObj).subscribe((response)=>{
          console.log(response)
        },error=>{
          console.log(error.error.notifications[0].descripcion)
        });
      }
    }
  }