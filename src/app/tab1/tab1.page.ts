import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  names: string[];
  till: Date;
  start: Date;
  amount: number;

  constructor(private fs: AngularFirestore, private alertC: AlertController) {}

  createBC(names: string, till: Date) {
    if (!names || !names.length) {
      console.warn("No names");
      return false;
    }
    
    this.names = names.split(',').map(n => encodeURI(n));
    let users = [];
    this.names.forEach(a => {
      users.push({name: a, fills: []})
    })

    this.fs.collection<any>('committee').add({
      users: users,
      start: new Date(this.start),
      amount: this.amount,
      last_at: new Date(this.till)
    }).then(async res => {
      const alert = await this.alertC.create({
        header: "Great!",
        message: "Committee information has been saved",
        buttons: ["ok"]
      });

      await alert.present();
      // this.myForm.reset();
    });
  }
}
