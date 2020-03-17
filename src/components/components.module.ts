import { NgModule } from '@angular/core';
import { ComponentsTimerComponent } from './components-timer/components-timer';
import { SpinnerComponent } from './spinner/spinner';
@NgModule({
	declarations: [ComponentsTimerComponent,
    SpinnerComponent],
	imports: [],
	exports: [ComponentsTimerComponent,
    SpinnerComponent]
})
export class ComponentsModule {}
