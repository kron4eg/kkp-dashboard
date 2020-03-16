import {Component, forwardRef, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';

import {NodeProvider} from '../../../shared/model/NodeProviderConstants';
import {WizardService} from '../../service/wizard';
import {StepBase} from '../base';

enum Controls {
  ProviderBasic = 'providerBasic',
  ProviderExtended = 'providerExtended',
  Preset = 'preset',
  SSHKeys = 'sshKeys',
}

@Component({
  selector: 'kubermatic-wizard-provider-settings-step',
  templateUrl: './template.html',
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ProviderSettingsStepComponent), multi: true},
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => ProviderSettingsStepComponent), multi: true}
  ]
})
export class ProviderSettingsStepComponent extends StepBase implements OnInit, OnDestroy {
  readonly Provider = NodeProvider;
  readonly Control = Controls;

  provider: NodeProvider;

  constructor(private readonly _builder: FormBuilder, wizard: WizardService) {
    super(wizard, 'Provider settings');
  }

  ngOnInit(): void {
    this.form = this._builder.group({
      [Controls.Preset]: this._builder.control(''),
      [Controls.ProviderBasic]: this._builder.control(''),
      [Controls.ProviderExtended]: this._builder.control(''),
      [Controls.SSHKeys]: this._builder.control(''),
    });

    this.provider = this._wizard.provider;
    this._wizard.providerChanges.pipe(takeUntil(this._unsubscribe)).subscribe(provider => this.provider = provider);
  }
}
