import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import { useTranslation } from 'react-i18next';
import { tokens } from "../../style/theme";
import { borderRight } from "@mui/system";
import { useTheme } from '@mui/material';

export default function CheckboxList() {
  const [checked, setChecked] = React.useState([0]);
  const [t, i18n] = useTranslation("registration");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  let services = [t("registration2.yes.occupations.plumber"), t("registration2.yes.occupations.pet-care"), t("registration2.yes.occupations.locksmith"), "Servicio1", "Servicio2", "Servicio3", "Servicio4", "Servicio5"]

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List sx={{ width: '100%', maxWidth: 360}}>
      {services.map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={value}
            disablePadding
            color={colors.primary[500]}
          >
            <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}