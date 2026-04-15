import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  userProfile: any = null;
  isAuthenticated = false;

  menuItems = [
    { label: 'Accueil', route: '/', auth: false },
    { label: 'Se connecter', route: '/connexion', auth: false },
    { label: "S'inscrire", route: '/register', auth: false },
    { label: 'Demandes d\'inscription', route: '/register', roles: ['admin'] },
    { label: 'Vérifier un numéro', route: '/verifier', auth: true, roles: ['admin', 'checker'] },
    //{ label: 'Historique', route: '/historique', auth: true , roles: ['checker', 'admin']},
    { label: 'Utilisateurs', route: '/admin/utilisateurs', auth: true, roles: ['admin'] },
    { label: 'Profiles', route: '/admin/profiles', auth: true, roles: ['admin'] },
    { label: 'Roles', route: '/admin/roles', auth: true, roles: ['admin'] },
    { label: 'Localites', route: '/param/localites', auth: true, roles: ['admin'] },
    { label: 'Compagnies', route: '/param/compagnies', auth: true, roles: ['admin'] },
    { label: 'Trajets', route: '/trajets', auth: true, roles: ['admin'] },
    { label: 'Axes', route: 'checker/axes', auth: true, roles: ['checker'] },
    { label: 'Trajets', route: 'checker/trajets', auth: true, roles: ['checker'] },
    { label: 'Trajets', route: 'compagnie/trajets', auth: true, roles: ['compagnie'] },
    { label: 'Vehicules', route: 'compagnie/vehicules', auth: true, roles: ['admin', 'compagnie'] },
    { label: 'Type de vehicules', route: '/param/types-vehicules', auth: true, roles: ['admin'] },
    { label: 'Aide', route: '/aide', auth: false },
    { label: 'Axes', route: '/axes', auth: true, roles: ['admin', 'compagnie'] },
    { label: 'Passagers', route: '/passagers', auth: true, roles: ['compagnie'] },
    { label: 'Postes', route: '/postes', auth: true, roles: ['admin'] },
    { label: 'Se déconnecter', route: '/logout', auth: true },
  ];

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.userProfile$.subscribe(profile => {
      console.log('User profile updated in NavbarComponent', profile);
      this.userProfile = profile;
    });

    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }

  get filteredMenu() {
    return this.menuItems.filter(item => {

      if (item.auth === false && this.isAuthenticated) return false;
      if (item.auth === true && !this.isAuthenticated) return false;

      if (item.roles && !item.roles.includes(this.userProfile)) return false;

      return true;
    });
  }

  logout() {
    this.authService.logout();
  }
}
