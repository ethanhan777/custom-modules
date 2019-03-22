
import {
  Component,
  OnInit
} from '@angular/core';
import { getCurrentContentInfo } from '../../services/enhanced_api.service';
import { PrhcApiService } from '../../services/prhc_api.service';
import { Subscriber } from 'rxjs/Subscriber';

export const adminNavSelector = 'admin-nav';

@Component({
  selector: adminNavSelector,
  templateUrl: './admin-nav.component.html',
})
export class AdminNavComponent implements OnInit {
  drupalContent = false;
  editLink: string;
  nodeId;
  private currentContentInfo = getCurrentContentInfo();
  private subscriptions = new Subscriber();
  constructor ( private prhcApi: PrhcApiService) {}

  ngOnInit() {
     if (!this.currentContentInfo.type) {
      // get id for homepage
      this.subscriptions.add(
        this.prhcApi.getHomepage()
        .subscribe(response => {
          this.nodeId = response['data'][0].attributes.nid;
          this.drupalContent = true;
          this.editLink = `/node/${this.nodeId}/edit`;
        })
      );
    } else if (this.currentContentInfo.type === 'imprints') {
      // get id for imprints
      this.subscriptions.add(
        this.prhcApi.getImprint(this.currentContentInfo.id)
        .subscribe(response => {
          this.nodeId = response['data'][0].attributes.nid;
          this.drupalContent = true;
          this.editLink = `/node/${this.nodeId}/edit`;
        })
      );
    } else if (this.currentContentInfo.type === 'node') {
      // get id for homepage node when previewing
      this.subscriptions.add(
        this.prhcApi.getNodeForPreview(window.location.pathname.split('/')[3])
        .subscribe(response => {
          if (response && response.article['data']) {
            this.nodeId = response.article['data'][0].attributes.nid;
            this.drupalContent = true;
            this.editLink = `/node/${this.nodeId}/edit`;
          }
        })
      );
    } else {
      this.subscriptions.add(
        this.prhcApi.getEntityId()
        .subscribe(response => {
          // check if an entity exists
          // exclude taxonomy terms
          if (response['data'] &&
              response['data'].id &&
              !response['data'].vid) {
            this.nodeId = response['data'].id;
            this.drupalContent = true;
            this.editLink = `/node/${this.nodeId}/edit`;
          }
        })
      );
    }
  }

}

