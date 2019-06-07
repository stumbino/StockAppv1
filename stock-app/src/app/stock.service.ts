import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(  private httpClient: HttpClient) { }

  getStockInformation(stockSymbol: string) {
    const url = `http://candidateservices.allegient.com/randomQuote/quote?symbols=${stockSymbol}`;
    return this.httpClient.get(url).toPromise();
  }
}
