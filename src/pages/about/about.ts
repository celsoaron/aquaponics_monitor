import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl } from '@angular/forms';
import { Chart } from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  @ViewChild('temperature') temperature;
  @ViewChild('humidity')    humidity;
  @ViewChild('phLevel')     phLevel;

    private temp       : Object;
    private tempChart  : any;

    private hum        : Object;
    private humChart   : any;

    private ph         : Object;
    private phChart    : any;

  protected formGroup  : FormGroup;
  protected sensor$    : Observable<Object>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private data: DataServiceProvider) {

    this.formGroup = new FormGroup({
      temperature: new FormControl(),
      humidity   : new FormControl(),
      ph         : new FormControl()
    });

  }

  ionViewDidLoad() {
    this.sensor$ = this.data.getData();
    this.sensor$.subscribe(feed => {
      this.temp = feed["field1"];
      this.hum  = feed["field2"];
      this.ph   = feed["field3"];
    });

    this.tempChart = new Chart(this.temperature.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [10, 90],
          backgroundColor: [
            'rgba(219, 32, 15, 0.9)',
            'rgba(219, 32, 15, 0.3)'
          ],
          hoverBackgroundColor: [
            'rgba(219, 32, 15, 0.9)',
            'rgba(219, 32, 15, 0.3)'
          ]
        }]
      },
      options: {
        rotation: -1 * Math.PI,
        circumference: Math.PI,
        animation: {
          animateRotate: false,
          animateScale: true
        },
        title : {
          display: true,
          text: 'Temperature'
        },
      },
      plugins: [{
        beforeDraw: function(chart) {
          var width = chart.chart.width,
              height = chart.chart.height,
              ctx = chart.chart.ctx;
      
          ctx.restore();
          var fontSize = (height / 114).toFixed(2);
          ctx.font = fontSize + "em sans-serif";
          ctx.textBaseline = "middle";
      
          var text = this.temp + ' C',
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 1.2;
      
          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      }]
    });

    this.humChart = new Chart(this.humidity.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [10, 90],
          backgroundColor: [
            'rgba(64, 20, 89, 0.9)',
            'rgba(64, 20, 89, 0.3)'
          ],
          hoverBackgroundColor: [
            'rgba(64, 20, 89, 0.9)',
            'rgba(64, 20, 89, 0.3)'
          ]
        }]
      },
      options: {
        rotation: -1 * Math.PI,
        circumference: Math.PI,
        animation: {
          animateRotate: false,
          animateScale: true
        },
        title : {
          display: true,
          text: 'Humidity'
        }
      }
    });

    this.phChart = new Chart(this.phLevel.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [10, 90],
          backgroundColor: [
            'rgba(2, 114, 15, 0.9)',
            'rgba(2, 114, 15, 0.3)'
          ],
          hoverBackgroundColor: [
            'rgba(2, 114, 15, 0.9)',
            'rgba(2, 114, 15, 0.3)'
          ]
        }]
      },
      options: {
        rotation: -1 * Math.PI,
        circumference: Math.PI,
        animation: {
          animateRotate: false,
          animateScale: true
        },
        title : {
          display: true,
          text: 'pH Level'
        }
      }
    });

    setInterval(() => {
      this.data.getData().subscribe(feed => {
        this.temp = feed["field1"];
        this.hum  = feed["field2"];
        this.ph   = feed["field3"];

      this.tempChart.data.datasets[0].data[0] =       feed["field1"];
      this.tempChart.data.datasets[0].data[1] = 100 - feed["field1"];

      this.humChart.data.datasets[0].data[0] =        feed["field2"];
      this.humChart.data.datasets[0].data[1] =  100 - feed["field2"];

      this.phChart.data.datasets[0].data[0] =        feed["field3"];
      this.phChart.data.datasets[0].data[1] =  100 - feed["field3"];

      // this.tempChart.plugins[0].beforeDraw;
      console.log()
      })
      this.tempChart.update();
      this.humChart.update();
      this.phChart.update();
    }, 5000);
  }

  sendData(value: { temperature: number, humidity: number, ph: number }) {
    this.data.sendData(value.temperature, value.humidity, value.ph)
    .subscribe(data => {
      this.tempChart.update();
      // this.navCtrl.push(AboutPage);
    });
  }

}
