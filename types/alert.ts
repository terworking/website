type AlertType = 'success' | 'error';

interface Button {
  primary: string;
  secondary?: string;
}

interface Options {
  closeOnClickOutside?: boolean;
}

export interface AlertProperties {
  button: Button;
  description?: string;
  title?: string;
  type: AlertType;
  options?: Options;
}
