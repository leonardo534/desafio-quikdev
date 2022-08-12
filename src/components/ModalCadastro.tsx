import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Alert, Divider, Snackbar, TextField } from '@mui/material';
import { fakerApi } from '../services/fakeApi';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "50vw",
  bgcolor: 'background.paper',
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  minHeight: "50vh",
  justifyContent: "space-between",
};
type ModalProps = {
  open: boolean,
  handleClose: () => void,
  selectedPost: string
}
export default function ModalCadastro({ open, handleClose, selectedPost }: ModalProps) {
  const [contents, setContents] = React.useState({ title: '', content: '' })
  const [error, setError] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handleChangeField = (text: string, value: string) => {
    setContents({
      ...contents,
      [text]: value,
    })
  }

  const handleSave = () => {
    try {
      if(selectedPost){
        fakerApi.put("/posts/update",{post_id : selectedPost, post : {...contents}});
        setMessage('Post atualizado');
      }else{
        fakerApi.post("/posts/create", contents);
        setMessage('Post criado');
      }
      setContents({title: '', content: ''});
      handleClose();
    } catch (e: any) {
      setMessage('Error ao criar post')
      setError(true);
    }
  }

  React.useEffect(() => {
    if(!selectedPost) return;
    fakerApi.get("/posts/view",{post_id: selectedPost}).then((res : any)=>setContents({title: res.data.title, content: res.data.content}));
  },[selectedPost]);

  React.useEffect(()=>{
    if(open && selectedPost) return; 
    setContents({title: '', content: ''})
  },[open, selectedPost]);
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {selectedPost ? "Atualizar post" : "Cadastrar post"}
          </Typography>
          <Divider />
          <TextField onChange={(e) => handleChangeField("title", e.target.value)} value={contents.title} id="filled-basic" label="Título" variant="outlined" fullWidth />
          <TextField onChange={(e) => handleChangeField("content", e.target.value)} value={contents.content} id="filled-basic" label="Texto" variant="outlined" multiline rows={3} maxRows={7} fullWidth />
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              gap: "10px"
            }}>
            <Button onClick={handleClose} variant="outlined">Cancelar</Button>
            <Button onClick={handleSave} variant="contained">Salvar</Button>
          </Box>

        </Box>
      </Modal>
      <Snackbar open={Boolean(message)} autoHideDuration={3000} onClose={() => setMessage('')}>
        <Alert onClose={() => setMessage('')} severity={error ? "error" : "success"} sx={{ width: '100%' }}>{message}</Alert>
      </Snackbar>
    </>
  );
}
