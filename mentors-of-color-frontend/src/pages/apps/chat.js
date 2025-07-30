import { useEffect, useRef, useState } from "react";

// material-ui
import { useTheme, styled } from "@mui/material/styles";
import {
  Box,
  ClickAwayListener,
  Collapse,
  Dialog,
  Grid,
  Menu,
  MenuItem,
  Popper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";

// third party
import EmojiPicker, { SkinTones } from "emoji-picker-react";

// project import
import ChatHeader from "sections/apps/chat/ChatHeader";
import ChatDrawer from "sections/apps/chat/ChatDrawer";
import ChatHistory from "sections/apps/chat/ChatHistory";
import UserDetails from "sections/apps/chat/UserDetails";

import MainCard from "components/MainCard";
import IconButton from "components/@extended/IconButton";
import SimpleBar from "components/third-party/SimpleBar";
import { PopupTransition } from "components/@extended/Transitions";
import CircularWithPath from "components/@extended/progress/CircularWithPath";

import { ThemeMode } from "config";

import { openSnackbar } from "api/snackbar";
import { insertChat, useGetUsers, useGetUsersBE } from "api/chat";
import incrementer from "utils/incrementer";

// assets
import {
  AudioMutedOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  PaperClipOutlined,
  PhoneOutlined,
  PictureOutlined,
  SendOutlined,
  SmileOutlined,
  SoundOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import useAuth from "hooks/useAuth";

const drawerWidth = 320;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
    marginLeft: `-${drawerWidth}px`,
    [theme.breakpoints.down("lg")]: {
      paddingLeft: 0,
      marginLeft: 0,
    },
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.shorter,
      }),
      marginLeft: 0,
    }),
  })
);

// ==============================|| APPLICATION - CHAT ||============================== //

