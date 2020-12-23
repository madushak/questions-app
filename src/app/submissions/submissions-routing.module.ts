import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubmissionDetailsPage } from './submission-details.page';
import { SubmissionsPage as SubmissionsPage } from './submissions.page';

const routes: Routes = [
  {
    path: '',
    component: SubmissionsPage,
  },
  {
    path: ':submission_id',
    component: SubmissionDetailsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmissionsPageRoutingModule {}
