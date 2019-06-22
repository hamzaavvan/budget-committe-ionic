import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  committee: any = [];
  days: number = 0;

  constructor(public db: AngularFirestore, public route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    const c = this.db.collection<any>("committee").doc(id).get();
    
    console.log(id);

    c.toPromise().then(snapshot => {
      this.committee = snapshot.data();
      let diff = this.committee.last_at.toDate()-this.committee.start.toDate();

      this.days = diff/(24*3600*1000);
      // console.log(this.committee);
      // console.log(this.days);
    })
  }

}
