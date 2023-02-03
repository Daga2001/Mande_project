import React from 'react';
import {Button, Card, CardHeader, CardContent, Avatar, Box, Typography} from '@mui/material';
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import profilepicture from '../../assets/profilepicture.png'

const CardWorker = () => {
  return (
    <Box textAlign='center' sx={{m: '0 20px'}}>
      <Card sx={{maxWidth: '1000px'}}>
        <Avatar sx={{width: 200, height: 200, margin: '20px auto', border: '5px solid rgb(3,9,94)'}} src={profilepicture}/>
        <Typography align='center' sx={{margin: '10px auto'}}>
          {'Marcelo Alberto Chaverra Perdomo'}
        </Typography>
        <Button 
          variant='contained'
          component="label"
          endIcon={<PhotoCamera />}
        >
          {'Cambiar Foto'}
          <input type="file" hidden />
        </Button>
        <CardContent>
          <Typography align='justify'>
            {'Más información acerca del Usuario. Nulla semper, mauris non sollicitudin efficitur, justo sapien accumsan leo, a faucibus augue nisi at odio. Ut eu sollicitudin nisi. Etiam auctor purus ac risus vestibulum semper. Vestibulum vulputate nisi in neque congue, ut imperdiet nibh luctus. Mauris.'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default CardWorker;