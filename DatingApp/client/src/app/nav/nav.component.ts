import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {}
  

  constructor(public accountService: AccountService) { }

  ngOnInit(): void {    
    
    this.accountService.currentUser$.subscribe( response => {
      this.model = response;
    }) ;
    /*var userLoggedIn = JSON.parse(localStorage.getItem("user"));
    if (userLoggedIn) {
      this.model.username = userLoggedIn.username;
    }*/
  }

  login(){        
    this.accountService.login(this.model).subscribe({      
      next: (response) => {         
      console.log(response) 
      console.table(this.model)
    },
      error: error => console.log(error)           
    })
  }

  logout() { 
    this.accountService.logout();
  }

}
