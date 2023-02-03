import Grid from "@mui/material/Grid";
import "./cardUser.scss"
import React from 'react';
import {Button, Card, CardHeader, CardContent, Avatar, Box, Typography} from '@mui/material';
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import profilepicture from '../../assets/profilepicture.png'

const CardWorker = () => {
  return (
    <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
      <div className="cardUser">
        <div className="container">
          <div className="encabezado"></div>
          <div className="final">
            <h1>Nombre Apellido</h1>
            <h3>Roll</h3>
          </div>
          <img src="" alt="img" />
        </div>
      </div>
    </Grid>
  );
};

export default CardUser;
