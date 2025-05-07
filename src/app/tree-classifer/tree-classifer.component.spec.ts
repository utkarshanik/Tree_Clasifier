import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeClassiferComponent } from './tree-classifer.component';

describe('TreeClassiferComponent', () => {
  let component: TreeClassiferComponent;
  let fixture: ComponentFixture<TreeClassiferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeClassiferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeClassiferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
