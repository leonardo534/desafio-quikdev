import type { NextPage } from 'next'
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Button, Link, Typography, Snackbar, Alert } from '@mui/material';
import * as yup from 'yup';
import { fakerApi } from '../services/fakeApi';

const Home: NextPage = () => {
  const [fields, setFields] = React.useState({ name: '', username: '', password: ''});
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState(false);

  const handleChangeFields = (field: string, value: string) => {
    setFields({
      ...fields,
      [field]: value,
    })
  };

  const schemaFields = yup.object().shape({
    name: yup.string().required(),
    username: yup.string().required(),
    password: yup.string().required(),
  })
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
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          try {
            fakerApi.post("/register", fields)
            setMessage('Cadastrado com sucesso');
            setError(false)
          } catch (e: any) {
            setMessage(e.message)
            setError(true)
          }
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main', marginBottom: '0px' }}>
          <LockOutlinedIcon sx={{ marginBottom: '0px' }} />
        </Avatar>
        <Typography component="h1" variant="h5"
          sx={{
            marginTop: '10px',
            marginBottom: '10px',
            fontWeight: '600',
            fontSize: '1.5rem',

          }}>
          Cadastro
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          <TextField onChange={(e) => handleChangeFields('name', e.target.value)} value={fields.name} required id="filled-basic" label="Nome completo" variant="filled" />
          <TextField onChange={(e) => handleChangeFields('username', e.target.value)} value={fields.username} required id="filled-basic" label="Login" variant="filled" />
          <TextField onChange={(e) => handleChangeFields('password', e.target.value)} value={fields.password} required fullWidth id="filled-password-input" label="Senha" type="password" autoComplete="current-password" variant="filled"
          />
          <Button type='submit' variant="contained">Cadastro</Button>
          <Snackbar open={Boolean(message)} autoHideDuration={3000} onClose={() => setMessage('')}>
            <Alert onClose={() => setMessage('')} severity={error ? "error" : "success"} sx={{ width: '100%' }}>{message}</Alert>
          </Snackbar>
        </Box>
        <Link href="/login" variant="body2"
          sx={{
            marginLeft: 'auto',
          }}>
          Já possui uma conta? Fazer login
        </Link>
      </Box>
    </div>
  )
}

export default Home
