import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IProduct } from "./product";
import { ProductService } from "./product.service";

@Component({
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
    pageTitle: string = 'Product List';
    imageWidth: number = 50;
    imageMargin: number = 2;
    showImage: boolean = false;
    ascSort:boolean = true;
    errorMessage: string = "";
    sub!: Subscription;

    private _listFilter: string = "";
    get listFilter(): string {
        return this._listFilter;
    }
    set listFilter(value: string) {
        this._listFilter = value;
        console.log("In setter: ", value);
        this.filteredProducts = this.performFilter(value);
    }

    filteredProducts: IProduct[] = [];
    products: IProduct[] = [];

    constructor(private productService: ProductService) { };

    performFilter(filterBy: string): IProduct[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.products.filter((products: IProduct) =>
            products.productName.toLocaleLowerCase().includes(filterBy));
    }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }
    sortProduct():void{
        if(this.ascSort){
            //this sorting also works but and is the basic idea by handing over -1, 0 and 1 to the sort method 
            this.filteredProducts = this.filteredProducts.sort((a,b)=>{
                let first = a.productName.toLocaleLowerCase();
                let second = b.productName.toLocaleLowerCase();
                return (first<second) ? -1 : (first>second) ? 1 : 0;
            });
        } else {
            this.filteredProducts = this.filteredProducts.sort((a,b)=>{
                //this sorting seems easier as well as supporting unicode
                return b.productName.toLocaleLowerCase().localeCompare(a.productName.toLocaleLowerCase());
            });
        }
        this.ascSort = !this.ascSort; //toggle
    }

    ngOnInit(): void {
        this.sub = this.productService.getProducts().subscribe({
            next: products => {
                this.products = products;
                this.filteredProducts = this.products;
            },
            error: err => this.errorMessage = err
        });

    }
    
    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    onRatingClicked(message: string): void {
        this.pageTitle = "Product List: " + message;
    }
}