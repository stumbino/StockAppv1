import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {StockService} from '../stock.service';
@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})

export class StockComponent implements OnDestroy {
  stockSelection: FormGroup;
  stockSymbol: string;
  stockPrice: number;
  stockPriceDate: string;
  occurance: string;
  timer: any;
  timerDesc: string;
  stockQuotes = [];
  today = Date.now();
  public show = false;
  updateTitle = 'Start Automatic Updates';
  constructor(private fb: FormBuilder, public stockService: StockService) {
    this.stockSelection = fb.group({
      stockSymbol: [null, Validators.required],
      occurance: [null, Validators.required]
    });
    this.stockSelection.valueChanges.subscribe({
      next: value => {
        const occuranceOfUpdate = value.occurance;
        this.updateChart(occuranceOfUpdate, value.stockSymbol);
      }
    });
  }
  updateChart(occuranceOfUpdate: number, stockSymbol: string) {
    clearInterval(this.timer);
    if (occuranceOfUpdate * 1000 > 1001) {
    this.timer = setInterval(() => {
      this.getQuotes(stockSymbol);
    },  occuranceOfUpdate * 1000);
    }
  }
  ngOnDestroy() {
    this.stockQuotes = [];
    clearInterval(this.timer);
  }

  getQuotes(stockSymbol: string) {
    this.stockService.getStockInformation(stockSymbol).then( res => {
      const {generatedDate, quotes} = JSON.parse(JSON.stringify(res));
      const date = {'date': generatedDate};
      let arrData = '';
      quotes.map(data => {
        arrData = data;
        this.stockQuotes.unshift(Object.assign(arrData, date));
      });
      if (this.stockQuotes.length > 5) {
        this.stockQuotes.splice(5);
      }
    });
  }
  updateNow() {
    const { stockSymbol } = this.stockSelection.value;
    this.getQuotes(stockSymbol);
  }
  clearHistory() {
    this.stockQuotes = [];
    this.stockSelection.reset();
    this.updateChart(0, '');
    clearInterval(this.timer);

  }
  startAutomaticUpdates() {
    this.show = !this.show;
    if (this.show) {
      this.updateTitle = 'Start Automatic Updates';
      clearInterval(this.timer);
    } else {
      this.updateTitle = 'Stop Automatic Updates';
      const { stockSymbol } = this.stockSelection.value;
      this.updateChart(3, stockSymbol);
    }
  }
}
