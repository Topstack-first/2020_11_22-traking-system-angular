import { Component, OnInit, ViewChild,ViewChildren,ComponentFactoryResolver, QueryList,  } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { MenuService } from '../theme/components/menu/menu.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: [ MenuService ,HttpClient]
})

export class PagesComponent implements OnInit { 
  @ViewChild('sidenav') sidenav:any;
 
  //Members for controlling UI
  @ViewChildren(PerfectScrollbarDirective) pss: QueryList<PerfectScrollbarDirective>;
  public settings:Settings;
  public menus = ['vertical', 'horizontal'];
  public menuOption:string;
  public menuTypes = ['default', 'compact', 'mini'];
  public menuTypeOption:string;
  public lastScrollTop:number = 0;
  public showBackToTop:boolean = false;
  public toggleSearchBar:boolean = false;

  //member for factorying component dynamtically
  private resolver : ComponentFactoryResolver;

  //constructor
  constructor(private factoryResolver: ComponentFactoryResolver,
              public appSettings:AppSettings, 
              public router:Router, 
              private menuService: MenuService,
              private https: HttpClient)
  {        
    this.settings = this.appSettings.settings;
    this.resolver = factoryResolver;
  }

  //Init Functions
  ngOnInit() {
    if(window.innerWidth <= 768){
      this.settings.menu = 'vertical';
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
    }
    this.menuOption = this.settings.menu; 
    this.menuTypeOption = this.settings.menuType; 
   
    
  }
  
  ngAfterViewInit(){
    setTimeout(() => { this.settings.loadingSpinner = false }, 300);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) { 
        if(!this.settings.sidenavIsPinned){
          this.sidenav.close(); 
        }      
        if(window.innerWidth <= 768){
          this.sidenav.close(); 
        } 
      }                
    });
    if(this.settings.menu == "vertical")
      this.menuService.expandActiveSubMenu(this.menuService.getVerticalMenuItems());
  }
}
