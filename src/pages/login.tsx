import { Alert, Avatar, Box, Button, Link, Snackbar, TextField, Typography } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import { NextPage } from "next";
import React from "react";
import { fakerApi } from "../services/fakeApi";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const [credentials, setCredentials] = React.useState({ username: '', password: '' });
  const [error, setError] = React.useState(false);
  const router = useRouter();

  const handleSetCredentials = (credential: string, value: string) => {
    setCredentials({
      ...credentials,
      [credential]: value,
    })
  }
  return (
    <div
      style={{
        width: '100%',
        marginLeft: 'auto',
        boxSizing: 'border-box',
        marginRight: 'auto',
        display: 'block',
        maxWidth: '450px'
      }}>
      <Box
        component="form"
        sx={{
          display: 'flex',
          marginTop: '70px',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '30vw',
          '& *': { marginBottom: '10px' }

        }}
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          fakerApi.get("/login", credentials).then(() => router.push("/dashboard")).catch(()=>setError(true));
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main', marginBottom: '0px' }}>
          <LoginIcon sx={{ marginBottom: '0px' }} />
        </Avatar>
        <Typography component="h1" variant="h5"
          sx={{
            marginTop: '10px',
            marginBottom: '10px',
            fontWeight: '600',
            fontSize: '1.5rem',

          }}>
          Login
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          <TextField onChange={(event) => handleSetCredentials('username', event.target.value)} required id="filled-basic" label="Login" variant="filled" />
          <TextField onChange={(event) => handleSetCredentials('password', event.target.value)} required fullWidth id="filled-password-input" label="Senha" type="password" autoComplete="current-password" variant="filled"
          />
          <Button type='submit' variant="contained">Login</Button>
        </Box>
        <Link href="/" variant="body2"
          sx={{
            marginLeft: 'auto',
          }}>
          Não possui uma conta? Cadastre-se
        </Link>
        <Snackbar open={error} onClose={() => setError(false)} autoHideDuration={3000}>
          <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>Credenciais invalidas</Alert>
        </Snackbar>
      </Box >
    </div >
  )
}

export default Login