const Chat = () => {
  const theme = useTheme();
  const {
    user: { associated_user_id: programUserID },
    user: loggedInUser,
  } = useAuth();

  const { usersLoading1, users1 } = useGetUsers();
  // const { userLoading1, users } = useGetUsersBE(programUserID)
  const [users, setUsers] = useState([]);

  const matchDownSM = useMediaQuery(theme.breakpoints.down("lg"));
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));
  const [emailDetails, setEmailDetails] = useState(false);
  const [user, setUser] = useState({});
  const [user1, setUser1] = useState({});
  const [mySocket, setMySocket] = useState(null);

  const [chat, setChat] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {

    console.log('user', loggedInUser)
    if (!programUserID) return;

    if (!mySocket) {
      setUsers([]);
      setChat([])
      setUser1({})
      setUser({})

      const ws = new WebSocket(
        `${process.env.REACT_APP_WS_URL}/ws/users/${programUserID}/chat/`
      );
      ws.onopen = () => {
        setMySocket(ws);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "chat_list") {
          console.log(data?.chat_list);
          setUsers(data?.chat_list);
        } else if (data.type === "chat_message") {
          setChat((prevChat) => [...prevChat, data]);
        } else if (data.type === "chat_history") {
          setChat(data.messages);
        }
      };
    }

    return () => {
      mySocket?.close();
    };
  }, [programUserID, loggedInUser?.accountId]);

  useEffect(() => {
    if (users1?.length) {
      const newUser = users1[0];
      setUser(newUser);
    }

    // eslint-disable-next-line
  }, [users1]);

  useEffect(() => {
    if (users?.length) {
      const newUser = users[0];
      setUser1(newUser);
    }

    // eslint-disable-next-line
  }, [users]);

  const handleClickSort = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleCloseSort = () => {
    setAnchorEl(null);
  };

  const handleUserChange = () => {
    setEmailDetails((prev) => !prev);
  };

  const [openChatDrawer, setOpenChatDrawer] = useState(false);
  const handleDrawerOpen = () => {
    setOpenChatDrawer((prevState) => !prevState);
  };

  const [anchorElEmoji, setAnchorElEmoji] =
    useState(); /** No single type can cater for all elements */

  const handleOnEmojiButtonClick = (event) => {
    setAnchorElEmoji(anchorElEmoji ? null : event?.currentTarget);
  };

  // handle new message form
  const [message, setMessage] = useState("");
  const textInput = useRef(null);

  const handleOnSend = () => {
    if (message.trim() === "") {
      openSnackbar({
        open: true,
        message: "Message required",
        variant: "alert",
        alert: {
          color: "error",
        },
      });
    } else {
      const d = new Date();
      const socketMessage = {
        type: "send_message",
        message: message,
        user_id: loggedInUser?.associated_user_id,
        room_id: user1?.roomId,
        timestamp: d.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      };
      mySocket.send(JSON.stringify(socketMessage));
    }
    setMessage("");
  };

  const handleEnter = (event) => {
    if (event?.key !== "Enter") {
      return;
    }
    handleOnSend();
  };

  // handle emoji
  const onEmojiClick = (emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  const emojiOpen = Boolean(anchorElEmoji);
  const emojiId = emojiOpen ? "simple-popper" : undefined;

  const handleCloseEmoji = () => {
    setAnchorElEmoji(null);
  };

  // close sidebar when widow size below 'md' breakpoint
  useEffect(() => {
    setOpenChatDrawer(!matchDownSM);
  }, [matchDownSM]);

  return (
    <Box key={`${programUserID}-${loggedInUser?.accountId}`} sx={{ display: "flex" }}>
      <ChatDrawer
        key={users.length}
        openChatDrawer={openChatDrawer}
        handleDrawerOpen={handleDrawerOpen}
        setUser={setUser1}
        selectedUser={Object.keys(user1).length === 0 ? null : user1.roomId}
        users={users}
        //add here roomId
      />
      <Main theme={theme} open={openChatDrawer}>
        <Grid container>
          <Grid
            item
            xs={12}
            md={emailDetails ? 8 : 12}
            xl={emailDetails ? 9 : 12}
            sx={{
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.shorter + 200,
              }),
            }}
          >
            <MainCard
              content={false}
              sx={{
                bgcolor:
                  theme.palette.mode === ThemeMode.DARK
                    ? "dark.main"
                    : "grey.50",
                pt: 2,
                pl: 2,
                borderRadius: emailDetails ? "0" : "0 4px 4px 0",
                transition: theme.transitions.create("width", {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.shorter + 200,
                }),
              }}
            >
              <Grid container spacing={3}>
                <Grid
                  item
                  xs={12}
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    pr: 2,
                    pb: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Grid container justifyContent="space-between" spacing={1.5}>
                    <Grid item>
                      <ChatHeader
                        loading={usersLoading1}
                        user={user1}
                        openChatDrawer={openChatDrawer}
                        handleDrawerOpen={handleDrawerOpen}
                      />
                    </Grid>
                    <Grid item>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        spacing={1}
                      >
                        <IconButton size="large" color="secondary">
                          <PhoneOutlined />
                        </IconButton>
                        <IconButton size="large" color="secondary">
                          <VideoCameraOutlined />
                        </IconButton>
                        {/* <IconButton onClick={handleUserChange} size="large" color={emailDetails ? 'error' : 'secondary'}>
                          {emailDetails ? <CloseOutlined /> : <InfoCircleOutlined />}
                        </IconButton> */}
                        <IconButton
                          onClick={handleClickSort}
                          size="large"
                          color="secondary"
                        >
                          <MoreOutlined />
                        </IconButton>
                        <Menu
                          id="simple-menu"
                          anchorEl={anchorEl}
                          keepMounted
                          open={Boolean(anchorEl)}
                          onClose={handleCloseSort}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          sx={{
                            p: 0,
                            "& .MuiMenu-list": {
                              p: 0,
                            },
                          }}
                        >
                          <MenuItem onClick={handleCloseSort}>
                            <DownloadOutlined style={{ paddingRight: 8 }} />
                            <Typography>Archive</Typography>
                          </MenuItem>
                          <MenuItem onClick={handleCloseSort}>
                            <AudioMutedOutlined style={{ paddingRight: 8 }} />
                            <Typography>Muted</Typography>
                          </MenuItem>
                          <MenuItem onClick={handleCloseSort}>
                            <DeleteOutlined style={{ paddingRight: 8 }} />
                            <Typography>Delete</Typography>
                          </MenuItem>
                        </Menu>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <SimpleBar
                    sx={{
                      overflowX: "hidden",
                      height: "calc(100vh - 410px)",
                      minHeight: 420,
                      "& .simplebar-content": {
                        height: "100%",
                      },
                    }}
                  >
                    <Box sx={{ pl: 1, pr: 3, height: "100%" }}>
                      {!mySocket || Object.keys(user1).length === 0 ? (
                        <Stack
                          alignItems="center"
                          justifyContent="center"
                          sx={{ height: "100%" }}
                        >
                          <div>No chats available!</div>
                        </Stack>
                      ) : (
                        <ChatHistory
                          theme={theme}
                          user={user1}
                          mySocket={mySocket}
                          chat={chat}
                          setChat={setChat}
                        />
                      )}
                    </Box>
                  </SimpleBar>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    mt: 3,
                    bgcolor: theme.palette.background.paper,
                    borderTop: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Stack>
                    <TextField
                      inputRef={textInput}
                      fullWidth
                      multiline
                      rows={3}
                      disabled={loggedInUser && loggedInUser.user_type === 'moderator'}
                      placeholder="Your Message..."
                      value={message}
                      onChange={(e) =>
                        setMessage(
                          e.target.value.length <= 1
                            ? e.target.value.trim()
                            : e.target.value
                        )
                      }
                      onKeyDown={handleEnter}
                      variant="standard"
                      sx={{
                        pr: 2,
                        "& .MuiInput-root:before": {
                          borderBottomColor: theme.palette.divider,
                        },
                      }}
                    />
                    {loggedInUser && loggedInUser.user_type === 'moderator' ? <></> : (<Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack direction="row" sx={{ py: 2, ml: -1 }}>
                        <>
                          <IconButton
                            ref={anchorElEmoji}
                            aria-describedby={emojiId}
                            onClick={handleOnEmojiButtonClick}
                            sx={{ opacity: 0.5 }}
                            size="medium"
                            color="secondary"
                          >
                            <SmileOutlined />
                          </IconButton>
                          <Popper
                            id={emojiId}
                            open={emojiOpen}
                            anchorEl={anchorElEmoji}
                            disablePortal
                            style={{ zIndex: 1200 }}
                            popperOptions={{
                              modifiers: [
                                {
                                  name: "offset",
                                  options: {
                                    offset: [-20, 125],
                                  },
                                },
                              ],
                            }}
                          >
                            <ClickAwayListener onClickAway={handleCloseEmoji}>
                              <MainCard elevation={8} content={false}>
                                <EmojiPicker
                                  onEmojiClick={onEmojiClick}
                                  defaultSkinTone={SkinTones.DARK}
                                  autoFocusSearch={false}
                                />
                              </MainCard>
                            </ClickAwayListener>
                          </Popper>
                        </>
                        <IconButton
                          sx={{ opacity: 0.5 }}
                          size="medium"
                          color="secondary"
                        >
                          <PaperClipOutlined />
                        </IconButton>
                        <IconButton
                          sx={{ opacity: 0.5 }}
                          size="medium"
                          color="secondary"
                        >
                          <PictureOutlined />
                        </IconButton>
                        <IconButton
                          sx={{ opacity: 0.5 }}
                          size="medium"
                          color="secondary"
                        >
                          <SoundOutlined />
                        </IconButton>
                      </Stack>
                      <IconButton
                        color="primary"
                        onClick={handleOnSend}
                        size="large"
                        sx={{ mr: 1.5 }}
                      >
                        <SendOutlined />
                      </IconButton>
                      </Stack>)}
                    </Stack>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            xl={3}
            sx={{ overflow: "hidden", display: emailDetails ? "flex" : "none" }}
          >
            <Collapse
              orientation="horizontal"
              in={emailDetails && !matchDownMD}
            >
              <UserDetails user={user} onClose={handleUserChange} />
            </Collapse>
          </Grid>
          <Dialog
            TransitionComponent={PopupTransition}
            onClose={handleUserChange}
            open={matchDownMD && emailDetails}
            scroll="body"
          >
            <UserDetails user={user} onClose={handleUserChange} />
          </Dialog>
        </Grid>
      </Main>
    </Box>
  );
};

export default Chat;
