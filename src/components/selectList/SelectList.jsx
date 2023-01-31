import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';

const currencies = [
  {
    value: 'Campo1',
    label: 'Valor1',
  },
  {
    value: 'Campo2',
    label: 'Valor2',
  },
  {
    value: 'Campo3',
    label: 'Valor3',
  },
  {
    value: 'Campo4',
    label: 'Valor4',
  },
];

export default function SelectTextFields() {
  const [t, i18n] = useTranslation("registration");

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      
        <TextField
          id="outlined-select-currency"
          select
          label={t("registration2.no.title-input")}
          defaultValue="Campo1"
          // helperText="Please select your currency"
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      
    </Box>
  );
}