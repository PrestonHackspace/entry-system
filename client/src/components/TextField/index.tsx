import * as React from 'react';
import { FormControl, InputLabel, Input, FormHelperText } from 'material-ui';

interface TextFieldProps {
  className?: string;
  label: string;
  value: string;
  type?: 'password';
  messages?: string[];

  onChange(value: string): void;
}

export function TextField({ className, label, value, type, messages, onChange }: TextFieldProps) {
  function interceptOnChange(newValue: string) {
    onChange(newValue);
  }

  return (
    <FormControl className={className} margin='dense' error={messages && messages.length !== 0}>
      <InputLabel>{label}</InputLabel>
      <Input placeholder={label} value={value} type={type} onChange={(e) => interceptOnChange(e.currentTarget.value)} />
      {
        messages && messages.length > 0 &&
        <FormHelperText>{messages.join('; ')}</FormHelperText>
      }
    </FormControl>
  );
}
