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

    private temp       : number;
    private tempChart  : any;

    private hum        : number;
    private humChart   : any;

    private ph         : number;
    private phChart    : any;

    private plugin     : Object;

  protected formGroup  : FormGroup;
  protected sensor$    : Observable<Object>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private data: DataServiceProvider) {

    this.formGroup = new FormGroup({
      temperature: new FormControl(),
      humidity   : new FormControl(),
      ph         : new FormControl()
    });

    this.plugin = {
      beforeDraw: function(chart) {
        var width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;
    
        ctx.restore();
        var fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";
    
        var text = chart.options.centerText,
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 1.2;


        var text_label_l  = chart.options.leftText,
            text_label_lX = Math.round(width/3.4),
            text_label_lY = height / 1.03;

        var text_label_t  = chart.options.topText,
            text_label_tX = Math.round(width/2.04),
            text_label_tY = height / 1.65;

        var text_label_r  = chart.options.rightText,
            text_label_rX = Math.round(width/1.47),
            text_label_rY = height / 1.03;
        
        ctx.font = 'bold 120% Georgia';
        ctx.fillStyle = chart.options.value_colorText;
        ctx.fillText(text, textX, textY);
        ctx.font = 'italic 100% arial';
        ctx.fillStyle = chart.options.label_colorText;
        ctx.fillText(text_label_t, text_label_tX, text_label_tY);
        ctx.fillText(text_label_l, text_label_lX, text_label_lY);
        ctx.fillText(text_label_r, text_label_rX, text_label_rY);
        ctx.save();
      }
    }

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
            'rgba(219, 32, 15, 0.7)',
            'rgba(219, 32, 15, 0.3)'
          ],
          hoverBackgroundColor: [
            'rgba(219, 32, 15, 0.7)',
            'rgba(219, 32, 15, 0.3)'
          ]
        }]
      },
      options: {
        centerText: 10,
        leftText: 0,
        topText: 50,
        rightText: 100,
        value_colorText: 'rgba(219, 32, 15, 1)',
        label_colorText: '#ccc',
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
      plugins: [this.plugin]
    });

    this.humChart = new Chart(this.humidity.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [10, 90],
          backgroundColor: [
            'rgba(15, 66, 150, 0.7)',
            'rgba(15, 66, 150, 0.3)'
          ],
          hoverBackgroundColor: [
            'rgba(15, 66, 150, 0.7)',
            'rgba(15, 66, 150, 0.3)'
          ]
        }]
      },
      options: {
        centerText: 10,
        leftText: 0,
        topText: 50,
        rightText: 100,
        value_colorText: 'rgba(15, 66, 150, 0.7)',
        label_colorText: '#ccc',
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
      },
      plugins: [this.plugin]
    });

    this.phChart = new Chart(this.phLevel.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [10, 90],
          backgroundColor: [
            'rgba(2, 114, 15, 0.7)',
            'rgba(2, 114, 15, 0.3)'
          ],
          hoverBackgroundColor: [
            'rgba(2, 114, 15, 0.7)',
            'rgba(2, 114, 15, 0.3)'
          ]
        }]
      },
      options: {
        centerText: 10,
        leftText: 0,
        topText: ' 7',
        rightText: ' 14',
        value_colorText: 'rgba(2, 114, 15, 1)',
        label_colorText: '#ccc',
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
      },
      plugins: [this.plugin]
    });

    setInterval(() => {
      this.data.getData().subscribe(feed => {
        this.temp = feed["field1"];
        this.hum  = feed["field2"];
        this.ph   = feed["field3"];

      this.tempChart.data.datasets[0].data[0] =       this.temp;
      this.tempChart.data.datasets[0].data[1] = 100 - this.temp;

      this.humChart.data.datasets[0].data[0]  =       this.hum;
      this.humChart.data.datasets[0].data[1]  = 100 - this.hum;

      this.phChart.data.datasets[0].data[0]   =        this.ph  * 100 / 14;
      this.phChart.data.datasets[0].data[1]   = 100 - (this.ph * 100 / 14);

      this.tempChart.options.centerText = feed["field1"] + '°C';
      this.humChart.options.centerText  = feed["field2"] + '%';
      this.phChart.options.centerText   = feed["field3"];
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
