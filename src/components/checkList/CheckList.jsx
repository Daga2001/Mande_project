import { useEffect, useState, useContext } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import { useTranslation } from "react-i18next";
import { tokens } from "../../style/theme";
import { borderRight } from "@mui/system";
import { useTheme } from "@mui/material";
import { Context } from "../../context/Context";

export default function CheckboxList() {
  const [checked, setChecked] = useState([0]);
  const [t, i18n] = useTranslation("registration");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [mostrarLista, setMostrarLista] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [services, setServices] = useState([]);
  const [price, setPrice] = useState(0);
  const [actInput, setActInout] = useState(false);
  const context = useContext(Context);
  const [elegido, setElegido] = useState("");

  function organizarDatos(datos) {
    let data = datos.map((item) => {
      return {
        occupation: item.occupation,
        j_description: item.j_description,
      };
    });
    setServices(data);
    // console.log("servicios", services);
    // console.log("servicios: ", services);
    setCargando(false);
  }

  useEffect(() => {
    fetch("http://127.0.0.1:8000/mande/jobs/view")
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        organizarDatos(res);
      });
  }, []);

  function enviar() {
    console.log("elegido2",elegido)
    console.log(price)
    let cuerpo = {
      occupation: elegido.occupation,
      price: price,
      uid: context.appState.registro.id,
    };
    console.log(cuerpo);
    let config = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: cuerpo,
    };
    fetch("http://127.0.0.1:8000/mande/worker/register/job", config)
      .then((res) => res.json())
      .then((res) => console.log(res));
  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value.occupation);
    const newChecked = [...checked];
    console.log(currentIndex);

    if (currentIndex === -1) {
      newChecked.push(value.occupation);
      setElegido(value)
    } else {
      newChecked.splice(currentIndex, 1);
      setCargando(!cargando);
      setActInout(true);
    }
    setChecked(newChecked);
  };

  return (
    <>
      {cargando === false && (
        <List sx={{ width: "100%", maxWidth: 360 }}>
          {/* {console.log("Servicios 22",services)} */}
          {services.map((value) => {
            const labelId = `checkbox-list-label-${value.occupation}`;

            return (
              <ListItem
                key={value.occupation}
                disablePadding
                color={colors.primary[500]}
              >
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(value)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(value.occupation) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={`${value.occupation}`} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      )}
      {actInput && (
        <div>
          <h4>Precio por hora</h4>
          <input
            type="number"
            onChange={(e) => {
              setPrice(e.target.value);
            }}
          />
          <button onClick={enviar}>OK</button>
        </div>
      )}
    </>
  );
}
