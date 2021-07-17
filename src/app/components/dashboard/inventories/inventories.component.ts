import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from 'src/app/services/product.service';
import { Producto } from 'src/app/models/producto';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {ProductsDialogComponent} from './products/products.component';
@Component({
  selector: 'app-inventories',
  templateUrl: './inventories.component.html',
  styleUrls: ['./inventories.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class InventoriesComponent implements OnInit,AfterViewInit {
  dataSource: MatTableDataSource<Producto> = new MatTableDataSource();
  columnsToDisplay = [['name','Nombre'],['price','Precio'],['stock','Stock'],['unit','Unidades'],['score','Puntuación'],['state','Estado']];
  columnsToDisplay2 = ['name','price','stock','unit','score','state','buttons'];
  expandedElement!: Producto | null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isLoadingResults = true;
  isRateLimitReached = false;
  stateCtrl = new FormControl();
  businessId:string | null="";
  constructor(
    private authService:AuthService,
    private productService:ProductService,
    public dialog: MatDialog
    ) { }
  ngOnInit(): void {
    this.stateCtrl.disable();
    this.businessId = this.authService.getCurrentBusiness();
    this.productService.getProducts(this.businessId).subscribe((response:any)=>{
      setTimeout(() => {
        if(!response[0]){
          this.isRateLimitReached = true;
        }
        console.log(response)
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoadingResults = false;
        this.stateCtrl.enable()
      }, 1000);
    },error=>{
      this.isLoadingResults = false;
      this.isRateLimitReached = true;
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openDialog() {
    this.dialog.open(ProductsDialogComponent,{ disableClose: true,width: '400px', });
  }
}