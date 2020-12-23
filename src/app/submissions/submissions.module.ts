import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubmissionsPage as SubmissionsPage } from './submissions.page';

import { SubmissionsPageRoutingModule } from './submissions-routing.module';
import { SubmissionDetailsPage } from './submission-details.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SubmissionsPageRoutingModule
  ],
  declarations: [SubmissionsPage, SubmissionDetailsPage]
})
export class SubmissionsPageModule {}
