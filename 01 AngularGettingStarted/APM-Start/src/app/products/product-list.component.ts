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
    ascSort: boolean = true;
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

    // old specificSorting just for ProductName collumn
    
    // sortProduct():void{
    //     if(this.ascSort){
    //         //this sorting also works but and is the basic idea by handing over -1, 0 and 1 to the sort method 
    //         this.filteredProducts = this.filteredProducts.sort((a,b)=>{
    //             let first = a.productName.toLocaleLowerCase();
    //             let second = b.productName.toLocaleLowerCase();
    //             return (first<second) ? -1 : (first>second) ? 1 : 0;
    //         });
    //     } else {
    //         this.filteredProducts = this.filteredProducts.sort((a,b)=>{
    //             //this sorting seems easier as well as supporting unicode
    //             return b.productName.toLocaleLowerCase().localeCompare(a.productName.toLocaleLowerCase());
    //         });
    //     }
    //     this.ascSort = !this.ascSort; //toggle
    // }

    sortByProp(prop: string | number) {
        this.filteredProducts = this.sortObjectsByProp(this.filteredProducts, prop, this.ascSort)
        this.ascSort = !this.ascSort;
    }

    // seems to work fine except for star rating :( 
    // it might be better to create 2 distinct sort funtions, one for numbers and one for strings
    sortObjectsByProp(objectsArr: IProduct[], prop: string | number, ascending = true) {
        let objectsHaveProp = objectsArr.every(object => object.hasOwnProperty(prop));
        if (objectsHaveProp) {
            let newObjectsArr = objectsArr.slice();
            newObjectsArr.sort((a, b) => {
                if (isNaN(Number(a[prop as keyof IProduct]))) {
                    let textA = a[prop as keyof IProduct].toLocaleString().toLocaleLowerCase(),
                        textB = b[prop as keyof IProduct].toLocaleString().toLocaleLowerCase();
                    if (ascending) {
                        return textA < textB ? -1 : textA > textB ? 1 : 0;
                    } else {
                        return textB < textA ? -1 : textB > textA ? 1 : 0;
                    }
                } else {
                    let numberA: number = Number(a[prop as keyof IProduct]);
                    let numberB: number = Number(b[prop as keyof IProduct]);

                    return ascending ? numberA - numberB : numberB - numberA;
                }
            });
            return newObjectsArr;
        }
        return objectsArr;
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