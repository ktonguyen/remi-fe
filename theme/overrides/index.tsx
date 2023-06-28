import Card from './Card';
import Input from './Input';
import Button from './Button';
import Typography from './Typography';

export default function ComponentsOverrides(theme) {
  return Object.assign(
    Card(theme),
    Input(theme),
    Button(theme),
    Typography(theme)
  );
}