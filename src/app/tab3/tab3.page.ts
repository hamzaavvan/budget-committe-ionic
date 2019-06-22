import { Component } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { AngularFirestore } from 'angularfire2/firestore';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public uuid:string = "1";
  public checked:boolean;
  public name:string;

  constructor(private device: Device,
             public db: AngularFirestore, 
             public alertC: AlertController,
             public storage: Storage) {
    this.uuid = this.device.uuid || "1";
    this.storage.set("userData", {notify: true, name: "Hamza"});
  }

  async ionViewWillEnter() {
    const c = await this.db.collection<any>("users").doc(this.uuid).get().toPromise();
    let d = c.data();

    if (!d) {
      d = await this.storage.get("userData");
    } else {
      this.storage.set("userData", d);
    }

    this.checked = d.notify;
    this.name = d.name || "";
  }

  updateUser() {
    let notify = this.checked;
    let name = this.name;

    this.db.collection<any>(`users`).doc(this.uuid).set({
      notify,
      name,
      updated_at: new Date()
    }).then(async res => {
      const alert = await this.alertC.create({
        header: "Great!",
        message: "Your notification reference updated",
        buttons: ["ok"]
      });

      await alert.present();
      // this.myForm.reset();
    });
  }
}
