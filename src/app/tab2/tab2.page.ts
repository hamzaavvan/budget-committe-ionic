import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Storage } from '@ionic/storage';

import { Router } from '@angular/router';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  public committees = [];
  public offline: boolean = false;

  constructor(private storage: Storage, private fs: AngularFirestore, public router: Router) {
  }
  
  ionViewDidLoad() {
    window.addEventListener('offline', () => {
      this.offline = true;
      console.log("offline");
    });
  }

  async ionViewWillEnter() {
    let committees = await this.storage.get('committees');
    this.committees = committees;

    // Stop if app is offline
    if (!navigator.onLine || this.offline)
      return false;

    this.fetch();
  }
  
  fetch(event:any = Object) {
    var a = this.fs.collection("committee").get();

    a.toPromise().then(snapshot => {
      const _docs = snapshot.docs;
      
      this.committees = [];
      
      let c = _docs.length;
      for (var i in _docs) {
        let a =_docs[i].data();
        a.uid = _docs[i].id;
        a.start = a.start.toDate();
        a.last_at = a.last_at.toDate();
        a.id = c--;
        this.committees.push(a);
      }

      if (typeof event == "object")
        event.target.complete();

      this.storage.set('committees', this.committees); // for storing locally to load offline
    }).finally(async() => {
      console.warn("Couldn't fetch new results");

      // Show cached/stored committees
      let committees = await this.storage.get('committees');
      this.committees = committees;
    })
  }

  get(id) {
    this.router.navigate([`/details/${id}`]);
  }
}