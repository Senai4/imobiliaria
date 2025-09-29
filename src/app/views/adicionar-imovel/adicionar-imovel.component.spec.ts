import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarImovelComponent } from './adicionar-imovel.component';

describe('AdicionarImovelComponent', () => {
  let component: AdicionarImovelComponent;
  let fixture: ComponentFixture<AdicionarImovelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdicionarImovelComponent]
    });
    fixture = TestBed.createComponent(AdicionarImovelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
