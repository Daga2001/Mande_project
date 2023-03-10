import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';

const currencies = [
  {
    value: 'Credito',
    label: 'Tarjeta de crédito',
  },
  {
    value: 'Debito',
    label: 'Tarjeta débito',
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
          defaultValue="Credito"
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