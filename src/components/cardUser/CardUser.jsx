import React from 'react';
import {Button, Card, CardHeader, CardContent, Avatar, Box, Typography} from '@mui/material';
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import profilepicture from '../../assets/profilepicture.png'
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

const CardWorker = ( {type} ) => {
  console.log("prueba")

  const [info,setInfo] = useState([])
  const [average,setAverage] = useState(0.0)
  const [nombre,setNombre] = useState("")
  const [imagenes,setImagenes] = useState([])
  const [img,setImg] = useState("")

  const headerToken = {
    headers: { 
      "Content-type": "application/json" ,
      Authorization: window.localStorage.loginUser
    },
  };

  const obtenerDatos = async () => {
    const config = {
      method: "GET",
      headers: headerToken.headers,
    };
    const link="http://127.0.0.1:8000/mande/user/view"
    const response= await fetch(link,config)
    const data = await response.json()
    console.log("data user:", data)
    setInfo(
      { f_name:data.user.f_name,
        l_name:data.user.l_name,
        uid:data.user.uid,
      })
    setNombre(info.f_name + " " + info.l_name)
  }

  const obtenerFoto = async() => {
    let config = {
      method: "GET",
      headers: headerToken.headers,
    }
    // console.log("config photo:",config)
    const link="http://127.0.0.1:8000/mande/worker/image/view"
    const response = await fetch(link,config)
    const data = await response.json()
    console.log("photo:",data)
    let fullURL = `http://127.0.0.1:8000${data[0].prof_img_data}`
    setImg(fullURL)
    return img;
  }

  const onImageChange = async (input) => {
    // let msg = document.getElementById("msg-screen");
    // msg.style.display = 'none';
    let imagesData = []
    let images = input.target.files;
    console.log("images:",images);
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        imagesData.push(images[i])
        console.log("image loaded!");
      }
      setImagenes(imagesData)
    }
  } 
  
  const handleClick = async () => {
    console.log("imagenes:", imagenes)
    for (let i = 0; i < imagenes.length; i++){
      const body = new FormData();
      body.append("prof_img_data", imagenes[i], imagenes[i].name); 
      body.append("uid", info.uid);
      let config = {
        method: "PUT",
        headers: headerToken.headers,
        body: body,
      }
      delete config.headers["Content-type"];
      const link="http://127.0.0.1:8000/mande/images/upload"
      const response = await fetch(link,config)
      const data = await response.json()
      setImg(data.prof_img_data)
      console.log("res upload img:", data)
    }
  }

  useEffect(() => {
    obtenerDatos();
    obtenerFoto();
  },[type]);

  return (
    <Box textAlign='center' sx={{m: '0 20px'}}>
      <Card sx={{maxWidth: '1000px'}}>
        <Avatar sx={{width: 200, height: 200, margin: '20px auto', border: '5px solid rgb(3,9,94)'}} src={img}/>
        {/* <Typography align='center' sx={{margin: '10px auto'}}>
          {console.log("nombre:",nombre)}
          {nombre}
        </Typography> */}
        <Button 
          variant='contained'
          component="label"
          endIcon={<PhotoCamera />}
        >
          {'Cambiar Foto'}
          <input type="file" hidden onChange={onImageChange}/>
        </Button>

        <Button onClick={handleClick} color="secondary" variant="contained">
          {'Actualizar Foto'}
         </Button>
      </Card>
    </Box>
  )
}

export default CardWorker;