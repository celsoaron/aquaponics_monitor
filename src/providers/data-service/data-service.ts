import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/do'

/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataServiceProvider {

  // private URL: string = "https://api.thingspeak.com/channels/488600/feeds.json?api_key=P6HKGL4J2BOR2JS9&results=10"
  // private URL: string = "https://api.thingspeak.com/channels/488600/fields/2/last.json?api_key=P6HKGL4J2BOR2JS9&status=true"
  private URL: string = "https://api.thingspeak.com/channels/488600/feeds/last.json?api_key=P6HKGL4J2BOR2JS9&status=true"

  constructor(public http: HttpClient) {
  }

  getData() {
    return this.http.get(this.URL)
    // .do(res => console.log(res));
  }

  sendData(temperature: number, humidity: number, ph: number) {
    const URL: string = 'https://api.thingspeak.com/update?api_key=BWOUM1ZIP9D3IIKS&field1=' +temperature+ '&field2=' + humidity+ '&field3=' + ph;
    return this.http.get(URL);
    // console.log(URL);
  }

}
