import {Component} from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  generalContacts = [
    {name: 'Sebastian Köhler', affiliation: 'Monarch Initiative & Information Architect at Ada Health',
    email: 'dr.sebastian.koehler@gmail.com', src: 'assets/contact-images/sebastian-kohler.jpg'},
    {name: 'Peter Robinson', affiliation: 'The Jackson Laboratory for Genomic Medicine',
      email: 'peter.robinson@jax.org', src: 'assets/contact-images/peter-robinson.jpg'},
    {name: 'Melissa Haendel', affiliation: 'University of Colorado Center for Health AI',
    email: 'melissa@tislab.org', src: 'assets/contact-images/melissa-haendel.jpg'}
  ];

  technicalContacts = [
    {name: 'Michael Gargano', affiliation: 'The Jackson Laboratory for Genomic Medicine',
      email: 'michael.gargano@jax.org', src: 'assets/contact-images/michael-gargano.jpg'}
  ];
  constructor() {}
}
