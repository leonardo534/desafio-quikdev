import { Avatar, Box, Button, Divider, Drawer, Fab, FormControl, Input, InputAdornment, InputLabel, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { fakerApi } from "../../services/fakeApi";
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import ModalCadastro from "../../components/ModalCadastro";
import React from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function Dashboard() {
  const [open, setOpen] = React.useState(false);
  const [posts, setPosts] = React.useState([]);
  const [selectedPost, setSelectedPost] = React.useState('');
  const [comments, setComments] = React.useState('');
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMore = Boolean(anchorEl);

  const handleFetchPost = async () => {
    fakerApi.get("/posts", {}).then((res: any) => setPosts(res.data));
  }

  const handleClickMore = (event: React.MouseEvent<HTMLButtonElement>, postId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(postId);
  };

  const handleClickEdit = () => {
    handleOpen();
    handleCloseMore();
  }

  const handleClose = () => {
    setOpen(false);
    handleFetchPost();
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClickFab = () => {
    setSelectedPost('');
    handleOpen();
  }

  const handleDelete = () => {
    handleCloseMore();
    fakerApi.delete("/posts/remove", { post_id: selectedPost }).then(() => {
      setSelectedPost('');
      handleFetchPost();
    });
  }

  const handleSetComments = (value: string) => {
    setComments(value);
  }

  const handleSaveComment = (postId: string) => {
    try {
      fakerApi.post("/comments/create", { post_id: postId, comment: { comments: comments } });
    } catch (e: any) {
      console.log(e.message)
    }
  }

  const autenticate = async () => {
    fakerApi.get("/me", {}).catch((e) => router.push("/login"));
  }

  const handleLogout = async () => {
    fakerApi.get("/logout", {}).then(() => router.push("/login"));
  }

  const handleCloseMore = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    autenticate();
    handleFetchPost();
  }, []);

  return (
    <>
      <Box //Container
        sx={{
          display: "flex",
        }}
      >
        <Drawer //Sidebar
          sx={{
            width: "200px",
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: "200px",
              boxSizing: 'border-box',
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#e8e8e89e",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
            <picture
              style={{
                display: "flex",
                justifyContent: "center"
              }}>
              <img
                style={{
                  borderRadius: "50%"
                }}
                src="https://source.unsplash.com/featured/150x150" alt="" />
            </picture>
            <Divider sx={{
              width: "100%",
              margin: "10px 0"
            }} />
            <span>Leonardo</span>
          </Box>
          <Avatar>
            <LogoutIcon sx={{ marginBottom: '0px' }} />
            <Button style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
              onClick={handleLogout}
            ></Button>
          </Avatar>
        </Drawer>

        <Tooltip title="Adicionar post">
          <Fab
            sx=
            {{
              position: "fixed",
              bottom: "1rem",
              right: '1rem',
              width: '4rem',
              height: "4rem",
              borderRadius: "50%",
              background: "gray",
              boxShadow: "0px 5px 20px #8893aa",
              transition: "all 0.3s ease",
              zIndex: 1,
            }}
            onClick={handleClickFab}
            color="secondary" aria-label="add">
            <AddIcon />
          </Fab>
        </Tooltip>
        <ModalCadastro selectedPost={selectedPost} open={open} handleClose={handleClose} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            padding: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            fontFamily: "'Roboto','Helvetica Neue', Helvetica, Arial, sans-serif",
          }}>
          {posts.map((post: any, index: number) => (
            <Box
              key={`${post.title}_${index}`}
              sx={{
                height: "400px",
                width: "550px",
                padding: "20px",
                borderRadius: "0.25rem",
                boxShadow: "0px 0px 40px -10px rgba(0,0,0,0.25)",
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                overflow: "hidden",
                justifyContent: "space-between"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  width: "100%"
                }}>
                <Typography
                  sx={{
                    fontSize: "1.25rem",
                    fontWeight: "300",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#444444",
                  }}>{post.title}</Typography>
                <Avatar>
                  <MoreVertIcon sx={{ marginBottom: '0px' }} id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined} />
                  <button style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                    onClick={(e) => handleClickMore(e, post.id)}
                  ></button>
                </Avatar>
                <Divider
                  sx={{
                    width: "100%"
                  }} />
                <Typography
                  sx={{
                    color: "#696969",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                    marginBottom: "1.25rem",
                  }}>{post.content}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  width: "100%"
                }}>
                <List //Comentario
                  sx={{
                    width: '100%',
                    maxWidth: "none",
                    bgcolor: 'background.paper',
                    borderRadius: "0.25rem",
                    border: "1px solid rgba(0, 0, 0, 0.6)"
                  }}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt="Anonimo" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Anonimo"
                      secondary={
                        <React.Fragment>
                          {"Nossa que post legal !"}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </List>
                <TextField onChange={(e) => handleSetComments(e.target.value)} id="filled-basic" label="Deixe um comentário" variant="outlined" multiline maxRows={3} fullWidth />
                <Tooltip title="Adicionar comentário">
                  <Fab
                    sx=
                    {{
                      borderRadius: "50%",
                      background: "gray",
                      boxShadow: "0px 5px 20px #8893aa",
                      transition: "all 0.3s ease",
                      zIndex: 1,
                    }}
                    onClick={() => handleSaveComment(post.id)}
                    color="secondary" aria-label="add">
                    <AddIcon />
                  </Fab>
                </Tooltip>
              </Box>
            </Box>
          ))}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMore}
            onClose={handleCloseMore}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleClickEdit} >Editar</MenuItem>
            <MenuItem onClick={handleDelete}>Excluir</MenuItem>
          </Menu>
        </Box>
      </Box>
    </>
  );
}